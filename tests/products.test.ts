import { describe, expect, it } from "vitest";
import { crew, crewLanguageClaim, crewLanguageLine } from "@/content/crew";
import { dayPlans } from "@/content/dayPlans";
import { generalFaqs } from "@/content/faqs";
import { dayProduct } from "@/content/pricing";
import { getService, listedServices, services } from "@/content/services";
import { site } from "@/content/site";
import { planMinutes, planTimeline } from "@/lib/dayPlans";
import { buildLlmsTxt } from "@/lib/llms";
import { productFaqs } from "@/lib/productFaqs";

// 좁혀서 여는 두 상품의 문구가 가격 자료(pricing.ts)와 어긋나지 않는지 확인한다.

describe("the two products", () => {
  it("lists only private-driver and driver-guide", () => {
    expect(listedServices.map((s) => s.id)).toEqual(["private-driver", "driver-guide"]);
    expect(getService("guide-tour").listed).toBe(false);
    expect(services).toHaveLength(3);
  });

  it("uses the same hours and passenger limit in every answer as the price data", () => {
    for (const s of listedServices) {
      expect(s.answer, s.id).toContain(`${dayProduct.hours}-hour`);
      expect(s.answer, s.id).toContain(`up to ${dayProduct.maxPassengers} passengers`);
      expect(s.answer, s.id).toContain(dayProduct.vehicle);
    }
    expect(site.description).toContain(`${dayProduct.hours}-hour`);
    expect(site.description).toContain(`up to ${dayProduct.maxPassengers} passengers`);
    expect(generalFaqs.some((f) => f.a.includes(`up to ${dayProduct.maxPassengers} passengers`))).toBe(true);
  });

  it("no longer advertises vans we do not run", () => {
    const text = JSON.stringify([listedServices, generalFaqs, site.description, site.tagline]);
    expect(text).not.toMatch(/Solati|minibus|11-seat|9-seat|9 or 11/i);
  });

  it("keeps the driver-is-not-a-guide rule on the driver-only product", () => {
    const driver = getService("private-driver");
    expect(driver.answer).toContain("not a tour guide");
    expect(driver.excludes.join(" ")).toContain("not a tour guide");
  });

  it("builds price FAQs from the price data without a draft number", () => {
    for (const s of listedServices) {
      const faqs = productFaqs(s.id as "private-driver" | "driver-guide");
      expect(faqs).toHaveLength(2);
      const text = faqs.map((f) => f.a).join(" ");
      expect(text).toContain(`${dayProduct.hours} hours`);
      // 2026-11-16부터 네 칸 모두 확정값이라 확정값만 나온다(초안 숫자 230,000은 나오지 않는다).
      expect(text).not.toMatch(/230,?000/);
    }
  });
});

describe("crew section", () => {
  it("stays hidden until real crew details are added", () => {
    // 자료가 들어오면 이 시험의 기대값을 실제 인원 수로 바꾼다. 지어낸 이름·사진을 넣지 않는다.
    expect(crew).toEqual([]);
  });

  it("keeps the English and Tagalog line off until the owner confirms the licence language", () => {
    expect(crewLanguageClaim.text).toContain("Tagalog");
    if (!crewLanguageClaim.enabled) {
      expect(crewLanguageLine()).toBeNull();
      // 끝의 "Other languages"(사이트 번역판 목록 — 따갈로그판 쪽 포함)는 가이드 언어 주장이 아니라서 빼고 본다.
      // 2026-11-16 사장님 확정: 「기사」는 요청 시 따갈로그 가능(가이드 자격 언어와는 다른 주장이라 빼고 본다).
      const strip = (s: string) => s.replace(/Tagalog-speaking driver/g, "");
      const [facts] = buildLlmsTxt().split("## Other languages");
      expect(strip(facts!)).not.toContain("Tagalog");
      expect(strip(JSON.stringify([listedServices, generalFaqs, site.guideLanguages]))).not.toContain("Tagalog");
    }
  });

  it("every crew member has a name, a role and at least one language", () => {
    for (const member of crew) {
      expect(member.name.trim().length).toBeGreaterThan(0);
      expect(member.role.trim().length).toBeGreaterThan(0);
      expect(member.languages.length).toBeGreaterThan(0);
    }
  });
});

describe("10-hour day examples", () => {
  it("has two Seoul days and two Gyeonggi days", () => {
    expect(dayPlans.filter((p) => p.region === "seoul")).toHaveLength(2);
    expect(dayPlans.filter((p) => p.region === "gyeonggi")).toHaveLength(2);
    expect(new Set(dayPlans.map((p) => p.slug)).size).toBe(dayPlans.length);
  });

  it("each day adds up to exactly the product hours", () => {
    for (const plan of dayPlans) expect(planMinutes(plan), plan.slug).toBe(dayProduct.hours * 60);
  });

  it("starts with a pick-up, ends with a drop-off and never stacks two drives", () => {
    for (const plan of dayPlans) {
      expect(plan.stops[0]?.kind, plan.slug).toBe("pickup");
      expect(plan.stops.at(-1)?.kind, plan.slug).toBe("dropoff");
      plan.stops.forEach((stop, i) => {
        if (stop.kind === "drive") expect(plan.stops[i + 1]?.kind, `${plan.slug} stop ${i}`).not.toBe("drive");
        if (stop.kind !== "pickup" && stop.kind !== "dropoff") expect(stop.minutes, `${plan.slug} ${stop.title}`).toBeGreaterThan(0);
      });
    }
  });

  it("gives Gyeonggi days a realistic drive out of and back into Seoul", () => {
    for (const plan of dayPlans.filter((p) => p.region === "gyeonggi")) {
      const drives = plan.stops.filter((s) => s.kind === "drive");
      expect(drives[0]!.minutes, plan.slug).toBeGreaterThanOrEqual(60);
      expect(drives.at(-1)!.minutes, plan.slug).toBeGreaterThanOrEqual(90);
    }
  });

  it("keeps clock times in order through the day", () => {
    for (const plan of dayPlans) {
      const times = planTimeline(plan).map((s) => s.at);
      expect([...times].sort(), plan.slug).toEqual(times);
    }
  });

  it("does not state ticket prices", () => {
    expect(JSON.stringify(dayPlans)).not.toMatch(/₩|KRW|\bwon\b/i);
  });
});

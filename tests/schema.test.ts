import { site } from "@/content/site";
import { describe, expect, it } from "vitest";
import { dayPlans } from "@/content/dayPlans";
import { dayRates, priceRules } from "@/content/pricing";
import { getService } from "@/content/services";
import { dayPlanListLd, faqLd, organizationLd, serializeLd, serviceLd } from "@/lib/schema";

describe("structured data", () => {
  it("puts in only the company fields that are known", () => {
    // 2026-11-17 회사 이메일·주소를 채웠다(src/content/site.ts). 비어 있는 칸(sameAs 등)은 넣지 않는다.
    const org = organizationLd();
    expect(org["@type"]).toBe("TravelAgency");
    if (site.email) expect(org.email).toBe(site.email);
    else expect(org).not.toHaveProperty("email");
    if (site.address) expect(org).toHaveProperty("address");
    else expect(org).not.toHaveProperty("address");
    if (site.sameAs.length === 0) expect(org).not.toHaveProperty("sameAs");
  });

  it("puts no Offer on the two products while no cell is confirmed", () => {
    const unconfirmed = dayRates.map((r) => ({ ...r, status: "draft" as const }));
    expect(serviceLd(getService("private-driver"), { dayRates: unconfirmed })).not.toHaveProperty("offers");
    expect(serviceLd(getService("driver-guide"), { dayRates: unconfirmed })).not.toHaveProperty("offers");
    expect(JSON.stringify(serviceLd(getService("driver-guide"), { dayRates: unconfirmed }))).not.toMatch(/430000|480000/);
  });

  it("adds an Offer only for a confirmed cell", () => {
    const rates = dayRates.map((r) =>
      r.service === "driver-guide" && r.region === "gyeonggi"
        ? { ...r, priceKrw: 111000, status: "confirmed" as const }
        : { ...r, status: "draft" as const },
    );
    const ld = serviceLd(getService("driver-guide"), { dayRates: rates }) as { offers?: { name: string; price: number; priceCurrency: string }[] };
    expect(ld.offers).toHaveLength(1);
    expect(ld.offers?.[0]?.price).toBe(111000);
    expect(ld.offers?.[0]?.priceCurrency).toBe("KRW");
    expect(ld.offers?.[0]?.name).toContain("Gyeonggi");
  });

  it("puts the owner's confirmed prices on both products (2026-11-16)", () => {
    const ld = serviceLd(getService("driver-guide")) as { offers?: { price: number }[] };
    expect(ld.offers?.map((o) => o.price)).toEqual([430000, 480000]);
  });

  it("never puts draft or on-request prices into offers for other services", () => {
    const rules = [
      ...priceRules,
      { ...priceRules.find((r) => r.status === "draft")!, label: "Confirmed test", priceKrw: 111000, status: "confirmed" as const },
    ];
    const ld = serviceLd(getService("guide-tour"), { rules }) as { offers?: { name: string }[] };
    expect(ld.offers?.map((o) => o.name)).toEqual(["Confirmed test"]);
    expect(serviceLd(getService("guide-tour"))).not.toHaveProperty("offers");
  });

  it("returns null for an empty FAQ list", () => {
    expect(faqLd([])).toBeNull();
  });

  it("lists the day plans with positions and anchors", () => {
    const ld = dayPlanListLd(dayPlans, "/day-plans") as { itemListElement: { position: number; url: string }[] };
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2, 3, 4]);
    for (const item of ld.itemListElement) expect(item.url).toMatch(/\/day-plans#[a-z0-9-]+$/);
  });

  it("escapes < so JSON-LD cannot close the script tag", () => {
    expect(serializeLd({ name: "</script><b>" })).not.toContain("<");
  });
});

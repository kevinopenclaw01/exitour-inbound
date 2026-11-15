import { describe, expect, it } from "vitest";
import { dayPlans } from "@/content/dayPlans";
import { dayRates, priceRules } from "@/content/pricing";
import { getService } from "@/content/services";
import { dayPlanListLd, faqLd, organizationLd, serializeLd, serviceLd } from "@/lib/schema";

describe("structured data", () => {
  it("leaves out unknown company fields", () => {
    const org = organizationLd();
    expect(org["@type"]).toBe("TravelAgency");
    expect(org).not.toHaveProperty("email");
    expect(org).not.toHaveProperty("address");
    expect(org).not.toHaveProperty("sameAs");
  });

  it("puts no Offer on the two products while no cell is confirmed", () => {
    expect(serviceLd(getService("private-driver"))).not.toHaveProperty("offers");
    expect(serviceLd(getService("driver-guide"))).not.toHaveProperty("offers");
    expect(JSON.stringify(serviceLd(getService("driver-guide")))).not.toMatch(/480000|540000/);
  });

  it("adds an Offer only for a confirmed cell", () => {
    const rates = dayRates.map((r) =>
      r.service === "driver-guide" && r.region === "gyeonggi" ? { ...r, priceKrw: 111000, status: "confirmed" as const } : r,
    );
    const ld = serviceLd(getService("driver-guide"), { dayRates: rates }) as { offers?: { name: string; price: number; priceCurrency: string }[] };
    expect(ld.offers).toHaveLength(1);
    expect(ld.offers?.[0]?.price).toBe(111000);
    expect(ld.offers?.[0]?.priceCurrency).toBe("KRW");
    expect(ld.offers?.[0]?.name).toContain("Gyeonggi");
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

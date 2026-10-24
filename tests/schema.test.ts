import { describe, expect, it } from "vitest";
import { getService } from "@/content/services";
import { priceRules } from "@/content/pricing";
import { faqLd, organizationLd, serializeLd, serviceLd } from "@/lib/schema";

describe("structured data", () => {
  it("leaves out unknown company fields", () => {
    const org = organizationLd();
    expect(org["@type"]).toBe("TravelAgency");
    expect(org).not.toHaveProperty("email");
    expect(org).not.toHaveProperty("address");
    expect(org).not.toHaveProperty("sameAs");
  });

  it("never puts draft or on-request prices into offers", () => {
    const rules = [
      ...priceRules,
      { ...priceRules.find((r) => r.status === "draft")!, label: "Confirmed test", priceKrw: 111000, status: "confirmed" as const },
    ];
    const ld = serviceLd(getService("driver-guide"), rules) as { offers?: { name: string; price: number }[] };
    expect(ld.offers?.map((o) => o.name)).toEqual(["Confirmed test"]);
    expect(serviceLd(getService("private-driver"), priceRules)).not.toHaveProperty("offers");
  });

  it("returns null for an empty FAQ list", () => {
    expect(faqLd([])).toBeNull();
  });

  it("escapes < so JSON-LD cannot close the script tag", () => {
    expect(serializeLd({ name: "</script><b>" })).not.toContain("<");
  });
});

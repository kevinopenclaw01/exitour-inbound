import { describe, expect, it } from "vitest";
import { dayRates } from "@/content/pricing";
import type { DayRate, PriceRule } from "@/content/types";
import {
  dayPriceText,
  dayRate,
  dayRateSentence,
  dayTerms,
  estimate,
  findRule,
  formatKrw,
  joinList,
  priceText,
  publishableDayRates,
  publishableRates,
  quoteText,
} from "@/lib/pricing";

const rules: PriceRule[] = [
  { service: "driver-guide", region: "seoul", vehicles: ["staria-9"], unit: "day", label: "Seoul", priceKrw: 480000, status: "draft" },
  { service: "driver-guide", region: "any", vehicles: ["staria-9"], unit: "day", label: "Any", priceKrw: 600000, status: "confirmed" },
  { service: "guide-tour", region: "any", vehicles: [], unit: "day", label: "Guide", priceKrw: 230000, status: "confirmed" },
  { service: "private-driver", region: "seoul", vehicles: ["staria-9"], unit: "day", label: "Driver", priceKrw: null, status: "on-request" },
];

describe("findRule", () => {
  it("prefers the region-specific rule", () => {
    expect(findRule("driver-guide", "seoul", "staria-9", "day", rules)?.label).toBe("Seoul");
  });
  it("falls back to the 'any' region rule", () => {
    expect(findRule("driver-guide", "gyeonggi", "staria-9", "day", rules)?.label).toBe("Any");
  });
  it("matches guide-only rules when no vehicle is chosen", () => {
    expect(findRule("guide-tour", "seoul", null, "day", rules)?.label).toBe("Guide");
  });
  it("returns undefined when the vehicle is not offered", () => {
    expect(findRule("driver-guide", "seoul", "solati", "day", rules)).toBeUndefined();
  });
});

describe("estimate", () => {
  it("multiplies days and rounds per-person to the nearest 1,000 won", () => {
    const e = estimate({ service: "driver-guide", region: "gyeonggi", vehicle: "staria-9", days: 2, pax: 3, rules });
    expect(e?.totalKrw).toBe(1200000);
    expect(e?.perPersonKrw).toBe(400000);
  });
  it("returns null amounts for quote-on-request and draft rules", () => {
    const onRequest = estimate({ service: "private-driver", region: "seoul", vehicle: "staria-9", days: 1, pax: 2, rules });
    expect(onRequest?.totalKrw).toBeNull();
    expect(onRequest?.perPersonKrw).toBeNull();
    const draft = estimate({ service: "driver-guide", region: "seoul", vehicle: "staria-9", days: 1, pax: 2, rules });
    expect(draft?.totalKrw).toBeNull();
  });
  it("rejects invalid days and group size", () => {
    expect(() => estimate({ service: "guide-tour", region: "seoul", vehicle: null, days: 0, pax: 2, rules })).toThrow();
    expect(() => estimate({ service: "guide-tour", region: "seoul", vehicle: null, days: 1, pax: 1.5, rules })).toThrow();
  });
});

describe("display and publishing (other rules)", () => {
  it("formats won", () => {
    expect(formatKrw(480000)).toBe("₩480,000");
  });
  it("never shows a draft number", () => {
    expect(priceText(rules[0]!)).toBe("Quote on request");
    expect(priceText(rules[1]!)).toBe("₩600,000");
    expect(priceText(rules[3]!)).toBe("Quote on request");
  });
  it("publishes only confirmed rates to structured data", () => {
    expect(publishableRates("driver-guide", rules).map((r) => r.label)).toEqual(["Any"]);
  });
});

// ── 네 칸 표 ──────────────────────────────────────────────────────────

const cell = (over: Partial<DayRate>): DayRate => ({
  service: "driver-guide",
  region: "seoul",
  priceKrw: null,
  status: "on-request",
  items: { fuel: true, tolls: true, parking: true, "crew-meal": null, "entrance-tickets": null },
  extraHourKrw: null,
  noLateFinishLimit: true,
  ...over,
});

describe("four-cell table", () => {
  it("has exactly one cell for each product and area", () => {
    expect(dayRates).toHaveLength(4);
    for (const service of ["private-driver", "driver-guide"] as const) {
      for (const region of ["seoul", "gyeonggi"] as const) {
        expect(dayRates.filter((r) => r.service === service && r.region === region)).toHaveLength(1);
        expect(dayRate(service, region).region).toBe(region);
      }
    }
  });

  it("shows a number only when the cell is confirmed", () => {
    expect(dayPriceText(cell({ priceKrw: 480000, status: "draft" }), null)).toBe("Written quote for your date");
    expect(dayPriceText(cell({ priceKrw: null, status: "on-request" }), null)).toBe("Written quote for your date");
    expect(dayPriceText(cell({ priceKrw: null, status: "confirmed" }), null)).toBe("Written quote for your date");
    expect(dayPriceText(cell({ priceKrw: 480000, status: "confirmed" }), null)).toBe("₩480,000");
  });

  it("adds the promised reply time to the quote wording when it is set", () => {
    expect(quoteText(null)).toBe("Written quote for your date");
    expect(quoteText("24 hours")).toBe("Written quote within 24 hours");
  });

  it("splits items into included, not included and stated in the quote", () => {
    const terms = dayTerms(cell({ items: { fuel: true, tolls: true, parking: false, "crew-meal": null, "entrance-tickets": false } }));
    expect(terms.included).toEqual(["Fuel", "Expressway tolls"]);
    expect(terms.notIncluded).toEqual(["Parking", "Entrance tickets"]);
    expect(terms.inQuote).toEqual(["Driver-guide's meal", "Extra hours beyond 10"]);
  });

  it("writes a cell as one sentence without leaking a draft number", () => {
    const sentence = dayRateSentence(cell({ priceKrw: 480000, status: "draft" }));
    expect(sentence).toContain("Seoul: written quote for your date.");
    expect(sentence).toContain("Included: fuel, expressway tolls and parking.");
    expect(sentence).toContain("No limit on how late the day can finish.");
    expect(sentence).not.toContain("480");
  });

  it("publishes only confirmed cells to structured data", () => {
    const cells = [cell({ priceKrw: 480000, status: "draft" }), cell({ region: "gyeonggi", priceKrw: 500000, status: "confirmed" })];
    expect(publishableDayRates("driver-guide", cells).map((r) => r.region)).toEqual(["gyeonggi"]);
  });

  it("joins lists in plain English", () => {
    expect(joinList(["Fuel"])).toBe("Fuel");
    expect(joinList(["Fuel", "Parking"])).toBe("Fuel and parking");
    expect(joinList(["Fuel", "Expressway tolls", "Parking"])).toBe("Fuel, expressway tolls and parking");
  });
});

describe("the live table today", () => {
  it("states only what the owner has confirmed for Seoul", () => {
    for (const service of ["private-driver", "driver-guide"] as const) {
      const seoul = dayRate(service, "seoul");
      expect(seoul.items.fuel).toBe(true);
      expect(seoul.items.tolls).toBe(true);
      expect(seoul.items.parking).toBe(true);
      expect(seoul.noLateFinishLimit).toBe(true);
    }
  });
  it("does not show any price while no cell is confirmed", () => {
    for (const rate of dayRates) {
      if (rate.status !== "confirmed") expect(dayPriceText(rate)).not.toMatch(/₩|\d{3}/);
    }
  });
});

import { describe, expect, it } from "vitest";
import type { PriceRule } from "@/content/types";
import { estimate, findRule, formatKrw, priceText, publishableRates } from "@/lib/pricing";

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
    const e = estimate({ service: "driver-guide", region: "seoul", vehicle: "staria-9", days: 2, pax: 3, rules });
    expect(e?.totalKrw).toBe(960000);
    expect(e?.perPersonKrw).toBe(320000);
  });
  it("returns null amounts for quote-on-request rules", () => {
    const e = estimate({ service: "private-driver", region: "seoul", vehicle: "staria-9", days: 1, pax: 2, rules });
    expect(e?.totalKrw).toBeNull();
    expect(e?.perPersonKrw).toBeNull();
  });
  it("rejects invalid days and group size", () => {
    expect(() => estimate({ service: "guide-tour", region: "seoul", vehicle: null, days: 0, pax: 2, rules })).toThrow();
    expect(() => estimate({ service: "guide-tour", region: "seoul", vehicle: null, days: 1, pax: 1.5, rules })).toThrow();
  });
});

describe("display and publishing", () => {
  it("formats won", () => {
    expect(formatKrw(480000)).toBe("₩480,000");
  });
  it("labels draft rates and hides missing prices", () => {
    expect(priceText(rules[0]!)).toBe("₩480,000 (draft rate)");
    expect(priceText(rules[3]!)).toBe("Quote on request");
  });
  it("publishes only confirmed rates to structured data", () => {
    expect(publishableRates("driver-guide", rules).map((r) => r.label)).toEqual(["Any"]);
  });
});

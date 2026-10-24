import { priceRules } from "@/content/pricing";
import type { PriceRule, RegionId, ServiceId, VehicleId } from "@/content/types";

export function ratesFor(service: ServiceId, rules: PriceRule[] = priceRules): PriceRule[] {
  return rules.filter((r) => r.service === service);
}

/** 서비스·지역·차량에 맞는 하루 요금 규칙. 지역별 규칙이 없으면 "any" 규칙을 쓴다. */
export function findRule(
  service: ServiceId,
  region: RegionId,
  vehicle: VehicleId | null,
  unit: PriceRule["unit"] = "day",
  rules: PriceRule[] = priceRules,
): PriceRule | undefined {
  const candidates = rules.filter(
    (r) =>
      r.service === service &&
      r.unit === unit &&
      (vehicle === null ? r.vehicles.length === 0 : r.vehicles.includes(vehicle)),
  );
  return candidates.find((r) => r.region === region) ?? candidates.find((r) => r.region === "any");
}

export interface Estimate {
  rule: PriceRule;
  days: number;
  totalKrw: number | null;
  perPersonKrw: number | null;
}

/** 날짜 수 × 하루 요금. 요금이 없는(on-request) 규칙이면 금액은 null. */
export function estimate(input: {
  service: ServiceId;
  region: RegionId;
  vehicle: VehicleId | null;
  days: number;
  pax: number;
  rules?: PriceRule[];
}): Estimate | null {
  if (!Number.isInteger(input.days) || input.days < 1) throw new Error("days must be a positive integer");
  if (!Number.isInteger(input.pax) || input.pax < 1) throw new Error("pax must be a positive integer");
  const rule = findRule(input.service, input.region, input.vehicle, "day", input.rules);
  if (!rule) return null;
  if (rule.priceKrw === null) return { rule, days: input.days, totalKrw: null, perPersonKrw: null };
  const totalKrw = rule.priceKrw * input.days;
  return { rule, days: input.days, totalKrw, perPersonKrw: Math.round(totalKrw / input.pax / 1000) * 1000 };
}

export function formatKrw(value: number): string {
  return `₩${value.toLocaleString("en-US")}`;
}

/** 화면 표시용 가격 문구. 확정가만 그대로, 제안가는 표시를 붙이고, 없으면 견적 문의. */
export function priceText(rule: PriceRule): string {
  if (rule.priceKrw === null || rule.status === "on-request") return "Quote on request";
  return rule.status === "draft" ? `${formatKrw(rule.priceKrw)} (draft rate)` : formatKrw(rule.priceKrw);
}

/** 구조화 데이터에 넣어도 되는 확정 요금만. */
export function publishableRates(service: ServiceId, rules: PriceRule[] = priceRules): PriceRule[] {
  return ratesFor(service, rules).filter((r) => r.status === "confirmed" && r.priceKrw !== null);
}

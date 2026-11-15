import { costItemLabels, costItemOrder, dayProduct, dayRates, priceRules, regionLabels } from "@/content/pricing";
import { site } from "@/content/site";
import type { CostItemId, DayRate, PriceRule, ProductId, RegionId, ServiceId, VehicleId } from "@/content/types";
import { en, type Translator } from "@/i18n/translate";

// 화면에 나가는 문장을 만드는 함수는 마지막 인자로 번역기(t)를 받는다. 넘기지 않으면 영어.

// ── 네 칸 표(상품 × 지역) ─────────────────────────────────────────────

export function dayRate(service: ProductId, region: RegionId, rates: DayRate[] = dayRates): DayRate {
  const rate = rates.find((r) => r.service === service && r.region === region);
  if (!rate) throw new Error(`No day rate for ${service} / ${region}`);
  return rate;
}

export function dayRatesFor(service: ProductId, rates: DayRate[] = dayRates): DayRate[] {
  return rates.filter((r) => r.service === service);
}

/** 사장님이 확정한 값인가. 이때만 숫자가 화면·llms.txt·구조화 데이터에 나간다. */
export function isConfirmed<T extends { status: string; priceKrw: number | null }>(
  rate: T,
): rate is T & { status: "confirmed"; priceKrw: number } {
  return rate.status === "confirmed" && rate.priceKrw !== null;
}

/** 값이 확정되지 않은 칸에 나오는 문구. site.quoteReplyWithin을 넣으면 약속 시간이 붙는다. */
export function quoteText(replyWithin: string | null = site.quoteReplyWithin, t: Translator = en): string {
  return replyWithin ? t("Written quote within {time}", { time: t(replyWithin) }) : t("Written quote for your date");
}

/** 칸의 값 문구. 확정값만 숫자로, 초안(draft)·미정은 견적 문구로. */
export function dayPriceText(rate: DayRate, replyWithin: string | null = site.quoteReplyWithin, t: Translator = en): string {
  return isConfirmed(rate) ? formatKrw(rate.priceKrw) : quoteText(replyWithin, t);
}

export function costItemLabel(item: CostItemId, service: ProductId, t: Translator = en): string {
  if (item === "crew-meal") return service === "driver-guide" ? t("Driver-guide's meal") : t("Driver's meal");
  return t(costItemLabels[item]);
}

/** 칸의 포함·불포함·확인 전 항목 이름. 확인 전(null)인 항목은 "견적서에 적는다"로만 보여 준다. */
export function dayTerms(rate: DayRate, t: Translator = en): { included: string[]; notIncluded: string[]; inQuote: string[] } {
  const included: string[] = [];
  const notIncluded: string[] = [];
  const inQuote: string[] = [];
  for (const item of costItemOrder) {
    const value = rate.items[item];
    const label = costItemLabel(item, rate.service, t);
    if (value === true) included.push(label);
    else if (value === false) notIncluded.push(label);
    else inQuote.push(label);
  }
  if (rate.extraHourKrw === null) inQuote.push(t("Extra hours beyond {hours}", { hours: dayProduct.hours }));
  return { included, notIncluded, inQuote };
}

/** 초과 시간 문구. 값이 정해진 칸만. */
export function extraHourText(rate: DayRate, t: Translator = en): string | null {
  return rate.extraHourKrw === null ? null : t("{price} per hour", { price: formatKrw(rate.extraHourKrw) });
}

/** 칸을 한 문장으로(FAQ·llms.txt용). 예: "Seoul: Written quote for your date. Included: Fuel, …" */
export function dayRateSentence(rate: DayRate, t: Translator = en): string {
  const terms = dayTerms(rate, t);
  const price = isConfirmed(rate)
    ? t("{price} per group", { price: dayPriceText(rate, undefined, t) })
    : t.lowerFirst(dayPriceText(rate, undefined, t));
  const parts = [t("{region}: {price}.", { region: t(regionLabels[rate.region].name), price })];
  if (terms.included.length > 0) parts.push(t("Included: {items}.", { items: t.lowerFirst(t.list(terms.included)) }));
  if (terms.notIncluded.length > 0) parts.push(t("Not included: {items}.", { items: t.lowerFirst(t.list(terms.notIncluded)) }));
  const extra = extraHourText(rate, t);
  if (extra) parts.push(t("Extra hours: {text}.", { text: extra }));
  if (terms.inQuote.length > 0) parts.push(t("Stated in your written quote: {items}.", { items: t.lowerFirst(t.list(terms.inQuote)) }));
  if (rate.noLateFinishLimit === true) parts.push(t("No limit on how late the day can finish."));
  return parts.join(" ");
}

/** 구조화 데이터(Offer)에 넣어도 되는 칸: 사장님이 확정한 값만. */
export function publishableDayRates(service: ProductId, rates: DayRate[] = dayRates): DayRate[] {
  return dayRatesFor(service, rates).filter(isConfirmed);
}

/** 목록을 문장으로 잇는다. 영어: "Fuel, expressway tolls and parking". 다른 언어는 그 언어 방식(Intl.ListFormat). */
export function joinList(items: string[], t: Translator = en): string {
  return t.list(items);
}

// ── 그 밖의 값 규칙(지금은 숨긴 /guide-tour에서만 쓴다) ──────────────────

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

/** 날짜 수 × 하루 요금. 확정되지 않은 규칙이면 금액은 null(초안 값으로 계산해 보여 주지 않는다). */
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
  if (!isConfirmed(rule)) return { rule, days: input.days, totalKrw: null, perPersonKrw: null };
  const totalKrw = rule.priceKrw * input.days;
  return { rule, days: input.days, totalKrw, perPersonKrw: Math.round(totalKrw / input.pax / 1000) * 1000 };
}

export function formatKrw(value: number): string {
  return `₩${value.toLocaleString("en-US")}`;
}

/** 화면 표시용 가격 문구. 확정가만 숫자로, 초안(draft)과 미정은 견적 문의. */
export function priceText(rule: PriceRule, t: Translator = en): string {
  return isConfirmed(rule) ? formatKrw(rule.priceKrw) : t("Quote on request");
}

/** 구조화 데이터에 넣어도 되는 확정 요금만. */
export function publishableRates(service: ServiceId, rules: PriceRule[] = priceRules): PriceRule[] {
  return ratesFor(service, rules).filter(isConfirmed);
}

// 구매(/book) 화면의 검증·금액·문구. 폼(브라우저)과 /api/booking(서버)이 같은 함수를 쓴다.
// 2026-11-16 사장님 「판매가와 구매하는 거 만들어 줘」.
//
// 흐름: 손님이 상품·지역·날짜·일수·인원을 고르면 금액(원화, 달러 참고값)이 바로 나온다 → 「Book」을 누르면
// 예약이 inquiries 테이블에 kind='booking'·금액과 함께 저장되고 사장님 카톡으로 간다(중계 프로그램)
// → 사장님이 그날 기사·차를 확인한 뒤 결제 링크를 보낸다 → 결제가 되면 예약 확정.
// 금액은 서버가 src/content/pricing.ts로 다시 계산해 저장한다(브라우저가 보낸 금액은 쓰지 않는다).

import { dayProduct, productLabels, productOrder, regionLabels, regionOrder } from "@/content/pricing";
import type { ProductId, RegionId } from "@/content/types";
import { msg } from "@/i18n/msg";
import { contactMethodName, inquiryRow, parseInquiry, validateInquiry, type Inquiry, type InquiryErrors } from "./inquiry";
import { dayQuote, formatKrw, formatUsdApprox, type DayQuote } from "./pricing";

/** 한 번에 예약할 수 있는 날 수. 더 길면 여행 요청(/plan)으로 상담한다. */
export const bookingMaxDays = 14;

export const bookingErrorText = {
  product: msg("Choose Driver only or Driver-guide."),
  region: msg("Choose Seoul or Gyeonggi."),
  days: msg("Enter 1 to 14 days. For a longer trip, send a trip request."),
  groupSize: msg("One van takes up to 7 passengers. For a bigger group, send a trip request."),
  pickup: msg("Enter your hotel or pick-up address."),
} as const;

export interface Booking extends Omit<Inquiry, "service"> {
  service: ProductId | "";
  region: RegionId | "";
}

export type BookingErrors = Partial<Record<keyof Booking, string>>;

export function isProduct(v: string): v is ProductId {
  return (productOrder as string[]).includes(v);
}

export function isRegion(v: string): v is RegionId {
  return (regionOrder as string[]).includes(v);
}

export function validateBooking(input: Booking, today: string): BookingErrors {
  const e = bookingErrorText;
  // 날짜·이름·연락처·글자 수는 여행 요청과 같은 규칙. 상품·일수·인원·호텔은 구매용으로 더 좁힌다.
  const base: InquiryErrors = validateInquiry({ ...input, service: "not-sure" }, today);
  const errors: BookingErrors = { ...base };
  delete errors.service;
  if (!isProduct(input.service)) errors.service = e.product;
  if (!isRegion(input.region)) errors.region = e.region;
  if (!Number.isInteger(input.days) || input.days < 1 || input.days > bookingMaxDays) errors.days = e.days;
  if (!Number.isInteger(input.groupSize) || input.groupSize < 1 || input.groupSize > dayProduct.maxPassengers)
    errors.groupSize = e.groupSize;
  if (input.pickup.trim().length < 2) errors.pickup = e.pickup;
  else if (base.pickup) errors.pickup = base.pickup;
  return errors;
}

/** 확정된 칸이면 금액, 아니면 null. */
export function bookingQuote(input: Pick<Booking, "service" | "region" | "days">): DayQuote | null {
  if (!isProduct(input.service) || !isRegion(input.region)) return null;
  return dayQuote(input.service, input.region, input.days);
}

export function parseBooking(body: unknown): Booking {
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const service = typeof b.service === "string" && isProduct(b.service) ? b.service : "";
  const region = typeof b.region === "string" && isRegion(b.region) ? b.region : "";
  const { service: _ignored, ...rest } = parseInquiry(body);
  void _ignored;
  return { ...rest, service, region };
}

/** DB 행(public.inquiries, kind='booking'). 금액은 서버가 계산한 quote에서. */
export function bookingRow(input: Booking, quote: DayQuote, id: string, sourcePage: string) {
  return {
    ...inquiryRow({ ...input, service: quote.service }, id, sourcePage),
    kind: "booking",
    region: quote.region,
    price_krw: quote.totalKrw,
    price_usd: quote.totalUsd,
  };
}

/** 사장님께 가는 예약 문구(영어, 요청 메시지와 같은 모양). */
export function bookingMessage(input: Booking, quote: DayQuote, reference?: string): string {
  const lines = [
    reference ? `Booking ${reference} — Entour Korea` : "Booking — Entour Korea",
    `Product: ${productLabels[quote.service].name}, ${regionLabels[quote.region].name}`,
    `Start date: ${input.startDate} (${quote.days} day${quote.days === 1 ? "" : "s"})`,
    `Passengers: ${input.groupSize}`,
    `Price: ${formatKrw(quote.dayKrw)} × ${quote.days} = ${formatKrw(quote.totalKrw)} (${formatUsdApprox(quote.totalKrw)})`,
    `Language: ${input.language.trim()}`,
    `Pick-up: ${input.pickup.trim()}`,
  ];
  if (input.interests.trim()) lines.push(`Notes: ${input.interests.trim()}`);
  const via = input.contactMethod ? `${contactMethodName[input.contactMethod]} ` : "";
  lines.push(`Name: ${input.name.trim()}`, `Reply by: ${via}${input.contact.trim()}`);
  return lines.join("\n");
}

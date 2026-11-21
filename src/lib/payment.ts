// 포트원(PortOne) V2 페이팔 결제 설정. 상점 아이디와 채널 키는 결제 버튼을 띄우는 공개 값이라 브라우저 코드에 있어도 된다(비밀값 아님).
// 비밀값(API Secret·웹훅 시크릿)은 여기 두지 않는다 — 결제 확인 서버를 만들 때 Vercel 환경 변수로만.
// 2026-11-21: 포트원 「PG 계약에 필요한 테스트모드 설정 안내」 메일에 따라 테스트 채널(페이팔 한국 공용 테스트 계정)로 연다.
// 실계약 뒤에는 콘솔에서 실연동 채널을 만들고 channelKey만 바꾸고 testMode를 false로.
//
// 페이팔 조건(포트원 안내): 원화는 받지 않아 USD로 청구한다. 판매자·구매자가 둘 다 한국 페이팔 계정이면 결제가 안 된다.
// 금액은 src/content/pricing.ts의 확정가로 계산한 달러 값(src/lib/pricing.ts usdFromKrw, 5달러 단위)이고, 포트원에는 센트로 넘긴다.

import type { ProductId, RegionId } from "@/content/types";
import type { DayQuote } from "./pricing";

export const paypalConfig = {
  storeId: "store-e297c1ab-bce3-4141-b20a-7cfef6165894",
  // 포트원 콘솔 「Entour 페이팔 일반결제 테스트」 채널 (paypal_v2 · 한국 공용 테스트 계정)
  channelKey: "channel-key-b9158918-6a5a-4138-9576-63d640ef3d20",
  testMode: true,
} as const;

/** 포트원 결제 번호. 같은 번호로 두 번 결제할 수 없다. */
export function newPaymentId(now: Date = new Date()): string {
  const ymd = now.toISOString().slice(0, 10).replace(/-/g, "");
  const rand = Math.random().toString(36).slice(2, 10);
  return `entour-${ymd}-${rand}`;
}

/** 포트원에 넘길 USD 금액(센트). */
export function usdCents(quote: DayQuote): number {
  return quote.totalUsd * 100;
}

/** 예약 확인 뒤 손님에게 보내는 결제 링크(사장님 카톡 알림에 붙는다). */
export function payPath(product: ProductId, region: RegionId, days: number, reference?: string): string {
  const q = new URLSearchParams({ product, region, days: String(days) });
  if (reference) q.set("ref", reference);
  return `/pay?${q.toString()}`;
}

/** 주소의 예약 번호(ref): 영숫자 4~16자만. */
export function cleanReference(v: string | null | undefined): string {
  const s = (v ?? "").replace(/[^A-Za-z0-9]/g, "").slice(0, 16);
  return s.length >= 4 ? s : "";
}

/** 결제 조회 결과 판정(서버 /api/payment/verify가 쓴다). 금액·상점·통화가 하나라도 다르면 mismatch. */
export type PaymentCheck = "paid" | "pending" | "not-paid" | "mismatch";

export function checkPayment(
  p: { status: string; storeId?: string; currency?: string; amount?: { total?: number } },
  expectedCents: number,
): PaymentCheck {
  if (p.storeId && p.storeId !== paypalConfig.storeId) return "mismatch";
  if (p.status === "PAY_PENDING") return "pending";
  if (p.status !== "PAID") return "not-paid";
  if (p.currency !== "USD" || p.amount?.total !== expectedCents) return "mismatch";
  return "paid";
}

/** 포트원 customData(문자열 JSON)에서 상품·지역·일수를 꺼낸다. */
export function orderFromCustomData(raw: string | undefined): { product: string; region: string; days: number; reference: string } | null {
  if (!raw) return null;
  try {
    const d = JSON.parse(raw) as Record<string, unknown>;
    return { product: String(d.product ?? ""), region: String(d.region ?? ""), days: Number(d.days), reference: cleanReference(String(d.reference ?? "")) };
  } catch {
    return null;
  }
}

import "server-only";
import { paypalConfig } from "./payment";

// 포트원 REST API(V2) — 서버에서만 쓴다. 비밀값은 환경변수 EXITOUR_PORTONE_API_SECRET에만 있다(.env.local·Vercel, 저장소에 넣지 않는다).
// 2026-11-21 사장님 「결제 금액 서버 확인 만들어줘」:
//  1) 결제 전: 서버가 확정가로 금액을 계산해 포트원에 「결제 정보 사전 등록」(POST /payments/{id}/pre-register) → 다른 금액으로는 결제가 거절된다
//  2) 결제 뒤: 서버가 결제 단건 조회(GET /payments/{id})로 상태·상점·통화·금액을 다시 확인한다
// 비밀값이 없으면(아직 안 넣었으면) 두 단계를 건너뛰고 테스트 결제는 그대로 된다 — 화면에는 「확인 중」으로 나온다.

const API = "https://api.portone.io";

type Env = Record<string, string | undefined>;

export function portoneSecret(env: Env = process.env): string | null {
  const s = env.EXITOUR_PORTONE_API_SECRET?.trim();
  return s ? s : null;
}

function headers(secret: string) {
  return { Authorization: `PortOne ${secret}`, "Content-Type": "application/json" };
}

/** 결제 정보 사전 등록. 성공하면 true, 실패하면 오류 문구를 던진다. */
export async function preRegisterPayment(secret: string, paymentId: string, totalAmount: number, currency: string, fetchImpl: typeof fetch = fetch): Promise<void> {
  const res = await fetchImpl(`${API}/payments/${encodeURIComponent(paymentId)}/pre-register`, {
    method: "POST",
    headers: headers(secret),
    body: JSON.stringify({ storeId: paypalConfig.storeId, totalAmount, currency }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`PortOne pre-register ${res.status}: ${(await res.text()).slice(0, 200)}`);
}

/** 포트원 결제 조회 결과 중 확인에 쓰는 칸. */
export interface PortonePayment {
  status: string;
  id: string;
  storeId?: string;
  currency?: string;
  amount?: { total?: number };
  customData?: string;
  paidAt?: string;
}

export async function fetchPayment(secret: string, paymentId: string, fetchImpl: typeof fetch = fetch): Promise<PortonePayment | null> {
  const res = await fetchImpl(`${API}/payments/${encodeURIComponent(paymentId)}?storeId=${encodeURIComponent(paypalConfig.storeId)}`, {
    headers: headers(secret),
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`PortOne get payment ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return (await res.json()) as PortonePayment;
}

import { bookingMaxDays, bookingQuote, isProduct, isRegion } from "@/lib/booking";
import { newPaymentId, usdCents } from "@/lib/payment";
import { portoneSecret, preRegisterPayment } from "@/lib/portoneServer";

// 페이팔 결제 준비(/pay): 서버가 확정가로 금액을 계산하고 결제 번호를 만들어 포트원에 사전 등록한다.
// 사전 등록된 결제 번호는 그 금액으로만 결제된다(손님이 브라우저에서 금액을 바꾸면 포트원이 거절).
// 비밀값(EXITOUR_PORTONE_API_SECRET)이 없으면 사전 등록 없이 결제 번호만 준다.

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  const product = String(body.product ?? "");
  const region = String(body.region ?? "");
  const days = Number(body.days);
  if (!isProduct(product) || !isRegion(region) || !Number.isInteger(days) || days < 1 || days > bookingMaxDays) {
    return Response.json({ ok: false, error: "Invalid booking." }, { status: 422 });
  }
  const quote = bookingQuote({ service: product, region, days });
  if (!quote) return Response.json({ ok: false, error: "Not open for online payment." }, { status: 409 });

  const paymentId = newPaymentId();
  const cents = usdCents(quote);
  const secret = portoneSecret();
  if (!secret) return Response.json({ ok: true, paymentId, totalAmount: cents, preRegistered: false });
  try {
    await preRegisterPayment(secret, paymentId, cents, "USD");
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false, error: "Payment could not be prepared." }, { status: 502 });
  }
  return Response.json({ ok: true, paymentId, totalAmount: cents, preRegistered: true });
}

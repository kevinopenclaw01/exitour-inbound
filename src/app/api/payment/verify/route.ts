import { after } from "next/server";
import { productLabels, regionLabels } from "@/content/pricing";
import { bookingQuote, isProduct, isRegion } from "@/lib/booking";
import { notifyConfigured, notifyOwner } from "@/lib/notify";
import { checkPayment, orderFromCustomData, usdCents, type PaymentCheck } from "@/lib/payment";
import { fetchPayment, portoneSecret } from "@/lib/portoneServer";

// 페이팔 결제 뒤 확인(/pay): 브라우저가 「결제됐다」고 알려 와도 믿지 않고, 서버가 포트원에서 결제를 다시 조회한다.
// 상태 PAID + 상점 + 통화 USD + 금액 = 확정가(customData의 상품·지역·일수로 다시 계산)일 때만 paid.
// 비밀값이 없으면 확인하지 못했다고(checked: false) 돌려준다.

export async function POST(request: Request) {
  let paymentId = "";
  try {
    paymentId = String(((await request.json()) as Record<string, unknown>).paymentId ?? "");
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  if (!/^[A-Za-z0-9-]{8,64}$/.test(paymentId)) return Response.json({ ok: false }, { status: 400 });

  const secret = portoneSecret();
  if (!secret) return Response.json({ ok: true, checked: false });

  let result: PaymentCheck = "not-paid";
  let order: ReturnType<typeof orderFromCustomData> = null;
  try {
    const payment = await fetchPayment(secret, paymentId);
    if (payment) {
      order = orderFromCustomData(payment.customData);
      const quote =
        order && isProduct(order.product) && isRegion(order.region) ? bookingQuote({ service: order.product, region: order.region, days: order.days }) : null;
      result = quote ? checkPayment(payment, usdCents(quote)) : "mismatch";
    }
  } catch (e) {
    console.error(e);
    return Response.json({ ok: false }, { status: 502 });
  }

  if (result !== "not-paid" && notifyConfigured()) {
    after(async () => {
      const what =
        order && isProduct(order.product) && isRegion(order.region)
          ? `${productLabels[order.product].name}, ${regionLabels[order.region].name}, ${order.days}일`
          : "내용 확인 필요";
      const subject = `[Entour Korea] 페이팔 결제 ${result === "paid" ? "확인" : result === "pending" ? "대기" : "금액 불일치"} ${order?.reference ?? ""}`;
      await notifyOwner(subject, `${subject}\n결제 번호: ${paymentId}\n${what}`).catch(() => undefined);
    });
  }
  return Response.json({ ok: true, checked: true, result });
}

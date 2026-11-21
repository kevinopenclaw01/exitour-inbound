import { describe, expect, it } from "vitest";
import { bookingQuote } from "@/lib/booking";
import { checkPayment, cleanReference, orderFromCustomData, payPath, paypalConfig, usdCents } from "@/lib/payment";

// 페이팔 결제 서버 확인(2026-11-21). 금액은 확정가에서만 나오고, 조회 결과가 하나라도 다르면 mismatch.

const quote = bookingQuote({ service: "driver-guide", region: "seoul", days: 2 })!;
const cents = usdCents(quote);
const paid = { status: "PAID", storeId: paypalConfig.storeId, currency: "USD", amount: { total: cents } };

describe("payment amount", () => {
  it("charges the confirmed price in US cents", () => {
    expect(quote.totalKrw).toBe(860_000);
    expect(cents).toBe(quote.totalUsd * 100);
    expect(cents % 500).toBe(0); // 5달러 단위
  });
});

describe("checkPayment", () => {
  it("accepts a paid payment with the right store, currency and amount", () => {
    expect(checkPayment(paid, cents)).toBe("paid");
  });
  it("rejects a different amount, currency or store", () => {
    expect(checkPayment({ ...paid, amount: { total: cents - 100 } }, cents)).toBe("mismatch");
    expect(checkPayment({ ...paid, currency: "KRW" }, cents)).toBe("mismatch");
    expect(checkPayment({ ...paid, storeId: "store-other" }, cents)).toBe("mismatch");
  });
  it("tells pending and unpaid apart", () => {
    expect(checkPayment({ ...paid, status: "PAY_PENDING" }, cents)).toBe("pending");
    expect(checkPayment({ ...paid, status: "READY" }, cents)).toBe("not-paid");
    expect(checkPayment({ ...paid, status: "FAILED" }, cents)).toBe("not-paid");
  });
});

describe("custom data and links", () => {
  it("reads the order back from PortOne customData", () => {
    const raw = JSON.stringify({ reference: "ABCD1234", product: "driver-guide", region: "seoul", days: 2, totalKrw: 860000 });
    expect(orderFromCustomData(raw)).toEqual({ product: "driver-guide", region: "seoul", days: 2, reference: "ABCD1234" });
    expect(orderFromCustomData("not json")).toBeNull();
    expect(orderFromCustomData(undefined)).toBeNull();
  });
  it("builds the payment link and cleans references", () => {
    expect(payPath("driver-guide", "seoul", 2, "ABCD1234")).toBe("/pay?product=driver-guide&region=seoul&days=2&ref=ABCD1234");
    expect(cleanReference("ab<script>")).toBe("abscript");
    expect(cleanReference("ab")).toBe("");
  });
});

"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import * as PortOne from "@portone/browser-sdk/v2";
import { productLabels, productOrder, regionLabels, regionOrder } from "@/content/pricing";
import type { ProductId, RegionId } from "@/content/types";
import { bookingUi as b, formUi as u, payUi as p } from "@/i18n/formStrings";
import { messageTranslator, type Messages } from "@/i18n/interpolate";
import { bookingErrorText, bookingMaxDays, bookingQuote, isProduct, isRegion } from "@/lib/booking";
import { cleanReference, newPaymentId, paypalConfig, usdCents } from "@/lib/payment";
import { formatKrw } from "@/lib/pricing";
import { Choice } from "./BookingForm";

// 페이팔 결제 화면(/pay). 2026-11-21 포트원 「PG 계약에 필요한 테스트모드 설정 안내」 메일에 따라 테스트 채널로 연다.
// 흐름: 사장님이 예약(/book)을 확인하고 /pay?product=…&region=…&days=…&ref=… 링크를 보낸다 → 손님이 이름·메일을 넣고 동의하면
// 페이팔 버튼이 뜬다(포트원 loadPaymentUI, PAYPAL_SPB) → 페이팔 창에서 결제 → 이 화면에 결제 번호가 나온다.
// 금액은 src/content/pricing.ts의 확정가로만 계산한다(손님이 금액을 칠 칸이 없다). 결제 금액 서버 확인은 API 시크릿을 만든 뒤에 붙인다.

type Status =
  | { kind: "waiting" }
  | { kind: "loading" }
  | { kind: "shown" }
  | { kind: "load-failed" }
  | { kind: "paid"; paymentId: string }
  | { kind: "failed"; reason: string };

const field = "w-full rounded-md border border-line bg-surface px-3 py-2 text-base";
const nameOk = (v: string) => /^[A-Za-z][A-Za-z .'-]{0,49}$/.test(v.trim());
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export function PayPalForm({
  messages = {},
  legalLinks,
}: {
  messages?: Messages;
  legalLinks: { href: string; label: string }[];
}) {
  const tr = messageTranslator(messages);
  const [service, setService] = useState<ProductId>("driver-guide");
  const [region, setRegion] = useState<RegionId>("seoul");
  const [days, setDays] = useState(1);
  const [reference, setReference] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "waiting" });
  const paymentId = useRef("");
  const loaded = useRef(false);

  // 사장님이 보내는 링크가 ?product=…&region=…&days=…&ref=…로 예약 내용을 넘긴다.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const product = q.get("product") ?? "";
    const area = q.get("region") ?? "";
    const n = Number(q.get("days"));
    /* eslint-disable react-hooks/set-state-in-effect -- 주소의 값은 브라우저에서만 읽을 수 있다(쪽은 미리 구워 둔다) */
    if (isProduct(product)) setService(product);
    if (isRegion(area)) setRegion(area);
    if (Number.isInteger(n) && n >= 1 && n <= bookingMaxDays) setDays(n);
    setReference(cleanReference(q.get("ref")));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  const daysOk = Number.isInteger(days) && days >= 1 && days <= bookingMaxDays;
  const quote = daysOk ? bookingQuote({ service, region, days }) : null;
  const ready = Boolean(quote) && nameOk(firstName) && nameOk(lastName) && emailOk(email) && agree;

  const request = useMemo(() => {
    if (!quote) return null;
    const orderName = `Entour Korea: ${productLabels[quote.service].name}, ${regionLabels[quote.region].name}, ${quote.days} day${quote.days === 1 ? "" : "s"}`;
    const cents = usdCents(quote);
    return {
      uiType: "PAYPAL_SPB" as const,
      storeId: paypalConfig.storeId,
      channelKey: paypalConfig.channelKey,
      orderName,
      totalAmount: cents,
      currency: "USD" as const,
      customer: { firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim() },
      products: [{ id: `${quote.service}-${quote.region}`, name: orderName, amount: cents, quantity: 1 }],
      customData: { reference, product: quote.service, region: quote.region, days: quote.days, totalKrw: quote.totalKrw },
    };
  }, [quote, firstName, lastName, email, reference]);

  // 준비가 되면 페이팔 버튼을 띄운다(버튼 자리 .portone-ui-container가 그려진 뒤).
  // 준비가 풀리면 버튼 자리가 사라지고, 다시 준비되면 새 결제 번호로 다시 띄운다.
  useEffect(() => {
    if (!ready || !request) {
      loaded.current = false;
      return;
    }
    if (loaded.current) {
      // 이름·메일·일수가 바뀌면 띄운 버튼의 결제 내용만 바꾼다(포트원 updateLoadPaymentUIRequest).
      PortOne.updateLoadPaymentUIRequest({ ...request, paymentId: paymentId.current }).catch(() => undefined);
      return;
    }
    loaded.current = true;
    paymentId.current = newPaymentId();
    setStatus({ kind: "loading" });
    PortOne.loadPaymentUI(
      { ...request, paymentId: paymentId.current },
      {
        onPaymentSuccess: (res) => {
          if (res.code) setStatus({ kind: "failed", reason: res.message ?? "" });
          else setStatus({ kind: "paid", paymentId: res.paymentId });
        },
        onPaymentFail: (error) => setStatus({ kind: "failed", reason: error.message ?? "" }),
      },
    )
      .then(() => setStatus((s) => (s.kind === "loading" ? { kind: "shown" } : s)))
      .catch(() => {
        loaded.current = false;
        setStatus({ kind: "load-failed" });
      });
  }, [ready, request]);

  if (status.kind === "paid") {
    return (
      <section aria-live="polite" className="grid gap-3 rounded-md border border-sign/30 bg-sign-soft p-4 sm:p-6">
        <h2 className="text-lg font-bold">{tr(p.paidTitle)}</h2>
        <p>{tr(p.paidText, { paymentId: status.paymentId })}</p>
        {paypalConfig.testMode ? <p className="text-sm font-semibold text-brown">{tr(p.testPaid)}</p> : null}
      </section>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 rounded-md border border-line bg-surface p-4 sm:p-6">
        <fieldset className="grid gap-2">
          <legend className="mb-1 font-semibold">{tr(b.product)}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {productOrder.map((id: ProductId) => (
              <Choice
                key={id}
                name="service"
                value={id}
                checked={service === id}
                onChange={() => setService(id)}
                title={tr(productLabels[id].name)}
                hint={tr(productLabels[id].hint)}
              />
            ))}
          </div>
        </fieldset>
        <fieldset className="grid gap-2">
          <legend className="mb-1 font-semibold">{tr(b.region)}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {regionOrder.map((id: RegionId) => (
              <Choice
                key={id}
                name="region"
                value={id}
                checked={region === id}
                onChange={() => setRegion(id)}
                title={tr(regionLabels[id].name)}
                hint={tr(regionLabels[id].hint)}
              />
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1">
            <label htmlFor="days" className="font-semibold">
              {tr(u.days)}
            </label>
            <input
              id="days"
              type="number"
              min={1}
              max={bookingMaxDays}
              className={field}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            />
            {!daysOk ? <p className="text-sm text-brown">{tr(bookingErrorText.days)}</p> : null}
          </div>
          <div className="grid gap-1">
            <label htmlFor="reference" className="font-semibold">
              {tr(p.reference)} <span className="font-normal text-muted">{tr(u.optional)}</span>
            </label>
            <input
              id="reference"
              className={field}
              value={reference}
              aria-describedby="reference-hint"
              onChange={(e) => setReference(e.target.value.replace(/[^A-Za-z0-9]/g, "").slice(0, 16))}
            />
            <p id="reference-hint" className="text-sm text-muted">
              {tr(p.referenceHint)}
            </p>
          </div>
        </div>
      </div>

      <section aria-live="polite" className="grid gap-2 rounded-md border border-line bg-paper p-4 sm:p-6">
        <h2 className="font-semibold">{tr(b.summary)}</h2>
        {quote ? (
          <>
            <p className="text-sm text-muted">{tr(b.perDay, { price: formatKrw(quote.dayKrw), days: quote.days })}</p>
            <p className="text-2xl font-bold">{tr(p.charged, { usd: quote.totalUsd.toLocaleString("en-US") })}</p>
            <p className="text-sm text-muted">{tr(p.chargedNote, { krw: formatKrw(quote.totalKrw) })}</p>
            <p className="text-sm text-muted">{tr(b.perGroup)}</p>
          </>
        ) : (
          <p>{tr(b.notOpen)}</p>
        )}
      </section>

      <div className="grid gap-4 rounded-md border border-line bg-surface p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1">
            <label htmlFor="firstName" className="font-semibold">
              {tr(p.firstName)}
            </label>
            <input id="firstName" autoComplete="given-name" className={field} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="grid gap-1">
            <label htmlFor="lastName" className="font-semibold">
              {tr(p.lastName)}
            </label>
            <input id="lastName" autoComplete="family-name" className={field} value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        {(firstName && !nameOk(firstName)) || (lastName && !nameOk(lastName)) ? <p className="text-sm text-brown">{tr(p.nameError)}</p> : null}
        <div className="grid gap-1">
          <label htmlFor="email" className="font-semibold">
            {tr(p.email)}
          </label>
          <input id="email" type="email" autoComplete="email" className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
          {email && !emailOk(email) ? <p className="text-sm text-brown">{tr(p.emailError)}</p> : null}
        </div>
        <label className="flex gap-3 rounded-md bg-paper p-3 text-sm">
          <input type="checkbox" className="mt-0.5 h-5 w-5 shrink-0" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>{tr(p.agree)}</span>
        </label>
        {legalLinks.length > 0 ? (
          <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
            {legalLinks.map((l) => (
              <Link key={l.href} href={l.href} className="font-semibold text-sign underline">
                {l.label}
              </Link>
            ))}
          </p>
        ) : null}
        <p className="text-sm text-muted">{tr(p.koreanAccount)}</p>
      </div>

      <section className="grid gap-3">
        {ready ? (
          <div className="portone-ui-container min-h-12" />
        ) : (
          <p className="rounded-md border border-dashed border-line p-4 text-sm text-muted">{tr(p.fillFirst)}</p>
        )}
        {ready && status.kind === "loading" ? <p className="text-sm text-muted">{tr(p.loading)}</p> : null}
        {status.kind === "load-failed" ? <p className="text-sm font-semibold text-brown">{tr(p.loadFailed)}</p> : null}
        {status.kind === "failed" ? (
          <p role="alert" className="text-sm font-semibold text-brown">
            {status.reason ? tr(p.failed, { reason: status.reason }) : tr(p.failedPlain)}
          </p>
        ) : null}
      </section>
    </div>
  );
}

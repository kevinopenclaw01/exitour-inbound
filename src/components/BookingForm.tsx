"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { productLabels, productOrder, regionLabels, regionOrder } from "@/content/pricing";
import type { ProductId, RegionId } from "@/content/types";
import { bookingUi as b, formUi as u } from "@/i18n/formStrings";
import { messageTranslator, type Messages } from "@/i18n/interpolate";
import { bookingMaxDays, bookingQuote, isProduct, isRegion, validateBooking, type Booking, type BookingErrors } from "@/lib/booking";
import { todayKst } from "@/lib/dates";
import { contactMethodName, contactMethods, heardFromLabels, heardFromOptions, type ContactMethod } from "@/lib/inquiry";
import { formatKrw, formatUsdApprox } from "@/lib/pricing";
import { DatePicker } from "./DatePicker";

// 구매 화면. 상품·지역·날짜·일수·인원을 고르면 금액이 바로 나오고, 「Book now」로 예약을 보낸다(/api/booking).
// 결제는 사장님이 그날 기사·차를 확인한 뒤 보내는 결제 링크로 한다(src/lib/booking.ts 맨 위).
// 문구는 서버가 그 언어로 번역해 넘긴 작은 사전(messages)에서 찾는다(src/i18n/formStrings.ts의 bookingStrings).

const empty: Booking = {
  service: "driver-guide",
  region: "seoul",
  startDate: "",
  days: 1,
  groupSize: 2,
  language: "English",
  pickup: "",
  interests: "",
  name: "",
  contactMethod: "",
  contact: "",
  heardFrom: "",
};

type Result =
  | { kind: "saved"; reference: string | null; totalKrw: number; method: ContactMethod | "" }
  | { kind: "not-saved"; reason: string };

const field = "w-full rounded-md border border-line bg-surface px-3 py-2 text-base";

const translateErrors = (errors: BookingErrors, tr: (s: string) => string): BookingErrors =>
  Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v ? tr(v) : v]));

function Choice({ checked, onChange, name, value, title, hint }: { checked: boolean; onChange: () => void; name: string; value: string; title: string; hint: string }) {
  return (
    <label
      className={`grid cursor-pointer gap-0.5 rounded-md border p-3 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sign ${
        checked ? "border-sign bg-sign-soft" : "border-line bg-surface"
      }`}
    >
      <input type="radio" name={name} value={value} className="sr-only" checked={checked} onChange={onChange} />
      <span className={`font-semibold ${checked ? "text-sign-deep" : ""}`}>{title}</span>
      <span className="text-sm text-muted">{hint}</span>
    </label>
  );
}

export function BookingForm({
  messages = {},
  locale = "en-GB",
  privacyHref,
  contact,
}: {
  messages?: Messages;
  locale?: string;
  privacyHref?: string;
  contact?: ReactNode;
}) {
  const tr = messageTranslator(messages);
  const [form, setForm] = useState<Booking>(empty);
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<BookingErrors>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // 가격표의 「Book this day」 단추가 ?product=…&region=…로 고른 칸을 넘긴다.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const product = q.get("product") ?? "";
    const region = q.get("region") ?? "";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 주소의 값은 브라우저에서만 읽을 수 있다(쪽은 미리 구워 둔다)
    setForm((f) => ({ ...f, ...(isProduct(product) ? { service: product } : {}), ...(isRegion(region) ? { region } : {}) }));
  }, []);

  function set<K extends keyof Booking>(key: K, value: Booking[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const quote = bookingQuote(form);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateBooking(form, todayKst());
    setErrors(translateErrors(found, tr));
    if (Object.keys(found).length > 0 || !quote) {
      setResult(null);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string | null; totalKrw?: number; errors?: BookingErrors };
      if (res.ok && data.ok)
        setResult({ kind: "saved", reference: data.reference ?? null, totalKrw: data.totalKrw ?? quote.totalKrw, method: form.contactMethod });
      else if (data.errors) {
        setErrors(translateErrors(data.errors, tr));
        setResult(null);
      } else setResult({ kind: "not-saved", reason: tr(u.reasonServer) });
    } catch {
      setResult({ kind: "not-saved", reason: tr(u.reasonConnection) });
    } finally {
      setSending(false);
    }
  }

  const method = contactMethods.find((m) => m.value === form.contactMethod);

  const err = (key: keyof Booking) =>
    errors[key] ? (
      <p id={`${key}-error`} className="text-sm text-brown">
        {errors[key]}
      </p>
    ) : null;

  if (result?.kind === "saved") {
    return (
      <section aria-live="polite" className="grid gap-3 rounded-md border border-sign/30 bg-sign-soft p-4 sm:p-6">
        <h2 className="text-lg font-bold">{tr(b.savedTitle, { reference: result.reference ?? "" })}</h2>
        <p>
          {tr(b.savedText, {
            total: formatKrw(result.totalKrw),
            usd: formatUsdApprox(result.totalKrw),
            method: result.method ? contactMethodName[result.method] : "",
          })}
        </p>
        {contact}
      </section>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-6">
      <div className="grid gap-4 rounded-md border border-line bg-surface p-4 sm:p-6">
        <fieldset className="grid gap-2">
          <legend className="mb-1 font-semibold">{tr(b.product)}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {productOrder.map((p: ProductId) => (
              <Choice
                key={p}
                name="service"
                value={p}
                checked={form.service === p}
                onChange={() => set("service", p)}
                title={tr(productLabels[p].name)}
                hint={tr(productLabels[p].hint)}
              />
            ))}
          </div>
          {err("service")}
        </fieldset>

        <fieldset className="grid gap-2">
          <legend className="mb-1 font-semibold">{tr(b.region)}</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {regionOrder.map((r: RegionId) => (
              <Choice
                key={r}
                name="region"
                value={r}
                checked={form.region === r}
                onChange={() => set("region", r)}
                title={tr(regionLabels[r].name)}
                hint={tr(regionLabels[r].hint)}
              />
            ))}
          </div>
          {err("region")}
        </fieldset>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-1">
            <label htmlFor="startDate" className="font-semibold">
              {tr(u.firstDate)}
            </label>
            <DatePicker
              id="startDate"
              value={form.startDate}
              min={todayKst()}
              onChange={(v) => set("startDate", v)}
              describedBy={errors.startDate ? "startDate-error" : undefined}
              locale={locale}
              labels={{
                choose: tr(u.chooseDate),
                dialog: tr(u.chooseFirstDate),
                prev: tr(u.prevMonth),
                next: tr(u.nextMonth),
                koreaTime: tr(u.koreaTime),
              }}
            />
            {err("startDate")}
          </div>
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
              value={form.days}
              onChange={(e) => set("days", Number(e.target.value))}
            />
            {err("days")}
          </div>
          <div className="grid gap-1">
            <label htmlFor="groupSize" className="font-semibold">
              {tr(b.passengers)}
            </label>
            <input
              id="groupSize"
              type="number"
              min={1}
              max={7}
              className={field}
              value={form.groupSize}
              onChange={(e) => set("groupSize", Number(e.target.value))}
            />
            {err("groupSize")}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1">
            <label htmlFor="pickup" className="font-semibold">
              {tr(b.pickup)}
            </label>
            <input id="pickup" className={field} value={form.pickup} onChange={(e) => set("pickup", e.target.value)} />
            {err("pickup")}
          </div>
          <div className="grid gap-1">
            <label htmlFor="language" className="font-semibold">
              {tr(b.language)}
            </label>
            <input id="language" className={field} value={form.language} onChange={(e) => set("language", e.target.value)} />
            {err("language")}
          </div>
        </div>

        <div className="grid gap-1">
          <label htmlFor="interests" className="font-semibold">
            {tr(b.notes)} <span className="font-normal text-muted">{tr(u.optional)}</span>
          </label>
          <textarea
            id="interests"
            rows={3}
            className={field}
            placeholder={tr(b.notesPlaceholder)}
            value={form.interests}
            onChange={(e) => set("interests", e.target.value)}
          />
          {err("interests")}
        </div>

        <div className="grid gap-1 sm:max-w-md">
          <label htmlFor="name" className="font-semibold">
            {tr(u.name)}
          </label>
          <input id="name" autoComplete="name" className={field} value={form.name} onChange={(e) => set("name", e.target.value)} />
          {err("name")}
        </div>

        <fieldset className="grid gap-2">
          <legend className="mb-1 font-semibold">{tr(u.contactMethod)}</legend>
          <div className="flex flex-wrap gap-2">
            {contactMethods.map((m) => (
              <label
                key={m.value}
                className={`cursor-pointer rounded-md border px-3 py-2 text-sm font-semibold has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-sign ${
                  form.contactMethod === m.value ? "border-sign bg-sign-soft text-sign-deep" : "border-line bg-surface text-ink/80"
                }`}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value={m.value}
                  className="sr-only"
                  checked={form.contactMethod === m.value}
                  onChange={() => set("contactMethod", m.value as ContactMethod)}
                />
                {tr(m.label)}
              </label>
            ))}
          </div>
          {err("contactMethod")}
          {method ? (
            <div className="grid gap-1 sm:max-w-md">
              <label htmlFor="contact" className="text-sm font-semibold">
                {tr(method.field)}
              </label>
              <input
                id="contact"
                type={method.value === "email" ? "email" : method.value === "whatsapp" ? "tel" : "text"}
                inputMode={method.value === "email" ? "email" : method.value === "whatsapp" ? "tel" : undefined}
                autoComplete={method.value === "email" ? "email" : method.value === "whatsapp" ? "tel" : "off"}
                placeholder={method.example || undefined}
                className={field}
                value={form.contact}
                onChange={(e) => set("contact", e.target.value)}
              />
              {err("contact")}
            </div>
          ) : null}
        </fieldset>

        <div className="grid gap-1 sm:max-w-md">
          <label htmlFor="heardFrom" className="font-semibold">
            {tr(u.heardFrom)} <span className="font-normal text-muted">{tr(u.optional)}</span>
          </label>
          <select id="heardFrom" className={field} value={form.heardFrom} onChange={(e) => set("heardFrom", e.target.value)}>
            <option value="">{tr(u.chooseOne)}</option>
            {heardFromOptions.map((o) => (
              <option key={o} value={o}>
                {tr(heardFromLabels[o])}
              </option>
            ))}
          </select>
        </div>

        {/* 스팸 봇용 숨은 칸. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
      </div>

      <section aria-live="polite" className="grid gap-3 rounded-md border border-sign/30 bg-sign-soft p-4 sm:p-6">
        <h2 className="text-lg font-bold">{tr(b.summary)}</h2>
        {quote ? (
          <>
            {quote.days > 1 ? (
              <p className="text-sm text-muted tabular-nums">{tr(b.perDay, { price: formatKrw(quote.dayKrw), days: quote.days })}</p>
            ) : null}
            <p className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-semibold">{tr(b.total)}</span>
              <span className="text-2xl font-bold text-sign-deep tabular-nums">{formatKrw(quote.totalKrw)}</span>
              <span className="text-muted tabular-nums">{formatUsdApprox(quote.totalKrw)}</span>
            </p>
            <p className="text-xs text-muted">
              {tr(b.perGroup)} · {tr(b.usdNote)}
            </p>
          </>
        ) : (
          <p>{tr(b.notOpen)}</p>
        )}
        <div className="grid gap-1 text-sm">
          <p className="font-semibold">{tr(b.howTitle)}</p>
          <ol className="list-decimal grid gap-1 pl-5">
            <li>{tr(b.how1)}</li>
            <li>{tr(b.how2)}</li>
            <li>{tr(b.how3)}</li>
          </ol>
        </div>
        <button
          type="submit"
          disabled={sending || !quote}
          className="justify-self-start rounded-md bg-sign px-5 py-3 font-semibold text-white hover:bg-sign-deep disabled:opacity-60"
        >
          {sending ? tr(b.booking) : tr(b.book)}
        </button>
        {Object.keys(errors).length > 0 ? <p className="text-sm text-brown">{tr(u.notSentTitle)}</p> : null}
        <p className="text-sm text-muted">
          {tr(u.privacyNote)}
          {privacyHref ? (
            <>
              {" "}
              <Link href={privacyHref} hrefLang="en" className="underline">
                {tr(u.privacyLink)}
              </Link>
            </>
          ) : null}
        </p>
      </section>

      {result?.kind === "not-saved" ? (
        <section aria-live="polite" className="grid gap-3 rounded-md border border-brown/30 bg-surface p-4 sm:p-6">
          <h2 className="text-lg font-bold">{tr(u.notSentTitle)}</h2>
          <p>{tr(u.notSentText, { reason: result.reason })}</p>
          {contact}
        </section>
      ) : null}
    </form>
  );
}

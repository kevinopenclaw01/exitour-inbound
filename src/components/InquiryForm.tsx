"use client";

import { useState, type ReactNode } from "react";
import { formUi as u } from "@/i18n/formStrings";
import { messageTranslator, type Messages } from "@/i18n/interpolate";
import {
  contactMethods,
  heardFromLabels,
  heardFromOptions,
  inquiryMessage,
  serviceOptions,
  validateInquiry,
  whatsappLink,
  type ContactMethod,
  type Inquiry,
  type InquiryErrors,
  type ServiceChoice,
} from "@/lib/inquiry";
import { todayKst } from "@/lib/dates";
import Link from "next/link";
import { DatePicker } from "./DatePicker";
import { site } from "@/content/site";

// 폼의 문구는 영어 원문을 열쇠로 messages(서버가 그 언어로 번역해 넘긴 작은 사전)에서 찾는다(src/i18n/formStrings.ts).
// 저장 값(service·heardFrom)과 사장님께 가는 요청 메시지는 영어 그대로다.

const empty: Inquiry = {
  service: "not-sure",
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

type Result = { kind: "saved"; reference: string | null } | { kind: "not-saved"; reason: string };

/** API가 돌려준 오류도 영어 원문이라 화면에 낼 때 번역한다. */
const translateErrors = (errors: InquiryErrors, tr: (s: string) => string): InquiryErrors =>
  Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v ? tr(v) : v]));

const field = "w-full rounded-md border border-line bg-surface px-3 py-2 text-base";

/**
 * privacyHref: 개인정보처리방침이 공개된 뒤에만 넘긴다(값이 다 채워지기 전에는 링크를 걸지 않는다).
 * messages·locale: 그 언어의 폼 문구와 날짜 표기. contact: 결과 상자 아래에 보일 연락처(서버 조각).
 */
export function InquiryForm({
  initialService,
  privacyHref,
  messages = {},
  locale = "en-GB",
  contact,
}: {
  initialService?: ServiceChoice;
  privacyHref?: string;
  messages?: Messages;
  locale?: string;
  contact?: ReactNode;
}) {
  const tr = messageTranslator(messages);
  const [form, setForm] = useState<Inquiry>({ ...empty, service: initialService ?? empty.service });
  const [website, setWebsite] = useState("");
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState("");

  function set<K extends keyof Inquiry>(key: K, value: Inquiry[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateInquiry(form, todayKst());
    setErrors(translateErrors(found, tr));
    setCopied("");
    if (Object.keys(found).length > 0) {
      setResult(null);
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string | null; errors?: InquiryErrors };
      if (res.ok && data.ok) setResult({ kind: "saved", reference: data.reference ?? null });
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

  const message = result ? inquiryMessage(form, result.kind === "saved" ? result.reference ?? undefined : undefined) : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(tr(u.copied));
    } catch {
      setCopied(tr(u.copyBlocked));
    }
  }

  const err = (key: keyof Inquiry) =>
    errors[key] ? (
      <p id={`${key}-error`} className="text-sm text-brown">
        {errors[key]}
      </p>
    ) : null;

  return (
    <div className="grid gap-6">
      <form onSubmit={onSubmit} noValidate className="grid gap-4 rounded-md border border-line bg-surface p-4 sm:p-6">
        <div className="grid gap-1">
          <label htmlFor="service" className="font-semibold">
            {tr(u.service)}
          </label>
          <select id="service" className={field} value={form.service} onChange={(e) => set("service", e.target.value as ServiceChoice)}>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {tr(o.label)}
              </option>
            ))}
          </select>
          {err("service")}
        </div>

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
            <input id="days" type="number" min={1} max={30} className={field} value={form.days} onChange={(e) => set("days", Number(e.target.value))} />
            {err("days")}
          </div>
          <div className="grid gap-1">
            <label htmlFor="groupSize" className="font-semibold">
              {tr(u.groupSize)}
            </label>
            <input
              id="groupSize"
              type="number"
              min={1}
              max={40}
              className={field}
              value={form.groupSize}
              onChange={(e) => set("groupSize", Number(e.target.value))}
            />
            {err("groupSize")}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1">
            <label htmlFor="language" className="font-semibold">
              {tr(u.language)}
            </label>
            <input id="language" className={field} value={form.language} onChange={(e) => set("language", e.target.value)} />
            {err("language")}
          </div>
          <div className="grid gap-1">
            <label htmlFor="pickup" className="font-semibold">
              {tr(u.pickup)} <span className="font-normal text-muted">{tr(u.optional)}</span>
            </label>
            <input id="pickup" className={field} value={form.pickup} onChange={(e) => set("pickup", e.target.value)} />
            {err("pickup")}
          </div>
        </div>

        <div className="grid gap-1">
          <label htmlFor="interests" className="font-semibold">
            {tr(u.interests)} <span className="font-normal text-muted">{tr(u.optional)}</span>
          </label>
          <textarea
            id="interests"
            rows={4}
            className={field}
            placeholder={tr(u.interestsPlaceholder)}
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

        {/* 2026-11-16: 연락 방법을 먼저 고르고, 그 방법의 연락처를 받는다. */}
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

        <div className="grid gap-1">
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
          {err("heardFrom")}
        </div>

        {/* 스팸 봇용 숨은 칸. 사람에게는 보이지 않는다. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 overflow-hidden">
          <label htmlFor="website">Website</label>
          <input id="website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>

        <button
          type="submit"
          disabled={sending}
          className="justify-self-start rounded-md bg-sign px-5 py-3 font-semibold text-white hover:bg-sign-deep disabled:opacity-60"
        >
          {sending ? tr(u.sending) : tr(u.send)}
        </button>
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
      </form>

      {result ? (
        <section aria-live="polite" className="grid gap-3 rounded-md border border-sign/30 bg-sign-soft p-4 sm:p-6">
          {result.kind === "saved" ? (
            <>
              <h2 className="text-lg font-bold">
                {result.reference ? tr(u.savedTitleRef, { reference: result.reference }) : tr(u.savedTitle)}
              </h2>
              <p>{tr(u.savedText)}</p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold">{tr(u.notSentTitle)}</h2>
              <p>{tr(u.notSentText, { reason: result.reason })}</p>
            </>
          )}
          {locale.startsWith("en") ? null : <p className="text-sm text-muted">{tr(u.messageNote)}</p>}
          <pre className="overflow-x-auto rounded bg-surface p-3 text-sm whitespace-pre-wrap">{message}</pre>
          <div className="flex flex-wrap items-center gap-3">
            {site.whatsapp ? (
              <a
                href={whatsappLink(site.whatsapp, message)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-sign px-4 py-2 font-semibold text-white hover:bg-sign-deep"
              >
                {tr(u.sendWhatsApp)}
              </a>
            ) : null}
            <button type="button" onClick={copy} className="rounded-md border border-sign px-4 py-2 font-semibold text-sign-deep">
              {tr(u.copy)}
            </button>
            {copied ? <span className="text-sm text-muted">{copied}</span> : null}
          </div>
          {contact}
        </section>
      ) : null}
    </div>
  );
}

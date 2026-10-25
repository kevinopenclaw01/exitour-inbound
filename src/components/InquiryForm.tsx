"use client";

import { useState } from "react";
import {
  heardFromOptions,
  inquiryMessage,
  serviceOptions,
  validateInquiry,
  whatsappLink,
  type Inquiry,
  type InquiryErrors,
  type ServiceChoice,
} from "@/lib/inquiry";
import { ContactList } from "./ContactList";
import { site } from "@/content/site";

const empty: Inquiry = {
  service: "not-sure",
  startDate: "",
  days: 1,
  groupSize: 2,
  language: "English",
  pickup: "",
  interests: "",
  name: "",
  contact: "",
  heardFrom: "",
};

function todayKst(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

type Result = { kind: "saved"; reference: string | null } | { kind: "not-saved"; reason: string };

const field = "w-full rounded-md border border-line bg-surface px-3 py-2 text-base";

export function InquiryForm({ initialService }: { initialService?: ServiceChoice }) {
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
    setErrors(found);
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
        setErrors(data.errors);
        setResult(null);
      } else setResult({ kind: "not-saved", reason: "Our online form could not save your request right now." });
    } catch {
      setResult({ kind: "not-saved", reason: "Your connection dropped before the request was saved." });
    } finally {
      setSending(false);
    }
  }

  const message = result ? inquiryMessage(form, result.kind === "saved" ? result.reference ?? undefined : undefined) : "";

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied("Copied.");
    } catch {
      setCopied("Copy is blocked in this browser. Select the text above and copy it.");
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
            Service
          </label>
          <select id="service" className={field} value={form.service} onChange={(e) => set("service", e.target.value as ServiceChoice)}>
            {serviceOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {err("service")}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-1">
            <label htmlFor="startDate" className="font-semibold">
              First tour date
            </label>
            <input
              id="startDate"
              type="date"
              className={field}
              value={form.startDate}
              onChange={(e) => set("startDate", e.target.value)}
              aria-describedby={errors.startDate ? "startDate-error" : undefined}
            />
            {err("startDate")}
          </div>
          <div className="grid gap-1">
            <label htmlFor="days" className="font-semibold">
              Number of days
            </label>
            <input id="days" type="number" min={1} max={30} className={field} value={form.days} onChange={(e) => set("days", Number(e.target.value))} />
            {err("days")}
          </div>
          <div className="grid gap-1">
            <label htmlFor="groupSize" className="font-semibold">
              Group size
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
              Guide language
            </label>
            <input id="language" className={field} value={form.language} onChange={(e) => set("language", e.target.value)} />
            {err("language")}
          </div>
          <div className="grid gap-1">
            <label htmlFor="pickup" className="font-semibold">
              Hotel or pick-up area <span className="font-normal text-muted">(optional)</span>
            </label>
            <input id="pickup" className={field} value={form.pickup} onChange={(e) => set("pickup", e.target.value)} />
            {err("pickup")}
          </div>
        </div>

        <div className="grid gap-1">
          <label htmlFor="interests" className="font-semibold">
            What would you like to do? <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="interests"
            rows={4}
            className={field}
            placeholder="For example: Nami Island with grandparents, a Han River evening, sunset by the sea, K-drama spots"
            value={form.interests}
            onChange={(e) => set("interests", e.target.value)}
          />
          {err("interests")}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-1">
            <label htmlFor="name" className="font-semibold">
              Your name
            </label>
            <input id="name" className={field} value={form.name} onChange={(e) => set("name", e.target.value)} />
            {err("name")}
          </div>
          <div className="grid gap-1">
            <label htmlFor="contact" className="font-semibold">
              Email, WhatsApp or LINE
            </label>
            <input id="contact" className={field} value={form.contact} onChange={(e) => set("contact", e.target.value)} />
            {err("contact")}
          </div>
        </div>

        <div className="grid gap-1">
          <label htmlFor="heardFrom" className="font-semibold">
            How did you find us? <span className="font-normal text-muted">(optional)</span>
          </label>
          <select id="heardFrom" className={field} value={form.heardFrom} onChange={(e) => set("heardFrom", e.target.value)}>
            <option value="">Choose one</option>
            {heardFromOptions.map((o) => (
              <option key={o} value={o}>
                {o}
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
          {sending ? "Sending…" : "Send my request"}
        </button>
      </form>

      {result ? (
        <section aria-live="polite" className="grid gap-3 rounded-md border border-sign/30 bg-sign-soft p-4 sm:p-6">
          {result.kind === "saved" ? (
            <>
              <h2 className="text-lg font-bold">
                We received your request{result.reference ? ` (${result.reference})` : ""}
              </h2>
              <p>We will reply on the contact you gave us. For a faster answer, send the same request on WhatsApp.</p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold">Your request was not sent yet</h2>
              <p>{result.reason} Send it to us on WhatsApp, or copy it and use any channel below.</p>
            </>
          )}
          <pre className="overflow-x-auto rounded bg-surface p-3 text-sm whitespace-pre-wrap">{message}</pre>
          <div className="flex flex-wrap items-center gap-3">
            {site.whatsapp ? (
              <a
                href={whatsappLink(site.whatsapp, message)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-sign px-4 py-2 font-semibold text-white hover:bg-sign-deep"
              >
                Send on WhatsApp
              </a>
            ) : null}
            <button type="button" onClick={copy} className="rounded-md border border-sign px-4 py-2 font-semibold text-sign-deep">
              Copy the request
            </button>
            {copied ? <span className="text-sm text-muted">{copied}</span> : null}
          </div>
          <ContactList compact />
        </section>
      ) : null}
    </div>
  );
}

"use client";

import { useState } from "react";
import { site } from "@/content/site";
import {
  inquiryMessage,
  serviceOptions,
  validateInquiry,
  whatsappLink,
  type Inquiry,
  type InquiryErrors,
  type ServiceChoice,
} from "@/lib/inquiry";

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
};

function todayKst(): string {
  return new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

const field = "w-full rounded-md border border-line bg-surface px-3 py-2 text-base";

export function InquiryForm({ initialService }: { initialService?: ServiceChoice }) {
  const [form, setForm] = useState<Inquiry>({ ...empty, service: initialService ?? empty.service });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<string>("");

  function set<K extends keyof Inquiry>(key: K, value: Inquiry[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateInquiry(form, todayKst());
    setErrors(found);
    setMessage(Object.keys(found).length === 0 ? inquiryMessage(form) : null);
    setCopied("");
  }

  async function copy() {
    if (!message) return;
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
          <select
            id="service"
            className={field}
            value={form.service}
            onChange={(e) => set("service", e.target.value as ServiceChoice)}
          >
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
            <input
              id="days"
              type="number"
              min={1}
              max={30}
              className={field}
              value={form.days}
              onChange={(e) => set("days", Number(e.target.value))}
            />
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

        <button type="submit" className="justify-self-start rounded-md bg-sign px-5 py-3 font-semibold text-white hover:bg-sign-deep">
          Prepare my request
        </button>
      </form>

      {message ? (
        <section aria-live="polite" className="grid gap-3 rounded-md border border-sign/30 bg-sign-soft p-4 sm:p-6">
          <h2 className="text-lg font-bold">Your request is ready to send</h2>
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
          <p className="text-sm text-muted">
            {site.email || site.line || site.kakaoChannel
              ? [
                  site.email ? `Email: ${site.email}` : null,
                  site.line ? `LINE: ${site.line}` : null,
                  site.kakaoChannel ? `KakaoTalk: ${site.kakaoChannel}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")
              : "Our contact channels open with the launch of this site. Copy your request and keep it ready."}
          </p>
        </section>
      ) : null}
    </div>
  );
}

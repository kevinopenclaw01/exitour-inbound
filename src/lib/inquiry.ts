// 여행 요청 폼의 검증·문구. 폼(브라우저)과 /api/inquiry(서버)가 같은 함수를 쓴다.
// 저장은 Supabase(src/lib/supabase.ts), 사장님 알림은 src/lib/notify.ts.

// 2026-11-16: 지금 파는 두 상품만 고르게 한다. 다른 지역·큰 단체는 "not-sure"로 받아 상담한다.
// (DB의 service 칸은 예전 값 'guide-tour'도 받는다 — supabase/migrations. 다시 열 때 여기에 한 줄을 더하면 된다.)
export const serviceOptions = [
  { value: "private-driver", label: "Private car & driver" },
  { value: "driver-guide", label: "Private car & licensed guide" },
  { value: "not-sure", label: "Not sure yet / another region" },
] as const;

export type ServiceChoice = (typeof serviceOptions)[number]["value"];

/** "어떻게 알게 되셨나요?" — AI 검색 효과를 재는 항목(docs/04_ai-search-strategy.md 측정 3번). */
export const heardFromOptions = [
  "ChatGPT or another AI assistant",
  "Google or another search engine",
  "YouTube",
  "Instagram",
  "TikTok",
  "Reddit",
  "Tripadvisor",
  "Friend or family",
  "Travel agency",
  "Other",
] as const;

export interface Inquiry {
  service: ServiceChoice;
  startDate: string;
  days: number;
  groupSize: number;
  language: string;
  pickup: string;
  interests: string;
  name: string;
  contact: string;
  heardFrom: string;
}

export type InquiryErrors = Partial<Record<keyof Inquiry, string>>;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export function validateInquiry(input: Inquiry, today: string): InquiryErrors {
  const errors: InquiryErrors = {};
  if (!serviceOptions.some((o) => o.value === input.service)) errors.service = "Choose a service.";
  if (!DATE_RE.test(input.startDate)) errors.startDate = "Enter your first tour date.";
  else if (input.startDate < today) errors.startDate = "The date is in the past.";
  if (!Number.isInteger(input.days) || input.days < 1 || input.days > 30) errors.days = "Enter 1 to 30 days.";
  if (!Number.isInteger(input.groupSize) || input.groupSize < 1 || input.groupSize > 40)
    errors.groupSize = "Enter 1 to 40 people.";
  if (input.language.trim().length < 2) errors.language = "Tell us which language you need.";
  if (input.name.trim().length < 1) errors.name = "Enter your name.";
  if (input.contact.trim().length < 5) errors.contact = "Enter an email, WhatsApp number or LINE ID.";
  if (input.heardFrom && !(heardFromOptions as readonly string[]).includes(input.heardFrom))
    errors.heardFrom = "Choose an option from the list.";
  if (input.language.length > 60) errors.language = "Keep this under 60 characters.";
  if (input.name.length > 100) errors.name = "Keep this under 100 characters.";
  if (input.contact.length > 200) errors.contact = "Keep this under 200 characters.";
  if (input.pickup.length > 200) errors.pickup = "Keep this under 200 characters.";
  if (input.interests.length > 2000) errors.interests = "Keep this under 2,000 characters.";
  return errors;
}

/** DB 행(public.inquiries)으로 바꾼다. 앞뒤 공백 정리. */
export function inquiryRow(input: Inquiry, id: string, sourcePage: string) {
  return {
    id,
    service: input.service,
    start_date: input.startDate,
    days: input.days,
    group_size: input.groupSize,
    language: input.language.trim(),
    pickup: input.pickup.trim(),
    interests: input.interests.trim(),
    name: input.name.trim(),
    contact: input.contact.trim(),
    heard_from: input.heardFrom,
    source_page: sourcePage.slice(0, 200),
  };
}

/** 손님에게 보여 주는 요청 번호(UUID 앞 8자리, 대문자). */
export function referenceCode(id: string): string {
  return id.replace(/-/g, "").slice(0, 8).toUpperCase();
}

/** 브라우저에서 온 값을 Inquiry로 정리한다. 모르는 값은 빈 값으로. */
export function parseInquiry(body: unknown): Inquiry {
  const b = (typeof body === "object" && body !== null ? body : {}) as Record<string, unknown>;
  const str = (k: string) => (typeof b[k] === "string" ? (b[k] as string) : "");
  const num = (k: string) => (typeof b[k] === "number" ? (b[k] as number) : Number.NaN);
  return {
    service: str("service") as ServiceChoice,
    startDate: str("startDate"),
    days: num("days"),
    groupSize: num("groupSize"),
    language: str("language"),
    pickup: str("pickup"),
    interests: str("interests"),
    name: str("name"),
    contact: str("contact"),
    heardFrom: str("heardFrom"),
  };
}

export function inquiryMessage(input: Inquiry, reference?: string): string {
  const service = serviceOptions.find((o) => o.value === input.service)?.label ?? input.service;
  const lines = [
    reference ? `Trip request ${reference} — Entour Korea` : "Trip request — Entour Korea",
    `Service: ${service}`,
    `Start date: ${input.startDate} (${input.days} day${input.days === 1 ? "" : "s"})`,
    `Group size: ${input.groupSize}`,
    `Guide language: ${input.language.trim()}`,
  ];
  if (input.pickup.trim()) lines.push(`Pick-up area / hotel: ${input.pickup.trim()}`);
  if (input.interests.trim()) lines.push(`What we'd like to do: ${input.interests.trim()}`);
  lines.push(`Name: ${input.name.trim()}`, `Contact: ${input.contact.trim()}`);
  return lines.join("\n");
}

/** WhatsApp 링크. 번호는 국가번호 포함 숫자만. */
export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

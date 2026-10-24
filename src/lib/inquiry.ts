// 여행 요청 폼 → 상담 메시지. v0는 서버 저장 없이 메시지를 만들어 손님이 메신저·이메일로 보낸다.
// MVP에서 DB 저장(Supabase)으로 바꿀 때도 이 검증·문구 함수를 그대로 쓴다.

export const serviceOptions = [
  { value: "private-driver", label: "Private car & driver" },
  { value: "driver-guide", label: "Private car & licensed guide" },
  { value: "guide-tour", label: "Licensed guide tour & trip planning" },
  { value: "not-sure", label: "Not sure yet, help me choose" },
] as const;

export type ServiceChoice = (typeof serviceOptions)[number]["value"];

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
  return errors;
}

export function inquiryMessage(input: Inquiry): string {
  const service = serviceOptions.find((o) => o.value === input.service)?.label ?? input.service;
  const lines = [
    "Trip request — Entour Korea",
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

// 사이트 콘텐츠 타입. 나중에 관리자(CMS)·DB로 옮길 때 이 모양 그대로 테이블이 된다.

export type ServiceId = "private-driver" | "driver-guide" | "guide-tour";
export type VehicleId = "staria-9" | "staria-11" | "solati";
export type RegionId = "seoul" | "gyeonggi";

/** draft = 내부 검토용 제안가(구조화 데이터에 넣지 않음), confirmed = 확정가, on-request = 견적 문의 */
export type PriceStatus = "draft" | "confirmed" | "on-request";

export interface Faq {
  q: string;
  a: string;
}

export interface Vehicle {
  id: VehicleId;
  name: string;
  seats: number;
  /** 짐까지 실었을 때 편하게 타는 인원 */
  comfortablePax: number;
  note: string;
}

export interface Region {
  id: RegionId;
  name: string;
  examples: string;
}

export interface PriceRule {
  service: ServiceId;
  region: RegionId | "any";
  vehicles: VehicleId[];
  unit: "day" | "half-day";
  label: string;
  priceKrw: number | null;
  status: PriceStatus;
  note?: string;
}

export interface Service {
  id: ServiceId;
  path: string;
  name: string;
  /** 질문에 바로 답하는 첫 문단(AI 인용용). 숫자·조건을 넣는다. */
  answer: string;
  tagline: string;
  bestFor: string[];
  crew: string;
  includes: string[];
  excludes: string[];
  vehicle: "included" | "optional";
  faqs: Faq[];
  updated: string;
}

export interface PlanIdea {
  slug: string;
  name: string;
  area: string;
  summary: string;
  moments: string[];
  goodToKnow: string[];
}

export interface Article {
  slug: string;
  title: string;
  description: string;
  answer: string;
  sections: { heading: string; body: string[]; table?: { head: string[]; rows: string[][] } }[];
  faqs: Faq[];
  related: ServiceId[];
  updated: string;
}

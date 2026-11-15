// 사이트 콘텐츠 타입. 나중에 관리자(CMS)·DB로 옮길 때 이 모양 그대로 테이블이 된다.

export type ServiceId = "private-driver" | "driver-guide" | "guide-tour";
/** 지금 파는 두 상품(네 칸 표의 세로줄). guide-tour는 코드만 두고 메뉴·사이트맵에서 뺐다(2026-11-16). */
export type ProductId = "private-driver" | "driver-guide";
export type VehicleId = "staria-9" | "staria-11" | "solati";
export type RegionId = "seoul" | "gyeonggi";

/** draft = 내부 검토용 제안가(화면·구조화 데이터·llms.txt 어디에도 내보내지 않음), confirmed = 사장님이 확정한 값, on-request = 견적 문의 */
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

/** 값에 들어가는지 따지는 항목. 화면 이름은 src/content/pricing.ts의 costItemLabels. */
export type CostItemId = "fuel" | "tolls" | "parking" | "crew-meal" | "entrance-tickets";

/**
 * 네 칸 표의 한 칸(상품 × 지역). 홈과 /prices, 서비스 쪽, llms.txt, 구조화 데이터가 모두 이 자료에서 그린다.
 * priceKrw는 status가 "confirmed"일 때만 화면에 나간다.
 * items: true = 값에 포함, false = 불포함, null = 사장님 확인 전(화면에는 "견적서에 적는다"로만 나온다).
 */
export interface DayRate {
  service: ProductId;
  region: RegionId;
  priceKrw: number | null;
  status: PriceStatus;
  items: Record<CostItemId, boolean | null>;
  /** 10시간을 넘길 때 시간당 값. 사장님이 정하기 전에는 null(화면에는 "견적서에 적는다"). */
  extraHourKrw: number | null;
  /** 밤 종료 시간 제한이 없으면 true, 있으면 false, 확인 전이면 null(화면에 안 나온다) */
  noLateFinishLimit: boolean | null;
}

export interface Service {
  id: ServiceId;
  path: string;
  name: string;
  /** 메뉴·사이트맵·llms.txt에 싣는가. false면 주소로만 열리고 noindex다. */
  listed: boolean;
  /** 질문에 바로 답하는 첫 문단(AI 인용용). 숫자·조건을 넣는다. */
  answer: string;
  tagline: string;
  bestFor: string[];
  crew: string;
  /** 값과 상관없이 서비스에 들어 있는 것. 기름·통행료·주차처럼 지역마다 다른 항목은 pricing.ts의 dayRates에 둔다. */
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

/** 10시간 하루 예시의 한 구간. minutes는 그 구간에 쓰는 시간(이동이면 이동 시간). */
export interface DayStop {
  kind: "pickup" | "drive" | "visit" | "meal" | "dropoff";
  title: string;
  minutes: number;
  note?: string;
}

export interface DayPlan {
  slug: string;
  region: RegionId;
  name: string;
  area: string;
  summary: string;
  /** 출발 시각 "HH:MM". 구간 시간을 더하면 10시간이 된다(tests/dayPlans.test.ts가 확인). */
  start: string;
  stops: DayStop[];
  goodToKnow: string[];
  /** 이 일정의 실제 장소 사진(src/content/photos.ts의 placePhotos 키). 없으면 사진 없이 나온다. */
  photos?: string[];
  updated: string;
}

/** 기사·가이드 소개. 사장님이 준 실제 자료만 넣는다(이름·사진을 지어내지 않는다). */
export interface CrewMember {
  name: string;
  role: string;
  /** 본인 사진. public/images/crew/에 두고 src는 "/images/crew/파일이름". 본인 동의를 받은 실제 사진만. */
  photo: { src: string; alt: string } | null;
  /** 자격증 이름과 언어. 예: "Korean tourist guide licence (관광통역안내사), English". 자격증 사본으로 확인한 것만. */
  licence: string | null;
  /** 손님과 말할 수 있는 언어 */
  languages: string[];
  intro: string;
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

import type { CostItemId, DayRate, PriceRule, ProductId, RegionId } from "./types";

// 가격은 이 파일 한 곳에서만 바꾼다(AGENTS.md 절대 규칙).
//
// ■ 네 칸 표(dayRates): 지금 파는 두 상품 × 두 지역. 홈·/prices·서비스 쪽·llms.txt·구조화 데이터가 모두 여기서 그린다.
//   - 숫자는 status가 "confirmed"일 때만 화면·llms.txt·구조화 데이터(Offer)에 나간다.
//     "draft"와 "on-request"는 화면에 "Written quote …"로만 나오고 숫자는 어디에도 나가지 않는다.
//   - 사장님 확인 없이 "confirmed"로 바꾸지 않는다.
//   - items의 true/false는 사장님이 말씀하신 것만 적는다. 모르는 것은 null로 둔다(화면에는 "견적서에 적는다"로 나온다).
//
// ■ 사장님이 확정해 준 사실(2026-11-15~16)
//   - 하루 10시간, 스타리아 한 대, 최대 7인 탑승, 팀당 값
//   - 서울 상품: 기름·통행료·주차 포함, 밤 종료 시간 제한 없음
//   - 서울 시내와 경기권은 정해진 상품, 그 밖의 지역은 상담
// ■ 네 칸의 값: 2026-11-16 사장님 「판매가는 넷가 +8만 원, 달러는 자동으로 맞춰서」 → 네 칸 모두 confirmed.
//   넷가와 계산 근거는 저장소에 적지 않는다(보고서: 미디어팀\밀우전\보고서\클로드6-11-16_EntourKorea_판매가_구매.md).
// ■ 아직 받지 못한 것(null): 경기 상품의 기름·통행료·주차, 기사 식사, 입장료, 초과 시간 값, 취소 규정
//   (docs/10_narrow-launch.md "사장님께 받을 것")

/**
 * 달러 표시용 환율(원 → 달러). 달러 값은 화면에 "≈ US$…"로만 나오고, 손님이 실제로 내는 값은 원화다.
 * 2026-11-16 클룩 표시값(₩236,000 = US$176.69)에서 거꾸로 계산한 값. 환율이 크게 바뀌면 이 숫자 하나만 고친다.
 */
export const krwPerUsd = 1340;

/** 네 칸에 공통인 조건. 사장님 확정(2026-11-15~16). */
export const dayProduct = {
  hours: 10,
  vehicle: "Hyundai Staria",
  maxPassengers: 7,
} as const;

export const productOrder: ProductId[] = ["private-driver", "driver-guide"];
export const regionOrder: RegionId[] = ["seoul", "gyeonggi"];

export const productLabels: Record<ProductId, { name: string; hint: string }> = {
  "private-driver": { name: "Driver only", hint: "Van + driver. The driver drives and waits; no guiding." },
  "driver-guide": { name: "Driver-guide", hint: "Van + a licensed tourist guide who drives and comes in with you." },
};

export const regionLabels: Record<RegionId, { name: string; hint: string }> = {
  seoul: { name: "Seoul", hint: "Days inside Seoul city" },
  gyeonggi: { name: "Gyeonggi", hint: "Day trips from Seoul into Gyeonggi province" },
};

export const costItemOrder: CostItemId[] = ["fuel", "tolls", "parking", "crew-meal", "entrance-tickets"];

/** 화면에 나오는 항목 이름. crew-meal은 상품에 따라 "Driver's meal" / "Driver-guide's meal"로 바뀐다(lib/pricing.ts). */
export const costItemLabels: Record<CostItemId, string> = {
  fuel: "Fuel",
  tolls: "Expressway tolls",
  parking: "Parking",
  "crew-meal": "Driver's meal",
  "entrance-tickets": "Entrance tickets",
};

const seoulItems = { fuel: true, tolls: true, parking: true, "crew-meal": null, "entrance-tickets": null } as const;
// 경기 상품의 기름·통행료·주차는 사장님이 아직 말씀하지 않았다. (파트너 원가는 유류 포함이라고 했지만 — docs/06 — 우리 상품 조건으로 확정된 것은 아니다.)
const gyeonggiItems = { fuel: null, tolls: null, parking: null, "crew-meal": null, "entrance-tickets": null } as const;

export const dayRates: DayRate[] = [
  {
    service: "private-driver",
    region: "seoul",
    priceKrw: 327700,
    status: "confirmed",
    items: { ...seoulItems },
    extraHourKrw: null,
    noLateFinishLimit: true,
  },
  {
    service: "private-driver",
    region: "gyeonggi",
    priceKrw: 385600,
    status: "confirmed",
    items: { ...gyeonggiItems },
    extraHourKrw: null,
    noLateFinishLimit: null,
  },
  {
    service: "driver-guide",
    region: "seoul",
    priceKrw: 430000,
    status: "confirmed",
    items: { ...seoulItems },
    extraHourKrw: null,
    noLateFinishLimit: true,
  },
  {
    service: "driver-guide",
    region: "gyeonggi",
    priceKrw: 480000,
    status: "confirmed",
    items: { ...gyeonggiItems },
    extraHourKrw: null,
    noLateFinishLimit: null,
  },
];

// ■ 그 밖의 값(지금은 숨긴 /guide-tour 쪽에서만 쓴다). 초안 숫자는 화면에 나가지 않는다.
export const priceRules: PriceRule[] = [
  {
    service: "guide-tour",
    region: "any",
    vehicles: [],
    unit: "day",
    label: "Full day, licensed guide",
    priceKrw: 230000,
    status: "draft",
    note: "Guide fee only, per group",
  },
  {
    service: "guide-tour",
    region: "any",
    vehicles: [],
    unit: "half-day",
    label: "Half day, licensed guide",
    priceKrw: null,
    status: "on-request",
  },
];

import { site } from "./site";

// 약관(/terms)·개인정보처리방침(/privacy)·취소 환불 규정(/cancellation-policy)에 들어가는 값.
// ■ null·빈 배열은 사장님이 아직 정하지 않은 값이다. 지어내지 않는다.
// ■ 필요한 값이 다 채워지기 전에는 그 문서를 바닥글·사이트맵에 걸지 않고 noindex로 둔다(legalStatus가 판단).
//   주소를 직접 치면 "Draft" 표시와 함께 열린다(사장님·변호사 검토용).
// ■ 문서 본문은 src/app/terms, privacy, cancellation-policy 의 page.tsx에 있다. 첫 판매 전에 변호사 확인을 받는다(docs/05_legal-notes.md).

export const legal = {
  /** 세 문서의 시행일 "YYYY-MM-DD". 사장님이 공개를 승인한 날. */
  effectiveDate: null as string | null,

  cancellation: {
    /**
     * 취소 시점별 환불. 예: { when: "7 days or more before the tour date", refund: "Full refund" }
     * 지킬 수 있는 숫자만 넣는다("24시간 무료 취소" 같은 문구를 근거 없이 쓰지 않는다 — docs/09 2-3).
     */
    tiers: [] as { when: string; refund: string }[],
    /** 나타나지 않은 경우(노쇼) */
    noShow: null as string | null,
    /** 날짜 변경 */
    dateChange: null as string | null,
    /** 날씨·천재지변, 우리 쪽 사정으로 취소할 때 */
    byUs: null as string | null,
    /** 환불 방법과 걸리는 시간 */
    refundMethod: null as string | null,
  },

  payment: {
    /** 결제 방법. 예: "PayPal invoice in USD" */
    methods: null as string | null,
    /** 예약 확정에 필요한 선금. 예: "30% deposit, balance on the day" */
    deposit: null as string | null,
  },

  privacy: {
    /** 개인정보 보호책임자 이름·직책 */
    officer: null as string | null,
    /** 개인정보 문의 연락처(이메일 권장) */
    officerContact: null as string | null,
    /** 여행 요청 정보를 보관하는 기간. 예: "12 months after your last message" */
    retention: null as string | null,
    /** 사이트를 올린 곳(배포 뒤에 채운다). 예: "Vercel Inc. (website hosting)" */
    hosting: null as string | null,
    /**
     * 렌트 계약에 쓰는 여권 정보를 어떻게 받고 보관하고 지우는지(영어 문장).
     * docs/05_legal-notes.md: 여권 영문 이름·번호 필요 → 암호화 보관, 사용 후 삭제. 실제 절차가 정해지면 넣는다.
     */
    rentalDetails: null as string | null,
  },

  /** 분쟁이 생겼을 때 관할 법원. 예: "Seoul Central District Court" */
  court: null as string | null,
  /** 승객 보험 보장 범위와 책임 한도 문구(영어). 렌터카 업체 보험 내용을 확인하고 변호사 검토를 받은 뒤 넣는다. */
  liability: null as string | null,
};

export type LegalDoc = "terms" | "privacy" | "cancellation";

const companyMissing = (): string[] => {
  const missing: string[] = [];
  if (!site.representative) missing.push("site.representative (대표자)");
  if (!site.businessNumber) missing.push("site.businessNumber (사업자등록번호)");
  if (!site.operatorLicense.number) missing.push("site.operatorLicense.number (관광사업자 등록번호)");
  if (!site.address) missing.push("site.address (주소)");
  if (!site.email) missing.push("site.email (이메일)");
  return missing;
};

/** 문서별로 아직 비어 있는 값. 빈 배열이면 공개해도 된다. */
export function legalMissing(doc: LegalDoc): string[] {
  const missing = companyMissing();
  if (!legal.effectiveDate) missing.push("legal.effectiveDate (시행일)");
  const cancellationMissing = () => {
    const m: string[] = [];
    if (legal.cancellation.tiers.length === 0) m.push("legal.cancellation.tiers (취소 시점별 환불)");
    if (!legal.cancellation.noShow) m.push("legal.cancellation.noShow (노쇼)");
    if (!legal.cancellation.dateChange) m.push("legal.cancellation.dateChange (날짜 변경)");
    if (!legal.cancellation.byUs) m.push("legal.cancellation.byUs (날씨·우리 쪽 사정 취소)");
    if (!legal.cancellation.refundMethod) m.push("legal.cancellation.refundMethod (환불 방법)");
    return m;
  };
  if (doc === "cancellation") missing.push(...cancellationMissing());
  if (doc === "terms") {
    missing.push(...cancellationMissing());
    if (!legal.payment.methods) missing.push("legal.payment.methods (결제 방법)");
    if (!legal.payment.deposit) missing.push("legal.payment.deposit (선금)");
    if (!legal.court) missing.push("legal.court (관할 법원)");
    if (!legal.liability) missing.push("legal.liability (보험·책임 한도 문구)");
  }
  if (doc === "privacy") {
    if (!legal.privacy.officer) missing.push("legal.privacy.officer (개인정보 보호책임자)");
    if (!legal.privacy.officerContact) missing.push("legal.privacy.officerContact (개인정보 문의 연락처)");
    if (!legal.privacy.retention) missing.push("legal.privacy.retention (보관 기간)");
    if (!legal.privacy.hosting) missing.push("legal.privacy.hosting (사이트를 올린 곳)");
    if (!legal.privacy.rentalDetails) missing.push("legal.privacy.rentalDetails (렌트 계약용 여권 정보 처리)");
  }
  return missing;
}

/** 필요한 값이 다 채워져 공개 메뉴·사이트맵에 걸어도 되는가. */
export function legalPublished(doc: LegalDoc): boolean {
  return legalMissing(doc).length === 0;
}

export const legalDocs: { doc: LegalDoc; path: string; label: string }[] = [
  { doc: "terms", path: "/terms", label: "Terms of service" },
  { doc: "privacy", path: "/privacy", label: "Privacy policy" },
  { doc: "cancellation", path: "/cancellation-policy", label: "Cancellation & refunds" },
];

/** 바닥글·사이트맵에 걸 문서(값이 다 채워진 것만). */
export function publishedLegalDocs() {
  return legalDocs.filter((d) => legalPublished(d.doc));
}

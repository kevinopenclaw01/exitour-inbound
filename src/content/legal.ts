import { site } from "./site";

// 약관(/terms)·개인정보처리방침(/privacy)·취소 환불 규정(/cancellation-policy)에 들어가는 값.
// ■ null·빈 배열은 사장님이 아직 정하지 않은 값이다. 지어내지 않는다.
// ■ 필요한 값이 다 채워지기 전에는 그 문서를 바닥글·사이트맵에 걸지 않고 noindex로 둔다(legalStatus가 판단).
//   주소를 직접 치면 "Draft" 표시와 함께 열린다(사장님·변호사 검토용).
// ■ 문서 본문은 src/app/terms, privacy, cancellation-policy 의 page.tsx에 있다. 첫 판매 전에 변호사 확인을 받는다(docs/05_legal-notes.md).

export const legal = {
  /** 세 문서의 시행일 "YYYY-MM-DD". 사장님이 공개를 승인한 날. */
  effectiveDate: "2026-11-17" as string | null,

  cancellation: {
    /**
     * 취소 시점별 환불. 예: { when: "7 days or more before the tour date", refund: "Full refund" }
     * 지킬 수 있는 숫자만 넣는다("24시간 무료 취소" 같은 문구를 근거 없이 쓰지 않는다 — docs/09 2-3).
     */
    // 2026-11-17 사장님 확정(엑시투어 「일반 단품」 기준과 같다). 마감은 그날 한국 시간 17시.
    tiers: [
      { when: "By 17:00 Korea time, 7 days before your day", refund: "Full refund" },
      { when: "By 17:00 Korea time, 3 days before your day", refund: "70% refund (30% cancellation fee)" },
      { when: "By 17:00 Korea time, 2 days before your day", refund: "50% refund (50% cancellation fee)" },
      { when: "After 17:00 Korea time, 2 days before your day", refund: "No refund" },
    ] as { when: string; refund: string }[],
    /** 나타나지 않은 경우(노쇼) */
    noShow: "If you do not come to the agreed pick-up place and do not tell us, the day counts as used and there is no refund." as string | null,
    /** 날짜 변경 */
    dateChange: "You can move your day to another date at no cost until 17:00 Korea time, 7 days before your day, if a van and crew are free on the new date. After that, a change of date counts as a cancellation under the table above." as string | null,
    /** 날씨·천재지변, 우리 쪽 사정으로 취소할 때 */
    byUs: "If we cannot run your day, or a typhoon, a government order or another event outside anyone's control stops it, we offer you another date. If you do not want another date, we refund what you paid in full." as string | null,
    /** 환불 방법과 걸리는 시간 */
    refundMethod: "Refunds go back to the card or payment method you used. We start the refund within 3 business days after the amount is settled; your card company or payment provider may take a few more days. If you paid in another currency, the amount you get back can differ because of exchange rates." as string | null,
  },

  payment: {
    /** 결제 방법. 예: "PayPal invoice in USD" */
    // 2026-11-17: 외국인 결제는 포트원을 거쳐 페이팔로 받는다(사장님 결정). 페이팔은 원화(KRW)를 받지 않아 달러로 청구된다.
    methods: "Card or PayPal payment through a secure PayPal payment link that we send after we confirm the van and crew for your date. Prices are quoted in Korean won (KRW). PayPal does not accept KRW, so you are charged in US dollars (USD); the USD amount is shown before you pay." as string | null,
    /** 예약 확정에 필요한 선금. 예: "30% deposit, balance on the day" */
    deposit: "No deposit. You pay the full amount through the payment link to confirm the booking." as string | null,
  },

  privacy: {
    /** 개인정보 보호책임자 이름·직책 */
    officer: "Kang Sangwook, Representative" as string | null,
    /** 개인정보 문의 연락처(이메일 권장) */
    officerContact: "exitour0ffice@gmail.com" as string | null,
    /** 여행 요청 정보를 보관하는 기간. 예: "12 months after your last message" */
    retention: "Trip requests that do not become a booking: 12 months after your last message. Booking and payment records: 5 years, and records of complaints or disputes: 3 years, as Korean e-commerce law requires. After that we delete them." as string | null,
    /** 사이트를 올린 곳(배포 뒤에 채운다). 예: "Vercel Inc. (website hosting)" */
    hosting: "Vercel Inc. (United States), which runs this website; requests are processed in its Seoul region" as string | null,
    /** 결제를 처리하는 곳(개인정보처리방침 4. Who receives it). PG 심사가 이름을 요구한다(2026-11-17 포트원). 결제대행사를 바꾸면 여기만 고친다. */
    paymentProviders: [
      "PortOne (Korea), which connects this website to the payment company below",
      "PayPal, which processes your PayPal or card payment",
    ] as string[],
    /**
     * 렌트 계약에 쓰는 여권 정보를 어떻게 받고 보관하고 지우는지(영어 문장).
     * docs/05_legal-notes.md: 여권 영문 이름·번호 필요 → 암호화 보관, 사용 후 삭제. 실제 절차가 정해지면 넣는다.
     */
    rentalDetails: "For the rental contract we ask, after you book, for the lead traveller's name as in the passport, date of birth and passport number. We send them only to the rental company for the contract and delete them from our chats and records within 30 days after your day." as string | null,
  },

  /** 분쟁이 생겼을 때 관할 법원. 예: "Seoul Central District Court" */
  court: "Seoul Central District Court" as string | null,
  /** 승객 보험 보장 범위와 책임 한도 문구(영어). 렌터카 업체 보험 내용을 확인하고 변호사 검토를 받은 뒤 넣는다. */
  liability: "The van is a registered rental vehicle insured by the rental company, as Korean law requires for rental cars. If you are hurt or your belongings are damaged through our fault or the fault of the driver or guide we arranged, we are responsible under Korean law. We are not responsible for loss caused by events outside our control, or by not following the safety instructions of the driver or guide." as string | null,
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

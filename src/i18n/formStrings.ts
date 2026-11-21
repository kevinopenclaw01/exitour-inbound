import { contactMethods, heardFromLabels, inquiryErrorText, serviceOptions } from "@/lib/inquiry";
import { productLabels, productOrder, regionLabels, regionOrder } from "@/content/pricing";
import { bookingErrorText } from "@/lib/booking";
import { msg } from "./msg";

// 여행 요청 폼(브라우저에서 도는 조각)에 나오는 영어 문장 전부. 서버(plan 쪽)가 이 목록만 번역해 폼에 넘긴다.
// 폼에 새 문장을 넣으면 여기에도 넣는다(넣지 않으면 영어로 나온다).

export const formUi = {
  service: msg("Service"),
  firstDate: msg("First tour date"),
  days: msg("Number of days"),
  groupSize: msg("Group size"),
  language: msg("Guide language"),
  pickup: msg("Hotel or pick-up area"),
  optional: msg("(optional)"),
  interests: msg("What would you like to do?"),
  interestsPlaceholder: msg(
    "For example: a first day in Seoul with grandparents, Nami Island with kids, or another region you want to visit",
  ),
  name: msg("Your name"),
  contactMethod: msg("How should we contact you?"),
  heardFrom: msg("How did you find us?"),
  chooseOne: msg("Choose one"),
  sending: msg("Sending…"),
  send: msg("Send my request"),
  privacyNote: msg("We use these details only to reply to your request and prepare your quote."),
  privacyLink: msg("Privacy policy (English)"),
  savedTitle: msg("We received your request"),
  savedTitleRef: msg("We received your request ({reference})"),
  savedText: msg("We will reply on the contact you gave us. For a faster answer, send the same request on WhatsApp."),
  notSentTitle: msg("Your request was not sent yet"),
  notSentText: msg("{reason} Send it to us on WhatsApp, or copy it and use any channel below."),
  reasonServer: msg("Our online form could not save your request right now."),
  reasonConnection: msg("Your connection dropped before the request was saved."),
  messageNote: msg("This is the message we receive, in English:"),
  sendWhatsApp: msg("Send on WhatsApp"),
  copy: msg("Copy the request"),
  copied: msg("Copied."),
  copyBlocked: msg("Copy is blocked in this browser. Select the text above and copy it."),
  // 날짜 고르기(DatePicker)
  chooseDate: msg("Choose a date"),
  chooseFirstDate: msg("Choose your first tour date"),
  prevMonth: msg("Previous month"),
  nextMonth: msg("Next month"),
  koreaTime: msg("Dates are in Korea time."),
} as const;

/** 구매 화면(/book, BookingForm)에만 나오는 문장. 나머지는 formUi와 같은 문장을 쓴다. */
export const bookingUi = {
  product: msg("What do you need?"),
  region: msg("Where?"),
  passengers: msg("Passengers"),
  language: msg("Language for your driver or guide"),
  pickup: msg("Hotel or pick-up address"),
  notes: msg("Anything we should know?"),
  notesPlaceholder: msg("For example: places you want to visit, start time, children's ages, luggage"),
  summary: msg("Your price"),
  perDay: msg("{price} a day × {days} days"),
  total: msg("Total"),
  perGroup: msg("per group, not per person"),
  usdNote: msg("The US dollar amount is an estimate. The price is charged in Korean won."),
  tip: msg("Tip: US${tip} per person per day, paid separately."),
  howTitle: msg("How booking works"),
  how1: msg("Send this booking. Nothing is charged now."),
  how2: msg("We check a driver and van for your date and reply on the contact you chose."),
  how3: msg("We send you a secure payment link. Your booking is confirmed when the payment is received."),
  book: msg("Book now"),
  booking: msg("Booking…"),
  savedTitle: msg("Booking received ({reference})"),
  savedText: msg("Total {total} ({usd}). We will reply on {method} to confirm your driver and send the payment link. Nothing has been charged yet."),
  notOpen: msg("Online booking is not open for this choice yet. Send a trip request and we reply with a written price."),
  bigger: msg("More than 7 passengers, more than 14 days or another region?"),
  sendRequest: msg("Send a trip request"),
} as const;

/** 페이팔 결제 화면(/pay, PayPalForm)에만 나오는 문장. 상품·지역·합계는 구매 화면과 같은 문장을 쓴다(2026-11-21). */
export const payUi = {
  reference: msg("Booking number"),
  referenceHint: msg("It is in the message we sent you. Leave it empty if you do not have one."),
  firstName: msg("First name"),
  lastName: msg("Last name"),
  email: msg("Email for your receipt"),
  agree: msg("I have read the terms of service and the cancellation policy, and I agree that my name and email go to PortOne and PayPal to take this payment."),
  charged: msg("Charged by PayPal: US${usd}"),
  chargedNote: msg("PayPal does not take Korean won, so we charge the US dollar amount above. The price in won is {krw}."),
  koreanAccount: msg("PayPal accounts registered in Korea cannot be used for this payment."),
  fillFirst: msg("Fill in your name and email and tick the box. Then the PayPal button appears here."),
  loading: msg("Loading PayPal…"),
  loadFailed: msg("The PayPal button could not load. Try again later or contact us."),
  paidTitle: msg("Payment received"),
  paidText: msg("Payment number {paymentId}. We confirm your booking on the contact you gave us."),
  failed: msg("The payment was not completed: {reason}"),
  failedPlain: msg("The payment was not completed. You can try again."),
  testPaid: msg("This was a test payment. No money was taken."),
  nameError: msg("Enter your first and last name in English letters."),
  emailError: msg("Enter a valid email address."),
} as const;

/** 페이팔 결제 화면이 쓰는 영어 문장(번역해서 넘길 열쇠). */
export function payStrings(): string[] {
  return [
    ...Object.values(payUi),
    bookingUi.product,
    bookingUi.region,
    bookingUi.summary,
    bookingUi.perDay,
    bookingUi.total,
    bookingUi.perGroup,
    bookingUi.notOpen,
    formUi.days,
    formUi.optional,
    bookingErrorText.days,
    ...productOrder.flatMap((p) => [productLabels[p].name, productLabels[p].hint]),
    ...regionOrder.flatMap((r) => [regionLabels[r].name, regionLabels[r].hint]),
  ];
}

/** 구매 화면이 쓰는 영어 문장(번역해서 넘길 열쇠). 상품·지역 이름은 src/content/pricing.ts의 것을 쓴다. */
export function bookingStrings(): string[] {
  return [
    ...formStrings(),
    ...Object.values(bookingUi),
    ...Object.values(bookingErrorText),
    ...productOrder.flatMap((p) => [productLabels[p].name, productLabels[p].hint]),
    ...regionOrder.flatMap((r) => [regionLabels[r].name, regionLabels[r].hint]),
  ];
}

/** 폼이 쓰는 모든 영어 문장(번역해서 넘길 열쇠). */
export function formStrings(): string[] {
  return [
    ...Object.values(formUi),
    ...serviceOptions.map((o) => o.label),
    ...contactMethods.flatMap((m) => [m.label, m.field]),
    ...Object.values(heardFromLabels),
    ...Object.values(inquiryErrorText),
  ];
}

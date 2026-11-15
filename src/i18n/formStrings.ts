import { heardFromLabels, inquiryErrorText, serviceOptions } from "@/lib/inquiry";
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
  contact: msg("Email, WhatsApp or LINE"),
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

/** 폼이 쓰는 모든 영어 문장(번역해서 넘길 열쇠). */
export function formStrings(): string[] {
  return [
    ...Object.values(formUi),
    ...serviceOptions.map((o) => o.label),
    ...Object.values(heardFromLabels),
    ...Object.values(inquiryErrorText),
  ];
}

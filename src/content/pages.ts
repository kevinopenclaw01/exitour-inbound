// 쪽마다 다른 제목·설명·공유 그림 문구. 한 곳에 모아 두어 겹치지 않는지 시험이 확인한다(tests/meta.test.ts).
// - title: 검색 결과 제목. 홈을 뺀 쪽은 뒤에 " | Entour Korea"가 붙는다(layout.tsx).
// - description: 검색 결과 설명. 160자 안쪽으로 쓴다(구글이 그쯤에서 자른다).
// - og: 공유 그림(/og/<key>.png)에 찍히는 큰 글자와 작은 글자. 값·후기처럼 확정되지 않은 것은 넣지 않는다.
// - index: false면 noindex(검색에 내보내지 않음)이고 사이트맵·llms.txt에도 없다.
// 안내 글(/travel-guide/...)의 제목·설명은 src/content/articles.ts에 있다.

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  og: { title: string; sub: string };
  index?: false;
}

export const pages = {
  home: {
    path: "/",
    title: "Entour Korea: private van & driver-guide days in Seoul",
    description:
      "10-hour private van days in Seoul and Gyeonggi for up to 7 people: a Hyundai Staria with a driver only or a licensed guide in your language. Priced per group.",
    og: { title: "Your own van and driver in Korea", sub: "10-hour private days in Seoul and Gyeonggi, for up to 7" },
  },
  "private-driver": {
    path: "/private-driver",
    title: "Private van with driver in Seoul and Gyeonggi, 10 hours",
    description:
      "A private Hyundai Staria with a professional driver for a 10-hour day in Seoul or Gyeonggi, up to 7 passengers, priced per group. The driver drives and waits.",
    og: { title: "Private van with driver", sub: "10 hours in Seoul or Gyeonggi. You decide where to go." },
  },
  "driver-guide": {
    path: "/driver-guide",
    title: "Licensed driver-guide with a private van in Seoul, 10 hours",
    description:
      "A private Hyundai Staria with a licensed tourist guide in your language for a 10-hour day in Seoul or Gyeonggi, up to 7 people. The guide explains each sight.",
    og: { title: "Licensed driver-guide with a private van", sub: "A licensed guide in your language. 10 hours in Seoul or Gyeonggi." },
  },
  prices: {
    path: "/prices",
    title: "Prices: 10-hour private van days in Seoul and Gyeonggi",
    description:
      "Per-group prices for a 10-hour private van day with a driver or a licensed driver-guide in Seoul and Gyeonggi, and what each price includes.",
    og: { title: "Prices per group, not per person", sub: "Driver only or driver-guide. Seoul or Gyeonggi. 10 hours." },
  },
  book: {
    path: "/book",
    title: "Book a private van day in Seoul or Gyeonggi",
    description:
      "Choose driver only or a licensed driver-guide, Seoul or Gyeonggi, and your dates. See the price per group straight away and book online.",
    og: { title: "Book a private van day", sub: "See the price per group and book online" },
  },
  plan: {
    path: "/plan",
    title: "Plan my trip: send a trip request",
    description:
      "Send your dates, group size and ideas. We check the van and crew for your date and reply with the price and what it includes in writing.",
    og: { title: "Plan my trip", sub: "Send your dates and group size. We reply with a written price." },
  },
  "day-plans": {
    path: "/day-plans",
    title: "10-hour day plans: Seoul and Gyeonggi by private van",
    description:
      "Four example 10-hour days by private van, hour by hour with realistic drive times: two in Seoul and two Gyeonggi day trips. Every plan can be changed.",
    og: { title: "What fits in a 10-hour day", sub: "Four example days in Seoul and Gyeonggi, hour by hour" },
  },
  faq: {
    path: "/faq",
    title: "FAQ: private driver and driver-guide days in Korea",
    description:
      "Answers about booking, the van, drivers, licensed driver-guides, languages, areas and what the price includes for private van days in Korea.",
    og: { title: "Questions travellers ask", sub: "Booking, the van, drivers, licensed guides and prices" },
  },
  about: {
    path: "/about",
    title: "About Entour Korea, the inbound brand of Exitour",
    description:
      "Entour Korea is the inbound travel brand of Exitour, a registered general travel agency in Korea, arranging private van days for visitors to Seoul and Gyeonggi.",
    og: { title: "About Entour Korea", sub: "The inbound brand of Exitour, a registered travel agency in Korea" },
  },
  contact: {
    path: "/contact",
    title: "Contact us on WhatsApp, LINE or KakaoTalk",
    description:
      "Message Entour Korea on WhatsApp, LINE or KakaoTalk to ask about a private driver or licensed driver-guide day in Seoul or Gyeonggi. We reply 09:00–18:00 KST.",
    og: { title: "Contact us", sub: "WhatsApp, LINE or KakaoTalk. We reply 09:00–18:00 Korea time." },
  },
  safety: {
    path: "/safety",
    title: "Licensed & safe: how our drivers and guides are set up",
    description:
      "How Entour Korea keeps private van days legal: a registered travel agency, registered rental vans with drivers, licensed tourist guides and no forced shopping.",
    og: { title: "Licensed & safe", sub: "Registered agency, registered rental vans, licensed guides" },
  },
  "airport-transfer": {
    path: "/airport-transfer",
    title: "Airport pick-up and drop-off: Incheon and Gimpo to Seoul",
    description:
      "Private van pick-up and drop-off at Incheon (T1 and T2) and Gimpo airports: a name board at arrivals, flight tracking and a price per van. Quote on request.",
    og: { title: "Airport pick-up and drop-off", sub: "Incheon and Gimpo to your hotel, by private van" },
  },
  "travel-guide": {
    path: "/travel-guide",
    title: "Travel guide: straight answers for a private day in Korea",
    description:
      "Straight answers about private drivers, licensed guides, airport transfers and day trips in Korea, written for families and small groups planning a visit.",
    og: { title: "Travel guide", sub: "Straight answers about drivers, guides and day trips in Korea" },
  },
  terms: {
    path: "/terms",
    title: "Terms of service",
    description: "The terms that apply when you request and book a private van day with Entour Korea, operated by Exitour.",
    og: { title: "Terms of service", sub: "Entour Korea, operated by Exitour" },
  },
  privacy: {
    path: "/privacy",
    title: "Privacy policy",
    description: "What personal information Entour Korea collects when you send a trip request, why we use it, how long we keep it and how to reach us.",
    og: { title: "Privacy policy", sub: "Entour Korea, operated by Exitour" },
  },
  cancellation: {
    path: "/cancellation-policy",
    title: "Cancellation and refund policy",
    description: "How cancellations, date changes, no-shows and refunds work for private van days booked with Entour Korea.",
    og: { title: "Cancellation and refunds", sub: "Entour Korea, operated by Exitour" },
  },
  // ── 아래 두 쪽은 코드만 두고 숨겼다(2026-11-16). 주소로는 열리지만 noindex이고 메뉴·사이트맵·llms.txt에 없다.
  "guide-tour": {
    path: "/guide-tour",
    title: "Licensed guide tours and custom trip planning in Seoul",
    description: "A licensed guide for a half or full day in Seoul, on foot or by subway, with the day planned around what you like.",
    og: { title: "Licensed guide tour & trip planning", sub: "Entour Korea" },
    index: false,
  },
  "join-as-guide": {
    path: "/join-as-guide",
    title: "Work with us as a licensed guide",
    description: "Licensed tourist guides (관광통역안내사) and driver-guides: how to work with Entour Korea.",
    og: { title: "Work with us as a licensed guide", sub: "Entour Korea" },
    index: false,
  },
} satisfies Record<string, PageMeta>;

export type PageKey = keyof typeof pages;

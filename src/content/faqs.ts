import type { Faq } from "./types";

// 사이트 전체 FAQ. 서비스별 FAQ는 services.ts에 있다.

export const generalFaqs: Faq[] = [
  {
    q: "Who operates Entour Korea?",
    a: "Entour Korea is operated by Exitour, a travel agency registered in Korea as a general travel agency (종합여행업), which is the licence type required to serve foreign visitors.",
  },
  {
    q: "How do I book?",
    a: "Send a trip request with your dates, group size, language and what you want to do. We confirm a licensed guide and a registered van for your date, send a quote, and your booking is confirmed when the deposit is paid.",
  },
  {
    q: "Which van fits my group?",
    a: "With suitcases: Staria 9-seater for up to 6 people, Staria 11-seater for 7–8, Solati minibus for up to 11–12. Without luggage each van takes a few more people.",
  },
  {
    q: "Which areas do you cover?",
    a: "Seoul, Gyeonggi-do (for example Nami Island, Suwon and Everland) and Incheon, including Incheon and Gimpo airports. Ask us about longer trips.",
  },
  {
    q: "Do you take us to shops for commission?",
    a: "No. There is no forced shopping on our tours. You visit only the shops you ask for.",
  },
  {
    q: "Do you sell sedans?",
    a: "No. Private tours in Korea run almost entirely on Staria vans and Solati minibuses, which are more comfortable for luggage and groups.",
  },
];

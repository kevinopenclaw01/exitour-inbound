import type { Faq } from "./types";

// 사이트 전체 FAQ. 서비스별 FAQ는 services.ts에 있고, 값·포함 항목처럼 pricing.ts에서 나오는 답은 src/lib/productFaqs.ts가 만든다.
// 시간·인원·지역 숫자는 pricing.ts의 dayProduct와 같아야 한다(tests/products.test.ts가 확인).

export const generalFaqs: Faq[] = [
  {
    q: "Who operates Entour Korea?",
    a: "Entour Korea is operated by Exitour, a travel agency registered in Korea as a general travel agency (종합여행업), which is the licence type required to serve foreign visitors.",
  },
  {
    q: "How do I book?",
    a: "Send a trip request with your dates, group size and what you want to do. We check the van and crew for your date and send the price and what it includes in writing. Nothing is booked until you confirm.",
  },
  {
    q: "How fast do you reply?",
    a: "We reply between 09:00 and 18:00 Korea time (KST), and often outside those hours. WhatsApp is the fastest way to reach us.",
  },
  {
    q: "How many people fit in the van?",
    a: "Our day products use one Hyundai Staria van that carries up to 7 passengers. For a larger group, ask us before you book.",
  },
  {
    q: "Which areas do you cover?",
    a: "The two day products cover Seoul city and day trips from Seoul into Gyeonggi province. Other regions are arranged by consultation: send a trip request and tell us where you want to go.",
  },
  {
    q: "Do you take us to shops for commission?",
    a: "No. There is no forced shopping on our tours. You visit only the shops you ask for.",
  },
  {
    q: "Do you sell sedans?",
    a: "No. Our day products run on a Hyundai Staria van, which gives families and small groups room for bags and a seat for everyone.",
  },
];

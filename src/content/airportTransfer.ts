import type { Faq } from "./types";

// 공항 픽업·샌딩 페이지(/airport-transfer)의 내용. 파트너가 "한국에 부족하다"고 한 첫 상품(docs/06).
// 서비스 3종(services.ts)과는 별도 페이지이며, 차량·기사 구조는 Private Car & Driver와 같다(기사는 안내를 하지 않는다).
// 요금은 pricing.ts의 airportRates(2026-11-16 사장님 확정: 인천 11만·김포 9만 원, 편도, 5인까지).
// 2026-11-16 사장님: 손님 이름·호텔을 적은 피켓을 들고 기다림, 간단한 티켓·유심·환전 안내, 기사는 영어(따갈로그는 요청 시),
// 새벽·밤 비행기와 짐 보관은 추가 요금 없음. 운전만 하는 상품이라 팁 없음(사장님 정정).

export const airportTransfer = {
  path: "/airport-transfer",
  name: "Airport Pick-up & Drop-off",
  title: "Airport pick-up and drop-off: Incheon and Gimpo to Seoul",
  tagline: "A driver with your name and hotel on a board at the arrivals gate. Your luggage in the van. Hotel door in about an hour.",
  answer:
    "An English-speaking driver meets you at the arrivals gate at Incheon Airport (Terminal 1 or 2) or Gimpo Airport with a board showing your name and hotel, loads your luggage into a private Hyundai Staria and drives you to your hotel in Seoul: about 60–80 minutes from Incheon and 30–50 minutes from Gimpo, depending on traffic. The price is per van, one way, for up to 5 passengers with luggage. Early-morning and late-night flights cost the same, and the same service takes you back for departure.",
  steps: [
    {
      title: "Send your flight",
      text: "Flight number, date, airport and terminal, hotel address, number of people and suitcases.",
    },
    {
      title: "We confirm your driver",
      text: "We confirm the driver for your flight and send a payment link. Nothing is charged until we confirm.",
    },
    {
      title: "Meet at the gate",
      text: "Your driver waits at the arrivals exit with a board showing your name and hotel. If your flight is late, the driver waits; we watch the flight.",
    },
    {
      title: "Hotel door",
      text: "Luggage in, seats for everyone, straight to the hotel. For departure we pick you up with time to spare for check-in.",
    },
  ],
  bestFor: [
    "Families and groups of up to 5 with suitcases",
    "Late-night arrivals after the last train or bus",
    "Travelling with parents, small children or a lot of luggage",
    "Hotels outside central Seoul, or in Gyeonggi",
    "Early-morning departures",
  ],
  includes: [
    "Van and driver for the transfer",
    "Meeting at the arrivals gate with a board showing your name and hotel",
    "Simple help at the airport with tickets, SIM cards and currency exchange",
    "No extra charge for early-morning or late-night flights",
    "Luggage can stay in the van at no extra charge",
    "Flight tracking and waiting for a delayed flight",
    "Fuel and the expressway toll between the airport and Seoul",
  ],
  excludes: [
    "Guiding or sightseeing on the way (a driver is not a tour guide; add a stop or a day tour if you want one)",
    "Child seats unless requested in advance",
  ],
  priceFactors: [
    "Hotels outside Seoul, for example in Gyeonggi",
    "6 or more passengers, or a second van for luggage",
    "Extra stops on the way, for example a supermarket",
  ],
  airports: {
    head: ["Airport", "Serves", "To central Seoul by van", "Good to know"],
    rows: [
      [
        "Incheon (ICN) Terminal 1",
        "Most international airlines",
        "About 60–80 minutes",
        "Arrivals exits are on the first floor. Tell us your exit gate letter if you see it on the way out.",
      ],
      [
        "Incheon (ICN) Terminal 2",
        "Korean Air and several of its SkyTeam partners",
        "About 60–80 minutes",
        "Check your terminal on the boarding pass. The two terminals are about 15 minutes apart by shuttle.",
      ],
      [
        "Gimpo (GMP)",
        "Domestic flights and some flights from Japan, China and Taiwan",
        "About 30–50 minutes",
        "Much closer to the city. Good for Tokyo Haneda, Osaka, Shanghai Hongqiao and Taipei Songshan routes.",
      ],
    ],
  },
  faqs: [
    {
      q: "Where exactly do we meet the driver?",
      a: "At the arrivals exit of your terminal, inside the public arrivals hall, holding a board with your name. We send the meeting point and the driver's contact the day before.",
    },
    {
      q: "What if our flight is delayed?",
      a: "We track your flight number and the driver adjusts to the real landing time. For long delays we message you on WhatsApp to agree what to do.",
    },
    {
      q: "Can we stop on the way to the hotel?",
      a: "Yes. The driver can show you where to buy a SIM card, a transport card or exchange money at the airport. For a stop on the way, such as a supermarket, tell us in advance so the timing and price include it.",
    },
    {
      q: "How many suitcases fit?",
      a: "The van takes up to 5 passengers with their suitcases. It has seats for 7, but with 6 or 7 people there is no room left for luggage. For a bigger group, ask us before you book.",
    },
    {
      q: "Do you provide child seats?",
      a: "On request. Tell us your children's ages when you book so the van has the right seats.",
    },
    {
      q: "Is this a shared shuttle?",
      a: "No. The van is only for your group, and the price is per van, so it costs the same whether 2 or 5 people ride.",
    },
    {
      q: "Can the driver show us around on the way?",
      a: "The driver speaks English (a Tagalog-speaking driver on request) and helps with luggage and directions, but is not a licensed tour guide, so there is no sightseeing commentary. If you want a guided day, book Private Car & Licensed Guide for your first day instead.",
    },
    {
      q: "Can we combine the transfer with a sunset on the coast?",
      a: "Yes. Eurwangni Beach is about 20 minutes from Incheon Airport. On a last day we can pick you up early, stop for the sunset and seafood, then drop you at the terminal for a late flight.",
    },
  ] satisfies Faq[],
  updated: "2026-11-16",
};

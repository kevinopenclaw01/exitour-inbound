import type { Faq } from "./types";

// 공항 픽업·샌딩 페이지(/airport-transfer)의 내용. 파트너가 "한국에 부족하다"고 한 첫 상품(docs/06).
// 서비스 3종(services.ts)과는 별도 페이지이며, 차량·기사 구조는 Private Car & Driver와 같다(기사는 안내를 하지 않는다).
// 요금은 파트너 원가(인천·김포 ↔ 서울)를 받은 뒤 pricing.ts에 넣는다. 그때까지 "Quote on request".

export const airportTransfer = {
  path: "/airport-transfer",
  name: "Airport Pick-up & Drop-off",
  title: "Airport pick-up and drop-off: Incheon and Gimpo to Seoul",
  tagline: "A driver with your name at the arrivals gate. Your luggage in the van. Hotel door in about an hour.",
  answer:
    "A private van meets you at the arrivals gate at Incheon Airport (Terminal 1 or 2) or Gimpo Airport with a name board, loads your luggage and drives you to your hotel in Seoul or Gyeonggi: about 60–80 minutes from Incheon and 30–50 minutes from Gimpo, depending on traffic. Vans are Hyundai Staria 9 or 11 seats or a Solati minibus, priced per van, not per person. We track your flight, so a late arrival is not a problem, and the same service takes you back for departure.",
  steps: [
    {
      title: "Send your flight",
      text: "Flight number, date, airport and terminal, hotel address, number of people and suitcases.",
    },
    {
      title: "Get a fixed price",
      text: "We reply with the right van and a written price for the trip. Nothing is charged until you confirm.",
    },
    {
      title: "Meet at the gate",
      text: "Your driver waits at the arrivals exit with a name board. If your flight is late, the driver waits; we watch the flight.",
    },
    {
      title: "Hotel door",
      text: "Luggage in, seats for everyone, straight to the hotel. For departure we pick you up with time to spare for check-in.",
    },
  ],
  bestFor: [
    "Families and groups of 4 or more with suitcases",
    "Late-night arrivals after the last train or bus",
    "Travelling with parents, small children or a lot of luggage",
    "Hotels outside central Seoul, or in Gyeonggi",
    "Early-morning departures",
  ],
  includes: [
    "Van and driver for the transfer",
    "Meeting at the arrivals gate with a name board",
    "Flight tracking and waiting for a delayed flight",
    "Fuel and the expressway toll between the airport and Seoul",
  ],
  excludes: [
    "Guiding or sightseeing on the way (a driver is not a tour guide; add a stop or a day tour if you want one)",
    "Parking or waiting beyond the agreed time, unless your quote says included",
    "Child seats unless requested in advance",
  ],
  priceFactors: [
    "Airport and terminal: Incheon Terminal 1 or 2, or Gimpo",
    "Where you are going: central Seoul, Gangnam, outer Seoul or Gyeonggi",
    "Van size: Staria 9, Staria 11 or Solati minibus",
    "Time of day: late-night and early-morning trips may cost more",
    "Extra stops on the way, for example a SIM card shop or a supermarket",
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
      a: "Yes. A short stop for a SIM card, cash or a supermarket is easy. Tell us in advance so the price and timing include it.",
    },
    {
      q: "How many suitcases fit?",
      a: "With luggage, the Staria 9-seater is comfortable for up to 6 people, the 11-seater for 7–8 and the Solati minibus for 11–12. Tell us the number of large suitcases and we choose the van.",
    },
    {
      q: "Do you provide child seats?",
      a: "On request. Tell us your children's ages when you book so the van has the right seats.",
    },
    {
      q: "Is this a shared shuttle?",
      a: "No. The van is only for your group, and the price is per van, so it costs the same whether 2 or 6 people ride.",
    },
    {
      q: "Can the driver show us around on the way?",
      a: "The driver drives and helps with luggage and directions, but is not a licensed tour guide, so there is no sightseeing commentary. If you want a guided day, book Private Car & Licensed Guide for your first day instead.",
    },
    {
      q: "Can we combine the transfer with a sunset on the coast?",
      a: "Yes. Eurwangni Beach is about 20 minutes from Incheon Airport. On a last day we can pick you up early, stop for the sunset and seafood, then drop you at the terminal for a late flight.",
    },
  ] satisfies Faq[],
  updated: "2026-10-28",
};

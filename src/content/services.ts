import type { Region, Service, Vehicle } from "./types";

// 서비스 자료. 2026-11-16부터 지금 파는 것은 앞의 두 상품(listed: true)이고, guide-tour는 코드만 두고 메뉴·사이트맵·llms.txt에서 뺐다(docs/decisions.md).
// 하루 시간·차량·인원·값·포함 항목은 src/content/pricing.ts가 기준이다. 여기 문구의 "10-hour"·"up to 7"은 그 값과 같아야 한다(tests/products.test.ts가 확인).

export const vehicles: Vehicle[] = [
  {
    id: "staria-9",
    name: "Hyundai Staria 9-seater",
    seats: 9,
    comfortablePax: 6,
    note: "The most common private tour van in Korea. Best for families and groups up to 6 with suitcases.",
  },
  {
    id: "staria-11",
    name: "Hyundai Staria 11-seater",
    seats: 11,
    comfortablePax: 8,
    note: "Same van with an extra row. Good for 7–8 people, or fewer people with a lot of luggage.",
  },
  {
    id: "solati",
    name: "Hyundai Solati minibus",
    seats: 15,
    comfortablePax: 11,
    note: "A high-roof minibus. Plan on 11–12 people at most once luggage is on board.",
  },
];

export const regions: Region[] = [
  { id: "seoul", name: "Seoul city", examples: "Palaces, Bukchon, Myeongdong, Gangnam, N Seoul Tower" },
  {
    id: "gyeonggi",
    name: "Gyeonggi day trips",
    examples: "Nami Island, Petite France, Garden of Morning Calm, Suwon Hwaseong, Everland",
  },
];

export const services: Service[] = [
  {
    id: "private-driver",
    path: "/private-driver",
    name: "Private Car & Driver",
    listed: true,
    answer:
      "A private Hyundai Staria van with a professional driver for a 10-hour day in Seoul or on a Gyeonggi day trip, for up to 7 passengers and priced per group, not per person. The driver handles the road, parking and waiting; the driver is not a tour guide and does not go into attractions with you. Other regions are arranged by consultation.",
    tagline: "Your own van and driver for 10 hours. You decide where to go.",
    bestFor: [
      "Families and groups who know what they want to see",
      "Shopping days with lots of bags",
      "Day trips where you only need the ride",
      "Travellers who do not need a guide",
    ],
    crew: "A professional driver who speaks English. A Tagalog-speaking driver can be arranged on request. The driver waits in the parking area while you visit.",
    includes: ["Hyundai Staria van and driver for 10 hours", "Hotel pick-up and drop-off", "Luggage can stay in the van at no extra charge"],
    excludes: ["Guiding inside attractions: a driver is not a tour guide"],
    vehicle: "included",
    faqs: [
      {
        q: "Does the driver speak English?",
        a: "Yes. Our drivers speak English, and a Tagalog-speaking driver can be arranged on request. The driver does not guide inside attractions; if you want explanations at the sights, choose Private Car & Licensed Guide.",
      },
      {
        q: "Can the driver come into Nami Island or a palace with us?",
        a: "No. A driver drops you at the entrance or ferry dock and waits in the parking area. Guiding inside attractions must be done by a licensed tourist guide under Korean law, so that is the Driver-Guide service.",
      },
      {
        q: "Is this legal for tourists?",
        a: "Yes, when it is set up correctly. Korean law lets a registered car-rental company provide a driver to a foreign renter. The van is a registered rental vehicle and the rental is in your name; we arrange it. See our Licensed & Safe page for details.",
      },
      {
        q: "Can I book just an airport transfer?",
        a: "Yes. A one-way transfer between Incheon or Gimpo Airport and your hotel in Seoul has a fixed price per van, for up to 5 passengers with luggage. See the airport pick-up and drop-off page.",
      },
    ],
    updated: "2026-11-16",
  },
  {
    id: "driver-guide",
    path: "/driver-guide",
    name: "Private Car & Licensed Guide",
    listed: true,
    answer:
      "A private Hyundai Staria van with a licensed tourist guide in your language for a 10-hour day in Seoul or on a Gyeonggi day trip, for up to 7 passengers and priced per group, not per person. The guide comes inside the sights with you to explain them and help with tickets. Other regions are arranged by consultation.",
    tagline: "Your own van and a licensed guide who explains each place and helps with tickets.",
    bestFor: [
      "First-time visitors who want the stories behind each place",
      "Day trips such as Nami Island or Suwon Hwaseong Fortress",
      "Travelling with parents or small children",
      "Groups that want tickets and queues handled",
    ],
    crew: "A tourist guide licensed by the Korean government (관광통역안내사) in your language, who goes into each attraction with you. For a group larger than 7, ask us before you book.",
    includes: [
      "Hyundai Staria van and licensed guide for 10 hours",
      "Guiding inside attractions in your language",
      "Help with tickets, queues and restaurant ordering",
      "Hotel pick-up and drop-off",
    ],
    excludes: [],
    vehicle: "included",
    faqs: [
      {
        q: "What is the difference between a driver and a driver-guide?",
        a: "A driver only drives and waits at the car park. On a driver-guide day, a licensed tourist guide in your language goes inside with you to explain the place, buy tickets and help with food.",
      },
      {
        q: "Which languages are available?",
        a: "Driver-guide days run in English. If you need another language, ask us with your dates before you book; we only confirm a language when a licensed guide for it is available.",
      },
      {
        q: "Do the guides really hold a licence?",
        a: "Yes. Every guide we assign holds the Korean tourist guide licence (관광통역안내사). Korean law requires it for guiding foreign visitors, and we keep a copy of each guide's licence on file.",
      },
      {
        q: "Will we be taken to shops?",
        a: "No forced shopping. You only visit shops you ask for.",
      },
    ],
    updated: "2026-11-16",
  },
  {
    id: "guide-tour",
    path: "/guide-tour",
    name: "Licensed Guide Tour & Trip Planning",
    listed: false,
    answer:
      "A licensed guide in your language for a half or full day, on foot, by subway or with a van added as an option. Before the day we talk through what you like and design the plan with you, from classic palaces to Han River evenings and seaside sunsets.",
    tagline: "Tell us what you like. We plan the day and walk it with you.",
    bestFor: [
      "Seoul walking days: palaces, markets, cafés, night views",
      "Couples and solo travellers",
      "Travellers who want a plan made around their interests",
      "Adding a van only for the part of the day that needs it",
    ],
    crew: "A licensed tourist guide in your language. A van with a driver can be added for all or part of the day.",
    includes: [
      "Planning chat before your trip and a written day plan",
      "Licensed guide for the booked time",
      "Subway and walking route planning",
    ],
    excludes: ["Transport fares, tickets and meals", "Van and driver unless added", "Extra hours beyond the booking"],
    vehicle: "optional",
    faqs: [
      {
        q: "How does the planning work?",
        a: "Send us your dates, who is travelling and what you enjoy. We reply with a draft plan and price, adjust it with you on chat, and confirm the guide.",
      },
      {
        q: "Can you plan more than one day?",
        a: "Yes. We can plan your whole stay and mix days: a guide day in Seoul, a van day to Nami Island, a free day on your own.",
      },
      {
        q: "Can we add a van later?",
        a: "Yes. Add a van and driver for the whole day or just one part, for example to reach the coast for sunset.",
      },
    ],
    updated: "2026-10-24",
  },
];

/** 메뉴·사이트맵·llms.txt에 싣는 서비스(지금 파는 두 상품). */
export const listedServices: Service[] = services.filter((s) => s.listed);

export function getService(id: Service["id"]): Service {
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown service: ${id}`);
  return service;
}

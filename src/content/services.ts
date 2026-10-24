import type { Region, Service, Vehicle } from "./types";

// 핵심 서비스 3종. 개별 투어 상품은 이 3종이 돌아간 뒤에 추가한다(docs/decisions.md 참고).

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
    answer:
      "A private van (Hyundai Staria 9 or 11 seats, or a Solati minibus) with a professional driver, booked by the day or for an airport transfer. The driver handles the road, parking and waiting; the driver is not a tour guide and does not go into attractions with you.",
    tagline: "Your own van and driver. You decide where to go.",
    bestFor: [
      "Families and groups who know what they want to see",
      "Airport pick-up and drop-off at Incheon or Gimpo",
      "Shopping days with lots of bags",
      "Travellers who want the lowest private option",
    ],
    crew: "Professional driver. Some drivers speak basic English; communication otherwise works through a translation app. The driver waits in the parking area while you visit.",
    includes: ["Van and driver for the booked hours", "Fuel", "Hotel or airport pick-up"],
    excludes: [
      "Guiding inside attractions",
      "Entrance tickets and meals",
      "Tolls, parking and driver's meal unless your quote says included",
      "Extra hours beyond the booking",
    ],
    vehicle: "included",
    faqs: [
      {
        q: "Does the driver speak English?",
        a: "Some drivers speak basic English. We tell you before you pay whether your driver speaks basic English or will use a translation app. If you need explanations at the sights, choose a Driver-Guide instead.",
      },
      {
        q: "Can the driver come into Nami Island or Everland with us?",
        a: "No. A driver drops you at the entrance or ferry dock and waits in the parking area. Guiding inside attractions must be done by a licensed tourist guide under Korean law, so that is the Driver-Guide service.",
      },
      {
        q: "Is this legal for tourists?",
        a: "Yes, when it is set up correctly. Korean law lets a registered car-rental company provide a driver to a foreign renter. The van is a registered rental vehicle and the rental is in your name; we arrange it. See our Licensed & Safe page for details.",
      },
      {
        q: "Can I book just an airport transfer?",
        a: "Yes. Tell us your flight, the airport (Incheon or Gimpo), your hotel and how many suitcases you have, and we quote the right van.",
      },
    ],
    updated: "2026-10-24",
  },
  {
    id: "driver-guide",
    path: "/driver-guide",
    name: "Private Car & Licensed Guide",
    answer:
      "A licensed tourist guide who also drives your private van, so one person takes you between places and explains everything inside the sights. Larger groups get a driver plus a separate licensed guide. We assign a guide who speaks your language.",
    tagline: "One person drives, guides and handles tickets for you.",
    bestFor: [
      "First-time visitors who want the stories behind each place",
      "Day trips to Nami Island, Petite France, Suwon or Everland",
      "Travelling with parents or small children",
      "Groups that want ticketing and queues handled",
    ],
    crew: "A tourist guide licensed by the Korean government (관광통역안내사) who drives the van and goes into each attraction with you. For groups of about 9 or more: a driver plus a separate licensed guide.",
    includes: [
      "Van, fuel and licensed driver-guide for the day",
      "Guiding inside attractions in your language",
      "Help with tickets, queues and restaurant ordering",
      "Hotel pick-up and drop-off",
    ],
    excludes: [
      "Entrance tickets and meals",
      "Tolls, parking and guide's meal unless your quote says included",
      "Extra hours beyond the booking",
    ],
    vehicle: "included",
    faqs: [
      {
        q: "What is the difference between a driver and a driver-guide?",
        a: "A driver only drives and waits at the car park. A driver-guide is a licensed tourist guide who drives and also goes inside with you to explain the place, buy tickets and help with food.",
      },
      {
        q: "Which languages are available?",
        a: "English, Chinese and Japanese guides are the most available. For other languages, ask us with your dates; we confirm a licensed guide in that language before you pay.",
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
    updated: "2026-10-24",
  },
  {
    id: "guide-tour",
    path: "/guide-tour",
    name: "Licensed Guide Tour & Trip Planning",
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

export function getService(id: Service["id"]): Service {
  const service = services.find((s) => s.id === id);
  if (!service) throw new Error(`Unknown service: ${id}`);
  return service;
}

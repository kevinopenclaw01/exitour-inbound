import type { Article } from "./types";

// 질문 하나에 답하는 안내 글. 첫 문단(answer)에 결론을 숫자와 함께 쓴다(AI 인용용).
// 질문 지도 전체는 docs/04_ai-search-strategy.md 참고.

export const articles: Article[] = [
  {
    slug: "private-driver-korea-cost",
    title: "How much does a private van with a driver cost in Korea?",
    description:
      "What decides the price of a private van, driver or driver-guide in Seoul and Gyeonggi, what is usually included, and how to compare quotes.",
    answer:
      "In Seoul and Gyeonggi, private day tours run on 9- or 11-seat Hyundai Staria vans or 15-seat Solati minibuses, priced per vehicle per day, not per person. The price depends on four things: the vehicle, the hours, the area (a Gyeonggi day trip costs more than a Seoul city day) and the crew: a driver only, a licensed driver-guide, or a driver plus a separate guide.",
    sections: [
      {
        heading: "The four things that set the price",
        body: [
          "Vehicle: a Staria 9-seater suits up to 6 people with luggage, an 11-seater 7–8, and a Solati minibus 11–12.",
          "Hours: most quotes cover a full day. Ask what time the day ends and what each extra hour costs.",
          "Area: driving out to Nami Island, Gapyeong or Suwon takes more fuel and road time than a day inside Seoul.",
          "Crew: a driver only is the lowest price. A licensed driver-guide costs more because the same person drives and guides you inside each attraction.",
        ],
      },
      {
        heading: "Driver, driver-guide or guide only",
        body: [
          "Pick the crew by what you need inside the sights, not on the road.",
        ],
        table: {
          head: ["Option", "Who comes", "Inside attractions", "Good for"],
          rows: [
            ["Car & driver", "Driver only", "Driver waits at the car park", "Transfers, shopping, travellers who plan their own day"],
            ["Car & licensed guide", "Licensed guide who drives", "Guide comes in and explains", "First visits, day trips, families"],
            ["Guide only", "Licensed guide, no van", "Guide comes in and explains", "Seoul walking days, subway trips"],
          ],
        },
      },
      {
        heading: "Check what the price includes",
        body: [
          "Higher quotes often include parking, tolls and the driver's meal; lower quotes often charge them on the day. Ask for these four lines in writing: fuel, tolls, parking, crew meal.",
          "Entrance tickets and your own meals are almost never included.",
        ],
      },
      {
        heading: "Our current rates",
        body: [
          "See the Prices page for our full table by service, area and vehicle. Rates marked as draft are being finalised; we always confirm the final price in writing before you pay.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is a private van priced per person?",
        a: "No. Private vans in Korea are priced per vehicle per day, so the cost per person falls as your group grows, up to the comfortable capacity of the van.",
      },
      {
        q: "Why is a driver-guide more expensive than a driver?",
        a: "A driver-guide holds the Korean tourist guide licence and does two jobs: driving and guiding you inside each attraction.",
      },
    ],
    related: ["private-driver", "driver-guide"],
    updated: "2026-10-24",
  },
  {
    slug: "is-hiring-a-driver-legal-in-korea",
    title: "Can tourists legally hire a car with a driver in Korea?",
    description:
      "How private drivers and tour guides for foreign visitors are regulated in Korea, and the questions to ask any operator before you book.",
    answer:
      "Yes. Korean law lets a registered car-rental company provide a driver to a foreign renter (Passenger Transport Service Act Article 34 and its Enforcement Decree Article 18). Carrying paying passengers in a private car is illegal, and guiding foreign visitors requires a government tourist guide licence. A legal setup uses a registered rental van, a rental in the traveller's name and licensed guides.",
    sections: [
      {
        heading: "What makes a private driver legal",
        body: [
          "The van is registered to a car-rental company. Korean rental vans carry plates with the letters 하, 허 or 호.",
          "The rental is in the traveller's name, and the rental company provides the driver. Foreign renters are one of the cases where the law allows this.",
          "A tour company that puts its own driver in a private car and charges for the ride is carrying passengers illegally (Passenger Transport Service Act Article 81). Insurance may not cover passengers in that case.",
        ],
      },
      {
        heading: "Who is allowed to guide you",
        body: [
          "Travel agencies serving foreign visitors must use guides who hold the tourist guide licence (관광통역안내사) under the Tourism Promotion Act Article 38. Authorities fine unlicensed guides and the agencies that use them.",
          "That is why a driver without the licence waits at the car park, while a licensed driver-guide can come in and explain.",
        ],
      },
      {
        heading: "Five questions to ask any operator",
        body: [
          "Is the company a registered travel agency in Korea, and what is its registration number?",
          "Is the van a registered rental vehicle, and is the rental in my name?",
          "Does the insurance cover passengers?",
          "Does my guide hold the tourist guide licence?",
          "Is shopping included in the itinerary?",
        ],
      },
      {
        heading: "How we set it up",
        body: [
          "Entour Korea is operated by Exitour, a registered general travel agency. We book registered rental vans with drivers provided by the rental company, and we assign licensed guides only. Our Licensed & Safe page has the details.",
        ],
      },
    ],
    faqs: [
      {
        q: "Why do you need my passport details?",
        a: "The van rental is made in the traveller's name, which is what makes the driver arrangement legal for foreign visitors. We use the details only for the rental contract.",
      },
      {
        q: "Can a driver without a licence explain the sights?",
        a: "Guiding foreign visitors requires the tourist guide licence. A driver can help with directions and practical things, but explanations inside attractions are for licensed guides.",
      },
    ],
    related: ["private-driver", "driver-guide"],
    updated: "2026-10-24",
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

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
  // ---- 2026-10-28 추가 8편 (docs/04 질문 지도). 사실·숫자는 "about", "check the current" 식으로 범위를 두고, 요금·시간표는 바뀔 수 있다고 쓴다. ----
  {
    slug: "nami-island-from-seoul",
    title: "How do you get from Seoul to Nami Island?",
    description:
      "Shuttle bus, ITX train, taxi and private van compared for a day trip from Seoul to Nami Island, with travel times, the ferry and what to add nearby.",
    answer:
      "Nami Island is about 60 km east of Seoul, in Gapyeong. There are four ways to get there: the Nami Island shuttle bus from central Seoul (about 2 hours each way), the ITX-Cheongchun train to Gapyeong Station plus a 10-minute taxi or local shuttle to the wharf (about 1.5 hours door to door), a taxi, or a private van with a driver (1.5 to 2 hours depending on traffic). From the Gapyeong wharf the island is a 5-minute ferry ride or a zip wire.",
    sections: [
      {
        heading: "The four options compared",
        body: ["Times are from central Seoul on a normal weekday. Weekend mornings in autumn can add 30 minutes or more."],
        table: {
          head: ["Option", "Time each way", "Good for", "Watch out for"],
          rows: [
            [
              "Nami Island shuttle bus",
              "About 2 hours",
              "Solo travellers and couples on a budget",
              "Fixed departure and return times. Seats sell out in cherry-blossom and autumn seasons, so book ahead.",
            ],
            [
              "ITX-Cheongchun train + taxi",
              "About 1.5 hours",
              "Travellers who enjoy trains",
              "Departs Yongsan or Cheongnyangni. Weekend tickets sell out; the wharf is a 10-minute taxi or shuttle from Gapyeong Station.",
            ],
            [
              "Taxi from Seoul",
              "1.5–2 hours",
              "Small groups in a hurry",
              "Expensive one way, and it can be hard to find a taxi back from the wharf in the evening.",
            ],
            [
              "Private van with driver",
              "1.5–2 hours",
              "Families, groups of 4 or more, anyone adding Petite France or the Garden of Morning Calm",
              "Priced per van per day, so it gets cheaper per person as the group grows.",
            ],
          ],
        },
      },
      {
        heading: "Ferry or zip wire",
        body: [
          "The ferry from the Gapyeong wharf runs every 10 to 30 minutes from early morning until evening and takes about 5 minutes. Your island ticket includes the ferry.",
          "The zip wire starts from a tower at the wharf and crosses the river to the island in about a minute. It costs extra, has queues at weekends and closes in strong wind or rain, so keep the ferry as the backup.",
        ],
      },
      {
        heading: "What to add on the same day",
        body: [
          "Petite France, a French-themed village about 15 minutes from the wharf, and the Garden of Morning Calm, about 30 minutes away, are the usual pairings. The Gapyeong rail bike and a dakgalbi (spicy chicken) lunch are easy extras.",
          "With public transport, the Gapyeong City Tour Bus loops between these stops on a timetable. With a van you set the order and skip the waiting, which is what makes a three-stop day possible.",
        ],
      },
      {
        heading: "How we do it",
        body: [
          "Pick-up at your hotel around 08:00–08:30, at the wharf by about 10:00 before the shuttle buses arrive, then Petite France and the Garden of Morning Calm in the afternoon, back in Seoul for dinner.",
          "With Private Car & Driver, the driver waits at the wharf car park and you explore the island on your own. With Private Car & Licensed Guide, the guide comes onto the island with you, handles tickets and explains the place.",
        ],
      },
    ],
    faqs: [
      {
        q: "How long do you need on Nami Island?",
        a: "Two to three hours for the main tree-lined paths and the riverside; four if you add lunch on the island and a bike ride.",
      },
      {
        q: "Is Nami Island open in winter?",
        a: "Yes, all year. Snow on the metasequoia path is one of its most photographed scenes. Dress warmly; the island is windier than Seoul.",
      },
      {
        q: "Can we do Nami Island and Everland in one day?",
        a: "Not comfortably. Nami Island is east of Seoul in Gapyeong and Everland is south in Yongin, about 2 hours apart. Choose one per day.",
      },
    ],
    related: ["private-driver", "driver-guide"],
    updated: "2026-10-28",
  },
  {
    slug: "incheon-airport-to-seoul",
    title: "What is the best way to get from Incheon Airport to Seoul?",
    description:
      "AREX train, airport limousine bus, taxi and private van from Incheon Airport to Seoul compared by time, luggage and group size, plus Terminal 1 versus Terminal 2.",
    answer:
      "From Incheon Airport you can reach central Seoul by the AREX express train (about 43 minutes from Terminal 1 to Seoul Station, 51 from Terminal 2), the all-stop AREX train (about an hour), airport limousine buses (60–90 minutes to most hotel areas), a taxi (about an hour, more in rush hour) or a private van that meets you at the arrivals gate (60–80 minutes, door to door). For 4 or more people with suitcases, a late arrival or a hotel outside the centre, a private van is the easiest choice.",
    sections: [
      {
        heading: "Five ways into the city",
        body: ["Times are typical; evening rush hour (17:00–19:00) and Friday evenings add time on the roads."],
        table: {
          head: ["Option", "Time to central Seoul", "Best for", "Note"],
          rows: [
            [
              "AREX express train",
              "43 min (T1) / 51 min (T2) to Seoul Station",
              "Hotels near Seoul Station, light luggage",
              "Non-stop with reserved seats. From Seoul Station you still need a taxi or the subway, with stairs, to most hotels.",
            ],
            [
              "AREX all-stop train",
              "About 60 minutes",
              "The lowest fare",
              "Stops at Hongik University, Gongdeok and more. Crowded at commuting times, standing with luggage.",
            ],
            [
              "Airport limousine bus",
              "60–90 minutes",
              "Myeongdong, Gangnam and other hotel districts",
              "Luggage goes in the hold. Buy tickets at the arrivals-hall counters; buses stop near major hotels.",
            ],
            [
              "Taxi",
              "50–80 minutes",
              "Two or three people with normal luggage",
              "Use the official taxi stand. Fares rise late at night and in traffic; a large group may need two taxis.",
            ],
            [
              "Private van with driver",
              "60–80 minutes",
              "Groups of 4 or more, families, late or early flights, hotels outside the centre",
              "Driver meets you at the gate with a name board, tracks your flight and takes you to the hotel door. Priced per van.",
            ],
          ],
        },
      },
      {
        heading: "Terminal 1 or Terminal 2",
        body: [
          "Terminal 2 serves Korean Air and several of its SkyTeam partners; most other airlines use Terminal 1. Your terminal is printed on the boarding pass and shown on the airline app.",
          "The terminals are about 15 minutes apart by the free shuttle bus, so arriving at the wrong one is fixable but costs half an hour. Tell your driver or bus the terminal, not just the airport.",
        ],
      },
      {
        heading: "When a private van makes sense",
        body: [
          "Four or more people: one van instead of two taxis or a bus plus a taxi.",
          "Arrivals after about 23:00, when the last trains and many buses have gone and the taxi queue is long.",
          "Grandparents, small children or more than one large suitcase per person.",
          "Hotels in Gyeonggi, outer Seoul or anywhere the bus does not stop.",
          "A departure before 07:00, when public transport is thin.",
        ],
      },
      {
        heading: "What we need from you",
        body: [
          "Flight number and date, terminal, hotel name and address, number of people and large suitcases, and whether you want a stop on the way (SIM card, cash, supermarket). We reply with the van and a written price.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can the driver meet us inside the arrivals hall?",
        a: "Yes. The driver waits at the arrivals exit of your terminal with a name board. We send the meeting point and the driver's contact the day before.",
      },
      {
        q: "What happens if our flight is late?",
        a: "We track the flight number and the driver adjusts to the real landing time. For long delays we message you on WhatsApp to agree the plan.",
      },
      {
        q: "Is Gimpo Airport different?",
        a: "Gimpo is much closer to the city, about 30–50 minutes by van, and mostly serves domestic flights plus some routes from Japan, China and Taiwan. The same transfer service covers it.",
      },
    ],
    related: ["private-driver"],
    updated: "2026-10-28",
  },
  {
    slug: "tour-guide-in-your-language-korea",
    title: "Can I get a tour guide in my language in Korea?",
    description:
      "Which languages Korea licenses tourist guides in, which are easy or hard to book, and what to do when no licensed guide speaks your language.",
    answer:
      "Yes, in 12 languages. Korea licenses tourist guides (관광통역안내사) in English, Japanese, Chinese, French, German, Spanish, Russian, Malay-Indonesian, Vietnamese, Thai, Arabic and Italian. English, Chinese and Japanese guides are the easiest to book. The other languages exist in much smaller numbers, so send your dates as early as you can and we confirm a licensed guide in that language before you pay.",
    sections: [
      {
        heading: "Why the licence matters for the language",
        body: [
          "Under Korean law, travel agencies serving foreign visitors must use licensed tourist guides, and the licence is issued per language. A guide licensed in Japanese is not automatically allowed to guide in English, even if their English is good.",
          "That is why we ask for your language first, then check which licensed guides are free on your date, rather than promising any language on any day.",
        ],
      },
      {
        heading: "How easy each language is to book",
        body: ["Based on how many licensed guides work in each language in the Seoul area. It changes by season; peak weeks are harder in every language."],
        table: {
          head: ["Language", "Availability", "What to expect"],
          rows: [
            ["English", "Easy", "Driver-guides and walking guides most days; book 1–2 weeks ahead in April, October and November."],
            ["Chinese (Mandarin)", "Easy", "Large number of guides. Cantonese is less common; tell us if it matters."],
            ["Japanese", "Easy", "Many experienced guides, strong on palaces, food and shopping days."],
            ["Thai, Vietnamese, Malay-Indonesian", "Limited", "A smaller pool. Ask 2–4 weeks ahead; we confirm a named guide before you pay."],
            ["French, German, Spanish, Italian, Russian, Arabic", "Limited", "Fewer guides and mostly in Seoul. The earlier you ask, the better."],
          ],
        },
      },
      {
        heading: "If no licensed guide speaks your language",
        body: [
          "Option 1: an English-speaking licensed guide plus a translation app for the details. This works well for families where one person is comfortable in English.",
          "Option 2: Private Car & Driver with a written day plan in your language, prepared with you before the trip, and the driver using a translation app for practical questions. The driver does not guide inside attractions.",
          "We tell you honestly which option we can confirm for your date instead of assigning someone without the right licence.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do you have Thai-speaking guides?",
        a: "Thai is one of the 12 licensed languages, but the number of guides is small. Send your dates as early as possible and we confirm a licensed Thai-speaking guide, or tell you if we cannot.",
      },
      {
        q: "Can the driver translate for us?",
        a: "Drivers help with directions and practical things, sometimes in basic English or with a translation app, but a driver is not a licensed guide and does not explain the sights.",
      },
      {
        q: "Will the guide handle ordering and tickets in Korean?",
        a: "Yes. Ordering food, buying tickets, asking for table seating and talking to staff are part of what the guide does for you.",
      },
    ],
    related: ["driver-guide", "guide-tour"],
    updated: "2026-10-28",
  },
  {
    slug: "seoul-with-elderly-parents",
    title: "How do you plan Seoul for elderly parents?",
    description:
      "A practical plan for visiting Seoul with older parents: which sights are flat, where the stairs are, how to pace the day and why a private van and licensed guide help.",
    answer:
      "Seoul works well for older travellers if you cut the walking, avoid subway stairs at rush hour and plan one main sight per half day with a proper sit-down lunch. A private van with a licensed driver-guide removes most of the strain: hotel door pick-up, a seat to rest in between places, and a guide who handles tickets, queues and ordering. Choose flat sights such as the main courtyards of Gyeongbokgung, Insadong, Nami Island and the Han River parks, and keep hilly Bukchon and the climb to N Seoul Tower short or skip them.",
    sections: [
      {
        heading: "A day that works",
        body: [
          "09:00 pick-up at the hotel. 09:30 Gyeongbokgung: the main gate, throne hall and the pavilion pond are on flat ground; wheelchairs can be borrowed at the palace for visitors who need one.",
          "11:30 Insadong: a flat street of tea houses and craft shops, with cafés to sit in. Lunch at a restaurant with chairs, not floor seating.",
          "14:00 Han River park or the National Museum of Korea (lifts, benches and a café), both easy on the legs. Back at the hotel by 16:00 with the evening free.",
        ],
      },
      {
        heading: "Flat and easy versus steep",
        body: ["Walking distances are our estimates for a relaxed visit."],
        table: {
          head: ["Place", "Walking", "Stairs and slopes", "Tip"],
          rows: [
            ["Gyeongbokgung main courtyards", "About 1 km", "Flat gravel, a few steps", "Borrow a wheelchair at the gate if needed; gravel is slow for small wheels."],
            ["Insadong", "500 m–1 km", "Flat", "Many cafés; easy to shorten."],
            ["Bukchon Hanok Village", "1–2 km", "Steep lanes", "Drive to the top viewpoint and walk down a short way instead of climbing."],
            ["N Seoul Tower", "Varies", "Cable car then steps", "Van to the cable-car base; the terrace has benches."],
            ["Nami Island (day trip)", "2–3 km", "Flat paths", "Ferry access; electric cart rides on the island on busy days."],
            ["Garden of Morning Calm", "1–2 km", "Slopes", "Good in a van day; take the shorter loop."],
          ],
        },
      },
      {
        heading: "Food and comfort",
        body: [
          "Many traditional restaurants have floor seating. The guide asks for table seats or chooses places that have them.",
          "Korean food can be spicy; soups such as galbitang (beef rib soup) and samgyetang (chicken ginseng soup) are mild and popular with older guests.",
          "Pharmacies are everywhere and large hospitals in Seoul have international clinics. Bring a list of regular medicines and travel insurance details.",
        ],
      },
      {
        heading: "Why a van and a licensed guide",
        body: [
          "The van is a rest stop on wheels: air conditioning, a seat between every stop and a place for bags and jackets. The guide is a licensed tourist guide who comes inside each place, which means no queues at ticket desks and someone to explain the history in your language while your parents sit down.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can you arrange a wheelchair?",
        a: "The main palaces lend wheelchairs to visitors at the entrance, and we plan around places that have them. Our vans are standard Staria vans, not lift-equipped, so a folding wheelchair travels in the luggage space.",
      },
      {
        q: "Are there many stairs on the subway?",
        a: "Yes. Most stations have lifts, but they are not always near the exit you need, and rush hour is crowded. For older travellers we recommend the van for the whole day.",
      },
      {
        q: "Which day trip is easiest for older parents?",
        a: "Nami Island: a short ferry, flat paths and benches, with lunch on the island. We keep the day to one or two stops.",
      },
    ],
    related: ["driver-guide", "private-driver"],
    updated: "2026-10-28",
  },
  {
    slug: "muslim-friendly-korea-tour",
    title: "Is Korea easy for Muslim travellers? Halal food and prayer rooms",
    description:
      "Where to find halal food in Seoul, how Korea classifies Muslim-friendly restaurants, where the prayer rooms are, and how a licensed guide plans a Muslim-friendly day.",
    answer:
      "Korea is workable for Muslim travellers with some planning. Seoul Central Mosque in Itaewon has a street of halal restaurants around it, the Korea Tourism Organization classifies restaurants as halal-certified, self-certified, Muslim-friendly or pork-free, and prayer rooms exist at Incheon Airport, at major attractions such as Nami Island and Everland, and at some malls and tourist centres. Outside Itaewon, pork and alcohol-based sauces are common in everyday Korean food, so a guide who reads menus and calls ahead makes a real difference.",
    sections: [
      {
        heading: "Where the halal food is",
        body: [
          "Itaewon, around Seoul Central Mosque: the densest cluster of halal restaurants in Korea, with Middle Eastern, South Asian, Indonesian and Malaysian food, plus halal Korean dishes.",
          "Myeongdong and the main palace area have a few Muslim-friendly Korean restaurants; numbers grow every year, and the Korea Tourism Organization publishes an updated list.",
          "Easy choices anywhere: seafood and vegetable bibimbap (ask for no meat), grilled fish, seafood pancakes and many street snacks. Watch for pork broth in soups, lard in some fried food and cooking wine in sauces.",
        ],
      },
      {
        heading: "The four classifications",
        body: ["The Korea Tourism Organization uses these labels; ask which one applies before you order."],
        table: {
          head: ["Label", "Meaning"],
          rows: [
            ["Halal certified", "Certified by a recognised halal body."],
            ["Self-certified", "Muslim-owned or run restaurant that declares its food halal."],
            ["Muslim-friendly", "Some halal menu items; alcohol may be sold."],
            ["Pork-free", "No pork, but the meat is not certified halal."],
          ],
        },
      },
      {
        heading: "Prayer rooms",
        body: [
          "Seoul Central Mosque in Itaewon is open for all daily prayers and Friday prayer.",
          "Incheon Airport has prayer rooms in both terminals. Nami Island and Everland have prayer rooms, and several large malls, department stores and tourist information centres in Seoul have small prayer spaces.",
          "For each stop on your day we confirm where the nearest prayer space is and build prayer times into the plan.",
        ],
      },
      {
        heading: "How we plan a Muslim-friendly day",
        body: [
          "Your guide schedules the day around prayer times, chooses restaurants from the current halal and Muslim-friendly lists, calls ahead to confirm, and keeps alcohol-centred stops off the plan. During Ramadan we plan shorter days with an iftar restaurant at the end.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Korean fried chicken halal?",
        a: "Most chains are not. A few halal-certified fried chicken restaurants operate in Itaewon and we can include one in your plan.",
      },
      {
        q: "Is there halal food on Nami Island?",
        a: "Nami Island has a prayer room and a Muslim-friendly restaurant. We check that it is open on your date and plan lunch around it.",
      },
      {
        q: "Can our guide be Muslim?",
        a: "We can ask for a guide familiar with Muslim-friendly travel. Licensed guides who speak Malay-Indonesian or Arabic are limited, so send your dates early.",
      },
    ],
    related: ["driver-guide", "guide-tour"],
    updated: "2026-10-28",
  },
  {
    slug: "sunset-near-incheon-airport",
    title: "Where can you watch the sunset near Incheon Airport?",
    description:
      "The best west-coast sunset spots within an hour of Incheon Airport: Eurwangni, Wangsan and Muuido beaches, the seagull ferry at Wolmido and the tide road at Jebudo.",
    answer:
      "Eurwangni Beach on Yeongjong Island is about 20 minutes by car from Incheon Airport and faces west, so it is the easiest airport-side sunset in Korea. Wangsan Beach is next to it, and Hanagae Beach on Muuido is reachable by road over the Muui bridge. The classic seagull photo is on the short car ferry between Wolmido and Yeongjong, where gulls follow the boat for shrimp crackers. For a longer evening, Jebudo in Hwaseong has a road that appears across the sea at low tide.",
    sections: [
      {
        heading: "Four sunset spots",
        body: ["Drive times are from Incheon Airport Terminal 1 outside rush hour."],
        table: {
          head: ["Spot", "From the airport", "What you get", "Note"],
          rows: [
            ["Eurwangni Beach", "About 20 minutes", "Wide west-facing beach, cafés and grilled-clam restaurants", "The easiest choice before a late flight or after a morning landing."],
            ["Wangsan Beach", "About 25 minutes", "Quieter beach next to Eurwangni", "Fewer restaurants; good for a calm walk."],
            ["Hanagae Beach, Muuido", "About 35 minutes", "Long tidal beach with huts on the sand", "Reached by road over the Muui bridge; the beach is very wide at low tide."],
            ["Jebudo, Hwaseong", "About 1 hour 15 minutes", "A road through the sea at low tide, mudflats, seafood", "Only at the right tide; we check the tide table for your date."],
          ],
        },
      },
      {
        heading: "The seagull moment",
        body: [
          "The car ferry between Wolmido (Incheon city side) and Yeongjong Island takes about 15 minutes, and gulls follow the boat the whole way. Shrimp crackers are sold at the dock; hold one up and a gull takes it from your hand.",
          "Feeding birds is a tradition on this ferry, but not everywhere. On beaches and at parks follow the local signs, and never feed wildlife where it is prohibited.",
        ],
      },
      {
        heading: "Timing",
        body: [
          "Sunset on the Incheon coast is around 17:20 in December and around 19:50 in late June. Arrive 45 minutes before for the colours, and stay 20 minutes after for the afterglow.",
          "For Jebudo the sea road is open only around low tide, and the sunset and the tide do not always line up, so we choose the date and time together.",
        ],
      },
      {
        heading: "Pairing it with your flight",
        body: [
          "Morning landing: airport pick-up, hotel check-in later, sunset and a seafood dinner on the way.",
          "Last day: check-out, a relaxed Incheon day, sunset at Eurwangni, then the terminal for a late evening flight. Eurwangni to Terminal 1 is about 20 minutes, to Terminal 2 about 25.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can we do this on a layover?",
        a: "Yes, with about 5 hours or more between landing and your next departure, and a passport that can enter Korea. See our layover guide for the time budget.",
      },
      {
        q: "Can we swim at Eurwangni?",
        a: "In July and August, when the beach is staffed. The water is shallow and tidal; outside summer it is a walking and sunset beach.",
      },
      {
        q: "Do we need a van for the sunset?",
        a: "Yes for Jebudo and Muuido, and strongly recommended for Eurwangni if you have luggage or a flight to catch. Buses reach Eurwangni from the airport but are slow in the evening.",
      },
    ],
    related: ["private-driver", "guide-tour"],
    updated: "2026-10-28",
  },
  {
    slug: "han-river-ramen",
    title: "How do you cook ramen at the Han River, and what else is there to do?",
    description:
      "Step-by-step guide to the convenience-store ramen cookers at Han River parks, plus bikes, the evening cruise and the Banpo Bridge fountain for a Seoul evening by the water.",
    answer:
      "At Han River parks such as Yeouido, Ttukseom and Banpo, the riverside convenience stores have self-service instant ramen cookers: you buy a packet of ramen, pay a small cooking fee, put the noodles and water into the machine, and it boils in about three minutes. You carry the pot out and eat on the steps or the lawn by the water. Around it you can rent a bike for the riverside path, take an evening cruise from Yeouido, and in the warmer months watch the Banpo Bridge Moonlight Rainbow Fountain.",
    sections: [
      {
        heading: "Step by step",
        body: [
          "1. Pick a convenience store inside the park, not one on the street: the ones by the river have the cookers and outdoor tables.",
          "2. Choose your ramen from the shelf. Add an egg, sliced cheese or green onion from the counter if you like; staff will point you to them.",
          "3. Pay for the ramen and the cooking fee at the till. The fee is small, about a thousand won or two, and changes from time to time.",
          "4. At the cooker, put the noodles and soup powder in the foil pot, fill water to the line, press start and wait about three minutes. Stir once near the end.",
          "5. Carry the pot out with the paper lid and chopsticks, find a spot on the steps by the water, and eat while the city lights come on.",
        ],
      },
      {
        heading: "Best time and place",
        body: [
          "Evening, from an hour before sunset, in spring and autumn. Summer evenings are lively but humid; winter is cold but the river is quiet and the lights are sharp.",
          "Yeouido has the cruise pier and the widest lawns. Ttukseom is more local and good for bikes. Banpo is the spot for the fountain show.",
        ],
      },
      {
        heading: "Bikes, cruise and fountain",
        body: [
          "Bikes: rental shops by the park entrances rent by the hour, including tandems; the riverside path is flat and separated from cars.",
          "Cruise: evening cruises leave from the Yeouido pier around sunset and show the bridges and skyline from the water. Seats sell out on fine weekends, so we book ahead.",
          "Fountain: the Banpo Bridge Moonlight Rainbow Fountain runs in the warmer months, usually spring to autumn, with several short evening shows. We check the schedule for your date.",
        ],
      },
      {
        heading: "Do it with a guide",
        body: [
          "Our Han River Evening plan puts the pieces in the right order: bikes while it is light, ramen at sunset, then the cruise or the fountain. No van is needed; it works on foot and by subway.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Han River ramen spicy?",
        a: "Most Korean ramen is. Mild options exist on the shelf; your guide can point to one, or ask the staff for a non-spicy packet.",
      },
      {
        q: "Can we drink beer by the river?",
        a: "Convenience stores sell beer and adults may drink in the parks as of our last check, with some areas and hours restricted. Follow the signs, keep it quiet and take your rubbish to the bins.",
      },
      {
        q: "Do we need a van for a Han River evening?",
        a: "No. Yeouido and Ttukseom are on the subway. A van helps only if you combine the evening with a day trip elsewhere.",
      },
    ],
    related: ["guide-tour"],
    updated: "2026-10-28",
  },
  {
    slug: "incheon-layover-tour",
    title: "Can I leave Incheon Airport during a layover?",
    description:
      "How much time you need to leave Incheon Airport on a layover, what to check about entry and luggage, and what you can see in 5, 8 or 10 hours.",
    answer:
      "Yes, if your passport can enter Korea (visa-free for many nationalities, sometimes with an electronic travel authorisation, otherwise with a visa) and you have enough time. Plan at least 5 hours between landing and departure for a quick trip to the Yeongjong Island beaches or Incheon's old town, and 8 or more for Seoul: the city is about an hour from the airport each way, and you should be back through security 2 hours before an international departure. Incheon Airport also runs its own transit tour programmes; a private van is the option when you want your own timing.",
    sections: [
      {
        heading: "Check these first",
        body: [
          "Entry: check the official Korean immigration and electronic travel authorisation rules for your passport before you fly. Rules change, and we cannot confirm them for you.",
          "Luggage: if your bags are checked through to your final destination you leave with hand luggage only. If not, collect them and use the airport luggage storage or bring them in the van.",
          "Time: count from the expected landing time, not the scheduled one, and leave 2 hours at the end for check-in and security.",
        ],
      },
      {
        heading: "What fits in your layover",
        body: ["Times assume normal traffic; avoid the 07:00–09:00 and 17:00–19:00 rush hours for Seoul."],
        table: {
          head: ["Layover", "What is possible", "How"],
          rows: [
            ["5–6 hours", "Eurwangni Beach sunset or a walk on Yeongjong Island, seafood lunch or dinner", "Van from the terminal, 20 minutes each way"],
            ["6–8 hours", "Incheon Chinatown, Songwol-dong Fairy Tale Village and the old port area", "Van, 30–40 minutes each way"],
            ["8–10 hours", "Seoul highlights: Gyeongbokgung, Bukchon or Insadong, Myeongdong for lunch", "Van with a driver; add a licensed guide for the palace"],
            ["10 hours or more", "Half-day Seoul tour with a licensed guide, or N Seoul Tower at night", "Private Car & Licensed Guide, back at the airport 2 hours before departure"],
          ],
        },
      },
      {
        heading: "The airport's own transit tours",
        body: [
          "Incheon Airport runs transit tour programmes from desks in the terminals, from short airport-area trips to longer Seoul tours, on a fixed schedule. They are good value if the timing suits you; ask at the transit tour desk after landing.",
          "A private van is for when the schedule does not fit, you are a group, or you want a specific place such as a sunset on the coast.",
        ],
      },
      {
        heading: "How a private layover works",
        body: [
          "The driver meets you at arrivals with a name board, your bags go in the van, the driver waits at each stop, and you are dropped at the departure terminal at the agreed time. Add a licensed guide if you want the palace explained rather than just seen.",
        ],
      },
    ],
    faqs: [
      {
        q: "Do I have to go through immigration to leave the airport?",
        a: "Yes. Leaving the transit area means entering Korea, so your passport must be allowed in and you pass immigration both ways. Allow 30–60 minutes for arrival formalities.",
      },
      {
        q: "Is Incheon Chinatown worth it?",
        a: "For a 6–8 hour layover, yes: it is about 30 minutes from the airport, the birthplace of Korean-style jjajangmyeon noodles, with the painted Fairy Tale Village next door.",
      },
      {
        q: "Can we do a layover at night?",
        a: "Yes. N Seoul Tower, Dongdaemun Design Plaza and the Han River bridges are lit until late, and the roads are empty, so Seoul is closer at night.",
      },
    ],
    related: ["private-driver", "driver-guide"],
    updated: "2026-10-28",
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

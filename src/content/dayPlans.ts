import type { DayPlan } from "./types";

// 10시간 하루 예시(서울 2, 경기 2). 상품이 아니라 "이렇게 쓸 수 있다"는 예시이고, 손님과 상의해 바꾼다.
// - 가족 손님(아이·부모 동반) 기준으로 한 곳에 넉넉히 머문다.
// - 구간 시간(minutes)을 모두 더하면 600분(10시간)이어야 한다(tests/dayPlans.test.ts가 확인).
// - 이동 시간은 평일 낮 기준 어림값이다. 화면에는 "about"으로 나오고, 주말·연휴에는 더 걸린다고 밝힌다.
// - 입장료·운영 시간·휴무일·공연 시간처럼 바뀌는 값은 적지 않는다("we check for your date").
// - 출발지는 서울 도심(명동·종로·시청 근처) 호텔로 잡았다.
// - photos는 사장님이 주신 실제 장소 사진이 있는 일정에만 붙인다(src/content/photos.ts). 그 장소가 아닌 사진을 붙이지 않는다.

export const dayPlans: DayPlan[] = [
  {
    slug: "seoul-palace-hanok-namsan",
    region: "seoul",
    name: "First day in Seoul: palace, hanok lanes and Namsan",
    area: "Seoul: Jongno and Namsan",
    summary:
      "The classic first day at a family pace: Gyeongbokgung Palace in the morning, the hanok lanes of Bukchon, lunch in Insadong, the cable car up Namsan, then market snacks and a walk by the stream at dusk.",
    start: "09:00",
    stops: [
      { kind: "pickup", title: "Hotel pick-up in central Seoul", minutes: 0 },
      { kind: "drive", title: "Drive to Gyeongbokgung Palace", minutes: 20 },
      {
        kind: "visit",
        title: "Gyeongbokgung Palace",
        minutes: 120,
        note: "The palace has a weekly closing day and set times for the guard ceremony. We check both for your date.",
      },
      { kind: "drive", title: "Short drive to Bukchon", minutes: 10 },
      {
        kind: "visit",
        title: "Bukchon Hanok Village",
        minutes: 50,
        note: "People live here and some lanes have visiting hours. The van drops you nearby and picks you up; parking inside is not possible.",
      },
      { kind: "drive", title: "Drive to Insadong", minutes: 10 },
      { kind: "meal", title: "Lunch in Insadong", minutes: 70 },
      { kind: "drive", title: "Drive to the Namsan cable car", minutes: 25 },
      {
        kind: "visit",
        title: "Namsan cable car and N Seoul Tower",
        minutes: 110,
        note: "The van drops you at the cable car station; the last stretch up to the tower is by cable car or shuttle bus.",
      },
      { kind: "drive", title: "Drive to Gwangjang Market", minutes: 25 },
      { kind: "visit", title: "Gwangjang Market for snacks", minutes: 60 },
      { kind: "drive", title: "Drive to Dongdaemun Design Plaza", minutes: 15 },
      { kind: "visit", title: "Dongdaemun Design Plaza and Cheonggyecheon Stream at dusk", minutes: 50 },
      { kind: "drive", title: "Drive back to your hotel", minutes: 35 },
      { kind: "dropoff", title: "Hotel drop-off", minutes: 0 },
    ],
    goodToKnow: [
      "The longest walks are inside the palace and around the tower. Tell us if someone needs a wheelchair or a slower pace and we cut a stop.",
      "Short city hops are 10 to 25 minutes on a normal weekday; rush hour adds time.",
    ],
    photos: ["gyeonghoeru", "nSeoulTower"],
    updated: "2026-11-16",
  },
  {
    slug: "seoul-kids-tower-river-night",
    region: "seoul",
    name: "Seoul with kids: aquarium, sky deck and a river evening",
    area: "Seoul: Jamsil, Gangnam and the Han River",
    summary:
      "A late start that ends after dark: the aquarium and the sky observatory at Lotte World Tower, the big library at COEX, a long evening by the Han River, then night street food before the hotel.",
    start: "11:00",
    stops: [
      { kind: "pickup", title: "Hotel pick-up in central Seoul", minutes: 0 },
      { kind: "drive", title: "Drive to Lotte World Tower in Jamsil", minutes: 40 },
      { kind: "visit", title: "Lotte World Aquarium", minutes: 90 },
      { kind: "meal", title: "Lunch in the mall", minutes: 60 },
      {
        kind: "visit",
        title: "Seoul Sky observatory",
        minutes: 75,
        note: "The view depends on the weather. On a hazy day we swap the order or drop this stop.",
      },
      { kind: "drive", title: "Drive to COEX", minutes: 25 },
      { kind: "visit", title: "Starfield Library and COEX", minutes: 50 },
      { kind: "drive", title: "Drive to Banpo Hangang Park", minutes: 25 },
      {
        kind: "meal",
        title: "Banpo Hangang Park: sunset, river walk and a riverside dinner",
        minutes: 150,
        note: "Convenience-store ramen by the water is the local way to do it. The Moonlight Rainbow Fountain runs on a seasonal evening schedule that we check for your date.",
      },
      { kind: "drive", title: "Drive to Myeongdong", minutes: 30 },
      { kind: "visit", title: "Myeongdong night street food", minutes: 40 },
      { kind: "drive", title: "Short drive to your hotel", minutes: 15 },
      { kind: "dropoff", title: "Hotel drop-off", minutes: 0 },
    ],
    goodToKnow: [
      "Most of this day is indoors until the river, so it also works in summer heat or on a cold day.",
      "Your 10 hours can start late and finish at night on Seoul days.",
    ],
    updated: "2026-11-16",
  },
  {
    slug: "gyeonggi-nami-island-dumulmeori",
    region: "gyeonggi",
    name: "Nami Island and the Dumulmeori riverside",
    area: "Gyeonggi: Gapyeong and Yangpyeong",
    summary:
      "An early start to reach the Nami Island ferry before the crowds, a slow morning on the island, dakgalbi for lunch, then the quiet riverside at Dumulmeori on the way back to Seoul.",
    start: "08:00",
    stops: [
      { kind: "pickup", title: "Hotel pick-up in central Seoul", minutes: 0 },
      { kind: "drive", title: "Drive to the Nami Island ferry dock in Gapyeong", minutes: 90 },
      {
        kind: "visit",
        title: "Nami Island, including the short ferry each way",
        minutes: 200,
        note: "The island is flat and car-free, easy with a stroller. Ferries run through the day; we check the times for your date.",
      },
      { kind: "meal", title: "Dakgalbi lunch near the dock", minutes: 70 },
      { kind: "drive", title: "Drive to Dumulmeori in Yangpyeong", minutes: 60 },
      {
        kind: "visit",
        title: "Dumulmeori: the riverside walk and the picture-frame photo spot",
        minutes: 80,
        note: "Swap this for the Garden of Morning Calm or Petite France, both nearer the island, if your family prefers. Doing all of them makes the day a rush.",
      },
      { kind: "drive", title: "Drive back to Seoul", minutes: 100 },
      { kind: "dropoff", title: "Hotel drop-off", minutes: 0 },
    ],
    goodToKnow: [
      "The ferry dock is in Gapyeong, Gyeonggi; the island itself belongs to Chuncheon.",
      "On weekends and in autumn-leaf season the roads are slower, so we leave earlier or shorten the second stop.",
    ],
    photos: ["namiIsland", "dumulmeori"],
    updated: "2026-11-16",
  },
  {
    slug: "gyeonggi-suwon-folk-village",
    region: "gyeonggi",
    name: "Suwon Hwaseong Fortress and the Korean Folk Village",
    area: "Gyeonggi: Suwon and Yongin",
    summary:
      "A history day south of Seoul: the fortress wall and palace in Suwon, a galbi lunch the city is known for, then an afternoon in the Korean Folk Village, where children can see how a Joseon-era village worked.",
    start: "09:00",
    stops: [
      { kind: "pickup", title: "Hotel pick-up in central Seoul", minutes: 0 },
      { kind: "drive", title: "Drive to Suwon Hwaseong Fortress", minutes: 70 },
      {
        kind: "visit",
        title: "Hwaseong Haenggung Palace and a walk on the fortress wall",
        minutes: 160,
        note: "The wall has slopes and steps. With grandparents or a stroller we keep to the palace and the flat stretch by the gate.",
      },
      { kind: "meal", title: "Suwon galbi lunch", minutes: 70 },
      { kind: "drive", title: "Drive to the Korean Folk Village in Yongin", minutes: 35 },
      {
        kind: "visit",
        title: "Korean Folk Village",
        minutes: 165,
        note: "Performances run on a daily schedule. We check it for your date and plan the visit around the ones you want.",
      },
      { kind: "drive", title: "Drive back to Seoul", minutes: 100 },
      { kind: "dropoff", title: "Hotel drop-off", minutes: 0 },
    ],
    goodToKnow: [
      "Both stops are outdoors. In midsummer or on a rainy day, ask us for an indoor swap.",
      "The evening drive back into Seoul is slower than the morning drive out.",
    ],
    updated: "2026-11-16",
  },
];

export function getDayPlan(slug: string): DayPlan | undefined {
  return dayPlans.find((p) => p.slug === slug);
}

import type { PlanIdea } from "./types";

// 가이드 투어·일정 설계에서 보여 주는 "이런 하루도 만들 수 있다" 예시. 별도 상품이 아니라 설계 예시다.

export const planIdeas: PlanIdea[] = [
  {
    slug: "han-river-evening",
    name: "Han River Evening",
    area: "Seoul, Yeouido and Banpo",
    summary:
      "Ride a bike along the river, cook instant ramen the Seoul way at a riverside convenience store, then watch the city lights from an evening cruise.",
    moments: [
      "Rent bikes at a Han River park and ride the riverside path",
      "Cook ramen at a convenience-store ramen machine and eat by the water",
      "Board an evening cruise for the skyline and bridges",
      "Optional: Banpo Bridge Moonlight Rainbow Fountain in season",
    ],
    goodToKnow: [
      "Best from spring to autumn; cruises and fountain shows run on seasonal schedules we check for your date",
      "Works on foot and by subway, so no van is needed",
    ],
  },
  {
    slug: "sunset-seagulls",
    name: "Sunset & Seagulls on the West Coast",
    area: "Incheon coast (Eurwangni) or Jebudo",
    summary:
      "Drive to the west coast for a long beach sunset, with the classic Korean snack-and-seagull photo moment, then seafood by the sea.",
    moments: [
      "Eurwangni Beach near Incheon Airport for an easy sunset run",
      "Seagull photos with shrimp crackers, only where local rules allow feeding",
      "Or Jebudo, where a road through the sea appears at low tide",
      "Grilled clams or seafood dinner by the beach",
    ],
    goodToKnow: [
      "We time the day to sunset and, for Jebudo, to the tide table",
      "A van is needed for this one; it pairs well with an airport drop-off",
    ],
  },
];

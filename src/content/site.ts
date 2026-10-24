// 회사·브랜드 정보. null 칸은 아직 정하지 않은 값이다 — 화면에는 표시하지 않고, 구조화 데이터에도 넣지 않는다.
// 채워야 할 값 목록은 docs/03_site-plan.md "공개 전 채울 값" 참고.

export const site = {
  brand: "Entour Korea",
  operator: "Exitour",
  tagline: "Private driver and licensed guide tours in Korea",
  description:
    "Entour Korea arranges private vans with drivers, licensed driver-guides and licensed guides in your language for travellers in Seoul and Gyeonggi. Operated by Exitour, a registered general travel agency in Korea.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  operatorLicense: {
    type: "General travel agency (종합여행업), registered under the Tourism Promotion Act",
    number: null as string | null,
  },
  address: null as string | null,
  email: null as string | null,
  whatsapp: null as string | null,
  kakaoChannel: null as string | null,
  line: null as string | null,
  officeHours: "Mon–Fri 10:00–18:00 KST",
  /** 소셜·후기 채널 주소(같은 회사임을 AI에게 알리는 sameAs). 계정을 만들면 넣는다. */
  sameAs: [] as string[],
  areaServed: ["Seoul", "Gyeonggi-do", "Incheon"],
  guideLanguages: ["English", "Chinese", "Japanese"],
  launchYear: 2026,
} as const;

export const nav = [
  { href: "/private-driver", label: "Private Driver" },
  { href: "/driver-guide", label: "Driver-Guide" },
  { href: "/guide-tour", label: "Guide Tour & Planning" },
  { href: "/prices", label: "Prices" },
  { href: "/safety", label: "Licensed & Safe" },
] as const;

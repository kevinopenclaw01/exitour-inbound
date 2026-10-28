// 회사·브랜드 정보. null 칸은 아직 정하지 않은 값이다 — 화면에는 표시하지 않고, 구조화 데이터에도 넣지 않는다.
// 채워야 할 값 목록은 docs/03_site-plan.md "공개 전 채울 값" 참고.

export const site = {
  brand: "Entour Korea",
  operator: "Exitour",
  tagline: "Private driver and licensed guide tours in Korea",
  description:
    "Entour Korea arranges private vans with drivers, licensed driver-guides and licensed guides in your language for travellers in Seoul and Gyeonggi. Operated by Exitour, a registered general travel agency in Korea.",
  // 도메인을 정하면 NEXT_PUBLIC_SITE_URL로 지정한다. 없으면 Vercel 운영 주소, 그것도 없으면(내 PC) localhost.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ).replace(/\/$/, ""),
  operatorLicense: {
    type: "General travel agency (종합여행업), registered under the Tourism Promotion Act",
    number: null as string | null,
  },
  address: null as string | null,
  email: null as string | null,
  /** 국가번호 포함. WhatsApp·LINE·카카오가 모두 이 번호로 가입되어 있다(사장님, 2026-10-25). */
  phone: "+82 10-9988-8846" as string | null,
  whatsapp: "+821099888846" as string | null,
  /** 카카오톡 개인 ID. 카카오톡 채널을 만들면 채널 주소로 바꾼다. */
  kakaoId: "exitouroffice" as string | null,
  /** LINE은 같은 전화번호로 친구 추가. LINE ID나 QR 링크를 받으면 바꾼다. */
  line: "+82 10-9988-8846" as string | null,
  officeHours: "We reply 09:00–18:00 Korea time (KST), and often outside those hours.",
  /**
   * 홈 첫 화면 사진. 넣으면 도로 표지 그림 대신 배경 사진이 된다.
   * 사진은 public/images/에 두고 src는 "/images/파일이름.jpg". 직접 찍은 사진이나 사용 조건을 확인한 사진만 쓴다(출처가 필요하면 credit).
   */
  heroImage: {
    src: "/images/hero-road.webp",
    alt: "Autumn ginkgo and maple road by a lake in Gapyeong, Korea",
    // 화면 오른쪽 아래에 작게 표시된다(docs/decisions.md 2026-10-25 5번: AI 이미지는 풍경만, 우리 차량·가이드처럼 쓰지 않는다)
    credit: "AI-generated scenery",
  } as { src: string; alt: string; credit?: string } | null,
  /**
   * 홈 첫 화면 배경 영상(mp4, 소리 없음, 반복). 예: "/videos/hero.mp4". heroImage는 영상의 정지 화면으로 쓰이니 같이 넣는다.
   * 휴대폰 데이터를 생각해 4MB 이하로. 만드는 법: docs/08_handoff.md "메인 사진·영상".
   */
  heroVideo: null as string | null,
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
  { href: "/airport-transfer", label: "Airport Transfer" },
  { href: "/prices", label: "Prices" },
  { href: "/safety", label: "Licensed & Safe" },
] as const;

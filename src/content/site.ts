// 회사·브랜드 정보. null 칸은 아직 정하지 않은 값이다 — 화면에는 표시하지 않고, 구조화 데이터에도 넣지 않는다.
// 채워야 할 값 목록은 docs/10_narrow-launch.md "사장님께 받을 것" 참고.

export const site = {
  brand: "Entour Korea",
  operator: "Exitour",
  tagline: "Private van days in Seoul and Gyeonggi with a driver or a licensed driver-guide",
  description:
    "Entour Korea arranges 10-hour private van days in Seoul and Gyeonggi for families and small groups: a Hyundai Staria for up to 7 passengers with a driver only, or with a licensed tourist guide in your language. Operated by Exitour, a registered general travel agency in Korea.",
  // 도메인을 정하면 NEXT_PUBLIC_SITE_URL로 지정한다. 없으면 Vercel 운영 주소, 그것도 없으면(내 PC) localhost.
  url: (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000")
  ).replace(/\/$/, ""),
  /** 본문·구조화 데이터·링크가 눈에 띄게 바뀌면 이 날짜를 고친다(sitemap의 lastmod와 화면의 "Last updated"). 사소한 수정으로는 바꾸지 않는다. */
  contentUpdated: "2026-11-16",
  operatorLicense: {
    type: "General travel agency (종합여행업), registered under the Tourism Promotion Act",
    // 서울 서초구청 관광사업등록증 제2018-000019호(2018-04-26, 등록증 상호는 옛 이름 「케빈투어」).
    number: "2018-000019 (Seocho-gu Office, Seoul)" as string | null,
  },
  /** 대표자 이름(영문 표기). 바닥글·약관·개인정보처리방침에 나온다. */
  representative: "Kang Sangwook" as string | null,
  /** 사업자등록번호 */
  businessNumber: "479-66-00070" as string | null,
  /** 통신판매업 신고번호. 사이트에서 결제를 받기 전에 필요하다. */
  mailOrderNumber: "2015-Seoul Seocho-1804" as string | null,
  address: "5F, 13 Banpo-daero 23-gil, Seocho-gu, Seoul 06657, Republic of Korea" as string | null,
  /** 2026-11-17 사장님 지정(약관·개인정보 문의에 공개). */
  email: "exitour0ffice@gmail.com" as string | null,
  /** 국가번호 포함. WhatsApp·LINE·카카오가 모두 이 번호로 가입되어 있다(사장님, 2026-10-25). */
  phone: "+82 10-9988-8846" as string | null,
  whatsapp: "+821099888846" as string | null,
  /** 카카오톡 개인 ID. 카카오톡 채널을 만들면 채널 주소로 바꾼다. */
  kakaoId: "exitouroffice" as string | null,
  /** LINE은 같은 전화번호로 친구 추가. LINE ID나 QR 링크를 받으면 바꾼다. */
  line: "+82 10-9988-8846" as string | null,
  officeHours: "We reply 09:00–18:00 Korea time (KST), and often outside those hours.",
  /**
   * 견적서를 보내 주기로 약속하는 시간. 예: "24 hours". 사장님이 지킬 수 있는 값을 정하면 넣는다.
   * 넣으면 값이 확정되지 않은 칸에 "Written quote within 24 hours"로 나오고, 비어 있으면 "Written quote for your date"로 나온다.
   */
  quoteReplyWithin: null as string | null,
  /**
   * 홈 첫 화면 사진. 직접 찍은 사진이나 사용 조건을 확인한 사진만 쓴다(출처가 필요하면 credit).
   * 사진은 public/images/에 두고 src는 "/images/파일이름.jpg".
   * 2026-11-16: 사장님이 주신 실제 사진(경복궁 경회루)으로 바꿨다. 사진 아래에는 장소 이름이 나온다(credit).
   * 그전의 AI 풍경(/images/hero-road.webp)은 파일만 남아 있다. 다시 쓰려면 credit을 "AI-generated scenery"로 하고
   * position을 "left"로 둔다(오른쪽 멀리 차가 한 대 있어서 우리 차량처럼 보이지 않게 왼쪽만 쓴다 — docs/decisions.md).
   * position: 4:3 틀에 맞춰 자를 때 기준(가운데 / 왼쪽).
   */
  heroImage: {
    src: "/images/places/seoul-gyeonghoeru-pavilion.webp",
    alt: "Gyeonghoeru Pavilion standing over its pond at Gyeongbokgung Palace under a blue sky",
    credit: "Gyeonghoeru Pavilion, Gyeongbokgung Palace",
    position: "center",
  } as { src: string; alt: string; credit?: string; position?: "center" | "left" } | null,
  /**
   * 홈 첫 화면 영상(mp4, 소리 없음, 반복). 예: "/videos/hero.mp4". heroImage는 영상의 정지 화면으로 쓰이니 같이 넣는다.
   * 휴대폰 데이터를 생각해 4MB 이하로. 만드는 법: docs/08_handoff.md "메인 사진·영상".
   */
  heroVideo: null as string | null,
  /** 소셜·후기 채널 주소(같은 회사임을 AI에게 알리는 sameAs). 계정을 만들면 넣는다. */
  sameAs: [] as string[],
  areaServed: ["Seoul", "Gyeonggi-do", "Incheon"],
  /**
   * 안내에 쓰는 언어. 자격증으로 확인한 언어만 넣는다.
   * 따갈로그는 src/content/crew.ts의 초안에 있고, 사장님이 자격 언어를 확인해 주면 켠다.
   */
  guideLanguages: ["English"],
  launchYear: 2026,
  /**
   * 검색엔진 소유 확인 코드. 서치 콘솔·Bing 웹마스터·네이버 서치어드바이저에서 받은 값(따옴표 안의 글자만)을 넣으면 <head>에 들어간다.
   * 빈 값이면 아무것도 넣지 않는다. 비밀값이 아니다.
   */
  verification: { google: "", bing: "", naver: "" },
} as const;

/** 머리글 메뉴. 바닥글도 같은 목록을 쓴다. "Plan my trip" 버튼은 따로 그린다. */
export const nav = [
  { href: "/private-driver", label: "Private Driver" },
  { href: "/driver-guide", label: "Driver-Guide" },
  { href: "/prices", label: "Prices" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

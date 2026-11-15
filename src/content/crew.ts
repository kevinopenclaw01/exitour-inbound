import type { CrewMember } from "./types";

// 기사·가이드 소개 자리. 홈과 /driver-guide에 "Meet your driver-guide" 구역으로 나온다.
// ■ 아래 crewEntries에서 show가 true이고 이름·소개가 채워진 사람만 화면에 나온다. 한 명도 없으면 구역 자체가 안 나온다.
// ■ 사장님이 준 실제 자료만 넣는다. 이름·자격·소개를 지어내지 않는다. AI로 만든 사람 사진을 쓰지 않는다(docs/decisions.md).
// ■ 사진은 본인 동의를 받은 실제 사진을 public/images/crew/에 둔다(tests/assets.test.ts가 파일이 있는지 확인한다).
//
// 지금 상태(2026-11-16): 사진만 연결해 두었다. 사장님이 얼굴 사용을 허락했다("맞아, 써도 돼").
//   이름·자격·말할 수 있는 언어·소개는 아직 받지 못해서 show는 false다. 구역은 화면에 나오지 않는다.
//   사진은 편집본 폴더의 `기사님\driver-on-boat-square` (배 위에서 찍은 사진, 정사각형). 같은 폴더에 세로형과 공항 사진도 있다.
//   **배포 전에** 사진 세 장이 모두 기사님 본인인지 사장님이 한 번 확인한다(docs/10_narrow-launch.md 3장).
//
// 켜는 법: 아래 빈칸(null·빈 배열)을 받은 값으로 채우고 show를 true로 바꾼다.
//   name:      영문 표기 이름
//   licence:   자격증 사본에 적힌 그대로. 예: "Korean tourist guide licence (관광통역안내사), English"
//   languages: 손님과 말할 수 있는 언어. 예: ["English", "Tagalog"]
//   intro:     한두 문장 소개(영어)
// 켠 뒤 tests/products.test.ts의 "stays hidden until …" 기대값을 인원 수에 맞게 고친다.

export interface CrewEntry {
  show: boolean;
  name: string | null;
  role: string;
  photo: { src: string; alt: string } | null;
  licence: string | null;
  languages: string[];
  intro: string | null;
}

export const crewEntries: CrewEntry[] = [
  {
    show: false,
    name: null,
    role: "Driver-guide",
    photo: {
      src: "/images/crew/driver-on-boat-square.webp",
      // 이름을 받으면 "<이름>, driver-guide at Entour Korea, on a boat …"로 바꾼다.
      alt: "Our driver-guide on a boat, with a river and green hills behind",
    },
    licence: null,
    languages: [],
    intro: null,
  },
];

/** 화면에 나오는 사람: show가 켜져 있고 이름과 소개가 있는 항목만. */
export const crew: CrewMember[] = crewEntries.flatMap((entry) =>
  entry.show && entry.name && entry.intro
    ? [{ name: entry.name, role: entry.role, photo: entry.photo, licence: entry.licence, languages: entry.languages, intro: entry.intro }]
    : [],
);

/**
 * "영어와 따갈로그로 안내" 문구(초안). enabled를 true로 바꾸기 전에는 화면·구조화 데이터·llms.txt 어디에도 나가지 않는다.
 *
 * 켜기 전에 사장님께 확인받을 것:
 *  1) 가이드의 관광통역안내사 자격증에 적힌 언어. 자격은 언어별로 나온다(이 사이트의 안내 글
 *     /travel-guide/tour-guide-in-your-language-korea 에도 그렇게 적혀 있다).
 *  2) 자격 언어가 영어뿐이고 따갈로그는 "말할 수 있는 언어"라면 text를 아래 alternative로 바꿔서 켠다.
 * 켠 뒤에는 site.ts의 guideLanguages에도 같은 언어를 맞춘다.
 */
export const crewLanguageClaim = {
  enabled: false,
  text: "Your driver-guide guides in English and Tagalog.",
  alternative: "Your driver-guide guides in English and also speaks Tagalog.",
};

/** 화면에 내보낼 언어 문구. 꺼져 있으면 null. */
export function crewLanguageLine(): string | null {
  return crewLanguageClaim.enabled ? crewLanguageClaim.text : null;
}

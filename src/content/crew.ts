import type { CrewMember } from "./types";

// 기사·가이드 소개 자리. 홈과 /driver-guide에 "Meet your driver-guide" 구역으로 나온다.
// ■ 자료가 없으면(아래 배열이 비어 있으면) 구역 자체가 화면에 나오지 않는다.
// ■ 사장님이 준 실제 자료만 넣는다. 이름·사진·자격을 지어내지 않는다. AI로 만든 사람 사진을 쓰지 않는다(docs/decisions.md).
// ■ 사진은 본인 동의를 받은 실제 사진을 public/images/crew/에 두고 src를 "/images/crew/파일이름.jpg"로 적는다
//   (tests/assets.test.ts가 파일이 있는지 확인한다).
//
// 넣는 모양(예시 — 실제 값으로 바꿔서 배열에 넣는다):
//   {
//     name: "받은 이름(영문)",
//     role: "Driver-guide",
//     photo: { src: "/images/crew/파일이름.jpg", alt: "이름, driver-guide at Entour Korea" },
//     licence: "Korean tourist guide licence (관광통역안내사), English",   ← 자격증 사본에 적힌 언어 그대로
//     languages: ["English", "Tagalog"],                                  ← 손님과 말할 수 있는 언어
//     intro: "한두 문장 소개(영어)",
//   },
export const crew: CrewMember[] = [];

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

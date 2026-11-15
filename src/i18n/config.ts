// 사이트 언어 목록과 주소 규칙. 브라우저(클라이언트)와 서버가 같이 쓴다(번역 사전은 여기서 불러오지 않는다).
// 영어는 앞머리 없는 주소(/prices), 다른 언어는 언어 앞머리를 붙인다(/zh/prices). src/proxy.ts가 이 규칙으로 주소를 나눈다.

export const locales = ["en", "zh", "ja", "es", "id", "th", "tl", "vi", "ko"] as const;
export type Lang = (typeof locales)[number];
export const defaultLang: Lang = "en";
/** 번역본이 있는 언어(영어 제외). 주소 앞머리가 붙는 언어 전부. */
export const translatedLangs = locales.filter((l) => l !== defaultLang) as Exclude<Lang, "en">[];

/**
 * 사장님 검토용 언어(2026-11-16 「한국어 버전도 만들어줘, 내가 체크하기 위해 필요해」).
 * 주소(/ko/...)로 열리고 머리글 언어 단추에도 있지만, 검색엔진에는 내보내지 않는다(noindex, hreflang·사이트맵·llms.txt·바닥글에서 뺀다).
 * 손님용으로 열려면 이 목록에서 빼면 된다.
 */
export const reviewLangs: readonly Lang[] = ["ko"];
/** 손님에게 공개하는 언어(검색엔진에 알리는 언어). */
export const publicLocales = locales.filter((l) => !reviewLangs.includes(l));
export const isReviewLang = (lang: Lang) => reviewLangs.includes(lang);

export interface LocaleInfo {
  /** 언어 고르는 메뉴에 그 언어로 쓰는 이름 */
  name: string;
  /** 영어 이름(문서·시험용) */
  english: string;
  /** <html lang>와 hreflang 값 */
  tag: string;
  /** og:locale */
  ogLocale: string;
  /** 날짜·목록 표기(Intl)에 쓰는 언어 */
  intl: string;
}

export const localeInfo: Record<Lang, LocaleInfo> = {
  en: { name: "English", english: "English", tag: "en", ogLocale: "en_US", intl: "en-GB" },
  zh: { name: "简体中文", english: "Chinese (Simplified)", tag: "zh-Hans", ogLocale: "zh_CN", intl: "zh-CN" },
  ja: { name: "日本語", english: "Japanese", tag: "ja", ogLocale: "ja_JP", intl: "ja-JP" },
  es: { name: "Español", english: "Spanish", tag: "es", ogLocale: "es_ES", intl: "es-ES" },
  id: { name: "Bahasa Indonesia", english: "Indonesian", tag: "id", ogLocale: "id_ID", intl: "id-ID" },
  th: { name: "ไทย", english: "Thai", tag: "th", ogLocale: "th_TH", intl: "th-TH" },
  tl: { name: "Tagalog", english: "Tagalog (Filipino)", tag: "tl", ogLocale: "tl_PH", intl: "fil-PH" },
  vi: { name: "Tiếng Việt", english: "Vietnamese", tag: "vi", ogLocale: "vi_VN", intl: "vi-VN" },
  ko: { name: "한국어 (검토용)", english: "Korean (owner review)", tag: "ko", ogLocale: "ko_KR", intl: "ko-KR" },
};

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** "/prices#x" → "/zh/prices#x". 영어는 그대로. 바깥 주소(http…)·"#…"만 있는 주소는 건드리지 않는다. */
export function localizePath(path: string, lang: Lang): string {
  if (lang === defaultLang || !path.startsWith("/")) return path;
  const cut = path.search(/[?#]/);
  const pathname = cut === -1 ? path : path.slice(0, cut);
  const rest = cut === -1 ? "" : path.slice(cut);
  return `/${lang}${pathname === "/" ? "" : pathname}${rest}`;
}

/** 주소에서 언어 앞머리를 떼어 낸다. "/zh/prices" → { lang: "zh", path: "/prices" }, "/prices" → { lang: "en", path: "/prices" } */
export function splitLang(pathname: string): { lang: Lang; path: string } {
  const first = pathname.split("/")[1] ?? "";
  // "/en/…"도 받는다(서버 렌더링 때 주소가 안쪽 경로로 보일 수 있다).
  if (isLang(first)) {
    const rest = pathname.slice(first.length + 1);
    return { lang: first, path: rest === "" ? "/" : rest };
  }
  return { lang: defaultLang, path: pathname || "/" };
}

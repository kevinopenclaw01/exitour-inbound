import type { Metadata } from "next";
import { articles } from "@/content/articles";
import { pages, type PageKey, type PageMeta } from "@/content/pages";
import { site } from "@/content/site";
import { defaultLang, isLang, isReviewLang, localeInfo, localizePath, publicLocales, type Lang } from "@/i18n/config";
import { translator } from "@/i18n/translate";

// 쪽별 메타데이터(제목·설명·canonical·공유 그림)를 한 모양으로 만든다.
// Next.js는 openGraph·robots 같은 묶음을 쪽에서 다시 정하면 통째로 바꿔 쓰므로(합쳐 주지 않는다) 여기서 전부 채운다.

export const OG_SIZE = { width: 1200, height: 630 } as const;

/** 미리보기 길이·그림 크기를 제한하지 않는다고 밝혀 둔다(검색 결과와 AI 답변이 본문을 넉넉히 인용할 수 있게). */
export const indexRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  "max-image-preview": "large",
  "max-snippet": -1,
  "max-video-preview": -1,
};

export const noindexRobots: Metadata["robots"] = { index: false, follow: false };

/** 검색엔진 소유 확인 코드(site.verification). 빈 값은 넣지 않는다. */
export function verificationMetadata(): Metadata["verification"] {
  const { google, bing, naver } = site.verification;
  const other: Record<string, string> = {};
  if (bing) other["msvalidate.01"] = bing;
  if (naver) other["naver-site-verification"] = naver;
  return {
    ...(google ? { google } : {}),
    ...(Object.keys(other).length > 0 ? { other } : {}),
  };
}

/** 공유 그림 주소. src/app/og/[file]/route.tsx가 빌드 때 PNG로 굽는다. */
export function ogImagePath(key: string): string {
  return `/og/${key}.png`;
}

export function articleOgKey(slug: string): string {
  return `article-${slug}`;
}

/** 공유 그림에 찍을 글자 목록(쪽 + 안내 글). og 경로와 시험이 함께 쓴다. */
export function ogEntries(): { key: string; title: string; sub: string }[] {
  return [
    ...(Object.entries(pages) as [PageKey, PageMeta][]).map(([key, p]) => ({ key, title: p.og.title, sub: p.og.sub })),
    ...articles.map((a) => ({ key: articleOgKey(a.slug), title: a.title, sub: "Travel guide" })),
  ];
}

/** 언어별 주소 묶음(hreflang). 영어만 있는 쪽은 넣지 않는다. x-default는 영어 쪽. */
export function languageAlternates(path: string): Record<string, string> {
  const out: Record<string, string> = {};
  // 검토용 언어(한국어)는 넣지 않는다(src/i18n/config.ts의 reviewLangs).
  for (const l of publicLocales) out[localeInfo[l].tag] = localizePath(path, l);
  out["x-default"] = path;
  return out;
}

function social(
  lang: Lang,
  title: string,
  description: string,
  path: string,
  ogKey: string,
  type: "website" | "article",
  modifiedTime?: string,
  translated = true,
) {
  // 공유 그림은 영어판 하나를 모든 언어가 같이 쓴다(그림 글꼴에 한자·태국 문자가 없어서).
  const image = { url: ogImagePath(ogKey), ...OG_SIZE, alt: `${title} — ${site.brand}` };
  return {
    openGraph: {
      type,
      siteName: site.brand,
      locale: localeInfo[lang].ogLocale,
      ...(translated ? { alternateLocale: publicLocales.filter((l) => l !== lang).map((l) => localeInfo[l].ogLocale) } : {}),
      title,
      description,
      url: localizePath(path, lang),
      images: [image],
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [image] },
  };
}

/** 영어로만 두는 쪽(약관 초안·숨긴 쪽). 다른 언어 주소에서는 열리지 않는다(notFound). */
export const englishOnlyPages = new Set<PageKey>(["guide-tour", "join-as-guide"]);

/** src/content/pages.ts의 쪽 하나에 대한 메타데이터. published가 false면(약관 틀 등) noindex로 내보낸다. */
export function pageMetadata(key: PageKey, options: { published?: boolean; lang?: Lang } = {}): Metadata {
  const lang = options.lang ?? defaultLang;
  const t = translator(lang);
  const page: PageMeta = pages[key];
  // 검토용 언어 쪽은 검색엔진에 내보내지 않는다.
  const index = page.index !== false && options.published !== false && !isReviewLang(lang);
  const translated = !englishOnlyPages.has(key);
  const title = t(page.title);
  const description = t(page.description);
  return {
    // 홈은 브랜드 이름이 제목 안에 이미 있어서 " | Entour Korea"를 붙이지 않는다.
    title: key === "home" ? { absolute: title } : title,
    description,
    alternates: {
      canonical: localizePath(page.path, lang),
      ...(translated && index ? { languages: languageAlternates(page.path) } : {}),
    },
    robots: index ? indexRobots : noindexRobots,
    ...social(lang, title, description, page.path, key, "website", undefined, translated),
  };
}

/** 쪽 파일에서 쓰는 generateMetadata. 예: export const generateMetadata = metadataFor("prices"); */
export function metadataFor(key: PageKey, options: { published?: boolean } = {}) {
  return async ({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> => {
    const { lang } = await params;
    return pageMetadata(key, { ...options, lang: isLang(lang) ? lang : defaultLang });
  };
}

export function articleMetadata(
  article: { slug: string; title: string; description: string; updated: string },
  lang: Lang = defaultLang,
): Metadata {
  const t = translator(lang);
  const path = `/travel-guide/${article.slug}`;
  const title = t(article.title);
  const description = t(article.description);
  return {
    title,
    description,
    alternates: {
      canonical: localizePath(path, lang),
      ...(isReviewLang(lang) ? {} : { languages: languageAlternates(path) }),
    },
    robots: isReviewLang(lang) ? noindexRobots : indexRobots,
    ...social(lang, title, description, path, articleOgKey(article.slug), "article", article.updated),
  };
}

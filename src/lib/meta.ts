import type { Metadata } from "next";
import { articles } from "@/content/articles";
import { pages, type PageKey, type PageMeta } from "@/content/pages";
import { site } from "@/content/site";

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

function social(title: string, description: string, path: string, ogKey: string, type: "website" | "article", modifiedTime?: string) {
  const image = { url: ogImagePath(ogKey), ...OG_SIZE, alt: `${title} — ${site.brand}` };
  return {
    openGraph: {
      type,
      siteName: site.brand,
      locale: "en_US",
      title,
      description,
      url: path,
      images: [image],
      ...(type === "article" && modifiedTime ? { modifiedTime } : {}),
    },
    twitter: { card: "summary_large_image" as const, title, description, images: [image] },
  };
}

/** src/content/pages.ts의 쪽 하나에 대한 메타데이터. published가 false면(약관 틀 등) noindex로 내보낸다. */
export function pageMetadata(key: PageKey, options: { published?: boolean } = {}): Metadata {
  const page: PageMeta = pages[key];
  const index = page.index !== false && options.published !== false;
  return {
    // 홈은 브랜드 이름이 제목 안에 이미 있어서 " | Entour Korea"를 붙이지 않는다.
    title: key === "home" ? { absolute: page.title } : page.title,
    description: page.description,
    alternates: { canonical: page.path },
    robots: index ? indexRobots : noindexRobots,
    ...social(page.title, page.description, page.path, key, "website"),
  };
}

export function articleMetadata(article: { slug: string; title: string; description: string; updated: string }): Metadata {
  const path = `/travel-guide/${article.slug}`;
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: path },
    robots: indexRobots,
    ...social(article.title, article.description, path, articleOgKey(article.slug), "article", article.updated),
  };
}

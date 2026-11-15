import { airportTransfer } from "@/content/airportTransfer";
import { articles } from "@/content/articles";
import { legalDocs, legalPublished } from "@/content/legal";
import { services } from "@/content/services";
import { site } from "@/content/site";

// 사이트맵·llms.txt가 함께 쓰는 공개 페이지 목록. 페이지를 추가하면 여기에도 넣는다(tests/routes.test.ts가 확인).
// updated는 사이트맵의 수정일(lastmod)이다. 그 쪽의 본문이 실제로 바뀐 날만 적는다.

export interface PublicRoute {
  path: string;
  title: string;
  updated: string;
  priority: number;
}

export function publicRoutes(): PublicRoute[] {
  const updated = site.contentUpdated;
  const newestArticle = articles.map((a) => a.updated).sort().at(-1) ?? updated;
  return [
    { path: "/", title: "Home", updated, priority: 1 },
    ...services.filter((s) => s.listed).map((s) => ({ path: s.path, title: s.name, updated: s.updated, priority: 0.9 })),
    { path: "/prices", title: "Prices", updated, priority: 0.9 },
    { path: "/day-plans", title: "10-hour day plans", updated, priority: 0.8 },
    { path: "/plan", title: "Plan my trip", updated, priority: 0.7 },
    { path: "/faq", title: "FAQ", updated, priority: 0.7 },
    { path: "/about", title: "About us", updated, priority: 0.5 },
    { path: "/contact", title: "Contact us", updated: "2026-10-25", priority: 0.7 },
    { path: airportTransfer.path, title: airportTransfer.name, updated: airportTransfer.updated, priority: 0.8 },
    { path: "/safety", title: "Licensed & safe", updated: "2026-10-24", priority: 0.8 },
    { path: "/travel-guide", title: "Travel guide", updated: newestArticle, priority: 0.6 },
    ...articles.map((a) => ({ path: `/travel-guide/${a.slug}`, title: a.title, updated: a.updated, priority: 0.8 })),
    // 약관·개인정보·환불 쪽은 값이 다 채워진 것만 싣는다(src/content/legal.ts).
    ...legalDocs
      .filter((d) => legalPublished(d.doc))
      .map((d) => ({ path: d.path, title: d.label, updated: updated, priority: 0.3 })),
  ];
}

/** 영어판만 있는 공개 쪽(약관·개인정보·환불). 다른 언어 주소는 404다(src/lib/meta.ts의 englishOnlyPages). */
export function englishOnlyRoutes(): string[] {
  return legalDocs.map((d) => d.path);
}

/** 코드는 있지만 숨긴 쪽: 메뉴·바닥글·사이트맵·llms.txt에 없고 noindex다. */
export function hiddenRoutes(): string[] {
  return [
    ...services.filter((s) => !s.listed).map((s) => s.path),
    "/join-as-guide",
    ...legalDocs.filter((d) => !legalPublished(d.doc)).map((d) => d.path),
  ];
}

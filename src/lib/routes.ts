import { articles } from "@/content/articles";
import { services } from "@/content/services";

// 사이트맵·llms.txt가 함께 쓰는 공개 페이지 목록. 페이지를 추가하면 여기에도 넣는다(tests/routes.test.ts가 확인).

export interface PublicRoute {
  path: string;
  title: string;
  updated: string;
  priority: number;
}

const SITE_UPDATED = "2026-10-24";

export function publicRoutes(): PublicRoute[] {
  return [
    { path: "/", title: "Home", updated: SITE_UPDATED, priority: 1 },
    ...services.map((s) => ({ path: s.path, title: s.name, updated: s.updated, priority: 0.9 })),
    { path: "/prices", title: "Prices", updated: SITE_UPDATED, priority: 0.9 },
    { path: "/safety", title: "Licensed & safe", updated: SITE_UPDATED, priority: 0.8 },
    { path: "/plan", title: "Plan my trip", updated: SITE_UPDATED, priority: 0.7 },
    { path: "/faq", title: "FAQ", updated: SITE_UPDATED, priority: 0.7 },
    { path: "/contact", title: "Contact us", updated: "2026-10-25", priority: 0.7 },
    { path: "/travel-guide", title: "Travel guide", updated: SITE_UPDATED, priority: 0.6 },
    ...articles.map((a) => ({ path: `/travel-guide/${a.slug}`, title: a.title, updated: a.updated, priority: 0.8 })),
    { path: "/about", title: "About us", updated: SITE_UPDATED, priority: 0.5 },
    { path: "/join-as-guide", title: "Work with us as a guide", updated: SITE_UPDATED, priority: 0.4 },
  ];
}

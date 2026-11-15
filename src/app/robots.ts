import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { aiCrawlers } from "@/lib/crawlers";

// 로봇 이름 목록은 src/lib/crawlers.ts에 있다.
// 여행 요청 저장 API는 공개 페이지가 아니라서 뺀다.
const access = { allow: "/", disallow: ["/api/"] };

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", ...access },
      { userAgent: aiCrawlers, ...access },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}

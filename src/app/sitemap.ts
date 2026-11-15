import type { MetadataRoute } from "next";
import { localeInfo, localizePath, locales } from "@/i18n/config";
import { englishOnlyRoutes, publicRoutes } from "@/lib/routes";
import { abs } from "@/lib/schema";

// 공개 쪽마다 8개 언어 주소를 모두 싣고, 같은 쪽의 다른 언어 주소를 alternates(hreflang)로 묶는다.
// 영어판만 있는 쪽(약관류)은 영어 주소 하나만.

export default function sitemap(): MetadataRoute.Sitemap {
  const englishOnly = new Set(englishOnlyRoutes());
  return publicRoutes().flatMap((r) => {
    const lastModified = new Date(`${r.updated}T00:00:00+09:00`);
    if (englishOnly.has(r.path)) return [{ url: abs(r.path), lastModified, priority: r.priority }];
    const languages = Object.fromEntries([
      ...locales.map((l) => [localeInfo[l].tag, abs(localizePath(r.path, l))]),
      ["x-default", abs(r.path)],
    ]);
    return locales.map((l) => ({
      url: abs(localizePath(r.path, l)),
      lastModified,
      priority: r.priority,
      alternates: { languages },
    }));
  });
}

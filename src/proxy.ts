import { NextResponse, type NextRequest } from "next/server";
import { defaultLang, translatedLangs } from "@/i18n/config";

// 언어 주소 나누기.
// - 영어는 앞머리 없는 주소를 쓴다: /prices → 안쪽에서 /en/prices 쪽을 보여 준다(주소창은 그대로).
// - 다른 언어는 앞머리가 붙은 주소 그대로: /zh/prices
// - /en/... 로 들어오면 앞머리 없는 주소로 영구 이동(같은 쪽이 두 주소로 검색되지 않게).
// 파일(점이 있는 주소: robots.txt·sitemap.xml·llms.txt·사진), API, 공유 그림(/og/...)은 건드리지 않는다.

const translated = new Set<string>(translatedLangs);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (first === defaultLang) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(defaultLang.length + 1) || "/";
    return NextResponse.redirect(url, 308);
  }
  if (translated.has(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLang}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!api/|og/|_next/|.*\\.[^/]+$).*)"],
};

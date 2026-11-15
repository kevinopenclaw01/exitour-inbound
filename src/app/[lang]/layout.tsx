import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { JsonLd } from "@/components/ui";
import { pages } from "@/content/pages";
import { site } from "@/content/site";
import { isLang, localeInfo, locales } from "@/i18n/config";
import { translator } from "@/i18n/translate";
import { indexRobots, ogImagePath, OG_SIZE, verificationMetadata } from "@/lib/meta";
import { organizationLd, websiteLd } from "@/lib/schema";
import "../globals.css";

// 모든 쪽의 바깥 틀. 주소 첫 칸이 언어다(영어는 src/proxy.ts가 앞머리 없는 주소를 /en으로 넘겨 준다).
// 쪽마다 src/lib/meta.ts의 pageMetadata가 제목·설명·canonical·공유 그림을 다시 정한다. 여기는 기본값과 사이트 공통 값이다.

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const t = translator(isLang(lang) ? lang : "en");
  return {
    metadataBase: new URL(site.url),
    title: {
      default: t(pages.home.title),
      template: `%s | ${site.brand}`,
    },
    description: t(site.description),
    applicationName: site.brand,
    openGraph: {
      type: "website",
      siteName: site.brand,
      locale: localeInfo[t.lang].ogLocale,
      images: [{ url: ogImagePath("home"), ...OG_SIZE, alt: site.brand }],
    },
    twitter: { card: "summary_large_image" },
    robots: indexRobots,
    verification: verificationMetadata(),
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = { themeColor: "#ffffff" };

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={localeInfo[lang].tag}>
      <body className="min-h-screen bg-paper text-ink antialiased">
        <JsonLd data={[organizationLd(lang), websiteLd(lang)]} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

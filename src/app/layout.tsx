import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { JsonLd } from "@/components/ui";
import { pages } from "@/content/pages";
import { site } from "@/content/site";
import { indexRobots, ogImagePath, OG_SIZE, verificationMetadata } from "@/lib/meta";
import { organizationLd, websiteLd } from "@/lib/schema";
import "./globals.css";

// 쪽마다 src/lib/meta.ts의 pageMetadata가 제목·설명·canonical·공유 그림을 다시 정한다. 여기는 기본값과 사이트 공통 값이다.
export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: pages.home.title,
    template: `%s | ${site.brand}`,
  },
  description: site.description,
  applicationName: site.brand,
  openGraph: {
    type: "website",
    siteName: site.brand,
    locale: "en_US",
    images: [{ url: ogImagePath("home"), ...OG_SIZE, alt: site.brand }],
  },
  twitter: { card: "summary_large_image" },
  robots: indexRobots,
  verification: verificationMetadata(),
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink antialiased">
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

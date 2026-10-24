import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteFooter, SiteHeader } from "@/components/SiteChrome";
import { JsonLd } from "@/components/ui";
import { site } from "@/content/site";
import { organizationLd, websiteLd } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.brand}: private driver & licensed guide tours in Korea`,
    template: `%s | ${site.brand}`,
  },
  description: site.description,
  applicationName: site.brand,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: site.brand, locale: "en_US" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#0d6a4b" };

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

import { site } from "@/content/site";
import type { Article, Faq, PriceRule, Service } from "@/content/types";
import { publishableRates } from "./pricing";

// schema.org 구조화 데이터(JSON-LD). 비어 있는 회사 정보(null)와 확정되지 않은 가격은 넣지 않는다.

type Json = Record<string, unknown>;

export const abs = (path: string) => `${site.url}${path === "/" ? "" : path}`;

const orgId = () => `${site.url}/#organization`;

export function organizationLd(): Json {
  const ld: Json = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": orgId(),
    name: site.brand,
    url: site.url,
    description: site.description,
    slogan: site.tagline,
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    knowsLanguage: site.guideLanguages,
    parentOrganization: { "@type": "TravelAgency", name: site.operator },
  };
  if (site.email) ld.email = site.email;
  if (site.address) ld.address = site.address;
  if (site.sameAs.length > 0) ld.sameAs = site.sameAs;
  return ld;
}

export function websiteLd(): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.brand,
    url: site.url,
    publisher: { "@id": orgId() },
    inLanguage: "en",
  };
}

export function serviceLd(service: Service, rules?: PriceRule[]): Json {
  const offers = publishableRates(service.id, rules).map((r) => ({
    "@type": "Offer",
    name: r.label,
    price: r.priceKrw,
    priceCurrency: "KRW",
    availability: "https://schema.org/InStock",
  }));
  const ld: Json = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.name,
    serviceType: service.name,
    description: service.answer,
    url: abs(service.path),
    provider: { "@id": orgId() },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
  };
  if (offers.length > 0) ld.offers = offers;
  return ld;
}

export function faqLd(faqs: Faq[]): Json | null {
  if (faqs.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function articleLd(article: Article): Json {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    dateModified: article.updated,
    datePublished: article.updated,
    mainEntityOfPage: abs(`/travel-guide/${article.slug}`),
    author: { "@id": orgId() },
    publisher: { "@id": orgId() },
    inLanguage: "en",
  };
}

/** <script type="application/ld+json"> 안에 넣을 문자열. `<`를 이스케이프해 스크립트 주입을 막는다. */
export function serializeLd(data: Json | Json[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

import { dayProduct, regionLabels } from "@/content/pricing";
import { site } from "@/content/site";
import type { Article, DayPlan, DayRate, Faq, PriceRule, ProductId, Service } from "@/content/types";
import { defaultLang, localeInfo, localizePath, type Lang } from "@/i18n/config";
import { en, translator, type Translator } from "@/i18n/translate";
import { publishableDayRates, publishableRates } from "./pricing";

// schema.org 구조화 데이터(JSON-LD). 비어 있는 회사 정보(null)와 확정되지 않은 가격은 넣지 않는다.
// 빌드 뒤 `node scripts/check-structured-data.mjs`가 모든 쪽의 JSON-LD를 읽어 규칙을 확인한다.

type Json = Record<string, unknown>;

export const abs = (path: string) => `${site.url}${path === "/" ? "" : path}`;

const orgId = () => `${site.url}/#organization`;

const productIds: readonly string[] = ["private-driver", "driver-guide"] satisfies ProductId[];

export function organizationLd(lang: Lang = defaultLang): Json {
  const t = translator(lang);
  const ld: Json = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "@id": orgId(),
    name: site.brand,
    url: abs(localizePath("/", lang)),
    description: t(site.description),
    slogan: t(site.tagline),
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    knowsLanguage: site.guideLanguages,
    parentOrganization: { "@type": "TravelAgency", name: site.operator },
  };
  if (site.email) ld.email = site.email;
  if (site.phone) {
    ld.telephone = site.phone;
    ld.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: site.phone,
      availableLanguage: ["English", "Korean"],
      hoursAvailable: {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "09:00",
        closes: "18:00",
      },
    };
  }
  if (site.address) ld.address = site.address;
  if (site.sameAs.length > 0) ld.sameAs = site.sameAs;
  return ld;
}

export function websiteLd(lang: Lang = defaultLang): Json {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    name: site.brand,
    url: abs(localizePath("/", lang)),
    publisher: { "@id": orgId() },
    inLanguage: localeInfo[lang].tag,
  };
}

/**
 * 서비스 한 쪽의 Service. Offer(가격)는 사장님이 확정한 값만 넣는다.
 * 두 상품은 네 칸 표(dayRates)에서, 그 밖의 서비스는 priceRules에서 가져온다. data는 시험용.
 */
export function serviceLd(service: Service, data: { dayRates?: DayRate[]; rules?: PriceRule[] } = {}, t: Translator = en): Json {
  const isProduct = productIds.includes(service.id);
  const offers = isProduct
    ? publishableDayRates(service.id as ProductId, data.dayRates).map((r) => ({
        "@type": "Offer",
        name: t("{service}: {region}, {hours} hours", {
          service: t(service.name),
          region: t(regionLabels[r.region].name),
          hours: dayProduct.hours,
        }),
        price: r.priceKrw,
        priceCurrency: "KRW",
        availability: "https://schema.org/InStock",
        url: abs(t.href(service.path)),
      }))
    : publishableRates(service.id, data.rules).map((r) => ({
        "@type": "Offer",
        name: t(r.label),
        price: r.priceKrw,
        priceCurrency: "KRW",
        availability: "https://schema.org/InStock",
        url: abs(t.href(service.path)),
      }));
  const areas = isProduct ? ["Seoul", "Gyeonggi-do"] : site.areaServed;
  const ld: Json = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t(service.name),
    serviceType: t(service.name),
    description: t(service.answer),
    url: abs(t.href(service.path)),
    provider: { "@id": orgId() },
    areaServed: areas.map((name) => ({ "@type": "Place", name })),
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

/** /day-plans의 예시 목록. */
export function dayPlanListLd(plans: DayPlan[], path: string, t: Translator = en): Json {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("{hours}-hour day plans by private van", { hours: dayProduct.hours }),
    itemListElement: plans.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t(p.name),
      url: `${abs(t.href(path))}#${p.slug}`,
    })),
  };
}

export function articleLd(article: Article, imagePath?: string, t: Translator = en): Json {
  const ld: Json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: t(article.title),
    description: t(article.description),
    dateModified: article.updated,
    datePublished: article.updated,
    mainEntityOfPage: abs(t.href(`/travel-guide/${article.slug}`)),
    author: { "@id": orgId() },
    publisher: { "@id": orgId() },
    inLanguage: localeInfo[t.lang].tag,
  };
  if (imagePath) ld.image = abs(imagePath);
  return ld;
}

/** <script type="application/ld+json"> 안에 넣을 문자열. `<`를 이스케이프해 스크립트 주입을 막는다. */
export function serializeLd(data: Json | Json[]): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

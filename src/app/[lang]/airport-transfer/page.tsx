import Image from "next/image";
import Link from "next/link";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { airportTransfer } from "@/content/airportTransfer";
import { airportMaxPassengers, airportRates } from "@/content/pricing";
import { site } from "@/content/site";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { msg } from "@/i18n/msg";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { formatKrw, formatUsdApprox, isConfirmed } from "@/lib/pricing";
import { abs, breadcrumbLd, faqLd } from "@/lib/schema";

export const generateMetadata = metadataFor("airport-transfer");

export default async function Page() {
  const t = await getT();
  const page = t.obj(airportTransfer);
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    [airportTransfer.name, airportTransfer.path],
  ]);

  // 공항 픽업 값은 pricing.ts의 airportRates(확정값만 Offer로 낸다).
  const rates = airportRates.filter(isConfirmed);
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.name,
    serviceType: "Airport transfer",
    description: page.answer,
    url: abs(t.href(airportTransfer.path)),
    provider: { "@id": `${site.url}/#organization` },
    areaServed: [
      { "@type": "Airport", name: "Incheon International Airport", iataCode: "ICN" },
      { "@type": "Airport", name: "Gimpo International Airport", iataCode: "GMP" },
      ...site.areaServed.map((name) => ({ "@type": "Place", name })),
    ],
    ...(rates.length > 0
      ? {
          offers: rates.map((r) => ({
            "@type": "Offer",
            name: t(r.label),
            price: r.priceKrw,
            priceCurrency: "KRW",
            availability: "https://schema.org/InStock",
            url: abs(t.href(airportTransfer.path)),
          })),
        }
      : {}),
  };

  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={[serviceLd, faqLd(page.faqs), breadcrumbLd(crumbs)]} />

      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">{page.name}</h1>
        <p className="text-lg text-muted">{page.tagline}</p>
        <AnswerBox updated={airportTransfer.updated}>{page.answer}</AnswerBox>
      </header>

      {/* 2026-11-16 사장님 지시로 실제 기사님 사진을 바탕으로 AI(Codex 이미지)가 그린 그림. 사진처럼 보이지 않게 "Illustration"이라고 밝힌다. */}
      <figure className="grid gap-1.5 sm:max-w-xl">
        <div className="relative aspect-[3/2] overflow-hidden rounded-md bg-paper">
          <Image
            src="/images/airport/driver-name-board.webp"
            alt={t("Illustration: our driver at the arrivals hall holding a board with the guests' name and hotel")}
            fill
            sizes="(min-width: 640px) 576px, 100vw"
            className="object-cover"
          />
        </div>
        <figcaption className="text-xs text-muted">{t("Illustration of how your driver meets you. The board shows your name and hotel.")}</figcaption>
      </figure>

      <section className="grid gap-4">
        <h2 className="text-2xl font-bold">{t("How it works")}</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {page.steps.map((step, i) => (
            <li key={step.title} className="grid content-start gap-1 rounded-md border border-line bg-surface p-4">
              <span className="text-sm font-bold tabular-nums text-sign">{t("Step {n}", { n: i + 1 })}</span>
              <span className="font-semibold">{step.title}</span>
              <span className="text-sm text-muted">{step.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">{t("Best for")}</h2>
          <BulletList items={page.bestFor} />
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">{t("Who comes with you")}</h2>
          <p>
            {t(
              "A professional driver who speaks English. A Tagalog-speaking driver can be arranged on request. The driver is not a tour guide and does not give sightseeing commentary.",
            )}
          </p>
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">{t("Included")}</h2>
          <BulletList items={page.includes} tone="check" />
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">{t("Not included")}</h2>
          <BulletList items={page.excludes} tone="cross" />
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("Which airport")}</h2>
        <div className="overflow-x-auto rounded-md border border-line bg-surface">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="bg-paper text-xs text-muted">
              <tr>
                {page.airports.head.map((h) => (
                  <th key={h} scope="col" className="px-4 py-2.5 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {page.airports.rows.map((row) => (
                <tr key={row[0]} className="border-t border-line">
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className="px-4 py-3 font-medium">
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className="px-4 py-3 text-muted">
                        {cell}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("Price")}</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {rates.map((r) => (
            <div key={r.airport} className="grid content-start gap-1 rounded-md border border-line bg-surface p-4">
              <p className="font-semibold">{t(r.label)}</p>
              <p className="text-xl font-bold text-sign-deep tabular-nums">{formatKrw(r.priceKrw)}</p>
              <p className="text-sm text-muted tabular-nums">{formatUsdApprox(r.priceKrw)}</p>
            </div>
          ))}
        </div>
        <p>
          {t("Per van, not per person, for up to {max} passengers with luggage. Early-morning and late-night flights cost the same.", {
            max: airportMaxPassengers,
          })}
        </p>
        <p>{t("We quote separately for:")}</p>
        <BulletList items={page.priceFactors} />
        <p className="text-sm">
          <Link href={t.href("/prices")} className="text-sign underline">
            {t("See day-tour prices")}
          </Link>
        </p>
      </section>

      <section className="grid gap-2">
        <h2 className="text-2xl font-bold">{t("Your van")}</h2>
        <p>
          {t(
            "A Hyundai Staria. It takes up to {max} passengers with their suitcases; it has seats for 7, but with 6 or 7 people there is no room left for luggage.",
            { max: airportMaxPassengers },
          )}
        </p>
      </section>

      <FaqList faqs={page.faqs} />

      <section className="grid gap-2">
        <h2 className="text-xl font-bold">{t("Read before you book")}</h2>
        <ul className="grid gap-1">
          <li>
            <Link href={t.href("/travel-guide/incheon-airport-to-seoul")} className="text-sign underline">
              {t("What is the best way to get from Incheon Airport to Seoul?")}
            </Link>
          </li>
          <li>
            <Link href={t.href("/travel-guide/sunset-near-incheon-airport")} className="text-sign underline">
              {t("Where can you watch the sunset near Incheon Airport?")}
            </Link>
          </li>
          <li>
            <Link href={t.href("/private-driver")} className="text-sign underline">
              {t("Private Car & Driver for a full day")}
            </Link>
          </li>
        </ul>
      </section>

      <CtaBand
        title={msg("Send your flight")}
        text={msg("Flight number, hotel, people and suitcases. We confirm your driver and send a payment link.")}
      />
    </Container>
  );
}

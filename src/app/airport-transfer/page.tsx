import type { Metadata } from "next";
import Link from "next/link";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { airportTransfer as page } from "@/content/airportTransfer";
import { vehicles } from "@/content/services";
import { site } from "@/content/site";
import { abs, breadcrumbLd, faqLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: page.title,
  description: page.answer,
  alternates: { canonical: page.path },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: page.name, path: page.path },
];

// 공항 픽업은 확정가가 없어 Offer 없이 Service만 알린다(가격은 pricing.ts에 confirmed로 들어온 뒤).
const serviceLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: page.name,
  serviceType: "Airport transfer",
  description: page.answer,
  url: abs(page.path),
  provider: { "@id": `${site.url}/#organization` },
  areaServed: [
    { "@type": "Airport", name: "Incheon International Airport", iataCode: "ICN" },
    { "@type": "Airport", name: "Gimpo International Airport", iataCode: "GMP" },
    ...site.areaServed.map((name) => ({ "@type": "Place", name })),
  ],
};

export default function Page() {
  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={[serviceLd, faqLd(page.faqs), breadcrumbLd(crumbs)]} />

      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">{page.name}</h1>
        <p className="text-lg text-muted">{page.tagline}</p>
        <AnswerBox updated={page.updated}>{page.answer}</AnswerBox>
      </header>

      <section className="grid gap-4">
        <h2 className="text-2xl font-bold">How it works</h2>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {page.steps.map((step, i) => (
            <li key={step.title} className="grid content-start gap-1 rounded-md border border-line bg-surface p-4">
              <span className="text-sm font-bold tabular-nums text-sign">Step {i + 1}</span>
              <span className="font-semibold">{step.title}</span>
              <span className="text-sm text-muted">{step.text}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">Best for</h2>
          <BulletList items={page.bestFor} />
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">Who comes with you</h2>
          <p>
            A professional driver. Some drivers speak basic English; otherwise communication works through a translation app.
            The driver is not a tour guide and does not give sightseeing commentary.
          </p>
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">Included</h2>
          <BulletList items={page.includes} tone="check" />
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">Not included</h2>
          <BulletList items={page.excludes} tone="cross" />
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">Which airport</h2>
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
        <h2 className="text-2xl font-bold">Price</h2>
        <p>
          Quote on request. The price is per van for the whole transfer, and we send it in writing before you confirm. It depends
          on:
        </p>
        <BulletList items={page.priceFactors} />
        <p className="text-sm">
          <Link href="/prices" className="text-sign underline">
            See day-tour prices
          </Link>
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">Choose your van</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {vehicles.map((v) => (
            <div key={v.id} className="grid content-start gap-1 rounded-md border border-line bg-surface p-4">
              <h3 className="font-semibold">{v.name}</h3>
              <p className="text-sm tabular-nums text-sign-deep">
                Up to {v.comfortablePax} people with luggage · {v.seats} seats
              </p>
              <p className="text-sm text-muted">{v.note}</p>
            </div>
          ))}
        </div>
      </section>

      <FaqList faqs={page.faqs} />

      <section className="grid gap-2">
        <h2 className="text-xl font-bold">Read before you book</h2>
        <ul className="grid gap-1">
          <li>
            <Link href="/travel-guide/incheon-airport-to-seoul" className="text-sign underline">
              What is the best way to get from Incheon Airport to Seoul?
            </Link>
          </li>
          <li>
            <Link href="/travel-guide/sunset-near-incheon-airport" className="text-sign underline">
              Where can you watch the sunset near Incheon Airport?
            </Link>
          </li>
          <li>
            <Link href="/private-driver" className="text-sign underline">
              Private Car & Driver for a full day
            </Link>
          </li>
        </ul>
      </section>

      <CtaBand
        title="Send your flight"
        text="Flight number, hotel, people and suitcases. We reply with the van and a written price."
      />
    </Container>
  );
}

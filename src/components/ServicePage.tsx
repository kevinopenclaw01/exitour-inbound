import Link from "next/link";
import type { ReactNode } from "react";
import { articles } from "@/content/articles";
import { vehicles } from "@/content/services";
import type { Service } from "@/content/types";
import { ratesFor } from "@/lib/pricing";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/schema";
import { PriceTable } from "./PriceTable";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, FaqList, JsonLd } from "./ui";

export function ServicePage({ service, children }: { service: Service; children?: ReactNode }) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: service.name, path: service.path },
  ];
  const related = articles.filter((a) => a.related.includes(service.id));

  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={[serviceLd(service), faqLd(service.faqs), breadcrumbLd(crumbs)]} />

      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">{service.name}</h1>
        <p className="text-lg text-muted">{service.tagline}</p>
        <AnswerBox updated={service.updated}>{service.answer}</AnswerBox>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">Best for</h2>
          <BulletList items={service.bestFor} />
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">Who comes with you</h2>
          <p>{service.crew}</p>
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">Included</h2>
          <BulletList items={service.includes} tone="check" />
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">Not included</h2>
          <BulletList items={service.excludes} tone="cross" />
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">Prices</h2>
        <PriceTable rules={ratesFor(service.id)} caption={`${service.name} prices`} />
        <p className="text-sm">
          <Link href="/prices" className="text-sign underline">
            See all prices
          </Link>
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{service.vehicle === "optional" ? "Add a van if you need one" : "Choose your van"}</h2>
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

      {children}

      <FaqList faqs={service.faqs} />

      {related.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="text-xl font-bold">Read before you book</h2>
          <ul className="grid gap-1">
            {related.map((a) => (
              <li key={a.slug}>
                <Link href={`/travel-guide/${a.slug}`} className="text-sign underline">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CtaBand title="Check your date" text="Tell us your dates, group size and language. We confirm a licensed crew before you pay." />
    </Container>
  );
}

import Link from "next/link";
import type { ReactNode } from "react";
import { articles } from "@/content/articles";
import { crewLanguageLine } from "@/content/crew";
import { dayProduct } from "@/content/pricing";
import { vehicles } from "@/content/services";
import type { ProductId, Service } from "@/content/types";
import { ratesFor } from "@/lib/pricing";
import { productFaqs } from "@/lib/productFaqs";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/schema";
import { CrewSection } from "./CrewSection";
import { DayPlanCards, DayPlanNote } from "./DayPlanCards";
import { PriceTable } from "./PriceTable";
import { ProductMatrix } from "./ProductMatrix";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, FaqList, JsonLd } from "./ui";

// 서비스 쪽의 틀. 지금 파는 두 상품(private-driver, driver-guide)은 네 칸 표의 한 줄과 10시간 예시를 보여 주고,
// 숨긴 서비스(guide-tour)는 예전 틀(값 표 + 차량 3종)을 그대로 쓴다.

const isProduct = (service: Service): service is Service & { id: ProductId } =>
  service.id === "private-driver" || service.id === "driver-guide";

export function ServicePage({ service, children }: { service: Service; children?: ReactNode }) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: service.name, path: service.path },
  ];
  const related = articles.filter((a) => a.related.includes(service.id));
  const product = isProduct(service);
  const faqs = product ? [...productFaqs(service.id), ...service.faqs] : service.faqs;
  const languageLine = service.id === "driver-guide" ? crewLanguageLine() : null;

  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={[serviceLd(service), faqLd(faqs), breadcrumbLd(crumbs)]} />

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
          {languageLine ? <p>{languageLine}</p> : null}
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">Included</h2>
          <BulletList items={service.includes} tone="check" />
        </div>
        {service.excludes.length > 0 ? (
          <div className="grid content-start gap-2">
            <h2 className="text-xl font-bold">Not included</h2>
            <BulletList items={service.excludes} tone="cross" />
          </div>
        ) : null}
      </section>

      {product ? (
        <>
          <section className="grid gap-3">
            <h2 className="text-2xl font-bold">Price and what it covers, by area</h2>
            <ProductMatrix products={[service.id]} linkProducts={false} />
            <p className="text-sm">
              <Link href="/prices" className="text-sign underline">
                Compare driver only and driver-guide
              </Link>
            </p>
          </section>

          <section className="grid gap-2">
            <h2 className="text-2xl font-bold">Your van</h2>
            <p>
              One {dayProduct.vehicle} van, for your group only, with seats for up to {dayProduct.maxPassengers} passengers. Tell
              us how many suitcases or strollers you are bringing so we can check the space for your day.
            </p>
          </section>

          {service.id === "driver-guide" ? <CrewSection /> : null}

          <section className="grid gap-4">
            <div>
              <h2 className="text-2xl font-bold">What fits in {dayProduct.hours} hours</h2>
              <p className="mt-1 text-muted">
                {service.id === "driver-guide"
                  ? "Four example days. Your driver-guide comes into each place with you."
                  : "Four example days. The driver takes you to each entrance and waits while you visit on your own."}
              </p>
            </div>
            <DayPlanCards />
            <DayPlanNote />
          </section>
        </>
      ) : (
        <>
          <section className="grid gap-3">
            <h2 className="text-2xl font-bold">Prices</h2>
            <PriceTable rules={ratesFor(service.id)} caption={`${service.name} prices`} />
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
        </>
      )}

      {children}

      <FaqList faqs={faqs} />

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

      <CtaBand title="Check your date" text="Tell us your dates and group size. We reply with the price and what it includes in writing." />
    </Container>
  );
}

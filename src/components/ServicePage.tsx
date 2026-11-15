import Link from "next/link";
import type { ReactNode } from "react";
import { articles } from "@/content/articles";
import { crewLanguageLine } from "@/content/crew";
import { dayProduct } from "@/content/pricing";
import { vehicles } from "@/content/services";
import type { ProductId, Service } from "@/content/types";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { getT } from "@/i18n/server";
import { ratesFor } from "@/lib/pricing";
import { productFaqs } from "@/lib/productFaqs";
import { breadcrumbLd, faqLd, serviceLd } from "@/lib/schema";
import { CrewSection } from "./CrewSection";
import { DayPlanCards, DayPlanNote } from "./DayPlanCards";
import { VanGallery } from "./Photos";
import { PriceTable } from "./PriceTable";
import { ProductMatrix } from "./ProductMatrix";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, FaqList, JsonLd } from "./ui";

// 서비스 쪽의 틀. 지금 파는 두 상품(private-driver, driver-guide)은 네 칸 표의 한 줄과 10시간 예시를 보여 주고,
// 숨긴 서비스(guide-tour)는 예전 틀(값 표 + 차량 3종)을 그대로 쓴다.

const isProduct = (service: Service): service is Service & { id: ProductId } =>
  service.id === "private-driver" || service.id === "driver-guide";

/** service는 영어 원문을 넘긴다(여기서 번역한다). */
export async function ServicePage({ service, children }: { service: Service; children?: ReactNode }) {
  const t = await getT();
  const s = t.obj(service);
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    [service.name, service.path],
  ]);
  const related = articles.filter((a) => a.related.includes(service.id));
  const product = isProduct(service);
  const faqs = product ? [...productFaqs(service.id, t), ...s.faqs] : s.faqs;
  const languageLine = service.id === "driver-guide" ? crewLanguageLine() : null;

  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={[serviceLd(service, {}, t), faqLd(faqs), breadcrumbLd(crumbs)]} />

      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">{s.name}</h1>
        <p className="text-lg text-muted">{s.tagline}</p>
        <AnswerBox updated={service.updated}>{s.answer}</AnswerBox>
      </header>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">{t("Best for")}</h2>
          <BulletList items={s.bestFor} />
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">{t("Who comes with you")}</h2>
          <p>{s.crew}</p>
          {languageLine ? <p>{t(languageLine)}</p> : null}
        </div>
        <div className="grid content-start gap-2">
          <h2 className="text-xl font-bold">{t("Included")}</h2>
          <BulletList items={s.includes} tone="check" />
        </div>
        {s.excludes.length > 0 ? (
          <div className="grid content-start gap-2">
            <h2 className="text-xl font-bold">{t("Not included")}</h2>
            <BulletList items={s.excludes} tone="cross" />
          </div>
        ) : null}
      </section>

      {product ? (
        <>
          <section className="grid gap-3">
            <h2 className="text-2xl font-bold">{t("Price and what it covers, by area")}</h2>
            <ProductMatrix products={[service.id]} linkProducts={false} />
            <p className="text-sm">
              <Link href={t.href("/prices")} className="text-sign underline">
                {t("Compare driver only and driver-guide")}
              </Link>
            </p>
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-bold">{t("Your van")}</h2>
            <p>
              {t(
                "One {vehicle} van, for your group only, with seats for up to {max} passengers. Tell us how many suitcases or strollers you are bringing so we can check the space for your day.",
                { vehicle: dayProduct.vehicle, max: dayProduct.maxPassengers },
              )}
            </p>
            <VanGallery />
          </section>

          {service.id === "driver-guide" ? <CrewSection /> : null}

          <section className="grid gap-4">
            <div>
              <h2 className="text-2xl font-bold">{t("What fits in {hours} hours", { hours: dayProduct.hours })}</h2>
              <p className="mt-1 text-muted">
                {service.id === "driver-guide"
                  ? t("Four example days. Your driver-guide comes into each place with you.")
                  : t("Four example days. The driver takes you to each entrance and waits while you visit on your own.")}
              </p>
            </div>
            <DayPlanCards />
            <DayPlanNote />
          </section>
        </>
      ) : (
        <>
          <section className="grid gap-3">
            <h2 className="text-2xl font-bold">{t("Prices")}</h2>
            <PriceTable rules={ratesFor(service.id)} caption={`${s.name} prices`} />
          </section>

          <section className="grid gap-3">
            <h2 className="text-2xl font-bold">{service.vehicle === "optional" ? t("Add a van if you need one") : t("Choose your van")}</h2>
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
          <h2 className="text-xl font-bold">{t("Read before you book")}</h2>
          <ul className="grid gap-1">
            {related.map((a) => (
              <li key={a.slug}>
                <Link href={t.href(`/travel-guide/${a.slug}`)} className="text-sign underline">
                  {t(a.title)}
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

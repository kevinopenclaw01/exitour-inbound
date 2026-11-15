import Link from "next/link";
import { ProductMatrix } from "@/components/ProductMatrix";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { dayProduct, productOrder } from "@/content/pricing";
import { site } from "@/content/site";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { msg } from "@/i18n/msg";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { productFaqs } from "@/lib/productFaqs";
import { breadcrumbLd, faqLd } from "@/lib/schema";

export const generateMetadata = metadataFor("prices");

export default async function Page() {
  const t = await getT();
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    ["Prices", "/prices"],
  ]);
  const faqs = productOrder.flatMap((id) => productFaqs(id, t));
  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={[faqLd(faqs), breadcrumbLd(crumbs)]} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">{t("Prices")}</h1>
        <AnswerBox updated={site.contentUpdated}>
          {t(
            "All prices are per group, not per person. One price covers a {hours}-hour day in a private {vehicle} for up to {max} passengers, and it depends on two things: whether you book a driver only or a licensed driver-guide, and whether the day is in Seoul or a Gyeonggi day trip. We send the price and what it includes in writing before you pay.",
            { hours: dayProduct.hours, vehicle: dayProduct.vehicle, max: dayProduct.maxPassengers },
          )}
        </AnswerBox>
      </header>

      <section className="grid gap-4">
        <h2 className="text-2xl font-bold">{t("Price and what it covers")}</h2>
        <ProductMatrix />
      </section>

      <section className="grid gap-2">
        <h2 className="text-2xl font-bold">{t("What changes the price")}</h2>
        <BulletList
          items={[
            t("Who comes with you: a driver only, or a licensed tourist guide who drives"),
            t("Area: a day inside Seoul, or a day trip into Gyeonggi"),
            t("Hours: one day is {hours} hours; your written quote states how extra time is charged", { hours: dayProduct.hours }),
            t("Other regions: priced by consultation for your route"),
          ]}
        />
        <p className="text-sm">
          {t("Airport pick-up and drop-off is quoted separately.")}{" "}
          <Link href={t.href("/airport-transfer")} className="text-sign underline">
            {t("Airport transfers")}
          </Link>
        </p>
      </section>

      <FaqList faqs={faqs} title={t("Price questions")} />

      <CtaBand title={msg("Get your exact price")} text={msg("Send your dates and group size. We reply with a written quote.")} />
    </Container>
  );
}

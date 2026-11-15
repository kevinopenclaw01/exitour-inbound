import type { Metadata } from "next";
import Link from "next/link";
import { ProductMatrix } from "@/components/ProductMatrix";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { dayProduct, productOrder } from "@/content/pricing";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/meta";
import { productFaqs } from "@/lib/productFaqs";
import { breadcrumbLd, faqLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata("prices");

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Prices", path: "/prices" },
];

export default function Page() {
  const faqs = productOrder.flatMap((id) => productFaqs(id));
  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={[faqLd(faqs), breadcrumbLd(crumbs)]} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">Prices</h1>
        <AnswerBox updated={site.contentUpdated}>
          All prices are per group, not per person. One price covers a {dayProduct.hours}-hour day in a private{" "}
          {dayProduct.vehicle} for up to {dayProduct.maxPassengers} passengers, and it depends on two things: whether you book a
          driver only or a licensed driver-guide, and whether the day is in Seoul or a Gyeonggi day trip. We send the price and
          what it includes in writing before you pay.
        </AnswerBox>
      </header>

      <section className="grid gap-4">
        <h2 className="text-2xl font-bold">Price and what it covers</h2>
        <ProductMatrix />
      </section>

      <section className="grid gap-2">
        <h2 className="text-2xl font-bold">What changes the price</h2>
        <BulletList
          items={[
            "Who comes with you: a driver only, or a licensed tourist guide who drives",
            "Area: a day inside Seoul, or a day trip into Gyeonggi",
            `Hours: one day is ${dayProduct.hours} hours; your written quote states how extra time is charged`,
            "Other regions: priced by consultation for your route",
          ]}
        />
        <p className="text-sm">
          Airport pick-up and drop-off is quoted separately.{" "}
          <Link href="/airport-transfer" className="text-sign underline">
            Airport transfers
          </Link>
        </p>
      </section>

      <FaqList faqs={faqs} title="Price questions" />

      <CtaBand title="Get your exact price" text="Send your dates and group size. We reply with a written quote." />
    </Container>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PriceTable } from "@/components/PriceTable";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, JsonLd } from "@/components/ui";
import { services } from "@/content/services";
import { ratesFor } from "@/lib/pricing";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Prices: private van, driver-guide and guide tours in Korea",
  description:
    "Per-group prices for a private van with driver, a licensed driver-guide and licensed guide tours in Seoul and Gyeonggi, with what each price includes.",
  alternates: { canonical: "/prices" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Prices", path: "/prices" },
];

export default function Page() {
  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">Prices</h1>
        <AnswerBox updated="2026-10-24">
          All prices are per group, not per person. A full day with a licensed driver-guide and a Staria van is priced by area:
          Seoul city days cost less than Gyeonggi day trips such as Nami Island. Driver-only days and minibus days are quoted for
          your date. We confirm the final price in writing before you pay.
        </AnswerBox>
      </header>

      {services.map((s) => (
        <section key={s.id} className="grid gap-3">
          <h2 className="text-2xl font-bold">
            <Link href={s.path} className="hover:underline">
              {s.name}
            </Link>
          </h2>
          <PriceTable rules={ratesFor(s.id)} caption={`${s.name} prices`} />
        </section>
      ))}

      <section className="grid gap-2">
        <h2 className="text-2xl font-bold">What changes the price</h2>
        <BulletList
          items={[
            "Area: Gyeonggi day trips cost more than Seoul city days",
            "Van size: Staria 9 or 11 seats, or a Solati minibus for larger groups",
            "Hours: extra time beyond the booking is charged per hour",
            "Tolls, parking and the crew's meal: your quote states whether they are included",
          ]}
        />
      </section>

      <CtaBand title="Get your exact price" text="Send your dates and group size. We reply with a written quote." />
    </Container>
  );
}

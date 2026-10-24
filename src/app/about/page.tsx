import type { Metadata } from "next";
import { Breadcrumbs, BulletList, Container, CtaBand, JsonLd } from "@/components/ui";
import { site } from "@/content/site";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About us",
  description: `${site.brand} is the inbound travel brand of ${site.operator}, a registered general travel agency in Korea.`,
  alternates: { canonical: "/about" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About us", path: "/about" },
];

export default function Page() {
  return (
    <Container className="grid max-w-3xl gap-10 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">About {site.brand}</h1>
        <p className="text-lg">
          {site.brand} is the inbound brand of {site.operator}, a Korean travel agency that has run private and small-group trips
          abroad for Korean travellers. We now bring the same way of working home: your own van, the right guide, and a plan built
          around you.
        </p>
      </header>
      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">Why the name</h2>
        <p>
          {site.operator} helps Koreans exit for the world. {site.brand} is the other direction: you enter Korea with your own small
          entourage, a driver, a guide or both, who take care of the road so you can enjoy the day.
        </p>
      </section>
      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">How we work</h2>
        <BulletList
          tone="check"
          items={[
            "We match a licensed guide to your language before you pay",
            "We use registered rental vans with drivers provided by the rental company",
            "We plan with you on chat and put the final price in writing",
            "No forced shopping",
          ]}
        />
      </section>
      <CtaBand title="Plan your days with us" text="Tell us your dates and ideas." />
    </Container>
  );
}

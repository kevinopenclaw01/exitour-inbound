import type { Metadata } from "next";
import Link from "next/link";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, JsonLd } from "@/components/ui";
import { site } from "@/content/site";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Licensed & safe: how our drivers and guides are set up",
  description:
    "How Entour Korea keeps private van tours legal in Korea: a registered travel agency, registered rental vans with drivers, licensed tourist guides and no forced shopping.",
  alternates: { canonical: "/safety" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Licensed & safe", path: "/safety" },
];

export default function Page() {
  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">Licensed & safe</h1>
        <AnswerBox updated="2026-10-24">
          {site.brand} is operated by {site.operator}, registered in Korea as a general travel agency, the licence type for serving
          foreign visitors. Our vans are registered rental vehicles with drivers provided by the rental company, and every guide we
          assign holds the Korean tourist guide licence.
        </AnswerBox>
      </header>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">The travel agency</h2>
        <p>
          {site.operator} holds a {site.operatorLicense.type}.
          {site.operatorLicense.number ? ` Registration number: ${site.operatorLicense.number}.` : ""}
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">The van and driver</h2>
        <BulletList
          tone="check"
          items={[
            "Vans are registered to a car-rental company. Korean rental vans carry plates with 하, 허 or 호.",
            "The rental is made in the traveller's name and the rental company provides the driver, as Korean law allows for foreign renters.",
            "We do not use private cars for paid rides. Carrying paying passengers in a private car is illegal in Korea and may leave passengers uninsured.",
          ]}
        />
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">The guide</h2>
        <BulletList
          tone="check"
          items={[
            "Every guide holds the government tourist guide licence (관광통역안내사), which Korean law requires for guiding foreign visitors.",
            "We keep a copy of each guide's licence on file.",
            "Drivers without the licence do not guide inside attractions. That is why our driver-only service and driver-guide service are separate.",
          ]}
        />
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">No forced shopping</h2>
        <p>Your day is built around what you want to see. You visit only the shops you ask for.</p>
      </section>

      <p>
        <Link href="/travel-guide/is-hiring-a-driver-legal-in-korea" className="font-semibold text-sign underline">
          Read: Can tourists legally hire a car with a driver in Korea?
        </Link>
      </p>

      <CtaBand title="Questions before you book?" text="Ask us anything about the crew, the van or the insurance." />
    </Container>
  );
}

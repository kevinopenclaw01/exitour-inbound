import type { Metadata } from "next";
import { Breadcrumbs, Container, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { generalFaqs } from "@/content/faqs";
import { services } from "@/content/services";
import { breadcrumbLd, faqLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about booking, vans, drivers, licensed guides, languages and prices for private tours in Korea.",
  alternates: { canonical: "/faq" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function Page() {
  const all = [...generalFaqs, ...services.flatMap((s) => s.faqs)];
  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={[faqLd(all), breadcrumbLd(crumbs)]} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">Frequently asked questions</h1>
      </header>
      <FaqList faqs={generalFaqs} title="Booking and general" />
      {services.map((s) => (
        <FaqList key={s.id} faqs={s.faqs} title={s.name} />
      ))}
      <CtaBand title="Still have a question?" text="Send it with your trip request and we answer on chat." />
    </Container>
  );
}

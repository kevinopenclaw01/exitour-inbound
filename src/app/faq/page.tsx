import type { Metadata } from "next";
import { Breadcrumbs, Container, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { generalFaqs } from "@/content/faqs";
import { listedServices } from "@/content/services";
import type { ProductId } from "@/content/types";
import { pageMetadata } from "@/lib/meta";
import { productFaqs } from "@/lib/productFaqs";
import { breadcrumbLd, faqLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata("faq");

const crumbs = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

export default function Page() {
  const groups = listedServices.map((s) => ({ service: s, faqs: [...productFaqs(s.id as ProductId), ...s.faqs] }));
  const all = [...generalFaqs, ...groups.flatMap((g) => g.faqs)];
  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={[faqLd(all), breadcrumbLd(crumbs)]} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">Frequently asked questions</h1>
      </header>
      <FaqList faqs={generalFaqs} title="Booking and general" />
      {groups.map((g) => (
        <FaqList key={g.service.id} faqs={g.faqs} title={g.service.name} />
      ))}
      <CtaBand title="Still have a question?" text="Send it with your trip request and we answer on chat." />
    </Container>
  );
}

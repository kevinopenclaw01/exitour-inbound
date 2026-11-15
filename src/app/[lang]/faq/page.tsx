import { Breadcrumbs, Container, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { generalFaqs } from "@/content/faqs";
import { listedServices } from "@/content/services";
import type { ProductId } from "@/content/types";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { msg } from "@/i18n/msg";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { productFaqs } from "@/lib/productFaqs";
import { breadcrumbLd, faqLd } from "@/lib/schema";

export const generateMetadata = metadataFor("faq");

export default async function Page() {
  const t = await getT();
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    ["FAQ", "/faq"],
  ]);
  const general = t.obj(generalFaqs);
  const groups = listedServices.map((s) => ({
    service: s,
    faqs: [...productFaqs(s.id as ProductId, t), ...t.obj(s.faqs)],
  }));
  const all = [...general, ...groups.flatMap((g) => g.faqs)];
  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={[faqLd(all), breadcrumbLd(crumbs)]} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">{t("Frequently asked questions")}</h1>
      </header>
      <FaqList faqs={general} title={t("Booking and general")} />
      {groups.map((g) => (
        <FaqList key={g.service.id} faqs={g.faqs} title={t(g.service.name)} />
      ))}
      <CtaBand title={msg("Still have a question?")} text={msg("Send it with your trip request and we answer on chat.")} />
    </Container>
  );
}

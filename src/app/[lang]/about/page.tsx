import { Breadcrumbs, BulletList, Container, CtaBand, JsonLd } from "@/components/ui";
import { site } from "@/content/site";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { msg } from "@/i18n/msg";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { breadcrumbLd } from "@/lib/schema";

export const generateMetadata = metadataFor("about");

export default async function Page() {
  const t = await getT();
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    ["About us", "/about"],
  ]);
  const names = { brand: site.brand, operator: site.operator };
  return (
    <Container className="grid max-w-3xl gap-10 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">{t("About {brand}", names)}</h1>
        <p className="text-lg">
          {t(
            "{brand} is the inbound brand of {operator}, a Korean travel agency that has run private and small-group trips abroad for Korean travellers. We now bring the same way of working home: your own van, the right crew, and a day built around you.",
            names,
          )}
        </p>
      </header>
      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("Why the name")}</h2>
        <p>
          {t(
            "{operator} helps Koreans exit for the world. {brand} is the other direction: you enter Korea with your own small entourage, a driver or a driver-guide, who takes care of the road so you can enjoy the day.",
            names,
          )}
        </p>
      </section>
      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("How we work")}</h2>
        <BulletList
          tone="check"
          items={[
            t("Guiding is done only by holders of the Korean tourist guide licence"),
            t("We use registered rental vans with drivers provided by the rental company"),
            t("We plan with you on chat and put the price and what it includes in writing"),
            t("No forced shopping"),
          ]}
        />
      </section>
      <CtaBand title={msg("Plan your days with us")} text={msg("Tell us your dates and ideas.")} />
    </Container>
  );
}

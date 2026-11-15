import Link from "next/link";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, JsonLd } from "@/components/ui";
import { site } from "@/content/site";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { msg } from "@/i18n/msg";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { breadcrumbLd } from "@/lib/schema";

export const generateMetadata = metadataFor("safety");

export default async function Page() {
  const t = await getT();
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    ["Licensed & safe", "/safety"],
  ]);
  const names = { brand: site.brand, operator: site.operator };
  return (
    <Container className="grid gap-12 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">{t("Licensed & safe")}</h1>
        <AnswerBox updated="2026-10-24">
          {t(
            "{brand} is operated by {operator}, registered in Korea as a general travel agency, the licence type for serving foreign visitors. Our vans are registered rental vehicles with drivers provided by the rental company, and every guide we assign holds the Korean tourist guide licence.",
            names,
          )}
        </AnswerBox>
      </header>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("The travel agency")}</h2>
        <p>
          {t("{operator} holds a {licence}.", { operator: site.operator, licence: t(site.operatorLicense.type) })}
          {site.operatorLicense.number ? ` ${t("Registration number: {number}.", { number: site.operatorLicense.number })}` : ""}
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("The van and driver")}</h2>
        <BulletList
          tone="check"
          items={[
            t("Vans are registered to a car-rental company. Korean rental vans carry plates with 하, 허 or 호."),
            t(
              "The rental is made in the traveller's name and the rental company provides the driver, as Korean law allows for foreign renters.",
            ),
            t(
              "We do not use private cars for paid rides. Carrying paying passengers in a private car is illegal in Korea and may leave passengers uninsured.",
            ),
          ]}
        />
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("The guide")}</h2>
        <BulletList
          tone="check"
          items={[
            t(
              "Every guide holds the government tourist guide licence (관광통역안내사), which Korean law requires for guiding foreign visitors.",
            ),
            t("We keep a copy of each guide's licence on file."),
            t(
              "Drivers without the licence do not guide inside attractions. That is why our driver-only service and driver-guide service are separate.",
            ),
          ]}
        />
      </section>

      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">{t("No forced shopping")}</h2>
        <p>{t("Your day is built around what you want to see. You visit only the shops you ask for.")}</p>
      </section>

      <p>
        <Link href={t.href("/travel-guide/is-hiring-a-driver-legal-in-korea")} className="font-semibold text-sign underline">
          {t("Read: Can tourists legally hire a car with a driver in Korea?")}
        </Link>
      </p>

      <CtaBand title={msg("Questions before you book?")} text={msg("Ask us anything about the crew, the van or the insurance.")} />
    </Container>
  );
}

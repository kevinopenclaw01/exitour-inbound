import Link from "next/link";
import { Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { articles } from "@/content/articles";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { breadcrumbLd } from "@/lib/schema";

export const generateMetadata = metadataFor("travel-guide");

export default async function Page() {
  const t = await getT();
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    ["Travel guide", "/travel-guide"],
  ]);
  return (
    <Container className="grid max-w-3xl gap-8 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">{t("Travel guide")}</h1>
      </header>
      <ul className="grid gap-4">
        {articles.map((a) => (
          <li key={a.slug} className="rounded-md border border-line bg-surface p-5">
            <Link href={t.href(`/travel-guide/${a.slug}`)} className="text-lg font-bold hover:underline">
              {t(a.title)}
            </Link>
            <p className="mt-1 text-muted">{t(a.description)}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}

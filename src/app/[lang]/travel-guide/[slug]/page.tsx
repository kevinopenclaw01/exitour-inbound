import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AnswerBox, Breadcrumbs, Container, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { articles, getArticle } from "@/content/articles";
import { getService } from "@/content/services";
import { isLang } from "@/i18n/config";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { msg } from "@/i18n/msg";
import { getT } from "@/i18n/server";
import { articleMetadata, articleOgKey, ogImagePath } from "@/lib/meta";
import { articleLd, breadcrumbLd, faqLd } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/travel-guide/[slug]">): Promise<Metadata> {
  const { slug, lang } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return articleMetadata(article, isLang(lang) ? lang : "en");
}

export default async function Page({ params }: PageProps<"/[lang]/travel-guide/[slug]">) {
  const { slug } = await params;
  const source = getArticle(slug);
  if (!source) notFound();
  const t = await getT();
  const article = t.obj(source);

  // 숨긴 서비스(/guide-tour)로는 링크를 걸지 않는다.
  const relatedServices = source.related.map((id) => getService(id)).filter((s) => s.listed);

  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    ["Travel guide", "/travel-guide"],
    [source.title, `/travel-guide/${source.slug}`],
  ]);

  return (
    <Container className="grid max-w-3xl gap-10 py-8 sm:py-12">
      <JsonLd data={[articleLd(source, ogImagePath(articleOgKey(source.slug)), t), faqLd(article.faqs), breadcrumbLd(crumbs)]} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">{article.title}</h1>
        <AnswerBox updated={source.updated}>{article.answer}</AnswerBox>
      </header>

      {article.sections.map((section) => (
        <section key={section.heading} className="grid gap-3">
          <h2 className="text-2xl font-bold">{section.heading}</h2>
          {section.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {section.table ? (
            <div className="overflow-x-auto rounded-md border border-line bg-surface">
              <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                <thead className="bg-paper text-xs text-muted">
                  <tr>
                    {section.table.head.map((h) => (
                      <th key={h} scope="col" className="px-4 py-2.5 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {section.table.rows.map((row, r) => (
                    <tr key={`${r}-${row[0]}`} className="border-t border-line">
                      {row.map((cell, i) =>
                        i === 0 ? (
                          <th key={i} scope="row" className="px-4 py-3 font-medium">
                            {cell}
                          </th>
                        ) : (
                          <td key={i} className="px-4 py-3 text-muted">
                            {cell}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ))}

      <FaqList faqs={article.faqs} />

      {relatedServices.length > 0 ? (
        <section className="grid gap-2">
          <h2 className="text-xl font-bold">{t("Related services")}</h2>
          <ul className="grid gap-1">
            {relatedServices.map((s) => (
              <li key={s.id}>
                <Link href={t.href(s.path)} className="text-sign underline">
                  {t(s.name)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CtaBand title={msg("Plan it with us")} text={msg("Send your dates and group size. We reply with a plan and a written price.")} />
    </Container>
  );
}

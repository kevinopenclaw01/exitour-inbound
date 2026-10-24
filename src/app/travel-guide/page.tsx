import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { articles } from "@/content/articles";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Travel guide",
  description: "Straight answers about private drivers, licensed guides and day trips in Korea.",
  alternates: { canonical: "/travel-guide" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Travel guide", path: "/travel-guide" },
];

export default function Page() {
  return (
    <Container className="grid max-w-3xl gap-8 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">Travel guide</h1>
      </header>
      <ul className="grid gap-4">
        {articles.map((a) => (
          <li key={a.slug} className="rounded-md border border-line bg-surface p-5">
            <Link href={`/travel-guide/${a.slug}`} className="text-lg font-bold hover:underline">
              {a.title}
            </Link>
            <p className="mt-1 text-muted">{a.description}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}

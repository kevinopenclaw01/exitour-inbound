import type { Metadata } from "next";
import Link from "next/link";
import { ContactList } from "@/components/ContactList";
import { AnswerBox, Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { site } from "@/content/site";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Contact us",
  description: `Contact ${site.brand} on WhatsApp, LINE or KakaoTalk to plan a private driver or licensed guide tour in Korea.`,
  alternates: { canonical: "/contact" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact us", path: "/contact" },
];

export default function Page() {
  return (
    <Container className="grid max-w-3xl gap-8 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">Contact us</h1>
        <AnswerBox>
          Message {site.brand} on WhatsApp{site.line ? ", LINE" : ""}{site.kakaoId ? " or KakaoTalk" : ""} with your dates, group size
          and guide language. {site.officeHours}
        </AnswerBox>
      </header>
      <ContactList />
      <p>
        Prefer a form?{" "}
        <Link href="/plan" className="font-semibold text-sign underline">
          Send a trip request
        </Link>
      </p>
    </Container>
  );
}

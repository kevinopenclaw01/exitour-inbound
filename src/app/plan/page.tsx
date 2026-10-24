import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Plan my trip",
  description: "Send your dates, group size, guide language and ideas. We reply with a plan and a written price.",
  alternates: { canonical: "/plan" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Plan my trip", path: "/plan" },
];

export default function Page() {
  return (
    <Container className="grid max-w-3xl gap-6 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <div className="grid gap-2">
        <h1 className="font-display text-3xl sm:text-4xl">Plan my trip</h1>
        <p className="text-muted">
          Tell us about your trip. We check a licensed crew for your date and reply with a plan and a written price. Nothing is
          booked until you confirm.
        </p>
      </div>
      <InquiryForm />
    </Container>
  );
}

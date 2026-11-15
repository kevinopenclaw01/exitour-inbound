import type { Metadata } from "next";
import { InquiryForm } from "@/components/InquiryForm";
import { Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { legalPublished } from "@/content/legal";
import { dayProduct } from "@/content/pricing";
import { pageMetadata } from "@/lib/meta";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata("plan");

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
          Tell us about your trip. We check the van and crew for your date and reply with the price and what it includes in
          writing. Nothing is booked until you confirm.
        </p>
        <p className="text-sm text-muted">
          A day is {dayProduct.hours} hours in a {dayProduct.vehicle} for up to {dayProduct.maxPassengers} passengers, in Seoul
          or on a Gyeonggi day trip. Going somewhere else, or travelling with a bigger group? Write it in the form and we tell you
          what we can arrange.
        </p>
      </div>
      <InquiryForm privacyHref={legalPublished("privacy") ? "/privacy" : undefined} />
    </Container>
  );
}

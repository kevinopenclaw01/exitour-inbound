import Link from "next/link";
import { BookingForm } from "@/components/BookingForm";
import { ContactList } from "@/components/ContactList";
import { Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { legalPublished } from "@/content/legal";
import { dayProduct } from "@/content/pricing";
import { listedServices } from "@/content/services";
import { localeInfo } from "@/i18n/config";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { bookingStrings, bookingUi } from "@/i18n/formStrings";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { breadcrumbLd, serviceLd } from "@/lib/schema";

// 구매 화면(2026-11-16 사장님 「판매가와 구매하는 거 만들어 줘」). 흐름은 src/lib/booking.ts 맨 위.

export const generateMetadata = metadataFor("book");

export default async function Page() {
  const t = await getT();
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    ["Book", "/book"],
  ]);
  const messages = t.lang === "en" ? {} : Object.fromEntries(bookingStrings().map((s) => [s, t(s)]));
  return (
    <Container className="grid max-w-3xl gap-6 py-8 sm:py-12">
      <JsonLd data={[...listedServices.map((s) => serviceLd(s, {}, t)), breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <div className="grid gap-2">
        <h1 className="font-display text-3xl sm:text-4xl">{t("Book a private van day")}</h1>
        <p className="text-muted">
          {t(
            "Choose the product, area and dates and you see the price straight away. One day is {hours} hours in a {vehicle} for up to {max} passengers, and the price is per group.",
            { hours: dayProduct.hours, vehicle: dayProduct.vehicle, max: dayProduct.maxPassengers },
          )}
        </p>
        <p className="text-sm">
          {t(bookingUi.bigger)}{" "}
          <Link href={t.href("/plan")} className="font-semibold text-sign underline">
            {t(bookingUi.sendRequest)}
          </Link>
        </p>
      </div>
      <BookingForm
        messages={messages}
        locale={localeInfo[t.lang].intl}
        privacyHref={legalPublished("privacy") ? "/privacy" : undefined}
        contact={<ContactList compact />}
      />
    </Container>
  );
}

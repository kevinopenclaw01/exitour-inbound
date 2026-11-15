import { ContactList } from "@/components/ContactList";
import { InquiryForm } from "@/components/InquiryForm";
import { Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { legalPublished } from "@/content/legal";
import { dayProduct } from "@/content/pricing";
import { localeInfo } from "@/i18n/config";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { formStrings } from "@/i18n/formStrings";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { breadcrumbLd } from "@/lib/schema";

export const generateMetadata = metadataFor("plan");

export default async function Page() {
  const t = await getT();
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    ["Plan my trip", "/plan"],
  ]);
  // 폼(브라우저 쪽)에는 폼 문장만 번역해서 넘긴다. 영어 쪽은 빈 사전(원문 그대로).
  const messages = t.lang === "en" ? {} : Object.fromEntries(formStrings().map((s) => [s, t(s)]));
  return (
    <Container className="grid max-w-3xl gap-6 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <Breadcrumbs items={crumbs} />
      <div className="grid gap-2">
        <h1 className="font-display text-3xl sm:text-4xl">{t("Plan my trip")}</h1>
        <p className="text-muted">
          {t(
            "Tell us about your trip. We check the van and crew for your date and reply with the price and what it includes in writing. Nothing is booked until you confirm.",
          )}
        </p>
        <p className="text-sm text-muted">
          {t(
            "A day is {hours} hours in a {vehicle} for up to {max} passengers, in Seoul or on a Gyeonggi day trip. Going somewhere else, or travelling with a bigger group? Write it in the form and we tell you what we can arrange.",
            { hours: dayProduct.hours, vehicle: dayProduct.vehicle, max: dayProduct.maxPassengers },
          )}
        </p>
        {t.lang === "en" ? null : (
          <p className="text-sm text-muted">{t("You can write in your own language. We reply in English or with a translation app.")}</p>
        )}
      </div>
      <InquiryForm
        privacyHref={legalPublished("privacy") ? "/privacy" : undefined}
        messages={messages}
        locale={localeInfo[t.lang].intl}
        contact={<ContactList compact />}
      />
    </Container>
  );
}

import Link from "next/link";
import { ContactList } from "@/components/ContactList";
import { AnswerBox, Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { site } from "@/content/site";
import { localeInfo } from "@/i18n/config";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { breadcrumbLd } from "@/lib/schema";

export const generateMetadata = metadataFor("contact");

export default async function Page() {
  const t = await getT();
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    ["Contact us", "/contact"],
  ]);
  const channels = ["WhatsApp", ...(site.line ? ["LINE"] : []), ...(site.kakaoId ? ["KakaoTalk"] : [])];
  // "WhatsApp, LINE or KakaoTalk"을 그 언어의 "또는" 목록으로.
  const channelText = new Intl.ListFormat(localeInfo[t.lang].intl, { type: "disjunction" }).format(channels);
  return (
    <Container className="grid max-w-3xl gap-8 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">{t("Contact us")}</h1>
        <AnswerBox>
          {t("Message {brand} on {channels} with your dates, group size and guide language.", {
            brand: site.brand,
            channels: channelText,
          })}{" "}
          {t(site.officeHours)}
        </AnswerBox>
      </header>
      <ContactList />
      <p>
        {t("Prefer a form?")}{" "}
        <Link href={t.href("/plan")} className="font-semibold text-sign underline">
          {t("Send a trip request")}
        </Link>
      </p>
    </Container>
  );
}

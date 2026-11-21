import { ContactList } from "@/components/ContactList";
import { PayPalForm } from "@/components/PayPalForm";
import { Breadcrumbs, Container, JsonLd } from "@/components/ui";
import { publishedLegalDocs } from "@/content/legal";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { payStrings } from "@/i18n/formStrings";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { paypalConfig } from "@/lib/payment";
import { breadcrumbLd } from "@/lib/schema";

// 페이팔 결제 화면(2026-11-21 포트원 「PG 계약에 필요한 테스트모드 설정 안내」: 심사에는 결제창이 실제로 뜨는 결제 페이지가 있어야 한다).
// 흐름·금액 규칙은 src/components/PayPalForm.tsx 맨 위, 채널 설정은 src/lib/payment.ts.

export const generateMetadata = metadataFor("pay");

export default async function Page() {
  const t = await getT();
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    ["Pay with PayPal", "/pay"],
  ]);
  const messages = t.lang === "en" ? {} : Object.fromEntries(payStrings().map((s) => [s, t(s)]));
  const legalLinks = publishedLegalDocs().map((d) => ({ href: t.href(d.path), label: t(d.label) }));
  return (
    <Container className="grid max-w-3xl gap-6 py-8 sm:py-12">
      <JsonLd data={[breadcrumbLd(crumbs)]} />
      <Breadcrumbs items={crumbs} />
      <div className="grid gap-2">
        <h1 className="font-display text-3xl sm:text-4xl">{t("Pay with PayPal")}</h1>
        <p className="text-muted">
          {t(
            "Pay here after we have confirmed your driver and van. Use the product, area and number of days from your booking. The price comes from our price list and you see the US dollar amount before you pay.",
          )}
        </p>
        {paypalConfig.testMode ? (
          <p className="rounded-md border border-brown/30 bg-paper px-4 py-3 text-sm font-semibold text-brown">
            {t("Test mode: this page uses a PayPal test account. No real money is taken and no booking is made.")}
          </p>
        ) : null}
      </div>
      <PayPalForm messages={messages} legalLinks={legalLinks} />
      <div className="grid gap-2 text-sm">
        <p className="text-muted">
          {t("Questions about your booking or payment? Contact us before you pay.")}
        </p>
        <ContactList compact />
      </div>
    </Container>
  );
}

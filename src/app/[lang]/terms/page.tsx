import Link from "next/link";
import { Fill, LegalPage, LegalSection, OperatorDetails } from "@/components/LegalPage";
import { BulletList } from "@/components/ui";
import { legal, legalPublished } from "@/content/legal";
import { dayProduct } from "@/content/pricing";
import { site } from "@/content/site";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";

// 이용약관. 사실로 확정된 것(상품 구조, 10시간, 7인, 견적서 방식)과 src/content/legal.ts 값만 쓴다.
// 빈칸이 다 채워지기 전에는 noindex이고 메뉴·사이트맵에 없다. 2026-11-17부터 9개 언어. 변호사 확인은 아직(docs/05_legal-notes.md).

export const generateMetadata = metadataFor("terms", { published: legalPublished("terms") });

export default async function Page() {
  const t = await getT();
  const vars = { hours: dayProduct.hours, vehicle: dayProduct.vehicle, max: dayProduct.maxPassengers };
  const contact = (c: string) => (
    <Link href={t.href("/contact")} className="text-sign underline">
      {c}
    </Link>
  );
  return (
    <LegalPage doc="terms" title={t("Terms of service")} path="/terms">
      <LegalSection title={t("1. Who we are")}>
        <p>
          {t(
            "{brand} is a brand of {operator}, a travel agency registered in Korea. These terms apply when you send us a trip request and when you book a private van day with us.",
            { brand: site.brand, operator: site.operator },
          )}
        </p>
        <OperatorDetails />
      </LegalSection>

      <LegalSection title={t("2. What we arrange")}>
        <BulletList
          items={[
            t(
              "A private van day of {hours} hours in a {vehicle} for up to {max} passengers, in Seoul or on a Gyeonggi day trip, with a driver only or with a licensed tourist guide",
              vars,
            ),
            t("Other regions and other arrangements, by consultation"),
            t(
              "The van is a registered rental vehicle. The rental is made in the traveller's name and the rental company provides the driver, as Korean law allows for foreign renters",
            ),
            t(
              "Guiding inside attractions is done only by a holder of the Korean tourist guide licence. A driver who is not a licensed guide does not guide",
            ),
          ]}
        />
      </LegalSection>

      <LegalSection title={t("3. Requests, quotes and booking")}>
        <BulletList
          items={[
            t("A trip request is not a booking. We check the van and crew for your date and send you a written quote"),
            t("The written quote states the price for your group, what it includes and what it does not include"),
            t("Your booking is made when you confirm the written quote and pay as the quote states"),
          ]}
        />
        <p>
          {t("Payment methods:")} <Fill value={legal.payment.methods} what="payment methods" />
        </p>
        <p>
          {t("Deposit and balance:")} <Fill value={legal.payment.deposit} what="deposit and when the balance is paid" />
        </p>
      </LegalSection>

      <LegalSection title={t("4. Changes, cancellations and refunds")}>
        <p>
          {t.rich("These are set out in our <a>cancellation and refund policy</a>, which is part of these terms.", {
            a: (c) => (
              <Link href={t.href("/cancellation-policy")} className="text-sign underline">
                {c}
              </Link>
            ),
          })}
        </p>
      </LegalSection>

      <LegalSection title={t("5. On the day")}>
        <BulletList
          items={[
            t("One day is {hours} hours from pick-up to drop-off. Your written quote states how extra time is charged", vars),
            t("The van carries up to {max} passengers. Tell us before the day about suitcases, strollers, wheelchairs and child seats", vars),
            t("Everyone wears a seat belt"),
            t("There is no forced shopping. You visit only the shops you ask for"),
            t("Opening days, opening hours and ticket prices of attractions are set by the attractions and can change"),
          ]}
        />
      </LegalSection>

      <LegalSection title={t("6. What we need from you")}>
        <BulletList
          items={[
            t("Correct names, dates, group size and contact details"),
            t("The details needed for the vehicle rental contract, which we ask for when you book"),
            t("To be at the agreed pick-up place on time, and to tell us on chat if your plans change"),
          ]}
        />
      </LegalSection>

      <LegalSection title={t("7. Insurance and liability")}>
        <p>
          <Fill value={legal.liability} what="insurance cover for passengers and the limits of our liability, after legal review" />
        </p>
      </LegalSection>

      <LegalSection title={t("8. Law and disputes")}>
        <p>
          {t("These terms are governed by the law of the Republic of Korea. Court with jurisdiction:")}{" "}
          <Fill value={legal.court} what="court" />
        </p>
      </LegalSection>

      <LegalSection title={t("9. Contact")}>
        <p>{t.rich("Questions about these terms: <a>contact us</a>.", { a: contact })}</p>
      </LegalSection>
    </LegalPage>
  );
}

import Link from "next/link";
import { Fill, LegalPage, LegalSection, OperatorDetails } from "@/components/LegalPage";
import { BulletList } from "@/components/ui";
import { legal, legalPublished } from "@/content/legal";
import { site } from "@/content/site";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";

// 개인정보처리방침. "무엇을 받는가"는 여행 요청 폼(src/lib/inquiry.ts)·구매 화면(/book)과 실제 저장 구조(supabase/migrations)에 맞춰 적었다.
// 폼의 칸을 바꾸거나 방문 측정·결제를 붙이면 이 문서도 같이 고친다. 2026-11-17부터 9개 언어. 변호사 확인은 아직.

export const generateMetadata = metadataFor("privacy", { published: legalPublished("privacy") });

export default async function Page() {
  const t = await getT();
  return (
    <LegalPage doc="privacy" title={t("Privacy policy")} path="/privacy">
      <LegalSection title={t("1. Who is responsible for your information")}>
        <p>{t("{operator}, which operates {brand}, decides how the information below is used.", { operator: site.operator, brand: site.brand })}</p>
        <OperatorDetails />
        <p>
          {t("Privacy officer:")} <Fill value={legal.privacy.officer} what="name and position" />. {t("Contact:")}{" "}
          {legal.privacy.officerContact ?? <Fill value={null} what="privacy contact" />}
        </p>
      </LegalSection>

      <LegalSection title={t("2. What we collect")}>
        <p>{t("When you send a trip request or a booking on this site, we receive what you type into the form:")}</p>
        <BulletList
          items={[
            t("Your name and the contact you give us (email address, WhatsApp number, LINE ID or KakaoTalk ID)"),
            t("Your trip: service, first date, number of days, group size and guide language"),
            t("Optional details: hotel or pick-up area, what you would like to do, and how you found us"),
            t("The address of the page you sent the form from"),
          ]}
        />
        <p>{t("If you message us on WhatsApp, LINE or KakaoTalk, we also receive what you send there.")}</p>
        <p>
          {t("When you book, the vehicle rental contract needs the renter's details:")}{" "}
          <Fill value={legal.privacy.rentalDetails} what="which passport details are collected for the rental contract, how they are stored and when they are deleted" />
        </p>
        <p>{t("Card details are entered on the payment provider's page. We do not see or store your card number.")}</p>
      </LegalSection>

      <LegalSection title={t("3. Why we use it")}>
        <BulletList
          items={[
            t("To reply to your request and send you a written quote"),
            t("To arrange the van and crew for your day and to reach you on the day"),
            t("To take payment, and to handle cancellations and refunds"),
          ]}
        />
        <p>{t("We do not sell your information and we do not use it for advertising.")}</p>
      </LegalSection>

      <LegalSection title={t("4. Who receives it")}>
        <BulletList
          items={[
            t("The rental company and the driver or guide for your booking, only what they need for the day"),
            t("Supabase, which stores trip requests for us in a database in the Seoul region"),
            t("Our staff receive a notice of each new request through KakaoTalk (Kakao Corp., Korea)"),
            ...legal.privacy.paymentProviders.map((p) => t(p)),
          ]}
        />
        <p>
          {t("Website hosting:")} <Fill value={legal.privacy.hosting} what="hosting provider and country" />
        </p>
      </LegalSection>

      <LegalSection title={t("5. How long we keep it")}>
        <p>
          <Fill value={legal.privacy.retention} what="how long trip requests and booking records are kept" />
        </p>
      </LegalSection>

      <LegalSection title={t("6. Cookies and tracking")}>
        <p>{t("This site does not set advertising cookies. If we add visitor statistics, this page will say which tool we use.")}</p>
      </LegalSection>

      <LegalSection title={t("7. Your choices")}>
        <p>
          {t.rich(
            "You can ask us to show you, correct or delete the information we hold about you. Send your request to the privacy contact above or through our <a>contact page</a>.",
            {
              a: (c) => (
                <Link href={t.href("/contact")} className="text-sign underline">
                  {c}
                </Link>
              ),
            },
          )}
        </p>
        <p>
          {t(
            "If you are not satisfied with our answer, you can contact the Korea Internet & Security Agency's Privacy Infringement Report Center (privacy.kisa.or.kr).",
          )}
        </p>
      </LegalSection>
    </LegalPage>
  );
}

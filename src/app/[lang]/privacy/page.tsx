import Link from "next/link";
import { Fill, LegalPage, LegalSection, OperatorDetails } from "@/components/LegalPage";
import { BulletList } from "@/components/ui";
import { legal, legalPublished } from "@/content/legal";
import { site } from "@/content/site";
import { englishOnly } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";

// 개인정보처리방침 틀. "무엇을 받는가"는 여행 요청 폼(src/lib/inquiry.ts)과 실제 저장 구조(supabase/migrations)에 맞춰 적었다.
// 폼의 칸을 바꾸거나 방문 측정·결제를 붙이면 이 문서도 같이 고친다.
// 빈칸이 다 채워지기 전에는 noindex이고 메뉴·사이트맵에 없다. 공개 전에 변호사 확인을 받는다(docs/05_legal-notes.md).

export const generateMetadata = metadataFor("privacy", { published: legalPublished("privacy") });

// 영어판만 있다(다른 언어 주소는 404). src/lib/meta.ts의 englishOnlyPages.
export default async function Page() {
  await englishOnly();
  return (
    <LegalPage doc="privacy" title="Privacy policy" path="/privacy">
      <LegalSection title="1. Who is responsible for your information">
        <p>
          {site.operator}, which operates {site.brand}, decides how the information below is used.
        </p>
        <OperatorDetails />
        <p>
          Privacy officer: <Fill value={legal.privacy.officer} what="name and position" />. Contact:{" "}
          <Fill value={legal.privacy.officerContact} what="privacy contact" />
        </p>
      </LegalSection>

      <LegalSection title="2. What we collect">
        <p>When you send a trip request on this site, we receive what you type into the form:</p>
        <BulletList
          items={[
            "Your name and the contact you give us (email address, WhatsApp number, LINE ID or KakaoTalk ID)",
            "Your trip: service, first date, number of days, group size and guide language",
            "Optional details: hotel or pick-up area, what you would like to do, and how you found us",
            "The address of the page you sent the form from",
          ]}
        />
        <p>If you message us on WhatsApp, LINE or KakaoTalk, we also receive what you send there.</p>
        <p>
          When you book, the vehicle rental contract needs the renter&apos;s details:{" "}
          <Fill value={legal.privacy.rentalDetails} what="which passport details are collected for the rental contract, how they are stored and when they are deleted" />
        </p>
      </LegalSection>

      <LegalSection title="3. Why we use it">
        <BulletList
          items={[
            "To reply to your request and send you a written quote",
            "To arrange the van and crew for your day and to reach you on the day",
          ]}
        />
        <p>We do not sell your information and we do not use it for advertising.</p>
      </LegalSection>

      <LegalSection title="4. Who receives it">
        <BulletList
          items={[
            "The rental company and the driver or guide for your booking, only what they need for the day",
            "Supabase, which stores trip requests for us in a database in the Seoul region",
          ]}
        />
        <p>
          Website hosting: <Fill value={legal.privacy.hosting} what="hosting provider and country" />
        </p>
      </LegalSection>

      <LegalSection title="5. How long we keep it">
        <p>
          <Fill value={legal.privacy.retention} what="how long trip requests and booking records are kept" />
        </p>
      </LegalSection>

      <LegalSection title="6. Cookies and tracking">
        <p>This site does not set advertising cookies. If we add visitor statistics, this page will say which tool we use.</p>
      </LegalSection>

      <LegalSection title="7. Your choices">
        <p>
          You can ask us to show you, correct or delete the information we hold about you. Send your request to the privacy contact
          above or through our{" "}
          <Link href="/contact" className="text-sign underline">
            contact page
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

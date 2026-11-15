import type { Metadata } from "next";
import Link from "next/link";
import { Fill, LegalPage, LegalSection, OperatorDetails } from "@/components/LegalPage";
import { BulletList } from "@/components/ui";
import { legal, legalPublished } from "@/content/legal";
import { dayProduct } from "@/content/pricing";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/meta";

// 이용약관 틀. 사실로 확정된 것(상품 구조, 10시간, 7인, 견적서 방식)만 문장으로 쓰고, 정해지지 않은 값은 빈칸으로 둔다.
// 빈칸이 다 채워지기 전에는 noindex이고 메뉴·사이트맵에 없다. 첫 판매 전에 변호사 확인을 받는다(docs/05_legal-notes.md).

export const metadata: Metadata = pageMetadata("terms", { published: legalPublished("terms") });

export default function Page() {
  return (
    <LegalPage doc="terms" title="Terms of service" path="/terms">
      <LegalSection title="1. Who we are">
        <p>
          {site.brand} is a brand of {site.operator}, a travel agency registered in Korea. These terms apply when you send us a
          trip request and when you book a private van day with us.
        </p>
        <OperatorDetails />
      </LegalSection>

      <LegalSection title="2. What we arrange">
        <BulletList
          items={[
            `A private van day of ${dayProduct.hours} hours in a ${dayProduct.vehicle} for up to ${dayProduct.maxPassengers} passengers, in Seoul or on a Gyeonggi day trip, with a driver only or with a licensed tourist guide who drives`,
            "Other regions and other arrangements, by consultation",
            "The van is a registered rental vehicle. The rental is made in the traveller's name and the rental company provides the driver, as Korean law allows for foreign renters",
            "Guiding inside attractions is done only by a holder of the Korean tourist guide licence. A driver who is not a licensed guide does not guide",
          ]}
        />
      </LegalSection>

      <LegalSection title="3. Requests, quotes and booking">
        <BulletList
          items={[
            "A trip request is not a booking. We check the van and crew for your date and send you a written quote",
            "The written quote states the price for your group, what it includes and what it does not include",
            "Your booking is made when you confirm the written quote and pay as the quote states",
          ]}
        />
        <p>
          Payment methods: <Fill value={legal.payment.methods} what="payment methods" />
        </p>
        <p>
          Deposit and balance: <Fill value={legal.payment.deposit} what="deposit and when the balance is paid" />
        </p>
      </LegalSection>

      <LegalSection title="4. Changes, cancellations and refunds">
        <p>
          These are set out in our{" "}
          <Link href="/cancellation-policy" className="text-sign underline">
            cancellation and refund policy
          </Link>
          , which is part of these terms.
        </p>
      </LegalSection>

      <LegalSection title="5. On the day">
        <BulletList
          items={[
            `One day is ${dayProduct.hours} hours from pick-up to drop-off. Your written quote states how extra time is charged`,
            `The van carries up to ${dayProduct.maxPassengers} passengers. Tell us before the day about suitcases, strollers, wheelchairs and child seats`,
            "Everyone wears a seat belt",
            "There is no forced shopping. You visit only the shops you ask for",
            "Opening days, opening hours and ticket prices of attractions are set by the attractions and can change",
          ]}
        />
      </LegalSection>

      <LegalSection title="6. What we need from you">
        <BulletList
          items={[
            "Correct names, dates, group size and contact details",
            "The details needed for the vehicle rental contract, which we ask for when you book",
            "To be at the agreed pick-up place on time, and to tell us on chat if your plans change",
          ]}
        />
      </LegalSection>

      <LegalSection title="7. Insurance and liability">
        <p>
          <Fill value={legal.liability} what="insurance cover for passengers and the limits of our liability, after legal review" />
        </p>
      </LegalSection>

      <LegalSection title="8. Law and disputes">
        <p>
          These terms are governed by the law of the Republic of Korea. Court with jurisdiction:{" "}
          <Fill value={legal.court} what="court" />
        </p>
      </LegalSection>

      <LegalSection title="9. Contact">
        <p>
          Questions about these terms:{" "}
          <Link href="/contact" className="text-sign underline">
            contact us
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

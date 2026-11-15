import Link from "next/link";
import { Fill, LegalPage, LegalSection } from "@/components/LegalPage";
import { legal, legalPublished } from "@/content/legal";
import { englishOnly } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";

// 취소·환불 규정 틀. 숫자(며칠 전까지 얼마 환불)는 사장님이 정한 뒤 src/content/legal.ts에 넣는다. 지어내지 않는다.
// 빈칸이 다 채워지기 전에는 noindex이고 메뉴·사이트맵에 없다.

export const generateMetadata = metadataFor("cancellation", { published: legalPublished("cancellation") });

// 영어판만 있다(다른 언어 주소는 404). src/lib/meta.ts의 englishOnlyPages.
export default async function Page() {
  await englishOnly();
  const { tiers, noShow, dateChange, byUs, refundMethod } = legal.cancellation;
  return (
    <LegalPage doc="cancellation" title="Cancellation and refund policy" path="/cancellation-policy">
      <LegalSection title="1. If you cancel">
        {tiers.length > 0 ? (
          <div className="overflow-x-auto rounded-md border border-line bg-surface">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-paper text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-semibold">When you cancel</th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">Refund</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => (
                  <tr key={tier.when} className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium">{tier.when}</th>
                    <td className="px-4 py-3">{tier.refund}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>
            <Fill value={null} what="refund by how long before the tour date you cancel" />
          </p>
        )}
        <p>To cancel, message us on the chat you booked with.</p>
      </LegalSection>

      <LegalSection title="2. If you change the date">
        <p>
          <Fill value={dateChange} what="date-change rule" />
        </p>
      </LegalSection>

      <LegalSection title="3. If you do not show up">
        <p>
          <Fill value={noShow} what="no-show rule" />
        </p>
      </LegalSection>

      <LegalSection title="4. If we cancel, or the weather stops the day">
        <p>
          <Fill value={byUs} what="what happens when we cancel or when weather or events outside our control stop the day" />
        </p>
      </LegalSection>

      <LegalSection title="5. How refunds are paid">
        <p>
          <Fill value={refundMethod} what="refund method and how long it takes" />
        </p>
      </LegalSection>

      <LegalSection title="6. Contact">
        <p>
          To cancel or change a booking,{" "}
          <Link href="/contact" className="text-sign underline">
            contact us
          </Link>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}

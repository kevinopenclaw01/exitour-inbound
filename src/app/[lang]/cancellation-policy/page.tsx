import Link from "next/link";
import { Fill, LegalPage, LegalSection } from "@/components/LegalPage";
import { legal, legalPublished } from "@/content/legal";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";

// 취소·환불 규정. 숫자는 src/content/legal.ts(2026-11-17 사장님 확정, 엑시투어 「일반 단품」 기준과 같다). 지어내지 않는다.
// 빈칸이 다 채워지기 전에는 noindex이고 메뉴·사이트맵에 없다. 2026-11-17부터 9개 언어.

export const generateMetadata = metadataFor("cancellation", { published: legalPublished("cancellation") });

export default async function Page() {
  const t = await getT();
  const { tiers, noShow, dateChange, byUs, refundMethod } = legal.cancellation;
  return (
    <LegalPage doc="cancellation" title={t("Cancellation and refund policy")} path="/cancellation-policy">
      <LegalSection title={t("1. If you cancel")}>
        {tiers.length > 0 ? (
          <div className="overflow-x-auto rounded-md border border-line bg-surface">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-paper text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5 font-semibold">{t("When you cancel")}</th>
                  <th scope="col" className="px-4 py-2.5 font-semibold">{t("Refund")}</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => (
                  <tr key={tier.when} className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium">{t(tier.when)}</th>
                    <td className="px-4 py-3">{t(tier.refund)}</td>
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
        <p>{t("Days are counted back from the date of your day. Tell us on the chat you booked with; the time your message reaches us counts.")}</p>
        <p>{t("Hotels and flights you book through other companies follow those companies' own policies.")}</p>
      </LegalSection>

      <LegalSection title={t("2. If you change the date")}>
        <p>
          <Fill value={dateChange} what="date-change rule" />
        </p>
      </LegalSection>

      <LegalSection title={t("3. If you do not show up")}>
        <p>
          <Fill value={noShow} what="no-show rule" />
        </p>
      </LegalSection>

      <LegalSection title={t("4. If we cancel, or the weather stops the day")}>
        <p>
          <Fill value={byUs} what="what happens when we cancel or when weather or events outside our control stop the day" />
        </p>
      </LegalSection>

      <LegalSection title={t("5. How refunds are paid")}>
        <p>
          <Fill value={refundMethod} what="refund method and how long it takes" />
        </p>
      </LegalSection>

      <LegalSection title={t("6. Contact")}>
        <p>
          {t.rich("To cancel or change a booking, <a>contact us</a>.", {
            a: (c) => (
              <Link href={t.href("/contact")} className="text-sign underline">
                {c}
              </Link>
            ),
          })}
        </p>
      </LegalSection>
    </LegalPage>
  );
}

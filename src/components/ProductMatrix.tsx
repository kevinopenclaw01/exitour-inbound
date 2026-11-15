import Link from "next/link";
import { dayProduct, productLabels, productOrder, regionLabels, regionOrder } from "@/content/pricing";
import { getService } from "@/content/services";
import type { DayRate, ProductId } from "@/content/types";
import { getT } from "@/i18n/server";
import type { Translator } from "@/i18n/translate";
import { dayPriceText, dayRate, dayTerms, extraHourText, isConfirmed } from "@/lib/pricing";

// 네 칸 표: 세로는 상품(Driver only / Driver-guide), 가로는 지역(Seoul / Gyeonggi).
// 홈·/prices·서비스 쪽이 모두 이 조각을 쓰고, 자료는 src/content/pricing.ts 한 곳이다.
// 휴대폰에서는 상품 이름이 한 줄을 다 차지하고 그 아래에 두 지역 칸이 나란히 놓인다(같은 DOM, 글이 두 번 나오지 않는다).

function Cell({ rate, t }: { rate: DayRate; t: Translator }) {
  const terms = dayTerms(rate, t);
  const confirmed = isConfirmed(rate);
  const extra = extraHourText(rate, t);
  return (
    <div role="cell" className="grid content-start gap-3 bg-surface p-3 sm:p-4">
      <div>
        <p className={`font-bold text-sign-deep ${confirmed ? "text-xl tabular-nums" : "text-base"}`}>{dayPriceText(rate, undefined, t)}</p>
        <p className="text-xs text-muted">{confirmed ? t("per group, not per person") : t("Per group. Sent before you pay.")}</p>
      </div>
      <p className="text-sm">
        {t("{hours} hours · {vehicle} · up to {max} passengers", {
          hours: dayProduct.hours,
          vehicle: dayProduct.vehicle,
          max: dayProduct.maxPassengers,
        })}
      </p>
      <dl className="grid gap-2 text-sm">
        {terms.included.length > 0 ? (
          <div>
            <dt className="font-semibold">{t("Included")}</dt>
            <dd className="text-muted">{t.list(terms.included)}</dd>
          </div>
        ) : null}
        {terms.notIncluded.length > 0 ? (
          <div>
            <dt className="font-semibold">{t("Not included")}</dt>
            <dd className="text-muted">{t.list(terms.notIncluded)}</dd>
          </div>
        ) : null}
        {extra ? (
          <div>
            <dt className="font-semibold">{t("Extra hours")}</dt>
            <dd className="text-muted">{extra}</dd>
          </div>
        ) : null}
        {terms.inQuote.length > 0 ? (
          <div>
            <dt className="font-semibold">{t("Stated in your written quote")}</dt>
            <dd className="text-muted">{t.list(terms.inQuote)}</dd>
          </div>
        ) : null}
      </dl>
      {rate.noLateFinishLimit === true ? <p className="text-sm text-muted">{t("No limit on how late the day can finish.")}</p> : null}
    </div>
  );
}

export async function ProductMatrix({
  products = productOrder,
  linkProducts = true,
}: {
  products?: ProductId[];
  linkProducts?: boolean;
}) {
  const t = await getT();
  return (
    <div className="grid gap-3">
      <div
        role="table"
        aria-label={t("{hours}-hour private van days: price and what is included, by product and area", { hours: dayProduct.hours })}
        className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-[minmax(9rem,0.8fr)_1.5fr_1.5fr]"
      >
        <div role="row" className="contents">
          <div role="columnheader" className="hidden bg-paper px-4 py-2.5 text-xs font-semibold text-muted sm:block">
            {t("Product")}
          </div>
          {regionOrder.map((region) => (
            <div key={region} role="columnheader" className="bg-paper px-3 py-2.5 sm:px-4">
              <span className="block font-bold">{t(regionLabels[region].name)}</span>
              <span className="block text-xs text-muted">{t(regionLabels[region].hint)}</span>
            </div>
          ))}
        </div>
        {products.map((product) => {
          const service = getService(product);
          return (
            <div key={product} role="row" className="contents">
              <div role="rowheader" className="col-span-2 grid content-start gap-1 bg-surface px-3 pt-4 pb-2 sm:col-span-1 sm:p-4">
                <span className="text-lg font-bold">{t(productLabels[product].name)}</span>
                <span className="text-sm text-muted">{t(productLabels[product].hint)}</span>
                {linkProducts ? (
                  <Link href={t.href(service.path)} className="text-sm font-semibold text-sign underline">
                    {t("How it works")}
                  </Link>
                ) : null}
              </div>
              {regionOrder.map((region) => (
                <Cell key={region} rate={dayRate(product, region)} t={t} />
              ))}
            </div>
          );
        })}
      </div>
      <p className="text-sm">
        {t("Other regions are arranged by consultation.")}{" "}
        <Link href={t.href("/plan")} className="font-semibold text-sign underline">
          {t("Tell us where you want to go")}
        </Link>
      </p>
    </div>
  );
}

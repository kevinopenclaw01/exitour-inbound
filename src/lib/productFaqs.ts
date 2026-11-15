import { dayProduct, productLabels } from "@/content/pricing";
import type { Faq, ProductId } from "@/content/types";
import { en, type Translator } from "@/i18n/translate";
import { dayRateSentence, dayRatesFor } from "./pricing";

// 값·포함 항목에 대한 FAQ. 문장을 손으로 쓰지 않고 src/content/pricing.ts에서 만든다
// (사장님이 값을 확정하거나 포함 항목을 채우면 화면·FAQPage 구조화 데이터·llms.txt가 같이 바뀐다).
// 번역기(t)를 넘기면 그 언어로 만든다.

export function productFaqs(service: ProductId, t: Translator = en): Faq[] {
  const label = t.lowerFirst(t(productLabels[service].name));
  return [
    {
      q: t("How long is a {product} day and how many people can ride?", { product: label }),
      a: t(
        "{hours} hours from pick-up to drop-off, in one {vehicle} van for up to {max} passengers. The price is per group, not per person.",
        { hours: dayProduct.hours, vehicle: dayProduct.vehicle, max: dayProduct.maxPassengers },
      ),
    },
    {
      q: t("What does the {product} price include?", { product: label }),
      a: t("{sentences} We send the price and what it includes in writing before you pay.", {
        sentences: dayRatesFor(service)
          .map((r) => dayRateSentence(r, t))
          .join(" "),
      }),
    },
  ];
}

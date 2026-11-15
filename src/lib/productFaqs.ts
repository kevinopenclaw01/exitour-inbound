import { dayProduct, productLabels } from "@/content/pricing";
import type { Faq, ProductId } from "@/content/types";
import { dayRateSentence, dayRatesFor } from "./pricing";

// 값·포함 항목에 대한 FAQ. 문장을 손으로 쓰지 않고 src/content/pricing.ts에서 만든다
// (사장님이 값을 확정하거나 포함 항목을 채우면 화면·FAQPage 구조화 데이터·llms.txt가 같이 바뀐다).

export function productFaqs(service: ProductId): Faq[] {
  const label = productLabels[service].name.toLowerCase();
  return [
    {
      q: `How long is a ${label} day and how many people can ride?`,
      a: `${dayProduct.hours} hours from pick-up to drop-off, in one ${dayProduct.vehicle} van for up to ${dayProduct.maxPassengers} passengers. The price is per group, not per person.`,
    },
    {
      q: `What does the ${label} price include?`,
      a: `${dayRatesFor(service).map(dayRateSentence).join(" ")} We send the price and what it includes in writing before you pay.`,
    },
  ];
}

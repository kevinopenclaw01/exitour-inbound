import { airportTransfer } from "@/content/airportTransfer";
import { articles } from "@/content/articles";
import { crew } from "@/content/crew";
import { dayPlans } from "@/content/dayPlans";
import { generalFaqs } from "@/content/faqs";
import { dayProduct } from "@/content/pricing";
import { listedServices } from "@/content/services";
import { site } from "@/content/site";
import type { ProductId } from "@/content/types";
import { localeInfo, localizePath, translatedLangs } from "@/i18n/config";
import { dayRateSentence, dayRatesFor } from "./pricing";
import { productFaqs } from "./productFaqs";
import { abs } from "./schema";

// /llms.txt — AI가 사이트를 한 번에 이해하도록 콘텐츠 데이터에서 자동으로 만드는 요약(llmstxt.org 형식).
// 화면에 나가는 것과 같은 규칙: 확정된 값만 숫자로, 숨긴 쪽(/guide-tour 등)은 싣지 않는다.

export function buildLlmsTxt(): string {
  const out: string[] = [];
  out.push(`# ${site.brand}`, "", `> ${site.description}`, "");
  out.push(
    "Key facts:",
    `- Operator: ${site.operator}, ${site.operatorLicense.type}`,
    `- Products: two private van days of ${dayProduct.hours} hours each, with a driver only or with a licensed driver-guide`,
    `- Vehicle: ${dayProduct.vehicle} van, up to ${dayProduct.maxPassengers} passengers`,
    "- Areas: Seoul city and Gyeonggi day trips are fixed products; other regions are arranged by consultation",
    "- Prices are per group, not per person, and are confirmed in writing before payment",
    "- Every guide holds the Korean tourist guide licence; drivers without the licence do not guide inside attractions",
    "- No forced shopping",
    ...(site.whatsapp ? [`- Contact: WhatsApp ${site.phone ?? site.whatsapp}${site.kakaoId ? `, KakaoTalk ID ${site.kakaoId}` : ""}. ${site.officeHours}`] : []),
    "",
  );
  out.push("## Products", "");
  for (const s of listedServices) {
    out.push(`- [${s.name}](${abs(s.path)}): ${s.answer}`);
    for (const r of dayRatesFor(s.id as ProductId)) out.push(`  - ${dayRateSentence(r)}`);
  }
  if (crew.length > 0) {
    out.push("", "## Crew", "");
    for (const c of crew) out.push(`- ${c.name}, ${c.role}${c.licence ? `. ${c.licence}` : ""}. Languages: ${c.languages.join(", ")}.`);
  }
  out.push("", `## ${dayProduct.hours}-hour day examples`, "", "Examples only; every plan can be changed.", "");
  for (const p of dayPlans) out.push(`- [${p.name}](${abs(`/day-plans#${p.slug}`)}): ${p.summary}`);
  out.push("", "## Other services", "");
  out.push(`- [${airportTransfer.name}](${abs(airportTransfer.path)}): ${airportTransfer.answer} Quote on request.`);
  out.push("", "## Travel guide", "");
  for (const a of articles) out.push(`- [${a.title}](${abs(`/travel-guide/${a.slug}`)}): ${a.answer}`);
  out.push("", "## FAQ", "");
  for (const f of [...generalFaqs, ...listedServices.flatMap((s) => productFaqs(s.id as ProductId))]) out.push(`- ${f.q} ${f.a}`);
  out.push(
    "",
    "## Optional",
    "",
    `- [Prices](${abs("/prices")})`,
    `- [${dayProduct.hours}-hour day plans](${abs("/day-plans")})`,
    `- [Licensed & safe](${abs("/safety")})`,
    `- [Plan my trip](${abs("/plan")})`,
    `- [Contact us](${abs("/contact")})`,
    `- [About us](${abs("/about")})`,
    "",
    "## Other languages",
    "",
    "The same pages are published in these languages (same facts, translated):",
    "",
    ...translatedLangs.map((l) => `- [${localeInfo[l].english}](${abs(localizePath("/", l))})`),
    "",
  );
  return out.join("\n");
}

import { airportTransfer } from "@/content/airportTransfer";
import { articles } from "@/content/articles";
import { generalFaqs } from "@/content/faqs";
import { planIdeas } from "@/content/plans";
import { services, vehicles } from "@/content/services";
import { site } from "@/content/site";
import { formatKrw, ratesFor } from "./pricing";
import type { PriceRule } from "@/content/types";
import { abs } from "./schema";

// /llms.txt — AI가 사이트를 한 번에 이해하도록 콘텐츠 데이터에서 자동으로 만드는 요약(llmstxt.org 형식).

/** 확정가만 숫자로 알린다. 제안가(draft)는 구조화 데이터와 같이 AI에게 내보내지 않는다. */
function aiPriceText(rule: PriceRule): string {
  return rule.status === "confirmed" && rule.priceKrw !== null ? formatKrw(rule.priceKrw) : "Quote on request";
}

export function buildLlmsTxt(): string {
  const out: string[] = [];
  out.push(`# ${site.brand}`, "", `> ${site.description}`, "");
  out.push(
    "Key facts:",
    `- Operator: ${site.operator}, ${site.operatorLicense.type}`,
    `- Areas: ${site.areaServed.join(", ")}`,
    `- Vehicles: ${vehicles.map((v) => `${v.name} (up to ${v.comfortablePax} people with luggage)`).join("; ")}`,
    "- Prices are per group, not per person",
    "- Every guide holds the Korean tourist guide licence; drivers without the licence do not guide inside attractions",
    "- No forced shopping",
    ...(site.whatsapp ? [`- Contact: WhatsApp ${site.phone ?? site.whatsapp}${site.kakaoId ? `, KakaoTalk ID ${site.kakaoId}` : ""}. ${site.officeHours}`] : []),
    "",
  );
  out.push("## Services", "");
  for (const s of services) {
    out.push(`- [${s.name}](${abs(s.path)}): ${s.answer}`);
    for (const r of ratesFor(s.id)) out.push(`  - ${r.label}: ${aiPriceText(r)}`);
  }
  out.push(`- [${airportTransfer.name}](${abs(airportTransfer.path)}): ${airportTransfer.answer}`, "  - Quote on request");
  out.push("", "## Planned day examples", "");
  for (const p of planIdeas) out.push(`- [${p.name}](${abs(`/guide-tour#${p.slug}`)}): ${p.summary}`);
  out.push("", "## Travel guide", "");
  for (const a of articles) out.push(`- [${a.title}](${abs(`/travel-guide/${a.slug}`)}): ${a.answer}`);
  out.push("", "## FAQ", "");
  for (const f of generalFaqs) out.push(`- ${f.q} ${f.a}`);
  out.push(
    "",
    "## Optional",
    "",
    `- [Prices](${abs("/prices")})`,
    `- [Licensed & safe](${abs("/safety")})`,
    `- [Plan my trip](${abs("/plan")})`,
    `- [Contact us](${abs("/contact")})`,
    `- [About us](${abs("/about")})`,
    "",
  );
  return out.join("\n");
}

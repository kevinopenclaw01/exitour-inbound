import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { airportTransfer } from "@/content/airportTransfer";
import { articles } from "@/content/articles";
import { crewEntries, crewLanguageClaim } from "@/content/crew";
import { dayPlans } from "@/content/dayPlans";
import { generalFaqs } from "@/content/faqs";
import { legal, legalDocs } from "@/content/legal";
import { pages } from "@/content/pages";
import { guestPhotos, placePhotos, vanPhotos } from "@/content/photos";
import { costItemLabels, productLabels, regionLabels } from "@/content/pricing";
import { listedServices, vehicles } from "@/content/services";
import { nav, site } from "@/content/site";
import { englishOnlyPages } from "@/lib/meta";

// 번역할 영어 문장(열쇠)을 모은다. 시험(tests/i18n.test.ts)이 이 결과와 src/i18n/source.json을 비교한다.
// 1) 코드 안의 t('…')·t.rich('…')·msg('…') 문장
// 2) 콘텐츠 자료(서비스·FAQ·하루 예시·안내 글·쪽 제목 등)의 문장. 주소·id·날짜처럼 번역하지 않는 값은 거른다.
// 영어로만 두는 쪽(숨긴 쪽)의 본문은 넣지 않는다. 약관류는 2026-11-17부터 번역한다.

const SRC = join(process.cwd(), "src");

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return name === "messages" ? [] : files(full);
    return /\.(ts|tsx)$/.test(name) ? [full] : [];
  });
}

/** 영어로만 두는 쪽의 파일(여기 문장은 번역하지 않는다). */
function englishOnlyFile(path: string): boolean {
  const norm = path.replace(/\\/g, "/");
  const dirs = [...englishOnlyPages].map((k) => (k === "cancellation" ? "cancellation-policy" : k));
  return dirs.some((d) => norm.includes(`/app/[lang]/${d}/`));
}

const unescape = (s: string) => JSON.parse(`"${s.replace(/\n/g, "\\n")}"`) as string;

export function literalKeys(): string[] {
  const out: string[] = [];
  const re = /(?<![\w.])(?:t|t\.rich|msg)\(\s*"((?:[^"\\]|\\.)*)"/g;
  for (const file of files(SRC)) {
    if (englishOnlyFile(file)) continue;
    const text = readFileSync(file, "utf8");
    for (const m of text.matchAll(re)) out.push(unescape(m[1]!));
    // 이동 경로 crumbs(t, [["Home", "/"], …])의 이름
    for (const m of text.matchAll(/\[\s*"((?:[^"\\]|\\.)*)",\s*"\//g)) out.push(unescape(m[1]!));
  }
  return out;
}

/** 번역할 문장인가: 글자가 있고, 주소·id·날짜·시각·파일 이름이 아닌 것. */
export function translatable(value: string): boolean {
  if (!/[A-Za-z]/.test(value)) return false;
  if (/^(\/|https?:|#|mailto:)/.test(value)) return false;
  if (/^[a-z0-9-]+$/.test(value)) return false;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value) || /^\d{1,2}:\d{2}$/.test(value)) return false;
  if (/\.(webp|jpe?g|png|svg|mp4)$/i.test(value)) return false;
  return true;
}

function walk(value: unknown, out: string[]): void {
  if (typeof value === "string") {
    if (translatable(value)) out.push(value);
  } else if (Array.isArray(value)) value.forEach((v) => walk(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => walk(v, out));
}

export function contentKeys(): string[] {
  const out: string[] = [];
  const translatedPages = Object.entries(pages).filter(([key]) => !englishOnlyPages.has(key as keyof typeof pages));
  walk(
    [
      translatedPages.map(([, p]) => ({ title: p.title, description: p.description, og: p.og })),
      listedServices,
      vehicles,
      generalFaqs,
      productLabels,
      regionLabels,
      costItemLabels,
      dayPlans.map((p) => ({ name: p.name, area: p.area, summary: p.summary, stops: p.stops, goodToKnow: p.goodToKnow })),
      vanPhotos.map((p) => ({ alt: p.alt, caption: p.caption })),
      Object.values(placePhotos).map((p) => ({ alt: p.alt, caption: p.caption })),
      guestPhotos.photos.map((p) => ({ alt: p.alt })),
      crewEntries.map((c) => ({ role: c.role, alt: c.photo?.alt, intro: c.intro, licence: c.licence, languages: c.languages })),
      crewLanguageClaim.text,
      crewLanguageClaim.alternative,
      airportTransfer,
      articles,
      nav.map((n) => n.label),
      legalDocs.map((d) => d.label),
      { cancellation: legal.cancellation, payment: legal.payment, privacy: { officer: legal.privacy.officer, retention: legal.privacy.retention, hosting: legal.privacy.hosting, rentalDetails: legal.privacy.rentalDetails, paymentProviders: legal.privacy.paymentProviders }, liability: legal.liability, court: legal.court },
      site.description,
      site.tagline,
      site.officeHours,
      site.operatorLicense.type,
      site.heroImage ? { alt: site.heroImage.alt, credit: site.heroImage.credit } : null,
    ],
    out,
  );
  return out;
}

/** 모든 열쇠(중복 없이, 정렬). */
export function extractKeys(): string[] {
  return [...new Set([...literalKeys(), ...contentKeys()])].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
}

/** 문장 안의 자리 표시({n})와 태그(<a>) 목록. 번역문도 같아야 한다. */
export function markers(text: string): string[] {
  return [...text.matchAll(/\{\w+\}|<\/?\w+>/g)].map((m) => m[0]).sort();
}

// 빌드 결과(.next/server/app/**/*.html)의 모든 쪽을 읽어 검색·AI 노출 규칙을 확인한다.
// 사용: npm run build 다음에  node scripts/check-structured-data.mjs
//
// 확인하는 것
//  1) JSON-LD가 문법에 맞고(@context·@type 있음), 값에 null·빈 문자열·"undefined"가 없다
//  2) Offer에는 price(숫자)와 priceCurrency가 있다. 확정값이 없으면 Offer 자체가 없어야 한다(이 스크립트는 Offer 수를 보고한다)
//  3) FAQPage·BreadcrumbList·Article·Service·ItemList·TravelAgency·WebSite의 필수 칸
//  4) 쪽마다 <title>·description·canonical·og:image가 있고, 제목과 설명이 다른 쪽과 겹치지 않으며, 설명이 160자 이하
//  5) 숨긴 쪽은 noindex, 공개 쪽은 noindex가 아니다
//  6) 화면·JSON-LD 어디에도 초안 값(₩ 숫자)이나 "draft"가 없다(확정값이 생기면 그 값만 허용)
// 온라인 검증기(구글 리치 결과 테스트, validator.schema.org)는 공개 주소가 필요해서 배포 뒤에 돌린다.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const appDir = fileURLToPath(new URL("../.next/server/app/", import.meta.url));
const errors = [];
const fail = (page, message) => errors.push(`${page}: ${message}`);

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) return htmlFiles(full);
    return name.endsWith(".html") ? [full] : [];
  });
}

const decode = (s) => s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
const meta = (html, attr, name) => {
  const m = html.match(new RegExp(`<meta[^>]*${attr}="${name}"[^>]*content="([^"]*)"`, "i")) ?? html.match(new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${name}"`, "i"));
  return m ? decode(m[1]) : null;
};

function walk(node, visit, path = "$") {
  if (Array.isArray(node)) return node.forEach((child, i) => walk(child, visit, `${path}[${i}]`));
  if (node && typeof node === "object") {
    visit(node, path);
    for (const [key, value] of Object.entries(node)) walk(value, visit, `${path}.${key}`);
    return;
  }
  visit(node, path);
}

const need = (page, node, path, keys) => {
  for (const key of keys) if (node[key] === undefined) fail(page, `${node["@type"]} at ${path} is missing "${key}"`);
};

const titles = new Map();
const descriptions = new Map();
const typeCount = {};
let offerCount = 0;
let pageCount = 0;

// 숨긴 쪽(주소로는 열리지만 noindex). src/lib/routes.ts의 hiddenRoutes와 같아야 한다.
const hidden = new Set(["guide-tour", "join-as-guide", "terms", "privacy", "cancellation-policy"]);
const skip = new Set(["_not-found", "_global-error", "404", "500"]);

for (const file of htmlFiles(appDir)) {
  const page = relative(appDir, file).replace(/\\/g, "/").replace(/\.html$/, "");
  if (skip.has(page)) continue;
  const html = readFileSync(file, "utf8");
  pageCount += 1;

  // ── 제목·설명·canonical·공유 그림
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const description = meta(html, "name", "description");
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/)?.[1];
  const robots = meta(html, "name", "robots") ?? "";
  if (!title) fail(page, "no <title>");
  if (!description) fail(page, "no meta description");
  else if (description.length > 160) fail(page, `description is ${description.length} characters (max 160)`);
  if (!canonical) fail(page, "no canonical link");
  if (!meta(html, "property", "og:image")) fail(page, "no og:image");
  if (!meta(html, "property", "og:title")) fail(page, "no og:title");
  if (titles.has(title)) fail(page, `same <title> as ${titles.get(title)}`);
  titles.set(title, page);
  if (description) {
    if (descriptions.has(description)) fail(page, `same description as ${descriptions.get(description)}`);
    descriptions.set(description, page);
  }
  const noindex = /noindex/.test(robots);
  if (hidden.has(page) && !noindex) fail(page, "hidden page must be noindex");
  if (!hidden.has(page) && noindex) fail(page, "public page is noindex");

  // ── 초안 값이 새어 나가지 않았는지(스크립트·스타일을 뺀 본문과 JSON-LD)
  const visible = html.replace(/<script(?![^>]*ld\+json)[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "");
  if (/draft rate/i.test(visible)) fail(page, 'the words "draft rate" are on the page');
  if (/₩\s?\d/.test(visible) && !/"@type":"Offer"/.test(html)) fail(page, "a won amount is shown but there is no confirmed Offer");

  // ── JSON-LD
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  if (blocks.length === 0) fail(page, "no JSON-LD");
  for (const block of blocks) {
    let data;
    try {
      data = JSON.parse(block);
    } catch (e) {
      fail(page, `JSON-LD does not parse: ${e.message}`);
      continue;
    }
    for (const item of Array.isArray(data) ? data : [data]) {
      if (item["@context"] !== "https://schema.org") fail(page, `JSON-LD ${item["@type"]} has no schema.org @context`);
      walk(item, (node, path) => {
        if (node === null) fail(page, `null value at ${path}`);
        if (node === "" || node === "undefined" || node === "null") fail(page, `empty value at ${path}`);
        if (typeof node === "string" && /draft (rate|price)/i.test(node)) fail(page, `a draft price is mentioned at ${path}`);
        if (!node || typeof node !== "object" || Array.isArray(node) || !node["@type"]) return;
        const type = node["@type"];
        typeCount[type] = (typeCount[type] ?? 0) + 1;
        if (type === "Offer") {
          offerCount += 1;
          need(page, node, path, ["price", "priceCurrency", "name"]);
          if (typeof node.price !== "number" || !(node.price > 0)) fail(page, `Offer price is not a positive number at ${path}`);
        }
        if (type === "FAQPage") {
          need(page, node, path, ["mainEntity"]);
          for (const q of node.mainEntity ?? []) {
            if (!q.name || !q.acceptedAnswer?.text) fail(page, `FAQ question without name or answer at ${path}`);
          }
        }
        if (type === "BreadcrumbList") {
          need(page, node, path, ["itemListElement"]);
          (node.itemListElement ?? []).forEach((el, i) => {
            if (el.position !== i + 1 || !el.name || !/^https?:\/\//.test(el.item ?? "")) fail(page, `breadcrumb item ${i + 1} is malformed`);
          });
        }
        if (type === "ItemList") {
          need(page, node, path, ["itemListElement"]);
          (node.itemListElement ?? []).forEach((el, i) => {
            if (el.position !== i + 1 || !el.name || !/^https?:\/\//.test(el.url ?? "")) fail(page, `list item ${i + 1} is malformed`);
          });
        }
        if (type === "Article") need(page, node, path, ["headline", "datePublished", "dateModified", "author", "publisher", "image"]);
        if (type === "Service") need(page, node, path, ["name", "description", "provider", "areaServed", "url"]);
        if (type === "TravelAgency" && node["@id"]) need(page, node, path, ["name", "url", "description"]);
        if (type === "WebSite") need(page, node, path, ["name", "url"]);
      });
    }
  }
}

console.log(`쪽 ${pageCount}개 확인. JSON-LD 종류: ${Object.entries(typeCount).map(([k, v]) => `${k} ${v}`).join(", ")}`);
console.log(`Offer(가격) ${offerCount}개 — 확정된 값이 없으면 0이어야 한다.`);
if (errors.length > 0) {
  console.error(`\n문제 ${errors.length}개:\n  ${errors.join("\n  ")}`);
  process.exit(1);
}
console.log("문제 없음.");

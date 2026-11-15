import { createElement, Fragment, type ReactNode } from "react";
import { defaultLang, localeInfo, localizePath, type Lang } from "./config";
import { interpolate, type Vars } from "./interpolate";
import es from "./messages/es.json";
import id from "./messages/id.json";
import ja from "./messages/ja.json";
import th from "./messages/th.json";
import tl from "./messages/tl.json";
import vi from "./messages/vi.json";
import ko from "./messages/ko.json";
import zh from "./messages/zh.json";

// 번역 함수. 사전의 열쇠는 영어 원문 그대로다(src/i18n/source.json이 열쇠 목록, tests/i18n.test.ts가 빠진 번역을 찾는다).
// - t('Prices')                          → 그 언어의 문장. 사전에 없으면 영어 원문 그대로(화면이 깨지지 않는다).
// - t('Up to {n} passengers', { n: 7 })  → 자리 표시 {n}에 값을 넣는다. 번역문도 같은 자리 표시를 써야 한다.
// - t.rich('With a <a>driver</a>, …', { a: (c) => <Link …>{c}</Link> }) → 문장 안의 링크·굵은 글씨.
// - t.obj(service)                        → 콘텐츠 자료(서비스·FAQ·안내 글)의 문장을 통째로 바꾼다. 주소·id처럼 사전에 없는 값은 그대로.
// - t.href("/prices")                     → 언어 앞머리를 붙인 주소(/zh/prices).
// 번역 사전은 서버에서만 읽는다. 브라우저 쪽 조각(폼 등)에는 필요한 문장만 골라 넘긴다(src/i18n/formStrings.ts).

export type Dictionary = Record<string, string>;
export { interpolate, type Vars };

const dictionaries: Record<Exclude<Lang, "en">, Dictionary> = { zh, ja, es, id, th, tl, vi, ko };

export function dictionaryFor(lang: Lang): Dictionary {
  return lang === defaultLang ? {} : dictionaries[lang as Exclude<Lang, "en">];
}

/** "<a>링크</a>" 같은 태그를 조각으로 나눈다. 태그는 겹치지 않는 한 단계만 쓴다. */
export function splitTags(text: string): ({ text: string } | { tag: string; text: string })[] {
  const out: ({ text: string } | { tag: string; text: string })[] = [];
  const re = /<(\w+)>([\s\S]*?)<\/\1>/g;
  let last = 0;
  for (const m of text.matchAll(re)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ tag: m[1]!, text: m[2]! });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

export interface Translator {
  (text: string, vars?: Vars): string;
  lang: Lang;
  /** 사전에 그 문장이 있는가(영어는 늘 true). */
  has(text: string): boolean;
  rich(text: string, tags: Record<string, (chunk: string) => ReactNode>, vars?: Vars): ReactNode;
  obj<T>(value: T): T;
  href(path: string): string;
  /** 목록을 그 언어 방식으로 잇는다. 영어는 "a, b and c"(뒤 항목은 첫 글자를 소문자로). */
  list(items: string[]): string;
  /** 영어 문장 가운데에 넣을 때만 첫 글자를 소문자로. 다른 언어는 그대로. */
  lowerFirst(text: string): string;
}

const cache = new Map<Lang, Translator>();

export function translator(lang: Lang): Translator {
  const hit = cache.get(lang);
  if (hit) return hit;
  const dict = dictionaryFor(lang);
  const lookup = (text: string) => dict[text] ?? text;

  const t = ((text: string, vars?: Vars) => interpolate(lookup(text), vars)) as Translator;
  t.lang = lang;
  t.has = (text) => lang === defaultLang || text in dict;
  t.rich = (text, tags, vars) =>
    splitTags(interpolate(lookup(text), vars)).map((part, i) =>
      "tag" in part
        ? createElement(Fragment, { key: i }, tags[part.tag] ? tags[part.tag]!(part.text) : part.text)
        : createElement(Fragment, { key: i }, part.text),
    );
  const deep = (value: unknown): unknown => {
    if (typeof value === "string") return lookup(value);
    if (Array.isArray(value)) return value.map(deep);
    if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
      return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, deep(v)]));
    }
    return value;
  };
  t.obj = <T,>(value: T) => (lang === defaultLang ? value : (deep(value) as T));
  t.href = (path) => localizePath(path, lang);
  const lowerFirst = (text: string) => (lang === defaultLang ? text.charAt(0).toLowerCase() + text.slice(1) : text);
  t.lowerFirst = lowerFirst;
  t.list = (items) => {
    if (lang === defaultLang) {
      const lower = items.map((item, i) => (i === 0 ? item : lowerFirst(item)));
      if (lower.length <= 1) return lower.join("");
      return `${lower.slice(0, -1).join(", ")} and ${lower[lower.length - 1]}`;
    }
    return new Intl.ListFormat(localeInfo[lang].intl, { type: "conjunction" }).format(items);
  };
  cache.set(lang, t);
  return t;
}

/** 영어 번역기(계산 함수의 기본값). */
export const en = translator(defaultLang);

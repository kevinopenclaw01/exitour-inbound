import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { localizePath, splitLang, translatedLangs } from "@/i18n/config";
import { extractKeys, markers } from "@/i18n/extract";
import { formStrings } from "@/i18n/formStrings";
import { dictionaryFor, splitTags, translator } from "@/i18n/translate";

// 번역 사전 검사.
// - src/i18n/source.json(번역할 영어 문장 목록)이 코드·콘텐츠와 맞는가. 내 PC에서 npm test를 돌리면 자동으로 새로 쓴다(CI에서는 실패).
// - 7개 언어 사전에 빠진 문장이 없는가, 자리 표시({n})와 태그(<a>)가 원문과 같은가.
// 영어 문장을 바꾸면: npm test → source.json이 바뀜 → 빠진 번역을 채운다(docs/11_languages.md).

const sourceFile = join(process.cwd(), "src", "i18n", "source.json");
const keys = extractKeys();

describe("translation source list", () => {
  it("matches the strings in the code and content", () => {
    const current = existsSync(sourceFile) ? (JSON.parse(readFileSync(sourceFile, "utf8")) as string[]) : [];
    if (JSON.stringify(current) !== JSON.stringify(keys) && !process.env.CI) {
      writeFileSync(sourceFile, `${JSON.stringify(keys, null, 2)}\n`, "utf8");
      console.warn(`src/i18n/source.json updated: ${keys.length} strings`);
      return;
    }
    expect(current).toEqual(keys);
  });

  it("includes every string the trip request form uses", () => {
    const set = new Set(keys);
    for (const s of formStrings()) expect(set.has(s), s).toBe(true);
  });
});

describe.each(translatedLangs)("%s dictionary", (lang) => {
  const dict = dictionaryFor(lang);

  it("has every source string", () => {
    const missing = keys.filter((k) => !(k in dict));
    expect(missing, `${missing.length} missing`).toEqual([]);
  });

  it("keeps placeholders and tags", () => {
    const wrong = keys.filter((k) => k in dict && JSON.stringify(markers(k)) !== JSON.stringify(markers(dict[k]!)));
    expect(wrong).toEqual([]);
  });

  it("has no empty translations", () => {
    expect(Object.entries(dict).filter(([, v]) => v.trim() === "").map(([k]) => k)).toEqual([]);
  });
});

describe("i18n helpers", () => {
  it("localizes paths", () => {
    expect(localizePath("/", "zh")).toBe("/zh");
    expect(localizePath("/prices", "zh")).toBe("/zh/prices");
    expect(localizePath("/day-plans#x", "th")).toBe("/th/day-plans#x");
    expect(localizePath("/prices", "en")).toBe("/prices");
    expect(localizePath("https://wa.me/1", "ja")).toBe("https://wa.me/1");
    expect(splitLang("/zh/prices")).toEqual({ lang: "zh", path: "/prices" });
    expect(splitLang("/zh")).toEqual({ lang: "zh", path: "/" });
    expect(splitLang("/en/prices")).toEqual({ lang: "en", path: "/prices" });
    expect(splitLang("/prices")).toEqual({ lang: "en", path: "/prices" });
  });

  it("fills placeholders and falls back to English", () => {
    const en = translator("en");
    expect(en("Up to {n} people", { n: 7 })).toBe("Up to 7 people");
    expect(en.list(["Fuel", "Expressway tolls", "Parking"])).toBe("Fuel, expressway tolls and parking");
    expect(translator("ja")("A sentence that is not in the dictionary")).toBe("A sentence that is not in the dictionary");
  });

  it("splits rich text tags", () => {
    expect(splitTags("With a <a>driver</a>, ok")).toEqual([{ text: "With a " }, { tag: "a", text: "driver" }, { text: ", ok" }]);
  });

  it("finds placeholders and tags", () => {
    expect(markers("Hi {name}, <a>go</a>")).toEqual(["</a>", "<a>", "{name}"]);
  });
});

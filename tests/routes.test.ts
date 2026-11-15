import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { nav } from "@/content/site";
import { aiCrawlers } from "@/lib/crawlers";
import { buildLlmsTxt } from "@/lib/llms";
import { englishOnlyRoutes, hiddenRoutes, publicRoutes } from "@/lib/routes";

// 쪽 파일은 언어 칸 아래에 있다(src/app/[lang]/...). 2026-11-16 7개 언어 추가.
const appDir = join(__dirname, "..", "src", "app", "[lang]");

describe("public routes", () => {
  it("every listed route has a page file", () => {
    for (const r of publicRoutes()) {
      const dir = r.path.startsWith("/travel-guide/") ? join(appDir, "travel-guide", "[slug]") : join(appDir, r.path);
      expect(existsSync(join(dir, "page.tsx")), r.path).toBe(true);
    }
  });
  it("has no duplicate paths", () => {
    const paths = publicRoutes().map((r) => r.path);
    expect(new Set(paths).size).toBe(paths.length);
  });
  it("uses real dates for the sitemap", () => {
    for (const r of publicRoutes()) expect(r.updated, r.path).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("llms.txt mentions every service and article", () => {
    const txt = buildLlmsTxt();
    for (const r of publicRoutes().filter((r) => r.priority >= 0.8 && r.path !== "/")) {
      expect(txt, r.path).toContain(r.path);
    }
  });
});

describe("narrowed menu (2026-11-16)", () => {
  it("shows only the two products, prices, FAQ, about and contact in the menu", () => {
    expect(nav.map((n) => n.href)).toEqual(["/private-driver", "/driver-guide", "/prices", "/faq", "/about", "/contact"]);
  });

  it("keeps hidden pages out of the sitemap list and llms.txt", () => {
    const paths = publicRoutes().map((r) => r.path);
    const txt = buildLlmsTxt();
    expect(hiddenRoutes()).toContain("/guide-tour");
    expect(hiddenRoutes()).toContain("/join-as-guide");
    for (const hidden of hiddenRoutes()) {
      expect(paths, hidden).not.toContain(hidden);
      expect(txt, hidden).not.toContain(hidden);
    }
  });

  it("hidden pages still exist as code, are marked noindex and are English only", () => {
    for (const hidden of hiddenRoutes()) {
      const file = join(appDir, hidden, "page.tsx");
      expect(existsSync(file), hidden).toBe(true);
      const code = readFileSync(file, "utf8");
      // 쪽 파일이 metadataFor(pageMetadata)를 쓰고, 그 쪽의 색인 여부는 tests/meta.test.ts가 확인한다.
      expect(code, hidden).toContain("metadataFor(");
      expect(code, hidden).toContain("await englishOnly()");
    }
  });

  it("legal pages are English only", () => {
    for (const path of englishOnlyRoutes()) {
      expect(readFileSync(join(appDir, path, "page.tsx"), "utf8"), path).toContain("await englishOnly()");
    }
  });

  it("header and footer do not link to hidden pages", () => {
    const chrome = readFileSync(join(__dirname, "..", "src", "components", "SiteChrome.tsx"), "utf8");
    expect(chrome).not.toContain("/guide-tour");
    expect(chrome).not.toContain("/join-as-guide");
  });
});

describe("llms.txt prices", () => {
  it("does not expose draft rates", () => {
    const txt = buildLlmsTxt();
    expect(txt).not.toContain("draft");
    expect(txt).not.toMatch(/₩\s?\d/);
    expect(txt).not.toMatch(/480,?000|540,?000|230,?000/);
  });
});

describe("robots", () => {
  it("names each AI crawler once", () => {
    expect(new Set(aiCrawlers).size).toBe(aiCrawlers.length);
    for (const name of ["OAI-SearchBot", "ChatGPT-User", "GPTBot", "Claude-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"]) {
      expect(aiCrawlers).toContain(name);
    }
  });
});

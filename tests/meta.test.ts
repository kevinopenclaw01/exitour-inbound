import { describe, expect, it } from "vitest";
import { articles } from "@/content/articles";
import { legalDocs, legalMissing, legalPublished, publishedLegalDocs } from "@/content/legal";
import { pages, type PageKey } from "@/content/pages";
import { site } from "@/content/site";
import { articleMetadata, ogEntries, pageMetadata, verificationMetadata } from "@/lib/meta";
import { hiddenRoutes, publicRoutes } from "@/lib/routes";

// 쪽마다 제목·설명이 다르고, 숨긴 쪽은 noindex인지 확인한다.

const keys = Object.keys(pages) as PageKey[];
const robotsOf = (key: PageKey, published?: boolean) => pageMetadata(key, { published }).robots as { index: boolean };

describe("page titles and descriptions", () => {
  it("are unique across pages and articles", () => {
    const titles = [...keys.map((k) => pages[k].title), ...articles.map((a) => a.title)];
    const descriptions = [...keys.map((k) => pages[k].description), ...articles.map((a) => a.description)];
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("keep descriptions within what search results show", () => {
    for (const key of keys) {
      expect(pages[key].description.length, key).toBeLessThanOrEqual(160);
      expect(pages[key].description.length, key).toBeGreaterThanOrEqual(60);
    }
    for (const a of articles) expect(a.description.length, a.slug).toBeLessThanOrEqual(160);
  });

  it("keep titles short enough with the brand suffix", () => {
    for (const key of keys) {
      const full = key === "home" ? pages[key].title : `${pages[key].title} | ${site.brand}`;
      expect(full.length, key).toBeLessThanOrEqual(75);
    }
  });

  it("every public route has a page entry or is an article", () => {
    const paths = new Set(keys.map((k) => pages[k].path));
    for (const r of publicRoutes()) {
      if (r.path.startsWith("/travel-guide/")) continue;
      expect(paths.has(r.path), r.path).toBe(true);
    }
  });
});

describe("indexing", () => {
  it("hidden pages are noindex and public pages are indexable", () => {
    const hidden = new Set(hiddenRoutes());
    for (const key of keys) {
      const page = pages[key];
      const legal = legalDocs.find((d) => d.path === page.path);
      const robots = robotsOf(key, legal ? legalPublished(legal.doc) : undefined);
      expect(robots.index, key).toBe(!hidden.has(page.path));
    }
  });

  it("canonical and share image are set on every page", () => {
    for (const key of keys) {
      const meta = pageMetadata(key);
      expect(meta.alternates?.canonical, key).toBe(pages[key].path);
      const images = (meta.openGraph as { images: { url: string }[] }).images;
      expect(images[0]?.url, key).toBe(`/og/${key}.png`);
    }
    const article = articles[0]!;
    const meta = articleMetadata(article);
    expect(meta.alternates?.canonical).toBe(`/travel-guide/${article.slug}`);
    expect((meta.openGraph as { images: { url: string }[] }).images[0]?.url).toBe(`/og/article-${article.slug}.png`);
  });

  it("has one share image per page and article, with unique file names", () => {
    const entries = ogEntries();
    expect(entries).toHaveLength(keys.length + articles.length);
    expect(new Set(entries.map((e) => e.key)).size).toBe(entries.length);
    for (const e of entries) expect(e.key).toMatch(/^[a-z0-9-]+$/);
  });
});

describe("legal pages", () => {
  it("stay unpublished while required values are missing", () => {
    for (const d of legalDocs) {
      const missing = legalMissing(d.doc);
      expect(legalPublished(d.doc), d.doc).toBe(missing.length === 0);
    }
    expect(publishedLegalDocs().map((d) => d.path)).toEqual(legalDocs.filter((d) => legalPublished(d.doc)).map((d) => d.path));
  });

  it("are not in the sitemap list until published", () => {
    const paths = publicRoutes().map((r) => r.path);
    for (const d of legalDocs) expect(paths.includes(d.path), d.path).toBe(legalPublished(d.doc));
  });

  it("cancellation rules are not invented: the tiers are empty until the owner decides", () => {
    // 사장님이 취소 규정을 정하면 src/content/legal.ts에 넣고 이 기대값을 지운다.
    if (!legalPublished("cancellation")) expect(legalMissing("cancellation").length).toBeGreaterThan(0);
  });
});

describe("search engine verification", () => {
  it("adds nothing to <head> while the codes are empty", () => {
    const { google, bing, naver } = site.verification;
    const meta = verificationMetadata() ?? {};
    if (!google) expect(meta).not.toHaveProperty("google");
    if (!bing && !naver) expect(meta).not.toHaveProperty("other");
  });
});

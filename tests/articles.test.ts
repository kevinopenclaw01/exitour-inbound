import { describe, expect, it } from "vitest";
import { airportTransfer } from "@/content/airportTransfer";
import { articles } from "@/content/articles";
import { services } from "@/content/services";

// 안내 글 데이터가 깨지지 않았는지: slug 중복, 관련 서비스 id, 짧은 답 상자, 표의 열 수.

const serviceIds = new Set(services.map((s) => s.id));

describe("articles", () => {
  it("have unique slugs that are safe for URLs", () => {
    const slugs = articles.map((a) => a.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) expect(slug).toMatch(/^[a-z0-9-]+$/);
  });

  it("point only to existing services", () => {
    for (const a of articles) {
      expect(a.related.length, a.slug).toBeGreaterThan(0);
      for (const id of a.related) expect(serviceIds.has(id), `${a.slug} → ${id}`).toBe(true);
    }
  });

  it("have a short answer, at least one section and one FAQ", () => {
    for (const a of articles) {
      expect(a.answer.length, a.slug).toBeGreaterThan(120);
      expect(a.sections.length, a.slug).toBeGreaterThan(0);
      expect(a.faqs.length, a.slug).toBeGreaterThan(0);
      expect(a.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("tables have the same number of cells in every row", () => {
    for (const a of articles) {
      for (const s of a.sections) {
        if (!s.table) continue;
        for (const row of s.table.rows) expect(row.length, `${a.slug}: ${s.heading}`).toBe(s.table.head.length);
      }
    }
  });
});

describe("airport transfer page data", () => {
  it("has steps, FAQs and a consistent airports table", () => {
    expect(airportTransfer.steps.length).toBe(4);
    expect(airportTransfer.faqs.length).toBeGreaterThan(3);
    for (const row of airportTransfer.airports.rows) expect(row.length).toBe(airportTransfer.airports.head.length);
  });
});

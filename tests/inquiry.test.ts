import { describe, expect, it } from "vitest";
import { inquiryMessage, validateInquiry, whatsappLink, type Inquiry } from "@/lib/inquiry";

const ok: Inquiry = {
  service: "driver-guide",
  startDate: "2026-12-05",
  days: 2,
  groupSize: 5,
  language: "Thai",
  pickup: "Myeongdong",
  interests: "Nami Island",
  name: "Somchai",
  contact: "+66 81 234 5678",
  heardFrom: "",
};

describe("validateInquiry", () => {
  it("accepts a complete request", () => {
    expect(validateInquiry(ok, "2026-10-24")).toEqual({});
  });
  it("rejects past dates and bad numbers", () => {
    const e = validateInquiry({ ...ok, startDate: "2026-10-01", days: 0, groupSize: 99 }, "2026-10-24");
    expect(Object.keys(e).sort()).toEqual(["days", "groupSize", "startDate"]);
  });
  it("requires name and contact", () => {
    const e = validateInquiry({ ...ok, name: " ", contact: "ab" }, "2026-10-24");
    expect(e.name).toBeDefined();
    expect(e.contact).toBeDefined();
  });
});

describe("inquiryMessage", () => {
  it("includes the service label and skips empty optional fields", () => {
    const msg = inquiryMessage({ ...ok, pickup: "", interests: "" });
    expect(msg).toContain("Private car & licensed guide");
    expect(msg).toContain("(2 days)");
    expect(msg).not.toContain("Pick-up");
  });
  it("builds an encoded WhatsApp link with digits only", () => {
    expect(whatsappLink("+82 10-1234-5678", "Hi there")).toBe("https://wa.me/821012345678?text=Hi%20there");
  });
});

import { inquiryRow, parseInquiry, referenceCode } from "@/lib/inquiry";

describe("API helpers", () => {
  it("parses unknown input safely", () => {
    const parsed = parseInquiry({ days: "3", name: 5, service: "driver-guide" });
    expect(Number.isNaN(parsed.days)).toBe(true);
    expect(parsed.name).toBe("");
    expect(Object.keys(validateInquiry(parsed, "2026-10-24"))).toContain("days");
  });
  it("rejects an unknown heard-from value", () => {
    expect(validateInquiry({ ...ok, heardFrom: "<script>" }, "2026-10-24").heardFrom).toBeDefined();
  });
  it("maps to the database row with trimmed values", () => {
    const row = inquiryRow({ ...ok, name: "  Somchai ", heardFrom: "YouTube" }, "abc", "https://x".repeat(100));
    expect(row.name).toBe("Somchai");
    expect(row.group_size).toBe(5);
    expect(row.heard_from).toBe("YouTube");
    expect(row.source_page.length).toBe(200);
  });
  it("makes a short uppercase reference", () => {
    expect(referenceCode("1b7478ee-c1c2-4d04-a98b-77e6f358da5f")).toBe("1B7478EE");
  });
});

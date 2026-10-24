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

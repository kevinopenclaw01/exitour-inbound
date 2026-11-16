import { describe, expect, it } from "vitest";
import { bookingMessage, bookingQuote, bookingRow, parseBooking, validateBooking, type Booking } from "@/lib/booking";

const today = "2026-11-16";
const ok: Booking = {
  service: "driver-guide",
  region: "seoul",
  startDate: "2026-12-05",
  days: 2,
  groupSize: 4,
  language: "English",
  pickup: "Lotte Hotel Seoul",
  interests: "",
  name: "Sample Guest",
  contactMethod: "whatsapp",
  contact: "+63 917 123 4567",
  heardFrom: "",
};

describe("booking (/book)", () => {
  it("accepts a complete booking", () => {
    expect(validateBooking(ok, today)).toEqual({});
  });

  it("limits a booking to the two products, two areas, 7 passengers and 14 days", () => {
    expect(validateBooking({ ...ok, service: "" }, today).service).toBeDefined();
    expect(validateBooking({ ...ok, region: "" }, today).region).toBeDefined();
    expect(validateBooking({ ...ok, groupSize: 8 }, today).groupSize).toBeDefined();
    expect(validateBooking({ ...ok, days: 15 }, today).days).toBeDefined();
    expect(validateBooking({ ...ok, pickup: "" }, today).pickup).toBeDefined();
    expect(validateBooking({ ...ok, startDate: "2026-11-01" }, today).startDate).toBeDefined();
  });

  it("prices the booking on the server from the price table, not from the browser", () => {
    const parsed = parseBooking({ ...ok, totalKrw: 1, service: "driver-guide", region: "gyeonggi", days: 3 });
    const quote = bookingQuote(parsed)!;
    expect(quote.totalKrw).toBe(480000 * 3);
    const row = bookingRow(parsed, quote, "00000000-0000-0000-0000-000000000000", "https://entour.kr/book");
    expect(row).toMatchObject({ kind: "booking", service: "driver-guide", region: "gyeonggi", price_krw: 1440000 });
    expect(row).not.toHaveProperty("totalKrw");
  });

  it("rejects unknown products and areas when parsing", () => {
    const parsed = parseBooking({ ...ok, service: "guide-tour", region: "busan" });
    expect(parsed.service).toBe("");
    expect(parsed.region).toBe("");
    expect(bookingQuote(parsed)).toBeNull();
  });

  it("writes the booking for the owner with the total", () => {
    const text = bookingMessage(ok, bookingQuote(ok)!, "ABCD1234");
    expect(text).toContain("Booking ABCD1234");
    expect(text).toContain("₩430,000 × 2 = ₩860,000");
    expect(text).toContain("Reply by: WhatsApp +63 917 123 4567");
  });
});

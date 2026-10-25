import { describe, expect, it } from "vitest";
import { addMonths, calendarDays, formatLongDate, monthLabel, todayKst } from "@/lib/dates";

describe("dates", () => {
  it("uses Korea time for today", () => {
    expect(todayKst(new Date("2026-10-25T16:00:00Z"))).toBe("2026-10-26");
    expect(todayKst(new Date("2026-10-25T14:59:00Z"))).toBe("2026-10-25");
  });
  it("moves across years", () => {
    expect(addMonths("2026-12", 1)).toBe("2027-01");
    expect(addMonths("2027-01", -1)).toBe("2026-12");
  });
  it("labels months and dates in English", () => {
    expect(monthLabel("2026-10")).toBe("October 2026");
    expect(formatLongDate("2026-12-05")).toBe("Saturday, 5 December 2026");
  });
  it("starts the grid on the right weekday and handles leap years", () => {
    const oct = calendarDays("2026-10");
    expect(oct.slice(0, 5)).toEqual([null, null, null, null, "2026-10-01"]);
    expect(calendarDays("2028-02").filter(Boolean)).toHaveLength(29);
  });
});

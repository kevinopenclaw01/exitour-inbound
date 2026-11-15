// 날짜 계산(영어 표기, 시간대 영향 없음). 날짜는 "YYYY-MM-DD", 달은 "YYYY-MM" 문자열로 다룬다.

export const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"] as const;

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] as const;

const pad = (n: number) => String(n).padStart(2, "0");

function parts(date: string): [number, number, number] {
  const [y, m, d] = date.split("-").map(Number);
  return [y ?? 1970, m ?? 1, d ?? 1];
}

/** 한국 시간 기준 오늘 */
export function todayKst(now: Date = new Date()): string {
  return new Date(now.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

export function addMonths(month: string, delta: number): string {
  const [y, m] = parts(`${month}-01`);
  const index = y * 12 + (m - 1) + delta;
  return `${Math.floor(index / 12)}-${pad((index % 12) + 1)}`;
}

export function monthLabel(month: string): string {
  const [y, m] = parts(`${month}-01`);
  return `${MONTHS[m - 1]} ${y}`;
}

/** 달력 칸: 첫 주 앞의 빈칸은 null, 그다음 그 달의 날짜들 */
export function calendarDays(month: string): (string | null)[] {
  const [y, m] = parts(`${month}-01`);
  const firstWeekday = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const length = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: (string | null)[] = Array.from({ length: firstWeekday }, () => null);
  for (let d = 1; d <= length; d++) cells.push(`${month}-${pad(d)}`);
  return cells;
}

// ── 언어별 표기(날짜 고르기용). 시간대 영향이 없게 UTC로 계산한다.

/** 그 언어의 "2026년 12월" 같은 달 이름 */
export function monthLabelIn(month: string, locale: string): string {
  const [y, m] = parts(`${month}-01`);
  return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 1)));
}

/** 그 언어의 짧은 요일 이름 7개(일요일부터) */
export function weekdaysIn(locale: string): string[] {
  const f = new Intl.DateTimeFormat(locale, { weekday: "narrow", timeZone: "UTC" });
  // 2026-11-01은 일요일
  return Array.from({ length: 7 }, (_, i) => f.format(new Date(Date.UTC(2026, 10, 1 + i))));
}

/** 그 언어의 긴 날짜 */
export function formatLongDateIn(date: string, locale: string): string {
  const [y, m, d] = parts(date);
  return new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

/** "Saturday, 5 December 2026" */
export function formatLongDate(date: string): string {
  const [y, m, d] = parts(date);
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DAYS[weekday]}, ${d} ${MONTHS[m - 1]} ${y}`;
}

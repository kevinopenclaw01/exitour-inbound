import { dayProduct } from "@/content/pricing";
import type { DayPlan, DayStop } from "@/content/types";

// 10시간 하루 예시의 시각 계산. 출발 시각에 구간 시간을 더해 "about 09:20" 같은 어림 시각을 만든다.

function toMinutes(clock: string): number {
  const [h, m] = clock.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function toClock(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function planMinutes(plan: DayPlan): number {
  return plan.stops.reduce((sum, s) => sum + s.minutes, 0);
}

export function planEnd(plan: DayPlan): string {
  return toClock(toMinutes(plan.start) + planMinutes(plan));
}

/** 구간마다 시작 시각을 붙인다. */
export function planTimeline(plan: DayPlan): (DayStop & { at: string })[] {
  let now = toMinutes(plan.start);
  return plan.stops.map((stop) => {
    const at = toClock(now);
    now += stop.minutes;
    return { ...stop, at };
  });
}

/** 머무는 곳 이름만(이동·픽업 제외). 카드 요약용. */
export function planHighlights(plan: DayPlan): string[] {
  return plan.stops.filter((s) => s.kind === "visit" || s.kind === "meal").map((s) => s.title);
}

export function durationText(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

export const planHours = dayProduct.hours;

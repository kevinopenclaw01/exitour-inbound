import Link from "next/link";
import { dayPlans } from "@/content/dayPlans";
import { regionLabels } from "@/content/pricing";
import { planEnd, planHighlights, planHours } from "@/lib/dayPlans";

// 10시간 하루 예시 카드(요약). 시간표 전체는 /day-plans에 있다.

export function DayPlanCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {dayPlans.map((plan) => (
        <Link
          key={plan.slug}
          href={`/day-plans#${plan.slug}`}
          className="grid content-start gap-2 rounded-md border border-line bg-surface p-5 hover:border-sign"
        >
          <span className="text-xs font-semibold tracking-[0.12em] text-brown uppercase">
            {regionLabels[plan.region].name} · about {plan.start}–{planEnd(plan)}
          </span>
          <span className="text-lg font-bold">{plan.name}</span>
          <span className="text-muted">{plan.summary}</span>
          <span className="text-sm">{planHighlights(plan).length} stops in {planHours} hours</span>
          <span className="text-sm font-semibold text-sign underline">See the hour-by-hour plan</span>
        </Link>
      ))}
    </div>
  );
}

export function DayPlanNote() {
  return (
    <p className="text-sm text-muted">
      These are examples, not fixed tours. We change the stops, the order and the start time with you. Drive times are
      typical for a weekday; weekends and holidays take longer.
    </p>
  );
}

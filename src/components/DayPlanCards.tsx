import Link from "next/link";
import { dayPlans } from "@/content/dayPlans";
import { regionLabels } from "@/content/pricing";
import { getT } from "@/i18n/server";
import { planEnd, planHighlights, planHours } from "@/lib/dayPlans";

// 10시간 하루 예시 카드(요약). 시간표 전체는 /day-plans에 있다.

export async function DayPlanCards() {
  const t = await getT();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {dayPlans.map((plan) => (
        <Link
          key={plan.slug}
          href={t.href(`/day-plans#${plan.slug}`)}
          className="grid content-start gap-2 rounded-md border border-line bg-surface p-5 hover:border-sign"
        >
          <span className="text-xs font-semibold tracking-[0.12em] text-brown uppercase">
            {t("{region} · about {start}–{end}", { region: t(regionLabels[plan.region].name), start: plan.start, end: planEnd(plan) })}
          </span>
          <span className="text-lg font-bold">{t(plan.name)}</span>
          <span className="text-muted">{t(plan.summary)}</span>
          <span className="text-sm">{t("{stops} stops in {hours} hours", { stops: planHighlights(plan).length, hours: planHours })}</span>
          <span className="text-sm font-semibold text-sign underline">{t("See the hour-by-hour plan")}</span>
        </Link>
      ))}
    </div>
  );
}

export async function DayPlanNote() {
  const t = await getT();
  return (
    <p className="text-sm text-muted">
      {t(
        "These are examples, not fixed tours. We change the stops, the order and the start time with you. Drive times are typical for a weekday; weekends and holidays take longer.",
      )}
    </p>
  );
}

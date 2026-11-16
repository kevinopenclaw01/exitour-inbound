import Link from "next/link";
import { DayPlanNote } from "@/components/DayPlanCards";
import { PlacePhotoRow } from "@/components/Photos";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, JsonLd } from "@/components/ui";
import { dayPlans } from "@/content/dayPlans";
import { placePhotos, type PlacePhotoKey } from "@/content/photos";
import { dayProduct, regionLabels, regionOrder } from "@/content/pricing";
import { site } from "@/content/site";
import { crumbs as makeCrumbs } from "@/i18n/crumbs";
import { msg } from "@/i18n/msg";
import { getT } from "@/i18n/server";
import { durationText, planEnd, planTimeline } from "@/lib/dayPlans";
import { metadataFor } from "@/lib/meta";
import { breadcrumbLd, dayPlanListLd } from "@/lib/schema";

export const generateMetadata = metadataFor("day-plans");

const kindLabel = {
  pickup: msg("pick-up"),
  drive: msg("drive"),
  visit: msg("visit"),
  meal: msg("meal"),
  dropoff: msg("drop-off"),
} as const;

export default async function Page() {
  const t = await getT();
  const crumbs = makeCrumbs(t, [
    ["Home", "/"],
    [t("{hours}-hour day plans", { hours: dayProduct.hours }), "/day-plans"],
  ]);
  return (
    <Container className="grid max-w-4xl gap-12 py-8 sm:py-12">
      <JsonLd data={[dayPlanListLd(dayPlans, "/day-plans", t), breadcrumbLd(crumbs)]} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">
          {t("What fits in a {hours}-hour day", { hours: dayProduct.hours })}
        </h1>
        <AnswerBox updated={site.contentUpdated}>
          {t(
            "A {hours}-hour private van day from a central Seoul hotel fits four to six stops inside Seoul, or two main stops plus lunch on a Gyeonggi day trip, because the drive out and the drive back each take about one to two hours. Below are four example days for families, hour by hour. They are examples: we change the stops, the order and the start time with you.",
            { hours: dayProduct.hours },
          )}
        </AnswerBox>
        <DayPlanNote />
      </header>

      <nav aria-label={t("Example days")} className="grid gap-1 text-sm">
        {dayPlans.map((plan) => (
          <a key={plan.slug} href={`#${plan.slug}`} className="text-sign underline">
            {t(regionLabels[plan.region].name)}: {t(plan.name)}
          </a>
        ))}
      </nav>

      {regionOrder.map((region) => (
        <section key={region} className="grid gap-8">
          <h2 className="text-2xl font-bold">{t("{region} days", { region: t(regionLabels[region].name) })}</h2>
          {dayPlans
            .filter((plan) => plan.region === region)
            .map((plan) => (
              <article key={plan.slug} id={plan.slug} className="grid scroll-mt-6 gap-4 rounded-md border border-line bg-surface p-4 sm:p-6">
                <div className="grid gap-1">
                  <p className="text-xs font-semibold tracking-[0.12em] text-brown uppercase">
                    {t("{area} · about {start}–{end}", { area: t(plan.area), start: plan.start, end: planEnd(plan) })}
                  </p>
                  <h3 className="text-xl font-bold">{t(plan.name)}</h3>
                  <p className="text-muted">{t(plan.summary)}</p>
                </div>
                <PlacePhotoRow keys={(plan.photos ?? []).filter((key): key is PlacePhotoKey => key in placePhotos)} />
                <ol className="grid">
                  {planTimeline(plan).map((stop, i) => (
                    <li
                      key={`${stop.at}-${i}`}
                      className={`grid grid-cols-[5.4rem_1fr] gap-x-3 border-t border-line py-2.5 text-sm ${stop.kind === "drive" ? "text-muted" : ""}`}
                    >
                      <span className="tabular-nums">{t("about {time}", { time: stop.at })}</span>
                      <span>
                        <span className={stop.kind === "drive" ? "" : "font-semibold"}>{t(stop.title)}</span>
                        {stop.minutes > 0 ? (
                          <span className="text-muted">
                            {" "}
                            ·{" "}
                            {t("{kind}, about {duration}", { kind: t(kindLabel[stop.kind]), duration: durationText(stop.minutes, t) })}
                          </span>
                        ) : null}
                        {stop.note ? <span className="mt-0.5 block text-muted">{t(stop.note)}</span> : null}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="rounded bg-paper p-3 text-sm">
                  <p className="font-semibold">{t("Good to know")}</p>
                  <BulletList items={t.obj(plan.goodToKnow)} />
                </div>
              </article>
            ))}
        </section>
      ))}

      <section className="grid gap-2">
        <h2 className="text-2xl font-bold">{t("Driver only or driver-guide?")}</h2>
        <p>
          {t.rich(
            "The same day works both ways. With a <driver>driver only</driver>, the driver takes you to each entrance and waits while you visit on your own. With a <guide>driver-guide</guide>, a licensed tourist guide in your language comes into each place with you.",
            {
              driver: (chunk) => (
                <Link href={t.href("/private-driver")} className="text-sign underline">
                  {chunk}
                </Link>
              ),
              guide: (chunk) => (
                <Link href={t.href("/driver-guide")} className="text-sign underline">
                  {chunk}
                </Link>
              ),
            },
          )}
        </p>
        <p className="text-sm">
          <Link href={t.href("/prices")} className="text-sign underline">
            {t("See prices and what each one includes")}
          </Link>
        </p>
      </section>

      <CtaBand
        title={msg("Make one of these yours")}
        text={msg("Tell us your dates, who is travelling and which day you like. We adjust it with you.")}
      />
    </Container>
  );
}

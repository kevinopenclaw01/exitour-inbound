import type { Metadata } from "next";
import Link from "next/link";
import { DayPlanNote } from "@/components/DayPlanCards";
import { AnswerBox, Breadcrumbs, BulletList, Container, CtaBand, JsonLd } from "@/components/ui";
import { dayPlans } from "@/content/dayPlans";
import { dayProduct, regionLabels, regionOrder } from "@/content/pricing";
import { site } from "@/content/site";
import { durationText, planEnd, planTimeline } from "@/lib/dayPlans";
import { pageMetadata } from "@/lib/meta";
import { breadcrumbLd, dayPlanListLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata("day-plans");

const crumbs = [
  { name: "Home", path: "/" },
  { name: `${dayProduct.hours}-hour day plans`, path: "/day-plans" },
];

const kindLabel = { pickup: "pick-up", drive: "drive", visit: "visit", meal: "meal", dropoff: "drop-off" } as const;

export default function Page() {
  return (
    <Container className="grid max-w-4xl gap-12 py-8 sm:py-12">
      <JsonLd data={[dayPlanListLd(dayPlans, "/day-plans"), breadcrumbLd(crumbs)]} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl leading-tight sm:text-4xl">What fits in a {dayProduct.hours}-hour day</h1>
        <AnswerBox updated={site.contentUpdated}>
          A {dayProduct.hours}-hour private van day from a central Seoul hotel fits four to six stops inside Seoul, or two main
          stops plus lunch on a Gyeonggi day trip, because the drive each way takes about one to two hours. Below are four example
          days for families, hour by hour. They are examples: we change the stops, the order and the start time with you.
        </AnswerBox>
        <DayPlanNote />
      </header>

      <nav aria-label="Example days" className="grid gap-1 text-sm">
        {dayPlans.map((plan) => (
          <a key={plan.slug} href={`#${plan.slug}`} className="text-sign underline">
            {regionLabels[plan.region].name}: {plan.name}
          </a>
        ))}
      </nav>

      {regionOrder.map((region) => (
        <section key={region} className="grid gap-8">
          <h2 className="text-2xl font-bold">{regionLabels[region].name} days</h2>
          {dayPlans
            .filter((plan) => plan.region === region)
            .map((plan) => (
              <article key={plan.slug} id={plan.slug} className="grid scroll-mt-6 gap-4 rounded-md border border-line bg-surface p-4 sm:p-6">
                <div className="grid gap-1">
                  <p className="text-xs font-semibold tracking-[0.12em] text-brown uppercase">
                    {plan.area} · about {plan.start}–{planEnd(plan)}
                  </p>
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="text-muted">{plan.summary}</p>
                </div>
                <ol className="grid">
                  {planTimeline(plan).map((stop, i) => (
                    <li
                      key={`${stop.at}-${i}`}
                      className={`grid grid-cols-[5.4rem_1fr] gap-x-3 border-t border-line py-2.5 text-sm ${stop.kind === "drive" ? "text-muted" : ""}`}
                    >
                      <span className="tabular-nums">about {stop.at}</span>
                      <span>
                        <span className={stop.kind === "drive" ? "" : "font-semibold"}>{stop.title}</span>
                        {stop.minutes > 0 ? (
                          <span className="text-muted">
                            {" "}
                            · {kindLabel[stop.kind]}, about {durationText(stop.minutes)}
                          </span>
                        ) : null}
                        {stop.note ? <span className="mt-0.5 block text-muted">{stop.note}</span> : null}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="rounded bg-paper p-3 text-sm">
                  <p className="font-semibold">Good to know</p>
                  <BulletList items={plan.goodToKnow} />
                </div>
              </article>
            ))}
        </section>
      ))}

      <section className="grid gap-2">
        <h2 className="text-2xl font-bold">Driver only or driver-guide?</h2>
        <p>
          The same day works both ways. With a{" "}
          <Link href="/private-driver" className="text-sign underline">
            driver only
          </Link>
          , the driver takes you to each entrance and waits while you visit on your own. With a{" "}
          <Link href="/driver-guide" className="text-sign underline">
            driver-guide
          </Link>
          , a licensed tourist guide drives and comes into each place with you.
        </p>
        <p className="text-sm">
          <Link href="/prices" className="text-sign underline">
            See prices and what each one includes
          </Link>
        </p>
      </section>

      <CtaBand title="Make one of these yours" text="Tell us your dates, who is travelling and which day you like. We adjust it with you." />
    </Container>
  );
}

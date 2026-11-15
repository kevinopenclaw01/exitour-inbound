import type { Metadata } from "next";
import Link from "next/link";
import { CrewSection } from "@/components/CrewSection";
import { DayPlanCards, DayPlanNote } from "@/components/DayPlanCards";
import { Hero } from "@/components/Hero";
import { ProductMatrix } from "@/components/ProductMatrix";
import { AnswerBox, BulletList, Container, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { generalFaqs } from "@/content/faqs";
import { dayProduct } from "@/content/pricing";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/meta";
import { faqLd } from "@/lib/schema";

export const metadata: Metadata = pageMetadata("home");

const steps = [
  { title: "Tell us your trip", text: "Dates, group size and what you want to see." },
  { title: "We check your date", text: "The van and the crew for your day, and for a driver-guide day, a licensed guide." },
  { title: "Confirm in writing", text: "You get the price and what it includes in writing before you pay. Nothing is booked until you confirm." },
  { title: "Meet at your hotel", text: "Your driver or driver-guide picks you up. We stay on chat the whole day." },
];

const difference: [string, string, string][] = [
  ["Private van for your group", "Yes", "Yes"],
  ["Comes inside attractions", "No, waits at the car park", "Yes"],
  ["Explains history and culture", "No", "Yes, a licensed tourist guide"],
  ["Helps with tickets and queues", "No", "Yes"],
  ["Who plans the stops", "You decide; the driver takes you there", "We plan the day with you"],
];

const readFirst = [
  { href: "/travel-guide/private-driver-korea-cost", label: "How much does a private van with a driver cost in Korea?" },
  { href: "/travel-guide/is-hiring-a-driver-legal-in-korea", label: "Can tourists legally hire a car with a driver in Korea?" },
  { href: "/travel-guide/nami-island-from-seoul", label: "How do you get from Seoul to Nami Island?" },
  { href: "/travel-guide/seoul-with-elderly-parents", label: "How do you plan Seoul for elderly parents?" },
];

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd(generalFaqs)} />

      <Hero />

      <Container className="grid gap-14 py-10 sm:py-14">
        <AnswerBox updated={site.contentUpdated}>
          {site.brand} offers two private van days in Seoul and Gyeonggi: a van with a driver only, or a van with a licensed
          tourist guide who drives. Each day is {dayProduct.hours} hours in a {dayProduct.vehicle} for up to{" "}
          {dayProduct.maxPassengers} passengers, priced per group and confirmed in writing before you pay. Other regions are
          arranged by consultation. It is operated by {site.operator}, a registered general travel agency in Korea.
        </AnswerBox>

        <section className="grid gap-4">
          <div>
            <h2 className="text-2xl font-bold">Two products, two areas</h2>
            <p className="mt-1 text-muted">Pick who comes with you and where you go. Every price is for the whole group.</p>
          </div>
          <ProductMatrix />
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-bold">Driver or driver-guide: what is the difference?</h2>
          <div className="overflow-x-auto rounded-md border border-line bg-surface">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead className="bg-paper text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5">&nbsp;</th>
                  <th scope="col" className="px-4 py-2.5">Driver only</th>
                  <th scope="col" className="px-4 py-2.5">Driver-guide</th>
                </tr>
              </thead>
              <tbody>
                {difference.map(([label, ...cells]) => (
                  <tr key={label} className="border-t border-line">
                    <th scope="row" className="px-4 py-3 font-medium">
                      {label}
                    </th>
                    {cells.map((c, idx) => (
                      <td key={idx} className="px-4 py-3 text-muted">
                        {c}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4">
          <div>
            <h2 className="text-2xl font-bold">What fits in {dayProduct.hours} hours</h2>
            <p className="mt-1 text-muted">Four example days for families: two in Seoul and two Gyeonggi day trips.</p>
          </div>
          <DayPlanCards />
          <DayPlanNote />
        </section>

        <CrewSection />

        <section className="grid gap-4">
          <h2 className="text-2xl font-bold">How booking works</h2>
          <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, i) => (
              <li key={step.title} className="grid content-start gap-1 rounded-md border border-line bg-surface p-4">
                <span className="text-sm font-bold tabular-nums text-sign">Step {i + 1}</span>
                <span className="font-semibold">{step.title}</span>
                <span className="text-sm text-muted">{step.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="grid gap-3 rounded-md border border-line bg-surface p-5 sm:grid-cols-[auto_1fr] sm:gap-6">
          <p className="font-display text-xl text-sign-deep">Licensed & safe</p>
          <div className="grid gap-2">
            <BulletList
              tone="check"
              items={[
                `Operated by ${site.operator}, a registered general travel agency`,
                "Registered rental vans with drivers provided by the rental company",
                "Every guide holds the Korean tourist guide licence",
                "No forced shopping",
              ]}
            />
            <Link href="/safety" className="font-semibold text-sign underline">
              How we keep it legal
            </Link>
          </div>
        </section>

        <section className="grid gap-2">
          <h2 className="text-xl font-bold">Read before you book</h2>
          <ul className="grid gap-1">
            {readFirst.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sign underline">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/airport-transfer" className="text-sign underline">
                Airport pick-up and drop-off at Incheon and Gimpo
              </Link>
            </li>
            <li>
              <Link href="/travel-guide" className="font-semibold text-sign underline">
                All travel guide articles
              </Link>
            </li>
          </ul>
        </section>

        <FaqList faqs={generalFaqs} />

        <CtaBand title="Where do you want to go?" text="Send your dates and ideas. We reply with the price and what it includes in writing." />
      </Container>
    </>
  );
}

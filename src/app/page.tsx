import Link from "next/link";
import { AnswerBox, BulletList, Container, CtaBand, FaqList, JsonLd } from "@/components/ui";
import { generalFaqs } from "@/content/faqs";
import { planIdeas } from "@/content/plans";
import { services } from "@/content/services";
import { site } from "@/content/site";
import { faqLd } from "@/lib/schema";

const steps = [
  { title: "Tell us your trip", text: "Dates, group size, language and what you want to see." },
  { title: "We match your crew", text: "A registered van and a licensed guide in your language, checked for your date." },
  { title: "Confirm with a deposit", text: "You get the final price in writing. The booking is confirmed when the deposit is paid." },
  { title: "Meet at your hotel", text: "Your driver or guide picks you up. We stay on chat the whole day." },
];

export default function Home() {
  return (
    <>
      <JsonLd data={faqLd(generalFaqs)} />

      <section className="border-b border-line bg-surface">
        <Container className="grid gap-6 py-10 sm:py-14">
          <p className="inline-flex w-fit items-center gap-2 rounded border-2 border-sign px-2.5 py-1 text-xs font-bold tracking-[0.1em] text-sign uppercase">
            Seoul · Gyeonggi · Incheon
          </p>
          <h1 className="max-w-3xl font-display text-4xl leading-[1.08] sm:text-5xl">
            Korea in your own van, with a licensed guide who speaks your language.
          </h1>
          <p className="max-w-2xl text-lg text-muted">
            Pick a driver, a driver-guide or a guide. We set it up legally, match the language, and plan the day with you.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/plan" className="rounded-md bg-sign px-5 py-3 font-semibold text-white hover:bg-sign-deep">
              Plan my trip
            </Link>
            <Link href="/prices" className="rounded-md border border-sign px-5 py-3 font-semibold text-sign-deep hover:bg-sign-soft">
              See prices
            </Link>
          </div>
        </Container>
      </section>

      <Container className="grid gap-14 py-10 sm:py-14">
        <AnswerBox>
          {site.brand} arranges private tours in Seoul and Gyeonggi three ways: a private van with a driver, a van with a licensed
          driver-guide, or a licensed guide on foot with a van as an option. Vans are Hyundai Staria (9 or 11 seats) or a Solati
          minibus, priced per group. It is operated by {site.operator}, a registered general travel agency in Korea.
        </AnswerBox>

        <section className="grid gap-4">
          <h2 className="text-2xl font-bold">Three ways to travel with us</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {services.map((s, i) => (
              <article key={s.id} className="grid content-start gap-3 rounded-md border border-line bg-surface p-5">
                <p className="font-display text-3xl text-sign/25" aria-hidden="true">
                  {i + 1}
                </p>
                <h3 className="text-lg font-bold">{s.name}</h3>
                <p className="text-muted">{s.tagline}</p>
                <BulletList items={s.bestFor.slice(0, 3)} />
                <Link href={s.path} className="font-semibold text-sign underline">
                  How it works and prices
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-4">
          <h2 className="text-2xl font-bold">Driver or guide: what is the difference?</h2>
          <div className="overflow-x-auto rounded-md border border-line bg-surface">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead className="bg-paper text-xs text-muted">
                <tr>
                  <th scope="col" className="px-4 py-2.5">&nbsp;</th>
                  <th scope="col" className="px-4 py-2.5">Car & driver</th>
                  <th scope="col" className="px-4 py-2.5">Car & licensed guide</th>
                  <th scope="col" className="px-4 py-2.5">Guide tour</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Private van", "Yes", "Yes", "Optional"],
                  ["Comes inside attractions", "No, waits at the car park", "Yes", "Yes"],
                  ["Explains history and culture", "No", "Yes, licensed guide", "Yes, licensed guide"],
                  ["Tickets and queues", "No", "Yes", "Yes"],
                  ["Plan made with you", "You plan", "We help", "Yes, we design it"],
                ].map(([label, ...cells]) => (
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

        <section className="grid gap-4">
          <div>
            <h2 className="text-2xl font-bold">Not the usual tour</h2>
            <p className="mt-1 text-muted">Classic sights are covered. We also plan the days people film and share.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {planIdeas.map((p) => (
              <Link
                key={p.slug}
                href={`/guide-tour#${p.slug}`}
                className="grid gap-2 rounded-md border border-line bg-surface p-5 hover:border-sign"
              >
                <span className="text-xs font-semibold tracking-[0.12em] text-brown uppercase">{p.area}</span>
                <span className="text-lg font-bold">{p.name}</span>
                <span className="text-muted">{p.summary}</span>
              </Link>
            ))}
          </div>
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

        <FaqList faqs={generalFaqs} />

        <CtaBand title="Where do you want to go?" text="Send your dates and ideas. We reply with a plan and a price." />
      </Container>
    </>
  );
}

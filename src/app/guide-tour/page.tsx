import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { BulletList } from "@/components/ui";
import { planIdeas } from "@/content/plans";
import { getService } from "@/content/services";

const service = getService("guide-tour");

export const metadata: Metadata = {
  title: "Licensed guide tours and custom trip planning in Seoul",
  description: service.answer,
  alternates: { canonical: service.path },
};

export default function Page() {
  return (
    <ServicePage service={service}>
      <section className="grid gap-4">
        <div>
          <h2 className="text-2xl font-bold">Days we can plan for you</h2>
          <p className="mt-1 text-muted">Two examples of what a planned day can look like. We shape each plan around your group.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {planIdeas.map((p) => (
            <article key={p.slug} id={p.slug} className="grid content-start gap-3 rounded-md border border-line bg-surface p-5">
              <div>
                <p className="text-xs font-semibold tracking-[0.12em] text-brown uppercase">{p.area}</p>
                <h3 className="mt-1 text-xl font-bold">{p.name}</h3>
              </div>
              <p>{p.summary}</p>
              <BulletList items={p.moments} />
              <div className="rounded bg-brown-soft p-3 text-sm">
                <p className="font-semibold">Good to know</p>
                <BulletList items={p.goodToKnow} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </ServicePage>
  );
}

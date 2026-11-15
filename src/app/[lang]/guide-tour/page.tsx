import { ServicePage } from "@/components/ServicePage";
import { BulletList } from "@/components/ui";
import { planIdeas } from "@/content/plans";
import { getService } from "@/content/services";
import { englishOnly } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";

const service = getService("guide-tour");

// 2026-11-16: 코드는 두되 숨긴 쪽. 메뉴·바닥글·사이트맵·llms.txt에 없고 noindex다(src/content/pages.ts의 index: false).
// 다시 열 때: services.ts의 listed를 true로, pages.ts의 index: false를 지우고, site.ts의 nav에 넣는다.
export const generateMetadata = metadataFor("guide-tour");

// 영어판만 있다(다른 언어 주소는 404). src/lib/meta.ts의 englishOnlyPages.
export default async function Page() {
  await englishOnly();
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

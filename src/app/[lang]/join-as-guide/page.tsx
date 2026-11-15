import { Breadcrumbs, BulletList, Container, JsonLd } from "@/components/ui";
import { site } from "@/content/site";
import { englishOnly } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";
import { breadcrumbLd } from "@/lib/schema";

// 2026-11-16: 코드는 두되 숨긴 쪽. 메뉴·바닥글·사이트맵·llms.txt에 없고 noindex다(src/content/pages.ts의 index: false).
export const generateMetadata = metadataFor("join-as-guide");

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Work with us as a guide", path: "/join-as-guide" },
];

// 영어판만 있다(다른 언어 주소는 404). src/lib/meta.ts의 englishOnlyPages.
export default async function Page() {
  await englishOnly();
  return (
    <Container className="grid max-w-3xl gap-10 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">Work with us as a licensed guide</h1>
        <p className="text-lg">
          We are building a team of licensed guides in every language our travellers speak. New licence holders are welcome.
        </p>
      </header>
      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">Who we are looking for</h2>
        <BulletList
          items={[
            "Holders of the Korean tourist guide licence (관광통역안내사), any language",
            "Driver-guides with a registered rental van arrangement",
            "Guides for Seoul walking tours and Gyeonggi day trips",
          ]}
        />
      </section>
      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">What we offer</h2>
        <BulletList
          tone="check"
          items={["Steady private bookings matched to your language and area", "Fast payment after each tour", "No forced shopping on any itinerary"]}
        />
      </section>
      <section className="grid gap-3">
        <h2 className="text-2xl font-bold">How to apply</h2>
        <p>
          {site.whatsapp
            ? `Message us on WhatsApp (${site.phone ?? site.whatsapp}) or KakaoTalk (ID ${site.kakaoId ?? "-"}) with your licence number, languages, areas and whether you drive a van.`
            : "Applications open with the launch of this site. Prepare your licence number, languages, areas and whether you drive a van."}
        </p>
      </section>
    </Container>
  );
}

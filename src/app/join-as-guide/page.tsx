import type { Metadata } from "next";
import { Breadcrumbs, BulletList, Container, JsonLd } from "@/components/ui";
import { site } from "@/content/site";
import { breadcrumbLd } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Work with us as a licensed guide",
  description: "Licensed tourist guides (관광통역안내사) and driver-guides: join the Entour Korea guide team for private tours in Seoul and Gyeonggi.",
  alternates: { canonical: "/join-as-guide" },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Work with us as a guide", path: "/join-as-guide" },
];

export default function Page() {
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
          {site.email
            ? `Email ${site.email} with your licence number, languages, areas and whether you drive a van.`
            : "Applications open with the launch of this site. Prepare your licence number, languages, areas and whether you drive a van."}
        </p>
      </section>
    </Container>
  );
}

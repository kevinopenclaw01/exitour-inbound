import Link from "next/link";
import { ServicePage } from "@/components/ServicePage";
import { getService } from "@/content/services";
import { getT } from "@/i18n/server";
import { metadataFor } from "@/lib/meta";

const service = getService("private-driver");

export const generateMetadata = metadataFor("private-driver");

export default async function Page() {
  const t = await getT();
  return (
    <ServicePage service={service}>
      <section className="grid gap-2 rounded-md border border-line bg-surface p-5 sm:grid-cols-[auto_1fr] sm:gap-6">
        <p className="font-display text-xl text-sign-deep">{t("Just the airport?")}</p>
        <div className="grid gap-2">
          <p className="text-muted">
            {t(
              "For a pick-up or drop-off at Incheon or Gimpo without a full day, see the airport transfer page: meeting at the gate, flight tracking and a price per van, quoted for your flight.",
            )}
          </p>
          <Link href={t.href("/airport-transfer")} className="font-semibold text-sign underline">
            {t("Airport pick-up and drop-off")}
          </Link>
        </div>
      </section>
    </ServicePage>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ServicePage } from "@/components/ServicePage";
import { getService } from "@/content/services";

const service = getService("private-driver");

export const metadata: Metadata = {
  title: "Private van with driver in Seoul and Gyeonggi",
  description: service.answer,
  alternates: { canonical: service.path },
};

export default function Page() {
  return (
    <ServicePage service={service}>
      <section className="grid gap-2 rounded-md border border-line bg-surface p-5 sm:grid-cols-[auto_1fr] sm:gap-6">
        <p className="font-display text-xl text-sign-deep">Just the airport?</p>
        <div className="grid gap-2">
          <p className="text-muted">
            For a pick-up or drop-off at Incheon or Gimpo without a full day, see the airport transfer page: meeting at the gate,
            flight tracking and a fixed price per van.
          </p>
          <Link href="/airport-transfer" className="font-semibold text-sign underline">
            Airport pick-up and drop-off
          </Link>
        </div>
      </section>
    </ServicePage>
  );
}

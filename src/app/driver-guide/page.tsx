import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { getService } from "@/content/services";

const service = getService("driver-guide");

export const metadata: Metadata = {
  title: "Private van with a licensed driver-guide in Korea",
  description: service.answer,
  alternates: { canonical: service.path },
};

export default function Page() {
  return <ServicePage service={service} />;
}

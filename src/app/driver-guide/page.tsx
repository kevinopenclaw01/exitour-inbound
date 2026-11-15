import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { getService } from "@/content/services";
import { pageMetadata } from "@/lib/meta";

const service = getService("driver-guide");

export const metadata: Metadata = pageMetadata("driver-guide");

export default function Page() {
  return <ServicePage service={service} />;
}

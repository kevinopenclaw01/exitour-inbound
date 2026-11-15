import { ServicePage } from "@/components/ServicePage";
import { getService } from "@/content/services";
import { metadataFor } from "@/lib/meta";

const service = getService("driver-guide");

export const generateMetadata = metadataFor("driver-guide");

export default function Page() {
  return <ServicePage service={service} />;
}

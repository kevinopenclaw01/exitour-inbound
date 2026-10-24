import type { Metadata } from "next";
import { ServicePage } from "@/components/ServicePage";
import { getService } from "@/content/services";

const service = getService("private-driver");

export const metadata: Metadata = {
  title: "Private van with driver in Seoul and Gyeonggi",
  description: service.answer,
  alternates: { canonical: service.path },
};

export default function Page() {
  return <ServicePage service={service} />;
}

import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { noindexRobots } from "@/lib/meta";

// 없는 주소. 홈의 제목·설명을 그대로 쓰면 검색엔진이 홈과 헷갈리므로 제목을 따로 두고 noindex를 건다.
export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you opened does not exist or has moved.",
  robots: noindexRobots,
};

export default function NotFound() {
  return (
    <Container className="grid gap-4 py-16">
      <h1 className="font-display text-3xl">Page not found</h1>
      <p className="text-muted">The page you opened does not exist or has moved.</p>
      <ul className="grid gap-1">
        <li>
          <Link href="/" className="font-semibold text-sign underline">
            Go to the home page
          </Link>
        </li>
        <li>
          <Link href="/prices" className="text-sign underline">
            See prices
          </Link>
        </li>
        <li>
          <Link href="/plan" className="text-sign underline">
            Send a trip request
          </Link>
        </li>
      </ul>
    </Container>
  );
}

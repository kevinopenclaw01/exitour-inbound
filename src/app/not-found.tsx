import Link from "next/link";
import { Container } from "@/components/ui";

export default function NotFound() {
  return (
    <Container className="grid gap-4 py-16">
      <h1 className="font-display text-3xl">Page not found</h1>
      <p className="text-muted">The page you opened does not exist or has moved.</p>
      <Link href="/" className="font-semibold text-sign underline">
        Go to the home page
      </Link>
    </Container>
  );
}

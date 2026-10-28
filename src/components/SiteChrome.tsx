import Link from "next/link";
import { nav, site } from "@/content/site";
import { services } from "@/content/services";
import { airportTransfer } from "@/content/airportTransfer";
import { articles } from "@/content/articles";
import { ContactList } from "./ContactList";
import { Container } from "./ui";

export function SiteHeader() {
  return (
    <header className="border-b border-line bg-surface">
      <Container className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg tracking-tight text-sign-deep">{site.brand}</span>
          <span className="text-xs text-muted">by {site.operator}</span>
        </Link>
        <nav aria-label="Main" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="text-ink/80 hover:text-sign">
              {item.label}
            </Link>
          ))}
          <Link href="/plan" className="rounded-md bg-sign px-3 py-1.5 font-semibold text-white hover:bg-sign-deep">
            Plan my trip
          </Link>
        </nav>
      </Container>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <Container className="grid gap-8 py-10 sm:grid-cols-[1.4fr_1fr_1fr]">
        <div className="grid gap-2 text-sm">
          <p className="font-display text-base text-sign-deep">{site.brand}</p>
          <p className="text-muted">{site.description}</p>
          <p className="text-muted">
            Operator: {site.operator}, {site.operatorLicense.type}
            {site.operatorLicense.number ? `, No. ${site.operatorLicense.number}` : ""}.
          </p>
          {site.address ? <p className="text-muted">{site.address}</p> : null}
          <ContactList compact />
        </div>
        <div className="grid content-start gap-1.5 text-sm">
          <p className="font-semibold">Services</p>
          {services.map((s) => (
            <Link key={s.id} href={s.path} className="text-muted hover:text-ink">
              {s.name}
            </Link>
          ))}
          <Link href={airportTransfer.path} className="text-muted hover:text-ink">
            {airportTransfer.name}
          </Link>
          <Link href="/prices" className="text-muted hover:text-ink">
            Prices
          </Link>
        </div>
        <div className="grid content-start gap-1.5 text-sm">
          <p className="font-semibold">Travel guide</p>
          {articles.map((a) => (
            <Link key={a.slug} href={`/travel-guide/${a.slug}`} className="text-muted hover:text-ink">
              {a.title}
            </Link>
          ))}
          <Link href="/safety" className="text-muted hover:text-ink">
            Licensed & safe
          </Link>
          <Link href="/faq" className="text-muted hover:text-ink">
            FAQ
          </Link>
          <Link href="/about" className="text-muted hover:text-ink">
            About us
          </Link>
          <Link href="/contact" className="text-muted hover:text-ink">
            Contact us
          </Link>
          <Link href="/join-as-guide" className="text-muted hover:text-ink">
            Work with us as a guide
          </Link>
        </div>
      </Container>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {site.launchYear} {site.operator}. {site.brand} is a brand of {site.operator}.
      </div>
    </footer>
  );
}

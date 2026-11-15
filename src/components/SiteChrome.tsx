import Link from "next/link";
import { publishedLegalDocs } from "@/content/legal";
import { nav, site } from "@/content/site";
import { ContactList } from "./ContactList";
import { MobileMenu } from "./MobileMenu";
import { Container } from "./ui";

// 머리글·바닥글. 메뉴에는 지금 파는 두 상품과 Prices·Plan·FAQ·About·Contact만 둔다(2026-11-16 "좁혀서 열기").
// 안내 글·공항 픽업·합법 안내는 메뉴에 없고 본문 링크와 사이트맵으로 이어진다.

export function SiteHeader() {
  return (
    <header className="relative border-b border-line bg-surface">
      <Container className="flex items-center justify-between gap-3 py-3">
        <Link href="/" className="flex shrink-0 items-baseline gap-2">
          <span className="font-display text-lg tracking-tight text-sign-deep">{site.brand}</span>
          <span className="text-xs text-muted">by {site.operator}</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-5">
          <nav aria-label="Main" className="hidden items-center gap-x-5 text-sm md:flex">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="text-ink/80 hover:text-sign">
                {item.label}
              </Link>
            ))}
          </nav>
          <Link href="/plan" className="rounded-md bg-sign px-3 py-2 text-sm font-semibold whitespace-nowrap text-white hover:bg-sign-deep">
            Plan my trip
          </Link>
          <MobileMenu items={[...nav, { href: "/plan", label: "Plan my trip" }]} />
        </div>
      </Container>
    </header>
  );
}

function CompanyLines() {
  const lines: string[] = [];
  if (site.representative) lines.push(`Representative: ${site.representative}`);
  if (site.businessNumber) lines.push(`Business registration No. ${site.businessNumber}`);
  if (site.mailOrderNumber) lines.push(`Mail-order sales registration No. ${site.mailOrderNumber}`);
  if (site.address) lines.push(site.address);
  if (lines.length === 0) return null;
  return (
    <p className="text-muted">
      {lines.map((line, i) => (
        <span key={line}>
          {i > 0 ? " · " : ""}
          {line}
        </span>
      ))}
    </p>
  );
}

export function SiteFooter() {
  const legalLinks = publishedLegalDocs();
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <Container className="grid gap-8 py-10 sm:grid-cols-[1.6fr_1fr_1fr]">
        <div className="grid content-start gap-2 text-sm">
          <p className="font-display text-base text-sign-deep">{site.brand}</p>
          <p className="text-muted">{site.description}</p>
          <p className="text-muted">
            Operator: {site.operator}, {site.operatorLicense.type}
            {site.operatorLicense.number ? `, No. ${site.operatorLicense.number}` : ""}.
          </p>
          <CompanyLines />
          <ContactList compact />
        </div>
        <nav aria-label="Services" className="grid content-start gap-1.5 text-sm">
          <p className="font-semibold">Services</p>
          <Link href="/private-driver" className="text-muted hover:text-ink">
            Private Driver
          </Link>
          <Link href="/driver-guide" className="text-muted hover:text-ink">
            Driver-Guide
          </Link>
          <Link href="/prices" className="text-muted hover:text-ink">
            Prices
          </Link>
          <Link href="/plan" className="text-muted hover:text-ink">
            Plan my trip
          </Link>
        </nav>
        <nav aria-label="Company" className="grid content-start gap-1.5 text-sm">
          <p className="font-semibold">Company</p>
          <Link href="/faq" className="text-muted hover:text-ink">
            FAQ
          </Link>
          <Link href="/about" className="text-muted hover:text-ink">
            About
          </Link>
          <Link href="/contact" className="text-muted hover:text-ink">
            Contact
          </Link>
          {legalLinks.map((d) => (
            <Link key={d.path} href={d.path} className="text-muted hover:text-ink">
              {d.label}
            </Link>
          ))}
        </nav>
      </Container>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {site.launchYear} {site.operator}. {site.brand} is a brand of {site.operator}.
      </div>
    </footer>
  );
}

import Link from "next/link";
import { publishedLegalDocs } from "@/content/legal";
import { nav, site } from "@/content/site";
import { isReviewLang, localeInfo, localizePath, publicLocales } from "@/i18n/config";
import { getT } from "@/i18n/server";
import type { Translator } from "@/i18n/translate";
import { ContactList } from "./ContactList";
import { LanguageMenu } from "./LanguageMenu";
import { MobileMenu } from "./MobileMenu";
import { Container } from "./ui";

// 머리글·바닥글. 메뉴에는 지금 파는 두 상품과 Prices·Plan·FAQ·About·Contact만 둔다(2026-11-16 "좁혀서 열기").
// 안내 글·공항 픽업·합법 안내는 메뉴에 없고 본문 링크와 사이트맵으로 이어진다.
// 2026-11-16: 언어 고르기(LanguageMenu)를 머리글에, 언어별 첫 화면 링크를 바닥글에 넣었다.

export async function SiteHeader() {
  const t = await getT();
  const items = nav.map((item) => ({ href: t.href(item.href), label: t(item.label) }));
  const plan = { href: t.href("/plan"), label: t("Plan my trip") };
  return (
    <header className="relative border-b border-line bg-surface">
      {isReviewLang(t.lang) ? (
        <p className="bg-brown-soft px-4 py-1.5 text-center text-xs text-brown">
          사장님 검토용 한국어판입니다. 손님에게는 보이지 않고 검색에도 나오지 않습니다(noindex).
        </p>
      ) : null}
      <Container className="flex items-center justify-between gap-3 py-3">
        <Link href={t.href("/")} className="flex shrink-0 items-baseline gap-2">
          <span className="font-display text-lg tracking-tight text-sign-deep">{site.brand}</span>
          <span className="hidden text-xs text-muted sm:inline">by {site.operator}</span>
        </Link>
        <div className="flex items-center gap-2 md:gap-4">
          <nav aria-label={t("Main")} className="hidden items-center gap-x-5 text-sm md:flex">
            {items.map((item) => (
              <Link key={item.href} href={item.href} className="text-ink/80 hover:text-sign">
                {item.label}
              </Link>
            ))}
          </nav>
          <LanguageMenu lang={t.lang} label={t("Language")} />
          <Link
            href={plan.href}
            // 휴대폰에서는 숨긴다(언어마다 글자 길이가 달라 머리글이 넘친다). 접는 메뉴 맨 아래와 첫 화면 버튼에 같은 링크가 있다.
            className="hidden rounded-md bg-sign px-3 py-2 text-sm font-semibold whitespace-nowrap text-white hover:bg-sign-deep sm:inline-block"
          >
            {plan.label}
          </Link>
          <MobileMenu items={[...items, plan]} openLabel={t("Open menu")} closeLabel={t("Close menu")} menuLabel={t("Menu")} />
        </div>
      </Container>
    </header>
  );
}

function CompanyLines({ t }: { t: Translator }) {
  const lines: string[] = [];
  if (site.representative) lines.push(t("Representative: {name}", { name: site.representative }));
  if (site.businessNumber) lines.push(t("Business registration No. {number}", { number: site.businessNumber }));
  if (site.mailOrderNumber) lines.push(t("Mail-order sales registration No. {number}", { number: site.mailOrderNumber }));
  if (site.address) lines.push(site.address);
  if (site.officePhone) lines.push(t("Office phone {number}", { number: site.officePhone }));
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

export async function SiteFooter() {
  const t = await getT();
  // 약관류는 값이 다 채워진 것만 건다(src/content/legal.ts). 2026-11-17부터 9개 언어.
  const legalLinks = publishedLegalDocs();
  const link = (path: string, label: string) => (
    <Link href={t.href(path)} className="text-muted hover:text-ink">
      {t(label)}
    </Link>
  );
  return (
    <footer className="mt-16 border-t border-line bg-surface">
      <Container className="grid gap-8 py-10 sm:grid-cols-[1.6fr_1fr_1fr]">
        <div className="grid content-start gap-2 text-sm">
          <p className="font-display text-base text-sign-deep">{site.brand}</p>
          <p className="text-muted">{t(site.description)}</p>
          <p className="text-muted">
            {site.operatorLicense.number
              ? t("Operator: {operator}, {licence}, No. {number}.", {
                  operator: site.operator,
                  licence: t(site.operatorLicense.type),
                  number: site.operatorLicense.number,
                })
              : t("Operator: {operator}, {licence}.", { operator: site.operator, licence: t(site.operatorLicense.type) })}
          </p>
          <CompanyLines t={t} />
          <ContactList compact />
        </div>
        <nav aria-label={t("Services")} className="grid content-start gap-1.5 text-sm">
          <p className="font-semibold">{t("Services")}</p>
          {link("/private-driver", "Private Driver")}
          {link("/driver-guide", "Driver-Guide")}
          {link("/prices", "Prices")}
          {link("/plan", "Plan my trip")}
          {link("/pay", "Pay with PayPal")}
        </nav>
        <nav aria-label={t("Company")} className="grid content-start gap-1.5 text-sm">
          <p className="font-semibold">{t("Company")}</p>
          {link("/faq", "FAQ")}
          {link("/about", "About")}
          {link("/contact", "Contact")}
          {legalLinks.map((d) => (
            <Link key={d.path} href={t.href(d.path)} className="text-muted hover:text-ink">
              {t(d.label)}
            </Link>
          ))}
        </nav>
      </Container>
      <nav aria-label={t("Language")} className="border-t border-line">
        <Container>
          <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 py-3 text-sm">
            {publicLocales.map((l) => (
              <li key={l}>
                <Link
                  href={localizePath("/", l)}
                  hrefLang={localeInfo[l].tag}
                  lang={localeInfo[l].tag}
                  className={l === t.lang ? "font-semibold text-sign-deep" : "text-muted hover:text-ink"}
                >
                  {localeInfo[l].name}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </nav>
      <div className="border-t border-line py-4 text-center text-xs text-muted">
        © {site.launchYear} {site.operator}. {t("{brand} is a brand of {operator}.", { brand: site.brand, operator: site.operator })}
      </div>
    </footer>
  );
}

import type { ReactNode } from "react";
import { legal, legalMissing, type LegalDoc } from "@/content/legal";
import { site } from "@/content/site";
import { getT } from "@/i18n/server";
import { breadcrumbLd } from "@/lib/schema";
import { Breadcrumbs, Container, JsonLd } from "./ui";

// 약관·개인정보처리방침·취소 환불 규정의 공통 틀. 2026-11-17부터 9개 언어(문장은 t("…")로 감싼다).
// 필요한 값(src/content/legal.ts, site.ts)이 비어 있으면 맨 위에 "Draft" 알림이 나오고, 빈칸은 [To be added]로 보인다.
// 그동안 이 쪽은 메뉴·사이트맵에 없고 noindex다.

/** 값이 있으면 그 언어로, 없으면 눈에 띄는 빈칸 표시. */
export async function Fill({ value, what }: { value: string | null | undefined; what: string }) {
  const t = await getT();
  if (value) return <>{t(value)}</>;
  return <mark className="rounded bg-brown-soft px-1 text-brown">[To be added: {what}]</mark>;
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="grid gap-2">
      <h2 className="text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

/** 운영자 정보 묶음. 세 문서가 같이 쓴다. */
export async function OperatorDetails() {
  const t = await getT();
  return (
    <dl className="grid gap-1 text-sm sm:grid-cols-[14rem_1fr]">
      <dt className="font-semibold">{t("Brand")}</dt>
      <dd>{site.brand}</dd>
      <dt className="font-semibold">{t("Operator")}</dt>
      <dd>{site.operator}</dd>
      <dt className="font-semibold">{t("Representative")}</dt>
      <dd>
        <Fill value={site.representative} what="representative's name" />
      </dd>
      <dt className="font-semibold">{t("Business registration number")}</dt>
      <dd>
        <Fill value={site.businessNumber} what="business registration number" />
      </dd>
      <dt className="font-semibold">{t("Travel agency registration")}</dt>
      <dd>
        {t(site.operatorLicense.type)}, No. <Fill value={site.operatorLicense.number} what="registration number" />
      </dd>
      {site.mailOrderNumber ? (
        <>
          <dt className="font-semibold">{t("Mail-order sales registration")}</dt>
          <dd>{site.mailOrderNumber}</dd>
        </>
      ) : null}
      <dt className="font-semibold">{t("Address")}</dt>
      <dd>
        <Fill value={site.address} what="business address" />
      </dd>
      <dt className="font-semibold">{t("Email")}</dt>
      <dd>
        <Fill value={site.email} what="email address" />
      </dd>
      {site.phone ? (
        <>
          <dt className="font-semibold">{t("Phone / WhatsApp")}</dt>
          <dd>{site.phone}</dd>
        </>
      ) : null}
    </dl>
  );
}

export async function LegalPage({ doc, title, path, children }: { doc: LegalDoc; title: string; path: string; children: ReactNode }) {
  const t = await getT();
  const crumbs = [
    { name: t("Home"), path: t.href("/") },
    { name: title, path: t.href(path) },
  ];
  const draft = legalMissing(doc).length > 0;
  return (
    <Container className="grid max-w-3xl gap-8 py-8 sm:py-12">
      <JsonLd data={breadcrumbLd(crumbs)} />
      <header className="grid gap-4">
        <Breadcrumbs items={crumbs} />
        <h1 className="font-display text-3xl sm:text-4xl">{title}</h1>
        {draft ? (
          <p role="note" className="rounded-md border border-brown/40 bg-brown-soft p-4 text-sm">
            <strong>Draft, not yet in effect.</strong> Some details on this page are still being completed and are marked
            [To be added]. Until then, the terms of each booking are the ones in your written quote.
          </p>
        ) : (
          <p className="text-sm text-muted">{t("Effective from {date}", { date: legal.effectiveDate ?? "" })}</p>
        )}
        {t.lang === "en" ? null : (
          <p className="text-sm text-muted">{t("This is a translation. If it differs from the English version, the English version applies.")}</p>
        )}
      </header>
      {children}
    </Container>
  );
}

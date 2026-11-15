import type { ReactNode } from "react";
import { legal, legalMissing, type LegalDoc } from "@/content/legal";
import { site } from "@/content/site";
import { breadcrumbLd } from "@/lib/schema";
import { Breadcrumbs, Container, JsonLd } from "./ui";

// 약관·개인정보처리방침·취소 환불 규정의 공통 틀.
// 필요한 값(src/content/legal.ts, site.ts)이 비어 있으면 맨 위에 "Draft" 알림이 나오고, 빈칸은 [To be added]로 보인다.
// 그동안 이 쪽은 메뉴·사이트맵에 없고 noindex다.

/** 값이 있으면 그대로, 없으면 눈에 띄는 빈칸 표시. */
export function Fill({ value, what }: { value: string | null | undefined; what: string }) {
  if (value) return <>{value}</>;
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
export function OperatorDetails() {
  return (
    <dl className="grid gap-1 text-sm sm:grid-cols-[14rem_1fr]">
      <dt className="font-semibold">Brand</dt>
      <dd>{site.brand}</dd>
      <dt className="font-semibold">Operator</dt>
      <dd>{site.operator}</dd>
      <dt className="font-semibold">Representative</dt>
      <dd>
        <Fill value={site.representative} what="representative's name" />
      </dd>
      <dt className="font-semibold">Business registration number</dt>
      <dd>
        <Fill value={site.businessNumber} what="business registration number" />
      </dd>
      <dt className="font-semibold">Travel agency registration</dt>
      <dd>
        {site.operatorLicense.type}, No. <Fill value={site.operatorLicense.number} what="registration number" />
      </dd>
      <dt className="font-semibold">Address</dt>
      <dd>
        <Fill value={site.address} what="business address" />
      </dd>
      <dt className="font-semibold">Email</dt>
      <dd>
        <Fill value={site.email} what="email address" />
      </dd>
      {site.phone ? (
        <>
          <dt className="font-semibold">Phone / WhatsApp</dt>
          <dd>{site.phone}</dd>
        </>
      ) : null}
    </dl>
  );
}

export function LegalPage({ doc, title, path, children }: { doc: LegalDoc; title: string; path: string; children: ReactNode }) {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: title, path },
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
          <p className="text-sm text-muted">Effective from {legal.effectiveDate}</p>
        )}
      </header>
      {children}
    </Container>
  );
}

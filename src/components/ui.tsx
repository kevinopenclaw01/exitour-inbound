import Link from "next/link";
import type { ReactNode } from "react";
import { serializeLd } from "@/lib/schema";
import type { Faq } from "@/content/types";

export function JsonLd({ data }: { data: Record<string, unknown> | null | (Record<string, unknown> | null)[] }) {
  const items = (Array.isArray(data) ? data : [data]).filter((d): d is Record<string, unknown> => d !== null);
  if (items.length === 0) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeLd(items.length === 1 ? items[0]! : items) }}
    />
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-5xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold tracking-[0.12em] text-sign uppercase">{children}</p>;
}

/** 페이지 맨 위 "바로 답" 상자. AI·사람 모두 이 문단만 읽어도 답을 얻게 한다. */
export function AnswerBox({ children, updated }: { children: ReactNode; updated?: string }) {
  return (
    <div className="rounded-md border border-sign/30 bg-sign-soft p-4 sm:p-5">
      <p className="text-xs font-semibold tracking-[0.12em] text-sign-deep uppercase">Short answer</p>
      <p className="mt-1 text-[1.05rem] leading-relaxed">{children}</p>
      {updated ? <p className="mt-2 text-xs text-muted">Last updated {updated}</p> : null}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted">
      <ol className="flex flex-wrap gap-1">
        {items.map((item, i) => (
          <li key={item.path} className="flex gap-1">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {i < items.length - 1 ? (
              <Link href={item.path} className="hover:text-ink hover:underline">
                {item.name}
              </Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function FaqList({ faqs, title = "Questions travellers ask" }: { faqs: Faq[]; title?: string }) {
  return (
    <section className="grid gap-4">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="divide-y divide-line rounded-md border border-line bg-surface">
        {faqs.map((f) => (
          <div key={f.q} className="p-4 sm:p-5">
            <h3 className="font-semibold">{f.q}</h3>
            <p className="mt-1 text-muted">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function BulletList({ items, tone = "plain" }: { items: string[]; tone?: "plain" | "check" | "cross" }) {
  const mark = tone === "check" ? "✓" : tone === "cross" ? "–" : "•";
  return (
    <ul className="grid gap-1.5">
      {items.map((item) => (
        <li key={item} className="grid grid-cols-[1.1rem_1fr] gap-1">
          <span aria-hidden="true" className={tone === "check" ? "text-sign" : "text-muted"}>
            {mark}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function CtaBand({ title, text }: { title: string; text: string }) {
  return (
    <section className="rounded-lg bg-sign px-5 py-8 text-white sm:px-8">
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="mt-1 text-white/85">{text}</p>
        </div>
        <Link
          href="/plan"
          className="inline-flex justify-center rounded-md bg-white px-5 py-3 font-semibold text-sign-deep hover:bg-sign-soft"
        >
          Send a trip request
        </Link>
      </div>
    </section>
  );
}

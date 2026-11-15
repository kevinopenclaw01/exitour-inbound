"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// 휴대폰 머리글의 접는 메뉴. 머리글이 한 줄로 유지되게 한다(예전에는 메뉴가 줄바꿈되어 3줄이었다 — docs/09 Q4).
// 화면이 넓으면(md 이상) 이 버튼은 숨고 SiteHeader의 가로 메뉴가 보인다.

export function MobileMenu({
  items,
  openLabel,
  closeLabel,
  menuLabel,
}: {
  items: readonly { href: string; label: string }[];
  openLabel: string;
  closeLabel: string;
  menuLabel: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="grid h-10 w-10 place-items-center rounded-md border border-line text-ink hover:border-sign"
      >
        <span className="sr-only">{open ? closeLabel : openLabel}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          {open ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
        </svg>
      </button>
      {open ? (
        <nav id="mobile-menu" aria-label={menuLabel} className="absolute inset-x-0 top-full z-20 border-b border-line bg-surface shadow-sm">
          <ul className="mx-auto grid w-full max-w-5xl px-4 py-2 sm:px-6">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block border-b border-line/60 py-3 font-medium last:border-b-0">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

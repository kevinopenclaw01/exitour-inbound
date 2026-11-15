"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localeInfo, localizePath, locales, splitLang, type Lang } from "@/i18n/config";

// 머리글의 언어 고르기. 지금 보고 있는 쪽의 다른 언어 주소로 보낸다(/prices → /zh/prices).
// 검색엔진에는 쪽마다 <link rel="alternate" hreflang>로 따로 알린다(src/lib/meta.ts).

export function LanguageMenu({ lang, label }: { lang: Lang; label: string }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  const { path } = splitLang(usePathname() ?? "/");

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrap} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="language-menu"
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 items-center gap-1.5 rounded-md border border-line px-2.5 text-sm text-ink hover:border-sign"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9s1.3-6.4 3.8-9z" />
        </svg>
        <span className="font-semibold uppercase">{lang}</span>
      </button>
      {open ? (
        <ul
          id="language-menu"
          className="absolute right-0 top-full z-30 mt-1 grid min-w-44 rounded-md border border-line bg-surface py-1 shadow-lg"
        >
          {locales.map((l) => (
            <li key={l}>
              <Link
                href={localizePath(path, l)}
                hrefLang={localeInfo[l].tag}
                lang={localeInfo[l].tag}
                aria-current={l === lang ? "true" : undefined}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm hover:bg-sign-soft ${l === lang ? "font-semibold text-sign-deep" : ""}`}
              >
                {localeInfo[l].name}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

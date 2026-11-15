"use client";

import { useEffect, useId, useRef, useState } from "react";
import { addMonths, calendarDays, formatLongDate, formatLongDateIn, monthLabel, monthLabelIn, WEEKDAYS, weekdaysIn } from "@/lib/dates";

// 사이트 언어로 그리는 날짜 선택기. 브라우저 기본 <input type="date">는 손님 컴퓨터 언어(예: 한국어)로 보이기 때문에 직접 그린다.
// 영어 쪽은 예전과 같은 영어 표기, 다른 언어는 Intl로 그 언어 표기(locale)를 쓴다.
// 값은 "YYYY-MM-DD" 문자열. min보다 이른 날짜는 고를 수 없다.

export function DatePicker({
  id,
  value,
  min,
  onChange,
  describedBy,
  locale = "en-GB",
  labels = {
    choose: "Choose a date",
    dialog: "Choose your first tour date",
    prev: "Previous month",
    next: "Next month",
    koreaTime: "Dates are in Korea time.",
  },
}: {
  id: string;
  value: string;
  min: string;
  onChange: (value: string) => void;
  describedBy?: string;
  locale?: string;
  labels?: { choose: string; dialog: string; prev: string; next: string; koreaTime: string };
}) {
  const english = locale.startsWith("en");
  const longDate = (d: string) => (english ? formatLongDate(d) : formatLongDateIn(d, locale));
  const monthName = (m: string) => (english ? monthLabel(m) : monthLabelIn(m, locale));
  const weekdays = english ? [...WEEKDAYS] : weekdaysIn(locale);
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => (value || min).slice(0, 7));
  const wrapRef = useRef<HTMLDivElement>(null);
  const dialogId = useId();

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const days = calendarDays(month);
  const canGoBack = month > min.slice(0, 7);

  return (
    <div ref={wrapRef} className="relative">
      <button
        id={id}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        aria-describedby={describedBy}
        onClick={() => {
          setMonth((value || min).slice(0, 7));
          setOpen((o) => !o);
        }}
        className="flex w-full items-center justify-between rounded-md border border-line bg-surface px-3 py-2 text-left text-base"
      >
        <span className={value ? "" : "text-muted"}>{value ? longDate(value) : labels.choose}</span>
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </button>

      {open ? (
        <div
          id={dialogId}
          role="dialog"
          aria-label={labels.dialog}
          className="absolute top-full left-0 z-20 mt-1 w-[19rem] max-w-[calc(100vw-2rem)] rounded-md border border-line bg-surface p-3 shadow-lg"
        >
          <div className="mb-2 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMonth((m) => addMonths(m, -1))}
              disabled={!canGoBack}
              aria-label={labels.prev}
              className="rounded px-2 py-1 text-lg hover:bg-sign-soft disabled:opacity-30"
            >
              ‹
            </button>
            <p className="font-semibold" aria-live="polite">
              {monthName(month)}
            </p>
            <button
              type="button"
              onClick={() => setMonth((m) => addMonths(m, 1))}
              aria-label={labels.next}
              className="rounded px-2 py-1 text-lg hover:bg-sign-soft"
            >
              ›
            </button>
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-xs text-muted" aria-hidden="true">
            {weekdays.map((d, i) => (
              <span key={`${d}-${i}`} className="py-1">
                {d}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5 text-center text-sm">
            {days.map((d, i) =>
              d === null ? (
                <span key={`empty-${i}`} />
              ) : (
                <button
                  key={d}
                  type="button"
                  disabled={d < min}
                  aria-label={longDate(d)}
                  aria-pressed={d === value}
                  onClick={() => {
                    onChange(d);
                    setOpen(false);
                  }}
                  className={`rounded py-1.5 tabular-nums ${
                    d === value ? "bg-sign font-semibold text-white" : d === min ? "font-semibold text-sign-deep hover:bg-sign-soft" : "hover:bg-sign-soft"
                  } disabled:cursor-not-allowed disabled:text-line disabled:hover:bg-transparent`}
                >
                  {Number(d.slice(8))}
                </button>
              ),
            )}
          </div>
          <p className="mt-2 text-xs text-muted">{labels.koreaTime}</p>
        </div>
      ) : null}
    </div>
  );
}

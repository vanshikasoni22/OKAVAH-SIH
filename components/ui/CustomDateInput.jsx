"use client";

import { useEffect, useRef, useState } from "react";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function toISO(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseISO(iso) {
  if (!iso) return null;
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

function buildGrid(year, month) {
  const startWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(startWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function CustomDateInput({ id, value, onChange, min, placeholder = "Select date" }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const today = new Date();
  const parsedValue = parseISO(value);
  const parsedMin = parseISO(min);
  const [view, setView] = useState({
    year: parsedValue?.year ?? parsedMin?.year ?? today.getFullYear(),
    month: parsedValue?.month ?? parsedMin?.month ?? today.getMonth(),
  });

  useEffect(() => {
    if (!open) return;
    function handleClick(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    }
    function handleKey(event) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function shiftMonth(delta) {
    setView((prev) => {
      let month = prev.month + delta;
      let year = prev.year;
      if (month < 0) {
        month = 11;
        year -= 1;
      } else if (month > 11) {
        month = 0;
        year += 1;
      }
      return { year, month };
    });
  }

  function isDisabled(day) {
    if (!min) return false;
    return toISO(view.year, view.month, day) < min;
  }

  function selectDay(day) {
    if (day == null || isDisabled(day)) return;
    onChange(toISO(view.year, view.month, day));
    setOpen(false);
  }

  const todayISO = toISO(today.getFullYear(), today.getMonth(), today.getDate());
  const cells = buildGrid(view.year, view.month);
  const displayLabel = value
    ? new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : placeholder;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border border-hairline bg-surface-2 px-4 py-3 text-left outline-none transition-colors focus-visible:border-accent/50 ${
          open ? "border-accent/50" : ""
        } ${value ? "font-mono text-base text-text" : "text-base text-text-muted"}`}
      >
        <span>{displayLabel}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4 shrink-0 text-accent"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <rect x="2.5" y="4" width="15" height="13" rx="2" />
          <path d="M2.5 8h15M6.5 2.5v3M13.5 2.5v3" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div className="sheen absolute left-0 top-[calc(100%+8px)] z-30 w-72 rounded-xl border border-hairline bg-surface-2 p-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => shiftMonth(-1)}
              aria-label="Previous month"
              className="rounded-full p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-accent-soft"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 4.5 6.5 10l5.5 5.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <p className="text-sm font-semibold text-text">
              {MONTHS[view.month]} {view.year}
            </p>
            <button
              type="button"
              onClick={() => shiftMonth(1)}
              aria-label="Next month"
              className="rounded-full p-1.5 text-text-muted transition-colors hover:bg-surface hover:text-accent-soft"
            >
              <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M8 4.5 13.5 10 8 15.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase tracking-wide text-text-muted">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1 font-mono">
            {cells.map((day, index) => {
              if (day == null) return <span key={`pad-${index}`} />;
              const iso = toISO(view.year, view.month, day);
              const disabled = isDisabled(day);
              const selected = iso === value;
              const isToday = iso === todayISO;
              return (
                <button
                  key={iso}
                  type="button"
                  disabled={disabled}
                  onClick={() => selectDay(day)}
                  className={`h-8 rounded-lg text-sm transition-colors ${
                    selected
                      ? "bg-accent font-semibold text-bg"
                      : disabled
                      ? "cursor-not-allowed text-text-muted/25"
                      : isToday
                      ? "border border-accent/50 text-accent-soft hover:bg-surface"
                      : "text-text-muted hover:bg-surface hover:text-text"
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

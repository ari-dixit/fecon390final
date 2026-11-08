"use client";

import { useId, useMemo, useRef, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { people } from "@/lib/dataset";
import type { Person } from "@/lib/types";

export function normalizeText(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .toLowerCase();
}

export function searchPeople(query: string, limit = 8): Person[] {
  const q = normalizeText(query.trim());
  if (!q) return [];
  const scored: [number, Person][] = [];
  for (const p of people) {
    const name = normalizeText(p.name);
    let score = -1;
    if (name.startsWith(q)) score = 0;
    else if (name.split(/\s+/).some((w) => w.startsWith(q))) score = 1;
    else if (name.includes(q)) score = 2;
    else if (normalizeText(`${p.cluster} ${p.role_context}`).includes(q)) score = 3;
    if (score >= 0) scored.push([score, p]);
  }
  return scored
    .sort((a, b) => a[0] - b[0] || a[1].name.localeCompare(b[1].name))
    .slice(0, limit)
    .map(([, p]) => p);
}

export function PersonCombobox({
  label,
  value,
  onChange,
  placeholder = "Search people…",
  hideLabel = false,
  inputRef,
  className = "",
  clearOnSelect = false,
}: {
  label: string;
  value: Person | null;
  onChange: (p: Person | null) => void;
  placeholder?: string;
  hideLabel?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  className?: string;
  clearOnSelect?: boolean;
}) {
  const id = useId();
  const listId = `${id}-list`;
  const localRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? localRef;
  const [query, setQuery] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const text = query ?? value?.name ?? "";
  const results = useMemo(() => (query ? searchPeople(query) : []), [query]);
  const expanded = open && results.length > 0;

  const select = (p: Person) => {
    onChange(p);
    setQuery(clearOnSelect ? "" : null);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <label htmlFor={id} className={hideLabel ? "sr-only" : "eyebrow mb-1.5 block"}>
        {label}
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle"
          width="14"
          height="14"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <input
          ref={ref}
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={expanded}
          aria-controls={listId}
          aria-activedescendant={expanded ? `${listId}-${active}` : undefined}
          autoComplete="off"
          spellCheck={false}
          placeholder={placeholder}
          value={text}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
            if (!e.target.value && value) onChange(null);
          }}
          onFocus={() => {
            if (query) setOpen(true);
          }}
          onBlur={() => {
            setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => Math.min(i + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(i - 1, 0));
            } else if (e.key === "Enter") {
              if (expanded && results[active]) {
                e.preventDefault();
                select(results[active]);
              }
            } else if (e.key === "Escape") {
              if (open) {
                e.stopPropagation();
                setOpen(false);
              }
              setQuery(null);
            }
          }}
          className="h-11 w-full rounded-xl border border-line-strong bg-ink-850/90 pl-9 pr-9 text-sm text-fg placeholder:text-subtle focus:border-gold/60 focus:outline-none"
        />
        {text && (
          <button
            type="button"
            aria-label={`Clear ${label}`}
            onClick={() => {
              setQuery(null);
              onChange(null);
              ref.current?.focus();
            }}
            className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-subtle hover:bg-white/5 hover:text-fg"
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        )}
      </div>
      <ul
        id={listId}
        role="listbox"
        aria-label={`${label} suggestions`}
        hidden={!expanded}
        className="scrollbar-thin absolute z-40 mt-1.5 max-h-80 w-full overflow-auto rounded-xl border border-line-strong bg-ink-850 p-1 shadow-2xl shadow-black/50"
      >
        {results.map((p, i) => (
          <li
            key={p.id}
            id={`${listId}-${i}`}
            role="option"
            aria-selected={i === active}
            onMouseDown={(e) => {
              e.preventDefault();
              select(p);
            }}
            onMouseEnter={() => setActive(i)}
            className="flex cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 aria-selected:bg-white/[0.07]"
          >
            <Avatar name={p.name} cluster={p.cluster} size="xs" />
            <span className="min-w-0">
              <span className="block truncate text-sm text-fg">{p.name}</span>
              <span className="block truncate text-xs text-subtle">{p.cluster}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

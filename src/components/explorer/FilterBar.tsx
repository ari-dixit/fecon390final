"use client";

import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/categories";
import { YEAR_MAX, YEAR_MIN } from "@/lib/periods";
import type { Filters } from "./filters";

const YEARS = Array.from({ length: YEAR_MAX - YEAR_MIN + 1 }, (_, i) => YEAR_MIN + i);

export function FilterBar({
  filters,
  onChange,
  focusMode,
  focusDepth,
  onFocusMode,
  onFocusDepth,
  focusAvailable,
}: {
  filters: Filters;
  onChange: (f: Filters) => void;
  focusMode: boolean;
  focusDepth: 1 | 2;
  onFocusMode: (v: boolean) => void;
  onFocusDepth: (d: 1 | 2) => void;
  focusAvailable: boolean;
}) {
  const toggleCategory = (c: Filters["categories"][number]) => {
    const has = filters.categories.includes(c);
    if (has && filters.categories.length === 1) return;
    onChange({
      ...filters,
      categories: has ? filters.categories.filter((x) => x !== c) : [...filters.categories, c],
    });
  };

  return (
    <div className="scrollbar-thin -mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-0.5">
      <div role="group" aria-label="Relationship types" className="flex shrink-0 items-center gap-1.5">
        {CATEGORY_ORDER.map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            aria-pressed={filters.categories.includes(c)}
            title={CATEGORY_META[c].description}
            onClick={() => toggleCategory(c)}
          >
            {CATEGORY_META[c].short}
          </button>
        ))}
      </div>

      <span className="h-5 w-px shrink-0 bg-line-strong" aria-hidden="true" />

      <button
        type="button"
        className="chip shrink-0"
        aria-pressed={filters.contextual}
        onClick={() => onChange({ ...filters, contextual: !filters.contextual })}
        title="Contextual links (path_eligible = false) are weaker associations such as lab overlap. They never count toward default degrees."
      >
        <svg width="16" height="4" aria-hidden="true">
          <line x1="0" y1="2" x2="16" y2="2" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2.5 2" />
        </svg>
        Contextual links
      </button>

      <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted">
        <span className="sr-only sm:not-sr-only">Year</span>
        <select
          value={filters.year ?? ""}
          onChange={(e) =>
            onChange({ ...filters, year: e.target.value ? Number(e.target.value) : null })
          }
          className="h-8 rounded-full border border-line-strong bg-ink-850 px-2.5 text-xs text-fg"
          aria-label="Show relationships documented in year"
        >
          <option value="">All years</option>
          {YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </label>

      {filters.year !== null && (
        <label className="flex shrink-0 items-center gap-1.5 text-xs text-muted" title="Include links documented only as a decade or ‘before X’, which may or may not cover this year.">
          <input
            type="checkbox"
            checked={filters.includeImprecise}
            onChange={(e) => onChange({ ...filters, includeImprecise: e.target.checked })}
            className="accent-[#f0c674]"
          />
          Include imprecise dates
        </label>
      )}

      <span className="h-5 w-px shrink-0 bg-line-strong" aria-hidden="true" />

      <button
        type="button"
        className="chip shrink-0"
        aria-pressed={focusMode}
        disabled={!focusAvailable && !focusMode}
        onClick={() => onFocusMode(!focusMode)}
        title="Spotlight: hide everything except the selected person’s neighbourhood (or the active story or path). Shortcut: F"
      >
        Spotlight
      </button>
      {focusMode && (
        <div role="group" aria-label="Spotlight depth" className="flex shrink-0 items-center gap-1">
          {([1, 2] as const).map((d) => (
            <button
              key={d}
              type="button"
              className="chip !px-2"
              aria-pressed={focusDepth === d}
              onClick={() => onFocusDepth(d)}
            >
              {d} {d === 1 ? "hop" : "hops"}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

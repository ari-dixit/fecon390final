import { CATEGORY_ORDER } from "@/lib/categories";
import { periodMatchesYear } from "@/lib/periods";
import type { Category, Relationship } from "@/lib/types";

export interface Filters {
  categories: Category[];
  contextual: boolean;
  year: number | null;
  includeImprecise: boolean;
}

export const DEFAULT_FILTERS: Filters = {
  categories: [...CATEGORY_ORDER],
  contextual: false,
  year: null,
  includeImprecise: false,
};

export function relPasses(r: Relationship, f: Filters): boolean {
  if (!f.categories.includes(r.category)) return false;
  if (!r.path_eligible && !f.contextual) return false;
  if (f.year !== null) {
    const m = periodMatchesYear(r.period, f.year);
    if (m === "no") return false;
    if (m === "possible" && !f.includeImprecise) return false;
  }
  return true;
}

export function filtersAreDefault(f: Filters): boolean {
  return (
    f.categories.length === DEFAULT_FILTERS.categories.length &&
    f.contextual === DEFAULT_FILTERS.contextual &&
    f.year === DEFAULT_FILTERS.year &&
    f.includeImprecise === DEFAULT_FILTERS.includeImprecise
  );
}

import type { NormalizedPeriod } from "./types";

/** Research date of the dataset; open-ended periods are capped here. */
export const RESEARCH_YEAR = 2026;
export const YEAR_MIN = 2015;
export const YEAR_MAX = RESEARCH_YEAR;

type Spec = Omit<NormalizedPeriod, "label">;

const exact = (a: number, b: number = a): Spec => ({
  certain: [a, b],
  possible: null,
  openEnded: false,
  imprecise: false,
  note: a === b ? `${a}` : `${a} through ${b}`,
});

const onward = (a: number): Spec => ({
  certain: [a, RESEARCH_YEAR],
  possible: null,
  openEnded: true,
  imprecise: false,
  note: `From ${a}; no end date is stated, so it is treated as continuing to the ${RESEARCH_YEAR} research date.`,
});

const before = (year: number): Spec => ({
  certain: null,
  possible: [null, year - 1],
  openEnded: false,
  imprecise: true,
  note: `Some time before ${year}; start year is not documented.`,
});

const decades = (a: number, b: number, label: string): Spec => ({
  certain: null,
  possible: [a, Math.min(b, RESEARCH_YEAR)],
  openEnded: false,
  imprecise: true,
  note: `Only documented as “${label}”; no specific year.`,
});

/**
 * Hand-normalised table of every `year_or_period` label in the dataset.
 * Labels are never parsed heuristically: an unknown label is a test failure.
 */
const TABLE: Record<string, Spec> = {
  "2015": exact(2015),
  "2016": exact(2016),
  "2017": exact(2017),
  "2018": exact(2018),
  "2019": exact(2019),
  "2020": exact(2020),
  "2021": exact(2021),
  "2022": exact(2022),
  "2023": exact(2023),
  "2024": exact(2024),
  "2025": exact(2025),
  "2011–2015": exact(2011, 2015),
  "2015–2017": exact(2015, 2017),
  "2015–2018": exact(2015, 2018),
  "2015–2025": exact(2015, 2025),
  "2016–2020": exact(2016, 2020),
  "2017–2022": exact(2017, 2022),
  "2017–2025": exact(2017, 2025),
  "2018–2020": exact(2018, 2020),
  "2018–2024": exact(2018, 2024),
  "2019–2023": exact(2019, 2023),
  "2021–2024": exact(2021, 2024),
  "2023–2024": exact(2023, 2024),
  "2024–2025": exact(2024, 2025),
  "2017 onward": onward(2017),
  "2021 onward": onward(2021),
  "2023 onward": onward(2023),
  "2025 onward": onward(2025),
  "before 2021": before(2021),
  "before 2022": before(2022),
  "before 2023": before(2023),
  "2010–2015+": {
    certain: [2010, 2015],
    possible: [2016, RESEARCH_YEAR],
    openEnded: false,
    imprecise: true,
    note: "Documented 2010–2015; continuation after 2015 (“+”) has no stated end.",
  },
  "2010s": decades(2010, 2019, "2010s"),
  "2020s": decades(2020, 2029, "2020s"),
  "2010s–2020s": decades(2010, 2029, "2010s–2020s"),
};

export const KNOWN_PERIOD_LABELS = Object.keys(TABLE);

export function normalizePeriod(label: string): NormalizedPeriod {
  const spec = TABLE[label];
  if (!spec) {
    return {
      label,
      certain: null,
      possible: [null, null],
      openEnded: false,
      imprecise: true,
      note: "Unrecognised period label; treated as undated.",
    };
  }
  return { label, ...spec };
}

export function isKnownPeriod(label: string): boolean {
  return label in TABLE;
}

export type YearMatch = "yes" | "possible" | "no";

/** Does a documented period intersect the given calendar year? */
export function periodMatchesYear(p: NormalizedPeriod, year: number): YearMatch {
  if (p.certain && year >= p.certain[0] && year <= p.certain[1]) return "yes";
  if (p.possible) {
    const [lo, hi] = p.possible;
    if ((lo === null || year >= lo) && (hi === null || year <= hi)) {
      return "possible";
    }
  }
  return "no";
}

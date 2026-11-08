/**
 * Onboarding entry points from the build brief. Inclusion is editorial and in
 * no particular order; it is not an influence ranking.
 */
export const SPOTLIGHT_IDS = [
  "sam-altman",
  "ilya-sutskever",
  "dario-amodei",
  "daniela-amodei",
  "demis-hassabis",
  "mustafa-suleyman",
  "mira-murati",
  "greg-brockman",
  "john-schulman",
  "geoffrey-hinton",
  "yoshua-bengio",
  "yann-lecun",
  "fei-fei-li",
  "jeff-dean",
  "noam-shazeer",
  "aidan-gomez",
  "ashish-vaswani",
  "aravind-srinivas",
  "alexandr-wang",
  "mark-zuckerberg",
  "satya-nadella",
  "jensen-huang",
  "elon-musk",
  "liang-wenfeng",
  "timnit-gebru",
] as const;

export const SPOTLIGHT = new Set<string>(SPOTLIGHT_IDS);

/**
 * Suggested starting pairs for the degrees-apart finder. Chosen to show a
 * short route, a long route, one that needs contextual links, and none at all.
 */
export const EXAMPLE_PAIRS: [string, string][] = [
  ["sam-altman", "dario-amodei"],
  ["geoffrey-hinton", "aidan-gomez"],
  ["yann-lecun", "sam-altman"],
  ["fei-fei-li", "elon-musk"],
  ["timnit-gebru", "demis-hassabis"],
];

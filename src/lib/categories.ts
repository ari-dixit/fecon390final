import type { Category } from "./types";

export const CATEGORY_ORDER: Category[] = [
  "research",
  "founding",
  "leadership",
  "governance",
  "policy",
];

export const CATEGORY_META: Record<
  Category,
  { label: string; short: string; description: string }
> = {
  research: {
    label: "Scientific research",
    short: "Research",
    description:
      "Paper coauthorship, named research programs, co-led research teams and documented academic advising.",
  },
  founding: {
    label: "Founding & cofounding",
    short: "Founding",
    description:
      "Cofounders, named founding teams and launch cohorts listed by the organization itself.",
  },
  leadership: {
    label: "Company leadership",
    short: "Leadership",
    description:
      "Executive colleagues, hires, reporting lines and lab overlaps. Many of these are contextual only.",
  },
  governance: {
    label: "Governance & boards",
    short: "Governance",
    description:
      "Shared boards and committees during the same period, plus company-level advisory roles.",
  },
  policy: {
    label: "Policy & government",
    short: "Policy",
    description:
      "Government appointments, legislative co-rapporteurs and named public policy teams.",
  },
};

/**
 * Manual mapping of every relationship `type` in the dataset to a filter
 * category. The dataset test fails if a new type appears without a mapping.
 */
export const TYPE_CATEGORY: Record<string, Category> = {
  // Scientific research
  coauthored: "research",
  research_coauthor: "research",
  research_collaboration: "research",
  joint_research_leadership: "research",
  joint_research_program: "research",
  research_succession: "research",
  coled_research_team: "research",
  phd_advisor: "research",
  academic_advisor: "research",

  // Founding & cofounding
  cofounded: "founding",
  cofounders: "founding",
  cofounder_and_return: "founding",
  founding_team: "founding",
  founding_colleagues: "founding",
  shared_launch: "founding",
  deepmind_founders: "founding",

  // Company leadership
  executive_overlap: "leadership",
  executive_colleagues: "leadership",
  executive_hire: "leadership",
  executive_reporting: "leadership",
  executive_research_relationship: "leadership",
  appointed_or_hired: "leadership",
  company_overlap: "leadership",
  company_leadership: "leadership",
  leadership_colleagues: "leadership",
  leadership_team: "leadership",
  lab_overlap: "leadership",
  lab_reorganization: "leadership",
  investment_partnership: "leadership",

  // Governance & boards
  board_colleagues: "governance",
  board_relationship: "governance",
  served_on_board_together: "governance",
  committee_colleagues: "governance",
  openai_launch_advisory: "governance",
  research_advisor: "governance",

  // Policy & government
  appointed: "policy",
  government_team: "policy",
  joint_policy_work: "policy",
  presidential_administration: "policy",
  executive_cabinet: "policy",
  co_rapporteurs: "policy",
  policy_collaboration: "policy",
};

const TYPE_LABEL_OVERRIDES: Record<string, string> = {
  phd_advisor: "PhD advisor",
  openai_launch_advisory: "OpenAI launch advisory",
  deepmind_founders: "DeepMind cofounders",
  co_rapporteurs: "Co-rapporteurs",
  coled_research_team: "Co-led research team",
  cofounded: "Cofounded",
  coauthored: "Coauthored",
  shared_launch: "Shared launch team",
  served_on_board_together: "Served on board together",
};

export function typeLabel(type: string): string {
  if (TYPE_LABEL_OVERRIDES[type]) return TYPE_LABEL_OVERRIDES[type];
  const words = type.split("_").join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

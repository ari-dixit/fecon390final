export type SourceType = "primary" | "news" | "research";

export interface Source {
  id: string;
  title: string;
  url: string;
  source_type: SourceType;
}

export interface Person {
  id: string;
  name: string;
  cluster: string;
  role_context: string;
  why_included: string;
  activity_2015_onward: string;
  source_ids: string[];
  source_urls: string[];
  featured: boolean;
  notes: string;
}

export interface RelationshipGroup {
  id: string;
  name: string;
  type: string;
  year_or_period: string;
  person_ids: string[];
  source_ids: string[];
  source_urls: string[];
  evidence_summary: string;
  path_eligible: boolean;
  notes?: string;
}

export interface RawEdge {
  id: string;
  source_person_id: string;
  target_person_id: string;
  type: string;
  year_or_period: string;
  description: string;
  source_ids: string[];
  source_urls: string[];
  path_eligible: boolean;
  context_note?: string;
  group_id?: string;
}

export interface Dataset {
  title: string;
  subtitle: string;
  as_of: string;
  period: string;
  project_context: string;
  editorial_rules: string[];
  people: Person[];
  relationship_groups: RelationshipGroup[];
  explicit_edges: RawEdge[];
  derived_group_edges: RawEdge[];
  sources: Source[];
  metrics: Record<string, number>;
}

export type Category =
  | "research"
  | "founding"
  | "governance"
  | "leadership"
  | "policy";

export interface NormalizedPeriod {
  label: string;
  /** Years the documented relationship definitely covers. */
  certain: [number, number] | null;
  /** Years it may cover but the source does not pin down. `null` bound = unbounded. */
  possible: [number | null, number | null] | null;
  /** True when the period is open-ended ("onward") and capped at the research date. */
  openEnded: boolean;
  /** True when any part of the interval is unknown or only decade-level. */
  imprecise: boolean;
  note: string;
}

/** A single documented relationship record, normalised for the UI. */
export interface Relationship extends RawEdge {
  origin: "explicit" | "group";
  category: Category;
  typeLabel: string;
  period: NormalizedPeriod;
  /** Lexicographically ordered pair key, e.g. "a|b". */
  pair: string;
}

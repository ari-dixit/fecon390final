import raw from "../../data/ai_people_network_seed.json";
import { TYPE_CATEGORY, typeLabel } from "./categories";
import { normalizePeriod } from "./periods";
import type {
  Dataset,
  Person,
  RawEdge,
  Relationship,
  RelationshipGroup,
  Source,
} from "./types";

export const dataset = raw as Dataset;

export function pairKey(a: string, b: string): string {
  return a < b ? `${a}|${b}` : `${b}|${a}`;
}

export function splitPair(key: string): [string, string] {
  const [a, b] = key.split("|");
  return [a, b];
}

export function toRelationship(
  edge: RawEdge,
  origin: Relationship["origin"],
): Relationship {
  return {
    ...edge,
    origin,
    category: TYPE_CATEGORY[edge.type] ?? "leadership",
    typeLabel: typeLabel(edge.type),
    period: normalizePeriod(edge.year_or_period),
    pair: pairKey(edge.source_person_id, edge.target_person_id),
  };
}

/**
 * All documented relationship records. Explicit edges and the pre-expanded
 * group edges are combined once; groups are never re-expanded here.
 */
export function buildRelationships(d: Dataset): Relationship[] {
  return [
    ...d.explicit_edges.map((e) => toRelationship(e, "explicit")),
    ...d.derived_group_edges.map((e) => toRelationship(e, "group")),
  ];
}

/** Every relationship record per unordered person pair, in dataset order. */
export function indexByPair(rels: Relationship[]): Map<string, Relationship[]> {
  const map = new Map<string, Relationship[]>();
  for (const r of rels) {
    const list = map.get(r.pair);
    if (list) list.push(r);
    else map.set(r.pair, [r]);
  }
  return map;
}

export const people: Person[] = [...dataset.people].sort((a, b) =>
  a.name.localeCompare(b.name),
);
export const peopleById = new Map(people.map((p) => [p.id, p]));
export const sourcesById = new Map<string, Source>(
  dataset.sources.map((s) => [s.id, s]),
);
export const groupsById = new Map<string, RelationshipGroup>(
  dataset.relationship_groups.map((g) => [g.id, g]),
);
export const relationships = buildRelationships(dataset);
export const relationshipsByPair = indexByPair(relationships);

export const clusters: string[] = Array.from(
  new Set(dataset.people.map((p) => p.cluster)),
);

export function relationshipsForPerson(id: string): Relationship[] {
  return relationships.filter(
    (r) => r.source_person_id === id || r.target_person_id === id,
  );
}

export function otherPerson(r: Relationship, id: string): string {
  return r.source_person_id === id ? r.target_person_id : r.source_person_id;
}

export function groupsForPerson(id: string): RelationshipGroup[] {
  return dataset.relationship_groups.filter((g) => g.person_ids.includes(id));
}

export function getPerson(id: string): Person {
  const p = peopleById.get(id);
  if (!p) throw new Error(`Unknown person id: ${id}`);
  return p;
}

export function sourcesFor(ids: string[]): Source[] {
  return ids
    .map((id) => sourcesById.get(id))
    .filter((s): s is Source => Boolean(s));
}

/** Distinct people connected by at least one relationship passing `filter`. */
export function neighborIds(
  id: string,
  filter: (r: Relationship) => boolean = () => true,
): string[] {
  const out = new Set<string>();
  for (const r of relationships) {
    if (!filter(r)) continue;
    if (r.source_person_id === id) out.add(r.target_person_id);
    else if (r.target_person_id === id) out.add(r.source_person_id);
  }
  return [...out];
}

export const formattedAsOf = new Date(
  `${dataset.as_of}T12:00:00Z`,
).toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

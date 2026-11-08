import { TYPE_CATEGORY } from "./categories";
import { isKnownPeriod } from "./periods";
import type { Dataset } from "./types";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Returns a list of human-readable integrity problems (empty = valid). */
export function validateDataset(d: Dataset): string[] {
  const errors: string[] = [];
  const personIds = new Set<string>();
  const sourceIds = new Set(d.sources.map((s) => s.id));
  const groupIds = new Set<string>();

  for (const p of d.people) {
    if (personIds.has(p.id)) errors.push(`Duplicate person id ${p.id}`);
    personIds.add(p.id);
    if (!SLUG.test(p.id)) errors.push(`Person id is not a lowercase slug: ${p.id}`);
    if (!p.name.trim()) errors.push(`Person ${p.id} has no name`);
    for (const s of p.source_ids) {
      if (!sourceIds.has(s)) errors.push(`Person ${p.id} cites unknown source ${s}`);
    }
  }

  if (sourceIds.size !== d.sources.length) errors.push("Duplicate source ids");
  for (const s of d.sources) {
    if (!/^https?:\/\//.test(s.url)) errors.push(`Source ${s.id} has no http(s) URL`);
  }

  for (const g of d.relationship_groups) {
    groupIds.add(g.id);
    if (!(g.type in TYPE_CATEGORY)) errors.push(`Group ${g.id} has unmapped type ${g.type}`);
    for (const pid of g.person_ids) {
      if (!personIds.has(pid)) errors.push(`Group ${g.id} references unknown person ${pid}`);
    }
    for (const s of g.source_ids) {
      if (!sourceIds.has(s)) errors.push(`Group ${g.id} cites unknown source ${s}`);
    }
  }

  const edgeIds = new Set<string>();
  const check = (kind: string, e: Dataset["explicit_edges"][number]) => {
    if (edgeIds.has(e.id)) errors.push(`Duplicate edge id ${e.id}`);
    edgeIds.add(e.id);
    for (const pid of [e.source_person_id, e.target_person_id]) {
      if (!personIds.has(pid)) errors.push(`${kind} ${e.id} references unknown person ${pid}`);
    }
    if (e.source_person_id === e.target_person_id) errors.push(`${kind} ${e.id} is a self-loop`);
    if (!e.source_ids.length) errors.push(`${kind} ${e.id} has no sources`);
    for (const s of e.source_ids) {
      if (!sourceIds.has(s)) errors.push(`${kind} ${e.id} cites unknown source ${s}`);
    }
    if (typeof e.path_eligible !== "boolean") errors.push(`${kind} ${e.id} lacks path_eligible`);
    if (!(e.type in TYPE_CATEGORY)) errors.push(`${kind} ${e.id} has unmapped type ${e.type}`);
    if (!isKnownPeriod(e.year_or_period)) {
      errors.push(`${kind} ${e.id} has un-normalised period "${e.year_or_period}"`);
    }
  };
  d.explicit_edges.forEach((e) => check("Explicit edge", e));
  d.derived_group_edges.forEach((e) => {
    check("Derived edge", e);
    if (!e.group_id || !groupIds.has(e.group_id)) {
      errors.push(`Derived edge ${e.id} references unknown group ${e.group_id}`);
    }
  });

  return errors;
}

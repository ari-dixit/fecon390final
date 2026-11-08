import type { Relationship } from "./types";

export type PathMode = "strict" | "expanded";

export type Adjacency = Map<string, string[]>;

export function relAllowedInMode(r: Relationship, mode: PathMode): boolean {
  return mode === "expanded" || r.path_eligible;
}

/**
 * Undirected, unweighted adjacency. Parallel records between the same pair
 * collapse to a single neighbour; neighbour lists are sorted for determinism.
 */
export function buildAdjacency(
  personIds: Iterable<string>,
  rels: Relationship[],
  include: (r: Relationship) => boolean,
): Adjacency {
  const sets = new Map<string, Set<string>>();
  for (const id of personIds) sets.set(id, new Set());
  for (const r of rels) {
    if (!include(r)) continue;
    const a = sets.get(r.source_person_id);
    const b = sets.get(r.target_person_id);
    if (!a || !b || r.source_person_id === r.target_person_id) continue;
    a.add(r.target_person_id);
    b.add(r.source_person_id);
  }
  const adj: Adjacency = new Map();
  for (const [id, set] of sets) adj.set(id, [...set].sort());
  return adj;
}

export interface PathResult {
  /** Person IDs from start to end inclusive, or null when unreachable. */
  path: string[] | null;
  /** Number of edges in the path (degrees of separation). */
  degrees: number | null;
  /** Count of distinct shortest routes (capped to keep numbers safe). */
  shortestRouteCount: number;
}

const COUNT_CAP = 1_000_000;

/**
 * Breadth-first shortest path. Ties are broken deterministically: the first
 * time a node is reached, its parent is the earliest-visited neighbour, and
 * neighbours are visited in sorted-ID order.
 */
export function shortestPath(
  adj: Adjacency,
  from: string,
  to: string,
): PathResult {
  if (!adj.has(from) || !adj.has(to)) {
    return { path: null, degrees: null, shortestRouteCount: 0 };
  }
  if (from === to) return { path: [from], degrees: 0, shortestRouteCount: 1 };

  const dist = new Map<string, number>([[from, 0]]);
  const count = new Map<string, number>([[from, 1]]);
  const parent = new Map<string, string>();
  const queue: string[] = [from];

  for (let i = 0; i < queue.length; i++) {
    const node = queue[i];
    const d = dist.get(node)!;
    if (dist.has(to) && d >= dist.get(to)!) break;
    for (const next of adj.get(node) ?? []) {
      if (!dist.has(next)) {
        dist.set(next, d + 1);
        count.set(next, count.get(node)!);
        parent.set(next, node);
        queue.push(next);
      } else if (dist.get(next) === d + 1) {
        count.set(next, Math.min(COUNT_CAP, count.get(next)! + count.get(node)!));
      }
    }
  }

  if (!dist.has(to)) return { path: null, degrees: null, shortestRouteCount: 0 };

  const path = [to];
  let cur = to;
  while (cur !== from) {
    cur = parent.get(cur)!;
    path.push(cur);
  }
  path.reverse();
  return {
    path,
    degrees: path.length - 1,
    shortestRouteCount: count.get(to)!,
  };
}

export function connectedComponents(adj: Adjacency): string[][] {
  const seen = new Set<string>();
  const comps: string[][] = [];
  for (const start of [...adj.keys()].sort()) {
    if (seen.has(start)) continue;
    const comp: string[] = [];
    const queue = [start];
    seen.add(start);
    for (let i = 0; i < queue.length; i++) {
      const n = queue[i];
      comp.push(n);
      for (const m of adj.get(n) ?? []) {
        if (!seen.has(m)) {
          seen.add(m);
          queue.push(m);
        }
      }
    }
    comps.push(comp);
  }
  return comps.sort((a, b) => b.length - a.length);
}

/** Nodes within `depth` hops of `start` (inclusive of start). */
export function neighborhood(
  adj: Adjacency,
  start: string,
  depth: number,
): Set<string> {
  const out = new Set([start]);
  let frontier = [start];
  for (let d = 0; d < depth; d++) {
    const next: string[] = [];
    for (const n of frontier) {
      for (const m of adj.get(n) ?? []) {
        if (!out.has(m)) {
          out.add(m);
          next.push(m);
        }
      }
    }
    frontier = next;
  }
  return out;
}

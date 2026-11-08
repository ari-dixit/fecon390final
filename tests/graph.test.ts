import { describe, expect, it } from "vitest";
import { dataset, pairKey, relationships, relationshipsByPair } from "@/lib/dataset";
import {
  buildAdjacency,
  connectedComponents,
  relAllowedInMode,
  shortestPath,
  type PathMode,
} from "@/lib/graph";
import type { Relationship } from "@/lib/types";

const ids = dataset.people.map((p) => p.id);
const adjFor = (mode: PathMode) =>
  buildAdjacency(ids, relationships, (r) => relAllowedInMode(r, mode));
const strict = adjFor("strict");
const expanded = adjFor("expanded");

function hopsAreDocumented(path: string[], mode: PathMode) {
  for (let i = 0; i < path.length - 1; i++) {
    const recs = relationshipsByPair.get(pairKey(path[i], path[i + 1])) ?? [];
    expect(recs.some((r) => relAllowedInMode(r, mode)), `${path[i]}→${path[i + 1]}`).toBe(true);
  }
}

describe("BFS on the real dataset", () => {
  it("bridges OpenAI and Anthropic in strict mode without using contextual edges", () => {
    // Altman ↔ Amodei is only a contextual (path_eligible=false) record.
    const res = shortestPath(strict, "sam-altman", "dario-amodei");
    expect(res.degrees).toBe(2);
    expect(res.path![0]).toBe("sam-altman");
    expect(res.path!.at(-1)).toBe("dario-amodei");
    hopsAreDocumented(res.path!, "strict");
  });

  it("uses the contextual edge only when expanded mode is enabled", () => {
    const res = shortestPath(expanded, "sam-altman", "dario-amodei");
    expect(res.degrees).toBe(1);
    expect(res.path).toEqual(["sam-altman", "dario-amodei"]);
  });

  it("reports equally short alternatives across the OpenAI–Anthropic bridge", () => {
    const res = shortestPath(strict, "ilya-sutskever", "daniela-amodei");
    expect(res.degrees).toBe(2);
    // Several GPT-3 coauthors who cofounded Anthropic each form a 2-hop route.
    expect(res.shortestRouteCount).toBeGreaterThan(1);
    // Deterministic tie-break: first neighbour in sorted-ID order.
    expect(res.path).toEqual(["ilya-sutskever", "ben-mann", "daniela-amodei"]);
    hopsAreDocumented(res.path!, "strict");
  });

  it("finds a path between people in different communities", () => {
    const res = shortestPath(strict, "geoffrey-hinton", "aidan-gomez");
    expect(res.degrees).not.toBeNull();
    hopsAreDocumented(res.path!, "strict");
  });

  it("is symmetric in distance", () => {
    const a = shortestPath(strict, "mira-murati", "daniela-amodei");
    const b = shortestPath(strict, "daniela-amodei", "mira-murati");
    expect(a.degrees).toBe(b.degrees);
  });

  it("returns no path for an isolated person", () => {
    for (const adj of [strict, expanded]) {
      const res = shortestPath(adj, "jensen-huang", "sam-altman");
      expect(res.path).toBeNull();
      expect(res.degrees).toBeNull();
      expect(res.shortestRouteCount).toBe(0);
    }
  });

  it("connects Sundar Pichai only through a contextual link", () => {
    expect(shortestPath(strict, "sundar-pichai", "demis-hassabis").path).toBeNull();
    expect(shortestPath(expanded, "sundar-pichai", "demis-hassabis").degrees).toBe(1);
  });

  it("returns zero degrees for the same person", () => {
    expect(shortestPath(strict, "sam-altman", "sam-altman")).toEqual({
      path: ["sam-altman"],
      degrees: 0,
      shortestRouteCount: 1,
    });
  });

  it("returns no path for unknown ids", () => {
    expect(shortestPath(strict, "nobody", "sam-altman").path).toBeNull();
  });

  it("reproduces the component structure stated in the brief", () => {
    const comps = connectedComponents(strict);
    expect(comps).toHaveLength(dataset.metrics.components_path_graph);
    expect(comps[0]).toHaveLength(dataset.metrics.largest_path_component);
    expect(comps.filter((c) => c.length === 1)).toHaveLength(dataset.metrics.isolated_people);
  });
});

function rel(a: string, b: string, eligible = true): Relationship {
  return {
    id: `${a}-${b}`,
    source_person_id: a,
    target_person_id: b,
    type: "coauthored",
    year_or_period: "2020",
    description: "",
    source_ids: ["S01"],
    source_urls: [],
    path_eligible: eligible,
    origin: "explicit",
    category: "research",
    typeLabel: "Coauthored",
    period: { label: "2020", certain: [2020, 2020], possible: null, openEnded: false, imprecise: false, note: "" },
    pair: pairKey(a, b),
  };
}

describe("BFS on synthetic graphs", () => {
  //   a — b — d
  //    \     /
  //     c ———
  const diamond = [rel("a", "b"), rel("a", "c"), rel("b", "d"), rel("c", "d")];

  it("counts equally short alternatives and picks one deterministically", () => {
    const adj = buildAdjacency(["a", "b", "c", "d"], diamond, () => true);
    const res = shortestPath(adj, "a", "d");
    expect(res.degrees).toBe(2);
    expect(res.shortestRouteCount).toBe(2);
    expect(res.path).toEqual(["a", "b", "d"]);
    // Same answer regardless of input order.
    const shuffled = buildAdjacency(["d", "c", "b", "a"], [...diamond].reverse(), () => true);
    expect(shortestPath(shuffled, "a", "d").path).toEqual(["a", "b", "d"]);
  });

  it("ignores ineligible edges in strict mode", () => {
    const edges = [rel("a", "b"), rel("b", "c", false)];
    const adj = buildAdjacency(["a", "b", "c"], edges, (r) => relAllowedInMode(r, "strict"));
    expect(shortestPath(adj, "a", "c").path).toBeNull();
    const adj2 = buildAdjacency(["a", "b", "c"], edges, (r) => relAllowedInMode(r, "expanded"));
    expect(shortestPath(adj2, "a", "c").degrees).toBe(2);
  });

  it("does not let parallel edges inflate the route count", () => {
    const edges = [rel("a", "b"), rel("b", "a"), rel("a", "b")];
    const adj = buildAdjacency(["a", "b"], edges, () => true);
    expect(shortestPath(adj, "a", "b").shortestRouteCount).toBe(1);
  });

  it("handles disconnected components", () => {
    const adj = buildAdjacency(["a", "b", "x", "y"], [rel("a", "b"), rel("x", "y")], () => true);
    expect(shortestPath(adj, "a", "y").path).toBeNull();
    expect(connectedComponents(adj)).toHaveLength(2);
  });
});

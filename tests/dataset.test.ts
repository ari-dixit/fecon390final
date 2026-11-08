import { describe, expect, it } from "vitest";
import { TYPE_CATEGORY } from "@/lib/categories";
import {
  dataset,
  indexByPair,
  pairKey,
  relationships,
  relationshipsByPair,
} from "@/lib/dataset";
import { buildAdjacency } from "@/lib/graph";
import { isKnownPeriod, normalizePeriod, periodMatchesYear } from "@/lib/periods";
import { SPOTLIGHT_IDS } from "@/content/spotlight";
import { STORIES } from "@/content/stories";
import { validateDataset } from "@/lib/validate";

describe("dataset integrity", () => {
  it("has no broken person, source or group references", () => {
    expect(validateDataset(dataset)).toEqual([]);
  });

  it("matches the counts stated in the research brief", () => {
    expect(dataset.people).toHaveLength(107);
    expect(dataset.relationship_groups).toHaveLength(37);
    expect(dataset.explicit_edges).toHaveLength(56);
    expect(dataset.derived_group_edges).toHaveLength(242);
    expect(relationships).toHaveLength(298);
    expect(relationships.filter((r) => r.path_eligible)).toHaveLength(
      dataset.metrics.path_eligible_edges,
    );
  });

  it("derived edges are exactly the pairwise expansion of each group (no double expansion)", () => {
    for (const g of dataset.relationship_groups) {
      const derived = dataset.derived_group_edges.filter((e) => g.id === e.group_id);
      const n = g.person_ids.length;
      expect(derived).toHaveLength((n * (n - 1)) / 2);
      for (const e of derived) {
        expect(g.person_ids).toContain(e.source_person_id);
        expect(g.person_ids).toContain(e.target_person_id);
        expect(e.path_eligible).toBe(g.path_eligible);
      }
    }
  });

  it("maps every relationship type to a filter category", () => {
    const types = new Set(relationships.map((r) => r.type));
    for (const t of types) expect(TYPE_CATEGORY[t], t).toBeDefined();
  });

  it("normalises every period label manually", () => {
    for (const r of relationships) {
      expect(isKnownPeriod(r.year_or_period), r.year_or_period).toBe(true);
    }
  });

  it("curated content only references real people and groups", () => {
    const ids = new Set(dataset.people.map((p) => p.id));
    const groups = new Set(dataset.relationship_groups.map((g) => g.id));
    expect(SPOTLIGHT_IDS).toHaveLength(25);
    for (const id of SPOTLIGHT_IDS) expect(ids.has(id), id).toBe(true);
    for (const s of STORIES) {
      for (const id of s.personIds) expect(ids.has(id), `${s.slug}:${id}`).toBe(true);
      for (const g of s.groupIds) expect(groups.has(g), `${s.slug}:${g}`).toBe(true);
    }
  });
});

describe("multiple relationships between one pair", () => {
  it("keeps every documented record for a pair", () => {
    const records = relationshipsByPair.get(pairKey("dario-amodei", "jared-kaplan"))!;
    expect(records.map((r) => r.id).sort()).toEqual([
      "G02-dario-amodei-jared-kaplan",
      "G28-dario-amodei-jared-kaplan",
      "G29-dario-amodei-jared-kaplan",
    ]);
  });

  it("merges explicit and group records for the same pair regardless of direction", () => {
    const records = relationshipsByPair.get(pairKey("daniela-amodei", "dario-amodei"))!;
    const origins = records.map((r) => r.origin).sort();
    expect(origins).toEqual(["explicit", "group"]);
  });

  it("pair keys are order-independent", () => {
    expect(pairKey("b", "a")).toBe(pairKey("a", "b"));
  });

  it("collapses parallel records into a single neighbour in the adjacency", () => {
    const adj = buildAdjacency(
      dataset.people.map((p) => p.id),
      relationships,
      (r) => r.path_eligible,
    );
    const n = adj.get("dario-amodei")!;
    expect(n.filter((x) => x === "jared-kaplan")).toHaveLength(1);
  });

  it("indexByPair groups reversed-direction duplicates together", () => {
    const base = relationships.find((r) => r.id === "E038")!;
    const reversed = {
      ...base,
      id: "X",
      source_person_id: base.target_person_id,
      target_person_id: base.source_person_id,
    };
    const idx = indexByPair([base, reversed]);
    expect(idx.size).toBe(1);
    expect(idx.get(base.pair)).toHaveLength(2);
  });
});

describe("period normalisation", () => {
  it("treats decade labels as possible, never certain", () => {
    const p = normalizePeriod("2020s");
    expect(p.certain).toBeNull();
    expect(periodMatchesYear(p, 2024)).toBe("possible");
    expect(periodMatchesYear(p, 2019)).toBe("no");
  });

  it("treats 'before X' as an unknown start", () => {
    const p = normalizePeriod("before 2023");
    expect(periodMatchesYear(p, 2022)).toBe("possible");
    expect(periodMatchesYear(p, 2023)).toBe("no");
  });

  it("matches exact ranges inclusively", () => {
    const p = normalizePeriod("2016–2020");
    expect(periodMatchesYear(p, 2016)).toBe("yes");
    expect(periodMatchesYear(p, 2020)).toBe("yes");
    expect(periodMatchesYear(p, 2021)).toBe("no");
  });

  it("flags unknown labels as imprecise instead of guessing", () => {
    const p = normalizePeriod("mid-2020s");
    expect(p.imprecise).toBe(true);
    expect(p.certain).toBeNull();
  });
});

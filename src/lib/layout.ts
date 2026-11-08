import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  type SimulationLinkDatum,
  type SimulationNodeDatum,
} from "d3-force";
import { CLUSTER_ORDER } from "./clusters";
import { dataset, relationshipsByPair, splitPair } from "./dataset";

export type Positions = Record<string, { x: number; y: number }>;

interface LNode extends SimulationNodeDatum {
  id: string;
  ax: number;
  ay: number;
}

interface LLink extends SimulationLinkDatum<LNode> {
  eligible: boolean;
}

const RING_RADIUS = 250;

export function clusterAnchor(cluster: string): { x: number; y: number } {
  const order = CLUSTER_ORDER as readonly string[];
  const i = Math.max(0, order.indexOf(cluster));
  const angle = (i / order.length) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(angle) * RING_RADIUS, y: Math.sin(angle) * RING_RADIUS };
}

/**
 * Deterministic force layout: nodes start on a spiral around their cluster
 * anchor, path-eligible ties pull strongly, contextual ties barely at all, so
 * position never implies a closeness the evidence doesn't support.
 */
export function computeLayout(): Positions {
  const byCluster = new Map<string, number>();
  const nodes: LNode[] = [...dataset.people]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((p) => {
      const anchor = clusterAnchor(p.cluster);
      const k = byCluster.get(p.cluster) ?? 0;
      byCluster.set(p.cluster, k + 1);
      const theta = k * 2.399963;
      const r = 10 * Math.sqrt(k + 1);
      return {
        id: p.id,
        ax: anchor.x,
        ay: anchor.y,
        x: anchor.x + Math.cos(theta) * r,
        y: anchor.y + Math.sin(theta) * r,
      };
    });

  const degree = new Map<string, number>();
  const links: LLink[] = [];
  for (const [key, rels] of relationshipsByPair) {
    const [a, b] = splitPair(key);
    const eligible = rels.some((r) => r.path_eligible);
    links.push({ source: a, target: b, eligible });
    if (eligible) {
      degree.set(a, (degree.get(a) ?? 0) + 1);
      degree.set(b, (degree.get(b) ?? 0) + 1);
    }
  }

  const sim = forceSimulation<LNode>(nodes)
    .force(
      "link",
      forceLink<LNode, LLink>(links)
        .id((d) => d.id)
        .distance((l) => (l.eligible ? 38 : 70))
        .strength((l) => {
          if (!l.eligible) return 0.015;
          const s = (l.source as LNode).id;
          const t = (l.target as LNode).id;
          return 0.7 / Math.min(degree.get(s) ?? 1, degree.get(t) ?? 1);
        }),
    )
    .force("charge", forceManyBody<LNode>().strength(-70).distanceMax(260))
    .force("x", forceX<LNode>((d) => d.ax).strength(0.075))
    .force("y", forceY<LNode>((d) => d.ay).strength(0.075))
    .force("collide", forceCollide<LNode>(11).strength(0.9))
    .stop();

  for (let i = 0; i < 600; i++) sim.tick();

  const out: Positions = {};
  for (const n of nodes) {
    out[n.id] = { x: Math.round(n.x! * 10) / 10, y: Math.round(n.y! * 10) / 10 };
  }
  return out;
}

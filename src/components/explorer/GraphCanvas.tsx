"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D, {
  type ForceGraphMethods,
  type LinkObject,
  type NodeObject,
} from "react-force-graph-2d";
import { SPOTLIGHT } from "@/content/spotlight";
import { clusterColor } from "@/lib/clusters";
import { people, relationshipsByPair, splitPair } from "@/lib/dataset";
import type { Positions } from "@/lib/layout";

interface NodeData {
  id: string;
  name: string;
  cluster: string;
  color: string;
  spotlight: boolean;
}
interface LinkData {
  id: string;
}
type GNode = NodeObject<NodeData>;
type GLink = LinkObject<NodeData, LinkData>;

export interface LinkInfo {
  visible: boolean;
  eligible: boolean;
}

export interface GraphApi {
  zoomBy(factor: number): void;
  fit(ids?: Iterable<string> | null, ms?: number): void;
  centerOn(id: string, zoom?: number): void;
}

export interface GraphCanvasProps {
  positions: Positions;
  linkInfo: Map<string, LinkInfo>;
  visibleNeighbors: Map<string, string[]>;
  emphasis: Set<string> | null;
  hiddenNodes: Set<string> | null;
  pathPairs: Set<string> | null;
  selectedId: string | null;
  selectedPair: string | null;
  cursorId: string | null;
  onNodeClick: (id: string) => void;
  onLinkClick: (pair: string) => void;
  onBackgroundClick: () => void;
  onReady: (api: GraphApi) => void;
  /** Play the zoom-in intro; off when the page opens on a deep link. */
  intro: boolean;
}

const GOLD = "#f0c674";
const endpointId = (e: GLink["source"]) =>
  typeof e === "object" && e !== null ? String(e.id) : String(e);

export default function GraphCanvas(props: GraphCanvasProps) {
  const {
    positions,
    linkInfo,
    visibleNeighbors,
    emphasis,
    hiddenNodes,
    pathPairs,
    selectedId,
    selectedPair,
    cursorId,
    onNodeClick,
    onLinkClick,
    onBackgroundClick,
    onReady,
    intro,
  } = props;

  const fgRef = useRef<ForceGraphMethods<GNode, GLink> | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(1);
  const fittedRef = useRef(false);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [hoverPair, setHoverPair] = useState<string | null>(null);
  const fontRef = useRef("sans-serif");

  const data = useMemo(() => {
    const nodes: GNode[] = people.map((p) => {
      const pos = positions[p.id] ?? { x: 0, y: 0 };
      return {
        id: p.id,
        name: p.name,
        cluster: p.cluster,
        color: clusterColor(p.cluster),
        spotlight: SPOTLIGHT.has(p.id),
        x: pos.x,
        y: pos.y,
        fx: pos.x,
        fy: pos.y,
      };
    });
    const links: GLink[] = [...relationshipsByPair.keys()].map((key) => {
      const [a, b] = splitPair(key);
      return { id: key, source: a, target: b };
    });
    return { nodes, links };
  }, [positions]);

  useEffect(() => {
    fontRef.current = getComputedStyle(document.body).fontFamily || "sans-serif";
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /** Frame a set of nodes (or everything), clamping zoom so small sets don't over-magnify. */
  const fit = useCallback(
    (ids?: Iterable<string> | null, ms = 650) => {
      const fg = fgRef.current;
      if (!fg || !size.w || !size.h) return;
      const set = ids ? new Set(ids) : null;
      const nodes = data.nodes.filter((n) => !set || set.has(String(n.id)));
      if (!nodes.length) return;
      const xs = nodes.map((n) => n.x ?? 0);
      const ys = nodes.map((n) => n.y ?? 0);
      const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
      const pad = size.w < 640 ? 36 : 80;
      const k = Math.min(
        (size.w - pad * 2) / Math.max(x1 - x0, 1),
        (size.h - pad * 2) / Math.max(y1 - y0 + 14, 1),
      );
      fg.centerAt((x0 + x1) / 2, (y0 + y1) / 2 + 4, ms);
      fg.zoom(Math.max(0.4, Math.min(set ? 3.2 : 2.4, k)), ms);
    },
    [data.nodes, size.w, size.h],
  );

  useEffect(() => {
    if (!size.w || !size.h) return;
    onReady({
      zoomBy: (f) => {
        const fg = fgRef.current;
        if (fg) fg.zoom(fg.zoom() * f, 300);
      },
      fit,
      centerOn: (id, zoom = 2.6) => {
        const fg = fgRef.current;
        const n = data.nodes.find((d) => d.id === id);
        if (!fg || !n) return;
        fg.centerAt(n.x, n.y, 600);
        if (fg.zoom() < zoom) fg.zoom(zoom, 600);
      },
    });
    if (fittedRef.current) {
      if (!selectedId && !emphasis) fit(null, 300);
    } else {
      fittedRef.current = true;
      fit(null, 0);
      if (intro) {
        // Gentle settle-in: start slightly zoomed out, ease to the fitted view.
        const fg = fgRef.current;
        if (fg) {
          const k = fg.zoom();
          fg.zoom(k * 0.8, 0);
          fg.zoom(k, 1100);
        }
      }
    }
    // Re-fit only when the canvas itself resizes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size.w, size.h]);

  // The node whose neighbourhood is lit: hover beats keyboard cursor beats selection.
  const focusId = hoverId ?? cursorId ?? selectedId;
  const active = useMemo(() => {
    if (focusId && !hiddenNodes?.has(focusId)) {
      return new Set([focusId, ...(visibleNeighbors.get(focusId) ?? [])]);
    }
    return emphasis;
  }, [focusId, hiddenNodes, visibleNeighbors, emphasis]);

  const isHidden = useCallback(
    (id: string) => (hiddenNodes ? hiddenNodes.has(id) : false),
    [hiddenNodes],
  );

  const linkVisible = useCallback(
    (l: GLink) => {
      const info = linkInfo.get(String(l.id));
      if (!info?.visible) return false;
      return !isHidden(endpointId(l.source)) && !isHidden(endpointId(l.target));
    },
    [linkInfo, isHidden],
  );

  const linkTone = useCallback(
    (l: GLink): "path" | "selected" | "touch" | "dim" | "base" => {
      const key = String(l.id);
      if (pathPairs?.has(key)) return "path";
      if (selectedPair === key || hoverPair === key) return "selected";
      const s = endpointId(l.source);
      const t = endpointId(l.target);
      const both = active ? active.has(s) && active.has(t) : false;
      if (focusId && active?.has(focusId)) {
        if (s === focusId || t === focusId) return "touch";
        return both ? "base" : "dim";
      }
      if (active) return both ? "touch" : "dim";
      if (pathPairs) return "dim";
      return "base";
    },
    [pathPairs, selectedPair, hoverPair, focusId, active],
  );

  const linkColor = useCallback(
    (l: GLink) => {
      const eligible = linkInfo.get(String(l.id))?.eligible;
      switch (linkTone(l)) {
        case "path":
          return GOLD;
        case "selected":
          return "#f6dca6";
        case "touch":
          return eligible ? "rgba(236,226,204,0.72)" : "rgba(200,210,230,0.6)";
        case "dim":
          return "rgba(130,150,190,0.05)";
        default:
          return eligible ? "rgba(150,170,210,0.26)" : "rgba(170,185,215,0.34)";
      }
    },
    [linkInfo, linkTone],
  );

  const linkWidth = useCallback(
    (l: GLink) => {
      const tone = linkTone(l);
      if (tone === "path" || tone === "selected") return 2.6;
      if (tone === "touch") return 1.4;
      return 0.8;
    },
    [linkTone],
  );

  const linkDash = useCallback(
    (l: GLink) => {
      if (linkInfo.get(String(l.id))?.eligible) return null;
      const u = 3 / zoomRef.current;
      return [u, u];
    },
    [linkInfo],
  );

  const drawNode = useCallback(
    (node: GNode, ctx: CanvasRenderingContext2D, scale: number) => {
      const id = String(node.id);
      if (isHidden(id)) return;
      const x = node.x ?? 0;
      const y = node.y ?? 0;
      const isSelected = id === selectedId;
      const isFocus = id === focusId;
      const lit = active ? active.has(id) : true;
      // Grow sub-linearly with zoom so close-ups stay legible.
      const r = (node.spotlight ? 5.6 : 3.9) / Math.pow(Math.max(scale, 1), 0.45);

      ctx.globalAlpha = lit ? 1 : 0.13;

      if (isSelected || isFocus || id === cursorId) {
        ctx.beginPath();
        ctx.arc(x, y, r + 5 / scale + 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(240,198,116,0.16)";
        ctx.fill();
        ctx.lineWidth = 1.4 / scale;
        ctx.strokeStyle = GOLD;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = node.color as string;
      ctx.fill();
      ctx.lineWidth = 1 / scale;
      ctx.strokeStyle = "rgba(6,9,15,0.9)";
      ctx.stroke();

      const showLabel =
        isSelected ||
        isFocus ||
        id === cursorId ||
        (active ? lit && (active.size <= 40 || scale > 1.3) : false) ||
        (!active && ((node.spotlight && scale > 0.55) || scale > 1.8));

      if (showLabel) {
        const px = (isSelected || isFocus ? 13 : 11.5) / scale;
        ctx.font = `${isSelected || isFocus ? 600 : 500} ${px}px ${fontRef.current}`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        const ty = y + r + 3 / scale;
        ctx.lineWidth = 3.2 / scale;
        ctx.strokeStyle = "rgba(8,12,20,0.92)";
        ctx.lineJoin = "round";
        ctx.strokeText(String(node.name), x, ty);
        ctx.fillStyle = isSelected || isFocus ? "#fbf3e2" : "rgba(233,237,244,0.92)";
        ctx.fillText(String(node.name), x, ty);
      }
      ctx.globalAlpha = 1;
    },
    [isHidden, selectedId, focusId, active, cursorId],
  );

  const paintPointer = useCallback(
    (node: GNode, color: string, ctx: CanvasRenderingContext2D, scale: number) => {
      if (isHidden(String(node.id))) return;
      const r = (node.spotlight ? 5.6 : 3.9) / Math.pow(Math.max(scale, 1), 0.45);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(node.x ?? 0, node.y ?? 0, r + 6 / scale, 0, Math.PI * 2);
      ctx.fill();
    },
    [isHidden],
  );

  const drawClusterLabels = useCallback(
    (ctx: CanvasRenderingContext2D, scale: number) => {
      zoomRef.current = scale;
      if (scale > 2.2) return;
      const alpha = Math.min(0.42, Math.max(0, (2.2 - scale) / 2.2)) * (active ? 0.4 : 1);
      if (alpha <= 0.01) return;
      const acc = new Map<string, { x: number; y: number; n: number; minY: number }>();
      for (const n of data.nodes) {
        if (isHidden(String(n.id))) continue;
        const a = acc.get(n.cluster) ?? { x: 0, y: 0, n: 0, minY: Infinity };
        a.x += n.x ?? 0;
        a.y += n.y ?? 0;
        a.n += 1;
        a.minY = Math.min(a.minY, n.y ?? 0);
        acc.set(n.cluster, a);
      }
      ctx.save();
      ctx.font = `600 ${10.5 / scale}px ${fontRef.current}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "bottom";
      for (const [cluster, a] of acc) {
        ctx.fillStyle = clusterColor(cluster);
        ctx.globalAlpha = alpha;
        ctx.fillText(cluster.toUpperCase(), a.x / a.n, a.minY - 12 / scale);
      }
      ctx.restore();
    },
    [data.nodes, isHidden, active],
  );

  return (
    <div ref={wrapRef} className="absolute inset-0">
      {size.w > 0 && (
        <ForceGraph2D<NodeData, LinkData>
          ref={fgRef}
          graphData={data}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          nodeId="id"
          nodeLabel={() => ""}
          linkLabel={() => ""}
          nodeCanvasObject={drawNode}
          nodePointerAreaPaint={paintPointer}
          nodeVisibility={(n) => !isHidden(String(n.id))}
          linkVisibility={linkVisible}
          linkColor={linkColor}
          linkWidth={linkWidth}
          linkLineDash={linkDash}
          linkHoverPrecision={6}
          cooldownTicks={0}
          enableNodeDrag={false}
          minZoom={0.35}
          maxZoom={8}
          onRenderFramePre={drawClusterLabels}
          onZoom={(t) => {
            zoomRef.current = t.k;
          }}
          onNodeHover={(n) => {
            setHoverId(n ? String(n.id) : null);
            if (n) setHoverPair(null);
          }}
          onLinkHover={(l) => setHoverPair(l ? String(l.id) : null)}
          onNodeClick={(n) => onNodeClick(String(n.id))}
          onLinkClick={(l) => onLinkClick(String(l.id))}
          onBackgroundClick={() => onBackgroundClick()}
        />
      )}
    </div>
  );
}

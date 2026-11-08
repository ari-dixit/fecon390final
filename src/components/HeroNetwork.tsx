"use client";

import { useEffect, useRef } from "react";

export interface HeroNode {
  id: string;
  x: number;
  y: number;
  color: string;
  label?: string;
  big: boolean;
}

/**
 * Decorative overview of the real network: path-eligible ties only, gently
 * drifting, with occasional pulses travelling along documented links.
 */
export function HeroNetwork({ nodes, links }: { nodes: HeroNode[]; links: [number, number][] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const font = getComputedStyle(document.body).fontFamily;
    const xs = nodes.map((n) => n.x);
    const ys = nodes.map((n) => n.y);
    const bounds = {
      x0: Math.min(...xs),
      x1: Math.max(...xs),
      y0: Math.min(...ys),
      y1: Math.max(...ys),
    };
    const phases = nodes.map((_, i) => (i * 2.399963) % (Math.PI * 2));
    const pulses: { link: number; start: number; dur: number }[] = [];
    let lastPulse = 0;
    let raf = 0;
    let visible = true;
    let w = 0;
    let h = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const project = (t: number) => {
      const pad = 26;
      const k = Math.min((w - pad * 2) / (bounds.x1 - bounds.x0), (h - pad * 2) / (bounds.y1 - bounds.y0));
      const ox = (w - (bounds.x1 - bounds.x0) * k) / 2;
      const oy = (h - (bounds.y1 - bounds.y0) * k) / 2;
      return nodes.map((n, i) => {
        const drift = reduced ? 0 : 2.2;
        return {
          x: ox + (n.x - bounds.x0) * k + Math.sin(t * 0.00035 + phases[i]) * drift,
          y: oy + (n.y - bounds.y0) * k + Math.cos(t * 0.0003 + phases[i] * 1.3) * drift,
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      const pts = project(t);

      ctx.lineWidth = 0.7;
      ctx.strokeStyle = "rgba(150,170,210,0.2)";
      ctx.beginPath();
      for (const [a, b] of links) {
        ctx.moveTo(pts[a].x, pts[a].y);
        ctx.lineTo(pts[b].x, pts[b].y);
      }
      ctx.stroke();

      if (!reduced) {
        if (t - lastPulse > 420 && links.length) {
          lastPulse = t;
          pulses.push({ link: Math.floor(Math.random() * links.length), start: t, dur: 1600 });
        }
        for (let i = pulses.length - 1; i >= 0; i--) {
          const p = pulses[i];
          const u = (t - p.start) / p.dur;
          if (u >= 1) {
            pulses.splice(i, 1);
            continue;
          }
          const [a, b] = links[p.link];
          const x = pts[a].x + (pts[b].x - pts[a].x) * u;
          const y = pts[a].y + (pts[b].y - pts[a].y) * u;
          ctx.strokeStyle = `rgba(240,198,116,${0.5 * Math.sin(u * Math.PI)})`;
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.moveTo(pts[a].x, pts[a].y);
          ctx.lineTo(pts[b].x, pts[b].y);
          ctx.stroke();
          ctx.fillStyle = `rgba(246,220,166,${Math.sin(u * Math.PI)})`;
          ctx.beginPath();
          ctx.arc(x, y, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      nodes.forEach((n, i) => {
        const { x, y } = pts[i];
        ctx.fillStyle = n.color;
        ctx.globalAlpha = 0.95;
        ctx.beginPath();
        ctx.arc(x, y, n.big ? 3.6 : 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      ctx.font = `500 11px ${font}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      nodes.forEach((n, i) => {
        if (!n.label) return;
        const { x, y } = pts[i];
        ctx.lineWidth = 3;
        ctx.strokeStyle = "rgba(10,15,24,0.9)";
        ctx.strokeText(n.label, x, y + 6);
        ctx.fillStyle = "rgba(233,237,244,0.78)";
        ctx.fillText(n.label, x, y + 6);
      });
    };

    const loop = (t: number) => {
      if (visible) draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);

    if (reduced) draw(0);
    else raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [nodes, links]);

  return <canvas ref={canvasRef} aria-hidden="true" className="h-full w-full" />;
}

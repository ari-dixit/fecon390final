"use client";

import { useState } from "react";
import { CLUSTER_COLORS, CLUSTER_ORDER } from "@/lib/clusters";

export function Legend({ defaultOpen = true }: { defaultOpen?: boolean }) {
  // On short viewports the open legend would cover much of the graph.
  const [open, setOpen] = useState(() =>
    typeof window === "undefined" ? defaultOpen : defaultOpen && window.innerHeight >= 1000,
  );
  return (
    <div className="panel max-w-[19rem] p-3 text-xs">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6"
      >
        <span className="eyebrow">Legend</span>
        <span className="text-subtle" aria-hidden="true">{open ? "–" : "+"}</span>
      </button>
      {open && (
        <div className="mt-2.5 space-y-3">
          <ul className="space-y-1.5 text-muted">
            <li className="flex items-center gap-2">
              <svg width="26" height="6" aria-hidden="true"><line x1="0" y1="3" x2="26" y2="3" stroke="rgba(236,226,204,0.8)" strokeWidth="1.6" /></svg>
              Documented tie, counts toward degrees
            </li>
            <li className="flex items-center gap-2">
              <svg width="26" height="6" aria-hidden="true"><line x1="0" y1="3" x2="26" y2="3" stroke="rgba(200,210,230,0.8)" strokeWidth="1.6" strokeDasharray="3 3" /></svg>
              Contextual link, excluded from paths
            </li>
            <li className="flex items-center gap-2">
              <svg width="26" height="12" aria-hidden="true">
                <circle cx="6" cy="6" r="5" fill="#a6b0c2" />
                <circle cx="20" cy="6" r="3.4" fill="#a6b0c2" />
              </svg>
              Larger dot = onboarding spotlight, not a ranking
            </li>
          </ul>
          <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
            {CLUSTER_ORDER.map((c) => (
              <li key={c} className="flex items-center gap-1.5 text-subtle">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: CLUSTER_COLORS[c] }} />
                <span className="truncate">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

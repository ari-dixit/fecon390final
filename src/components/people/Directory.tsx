"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { normalizeText } from "@/components/PersonCombobox";
import { clusterColor, orderClusters } from "@/lib/clusters";
import { clusters, neighborIds, people } from "@/lib/dataset";

const counts = new Map(
  people.map((p) => [
    p.id,
    {
      all: neighborIds(p.id).length,
      eligible: neighborIds(p.id, (r) => r.path_eligible).length,
    },
  ]),
);

type Ties = "all" | "connected" | "unconnected";

export function Directory() {
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState<string | null>(null);
  const [ties, setTies] = useState<Ties>("all");

  const shown = useMemo(() => {
    const q = normalizeText(query.trim());
    return people.filter((p) => {
      if (cluster && p.cluster !== cluster) return false;
      const c = counts.get(p.id)!;
      if (ties === "connected" && c.eligible === 0) return false;
      if (ties === "unconnected" && c.eligible > 0) return false;
      if (!q) return true;
      return normalizeText(`${p.name} ${p.role_context} ${p.cluster} ${p.why_included}`).includes(q);
    });
  }, [query, cluster, ties]);

  return (
    <div>
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <label className="relative block md:w-80">
          <span className="sr-only">Search people, roles and organizations</span>
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-subtle" width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search names, roles, organizations…"
            className="h-11 w-full rounded-xl border border-line-strong bg-ink-850/90 pl-9 pr-3 text-sm text-fg placeholder:text-subtle focus:border-gold/60 focus:outline-none"
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          Ties
          <select
            value={ties}
            onChange={(e) => setTies(e.target.value as Ties)}
            className="h-11 rounded-xl border border-line-strong bg-ink-850 px-3 text-sm text-fg"
          >
            <option value="all">Everyone</option>
            <option value="connected">Has a path-eligible tie</option>
            <option value="unconnected">No path-eligible tie</option>
          </select>
        </label>
        <p className="text-sm text-subtle md:ml-auto" aria-live="polite">
          {shown.length} of {people.length} people
        </p>
      </div>

      <div role="group" aria-label="Filter by cluster" className="mt-4 flex flex-wrap gap-1.5">
        <button type="button" className="chip" aria-pressed={cluster === null} onClick={() => setCluster(null)}>
          All clusters
        </button>
        {orderClusters(clusters).map((c) => (
          <button
            key={c}
            type="button"
            className="chip"
            aria-pressed={cluster === c}
            onClick={() => setCluster(cluster === c ? null : c)}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: clusterColor(c) }} aria-hidden="true" />
            {c}
          </button>
        ))}
      </div>

      {shown.length === 0 ? (
        <p className="mt-12 text-center text-muted">No people match these filters.</p>
      ) : (
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => {
            const c = counts.get(p.id)!;
            return (
              <li key={p.id}>
                <Link
                  href={`/people/${p.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-ink-850/50 p-4 transition-colors hover:border-gold/35 hover:bg-ink-850"
                >
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} cluster={p.cluster} size="md" />
                    <div className="min-w-0">
                      <h2 className="truncate font-serif text-xl leading-tight text-fg group-hover:text-gold-soft">
                        {p.name}
                      </h2>
                      <p className="mt-0.5 truncate text-xs" style={{ color: clusterColor(p.cluster) }}>
                        {p.cluster}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">{p.role_context}</p>
                  <p className="mt-auto pt-3 text-xs text-subtle">
                    {c.all === 0
                      ? "No documented person-to-person tie in this dataset"
                      : `${c.all} ${c.all === 1 ? "connection" : "connections"} in this curated dataset${
                          c.eligible !== c.all ? ` (${c.eligible} path-eligible)` : ""
                        }`}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

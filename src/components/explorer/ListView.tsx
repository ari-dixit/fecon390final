"use client";

import { Avatar } from "@/components/Avatar";
import { orderClusters } from "@/lib/clusters";
import { clusters, people, peopleById } from "@/lib/dataset";
import type { Adjacency } from "@/lib/graph";

/** Text alternative to the canvas: the same filtered network as a list. */
export function ListView({
  adjacency,
  emphasis,
  hiddenNodes,
  selectedId,
  onSelectPerson,
}: {
  adjacency: Adjacency;
  emphasis: Set<string> | null;
  hiddenNodes: Set<string> | null;
  selectedId: string | null;
  onSelectPerson: (id: string) => void;
}) {
  const shown = people.filter(
    (p) => !hiddenNodes?.has(p.id) && (!emphasis || emphasis.has(p.id)),
  );
  const byCluster = orderClusters(clusters).map((c) => ({
    cluster: c,
    members: shown.filter((p) => p.cluster === c),
  })).filter((g) => g.members.length);

  return (
    <div className="scrollbar-thin absolute inset-0 overflow-y-auto px-3 pb-32 pt-4 sm:px-5">
      <p className="mb-4 max-w-2xl text-sm text-muted">
        {shown.length} people, grouped by thematic cluster. Counts show the people each person is
        linked to under the current filters, within this curated dataset only.
      </p>
      <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {byCluster.map(({ cluster, members }) => (
          <section key={cluster} aria-labelledby={`cl-${cluster}`}>
            <h3 id={`cl-${cluster}`} className="eyebrow mb-2">
              {cluster} <span className="text-subtle/70">· {members.length}</span>
            </h3>
            <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-ink-850/50">
              {members.map((p) => {
                const n = adjacency.get(p.id) ?? [];
                return (
                  <li key={p.id}>
                    <button
                      type="button"
                      onClick={() => onSelectPerson(p.id)}
                      aria-current={selectedId === p.id ? "true" : undefined}
                      className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-white/[0.04] aria-[current=true]:bg-gold/10"
                    >
                      <Avatar name={p.name} cluster={p.cluster} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm text-fg">{p.name}</span>
                        <span className="block truncate text-xs text-subtle">
                          {n.length
                            ? n
                                .slice(0, 3)
                                .map((id) => peopleById.get(id)!.name)
                                .join(", ") + (n.length > 3 ? ` +${n.length - 3}` : "")
                            : "No visible documented links"}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-xs text-subtle" aria-label={`${n.length} connections`}>
                        {n.length}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

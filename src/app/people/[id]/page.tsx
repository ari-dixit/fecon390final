import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/Avatar";
import { RelationshipRecord, SourceList } from "@/components/Evidence";
import { clusterColor } from "@/lib/clusters";
import {
  dataset,
  formattedAsOf,
  groupsForPerson,
  otherPerson,
  peopleById,
  relationshipsForPerson,
} from "@/lib/dataset";
import type { Relationship } from "@/lib/types";

export function generateStaticParams() {
  return dataset.people.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/people/[id]">): Promise<Metadata> {
  const { id } = await params;
  const p = peopleById.get(id);
  if (!p) return {};
  return { title: p.name, description: `${p.role_context}. ${p.why_included}` };
}

function milestones(text: string): string[] {
  return text
    .split(/;\s+/)
    .map((s) => s.trim().replace(/\.$/, ""))
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

export default async function PersonPage({ params }: PageProps<"/people/[id]">) {
  const { id } = await params;
  const p = peopleById.get(id);
  if (!p) notFound();

  const byNeighbor = new Map<string, Relationship[]>();
  for (const r of relationshipsForPerson(id)) {
    const other = otherPerson(r, id);
    byNeighbor.set(other, [...(byNeighbor.get(other) ?? []), r]);
  }
  const neighbors = [...byNeighbor.entries()].sort((a, b) =>
    peopleById.get(a[0])!.name.localeCompare(peopleById.get(b[0])!.name),
  );
  const eligible = neighbors.filter(([, rels]) => rels.some((r) => r.path_eligible));
  const contextual = neighbors.filter(([, rels]) => rels.every((r) => !r.path_eligible));
  const groups = groupsForPerson(id);
  const color = clusterColor(p.cluster);

  return (
    <article className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
      <nav aria-label="Breadcrumb" className="text-sm text-subtle">
        <Link href="/people" className="hover:text-fg">People</Link>
        <span aria-hidden="true"> / </span>
        <span className="text-muted">{p.name}</span>
      </nav>

      <header className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">
        <Avatar name={p.name} cluster={p.cluster} size="xl" />
        <div className="min-w-0">
          <p className="eyebrow" style={{ color }}>{p.cluster}</p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-fg sm:text-6xl">{p.name}</h1>
          <p className="mt-3 max-w-2xl text-lg leading-snug text-muted">{p.role_context}</p>
          <p className="mt-2 text-xs text-subtle">
            Role as described in the cited sources; may be historical. Researched{" "}
            <time dateTime={dataset.as_of}>{formattedAsOf}</time>.
          </p>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={`/paths?from=${p.id}`} className="btn btn-primary">
          Find degrees from {p.name}
        </Link>
        <Link href={`/explore?focus=${p.id}`} className="btn btn-ghost">
          Show in the network
        </Link>
      </div>

      {p.notes && (
        <p className="mt-6 max-w-3xl rounded-xl border border-gold/25 bg-gold/5 p-4 text-sm leading-relaxed text-gold-soft/90">
          <strong className="font-medium">Editorial note:</strong> {p.notes}
        </p>
      )}

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_22rem]">
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="why-h">
            <h2 id="why-h" className="eyebrow">Why included</h2>
            <p className="mt-3 max-w-3xl font-serif text-2xl leading-snug text-fg">{p.why_included}</p>
          </section>

          <section aria-labelledby="ms-h">
            <h2 id="ms-h" className="eyebrow">Since 2015</h2>
            <ol className="mt-4 space-y-3 border-l border-line pl-5">
              {milestones(p.activity_2015_onward).map((m) => (
                <li key={m} className="relative text-muted">
                  <span className="absolute -left-[1.6rem] top-2 h-2 w-2 rounded-full" style={{ background: color }} aria-hidden="true" />
                  {m}
                </li>
              ))}
            </ol>
          </section>

          <section aria-labelledby="conn-h">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="conn-h" className="eyebrow">Documented connections</h2>
              <p className="text-xs text-subtle">
                {neighbors.length} {neighbors.length === 1 ? "person" : "people"} in this curated dataset ·{" "}
                {eligible.length} via path-eligible ties
              </p>
            </div>

            {neighbors.length === 0 ? (
              <p className="mt-4 rounded-2xl border border-dashed border-line-strong p-6 leading-relaxed text-muted">
                This dataset documents no person-to-person tie for {p.name}. That reflects the
                evidence collected so far, not their importance in AI. They are shown unconnected
                rather than given an inferred link.
              </p>
            ) : (
              <div className="mt-5 space-y-8">
                {eligible.length > 0 && <NeighborList entries={eligible} />}
                {contextual.length > 0 && (
                  <div>
                    <h3 className="mb-1 text-sm text-fg">Contextual only</h3>
                    <p className="mb-4 text-xs text-subtle">
                      Weaker associations that don’t count toward default degrees of separation.
                    </p>
                    <NeighborList entries={contextual} />
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-10 lg:sticky lg:top-20 lg:self-start">
          {groups.length > 0 && (
            <section aria-labelledby="grp-h">
              <h2 id="grp-h" className="eyebrow mb-3">Documented groups</h2>
              <ul className="space-y-3">
                {groups.map((g) => (
                  <li key={g.id} className="rounded-xl border border-line bg-ink-850/50 p-3">
                    <p className="text-sm text-fg">{g.name}</p>
                    <p className="mt-0.5 font-mono text-xs text-subtle">
                      {g.year_or_period} · {g.person_ids.length} people
                      {!g.path_eligible && " · contextual"}
                    </p>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">{g.evidence_summary}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section aria-labelledby="src-h">
            <h2 id="src-h" className="eyebrow mb-3">Profile sources</h2>
            <SourceList ids={p.source_ids} />
          </section>
        </aside>
      </div>
    </article>
  );
}

function NeighborList({ entries }: { entries: [string, Relationship[]][] }) {
  return (
    <ul className="space-y-6">
      {entries.map(([otherId, rels]) => {
        const o = peopleById.get(otherId)!;
        return (
          <li key={otherId} className="grid gap-3 md:grid-cols-[12rem_1fr]">
            <Link href={`/people/${o.id}`} className="group flex items-center gap-3 self-start">
              <Avatar name={o.name} cluster={o.cluster} size="sm" />
              <span className="min-w-0">
                <span className="block truncate text-sm text-fg group-hover:text-gold-soft">{o.name}</span>
                <span className="block truncate text-xs text-subtle">{o.cluster}</span>
              </span>
            </Link>
            <div className="space-y-2">
              {rels.map((r) => (
                <RelationshipRecord key={r.id} rel={r} />
              ))}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

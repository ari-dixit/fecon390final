"use client";

import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/Avatar";
import { PathBadge, RelationshipRecord, SourceList } from "@/components/Evidence";
import { SPOTLIGHT_IDS } from "@/content/spotlight";
import { STORIES, type Story } from "@/content/stories";
import { clusterColor } from "@/lib/clusters";
import {
  groupsById,
  otherPerson,
  pairKey,
  peopleById,
  relationshipsByPair,
  relationshipsForPerson,
  splitPair,
} from "@/lib/dataset";
import type { Adjacency } from "@/lib/graph";
import type { Relationship } from "@/lib/types";
import { filtersAreDefault, relPasses, type Filters } from "./filters";

export type Selection =
  | { kind: "person"; id: string }
  | { kind: "pair"; key: string }
  | null;

interface Props {
  selection: Selection;
  story: Story | null;
  pathIds: string[] | null;
  filters: Filters;
  adjacency: Adjacency;
  visibleRelCount: number;
  visiblePairCount: number;
  isolatedCount: number;
  focusMode: boolean;
  onSelectPerson: (id: string | null) => void;
  onSelectPair: (key: string) => void;
  onOpenStory: (slug: string | null) => void;
  onClearPath: () => void;
  onToggleFocus: () => void;
  onShowContextual: () => void;
}

export function ExplorerPanel(props: Props) {
  const { selection, story, pathIds } = props;
  return (
    <div className="p-5">
      {selection?.kind === "person" ? (
        <PersonPanel id={selection.id} {...props} />
      ) : selection?.kind === "pair" ? (
        <PairPanel pair={selection.key} {...props} />
      ) : pathIds ? (
        <PathPanel ids={pathIds} {...props} />
      ) : story ? (
        <StoryPanel {...props} activeStory={story} />
      ) : (
        <OverviewPanel {...props} />
      )}
    </div>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-4 inline-flex items-center gap-1.5 text-xs text-subtle hover:text-fg"
    >
      <span aria-hidden="true">←</span> {label}
    </button>
  );
}

function PersonButton({ id, onSelect, meta }: { id: string; onSelect: (id: string) => void; meta?: string }) {
  const p = peopleById.get(id)!;
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left hover:bg-white/[0.05]"
    >
      <Avatar name={p.name} cluster={p.cluster} size="xs" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm text-fg">{p.name}</span>
        {meta && <span className="block truncate text-xs text-subtle">{meta}</span>}
      </span>
    </button>
  );
}

function OverviewPanel({
  visibleRelCount,
  visiblePairCount,
  isolatedCount,
  filters,
  onOpenStory,
  onSelectPerson,
}: Props) {
  return (
    <div className="space-y-7">
      <div>
        <p className="eyebrow">How to read this map</p>
        <h2 className="mt-2 font-serif text-2xl leading-tight text-fg">
          Each line is a documented, sourced professional tie.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Click a person to see their connections, or click a line to read the evidence behind it. A
          line does not mean friendship, coordination or influence. Contextual links (dotted) are
          weaker associations and are off by default.
        </p>
      </div>

      <dl className="grid grid-cols-3 gap-2 text-center">
        <Stat value={visiblePairCount} label="linked pairs" />
        <Stat value={visibleRelCount} label="records shown" />
        <Stat value={isolatedCount} label="with no visible link" />
      </dl>
      {!filtersAreDefault(filters) && (
        <p className="-mt-4 text-xs text-subtle">Counts reflect the current filters.</p>
      )}

      <div>
        <h3 className="eyebrow mb-2.5">Stories in the data</h3>
        <ul className="space-y-2">
          {STORIES.map((s) => (
            <li key={s.slug}>
              <button
                type="button"
                onClick={() => onOpenStory(s.slug)}
                className="group w-full rounded-xl border border-line bg-ink-850/50 p-3 text-left transition-colors hover:border-gold/40"
              >
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-subtle">{s.kicker}</span>
                <span className="mt-0.5 block font-serif text-lg leading-snug text-fg group-hover:text-gold-soft">
                  {s.title}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="eyebrow mb-2">Start with a person</h3>
        <p className="mb-2 text-xs text-subtle">An editorial starting set, in no particular order.</p>
        <ul className="flex flex-wrap gap-1.5">
          {SPOTLIGHT_IDS.map((id) => {
            const p = peopleById.get(id)!;
            return (
              <li key={id}>
                <button type="button" className="chip hover:border-gold/40" onClick={() => onSelectPerson(id)}>
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: clusterColor(p.cluster) }} aria-hidden="true" />
                  {p.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <KeyboardHelp />
    </div>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-line bg-ink-850/50 px-2 py-3">
      <dd className="font-serif text-2xl text-fg">{value}</dd>
      <dt className="mt-0.5 text-[0.68rem] leading-tight text-subtle">{label}</dt>
    </div>
  );
}

function KeyboardHelp() {
  return (
    <details className="rounded-xl border border-line p-3 text-xs text-muted">
      <summary className="cursor-pointer text-subtle">Keyboard shortcuts</summary>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt className="font-mono text-fg">/</dt><dd>Search people</dd>
        <dt className="font-mono text-fg">← →</dt><dd>Step through people (graph focused)</dd>
        <dt className="font-mono text-fg">Enter</dt><dd>Open highlighted person</dd>
        <dt className="font-mono text-fg">Esc</dt><dd>Back / clear</dd>
        <dt className="font-mono text-fg">+ − 0</dt><dd>Zoom in, out, fit</dd>
        <dt className="font-mono text-fg">F</dt><dd>Toggle spotlight</dd>
      </dl>
    </details>
  );
}

interface NeighborEntry {
  id: string;
  rels: Relationship[];
  visible: Relationship[];
}

function neighborEntries(id: string, filters: Filters): NeighborEntry[] {
  const by = new Map<string, Relationship[]>();
  for (const r of relationshipsForPerson(id)) {
    const other = otherPerson(r, id);
    by.set(other, [...(by.get(other) ?? []), r]);
  }
  return [...by.entries()]
    .map(([other, rels]) => ({
      id: other,
      rels,
      visible: rels.filter((r) => relPasses(r, filters)),
    }))
    .sort((a, b) => peopleById.get(a.id)!.name.localeCompare(peopleById.get(b.id)!.name));
}

function describe(rels: Relationship[]) {
  const labels = rels.map((r) => {
    const g = r.group_id ? groupsById.get(r.group_id) : null;
    return `${g ? g.name : r.typeLabel} (${r.year_or_period})`;
  });
  return [...new Set(labels)].join(" · ");
}

function PersonPanel({ id, filters, focusMode, onSelectPerson, onSelectPair, onToggleFocus, onShowContextual }: Props & { id: string }) {
  const p = peopleById.get(id)!;
  const [showHidden, setShowHidden] = useState(false);
  const entries = neighborEntries(id, filters);
  const visible = entries.filter((e) => e.visible.length);
  const hidden = entries.filter((e) => !e.visible.length);
  const eligibleCount = entries.filter((e) => e.rels.some((r) => r.path_eligible)).length;
  const hiddenContextualOnly = hidden.filter((e) => e.rels.every((r) => !r.path_eligible)).length;

  return (
    <div>
      <BackButton onClick={() => onSelectPerson(null)} label="Overview" />
      <div className="flex items-start gap-4">
        <Avatar name={p.name} cluster={p.cluster} size="lg" />
        <div className="min-w-0">
          <p className="eyebrow" style={{ color: clusterColor(p.cluster) }}>{p.cluster}</p>
          <h2 className="mt-1 font-serif text-[1.7rem] leading-tight text-fg">{p.name}</h2>
          <p className="mt-1.5 text-sm leading-snug text-muted">{p.role_context}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link href={`/people/${p.id}`} className="btn btn-primary !py-2 text-xs">Full profile</Link>
        <Link href={`/paths?from=${p.id}`} className="btn btn-ghost !py-2 text-xs">Find degrees from {p.name.split(" ")[0]}</Link>
        <button type="button" onClick={onToggleFocus} aria-pressed={focusMode} className="btn btn-ghost !py-2 text-xs aria-pressed:border-gold/60 aria-pressed:text-gold-soft">
          {focusMode ? "Exit spotlight" : "Spotlight"}
        </button>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted">{p.why_included}</p>
      <p className="mt-3 text-xs leading-relaxed text-subtle">
        <span className="text-muted">Since 2015: </span>
        {p.activity_2015_onward}
      </p>
      {p.notes && (
        <p className="mt-3 rounded-lg border border-gold/20 bg-gold/5 p-2.5 text-xs leading-relaxed text-gold-soft/90">
          Editorial note: {p.notes}
        </p>
      )}

      <section className="mt-6" aria-labelledby="conn-h">
        <div className="flex items-baseline justify-between gap-3">
          <h3 id="conn-h" className="eyebrow">Documented connections</h3>
          <span className="text-xs text-subtle">
            {entries.length} in this curated dataset · {eligibleCount} path-eligible
          </span>
        </div>

        {entries.length === 0 && (
          <p className="mt-3 rounded-xl border border-dashed border-line-strong p-4 text-sm leading-relaxed text-muted">
            No person-to-person tie for {p.name} is documented in this dataset. That reflects the
            evidence collected so far, not their importance.
          </p>
        )}

        <ul className="mt-2 space-y-1">
          {visible.map((e) => (
            <NeighborRow key={e.id} entry={e} self={id} onSelectPerson={onSelectPerson} onSelectPair={onSelectPair} />
          ))}
        </ul>

        {hidden.length > 0 && (
          <div className="mt-3">
            <button
              type="button"
              aria-expanded={showHidden}
              onClick={() => setShowHidden((v) => !v)}
              className="text-xs text-subtle underline decoration-line-strong underline-offset-4 hover:text-fg"
            >
              {showHidden ? "Hide" : "Show"} {hidden.length} hidden by current filters
            </button>
            {hiddenContextualOnly > 0 && !filters.contextual && (
              <button type="button" onClick={onShowContextual} className="ml-3 text-xs text-gold-soft underline underline-offset-4">
                Show contextual links
              </button>
            )}
            {showHidden && (
              <ul className="mt-2 space-y-1 opacity-70">
                {hidden.map((e) => (
                  <NeighborRow key={e.id} entry={e} self={id} onSelectPerson={onSelectPerson} onSelectPair={onSelectPair} />
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="mt-6">
        <h3 className="eyebrow mb-2">Profile sources</h3>
        <SourceList ids={p.source_ids} />
      </section>
    </div>
  );
}

function NeighborRow({
  entry,
  self,
  onSelectPerson,
  onSelectPair,
}: {
  entry: NeighborEntry;
  self: string;
  onSelectPerson: (id: string) => void;
  onSelectPair: (key: string) => void;
}) {
  const other = peopleById.get(entry.id)!;
  const shown = entry.visible.length ? entry.visible : entry.rels;
  const eligible = entry.rels.some((r) => r.path_eligible);
  return (
    <li className="flex items-center gap-1 rounded-lg hover:bg-white/[0.03]">
      <button
        type="button"
        onClick={() => onSelectPerson(entry.id)}
        className="flex min-w-0 flex-1 items-center gap-2.5 px-2 py-1.5 text-left"
      >
        <Avatar name={other.name} cluster={other.cluster} size="xs" />
        <span className="min-w-0">
          <span className="flex items-center gap-1.5 text-sm text-fg">
            <span className="truncate">{other.name}</span>
            {!eligible && <span className="shrink-0 text-[0.65rem] text-subtle">(contextual)</span>}
          </span>
          <span className="block truncate text-xs text-subtle">{describe(shown)}</span>
        </span>
      </button>
      <button
        type="button"
        onClick={() => onSelectPair(pairKey(self, entry.id))}
        className="shrink-0 rounded-md px-2 py-1 text-[0.7rem] text-subtle hover:bg-white/5 hover:text-gold-soft"
        aria-label={`Evidence for ${peopleById.get(self)!.name} and ${other.name} (${entry.rels.length} records)`}
      >
        Evidence{entry.rels.length > 1 ? ` · ${entry.rels.length}` : ""}
      </button>
    </li>
  );
}

function PairPanel({ pair, filters, onSelectPerson }: Props & { pair: string }) {
  const [a, b] = splitPair(pair);
  const pa = peopleById.get(a)!;
  const pb = peopleById.get(b)!;
  const rels = relationshipsByPair.get(pair) ?? [];
  const anyEligible = rels.some((r) => r.path_eligible);
  return (
    <div>
      <BackButton onClick={() => onSelectPerson(null)} label="Overview" />
      <p className="eyebrow">Connection evidence</p>
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={() => onSelectPerson(a)} className="flex min-w-0 items-center gap-2 text-left hover:text-gold-soft">
          <Avatar name={pa.name} cluster={pa.cluster} size="sm" />
          <span className="truncate font-serif text-lg">{pa.name}</span>
        </button>
        <span className="text-subtle" aria-label="and">↔</span>
        <button type="button" onClick={() => onSelectPerson(b)} className="flex min-w-0 items-center gap-2 text-left hover:text-gold-soft">
          <Avatar name={pb.name} cluster={pb.cluster} size="sm" />
          <span className="truncate font-serif text-lg">{pb.name}</span>
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
        <span>
          {rels.length} documented {rels.length === 1 ? "record" : "records"} connect this pair.
        </span>
        <PathBadge eligible={anyEligible} />
      </div>
      <p className="mt-2 text-xs leading-relaxed text-subtle">
        Records are listed separately so each keeps its own citation trail. They describe a
        sourced professional tie, not a personal relationship.
      </p>
      <div className="mt-4 space-y-3">
        {rels.map((r) => {
          const passes = relPasses(r, filters);
          return (
            <div key={r.id}>
              {!passes && <p className="mb-1 text-[0.68rem] text-subtle">Hidden by current filters</p>}
              <RelationshipRecord rel={r} dimmed={!passes} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StoryPanel({
  activeStory: story,
  onOpenStory,
  onSelectPerson,
  adjacency,
}: Props & { activeStory: Story }) {
  return (
    <div>
      <BackButton onClick={() => onOpenStory(null)} label="All stories" />
      <p className="eyebrow">{story.kicker}</p>
      <h2 className="mt-2 font-serif text-3xl leading-tight text-fg">{story.title}</h2>
      <p className="mt-2 text-sm text-gold-soft/90">{story.dek}</p>
      <div className="prose-editorial text-sm">
        {story.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      {story.caveat && (
        <p className="mt-4 border-l-2 border-gold/40 pl-3 text-xs italic leading-relaxed text-subtle">{story.caveat}</p>
      )}
      <h3 className="eyebrow mb-1.5 mt-6">People in this story</h3>
      <ul>
        {story.personIds.map((id) => (
          <li key={id}>
            <PersonButton id={id} onSelect={onSelectPerson} meta={`${adjacency.get(id)?.length ?? 0} visible connections`} />
          </li>
        ))}
      </ul>
      {story.groupIds.length > 0 && (
        <>
          <h3 className="eyebrow mb-2 mt-6">Documented groups</h3>
          <ul className="space-y-3">
            {story.groupIds.map((gid) => {
              const g = groupsById.get(gid)!;
              return (
                <li key={gid} className="rounded-xl border border-line bg-ink-850/50 p-3">
                  <p className="text-sm text-fg">
                    {g.name} <span className="font-mono text-xs text-subtle">{g.year_or_period}</span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{g.evidence_summary}</p>
                  <div className="mt-2"><SourceList ids={g.source_ids} compact /></div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}

function PathPanel({ ids, filters, onClearPath, onSelectPair, onSelectPerson }: Props & { ids: string[] }) {
  const from = ids[0];
  const to = ids[ids.length - 1];
  const mode = filters.contextual ? "&mode=expanded" : "";
  return (
    <div>
      <BackButton onClick={onClearPath} label="Clear path" />
      <p className="eyebrow">Highlighted path · {ids.length - 1} {ids.length === 2 ? "degree" : "degrees"}</p>
      <ol className="mt-3 space-y-1">
        {ids.map((id, i) => (
          <li key={id}>
            <PersonButton id={id} onSelect={onSelectPerson} />
            {i < ids.length - 1 && (
              <button
                type="button"
                onClick={() => onSelectPair(pairKey(id, ids[i + 1]))}
                className="ml-[18px] block border-l border-gold/40 py-1 pl-4 text-left text-xs text-subtle hover:text-gold-soft"
              >
                {describe(relationshipsByPair.get(pairKey(id, ids[i + 1])) ?? [])}
              </button>
            )}
          </li>
        ))}
      </ol>
      <Link href={`/paths?from=${from}&to=${to}${mode}`} className="btn btn-ghost mt-5 !py-2 text-xs">
        Open in path finder
      </Link>
    </div>
  );
}

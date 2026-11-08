import Link from "next/link";
import { CATEGORY_META } from "@/lib/categories";
import { groupsById, peopleById, sourcesFor } from "@/lib/dataset";
import type { Relationship, Source } from "@/lib/types";

const SOURCE_TYPE_LABEL: Record<Source["source_type"], string> = {
  primary: "Primary",
  research: "Research",
  news: "Secondary · news",
};

export function SourceBadge({ type }: { type: Source["source_type"] }) {
  const tone =
    type === "primary"
      ? "border-emerald-400/30 text-emerald-200"
      : type === "research"
        ? "border-sky/30 text-sky"
        : "border-line-strong text-muted";
  return (
    <span className={`rounded-full border px-1.5 py-px font-mono text-[0.6rem] uppercase tracking-wider ${tone}`}>
      {SOURCE_TYPE_LABEL[type]}
    </span>
  );
}

export function SourceList({ ids, compact = false }: { ids: string[]; compact?: boolean }) {
  const sources = sourcesFor(ids);
  return (
    <ul className={compact ? "space-y-1" : "space-y-1.5"}>
      {sources.map((s) => (
        <li key={s.id} className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xs">
          <span className="font-mono text-subtle">{s.id}</span>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link break-words"
          >
            {s.title}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <SourceBadge type={s.source_type} />
        </li>
      ))}
    </ul>
  );
}

export function PathBadge({ eligible }: { eligible: boolean }) {
  return eligible ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-2 py-0.5 text-[0.68rem] text-gold-soft">
      <svg width="14" height="4" aria-hidden="true"><line x1="0" y1="2" x2="14" y2="2" stroke="currentColor" strokeWidth="1.6" /></svg>
      Counts toward degrees
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-2 py-0.5 text-[0.68rem] text-muted">
      <svg width="14" height="4" aria-hidden="true"><line x1="0" y1="2" x2="14" y2="2" stroke="currentColor" strokeWidth="1.6" strokeDasharray="2 2" /></svg>
      Contextual only
    </span>
  );
}

/** One documented relationship record with its full citation trail. */
export function RelationshipRecord({
  rel,
  showPeople = false,
  dimmed = false,
}: {
  rel: Relationship;
  showPeople?: boolean;
  dimmed?: boolean;
}) {
  const group = rel.group_id ? groupsById.get(rel.group_id) : undefined;
  const a = peopleById.get(rel.source_person_id);
  const b = peopleById.get(rel.target_person_id);
  return (
    <article
      className={`rounded-xl border border-line bg-ink-850/60 p-3.5 ${dimmed ? "opacity-60" : ""}`}
    >
      <header className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
        <h4 className="text-sm font-medium text-fg">
          {group ? group.name : rel.typeLabel}
        </h4>
        <span className="font-mono text-[0.7rem] text-subtle">
          <time>{rel.year_or_period}</time>
        </span>
      </header>
      {showPeople && a && b && (
        <p className="mt-1 text-xs text-muted">
          <Link className="hover:text-fg" href={`/people/${a.id}`}>{a.name}</Link>
          {" ↔ "}
          <Link className="hover:text-fg" href={`/people/${b.id}`}>{b.name}</Link>
        </p>
      )}
      <p className="mt-1.5 text-sm leading-relaxed text-muted">
        {group ? group.evidence_summary : rel.description}
      </p>
      {(rel.context_note || group?.notes) && (
        <p className="mt-1.5 text-xs italic leading-relaxed text-subtle">
          {rel.context_note || group?.notes}
        </p>
      )}
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <PathBadge eligible={rel.path_eligible} />
        <span className="rounded-full bg-white/5 px-2 py-0.5 text-[0.68rem] text-muted">
          {CATEGORY_META[rel.category].short} · {rel.typeLabel}
        </span>
        {rel.period.imprecise && (
          <span
            className="rounded-full bg-white/5 px-2 py-0.5 text-[0.68rem] text-muted"
            title={rel.period.note}
          >
            Imprecise date
          </span>
        )}
        <span className="font-mono text-[0.62rem] text-subtle">{rel.id}</span>
      </div>
      <div className="mt-2.5 border-t border-line pt-2.5">
        <SourceList ids={rel.source_ids} compact />
      </div>
    </article>
  );
}

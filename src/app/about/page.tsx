import type { Metadata } from "next";
import Link from "next/link";
import { SourceBadge } from "@/components/Evidence";
import { CATEGORY_META, CATEGORY_ORDER, TYPE_CATEGORY, typeLabel } from "@/lib/categories";
import { dataset, formattedAsOf, relationships } from "@/lib/dataset";
import { buildAdjacency, connectedComponents } from "@/lib/graph";
import { KNOWN_PERIOD_LABELS, normalizePeriod } from "@/lib/periods";
import type { Source } from "@/lib/types";

export const metadata: Metadata = {
  title: "Methodology & sources",
  description: "How The AI Network dataset was assembled, what an edge means, and every source.",
};

const SOURCE_GROUPS: { type: Source["source_type"]; title: string; blurb: string }[] = [
  { type: "primary", title: "Primary sources", blurb: "Company, government and first-person publications." },
  { type: "research", title: "Research publications", blurb: "Papers and institutional research profiles." },
  { type: "news", title: "Secondary reporting", blurb: "Reputable news and analysis." },
];

export default function AboutPage() {
  const ids = dataset.people.map((p) => p.id);
  const strict = buildAdjacency(ids, relationships, (r) => r.path_eligible);
  const comps = connectedComponents(strict);
  const eligibleCount = relationships.filter((r) => r.path_eligible).length;
  const usedTypes = new Set(relationships.map((r) => r.type));
  const usedPeriods = new Set(relationships.map((r) => r.year_or_period));

  const stats: [string, number][] = [
    ["People", dataset.people.length],
    ["Documented groups", dataset.relationship_groups.length],
    ["Individually entered connections", dataset.explicit_edges.length],
    ["Group-derived pairwise connections", dataset.derived_group_edges.length],
    ["Path-eligible records", eligibleCount],
    ["Sources", dataset.sources.length],
    ["Connected groups (strict)", comps.length],
    ["People with no path-eligible tie", comps.filter((c) => c.length === 1).length],
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow">Methodology</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-fg sm:text-5xl">About this dataset</h1>
      <p className="mt-5 text-lg leading-relaxed text-muted">
        The AI Network is a curated, auditable research seed: a hand-collected set of people
        prominent in AI from 2015 onward, and the specific professional and scientific ties between
        them that a source documents. It is a convenience sample. It is not a census of the field,
        and it does not measure influence.
      </p>
      <p className="mt-3 text-sm text-subtle">
        Research date: <time dateTime={dataset.as_of}>{formattedAsOf}</time> · Scope: {dataset.period}
      </p>

      <dl className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line bg-ink-850/50 p-4">
            <dd className="font-serif text-3xl text-fg">{value}</dd>
            <dt className="mt-1 text-xs leading-snug text-subtle">{label}</dt>
          </div>
        ))}
      </dl>

      <Section title="What a line means">
        <p>
          A line connects two people only when a cited source documents a specific tie: cofounders,
          paper coauthors, a named small team, a board or committee during the same period, or a
          documented appointment or collaboration. Shared employers, investments, sector
          participation or similar opinions are <strong className="text-fg">not</strong> treated as
          links.
        </p>
        <p>
          A line is a sourced professional tie. It is not evidence of friendship, collusion,
          agreement or influence.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          {dataset.editorial_rules.map((rule) => (
            <li key={rule} className="flex gap-3 text-muted">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden="true" />
              {rule}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Groups and pairwise links">
        <p>
          Many ties come from documented groups, such as the eight authors of the 2017 Transformer
          paper. The dataset expands each group into every pair of its members once, and those
          pairwise records are used as-is. Groups are never expanded a second time.
        </p>
        <p>
          When two people share several documented ties (for example, cofounding Anthropic and
          coauthoring two papers), the graph draws one line but the evidence panel lists every
          record with its own citations. Large teams create many pairwise ties, so a person’s
          connection count partly reflects the size of their teams.
        </p>
      </Section>

      <Section title="Contextual links">
        <p>
          Some records are marked <code className="font-mono text-gold-soft">path_eligible = false</code>:
          weaker associations such as overlapping at a large lab, company-level advisory roles, or
          ties that predate 2015. They are hidden by default, drawn as dotted lines when shown, and
          never used in the default degrees-of-separation calculation.
        </p>
      </Section>

      <Section title="How degrees of separation are computed">
        <p>
          The path finder runs an unweighted breadth-first search on an undirected graph. In strict
          mode (the default) it uses only path-eligible records. One hop is one degree. When several
          routes are equally short, it shows one, chosen deterministically, and tells you how many
          alternatives exist. If no documented route exists, it says so rather than inventing one.
          Expanded mode also allows contextual links and is always labeled.
        </p>
      </Section>

      <Section title="Relationship categories">
        <p>Every relationship type in the data is manually assigned to one filter category.</p>
        <div className="mt-4 space-y-4">
          {CATEGORY_ORDER.map((c) => (
            <div key={c} className="rounded-xl border border-line p-4">
              <h3 className="text-sm font-medium text-fg">{CATEGORY_META[c].label}</h3>
              <p className="mt-1 text-xs text-subtle">{CATEGORY_META[c].description}</p>
              <p className="mt-2 flex flex-wrap gap-1.5">
                {Object.entries(TYPE_CATEGORY)
                  .filter(([t, cat]) => cat === c && usedTypes.has(t))
                  .map(([t]) => (
                    <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[0.7rem] text-muted">
                      {typeLabel(t)}
                    </span>
                  ))}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Dates">
        <p>
          Periods appear in the data as written labels (“2016–2020”, “before 2023”, “2020s”). Each
          label was normalized by hand rather than parsed. In the year filter, a decade or
          “before X” label counts only as a <em>possible</em> match and is excluded unless you
          choose to include imprecise dates.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">How each period label is interpreted</caption>
            <thead className="bg-white/[0.03] text-xs text-subtle">
              <tr>
                <th scope="col" className="px-4 py-2 font-medium">Label</th>
                <th scope="col" className="px-4 py-2 font-medium">Interpretation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {KNOWN_PERIOD_LABELS.filter((l) => usedPeriods.has(l)).map((label) => {
                const p = normalizePeriod(label);
                return (
                  <tr key={label}>
                    <td className="whitespace-nowrap px-4 py-2 font-mono text-xs text-fg">{label}</td>
                    <td className="px-4 py-2 text-xs text-muted">
                      {p.note}
                      {p.imprecise && <span className="ml-2 text-gold-soft/80">(imprecise)</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      <Section title="Limitations and editorial checks">
        <ul className="space-y-3">
          <li>
            <strong className="text-fg">Present-tense titles</strong> are taken from the sources and
            are not a live employment roster. Check them against current first-party biographies
            before republishing.
          </li>
          <li>
            <strong className="text-fg">Evidence quality varies.</strong> Each source is labeled as
            primary, research or secondary reporting. A cited link supports the stated tie, not a
            claim of closeness.
          </li>
          <li>
            <strong className="text-fg">Connection counts are not power rankings.</strong> They
            describe this curated dataset only, and they grow mechanically with the size of
            founding and author teams.
          </li>
          <li>
            <strong className="text-fg">Disconnected people are shown honestly.</strong> An empty
            neighbourhood marks a gap in the collected evidence, not a lack of importance.
          </li>
          <li>
            <strong className="text-fg">The central question stays open.</strong> Whether a small
            number of people shape AI is something to explore here. This sample cannot prove it
            statistically.
          </li>
          <li>
            <strong className="text-fg">No photographs.</strong> People are shown with initials
            avatars until properly licensed headshots are reviewed.
          </li>
        </ul>
      </Section>

      <Section title="Sources">
        <p>
          All {dataset.sources.length} sources cited by people, groups and connections. Links point
          to the original publications. Their availability may change.
        </p>
        <div className="mt-6 space-y-10">
          {SOURCE_GROUPS.map((g) => {
            const list = dataset.sources.filter((s) => s.source_type === g.type);
            if (!list.length) return null;
            return (
              <div key={g.type}>
                <h3 className="text-sm font-medium text-fg">
                  {g.title} <span className="text-subtle">· {list.length}</span>
                </h3>
                <p className="mt-0.5 text-xs text-subtle">{g.blurb}</p>
                <ol className="mt-3 divide-y divide-line rounded-xl border border-line">
                  {list.map((s) => (
                    <li key={s.id} id={s.id.toLowerCase()} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2.5 text-sm">
                      <span className="w-9 shrink-0 font-mono text-xs text-subtle">{s.id}</span>
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="link min-w-0 flex-1 break-words">
                        {s.title}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                      <SourceBadge type={s.source_type} />
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </Section>

      <Section title="Extending the research">
        <p>
          The site reads a single JSON file at build time. Adding a person or a sourced tie means
          editing that file. Automated checks reject broken person or source references, unmapped
          relationship types and unnormalized date labels before the site builds. See the README in
          the repository for details, or start exploring the{" "}
          <Link href="/explore" className="link">network</Link>.
        </p>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-14 border-t border-line pt-10">
      <h2 className="font-serif text-2xl text-fg sm:text-3xl">{title}</h2>
      <div className="prose-editorial mt-2 [&_li]:leading-relaxed [&_li]:text-muted">{children}</div>
    </section>
  );
}

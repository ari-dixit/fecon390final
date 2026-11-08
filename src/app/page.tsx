import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { HeroNetwork, type HeroNode } from "@/components/HeroNetwork";
import { EXAMPLE_PAIRS, SPOTLIGHT, SPOTLIGHT_IDS } from "@/content/spotlight";
import { STORIES } from "@/content/stories";
import { clusterColor } from "@/lib/clusters";
import {
  dataset,
  formattedAsOf,
  people,
  peopleById,
  relationships,
  relationshipsByPair,
  splitPair,
} from "@/lib/dataset";
import { buildAdjacency, connectedComponents, shortestPath } from "@/lib/graph";
import { computeLayout } from "@/lib/layout";

const HERO_LABELS = new Set([
  "sam-altman",
  "dario-amodei",
  "demis-hassabis",
  "geoffrey-hinton",
  "yann-lecun",
  "aidan-gomez",
  "timnit-gebru",
  "satya-nadella",
  "elon-musk",
  "fei-fei-li",
]);

export default function HomePage() {
  const positions = computeLayout();
  const index = new Map(people.map((p, i) => [p.id, i]));
  const heroNodes: HeroNode[] = people.map((p) => ({
    id: p.id,
    x: positions[p.id].x,
    y: positions[p.id].y,
    color: clusterColor(p.cluster),
    big: SPOTLIGHT.has(p.id),
    label: HERO_LABELS.has(p.id) ? p.name : undefined,
  }));
  const heroLinks: [number, number][] = [];
  for (const [key, rels] of relationshipsByPair) {
    if (!rels.some((r) => r.path_eligible)) continue;
    const [a, b] = splitPair(key);
    heroLinks.push([index.get(a)!, index.get(b)!]);
  }

  const ids = people.map((p) => p.id);
  const strict = buildAdjacency(ids, relationships, (r) => r.path_eligible);
  const expanded = buildAdjacency(ids, relationships, () => true);
  const comps = connectedComponents(strict);
  const isolated = comps.filter((c) => c.length === 1).length;
  const examples = EXAMPLE_PAIRS.map(([a, b]) => ({
    a: peopleById.get(a)!,
    b: peopleById.get(b)!,
    strict: shortestPath(strict, a, b).degrees,
    expanded: shortestPath(expanded, a, b).degrees,
  }));

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 pb-10 pt-12 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:pb-16 lg:pt-20">
          <div className="animate-fade-up">
            <p className="eyebrow">
              Researched <time dateTime={dataset.as_of}>{formattedAsOf}</time> · 2015–2026
            </p>
            <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.02] tracking-tight text-fg sm:text-6xl lg:text-[4.4rem]">
              Who is connected to whom in modern <em className="text-gold-soft">AI</em>?
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              An evidence-first map of {dataset.people.length} people shaping artificial
              intelligence since 2015, and the {relationships.length} documented professional and
              scientific ties between them. Every line links to its source.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/explore" className="btn btn-primary !px-5 !py-3">
                Explore the network
              </Link>
              <Link href="/paths" className="btn btn-ghost !px-5 !py-3">
                Find degrees of separation
              </Link>
            </div>
            <p className="mt-6 max-w-lg text-xs leading-relaxed text-subtle">
              A line is a sourced tie such as cofounding, coauthorship or a shared board. It is not
              friendship, coordination or a measure of influence.
            </p>
          </div>
          <figure className="relative">
            <div className="relative aspect-[5/4] w-full sm:aspect-[4/3] lg:aspect-square">
              <div className="absolute inset-[8%] rounded-full bg-[radial-gradient(circle,rgba(56,78,128,0.28),transparent_70%)]" aria-hidden="true" />
              <HeroNetwork nodes={heroNodes} links={heroLinks} />
            </div>
            <figcaption className="mt-2 text-center text-xs text-subtle">
              The real dataset: {heroLinks.length} linked pairs with path-eligible ties, colored by
              cluster. Unconnected people float alone.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* Numbers */}
      <section aria-label="Dataset at a glance" className="border-b border-line">
        <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-line px-0 sm:grid-cols-4">
          {[
            [dataset.people.length, "people, from founders to critics and lawmakers"],
            [relationships.length, "relationship records, each with a citation trail"],
            [dataset.sources.length, "sources: company, government, research and news"],
            [isolated, "people with no verified tie, shown as they are"],
          ].map(([n, label]) => (
            <div key={String(label)} className="bg-ink-900 px-5 py-7 sm:px-6">
              <dd className="font-serif text-4xl text-fg">{n}</dd>
              <dt className="mt-1 text-sm leading-snug text-subtle">{label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Stories */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Stories in the data</p>
            <h2 className="mt-3 font-serif text-3xl text-fg sm:text-4xl">Start with a thread</h2>
          </div>
          <Link href="/explore" className="text-sm text-muted hover:text-fg">
            Open the full network →
          </Link>
        </div>
        <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {STORIES.map((s, i) => (
            <li
              key={s.slug}
              className={
                i === 0 ? "lg:col-span-2" : i === STORIES.length - 1 ? "md:col-span-2 lg:col-span-3" : ""
              }
            >
              <Link
                href={`/explore?story=${s.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-line bg-gradient-to-b from-ink-850/80 to-ink-900/40 p-6 transition-colors hover:border-gold/35"
              >
                <p className="font-mono text-[0.7rem] uppercase tracking-wider text-subtle">{s.kicker}</p>
                <h3 className={`mt-2 font-serif leading-tight text-fg group-hover:text-gold-soft ${i === 0 ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                  {s.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.dek}</p>
                <div className="mt-auto flex items-center justify-between pt-6">
                  <span className="flex -space-x-2">
                    {s.personIds.slice(0, 6).map((id) => {
                      const p = peopleById.get(id)!;
                      return <Avatar key={id} name={p.name} cluster={p.cluster} size="sm" className="ring-2 ring-ink-900" />;
                    })}
                    {s.personIds.length > 6 && (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-700 text-xs text-muted ring-2 ring-ink-900">
                        +{s.personIds.length - 6}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-subtle group-hover:text-gold-soft">See in network →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Degrees apart */}
      <section className="border-y border-line bg-ink-950/40">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow">Degrees apart</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-fg sm:text-4xl">
              How many documented ties separate two people?
            </h2>
            <p className="mt-4 text-muted">
              The shortest path uses only strong, path-eligible ties by default, and every hop is
              cited. When no documented route exists, we say so.
            </p>
            <Link href="/paths" className="btn btn-primary mt-6">Open the path finder</Link>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {examples.map(({ a, b, strict: s, expanded: e }) => (
              <li key={`${a.id}-${b.id}`}>
                <Link
                  href={`/paths?from=${a.id}&to=${b.id}`}
                  className="group flex h-full flex-col rounded-2xl border border-line bg-ink-850/60 p-4 transition-colors hover:border-gold/35"
                >
                  <span className="flex items-center gap-2">
                    <Avatar name={a.name} cluster={a.cluster} size="sm" />
                    <span className="h-px flex-1 border-t border-dashed border-line-strong" aria-hidden="true" />
                    <Avatar name={b.name} cluster={b.cluster} size="sm" />
                  </span>
                  <span className="mt-3 text-sm text-fg">
                    {a.name} <span className="text-subtle">and</span> {b.name}
                  </span>
                  <span className="mt-1 text-sm">
                    {s !== null ? (
                      <span className="text-gold-soft">{s} {s === 1 ? "degree" : "degrees"} apart</span>
                    ) : e !== null ? (
                      <span className="text-muted">
                        No strict path · {e} with contextual links
                      </span>
                    ) : (
                      <span className="text-muted">No verified path in this dataset</span>
                    )}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Spotlight */}
      <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="eyebrow">Start with a person</p>
        <h2 className="mt-3 font-serif text-3xl text-fg sm:text-4xl">Twenty-five entry points</h2>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          A starting set chosen by the editors, in no particular order. It is not a ranking: the
          full directory has all {dataset.people.length} people.
        </p>
        <ul className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {SPOTLIGHT_IDS.map((id) => {
            const p = peopleById.get(id)!;
            return (
              <li key={id}>
                <Link href={`/people/${id}`} className="group flex items-center gap-3 rounded-xl border border-transparent p-2 transition-colors hover:border-line hover:bg-ink-850/60">
                  <Avatar name={p.name} cluster={p.cluster} size="md" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-fg group-hover:text-gold-soft">{p.name}</span>
                    <span className="block truncate text-xs text-subtle">{p.cluster}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <Link href="/people" className="btn btn-ghost mt-8">Browse all {dataset.people.length} people</Link>
      </section>

      {/* Method */}
      <section className="border-t border-line">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            ["Sourced ties only", "Cofounders, coauthors, shared boards and documented appointments. Shared employers or opinions don’t count as links."],
            ["Contextual ≠ connected", "Weaker associations are dotted, off by default, and never used in default degrees of separation."],
            ["Gaps shown honestly", `${isolated} people have no verified tie here. They stay unconnected rather than receive invented links.`],
          ].map(([title, body]) => (
            <div key={title}>
              <h3 className="font-serif text-xl text-fg">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
            </div>
          ))}
          <div className="md:col-span-3">
            <Link href="/about" className="link text-sm">Read the methodology and full source list</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "@/components/Avatar";
import { RelationshipRecord } from "@/components/Evidence";
import { PersonCombobox } from "@/components/PersonCombobox";
import { EXAMPLE_PAIRS } from "@/content/spotlight";
import { clusterColor } from "@/lib/clusters";
import { pairKey, people, peopleById, relationships, relationshipsByPair } from "@/lib/dataset";
import {
  buildAdjacency,
  connectedComponents,
  relAllowedInMode,
  shortestPath,
  type PathMode,
} from "@/lib/graph";
import type { Person } from "@/lib/types";

const ids = people.map((p) => p.id);
const ADJ: Record<PathMode, ReturnType<typeof buildAdjacency>> = {
  strict: buildAdjacency(ids, relationships, (r) => relAllowedInMode(r, "strict")),
  expanded: buildAdjacency(ids, relationships, (r) => relAllowedInMode(r, "expanded")),
};
const COMPONENT_SIZE: Record<PathMode, Map<string, number>> = {
  strict: componentSizes("strict"),
  expanded: componentSizes("expanded"),
};

function componentSizes(mode: PathMode) {
  const m = new Map<string, number>();
  for (const c of connectedComponents(ADJ[mode])) for (const id of c) m.set(id, c.length);
  return m;
}

const degreesLabel = (n: number) => `${n} ${n === 1 ? "degree" : "degrees"}`;

export function PathFinder() {
  const params = useSearchParams();
  const [from, setFrom] = useState<Person | null>(() => peopleById.get(params.get("from") ?? "") ?? null);
  const [to, setTo] = useState<Person | null>(() => peopleById.get(params.get("to") ?? "") ?? null);
  const [mode, setMode] = useState<PathMode>(() => (params.get("mode") === "expanded" ? "expanded" : "strict"));

  useEffect(() => {
    const sp = new URLSearchParams();
    if (from) sp.set("from", from.id);
    if (to) sp.set("to", to.id);
    if (mode === "expanded") sp.set("mode", "expanded");
    const qs = sp.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [from, to, mode]);

  const result = useMemo(
    () => (from && to ? shortestPath(ADJ[mode], from.id, to.id) : null),
    [from, to, mode],
  );
  const expandedAlt = useMemo(
    () =>
      from && to && mode === "strict" && !result?.path
        ? shortestPath(ADJ.expanded, from.id, to.id)
        : null,
    [from, to, mode, result],
  );

  return (
    <div className="space-y-10">
      <div className="panel p-4 sm:p-6">
        <div className="grid items-end gap-3 md:grid-cols-[1fr_auto_1fr]">
          <PersonCombobox label="Person A" value={from} onChange={setFrom} placeholder="e.g. Geoffrey Hinton" />
          <button
            type="button"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            aria-label="Swap person A and person B"
            className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-muted hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" className="rotate-90 md:rotate-0">
              <path d="M2 5h11l-3-3M14 11H3l3 3" />
            </svg>
          </button>
          <PersonCombobox label="Person B" value={to} onChange={setTo} placeholder="e.g. Aidan Gomez" />
        </div>

        <fieldset className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
          <legend className="sr-only">Which links may be used</legend>
          {(
            [
              ["strict", "Strict", "Only path-eligible documented ties (default)"],
              ["expanded", "Expanded", "Also allow contextual links such as lab overlap"],
            ] as const
          ).map(([value, label, hint]) => (
            <label key={value} className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="radio"
                name="mode"
                value={value}
                checked={mode === value}
                onChange={() => setMode(value)}
                className="accent-[#f0c674]"
              />
              <span className="text-fg">{label}</span>
              <span className="text-xs text-subtle">— {hint}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <p aria-live="polite" className="sr-only">
        {from && to && from.id !== to.id
          ? result?.path
            ? `${from.name} and ${to.name} are ${degreesLabel(result.degrees!)} apart.`
            : `No verified path between ${from.name} and ${to.name} in this dataset.`
          : ""}
      </p>
      <div>
        {!from || !to ? (
          <Examples
            onPick={(a, b) => {
              setFrom(peopleById.get(a)!);
              setTo(peopleById.get(b)!);
            }}
          />
        ) : result?.path ? (
          <PathResultView path={result.path} degrees={result.degrees!} routes={result.shortestRouteCount} mode={mode} />
        ) : (
          <NoPath
            from={from}
            to={to}
            mode={mode}
            expandedDegrees={expandedAlt?.degrees ?? null}
            onExpand={() => setMode("expanded")}
          />
        )}
      </div>

      <p className="border-t border-line pt-6 text-xs leading-relaxed text-subtle">
        Paths are computed by unweighted breadth-first search over an undirected graph of{" "}
        {mode === "strict" ? "path-eligible " : ""}documented relationships. One hop is one degree.
        A path is an evidence trail, not proof that two people know each other or influence one
        another.
      </p>
    </div>
  );
}

function Examples({ onPick }: { onPick: (a: string, b: string) => void }) {
  return (
    <div>
      <p className="eyebrow mb-3">Try a pair</p>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLE_PAIRS.map(([a, b]) => {
          const pa = peopleById.get(a)!;
          const pb = peopleById.get(b)!;
          return (
            <li key={`${a}-${b}`}>
              <button
                type="button"
                onClick={() => onPick(a, b)}
                className="flex w-full items-center gap-3 rounded-xl border border-line bg-ink-850/50 p-3 text-left transition-colors hover:border-gold/40"
              >
                <span className="flex -space-x-2">
                  <Avatar name={pa.name} cluster={pa.cluster} size="sm" />
                  <Avatar name={pb.name} cluster={pb.cluster} size="sm" />
                </span>
                <span className="text-sm text-fg">
                  {pa.name} <span className="text-subtle">and</span> {pb.name}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function PathResultView({
  path,
  degrees,
  routes,
  mode,
}: {
  path: string[];
  degrees: number;
  routes: number;
  mode: PathMode;
}) {
  const first = peopleById.get(path[0])!;
  const last = peopleById.get(path[path.length - 1])!;

  if (degrees === 0) {
    return <p className="text-muted">Pick two different people to compute a path.</p>;
  }

  const exploreHref = `/explore?path=${path.join(",")}${mode === "expanded" ? "&contextual=1" : ""}`;

  return (
    <section aria-labelledby="result-h">
      <p className="eyebrow">{mode === "strict" ? "Strict path" : "Expanded path, contextual links allowed"}</p>
      <h2 id="result-h" className="mt-2 font-serif text-3xl leading-tight text-fg sm:text-4xl">
        {first.name} and {last.name} are{" "}
        <span className="text-gold-soft">{degreesLabel(degrees)}</span> apart in this dataset.
      </h2>
      <p className="mt-3 max-w-3xl text-sm text-muted">
        {routes > 1 ? (
          <>
            There are <strong className="text-fg">{routes.toLocaleString()}</strong> equally short
            routes. The one shown is picked deterministically (alphabetical by ID), so the
            alternatives are just as valid.
          </>
        ) : (
          <>This is the only shortest route in the current mode.</>
        )}
      </p>

      <ol className="mt-8 flex flex-col gap-2 md:flex-row md:flex-wrap md:items-center md:gap-3" aria-label="People on the path">
        {path.map((id, i) => {
          const p = peopleById.get(id)!;
          return (
            <li key={id} className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3">
              <Link href={`/people/${id}`} className="group flex w-fit items-center gap-3 rounded-full border border-line bg-ink-850/70 py-1.5 pl-1.5 pr-4 hover:border-gold/40">
                <Avatar name={p.name} cluster={p.cluster} size="sm" />
                <span>
                  <span className="block text-sm text-fg group-hover:text-gold-soft">{p.name}</span>
                  <span className="block text-[0.68rem]" style={{ color: clusterColor(p.cluster) }}>{p.cluster}</span>
                </span>
              </Link>
              {i < path.length - 1 && (
                <span aria-hidden="true" className="pl-6 text-gold/70 md:pl-0">
                  <span className="hidden md:inline">⟶</span>
                  <span className="md:hidden">↓</span>
                </span>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={exploreHref} className="btn btn-primary">View path in the network</Link>
      </div>

      <ol className="mt-10 space-y-8">
        {path.slice(0, -1).map((id, i) => {
          const next = path[i + 1];
          const all = relationshipsByPair.get(pairKey(id, next)) ?? [];
          const used = all.filter((r) => relAllowedInMode(r, mode));
          const other = all.length - used.length;
          return (
            <li key={`${id}-${next}`} className="grid gap-4 md:grid-cols-[9rem_1fr]">
              <div>
                <p className="font-mono text-xs text-gold-soft">Hop {i + 1}</p>
                <p className="mt-1 text-sm text-fg">
                  {peopleById.get(id)!.name}
                  <span className="text-subtle"> ↔ </span>
                  {peopleById.get(next)!.name}
                </p>
              </div>
              <div className="space-y-3">
                {used.map((r) => (
                  <RelationshipRecord key={r.id} rel={r} />
                ))}
                {other > 0 && (
                  <p className="text-xs text-subtle">
                    + {other} contextual {other === 1 ? "record" : "records"} for this pair not used in strict mode.
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function NoPath({
  from,
  to,
  mode,
  expandedDegrees,
  onExpand,
}: {
  from: Person;
  to: Person;
  mode: PathMode;
  expandedDegrees: number | null;
  onExpand: () => void;
}) {
  if (from.id === to.id) {
    return <p className="text-muted">Pick two different people to compute a path.</p>;
  }
  const sizeA = COMPONENT_SIZE[mode].get(from.id) ?? 1;
  const sizeB = COMPONENT_SIZE[mode].get(to.id) ?? 1;
  const describeGroup = (p: Person, size: number) =>
    size === 1
      ? `${p.name} has no ${mode === "strict" ? "path-eligible " : ""}documented tie in this dataset.`
      : `${p.name} is in a connected group of ${size} people.`;

  return (
    <section aria-labelledby="nopath-h" className="rounded-2xl border border-dashed border-line-strong p-6 sm:p-8">
      <p className="eyebrow">{mode === "strict" ? "Strict mode" : "Expanded mode"}</p>
      <h2 id="nopath-h" className="mt-2 font-serif text-3xl text-fg">No verified path in this dataset</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
        {describeGroup(from, sizeA)} {describeGroup(to, sizeB)} None of the documented relationships
        connects the two groups. We don’t invent a route to fill the gap.
      </p>
      {mode === "strict" && expandedDegrees !== null && (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={onExpand} className="btn btn-primary">
            Include contextual links
          </button>
          <span className="text-sm text-muted">
            A {degreesLabel(expandedDegrees)} route exists if weaker contextual ties are allowed.
          </span>
        </div>
      )}
      {mode === "strict" && expandedDegrees === null && (
        <p className="mt-4 text-sm text-subtle">
          Even with contextual links enabled, these two people are not connected in this curated
          dataset. That reflects the evidence collected, not their importance.
        </p>
      )}
      {mode === "expanded" && (
        <p className="mt-4 text-sm text-subtle">
          Contextual links are already included. That reflects the evidence collected, not the
          importance of either person.
        </p>
      )}
    </section>
  );
}

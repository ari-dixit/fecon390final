"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { PersonCombobox } from "@/components/PersonCombobox";
import { SPOTLIGHT_IDS } from "@/content/spotlight";
import { storiesBySlug } from "@/content/stories";
import {
  pairKey,
  people,
  peopleById,
  relationships,
  relationshipsByPair,
  indexByPair,
} from "@/lib/dataset";
import { buildAdjacency, neighborhood } from "@/lib/graph";
import type { Positions } from "@/lib/layout";
import { FilterBar } from "./FilterBar";
import { DEFAULT_FILTERS, relPasses, type Filters } from "./filters";
import type { GraphApi, LinkInfo } from "./GraphCanvas";
import { Legend } from "./Legend";
import { ListView } from "./ListView";
import { ExplorerPanel, type Selection } from "./ExplorerPanel";

const GraphCanvas = dynamic(() => import("./GraphCanvas"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <p className="eyebrow animate-pulse">Drawing the network…</p>
    </div>
  ),
});

const allIds = people.map((p) => p.id);

function parsePath(raw: string | null): string[] | null {
  if (!raw) return null;
  const ids = raw.split(",").filter((id) => peopleById.has(id));
  if (ids.length < 2) return null;
  for (let i = 0; i < ids.length - 1; i++) {
    if (!relationshipsByPair.has(pairKey(ids[i], ids[i + 1]))) return null;
  }
  return ids;
}

function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

function isTypingTarget(t: EventTarget | null) {
  if (!(t instanceof HTMLElement)) return false;
  return t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
}

export function Explorer({ positions }: { positions: Positions }) {
  const params = useSearchParams();
  const [initial] = useState(() => ({
    focus: params.get("focus"),
    pair: params.get("pair"),
    story: params.get("story"),
    path: params.get("path"),
    view: params.get("view"),
    contextual: params.get("contextual") === "1",
  }));

  const [filters, setFilters] = useState<Filters>(() => ({
    ...DEFAULT_FILTERS,
    contextual: initial.contextual,
  }));
  const [selection, setSelection] = useState<Selection>(() => {
    const { focus, pair } = initial;
    if (focus && peopleById.has(focus)) return { kind: "person", id: focus };
    if (pair && relationshipsByPair.has(pair)) return { kind: "pair", key: pair };
    return null;
  });
  const [storySlug, setStorySlug] = useState<string | null>(() =>
    initial.story && storiesBySlug.has(initial.story) ? initial.story : null,
  );
  const [pathIds, setPathIds] = useState<string[] | null>(() => parsePath(initial.path));
  const [focusMode, setFocusMode] = useState(false);
  const [focusDepth, setFocusDepth] = useState<1 | 2>(1);
  // Small screens start in the list view unless the URL or the user picks one.
  const [viewChoice, setView] = useState<"graph" | "list" | null>(() =>
    initial.view === "list" || initial.view === "graph" ? initial.view : null,
  );
  const isSmall = useMediaQuery("(max-width: 767px)");
  const view = viewChoice ?? (isSmall ? "list" : "graph");
  const [cursorId, setCursorId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(true);
  const [announce, setAnnounce] = useState("");
  const apiRef = useRef<GraphApi | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const story = storySlug ? storiesBySlug.get(storySlug)! : null;
  const selectedId = selection?.kind === "person" ? selection.id : null;
  const selectedPair = selection?.kind === "pair" ? selection.key : null;

  const visibleRels = useMemo(
    () => relationships.filter((r) => relPasses(r, filters)),
    [filters],
  );
  const visibleByPair = useMemo(() => indexByPair(visibleRels), [visibleRels]);
  const adjacency = useMemo(
    () => buildAdjacency(allIds, visibleRels, () => true),
    [visibleRels],
  );
  const linkInfo = useMemo(() => {
    const m = new Map<string, LinkInfo>();
    for (const key of relationshipsByPair.keys()) {
      const vis = visibleByPair.get(key);
      m.set(key, { visible: Boolean(vis), eligible: Boolean(vis?.some((r) => r.path_eligible)) });
    }
    return m;
  }, [visibleByPair]);

  const pathPairs = useMemo(() => {
    if (!pathIds) return null;
    const s = new Set<string>();
    for (let i = 0; i < pathIds.length - 1; i++) s.add(pairKey(pathIds[i], pathIds[i + 1]));
    return s;
  }, [pathIds]);

  const emphasis = useMemo(() => {
    if (pathIds) return new Set(pathIds);
    if (story) return new Set(story.personIds);
    if (selectedPair) return new Set(selectedPair.split("|"));
    return null;
  }, [pathIds, story, selectedPair]);

  const hiddenNodes = useMemo(() => {
    if (!focusMode) return null;
    let keep: Set<string> | null = null;
    if (selectedId) keep = neighborhood(adjacency, selectedId, focusDepth);
    else if (emphasis) keep = emphasis;
    if (!keep) return null;
    return new Set(allIds.filter((id) => !keep!.has(id)));
  }, [focusMode, selectedId, focusDepth, adjacency, emphasis]);

  // Path links must stay visible even when filters would hide them.
  const effectiveLinkInfo = useMemo(() => {
    if (!pathPairs) return linkInfo;
    const m = new Map(linkInfo);
    for (const key of pathPairs) {
      const recs = relationshipsByPair.get(key) ?? [];
      m.set(key, { visible: true, eligible: recs.some((r) => r.path_eligible) });
    }
    return m;
  }, [linkInfo, pathPairs]);

  // Keep the URL shareable without triggering navigations.
  useEffect(() => {
    const sp = new URLSearchParams();
    if (selectedId) sp.set("focus", selectedId);
    if (selectedPair) sp.set("pair", selectedPair);
    if (storySlug) sp.set("story", storySlug);
    if (pathIds) sp.set("path", pathIds.join(","));
    if (filters.contextual) sp.set("contextual", "1");
    const qs = sp.toString();
    const url = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    if (url !== `${window.location.pathname}${window.location.search}`) {
      window.history.replaceState(null, "", url);
    }
  }, [selectedId, selectedPair, storySlug, pathIds, filters.contextual]);

  const [apiReady, setApiReady] = useState(false);
  const onReady = useCallback((api: GraphApi) => {
    apiRef.current = api;
    setApiReady(true);
  }, []);
  const [intro] = useState(() => !selection && !storySlug && !pathIds);

  // Camera follows the most specific context.
  const cameraKey = `${apiReady}|${selectedId}|${storySlug}|${pathIds?.join(",")}|${focusMode}|${focusDepth}|${view}`;
  useEffect(() => {
    const t = setTimeout(() => {
      const api = apiRef.current;
      if (!api) return;
      if (selectedId) api.fit(neighborhood(adjacency, selectedId, focusMode ? focusDepth : 1));
      else if (pathIds) api.fit(pathIds);
      else if (story) api.fit(story.personIds);
      else if (selectedPair) api.fit(selectedPair.split("|"));
    }, 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraKey]);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const selectPerson = useCallback((id: string | null) => {
    setSelection(id ? { kind: "person", id } : null);
    setCursorId(null);
    setSheetOpen(true);
  }, []);
  const selectPair = useCallback((key: string) => {
    setSelection({ kind: "pair", key });
    setCursorId(null);
    setSheetOpen(true);
  }, []);
  const openStory = useCallback((slug: string | null) => {
    setStorySlug(slug);
    setPathIds(null);
    setSelection(null);
    setSheetOpen(true);
    if (slug) setView("graph");
  }, []);

  const resetAll = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    setSelection(null);
    setStorySlug(null);
    setPathIds(null);
    setFocusMode(false);
    setCursorId(null);
    setTimeout(() => apiRef.current?.fit(null), 30);
  }, []);

  // Keyboard cursor candidates: neighbours of selection, else emphasised set, else spotlight.
  const cursorCandidates = useMemo(() => {
    const byName = (a: string, b: string) =>
      peopleById.get(a)!.name.localeCompare(peopleById.get(b)!.name);
    if (selectedId) return [...(adjacency.get(selectedId) ?? [])].sort(byName);
    if (emphasis) return [...emphasis].sort(byName);
    return [...SPOTLIGHT_IDS];
  }, [selectedId, adjacency, emphasis]);

  const moveCursor = useCallback(
    (dir: 1 | -1) => {
      if (!cursorCandidates.length) {
        setAnnounce("No visible connections to move between.");
        return;
      }
      const i = cursorId ? cursorCandidates.indexOf(cursorId) : -1;
      const next = cursorCandidates[(i + dir + cursorCandidates.length) % cursorCandidates.length];
      setCursorId(next);
      apiRef.current?.centerOn(next, 1.6);
      const p = peopleById.get(next)!;
      const n = adjacency.get(next)?.length ?? 0;
      setAnnounce(`${p.name}, ${p.cluster}. ${n} visible connections. Press Enter to open.`);
    },
    [cursorCandidates, cursorId, adjacency],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      } else if (e.key === "Escape") {
        if (cursorId) setCursorId(null);
        else if (selection) setSelection(null);
        else if (pathIds) setPathIds(null);
        else if (storySlug) setStorySlug(null);
        else if (focusMode) setFocusMode(false);
      } else if (view === "graph" && (e.key === "+" || e.key === "=")) {
        apiRef.current?.zoomBy(1.4);
      } else if (view === "graph" && e.key === "-") {
        apiRef.current?.zoomBy(1 / 1.4);
      } else if (view === "graph" && e.key === "0") {
        apiRef.current?.fit(null);
      } else if (e.key === "f") {
        setFocusMode((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cursorId, selection, pathIds, storySlug, focusMode, view]);

  const isolatedCount = useMemo(
    () => allIds.filter((id) => (adjacency.get(id)?.length ?? 0) === 0).length,
    [adjacency],
  );

  const hasContext = Boolean(selection || story || pathIds);

  const panel = (
    <ExplorerPanel
      selection={selection}
      story={story}
      pathIds={pathIds}
      filters={filters}
      adjacency={adjacency}
      visibleRelCount={visibleRels.length}
      visiblePairCount={visibleByPair.size}
      isolatedCount={isolatedCount}
      focusMode={focusMode}
      onSelectPerson={selectPerson}
      onSelectPair={selectPair}
      onOpenStory={openStory}
      onClearPath={() => setPathIds(null)}
      onToggleFocus={() => setFocusMode((v) => !v)}
      onShowContextual={() => setFilters((f) => ({ ...f, contextual: true }))}
    />
  );

  return (
    <div className="relative flex h-[calc(100dvh-3.5rem)] min-h-[520px] overflow-hidden">
      <section aria-label="Network explorer" className="relative flex min-w-0 flex-1 flex-col">
        <div className="relative z-20 flex flex-col gap-2 border-b border-line bg-ink-900/70 px-3 py-2.5 backdrop-blur-xl sm:px-4">
          <div className="flex flex-wrap items-center gap-2">
            <PersonCombobox
              label="Find a person in the network"
              hideLabel
              placeholder="Find a person…  ( / )"
              value={null}
              clearOnSelect
              inputRef={searchRef}
              onChange={(p) => {
                if (p) selectPerson(p.id);
              }}
              className="w-full sm:w-72"
            />
            <div role="group" aria-label="View" className="ml-auto flex rounded-full border border-line-strong p-0.5 text-xs">
              {(["graph", "list"] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={view === v}
                  onClick={() => setView(v)}
                  className="rounded-full px-3 py-1.5 text-muted aria-pressed:bg-white/10 aria-pressed:text-fg"
                >
                  {v === "graph" ? "Graph" : "List"}
                </button>
              ))}
            </div>
            <button type="button" onClick={resetAll} className="btn btn-ghost !px-3 !py-1.5 text-xs">
              Reset
            </button>
          </div>
          <FilterBar
            filters={filters}
            onChange={setFilters}
            focusMode={focusMode}
            focusDepth={focusDepth}
            onFocusMode={setFocusMode}
            onFocusDepth={setFocusDepth}
            focusAvailable={Boolean(selectedId || emphasis)}
          />
        </div>

        <div className="relative flex-1">
          {view === "graph" ? (
            <>
              <div
                ref={canvasRef}
                tabIndex={0}
                role="application"
                aria-roledescription="network graph"
                aria-label="Network graph. Use the arrow keys to step through people, Enter to open the highlighted person, Escape to go back, plus and minus to zoom, 0 to fit. The list view offers the same content as text."
                aria-describedby="graph-help"
                onKeyDown={(e) => {
                  if (["ArrowRight", "ArrowDown"].includes(e.key)) {
                    e.preventDefault();
                    moveCursor(1);
                  } else if (["ArrowLeft", "ArrowUp"].includes(e.key)) {
                    e.preventDefault();
                    moveCursor(-1);
                  } else if (e.key === "Enter" && cursorId) {
                    e.preventDefault();
                    selectPerson(cursorId);
                    setAnnounce(`Opened ${peopleById.get(cursorId)!.name}.`);
                  }
                }}
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(40,56,92,0.32),transparent_70%)] focus-visible:outline-offset-[-4px]"
              >
                <GraphCanvas
                  positions={positions}
                  linkInfo={effectiveLinkInfo}
                  visibleNeighbors={adjacency}
                  emphasis={emphasis}
                  hiddenNodes={hiddenNodes}
                  pathPairs={pathPairs}
                  selectedId={selectedId}
                  selectedPair={selectedPair}
                  cursorId={cursorId}
                  onNodeClick={(id) => selectPerson(id)}
                  onLinkClick={(key) => selectPair(key)}
                  onBackgroundClick={() => {
                    setSelection(null);
                    setCursorId(null);
                  }}
                  onReady={onReady}
                  intro={intro}
                />
              </div>
              <p id="graph-help" className="sr-only">
                Focus the graph and use arrow keys to move between connected people.
              </p>
              <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-end justify-between gap-3">
                <div className="pointer-events-auto hidden sm:block">
                  <Legend />
                </div>
                <div className="pointer-events-auto ml-auto flex flex-col overflow-hidden rounded-xl border border-line-strong bg-ink-850/90 backdrop-blur">
                  <ZoomButton label="Zoom in" onClick={() => apiRef.current?.zoomBy(1.4)}>
                    <path d="M8 3v10M3 8h10" />
                  </ZoomButton>
                  <ZoomButton label="Zoom out" onClick={() => apiRef.current?.zoomBy(1 / 1.4)}>
                    <path d="M3 8h10" />
                  </ZoomButton>
                  <ZoomButton
                    label="Fit whole network (home)"
                    onClick={() => apiRef.current?.fit(null)}
                  >
                    <path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10" />
                  </ZoomButton>
                </div>
              </div>
            </>
          ) : (
            <ListView
              adjacency={adjacency}
              emphasis={hiddenNodes ? null : emphasis}
              hiddenNodes={hiddenNodes}
              selectedId={selectedId}
              onSelectPerson={selectPerson}
            />
          )}
        </div>
      </section>

      {isDesktop && (
        <aside
          aria-label="Details"
          className="scrollbar-thin w-[400px] shrink-0 overflow-y-auto border-l border-line bg-ink-900/60"
        >
          {panel}
        </aside>
      )}

      {/* Mobile / tablet bottom sheet */}
      {!isDesktop && hasContext && sheetOpen && (
        <div role="dialog" aria-label="Details" className="fixed inset-x-0 bottom-0 z-40">
          <div className="scrollbar-thin relative mx-auto max-h-[62dvh] overflow-y-auto rounded-t-2xl border-t border-line-strong bg-ink-850/95 shadow-[0_-20px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl">
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              className="sticky top-0 z-10 flex w-full justify-center bg-ink-850/95 pb-1 pt-2.5"
              aria-label="Hide details"
            >
              <span className="h-1 w-10 rounded-full bg-white/25" />
            </button>
            {panel}
          </div>
        </div>
      )}
      {!isDesktop && hasContext && !sheetOpen && (
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="btn btn-primary fixed bottom-4 left-1/2 z-40 -translate-x-1/2 shadow-xl"
        >
          Show details
        </button>
      )}

      <div aria-live="polite" className="sr-only">
        {announce}
      </div>
    </div>
  );
}

function ZoomButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center text-muted transition-colors hover:bg-white/[0.06] hover:text-fg [&+&]:border-t [&+&]:border-line"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        {children}
      </svg>
    </button>
  );
}

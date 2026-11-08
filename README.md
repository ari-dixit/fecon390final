# The AI Network

An evidence-first map of 107 people shaping artificial intelligence since 2015, and the documented professional and scientific ties between them. Every line in the graph links to its sources.

- **Network** (`/explore`): force-directed graph with search, filters, hover/click inspection, a spotlight (focus) mode, story overlays, keyboard navigation and a text list view (the default on phones).
- **Degrees apart** (`/paths`): shortest path between any two people, with every hop cited. Strict mode uses only path-eligible ties; expanded mode also allows contextual links.
- **People** (`/people`, `/people/[id]`): searchable directory and a static profile page for every person.
- **Methodology** (`/about`): what a link means, how paths and dates are computed, limitations, and the full dated source index.

Built with Next.js (App Router, TypeScript, Cache Components), Tailwind CSS v4, `react-force-graph-2d` (Canvas) and `d3-force`. There is no database, no login and no runtime API: the dataset is read statically at build time.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm test           # all unit tests (dataset integrity + path finding)
npm run validate   # dataset integrity checks only
npm run lint
npm run build      # runs `validate` first, then a production build
npm start          # serve the production build
```

## Deploy to Vercel

1. Push this repository to GitHub, GitLab or Bitbucket.
2. In Vercel, choose **Add New → Project** and import the repository. The framework preset is detected as Next.js; no environment variables are needed.
3. Deploy. Every page is prerendered at build time, and the build fails if the dataset fails validation.

From the command line, the equivalent is `npx vercel` (preview) and `npx vercel --prod`.

## How the data works

The single source of truth is `data/ai_people_network_seed.json` (research date and summary in `data/research/`).

| Collection | Meaning |
| --- | --- |
| `people` | One record per person, with cluster, role description, 2015+ activity and profile sources. |
| `relationship_groups` | Sourced groups such as a founding team, paper author list or board. |
| `derived_group_edges` | The pairwise expansion of each group, already present in the file. |
| `explicit_edges` | Individually sourced person-to-person ties. |
| `sources` | Every cited URL, typed `primary`, `research` or `news`. |

Rules the code enforces:

- Relationships are `explicit_edges + derived_group_edges`. Groups are **not** re-expanded, so nothing is counted twice (`buildRelationships` in `src/lib/dataset.ts`).
- Several records can describe the same pair. The graph draws one line per pair, but the evidence panel and profiles list every record and its sources.
- `path_eligible: false` marks a contextual link. Those are hidden by default, drawn dotted, and never used in default degrees of separation.
- Paths use unweighted breadth-first search on an undirected graph (`src/lib/graph.ts`). Ties are broken deterministically (alphabetical by ID), and the UI says when other equally short routes exist. If no route exists, the UI says "No verified path in this dataset"; it never fills the gap.

### Adding or editing data

1. Edit `data/ai_people_network_seed.json`. IDs are lowercase slugs; every person, source and group reference must resolve.
2. If you add a group, also add its pairwise rows to `derived_group_edges` (the validator checks they match).
3. A new relationship `type` needs a category in `TYPE_CATEGORY` (`src/lib/categories.ts`).
4. A new period label needs an entry in the hand-written table in `src/lib/periods.ts`. Vague labels like "2020s" or "before 2023" are marked imprecise rather than guessed, and the year filter can include or exclude them.
5. Run `npm run validate`. It fails on unknown IDs, missing sources, unmapped types or unnormalized periods.

Curated editorial content lives in `src/content/`: the 25-person onboarding spotlight (`spotlight.ts`, explicitly not a ranking) and the home-page stories (`stories.ts`). Tests check that both reference only real IDs.

## Project layout

```
data/                      seed dataset and research notes
src/app/                   routes: /, /explore, /paths, /people, /people/[id], /about
src/components/explorer/   graph canvas, filters, legend, side panel, list view
src/components/paths/      path finder
src/components/people/     directory
src/lib/                   types, dataset indexing, BFS, layout, validation, periods, categories
src/content/               spotlight and stories
tests/                     Vitest suites
```

The graph layout is computed once on the server with `d3-force` (`src/lib/layout.ts`), so it's identical on every visit and the browser doesn't run a simulation.

## Editorial checks before publishing

- Roles are copied from the cited sources and may be historical. Verify present-tense titles against first-party biographies.
- Source badges distinguish primary sources from secondary news. A link is an evidence pointer, not proof of a personal relationship.
- Connection counts appear only as "connections in this curated dataset". Nothing is ranked by degree.
- People with no documented tie are shown as unconnected.
- Avatars are initials on a cluster color. Add photographs only after a licensing review.

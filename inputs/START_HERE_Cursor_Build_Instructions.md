# Start Here — Build the AI People Network in Cursor

## Files in this package

- **`AI_People_Since_2015_Research_and_Cursor_Brief.md`** — The main research document: project purpose, scope, 107 individually described people, important professional and scientific relationships, evidence/citation index, and interface guidance. Start here for editorial understanding.
- **`ai_people_network_seed.json`** — Full machine-readable dataset with 107 people, 37 documented multi-person groups, 56 specifically entered connections, and 242 additional group-derived pairwise connections (298 edge records total). Every person and connection contains evidence pointers; edges include `path_eligible`.
- **`people.csv`** — 107 rows of profile data for quick import.
- **`relationships.csv`** — 298 graph edge records with `source_person_id` and `target_person_id`, `type`, `year_or_period`, and `path_eligible`.
- **`START_HERE_Cursor_Build_Instructions.md`** — This quick-start file and copy-paste prompt.

**Research date:** November 7, 2026. **Scope:** People prominent in AI during 2015–2026, with pre-2015 ties marked contextual. Personal biographies and organizational appointments evolve; validate any “current role” wording when publishing.

## Suggested launch subset

Default to the entire 107-person graph, but feature approximately 25 people prominently in the onboarding experience: Sam Altman, Ilya Sutskever, Dario Amodei, Daniela Amodei, Demis Hassabis, Mustafa Suleyman, Mira Murati, Greg Brockman, John Schulman, Geoffrey Hinton, Yoshua Bengio, Yann LeCun, Fei-Fei Li, Jeff Dean, Noam Shazeer, Aidan Gomez, Ashish Vaswani, Aravind Srinivas, Alexandr Wang, Mark Zuckerberg, Satya Nadella, Jensen Huang, Elon Musk, Liang Wenfeng, and Timnit Gebru. The `featured` flag in JSON can additionally drive curated entry points; do not infer an ordinal influence ranking from inclusion.

## Copy this into Cursor Agent

> Build a polished, production-ready, responsive website called **"The AI Network"** using the attached `AI_People_Since_2015_Research_and_Cursor_Brief.md` and `ai_people_network_seed.json` as the source of truth. The website should visualize the documented personal and professional connections between people shaping artificial intelligence **since 2015**, and let users investigate how many documented relationships separate two people.
>
> **Technical goals:** Use Next.js App Router, TypeScript, and a robust, performant interactive graph-rendering library (use a library compatible with React, ideally Sigma.js/Graphology or a Canvas/WebGL solution for stable graph performance). Read the JSON at build/server time or via a static JSON import; don't invent people or edges. Make the implementation easy to extend with fresh research later. No login required. Deployable to Vercel.
>
> **Primary screen:** A refined, force-directed people graph on dark charcoal/navy, with understated colored communities, person names on zoom/hover, pan/zoom, search-to-focus, hover neighbors, click to inspect a person, and click links to inspect their evidence. Filter by scientific research, founding/cofounding, governance, company leadership, and policy; allow optional contextual links to be shown as visually weaker dotted edges. Provide a clear legend and reset/home control. Implement readable layouts on desktop and mobile; offer a searchable directory instead of forcing mobile users to pinch-zoom a crowded graph.
>
> **Path finder:** Let users select Person A and Person B by name. Compute an **unweighted breadth-first shortest path** in an undirected graph using `explicit_edges + derived_group_edges` and only `path_eligible=true` by default. A connection of 1 edge means 1 degree of separation. If there are multiple equally short routes, choose a deterministic one and indicate there may be alternatives. Explain each hop with its relationship type, description, date, and original source link. When no documented route exists, display "No verified path in this dataset" and suggest enabling contextual edges, never fabricate a path. Make sure graph navigation can be keyboard-accessible.
>
> **People directory:** Searchable page, category filters, cards and detailed `/people/[id]` pages. Each profile shows name, 2015+ milestones, why they're included, prior/current role with careful date language, documented links, sources, and a "find degrees from this person" action. Use dignified initials/gradient avatars when a properly licensed headshot is unavailable; do not auto-scrape photos without licensing review.
>
> **Data integrity:** JSON has `people`, `relationship_groups`, `explicit_edges`, `derived_group_edges`, and `sources`. Person IDs are lowercase slugs. The derived edges are already expanded from documented small groups, so do **not** expand the groups and then also add the same derived edges twice. Preserve each original edge for its citation trail; the graph layout may merge duplicate person pairs, but an edge detail panel should show *all* documented relationships connecting that pair. `path_eligible=false` means a professional/contextual association insufficient for a default shortest-personal-link claim. An edge shows a sourced tie, not friendship, collusion, or a quantitative measure of influence. **Do not create links based just on common employer, company investment, or similar opinions.**
>
> **Design direction:** A premium editorial data-exploration product, not a generic AI dashboard. Establish a memorable visual hierarchy: a strong but understated hero, a gently animated network overview, crisp typography, high-contrast accessible controls, and informative story cards such as OpenAI → Anthropic, the 2017 Transformer coauthors, OpenAI governance 2023, and DeepMind → Microsoft. Include a concise "About this dataset / methodology" page and visible dated sourcing. Make the graph comprehensible when first loaded; provide a spotlight/focus mode, clustering and smart initial zoom.
>
> **Quality / tests:** Validate dataset ID references and source IDs; unit-test BFS on connected and unconnected people, especially the OpenAI–Anthropic bridge; test the logic for multiple edges between two people; make the user experience work at 375px and desktop widths; no fake avatars, citations or invented degrees. If implementing a year filter, don't guess years from unstructured labels like "2020s" or "before 2023"; manually normalize periods and handle unknown intervals explicitly. Deliver an attractive, working site plus a simple README with local-run/deploy instructions.

## Editorial safety checks before publishing

1. Spot-check all **present-tense** titles against up-to-date first-party biographies. The dataset preserves notable **historical** roles, not a live roster of company employment.
2. Clearly distinguish primary (company, journal, government) evidence from reputable secondary sources. An edge's links are evidence pointers, not proof that the people are friends.
3. Do not rank “power” by simple number of graph connections; larger founding/paper teams create artificial pairwise graph density. Display raw degree only as **"connections in this curated dataset"** if used.
4. Show disconnected people honestly. They matter to modern AI even if the verified corpus does not contain a direct person-to-person tie.
5. The publication's central thesis about the small number of people influencing AI is a question to **explore**, not something this convenience-sampled graph statistically proves.

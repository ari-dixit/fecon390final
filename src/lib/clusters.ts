/**
 * Thematic clusters from the dataset, in the order they are arranged around
 * the layout circle (neighbouring clusters share the most documented ties).
 */
export const CLUSTER_ORDER = [
  "OpenAI",
  "Anthropic",
  "AI policy / governance",
  "International AI labs",
  "Academic / AI society",
  "Google DeepMind",
  "Microsoft AI",
  "Transformer ecosystem",
  "AI startups / infrastructure",
  "Meta / Scale",
  "Mistral AI",
  "xAI / AI companies",
] as const;

export const CLUSTER_COLORS: Record<string, string> = {
  OpenAI: "#7fb2e0",
  Anthropic: "#e0a57e",
  "Google DeepMind": "#62c6a6",
  "Transformer ecosystem": "#b6a1e6",
  "Meta / Scale": "#6d93f0",
  "Microsoft AI": "#7fd3e6",
  "Mistral AI": "#f09a5c",
  "xAI / AI companies": "#c3c7d4",
  "AI startups / infrastructure": "#e6c867",
  "International AI labs": "#ec8a8a",
  "Academic / AI society": "#97d47e",
  "AI policy / governance": "#df8fc7",
};

/** Dataset clusters in layout order; clusters added by future research go last. */
export function orderClusters(all: Iterable<string>): string[] {
  const known = CLUSTER_ORDER as readonly string[];
  const extra = [...new Set(all)].filter((c) => !known.includes(c)).sort();
  return [...known, ...extra];
}

export function clusterColor(cluster: string): string {
  return CLUSTER_COLORS[cluster] ?? "#a3adbf";
}

/** Stable URL-safe key for a cluster name. */
export function clusterSlug(cluster: string): string {
  return cluster.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

import { clusterColor } from "@/lib/clusters";

export function initials(name: string): string {
  const words = name
    .replace(/[’'.]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1);
  const first = words[0]?.[0] ?? "";
  const last = words.length > 1 ? words[words.length - 1][0] : "";
  return (first + last).toUpperCase();
}

const SIZES = {
  xs: "h-6 w-6 text-[0.6rem]",
  sm: "h-9 w-9 text-xs",
  md: "h-12 w-12 text-sm",
  lg: "h-20 w-20 text-2xl",
  xl: "h-28 w-28 text-4xl",
} as const;

/**
 * Initials on a cluster-tinted gradient. Deliberately not a photo: no headshots
 * are used without a licensing review.
 */
export function Avatar({
  name,
  cluster,
  size = "md",
  className = "",
}: {
  name: string;
  cluster: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const color = clusterColor(cluster);
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-serif font-medium tracking-wide text-white/95 ring-1 ring-white/10 ${SIZES[size]} ${className}`}
      style={{
        background: `radial-gradient(120% 120% at 25% 15%, ${color}cc 0%, ${color}55 45%, #0e1420 100%)`,
      }}
    >
      {initials(name)}
    </span>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { Explorer } from "@/components/explorer/Explorer";
import { computeLayout } from "@/lib/layout";

export const metadata: Metadata = {
  title: "Network",
  description:
    "Explore documented professional and scientific ties between people shaping AI since 2015.",
};

export default function ExplorePage() {
  const positions = computeLayout();
  return (
    <>
      <h1 className="sr-only">The AI Network — interactive explorer</h1>
      <Suspense
        fallback={
          <div className="flex h-[calc(100dvh-3.5rem)] items-center justify-center">
            <p className="eyebrow animate-pulse">Loading the network…</p>
          </div>
        }
      >
        <Explorer positions={positions} />
      </Suspense>
    </>
  );
}

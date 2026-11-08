import type { Metadata } from "next";
import { Suspense } from "react";
import { PathFinder } from "@/components/paths/PathFinder";

export const metadata: Metadata = {
  title: "Degrees apart",
  description:
    "How many documented relationships separate two people in AI? Every hop is cited.",
};

export default function PathsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow">Degrees apart</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-[1.08] text-fg sm:text-5xl">
        How many documented ties separate two people?
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Choose two people. We find the shortest chain of sourced professional and scientific
        relationships between them and cite every hop.
      </p>
      <div className="mt-10">
        <Suspense fallback={<div className="panel h-48 animate-pulse" />}>
          <PathFinder />
        </Suspense>
      </div>
    </div>
  );
}

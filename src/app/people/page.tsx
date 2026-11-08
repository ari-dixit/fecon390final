import type { Metadata } from "next";
import { Directory } from "@/components/people/Directory";
import { dataset, formattedAsOf } from "@/lib/dataset";

export const metadata: Metadata = {
  title: "People",
  description: "A searchable directory of the people in The AI Network dataset.",
};

export default function PeoplePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow">Directory</p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-fg sm:text-5xl">
        {dataset.people.length} people shaping AI since 2015
      </h1>
      <p className="mt-4 max-w-2xl text-muted">
        Founders, researchers, operators, critics and policymakers. Roles are taken from the cited
        sources (researched {formattedAsOf}) and may be historical. Connection counts describe this
        curated dataset only and are not a ranking.
      </p>
      <div className="mt-10">
        <Directory />
      </div>
    </div>
  );
}

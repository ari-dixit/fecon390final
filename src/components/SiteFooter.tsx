import Link from "next/link";
import { dataset, formattedAsOf } from "@/lib/dataset";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 text-sm text-subtle sm:px-6 md:grid-cols-[1.4fr_1fr]">
        <div className="space-y-2">
          <p className="text-muted">
            A curated research dataset of {dataset.people.length} people, researched{" "}
            <time dateTime={dataset.as_of}>{formattedAsOf}</time>. Each line is a sourced
            professional tie. It does not imply friendship, collusion or a measure of
            influence.
          </p>
          <p>
            Roles reflect the cited sources and may be historical. Verify present-tense titles
            against first-party biographies before reuse.
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
          <li><Link className="hover:text-fg" href="/explore">Network</Link></li>
          <li><Link className="hover:text-fg" href="/paths">Degrees apart</Link></li>
          <li><Link className="hover:text-fg" href="/people">People</Link></li>
          <li><Link className="hover:text-fg" href="/about">Methodology &amp; sources</Link></li>
        </ul>
      </div>
    </footer>
  );
}

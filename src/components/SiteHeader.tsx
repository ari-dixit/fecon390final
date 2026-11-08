"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV = [
  { href: "/explore", label: "Network" },
  { href: "/paths", label: "Degrees apart" },
  { href: "/people", label: "People" },
  { href: "/about", label: "Methodology" },
] as const;

export function Wordmark() {
  return (
    <span className="flex items-center gap-2.5">
      <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
        <g stroke="#f0c674" strokeOpacity="0.55" strokeWidth="1">
          <line x1="5" y1="6" x2="15" y2="4" />
          <line x1="5" y1="6" x2="11" y2="16" />
          <line x1="15" y1="4" x2="11" y2="16" />
          <line x1="11" y1="16" x2="18" y2="15" strokeDasharray="1.5 1.5" />
        </g>
        <circle cx="5" cy="6" r="2.6" fill="#7fb2e0" />
        <circle cx="15" cy="4" r="2.2" fill="#e0a57e" />
        <circle cx="11" cy="16" r="2.8" fill="#f0c674" />
        <circle cx="18" cy="15" r="1.8" fill="#62c6a6" />
      </svg>
      <span className="font-serif text-[1.15rem] tracking-tight text-fg">
        The AI <em className="text-gold-soft">Network</em>
      </span>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-ink-900/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" aria-label="The AI Network — home" className="rounded-md">
          <Wordmark />
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="rounded-full px-3.5 py-1.5 text-sm text-muted transition-colors hover:text-fg aria-[current=page]:bg-white/[0.07] aria-[current=page]:text-fg"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-strong md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
            {open ? (
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" />
            ) : (
              <path d="M2 4.5h12M2 8h12M2 11.5h12" stroke="currentColor" strokeWidth="1.5" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-line md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col px-4 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="block rounded-lg px-3 py-3 text-base text-muted aria-[current=page]:text-gold-soft"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

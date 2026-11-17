"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Logo } from "./Logo";
import {
  IconArrowLeft,
  IconBell,
  IconBriefcase,
  IconChart,
  IconChevron,
  IconFile,
  IconGrid,
  IconMenu,
  IconPen,
  IconRadar,
  IconSearch,
  IconShieldCheck,
  IconX,
  IconCheck,
} from "./Icons";
import { DemoBadge, cx } from "./ui";
import { FIRM } from "@/lib/data";
import { SITE_URL } from "@/lib/format";
import { getSignedIn, signOut } from "@/lib/session";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: IconGrid },
  { href: "/opportunities", label: "Opportunities", icon: IconRadar, count: 12 },
  { href: "/compliance", label: "Compliance", icon: IconFile },
  { href: "/proposals", label: "Proposal Studio", icon: IconPen },
  { href: "/market", label: "Market intel", icon: IconChart },
  { href: "/contracts", label: "Contracts", icon: IconBriefcase },
  { href: "/trust", label: "Trust & Security", icon: IconShieldCheck },
];

function usePopover() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);
  return { open, setOpen, ref };
}

function NavList({ path, onNavigate }: { path: string; onNavigate?: () => void }) {
  return (
    <ul className="space-y-0.5">
      {NAV.map(({ href, label, icon: Icon, count }) => {
        const active = path === href || path.startsWith(href + "/");
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cx(
                "group flex items-center gap-3 rounded-full px-3.5 py-2 text-[0.9rem] font-medium transition",
                active ? "bg-ink text-paper" : "text-ink/75 hover:bg-ink/[0.05] hover:text-ink",
              )}
            >
              <Icon className={cx(active ? "text-paper" : "text-ink-mute group-hover:text-ink")} />
              <span className="flex-1">{label}</span>
              {count && (
                <span className={cx("rounded-full px-2 text-[0.7rem] font-semibold tabular-nums", active ? "bg-paper/15" : "bg-blue/10 text-blue")}>
                  {count}
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarFoot() {
  return (
    <div className="space-y-3 border-t border-[var(--bp-hairline)] pt-4">
      <div className="rounded-2xl border border-[var(--bp-hairline)] bg-white/60 p-3.5 text-[0.78rem] leading-snug text-ink-mute">
        <p className="font-semibold text-ink">Data sources</p>
        <p className="mt-1">Public SAM.gov, FPDS and USAspending records. Refreshed 06:00 ET.</p>
      </div>
      <a href={SITE_URL} className="inline-flex items-center gap-1.5 px-1 text-[0.8rem] font-medium text-ink-mute transition hover:text-ink">
        <IconArrowLeft width={14} height={14} /> bytesplatform.com
      </a>
    </div>
  );
}

function WorkspaceSwitcher() {
  const { open, setOpen, ref } = usePopover();
  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className="flex max-w-full items-center gap-2.5 rounded-full border border-[var(--bp-hairline)] bg-white/70 py-1.5 pl-1.5 pr-3 text-left transition hover:border-ink/30"
      >
        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-[0.72rem] font-semibold text-paper">MF</span>
        <span className="min-w-0 truncate text-[0.86rem] font-medium">
          {FIRM.name} <span className="text-ink-mute">(demo)</span>
        </span>
        <IconChevron width={15} height={15} className="shrink-0 text-ink-mute" />
      </button>
      {open && (
        <div className="rise absolute left-0 top-[calc(100%+8px)] z-40 w-[min(320px,calc(100vw-32px))] rounded-2xl border border-[var(--bp-hairline)] bg-white p-2 shadow-[0_20px_50px_-20px_rgb(17_17_17/0.35)]">
          <p className="px-3 pb-1 pt-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">Workspaces</p>
          <div className="flex items-center gap-3 rounded-xl bg-blue/[0.06] px-3 py-2.5">
            <span className="grid size-8 place-items-center rounded-full bg-ink text-[0.72rem] font-semibold text-paper">MF</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[0.86rem] font-semibold">{FIRM.name}</span>
              <span className="block text-[0.74rem] text-ink-mute">UEI {FIRM.uei} · SDVOSB</span>
            </span>
            <IconCheck width={16} height={16} className="text-blue" />
          </div>
          <p className="px-3 py-2.5 text-[0.76rem] text-ink-mute">
            Each workspace is tenant-isolated. Other workspaces are hidden in the demo.
          </p>
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const { open, setOpen, ref } = usePopover();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => setEmail(getSignedIn()), []);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Account menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="grid size-9 place-items-center rounded-full bg-blue text-[0.78rem] font-semibold text-white ring-2 ring-white transition hover:brightness-110"
      >
        JC
      </button>
      {open && (
        <div className="rise absolute right-0 top-[calc(100%+8px)] z-40 w-64 rounded-2xl border border-[var(--bp-hairline)] bg-white p-2 shadow-[0_20px_50px_-20px_rgb(17_17_17/0.35)]">
          <div className="px-3 py-2.5">
            <p className="text-[0.88rem] font-semibold">Jordan Castillo</p>
            <p className="text-[0.76rem] text-ink-mute">{email ?? "Guest · not signed in"}</p>
            <p className="mt-1.5 text-[0.72rem] text-ink-mute">Role: Capture lead · 2FA on</p>
          </div>
          <button
            type="button"
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="w-full rounded-xl px-3 py-2 text-left text-[0.86rem] font-medium transition hover:bg-ink/[0.05]"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function Search({ className }: { className?: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  function submit(e: FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/opportunities?q=${encodeURIComponent(q.trim())}` : "/opportunities");
  }
  return (
    <form role="search" onSubmit={submit} className={cx("relative", className)}>
      <label htmlFor="global-search" className="sr-only">
        Search opportunities
      </label>
      <IconSearch width={16} height={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
      <input
        id="global-search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search notices, agencies, NAICS…"
        className="h-10 w-full rounded-full border border-[var(--bp-hairline)] bg-white/70 pl-10 pr-4 text-[0.86rem] outline-none transition placeholder:text-ink-mute/80 focus:border-blue focus:bg-white focus:ring-4 focus:ring-blue/10"
      />
    </form>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const [menu, setMenu] = useState(false);
  useEffect(() => setMenu(false), [path]);

  return (
    <div className="min-h-dvh min-[900px]:grid min-[900px]:grid-cols-[252px_minmax(0,1fr)]">
      <a href="#main" className="sr-only z-50 rounded-full bg-ink px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>

      {/* desktop sidebar */}
      <aside className="sticky top-0 hidden h-dvh flex-col gap-6 border-r border-[var(--bp-hairline)] px-4 pb-5 pt-6 min-[900px]:flex">
        <Link href="/dashboard" className="px-2" aria-label="BytesGov dashboard">
          <Logo />
        </Link>
        <nav aria-label="Main" className="scroll-thin -mx-1 flex-1 overflow-y-auto px-1">
          <NavList path={path} />
        </nav>
        <SidebarFoot />
      </aside>

      <div className="min-w-0">
        {/* mobile bar */}
        <div className="sticky top-0 z-30 border-b border-[var(--bp-hairline)] bg-paper/90 backdrop-blur-md min-[900px]:hidden">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <Link href="/dashboard" aria-label="BytesGov dashboard">
              <Logo sub={false} />
            </Link>
            <div className="flex items-center gap-2">
              <UserMenu />
              <button
                type="button"
                onClick={() => setMenu((m) => !m)}
                aria-expanded={menu}
                aria-controls="mobile-nav"
                aria-label={menu ? "Close menu" : "Open menu"}
                className="grid size-9 place-items-center rounded-full border border-[var(--bp-hairline)] bg-white/70"
              >
                {menu ? <IconX /> : <IconMenu />}
              </button>
            </div>
          </div>
          {menu && (
            <nav id="mobile-nav" aria-label="Main" className="rise border-t border-[var(--bp-hairline)] px-4 pb-5 pt-3">
              <Search className="mb-3" />
              <NavList path={path} onNavigate={() => setMenu(false)} />
              <div className="mt-4">
                <SidebarFoot />
              </div>
            </nav>
          )}
        </div>

        {/* desktop top bar */}
        <header className="sticky top-0 z-20 hidden items-center gap-4 border-b border-[var(--bp-hairline)] bg-paper/85 px-8 py-3 backdrop-blur-md min-[900px]:flex">
          <WorkspaceSwitcher />
          <Search className="ml-auto w-full max-w-sm" />
          <DemoBadge className="hidden xl:inline-flex" />
          <button
            type="button"
            aria-label="Notifications: 3 new"
            className="relative grid size-9 place-items-center rounded-full border border-[var(--bp-hairline)] bg-white/70 transition hover:border-ink/30"
          >
            <IconBell width={17} height={17} />
            <span aria-hidden className="absolute right-2 top-2 size-1.5 rounded-full bg-blue" />
          </button>
          <UserMenu />
        </header>

        <div className="px-4 pt-3 min-[900px]:hidden">
          <div className="flex flex-wrap items-center gap-2">
            <WorkspaceSwitcher />
            <DemoBadge />
          </div>
        </div>
        <div className="hidden px-8 pt-4 min-[900px]:block xl:hidden">
          <DemoBadge />
        </div>

        <main id="main" className="mx-auto w-full max-w-[1320px] px-4 pb-20 pt-7 sm:px-6 min-[900px]:px-8 min-[900px]:pt-9">
          {children}
        </main>
      </div>
    </div>
  );
}

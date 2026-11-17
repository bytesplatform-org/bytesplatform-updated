"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  IconAlert,
  IconArchive,
  IconArrowLeft,
  IconDashboard,
  IconInbox,
  IconInvoices,
  IconMenu,
  IconPlus,
  IconSettings,
  IconShield,
  IconX,
} from "./icons";
import { DemoBadge } from "./ui";
import { ERP_NAME, SELLER } from "@/lib/data";
import { useStore } from "@/lib/store";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bytesplatform.com";

type NavItem = { href: string; label: string; icon: ComponentType<{ size?: number }>; count?: "rejections" | "inbound" };
const NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: IconDashboard },
  { href: "/invoices", label: "Invoices", icon: IconInvoices },
  { href: "/new", label: "New invoice", icon: IconPlus },
  { href: "/validator", label: "Validator", icon: IconShield },
  { href: "/rejections", label: "Rejections", icon: IconAlert, count: "rejections" },
  { href: "/inbound", label: "Inbound", icon: IconInbox, count: "inbound" },
  { href: "/archive", label: "Archive", icon: IconArchive },
  { href: "/settings", label: "Settings", icon: IconSettings },
];

function Logo() {
  return (
    <Link href="/dashboard" className="flex items-center gap-2.5 rounded-lg text-[0.98rem] font-semibold tracking-[-0.02em]">
      <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden>
        <rect width="32" height="32" rx="9" fill="#f0f1fa" />
        <path d="M6 24c4.8 0 6.4-16 11.2-16 4 0 5.4 6.4 8.8 6.4" fill="none" stroke="#2457ff" strokeWidth="3.2" strokeLinecap="round" />
      </svg>
      BytesBilling
    </Link>
  );
}

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { invoices, inbound } = useStore();
  const counts = {
    rejections: invoices.filter((i) => i.rejectionCode).length,
    inbound: inbound.filter((i) => !i.posted).length,
  };
  return (
    <nav aria-label="Main">
      <ul className="space-y-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          const count = item.count ? counts[item.count] : 0;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9rem] transition-colors ${
                  active ? "bg-[rgb(36_87_255/.08)] font-medium text-blue" : "text-ink/75 hover:bg-[rgb(17_17_17/.04)] hover:text-ink"
                }`}
              >
                <Icon size={18} />
                <span className="flex-1">{item.label}</span>
                {count > 0 && (
                  <span
                    className={`min-w-[1.4rem] rounded-full px-1.5 py-0.5 text-center text-[0.7rem] font-semibold tabular-nums ${
                      item.count === "rejections" ? "bg-[#f7e8e6] text-[#9a3a31]" : "bg-[rgb(17_17_17/.06)] text-ink-mute"
                    }`}
                  >
                    {count}
                    <span className="sr-only"> {item.count === "rejections" ? "open rejections" : "awaiting review"}</span>
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="space-y-3 border-t border-[rgb(17_17_17/.08)] pt-4">
      <div className="flex items-center gap-3 px-1">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[rgb(36_87_255/.1)] text-[0.78rem] font-semibold text-blue" aria-hidden>
          SM
        </span>
        <div className="min-w-0 text-[0.8rem] leading-tight">
          <p className="truncate font-medium">Sara Al Mansoori</p>
          <p className="truncate text-ink-mute">Finance manager</p>
        </div>
      </div>
      <a href={SITE} className="flex items-center gap-2 rounded-lg px-1 py-1 text-[0.8rem] font-medium text-ink-mute transition hover:text-ink">
        <IconArrowLeft size={15} /> bytesplatform.com
      </a>
    </div>
  );
}

export default function Shell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-dvh">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Skip to content
      </a>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[256px] flex-col border-r border-[rgb(17_17_17/.08)] bg-white px-4 py-5 min-[900px]:flex">
        <div className="px-2">
          <Logo />
        </div>
        <div className="mt-8 flex-1 overflow-y-auto">
          <Nav />
        </div>
        <SidebarFooter />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 min-[900px]:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-[rgb(17_17_17/.3)]" onClick={() => setOpen(false)} />
          <div className="anim-in absolute inset-y-0 left-0 flex w-[min(300px,86vw)] flex-col bg-white px-4 py-5 shadow-2xl">
            <div className="flex items-center justify-between px-2">
              <Logo />
              <button type="button" onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-[rgb(17_17_17/.05)]" aria-label="Close menu">
                <IconX />
              </button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto">
              <Nav onNavigate={() => setOpen(false)} />
            </div>
            <SidebarFooter />
          </div>
        </div>
      )}

      <div className="min-[900px]:pl-[256px]">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-[rgb(17_17_17/.08)] bg-[rgb(240_241_250/.85)] backdrop-blur-md">
          <div className="flex min-h-[4rem] items-center gap-3 px-4 sm:px-6 lg:px-10">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="grid h-10 w-10 flex-none place-items-center rounded-full border border-[rgb(17_17_17/.12)] bg-white min-[900px]:hidden"
              aria-label="Open menu"
              aria-expanded={open}
            >
              <IconMenu />
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-medium tracking-[-0.01em]">{SELLER.name}</p>
              <p className="truncate text-[0.74rem] text-ink-mute">
                TRN <span className="tabular-nums">{SELLER.trn}</span>
              </p>
            </div>
            <span className="hidden items-center gap-2 rounded-full border border-[rgb(17_17_17/.1)] bg-white px-3 py-1.5 text-[0.76rem] md:inline-flex">
              <span className="relative flex h-2 w-2" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-[#3f8a5c] opacity-40 anim-pulse" />
                <span className="relative h-2 w-2 rounded-full bg-[#3f8a5c]" />
              </span>
              {ERP_NAME} · connected
            </span>
            {/* Phones show the badge in the row below instead. The wrapper does the
                hiding: the badge's own inline-flex would override `hidden`. */}
            <span className="hidden sm:inline-flex"><DemoBadge /></span>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-[rgb(17_17_17/.06)] px-4 py-2 sm:hidden">
            <DemoBadge />
            <span className="inline-flex items-center gap-1.5 text-[0.72rem] text-ink-mute">
              <span className="h-1.5 w-1.5 rounded-full bg-[#3f8a5c]" aria-hidden /> SAP B1 connected
            </span>
          </div>
        </header>

        <main id="main" className="mx-auto w-full max-w-[1400px] px-4 pb-20 pt-8 sm:px-6 md:pt-10 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
}

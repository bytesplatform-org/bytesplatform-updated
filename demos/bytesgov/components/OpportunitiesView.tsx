"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge, Card, Meter, PageHeader, VerdictBadge, btn, cx } from "./ui";
import { IconSearch, IconX } from "./Icons";
import { NAICS, OPPORTUNITIES, pwin, verdict, type SetAside } from "@/lib/data";
import { dateFromToday, dueLabel, fmtShort, money } from "@/lib/format";

const SET_ASIDES: SetAside[] = ["SDVOSB", "Small business", "8(a)", "HUBZone", "WOSB", "Full & open", "State / local"];
const AGENCIES = Array.from(new Set(OPPORTUNITIES.map((o) => o.agency))).sort();

type Sort = "pwin" | "due" | "value";

const selectCls =
  "h-10 w-full appearance-none rounded-full border border-[var(--bp-hairline)] bg-white/70 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%236b665d%22 stroke-width=%222%22><path d=%22M7 10l5 5 5-5%22/></svg>')] bg-[length:14px] bg-[right_12px_center] bg-no-repeat pl-4 pr-9 text-[0.85rem] outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10";

export function OpportunitiesView() {
  const params = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [naics, setNaics] = useState("all");
  const [agency, setAgency] = useState("all");
  const [setAside, setSetAside] = useState("all");
  const [due, setDue] = useState("all");
  const [sort, setSort] = useState<Sort>("pwin");

  useEffect(() => setQ(params.get("q") ?? ""), [params]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return OPPORTUNITIES.filter((o) => {
      if (needle && !`${o.title} ${o.agency} ${o.notice} ${o.naics} ${o.setAside} ${o.office}`.toLowerCase().includes(needle)) return false;
      if (naics !== "all" && o.naics !== naics) return false;
      if (agency !== "all" && o.agency !== agency) return false;
      if (setAside !== "all" && o.setAside !== setAside) return false;
      if (due !== "all" && o.dueInDays > Number(due)) return false;
      return true;
    }).sort((a, b) => (sort === "pwin" ? pwin(b) - pwin(a) : sort === "due" ? a.dueInDays - b.dueInDays : b.value - a.value));
  }, [q, naics, agency, setAside, due, sort]);

  const filtered = q || naics !== "all" || agency !== "all" || setAside !== "all" || due !== "all";
  function reset() {
    setQ("");
    setNaics("all");
    setAgency("all");
    setSetAside("all");
    setDue("all");
    router.replace("/opportunities");
  }

  return (
    <>
      <PageHeader
        eyebrow="Opportunity discovery"
        title="Opportunities"
        sub="Federal notices from SAM.gov, recompetes surfaced from FPDS, and state and municipal bids, scored against Meridian every morning."
      />

      <Card className="p-3 sm:p-4" as="div">
        <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_repeat(5,minmax(0,1fr))]">
          <div className="relative sm:col-span-2 lg:col-span-1">
            <label htmlFor="opp-q" className="sr-only">
              Filter by keyword
            </label>
            <IconSearch width={16} height={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-mute" />
            <input
              id="opp-q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Keyword, notice ID, agency"
              className="h-10 w-full rounded-full border border-[var(--bp-hairline)] bg-white/70 pl-10 pr-4 text-[0.86rem] outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
            />
          </div>
          <Filter id="f-naics" label="NAICS" value={naics} onChange={setNaics}>
            <option value="all">All NAICS</option>
            {Object.entries(NAICS).map(([code, name]) => (
              <option key={code} value={code}>
                {code} · {name}
              </option>
            ))}
          </Filter>
          <Filter id="f-agency" label="Agency" value={agency} onChange={setAgency}>
            <option value="all">All agencies</option>
            {AGENCIES.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </Filter>
          <Filter id="f-sa" label="Set-aside" value={setAside} onChange={setSetAside}>
            <option value="all">All set-asides</option>
            {SET_ASIDES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Filter>
          <Filter id="f-due" label="Due" value={due} onChange={setDue}>
            <option value="all">Any due date</option>
            <option value="7">Next 7 days</option>
            <option value="14">Next 14 days</option>
            <option value="30">Next 30 days</option>
          </Filter>
          <Filter id="f-sort" label="Sort" value={sort} onChange={(v) => setSort(v as Sort)}>
            <option value="pwin">Sort: P(win)</option>
            <option value="due">Sort: due soonest</option>
            <option value="value">Sort: value</option>
          </Filter>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 text-[0.8rem] text-ink-mute">
          <p aria-live="polite">
            Showing <strong className="font-semibold text-ink">{rows.length}</strong> of {OPPORTUNITIES.length} opportunities
          </p>
          {filtered && (
            <button type="button" onClick={reset} className="inline-flex items-center gap-1 font-medium text-ink transition hover:text-blue">
              <IconX width={14} height={14} /> Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* table, md and up */}
      <Card className="mt-4 hidden overflow-hidden md:block" as="div">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-[0.86rem]">
            <thead>
              <tr className="border-b border-[var(--bp-hairline)] text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">
                <th scope="col" className="px-5 py-3 font-semibold">Opportunity</th>
                <th scope="col" className="px-3 py-3 font-semibold">NAICS</th>
                <th scope="col" className="px-3 py-3 font-semibold">Set-aside</th>
                <th scope="col" className="px-3 py-3 font-semibold">Due</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">Value</th>
                <th scope="col" className="w-[180px] px-5 py-3 font-semibold">P(win)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bp-hairline)]">
              {rows.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => router.push(`/opportunities/${o.id}`)}
                  className="cursor-pointer align-top transition hover:bg-white/70"
                >
                  <td className="max-w-[420px] px-5 py-4">
                    <Link href={`/opportunities/${o.id}`} className="font-semibold leading-snug tracking-[-0.015em] hover:text-blue" onClick={(e) => e.stopPropagation()}>
                      {o.title}
                    </Link>
                    <p className="mt-0.5 text-[0.78rem] text-ink-mute">
                      {o.agency} · {o.notice}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <Badge>{o.type}</Badge>
                      <Badge>{o.source}</Badge>
                      {o.isNew && <Badge tone="blue">New today</Badge>}
                    </div>
                  </td>
                  <td className="px-3 py-4 tabular-nums">{o.naics}</td>
                  <td className="px-3 py-4">
                    <Badge tone={o.setAside === "SDVOSB" ? "blue" : "mute"}>{o.setAside}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    <span className={cx("font-medium", o.dueInDays <= 7 && "text-blue")}>{fmtShort(dateFromToday(o.dueInDays))}</span>
                    <span className="block text-[0.76rem] text-ink-mute">{dueLabel(o.dueInDays)}</span>
                  </td>
                  <td className="px-3 py-4 text-right font-semibold tabular-nums">{money(o.value)}</td>
                  <td className="px-5 py-4">
                    <Meter value={pwin(o)} />
                    <div className="mt-2">
                      <VerdictBadge v={verdict(o)} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 && <Empty onReset={reset} />}
      </Card>

      {/* cards, small screens */}
      <ul className="mt-4 space-y-3 md:hidden">
        {rows.map((o) => (
          <li key={o.id}>
            <Link href={`/opportunities/${o.id}`} className="block rounded-[20px] border border-[var(--bp-hairline)] bg-white/65 p-4 transition active:bg-white">
              <div className="flex flex-wrap gap-1.5">
                <Badge tone={o.setAside === "SDVOSB" ? "blue" : "mute"}>{o.setAside}</Badge>
                <VerdictBadge v={verdict(o)} />
                {o.isNew && <Badge tone="blue">New</Badge>}
              </div>
              <p className="mt-2 font-semibold leading-snug tracking-[-0.015em]">{o.title}</p>
              <p className="mt-0.5 text-[0.78rem] text-ink-mute">{o.agency}</p>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[0.78rem]">
                <p>
                  <span className="block text-ink-mute">NAICS</span>
                  <span className="font-medium">{o.naics}</span>
                </p>
                <p>
                  <span className="block text-ink-mute">Due</span>
                  <span className="font-medium">{fmtShort(dateFromToday(o.dueInDays))}</span>
                </p>
                <p>
                  <span className="block text-ink-mute">Value</span>
                  <span className="font-medium">{money(o.value)}</span>
                </p>
              </div>
              <Meter value={pwin(o)} className="mt-3" />
            </Link>
          </li>
        ))}
        {rows.length === 0 && (
          <li>
            <Card as="div">
              <Empty onReset={reset} />
            </Card>
          </li>
        )}
      </ul>
    </>
  );
}

function Filter({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={selectCls}>
        {children}
      </select>
    </div>
  );
}

function Empty({ onReset }: { onReset: () => void }) {
  return (
    <div className="px-5 py-12 text-center">
      <p className="font-semibold">No opportunities match those filters.</p>
      <button type="button" onClick={onReset} className={cx(btn.ghost, "mt-4")}>
        Clear filters
      </button>
    </div>
  );
}

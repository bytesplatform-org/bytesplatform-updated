"use client";

import { useState } from "react";
import { Badge, Card, CardHead, PageHeader, cx } from "./ui";
import { CONTRACTS } from "@/lib/data";
import { money, moneyFull } from "@/lib/format";

const DELIV_TONE = { Accepted: "good", Submitted: "blue", Due: "mute", Late: "bad" } as const;
const INV_TONE = { Paid: "good", "In review": "warn", Overdue: "bad" } as const;

export function ContractsView() {
  const [id, setId] = useState(CONTRACTS[0].id);
  const c = CONTRACTS.find((x) => x.id === id)!;

  const totalValue = CONTRACTS.reduce((s, x) => s + x.value, 0);
  const receivable = CONTRACTS.flatMap((x) => x.invoices).filter((i) => i.status !== "Paid").reduce((s, i) => s + i.amount, 0);
  const overdue = CONTRACTS.flatMap((x) => x.invoices).filter((i) => i.status === "Overdue");
  const due = CONTRACTS.flatMap((x) => x.deliverables).filter((d) => d.status === "Due" || d.status === "Late").length;
  const hoursPct = Math.round((c.hours.used / c.hours.budget) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Post-award performance"
        title="Contracts"
        sub="After the win: deliverables, modifications, option years, hours and receivables for every contract in one place."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { l: "Active contracts", v: String(CONTRACTS.length), n: `${money(totalValue)} total ceiling` },
          { l: "Open receivables", v: money(receivable), n: "Submitted, not yet paid" },
          { l: "Overdue invoices", v: String(overdue.length), n: overdue.map((o) => o.id).join(", ") || "None" },
          { l: "Deliverables due", v: String(due), n: "Next 30 days, incl. late" },
        ].map((k) => (
          <Card as="div" key={k.l} className="p-5">
            <p className="text-[0.78rem] font-medium text-ink-mute">{k.l}</p>
            <p className="mt-2 text-[clamp(1.7rem,3vw,2.3rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">{k.v}</p>
            <p className="mt-2 text-[0.76rem] text-ink-mute">{k.n}</p>
          </Card>
        ))}
      </div>

      <div role="tablist" aria-label="Contracts" className="scroll-thin mt-6 flex gap-2 overflow-x-auto pb-1">
        {CONTRACTS.map((x) => (
          <button
            key={x.id}
            role="tab"
            type="button"
            aria-selected={x.id === id}
            aria-controls="contract-panel"
            onClick={() => setId(x.id)}
            className={cx(
              "shrink-0 rounded-full border px-4 py-2 text-left text-[0.84rem] font-medium transition",
              x.id === id ? "border-ink bg-ink text-paper" : "border-[var(--bp-hairline)] bg-white/60 hover:border-ink/30",
            )}
          >
            {x.name}
          </button>
        ))}
      </div>

      <div id="contract-panel" role="tabpanel" className="mt-4 grid gap-4" key={c.id}>
        <Card className="rise">
          <CardHead title={c.name} meta={`${c.agency} · ${c.number}`} action={<Badge tone="good">Performing</Badge>} />
          <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Periods of performance</p>
              <div className="relative mt-4 pb-2 pt-6">
                <div className="flex gap-1">
                  {c.periods.map((p) => (
                    <div key={p.label} className="min-w-0 flex-1">
                      <div
                        className={cx(
                          "h-9 rounded-lg border text-center text-[0.74rem] font-semibold leading-9",
                          p.state === "done" && "border-transparent bg-ink/[0.1] text-ink/70",
                          p.state === "active" && "border-blue bg-blue text-white",
                          p.state === "option" && "border-dashed border-ink/25 bg-transparent text-ink-mute",
                        )}
                      >
                        {p.label}
                      </div>
                      <p className="mt-1.5 truncate text-center text-[0.66rem] text-ink-mute">{p.start.split(" ")[1]}</p>
                    </div>
                  ))}
                </div>
                <div className="pointer-events-none absolute bottom-6 top-0 w-px bg-ink" style={{ left: `${c.todayPct}%` }}>
                  <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2 py-0.5 text-[0.62rem] font-semibold text-paper">
                    Today
                  </span>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-[0.74rem] text-ink-mute">
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-ink/[0.15]" /> Complete</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm bg-blue" /> Current</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2.5 rounded-sm border border-dashed border-ink/40" /> Unexercised option</span>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4 text-[0.84rem]">
              <div>
                <dt className="text-[0.74rem] text-ink-mute">Ceiling</dt>
                <dd className="text-[1.25rem] font-semibold tracking-[-0.03em] tabular-nums">{money(c.value)}</dd>
              </div>
              <div>
                <dt className="text-[0.74rem] text-ink-mute">Funded</dt>
                <dd className="text-[1.25rem] font-semibold tracking-[-0.03em] tabular-nums">{money(c.funded)}</dd>
              </div>
              <div className="col-span-2">
                <dt className="flex justify-between text-[0.74rem] text-ink-mute">
                  <span>Billed against funded</span>
                  <span className="tabular-nums">{Math.round((c.billed / c.funded) * 100)}%</span>
                </dt>
                <dd className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/[0.07]">
                  <div className="grow-x h-full rounded-full bg-blue" style={{ width: `${(c.billed / c.funded) * 100}%` }} />
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="flex justify-between text-[0.74rem] text-ink-mute">
                  <span>Hours used this period</span>
                  <span className="tabular-nums">
                    {c.hours.used.toLocaleString("en-US")} / {c.hours.budget.toLocaleString("en-US")}
                  </span>
                </dt>
                <dd className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink/[0.07]">
                  <div className={cx("grow-x h-full rounded-full", hoursPct > 85 ? "bg-[#d99a1e]" : "bg-ink/60")} style={{ width: `${hoursPct}%` }} />
                </dd>
              </div>
            </dl>
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card>
            <CardHead title="Deliverables" meta="CDRLs and reports" />
            <ul className="divide-y divide-[var(--bp-hairline)]">
              {c.deliverables.map((d) => (
                <li key={d.name} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.86rem] font-medium leading-snug">{d.name}</p>
                    <p className="text-[0.74rem] text-ink-mute">Due {d.due}</p>
                  </div>
                  <Badge tone={DELIV_TONE[d.status]}>{d.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Modifications" meta="Most recent first" />
            <ul className="divide-y divide-[var(--bp-hairline)]">
              {c.mods.map((m) => (
                <li key={m.id} className="px-5 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[0.76rem] font-semibold">{m.id}</span>
                    <span className="text-[0.84rem] font-semibold tabular-nums">+{money(m.amount)}</span>
                  </div>
                  <p className="mt-0.5 text-[0.82rem] leading-snug">{m.desc}</p>
                  <p className="text-[0.72rem] text-ink-mute">{m.date}</p>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <CardHead title="Receivables" meta="Invoices via WAWF / IPP" />
            <ul className="divide-y divide-[var(--bp-hairline)]">
              {c.invoices.map((i) => (
                <li key={i.id} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.86rem] font-medium">
                      {i.id} <span className="font-normal text-ink-mute">· {i.period}</span>
                    </p>
                    <p className="text-[0.8rem] font-semibold tabular-nums">{moneyFull(i.amount)}</p>
                  </div>
                  <Badge tone={INV_TONE[i.status]}>{i.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

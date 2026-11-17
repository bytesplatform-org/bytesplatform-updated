"use client";

import { useState } from "react";
import { Badge, Card, CardHead, PageHeader, cx } from "./ui";
import { IconCheck, IconX } from "./Icons";
import { AGENCY_AWARDS, AGENCY_PROFILES, INCUMBENTS, NAICS, OPPORTUNITIES, type SetAside } from "@/lib/data";
import { money } from "@/lib/format";

type Attr = "small" | "veteran" | "sdv" | "eightA" | "hubzone" | "woman" | "edwosb";

const ATTRS: { key: Attr; label: string; short: string; hint: string }[] = [
  { key: "small", short: "small size", label: "Small under the NAICS size standard", hint: "$34M average receipts for 541512" },
  { key: "veteran", short: "veteran ownership", label: "51%+ owned and controlled by veterans", hint: "Required for VOSB" },
  { key: "sdv", short: "service-disabled owner", label: "Owner has a service-connected disability", hint: "Required for SDVOSB" },
  { key: "eightA", short: "8(a) participation", label: "SBA 8(a) Business Development participant", hint: "Nine-year programme term" },
  { key: "hubzone", short: "HUBZone location", label: "Principal office in a HUBZone, 35% of staff live in one", hint: "SBA HUBZone map" },
  { key: "woman", short: "women ownership", label: "51%+ owned and controlled by women", hint: "Required for WOSB" },
  { key: "edwosb", short: "economic disadvantage", label: "Women owners are economically disadvantaged", hint: "Required for EDWOSB" },
];

const PROGRAMS: { name: string; sa?: SetAside; needs: Attr[]; note: string }[] = [
  { name: "Small business set-aside", sa: "Small business", needs: ["small"], note: "FAR 19.502" },
  { name: "SDVOSB", sa: "SDVOSB", needs: ["small", "veteran", "sdv"], note: "SBA VetCert, FAR 19.14" },
  { name: "VOSB (VA Vets First)", needs: ["small", "veteran"], note: "VA only, 38 U.S.C. 8127" },
  { name: "8(a)", sa: "8(a)", needs: ["small", "eightA"], note: "FAR 19.8, sole-source up to $4.5M" },
  { name: "HUBZone", sa: "HUBZone", needs: ["small", "hubzone"], note: "FAR 19.13, 10% price preference" },
  { name: "WOSB", sa: "WOSB", needs: ["small", "woman"], note: "FAR 19.15, designated NAICS only" },
  { name: "EDWOSB", needs: ["small", "woman", "edwosb"], note: "FAR 19.15" },
];

export function MarketView() {
  const [attrs, setAttrs] = useState<Record<Attr, boolean>>({
    small: true,
    veteran: true,
    sdv: true,
    eightA: false,
    hubzone: false,
    woman: false,
    edwosb: false,
  });
  const [naics, setNaics] = useState("541512");

  const eligible = PROGRAMS.map((p) => ({ ...p, ok: p.needs.every((n) => attrs[n]), missing: p.needs.filter((n) => !attrs[n]) }));
  const unlocked = OPPORTUNITIES.filter((o) => {
    if (o.setAside === "Full & open" || o.setAside === "State / local") return true;
    return eligible.some((p) => p.ok && p.sa === o.setAside);
  });
  const awards = AGENCY_AWARDS[naics];
  const max = Math.max(...awards.map((a) => a.amount));

  return (
    <>
      <PageHeader
        eyebrow="Set-aside, teaming & market intelligence"
        title="Know the field"
        sub="Check which set-asides you can prime, see who buys your NAICS codes, and size up incumbents before a recompete. Award data from public USAspending records."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHead title="Set-aside eligibility checker" meta="Toggle Meridian's attributes to see what you can bid as prime" />
          <fieldset className="p-5">
            <legend className="sr-only">Firm attributes</legend>
            <ul className="space-y-1">
              {ATTRS.map((a) => (
                <li key={a.key}>
                  <label className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5 transition hover:bg-white/70">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={attrs[a.key]}
                      onChange={(e) => setAttrs((s) => ({ ...s, [a.key]: e.target.checked }))}
                    />
                    <span
                      aria-hidden
                      className="relative h-6 w-10 shrink-0 rounded-full bg-ink/15 transition peer-checked:bg-blue peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-4"
                    />
                    <span className="min-w-0">
                      <span className="block text-[0.88rem] font-medium leading-snug">{a.label}</span>
                      <span className="block text-[0.74rem] text-ink-mute">{a.hint}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>
        </Card>

        <Card>
          <CardHead
            title="Programmes you can prime"
            meta={`${eligible.filter((e) => e.ok).length} of ${PROGRAMS.length} eligible`}
            action={<Badge tone="blue">{unlocked.length} of {OPPORTUNITIES.length} open pursuits biddable</Badge>}
          />
          <ul className="grid gap-2 p-5 sm:grid-cols-2" aria-live="polite">
            {eligible.map((p) => (
              <li
                key={p.name}
                className={cx(
                  "rounded-2xl border p-4 transition",
                  p.ok ? "border-blue/25 bg-blue/[0.05]" : "border-[var(--bp-hairline)] bg-white/40",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold tracking-[-0.015em]">{p.name}</p>
                  <span className={cx("grid size-6 place-items-center rounded-full", p.ok ? "bg-blue text-white" : "bg-ink/[0.07] text-ink-mute")}>
                    {p.ok ? <IconCheck width={13} height={13} /> : <IconX width={13} height={13} />}
                    <span className="sr-only">{p.ok ? "Eligible" : "Not eligible"}</span>
                  </span>
                </div>
                <p className="mt-1 text-[0.76rem] text-ink-mute">
                  {p.ok ? p.note : `Needs ${p.missing.map((m) => ATTRS.find((a) => a.key === m)!.short).join(", ")}`}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Card>
          <CardHead
            title="Top agencies by obligations"
            meta="FY2026 contract obligations, $ billions"
            action={
              <div>
                <label htmlFor="mk-naics" className="sr-only">
                  NAICS code
                </label>
                <select
                  id="mk-naics"
                  value={naics}
                  onChange={(e) => setNaics(e.target.value)}
                  className="h-9 rounded-full border border-[var(--bp-hairline)] bg-white/70 px-3 text-[0.8rem] outline-none focus:border-blue"
                >
                  {Object.keys(NAICS).map((c) => (
                    <option key={c} value={c}>
                      NAICS {c}
                    </option>
                  ))}
                </select>
              </div>
            }
          />
          <div className="p-5">
            <p className="mb-4 text-[0.8rem] text-ink-mute">{NAICS[naics]}</p>
            <ul className="space-y-3">
              {awards.map((a, i) => (
                <li key={a.agency + naics} className="grid grid-cols-[minmax(0,140px)_minmax(0,1fr)_52px] items-center gap-3 text-[0.84rem] sm:grid-cols-[180px_minmax(0,1fr)_56px]">
                  <span className="truncate">{a.agency}</span>
                  <span className="h-6 overflow-hidden rounded-full bg-ink/[0.05]">
                    <span
                      className={cx("grow-x block h-full rounded-full", i === 0 ? "bg-blue" : "bg-blue/45")}
                      style={{ width: `${(a.amount / max) * 100}%`, animationDelay: `${i * 70}ms` }}
                    />
                  </span>
                  <span className="text-right font-semibold tabular-nums">${a.amount.toFixed(1)}B</span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <CardHead title="Agency buying profiles" meta="Where Meridian's codes get bought, and how" />
          <ul className="divide-y divide-[var(--bp-hairline)]">
            {AGENCY_PROFILES.map((p) => (
              <li key={p.agency} className="px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold tracking-[-0.015em]">{p.agency}</p>
                  <Badge>{p.vehicle}</Badge>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-3 text-[0.78rem]">
                  <div>
                    <dt className="text-ink-mute">Small business</dt>
                    <dd className="font-semibold tabular-nums">{p.smallShare}%</dd>
                  </div>
                  <div>
                    <dt className="text-ink-mute">SDVOSB share</dt>
                    <dd className="font-semibold tabular-nums">{p.sdvosbShare}%</dd>
                  </div>
                  <div>
                    <dt className="text-ink-mute">Avg. award</dt>
                    <dd className="font-semibold tabular-nums">{p.avgAward}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-[0.78rem] leading-snug text-ink-mute">
                  Buys in {p.buysIn}. {p.note}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4 overflow-hidden">
        <CardHead title="Incumbents & competitors" meta="Firms holding work in your NAICS codes, from USAspending" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-[0.85rem]">
            <thead>
              <tr className="border-b border-[var(--bp-hairline)] text-[0.68rem] uppercase tracking-[0.1em] text-ink-mute">
                <th scope="col" className="px-5 py-3 font-semibold">Company</th>
                <th scope="col" className="px-3 py-3 font-semibold">Size / status</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">Awards</th>
                <th scope="col" className="px-3 py-3 text-right font-semibold">Obligated (5 yr)</th>
                <th scope="col" className="px-3 py-3 font-semibold">Next recompete</th>
                <th scope="col" className="px-3 py-3 font-semibold">Agencies</th>
                <th scope="col" className="px-5 py-3 font-semibold">Overlap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--bp-hairline)]">
              {INCUMBENTS.map((c) => (
                <tr key={c.name} className="transition hover:bg-white/70">
                  <td className="px-5 py-3.5 font-semibold">{c.name}</td>
                  <td className="px-3 py-3.5 text-ink-mute">{c.status}</td>
                  <td className="px-3 py-3.5 text-right tabular-nums">{c.awards}</td>
                  <td className="px-3 py-3.5 text-right font-medium tabular-nums">{money(c.obligated)}</td>
                  <td className="px-3 py-3.5">{c.recompete}</td>
                  <td className="px-3 py-3.5 text-ink-mute">{c.agencies}</td>
                  <td className="px-5 py-3.5">
                    <Badge tone={c.overlap === "High" ? "bad" : c.overlap === "Medium" ? "warn" : "mute"}>{c.overlap}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="border-t border-[var(--bp-hairline)] px-5 py-3 text-[0.74rem] text-ink-mute">Company names are fictional for the demo.</p>
      </Card>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, Card, CardHead, Dot, Eyebrow, VerdictBadge, btn, cx, pwinTone } from "@/components/ui";
import { IconAlert, IconArrowLeft, IconArrowRight, IconCheck, IconFile, IconPen } from "@/components/Icons";
import { FACTORS, NAICS, OPPORTUNITIES, getOpportunity, pwin, rawScore, verdict } from "@/lib/data";
import { dateFromToday, dueLabel, fmtDate, money, moneyFull } from "@/lib/format";

export function generateStaticParams() {
  return OPPORTUNITIES.map((o) => ({ id: o.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const o = getOpportunity(id);
  return { title: o ? o.title : "Opportunity" };
}

const VERDICT_COPY = {
  Bid: "The calibrated odds clear your 45% bid threshold. Commit capture resources.",
  "Bid with conditions": "Odds are workable but below threshold. Bid only if the conditions below can be closed.",
  "No-bid": "Odds are below 28%. Save the proposal hours for a better-fit pursuit.",
  Team: "Meridian cannot prime under this set-aside. Pursue it as a subcontractor to an eligible prime.",
} as const;

export default async function OpportunityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const o = getOpportunity(id);
  if (!o) notFound();

  const p = pwin(o);
  const raw = rawScore(o);
  const v = verdict(o);
  const due = dateFromToday(o.dueInDays);

  const facts: [string, string][] = [
    ["Notice ID", o.notice],
    ["Notice type", o.type],
    ["Contract type", o.contract],
    ["NAICS", `${o.naics} · ${NAICS[o.naics]}`],
    ["Set-aside", o.setAside],
    ["Estimated value", moneyFull(o.value)],
    ["Response due", `${fmtDate(due, true)} · ${dueLabel(o.dueInDays)}`],
    ["Period of performance", o.pop],
    ["Place of performance", o.place],
    ["Incumbent", o.incumbent ?? "None (new requirement)"],
    ["Source", `${o.source} · posted ${o.postedDaysAgo === 0 ? "today" : `${o.postedDaysAgo}d ago`}`],
  ];

  return (
    <>
      <Link href="/opportunities" className="mb-6 inline-flex items-center gap-1.5 text-[0.84rem] font-medium text-ink-mute transition hover:text-ink">
        <IconArrowLeft width={15} height={15} /> All opportunities
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap gap-1.5">
          <Badge tone={o.setAside === "SDVOSB" ? "blue" : "mute"}>{o.setAside}</Badge>
          <Badge>{o.type}</Badge>
          <Badge>Stage · {o.stage}</Badge>
          {o.isNew && <Badge tone="blue">New today</Badge>}
        </div>
        <h1 className="mt-4 max-w-4xl text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1] tracking-[-0.055em] text-balance">
          {o.title}
          <Dot />
        </h1>
        <p className="mt-3 text-ink-mute">
          {o.agency} · {o.office}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
        <div className="grid min-w-0 content-start gap-4">
          <Card>
            <CardHead title="Summary" meta="Condensed from the solicitation by BytesGov" />
            <div className="p-5">
              <p className="leading-relaxed text-pretty">{o.summary}</p>
              <dl className="mt-5 grid gap-x-6 gap-y-3 border-t border-[var(--bp-hairline)] pt-5 text-[0.86rem] sm:grid-cols-2">
                {facts.map(([k, val]) => (
                  <div key={k} className="min-w-0">
                    <dt className="text-[0.74rem] text-ink-mute">{k}</dt>
                    <dd className="mt-0.5 break-words font-medium">{val}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>

          <Card>
            <CardHead
              title="Win probability breakdown"
              meta="Eight weighted factors, then calibrated against your bid history"
              action={<Badge tone={pwinTone(p)}>{p}% P(win)</Badge>}
            />
            <div className="p-5">
              <ul className="space-y-4">
                {FACTORS.map((f, i) => {
                  const s = o.scores[f.key];
                  const pts = (f.weight * s) / 100;
                  return (
                    <li key={f.key}>
                      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                        <p className="text-[0.9rem] font-medium">
                          {f.label}
                          <span className="ml-2 rounded-full bg-ink/[0.06] px-2 py-0.5 text-[0.68rem] font-semibold text-ink-mute">weight {f.weight}%</span>
                        </p>
                        <p className="text-[0.8rem] tabular-nums text-ink-mute">
                          score <strong className="font-semibold text-ink">{s}</strong> · +{pts.toFixed(1)} pts
                        </p>
                      </div>
                      <div
                        className="mt-2 h-2 overflow-hidden rounded-full bg-ink/[0.07]"
                        role="meter"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={s}
                        aria-label={`${f.label} score`}
                      >
                        <div
                          className={cx("grow-x h-full rounded-full", s >= 70 ? "bg-blue" : s >= 45 ? "bg-blue/45" : s === 0 ? "" : "bg-[#c9483a]")}
                          style={{ width: `${s}%`, animationDelay: `${i * 60}ms` }}
                        />
                      </div>
                      <p className="mt-1.5 text-[0.76rem] text-ink-mute">{s === 0 && f.key === "setAside" ? "Not eligible to prime under this set-aside." : f.hint}</p>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-6 grid gap-3 rounded-2xl border border-[var(--bp-hairline)] bg-paper/70 p-4 text-[0.84rem] sm:grid-cols-3">
                <p>
                  <span className="block text-[0.74rem] text-ink-mute">Weighted score</span>
                  <span className="text-[1.25rem] font-semibold tracking-[-0.03em] tabular-nums">{raw.toFixed(1)} / 100</span>
                </p>
                <p>
                  <span className="block text-[0.74rem] text-ink-mute">Calibrated P(win)</span>
                  <span className="text-[1.25rem] font-semibold tracking-[-0.03em] tabular-nums text-blue">{p}%</span>
                </p>
                <p className="text-[0.76rem] leading-snug text-ink-mute sm:self-center">
                  Calibration maps raw scores onto Meridian&apos;s 31% historical win rate over 48 decided bids.
                </p>
              </div>
            </div>
          </Card>
        </div>

        <aside className="grid content-start gap-4 lg:sticky lg:top-24">
          <Card className="overflow-hidden">
            <div className="border-b border-[var(--bp-hairline)] bg-[radial-gradient(120%_120%_at_0%_0%,#dfe5ff,transparent_70%)] p-5">
              <Eyebrow>Bid / no-bid engine</Eyebrow>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[3.6rem] font-medium leading-none tracking-[-0.06em] tabular-nums">
                    {p}
                    <span className="text-[1.6rem] text-ink-mute">%</span>
                  </p>
                  <p className="mt-1 text-[0.8rem] text-ink-mute">calibrated probability of win</p>
                </div>
                <VerdictBadge v={v} />
              </div>
              <p className="mt-4 text-[0.88rem] leading-relaxed">{VERDICT_COPY[v]}</p>
            </div>
            <div className="space-y-4 p-5">
              <div>
                <p className="text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Working for you</p>
                <ul className="mt-2 space-y-2">
                  {o.notes.good.map((n) => (
                    <li key={n} className="flex gap-2 text-[0.86rem] leading-snug">
                      <IconCheck width={16} height={16} className="mt-0.5 shrink-0 text-[#17663f]" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[0.74rem] font-semibold uppercase tracking-[0.1em] text-ink-mute">Risks</p>
                <ul className="mt-2 space-y-2">
                  {o.notes.risk.map((n) => (
                    <li key={n} className="flex gap-2 text-[0.86rem] leading-snug">
                      <IconAlert width={16} height={16} className="mt-0.5 shrink-0 text-[#a3281b]" />
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="grid gap-2 border-t border-[var(--bp-hairline)] p-5">
              <Link href={`/compliance?opp=${o.id}`} className={btn.primary}>
                <IconFile width={16} height={16} /> Build compliance matrix
              </Link>
              <Link href={`/proposals?opp=${o.id}`} className={btn.ghost}>
                <IconPen width={16} height={16} /> Open in Proposal Studio
              </Link>
            </div>
          </Card>

          <Card as="div" className="p-5 text-[0.84rem]">
            <p className="font-semibold">Market context</p>
            <p className="mt-1 leading-relaxed text-ink-mute">
              {o.incumbent ? `${o.incumbent} holds the current work.` : "No incumbent on record."} Award history and competitor profiles come from
              public USAspending data.
            </p>
            <Link href="/market" className="mt-3 inline-flex items-center gap-1 font-medium text-blue hover:underline">
              Open market intel <IconArrowRight width={14} height={14} />
            </Link>
          </Card>
        </aside>
      </div>
    </>
  );
}

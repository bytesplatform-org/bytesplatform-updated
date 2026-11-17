import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card, CardHead, Meter, PageHeader, VerdictBadge, btn, cx } from "@/components/ui";
import { IconArrowRight, IconSpark } from "@/components/Icons";
import { DEMO_TODAY, NAICS, OPPORTUNITIES, STAGES, pwin, verdict } from "@/lib/data";
import { dateFromToday, dueLabel, fmtDate, fmtShort, money } from "@/lib/format";

export const metadata: Metadata = { title: "Dashboard" };

const STAGE_COLORS: Record<string, string> = {
  Identified: "bg-ink/15",
  Qualifying: "bg-blue/25",
  Capture: "bg-blue/60",
  Proposal: "bg-blue",
  Submitted: "bg-ink",
};

export default function Dashboard() {
  const open = OPPORTUNITIES.filter((o) => o.stage !== "Submitted");
  const pipeline = open.reduce((s, o) => s + o.value, 0);
  const weighted = OPPORTUNITIES.reduce((s, o) => s + (o.value * pwin(o)) / 100, 0);
  const active = OPPORTUNITIES.filter((o) => ["Capture", "Proposal", "Submitted"].includes(o.stage));
  const avg = Math.round(active.reduce((s, o) => s + pwin(o), 0) / active.length);
  const dueWeek = OPPORTUNITIES.filter((o) => o.dueInDays <= 7);
  const fresh = OPPORTUNITIES.filter((o) => o.isNew).sort((a, b) => pwin(b) - pwin(a));
  const upcoming = [...OPPORTUNITIES].sort((a, b) => a.dueInDays - b.dueInDays).slice(0, 6);

  const byStage = STAGES.map((s) => {
    const items = OPPORTUNITIES.filter((o) => o.stage === s);
    return { stage: s, count: items.length, value: items.reduce((t, o) => t + o.value, 0) };
  });
  const total = byStage.reduce((s, x) => s + x.value, 0);

  const kpis = [
    { label: "Open pipeline", value: money(pipeline), note: `${money(weighted)} probability-weighted` },
    { label: "Active bids", value: String(active.length), note: "Capture, proposal and submitted" },
    { label: "Avg. P(win)", value: `${avg}%`, note: "Across active bids · calibrated" },
    { label: "Due this week", value: String(dueWeek.length), note: dueWeek.map((o) => fmtShort(dateFromToday(o.dueInDays))).join(", ") },
  ];

  return (
    <>
      <PageHeader
        eyebrow={fmtDate(DEMO_TODAY, true)}
        title="Good morning, Jordan"
        sub={
          <>
            Overnight, BytesGov scanned SAM.gov, FPDS and two state portals across your five NAICS codes and found{" "}
            <strong className="font-semibold text-ink">{fresh.length} new matches</strong> for Meridian.
          </>
        }
        actions={
          <Link href="/opportunities" className={btn.dark}>
            Review matches <IconArrowRight width={16} height={16} />
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="rise p-5" as="div">
            <p className="text-[0.78rem] font-medium text-ink-mute">{k.label}</p>
            <p className="mt-2 text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-none tracking-[-0.05em] tabular-nums">{k.value}</p>
            <p className="mt-2 text-[0.76rem] text-ink-mute">{k.note}</p>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <Card>
          <CardHead
            title="New this morning"
            meta="Matched to your NAICS codes, certifications and past performance"
            action={<Badge tone="blue">{fresh.length} new</Badge>}
          />
          <ul className="divide-y divide-[var(--bp-hairline)]">
            {fresh.map((o) => (
              <li key={o.id}>
                <Link href={`/opportunities/${o.id}`} className="grid gap-3 px-5 py-4 transition hover:bg-white/70 sm:grid-cols-[minmax(0,1fr)_150px]">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge>{o.source}</Badge>
                      <Badge tone={o.setAside === "SDVOSB" ? "blue" : "mute"}>{o.setAside}</Badge>
                      <VerdictBadge v={verdict(o)} />
                    </div>
                    <p className="mt-2 font-semibold leading-snug tracking-[-0.015em]">{o.title}</p>
                    <p className="mt-0.5 text-[0.82rem] text-ink-mute sm:truncate">
                      {o.agency} · NAICS {o.naics} · {money(o.value)} · due {fmtShort(dateFromToday(o.dueInDays))}
                    </p>
                  </div>
                  <div className="self-center">
                    <p className="mb-1 text-[0.7rem] font-medium uppercase tracking-[0.1em] text-ink-mute">P(win)</p>
                    <Meter value={pwin(o)} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-4">
          <Card>
            <CardHead title="Pipeline by stage" meta={`${OPPORTUNITIES.length} pursuits · ${money(total)} total value`} />
            <div className="p-5">
              <div className="flex h-3 overflow-hidden rounded-full bg-ink/[0.06]" role="img" aria-label="Pipeline value split by stage">
                {byStage.map((s, i) => (
                  <div
                    key={s.stage}
                    className={cx("grow-x h-full", STAGE_COLORS[s.stage], i > 0 && "border-l-2 border-paper")}
                    style={{ width: `${(s.value / total) * 100}%`, animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </div>
              <dl className="mt-5 space-y-2.5">
                {byStage.map((s) => (
                  <div key={s.stage} className="flex items-center gap-3 text-[0.86rem]">
                    <span aria-hidden className={cx("size-2.5 rounded-full", STAGE_COLORS[s.stage])} />
                    <dt className="flex-1">{s.stage}</dt>
                    <dd className="text-ink-mute tabular-nums">{s.count}</dd>
                    <dd className="w-16 text-right font-semibold tabular-nums">{money(s.value)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Card>

          <Card>
            <CardHead title="Upcoming deadlines" meta="Proposal and response due dates" />
            <ul className="divide-y divide-[var(--bp-hairline)]">
              {upcoming.map((o) => {
                const d = dateFromToday(o.dueInDays);
                return (
                  <li key={o.id}>
                    <Link href={`/opportunities/${o.id}`} className="flex items-center gap-4 px-5 py-3 transition hover:bg-white/70">
                      <span
                        className={cx(
                          "grid w-12 shrink-0 place-items-center rounded-xl border py-1.5 text-center leading-none",
                          o.dueInDays <= 7 ? "border-blue/30 bg-blue/[0.07] text-blue" : "border-[var(--bp-hairline)] bg-white/70",
                        )}
                      >
                        <span className="text-[0.62rem] font-semibold uppercase tracking-[0.1em]">{fmtShort(d).split(" ")[0]}</span>
                        <span className="mt-0.5 text-[1.1rem] font-semibold tracking-[-0.03em]">{d.getUTCDate()}</span>
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.88rem] font-medium">{o.title}</span>
                        <span className="block truncate text-[0.76rem] text-ink-mute">
                          {o.type} · {o.stage} · {dueLabel(o.dueInDays)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>

      <Card className="mt-4 overflow-hidden" as="div">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-blue/10 text-blue">
            <IconSpark />
          </span>
          <div className="flex-1">
            <p className="font-semibold tracking-[-0.015em]">Suggested next step</p>
            <p className="mt-0.5 text-[0.88rem] text-ink-mute">
              The Army ECMS solicitation (NAICS {"518210"}, {NAICS["518210"].toLowerCase()}) has no incumbent and fits your CMMC Level 2
              certificate. Build its compliance matrix before the Q&amp;A deadline.
            </p>
          </div>
          <Link href="/compliance?opp=army-cloud-mod" className={btn.primary}>
            Build matrix <IconArrowRight width={16} height={16} />
          </Link>
        </div>
      </Card>
    </>
  );
}

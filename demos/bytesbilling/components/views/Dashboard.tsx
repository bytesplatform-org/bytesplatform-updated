"use client";

import Link from "next/link";
import Countdown from "../Countdown";
import { IconArrowRight } from "../icons";
import { Badge, Card, CardHead, PageHeader } from "../ui";
import { PENALTIES } from "@/lib/data";
import { aed, fmtTime, fmtDate, invoiceTotals, type Tone } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { FtaState, PeppolState } from "@/lib/types";

const PEPPOL: { s: PeppolState; tone: Tone; bar: string }[] = [
  { s: "Queued", tone: "neutral", bar: "bg-[rgb(17_17_17/.18)]" },
  { s: "Sent", tone: "info", bar: "bg-[rgb(36_87_255/.45)]" },
  { s: "Delivered", tone: "ok", bar: "bg-[#6ea683]" },
  { s: "Failed", tone: "bad", bar: "bg-[#c97d74]" },
];
const FTA: { s: FtaState; tone: Tone; bar: string }[] = [
  { s: "Pending", tone: "neutral", bar: "bg-[rgb(17_17_17/.18)]" },
  { s: "Reported", tone: "info", bar: "bg-[rgb(36_87_255/.45)]" },
  { s: "Accepted", tone: "ok", bar: "bg-[#6ea683]" },
  { s: "Rejected", tone: "bad", bar: "bg-[#c97d74]" },
];

function Kpi({ label, value, sub, href }: { label: string; value: string; sub: string; href?: string }) {
  const body = (
    <>
      <p className="text-[0.78rem] text-ink-mute">{label}</p>
      <p className="mt-3 text-[2.4rem] font-medium leading-none tracking-[-0.055em] tabular-nums">{value}</p>
      <p className="mt-3 text-[0.78rem] text-ink-mute">{sub}</p>
    </>
  );
  return href ? (
    <Link href={href} className="card card-pad block transition hover:border-[rgb(36_87_255/.4)]">
      {body}
    </Link>
  ) : (
    <div className="card card-pad">{body}</div>
  );
}

function Bars<T extends string>({ title, rows, counts, total }: { title: string; rows: { s: T; tone: Tone; bar: string }[]; counts: Record<string, number>; total: number }) {
  return (
    <div>
      <p className="mb-4 text-[0.82rem] font-medium">{title}</p>
      <ul className="space-y-3.5">
        {rows.map((r) => {
          const c = counts[r.s] ?? 0;
          return (
            <li key={r.s}>
              <div className="mb-1.5 flex items-center justify-between text-[0.82rem]">
                <Badge tone={r.tone}>{r.s}</Badge>
                <span className="tabular-nums text-ink-mute">{c}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[rgb(17_17_17/.05)]" aria-hidden>
                <div className={`h-full rounded-full ${r.bar}`} style={{ width: `${total ? (c / total) * 100 : 0}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Dashboard() {
  const { invoices, audit } = useStore();
  const total = invoices.length;
  const cutoff = Date.now() - 30 * 86400_000;
  const recent = invoices.filter((i) => new Date(`${i.issueDate}T23:59:59`).getTime() >= cutoff);
  const value = recent.reduce((s, i) => s + invoiceTotals(i.lines).gross, 0);
  const firstPass = total ? Math.round((invoices.filter((i) => i.firstPass).length / total) * 1000) / 10 : 0;
  const accepted = invoices.filter((i) => i.fta === "Accepted").length;
  const open = invoices.filter((i) => i.rejectionCode);
  const openCodes = new Set(open.map((i) => i.rejectionCode)).size;
  const count = <K extends "peppol" | "fta">(k: K) =>
    invoices.reduce<Record<string, number>>((m, i) => ({ ...m, [i[k]]: (m[i[k]] ?? 0) + 1 }), {});
  const deliveredButRejected = invoices.filter((i) => i.peppol === "Delivered" && i.fta === "Rejected").length;

  return (
    <>
      <PageHeader
        eyebrow="Overview"
        title="Good morning, Sara"
        intro="Compliance across every invoice your ERP sends: what passed validation, what the buyer received and what the FTA accepted."
        actions={
          <>
            <Link href="/new" className="pill pill-primary">
              New invoice
            </Link>
            <Link href="/rejections" className="pill">
              Review rejections
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Invoices · last 30 days" value={String(recent.length)} sub={`${aed(value)} incl. VAT`} href="/invoices" />
        <Kpi label="First-pass validation" value={`${firstPass}%`} sub="Passed every PINT AE rule on first try" href="/validator" />
        <Kpi label="FTA accepted" value={`${accepted}/${total}`} sub="Tax Data Document accepted" href="/invoices" />
        <Kpi label="Open rejections" value={String(open.length)} sub={`${openCodes} error code${openCodes === 1 ? "" : "s"} to fix`} href="/rejections" />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHead eyebrow="Two-state tracking" title="Peppol and FTA, tracked separately" />
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            <Bars title="Peppol · buyer delivery" rows={PEPPOL} counts={count("peppol")} total={total} />
            <Bars title="FTA · Tax Data Document" rows={FTA} counts={count("fta")} total={total} />
          </div>
          {deliveredButRejected > 0 && (
            <p className="mt-6 rounded-2xl bg-[#f7e8e6]/70 px-4 py-3 text-[0.84rem] leading-relaxed text-[#7d3029]">
              <strong className="font-semibold">{deliveredButRejected} invoices</strong> reached the buyer but were rejected by the FTA. They are counted as open, not as delivered successes.{" "}
              <Link href="/rejections" className="font-medium underline underline-offset-2">
                Fix them
              </Link>
            </p>
          )}
        </Card>

        <Card className="flex flex-col">
          <CardHead eyebrow="Mandate" title="UAE e-invoicing deadline" />
          <Countdown />
          <ul className="mt-6 space-y-2.5 border-t border-[rgb(17_17_17/.08)] pt-5 text-[0.82rem]">
            {PENALTIES.map((p) => (
              <li key={p.amount} className="flex gap-3">
                <span className="w-[5.6rem] flex-none font-medium">{p.amount}</span>
                <span className="text-ink-mute">
                  {p.per} {p.what}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-5 text-[0.74rem] text-ink-mute">Source: MoF Electronic Invoicing Guidelines v1.1; Cabinet Decision 106 of 2025.</p>
        </Card>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.5fr_1fr]">
        <Card pad={false}>
          <div className="card-pad pb-0">
            <CardHead
              eyebrow="Latest"
              title="Recent invoices"
              aside={
                <Link href="/invoices" className="pill pill-sm pill-quiet">
                  All invoices <IconArrowRight size={14} />
                </Link>
              }
            />
          </div>
          <ul className="px-3 pb-3">
            {invoices.slice(0, 6).map((i) => (
              <li key={i.id}>
                <Link href={`/invoices/${i.id}`} className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-2xl px-3 py-3 transition hover:bg-[rgb(36_87_255/.03)]">
                  <div className="min-w-0 flex-1 basis-[12rem]">
                    <p className="truncate text-[0.88rem] font-medium">{i.buyer.name || "Unnamed buyer"}</p>
                    <p className="text-[0.75rem] text-ink-mute">
                      {i.number} · {fmtDate(i.issueDate)}
                    </p>
                  </div>
                  <span className="text-[0.86rem] tabular-nums">{aed(invoiceTotals(i.lines).gross)}</span>
                  <span className="flex gap-1.5">
                    <Badge tone={PEPPOL.find((p) => p.s === i.peppol)!.tone}>{i.peppol}</Badge>
                    <Badge tone={FTA.find((p) => p.s === i.fta)!.tone}>FTA {i.fta.toLowerCase()}</Badge>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHead eyebrow="Audit log" title="Activity" />
          <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[5px] before:top-2 before:w-px before:bg-[rgb(17_17_17/.1)]">
            {audit.slice(0, 7).map((a) => (
              <li key={a.id} className="relative pl-6">
                <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-white bg-blue shadow-[0_0_0_1px_rgb(36_87_255/.3)]" aria-hidden />
                <p className="text-[0.84rem] leading-snug">{a.action}</p>
                <p className="mt-0.5 text-[0.74rem] text-ink-mute">
                  {a.target} · {a.actor} · {fmtDate(a.at)} {fmtTime(a.at)}
                </p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </>
  );
}

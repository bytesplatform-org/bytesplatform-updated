"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { IconArrowLeft, IconCheck, IconCopy, IconDownload, IconX } from "../icons";
import { Badge, Card, CardHead, Eyebrow, FtaBadge, OutcomeBadge, PeppolBadge } from "../ui";
import { downloadText, useSha256, XmlCode } from "../XmlView";
import { REJECTION_CODES, SELLER } from "@/lib/data";
import { aed, amount, fmtDate, fmtDateTime, invoiceTotals, lineNet, VAT_LABELS, VAT_SHORT } from "@/lib/format";
import { useStore } from "@/lib/store";
import { invoiceToXml, PINT_AE_CUSTOMIZATION } from "@/lib/ubl";
import type { Invoice } from "@/lib/types";

type Step = { label: string; detail: string; status: "done" | "fail" | "pending"; at?: string };

function timeline(inv: Invoice): Step[] {
  const t0 = new Date(inv.createdAt).getTime();
  const at = (m: number) => new Date(t0 + m * 60_000).toISOString();
  const sent = inv.peppol !== "Queued";
  const rej = inv.rejectionCode ? REJECTION_CODES[inv.rejectionCode] : undefined;
  const steps: Step[] = [
    { label: `Created in ${inv.source}`, detail: `Received over HTTPS with key ${inv.idempotencyKey ?? `idem-${inv.number.toLowerCase()}`}`, status: "done", at: at(0) },
    { label: "Validated · PINT AE", detail: "UBL 2.1 schema and UAE VAT rules passed", status: "done", at: at(0.1) },
    { label: "Sent to ASP", detail: "Handed to the accredited service provider", status: sent ? "done" : "pending", at: sent ? at(1) : undefined },
    {
      label: inv.peppol === "Failed" ? "Peppol delivery failed" : "Peppol delivered",
      detail: inv.peppol === "Failed" ? `${inv.rejectionCode}: ${rej?.title ?? ""}` : "Buyer's access point acknowledged receipt",
      status: inv.peppol === "Delivered" ? "done" : inv.peppol === "Failed" ? "fail" : "pending",
      at: inv.peppol === "Delivered" || inv.peppol === "Failed" ? at(3) : undefined,
    },
    {
      label: "FTA reported",
      detail: "Tax Data Document submitted by the ASP",
      status: inv.fta === "Pending" ? "pending" : "done",
      at: inv.fta !== "Pending" ? at(4) : undefined,
    },
    {
      label: inv.fta === "Rejected" ? "FTA rejected" : "FTA accepted",
      detail: inv.fta === "Rejected" ? `${inv.rejectionCode}: ${rej?.title ?? ""}` : "Acknowledged by the FTA platform",
      status: inv.fta === "Accepted" ? "done" : inv.fta === "Rejected" ? "fail" : "pending",
      at: inv.fta === "Accepted" || inv.fta === "Rejected" ? (inv.resubmittedAt ? new Date(new Date(inv.resubmittedAt).getTime() + 90_000).toISOString() : at(26)) : undefined,
    },
  ];
  if (inv.resubmittedAt) {
    steps.splice(5, 0, {
      label: `Resubmitted after ${inv.resolvedCode}`,
      detail: `Idempotency key ${inv.idempotencyKey}: the ASP de-duplicates retries`,
      status: "done",
      at: inv.resubmittedAt,
    });
  }
  return steps;
}

function Detail({ inv }: { inv: Invoice }) {
  const xml = useMemo(() => invoiceToXml(inv, SELLER), [inv]);
  const hash = useSha256(xml);
  const [copied, setCopied] = useState(false);
  const t = invoiceTotals(inv.lines);
  const rej = inv.rejectionCode ? REJECTION_CODES[inv.rejectionCode] : undefined;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <Link href="/invoices" className="mb-6 inline-flex items-center gap-2 text-[0.85rem] font-medium text-ink-mute hover:text-ink">
        <IconArrowLeft size={16} /> Invoices
      </Link>

      <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <Eyebrow>Tax invoice · 380</Eyebrow>
          <h1 className="headline mt-4 break-words text-[clamp(2rem,4.4vw,3.4rem)]">
            {inv.number}
            <span className="dot">.</span>
          </h1>
          <p className="mt-3 text-[0.95rem] text-ink-mute">
            {inv.buyer.name} · issued {fmtDate(inv.issueDate)} · due {fmtDate(inv.dueDate)}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[0.78rem] text-ink-mute">Peppol</span>
          <PeppolBadge state={inv.peppol} />
          <span className="ml-2 text-[0.78rem] text-ink-mute">FTA</span>
          <FtaBadge state={inv.fta} />
          <span className="mx-1 h-5 w-px bg-[rgb(17_17_17/.14)]" aria-hidden />
          <OutcomeBadge inv={inv} />
        </div>
      </header>

      {rej && (
        <div className="mb-3 flex flex-col gap-3 rounded-[1.5rem] border border-[#ecc9c4] bg-[#fbf1ef] p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[0.88rem] font-medium text-[#7d3029]">
              <span className="mono mr-2 rounded-md bg-white/70 px-1.5 py-0.5">{inv.rejectionCode}</span>
              {rej.title}
            </p>
            <p className="mt-1.5 max-w-[48rem] text-[0.84rem] leading-relaxed text-[#7d3029]/85">{rej.hint}</p>
          </div>
          <Link href="/rejections" className="pill pill-sm flex-none">
            Open in worklist
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 xl:grid-cols-[1.55fr_1fr]">
        <div className="min-w-0 space-y-3">
          <Card>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { k: "Seller", p: SELLER },
                { k: "Buyer", p: inv.buyer },
              ].map(({ k, p }) => (
                <div key={k} className="min-w-0">
                  <p className="eyebrow mb-3">{k}</p>
                  <p className="font-medium">{p.name}</p>
                  <p className="mt-1 text-[0.84rem] text-ink-mute">
                    {p.street}, {p.city}
                  </p>
                  <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[0.82rem]">
                    <dt className="text-ink-mute">TRN</dt>
                    <dd className="tabular-nums">{p.trn}</dd>
                    <dt className="text-ink-mute">Peppol ID</dt>
                    <dd className="mono break-all">{p.endpoint}</dd>
                  </dl>
                </div>
              ))}
            </div>
            {inv.poRef && <p className="mt-5 text-[0.82rem] text-ink-mute">Buyer PO reference: {inv.poRef}</p>}
          </Card>

          <Card pad={false}>
            <div className="card-pad pb-2">
              <CardHead eyebrow="Lines" title="Line items" />
            </div>
            <div className="table-wrap">
              <table className="dtable min-w-[640px]">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Description</th>
                    <th scope="col" className="num">
                      Qty
                    </th>
                    <th scope="col" className="num">
                      Unit price
                    </th>
                    <th scope="col">VAT</th>
                    <th scope="col" className="num">
                      Net (AED)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inv.lines.map((l, i) => (
                    <tr key={l.id}>
                      <td className="text-ink-mute">{i + 1}</td>
                      <td>{l.description}</td>
                      <td className="num">{l.qty}</td>
                      <td className="num">{amount(l.unitPrice)}</td>
                      <td>
                        <Badge tone={l.category === "S" ? "info" : "neutral"}>
                          <span title={VAT_LABELS[l.category]}>{VAT_SHORT[l.category]}</span>
                        </Badge>
                      </td>
                      <td className="num">{amount(lineNet(l))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <dl className="ml-auto grid max-w-[22rem] grid-cols-[1fr_auto] gap-x-6 gap-y-2 p-6 text-[0.88rem]">
              <dt className="text-ink-mute">Total without VAT</dt>
              <dd className="num">{aed(t.net)}</dd>
              {t.subtotals.map((g) => (
                <div key={`${g.category}-${g.rate}`} className="contents">
                  <dt className="text-ink-mute">
                    VAT {g.category} · {g.rate}% on {amount(g.taxable)}
                  </dt>
                  <dd className="num">{amount(g.tax)}</dd>
                </div>
              ))}
              <dt className="border-t border-[rgb(17_17_17/.1)] pt-3 font-medium">Total incl. VAT</dt>
              <dd className="num border-t border-[rgb(17_17_17/.1)] pt-3 text-[1.05rem] font-medium">{aed(t.gross)}</dd>
            </dl>
          </Card>

          <Card>
            <CardHead
              eyebrow="UBL 2.1"
              title="PINT AE document"
              aside={
                <button type="button" className="pill pill-sm pill-dark" onClick={() => downloadText(`${inv.number}.xml`, xml)}>
                  <IconDownload size={15} /> Download XML
                </button>
              }
            />
            <div className="mb-4 rounded-2xl border border-[rgb(17_17_17/.08)] bg-[rgb(17_17_17/.02)] p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-[0.78rem] font-medium text-ink-mute">SHA-256 of this XML</p>
                <button type="button" onClick={copy} className="inline-flex items-center gap-1.5 text-[0.76rem] font-medium text-blue" disabled={!hash}>
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />} {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="mono mt-1.5 break-all text-[0.78rem]">{hash || "Computing…"}</p>
            </div>
            <XmlCode xml={xml} />
            <p className="mt-3 text-[0.74rem] leading-relaxed text-ink-mute">
              CustomizationID <span className="mono">{PINT_AE_CUSTOMIZATION}</span> per PINT AE. ProfileID and values are illustrative sample data.
            </p>
          </Card>
        </div>

        <div className="min-w-0 space-y-3">
          <Card>
            <CardHead eyebrow="Lifecycle" title="Timeline" />
            <ol className="space-y-0">
              {timeline(inv).map((s, i, arr) => (
                <li key={s.label} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < arr.length - 1 && (
                    <span
                      className={`absolute left-[13px] top-7 h-[calc(100%-1.5rem)] w-px ${s.status === "done" ? "bg-[rgb(36_87_255/.35)]" : "bg-[rgb(17_17_17/.1)]"}`}
                      aria-hidden
                    />
                  )}
                  <span
                    className={`relative z-[1] grid h-7 w-7 flex-none place-items-center rounded-full ${
                      s.status === "done"
                        ? "bg-blue text-white"
                        : s.status === "fail"
                          ? "bg-[#f7e8e6] text-[#9a3a31]"
                          : "border border-dashed border-[rgb(17_17_17/.25)] bg-white text-ink-mute"
                    }`}
                    aria-hidden
                  >
                    {s.status === "done" ? <IconCheck size={14} /> : s.status === "fail" ? <IconX size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <div className="min-w-0 pt-0.5">
                    <p className={`text-[0.9rem] font-medium ${s.status === "pending" ? "text-ink-mute" : ""}`}>
                      {s.label}
                      <span className="sr-only"> ({s.status === "done" ? "complete" : s.status === "fail" ? "failed" : "pending"})</span>
                    </p>
                    <p className="mt-0.5 break-words text-[0.78rem] text-ink-mute">{s.detail}</p>
                    {s.at && <p className="mt-0.5 text-[0.74rem] text-ink-mute/80">{fmtDateTime(s.at)}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </Card>

          <Card>
            <CardHead eyebrow="Archive" title="Legal record" />
            <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-[0.84rem]">
              <dt className="text-ink-mute">Storage</dt>
              <dd>Write-once · XML + PDF</dd>
              <dt className="text-ink-mute">Retention</dt>
              <dd>{inv.realEstate ? "7 years (real estate)" : "5 years (general)"}</dd>
              <dt className="text-ink-mute">Source</dt>
              <dd>{inv.source}</dd>
              <dt className="text-ink-mute">Validation</dt>
              <dd>{inv.firstPass ? "Passed first time" : "Passed after a local fix"}</dd>
            </dl>
            <Link href="/archive" className="pill pill-sm mt-5">
              View in archive
            </Link>
          </Card>
        </div>
      </div>
    </>
  );
}

export default function InvoiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { invoices, ready } = useStore();
  const inv = invoices.find((i) => i.id === id);
  if (!inv) {
    if (!ready) return <p className="text-ink-mute">Loading…</p>;
    return (
      <Card className="mx-auto max-w-lg text-center">
        <h1 className="text-[1.4rem] font-medium tracking-[-0.03em]">Invoice not found</h1>
        <p className="mt-2 text-ink-mute">It may belong to an earlier demo session.</p>
        <Link href="/invoices" className="pill mt-5">
          Back to invoices
        </Link>
      </Card>
    );
  }
  return <Detail inv={inv} />;
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { IconCheck, IconRefresh, IconWrench } from "../icons";
import { Badge, Card, FtaBadge, PageHeader, PeppolBadge } from "../ui";
import { REJECTION_CODES } from "@/lib/data";
import { aed, fmtDate, fmtDateTime, invoiceTotals } from "@/lib/format";
import { useStore } from "@/lib/store";

export default function Rejections() {
  const { invoices, fixed, fixCode, resubmit } = useStore();
  const [notice, setNotice] = useState<Record<string, string>>({});

  const open = invoices.filter((i) => i.rejectionCode);
  const groups = Object.entries(
    open.reduce<Record<string, typeof open>>((m, i) => ({ ...m, [i.rejectionCode!]: [...(m[i.rejectionCode!] ?? []), i] }), {}),
  ).sort((a, b) => b[1].length - a[1].length);
  const resolved = invoices.filter((i) => i.resolvedCode);

  const doResubmit = (code: string) => {
    const done = resubmit(code);
    setNotice((n) => ({ ...n, [code]: `${done.length} resubmitted. Keys: ${done.map((i) => i.idempotencyKey ?? `idem-${i.number.toLowerCase()}-r1`).join(", ")}` }));
  };

  return (
    <>
      <PageHeader
        eyebrow="Worklist"
        title="Rejections"
        intro="Everything the ASP, Peppol or the FTA sent back, grouped by error code. Fix the master data once, then resubmit the whole group. Retries reuse the same idempotency key, so nothing is duplicated at the provider."
      />

      {groups.length === 0 && (
        <Card className="mb-3 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e9f2ec] text-[#2f6a47]" aria-hidden>
            <IconCheck />
          </span>
          <p className="mt-4 text-[1.2rem] font-medium tracking-[-0.03em]">No open rejections</p>
          <p className="mt-1 text-[0.88rem] text-ink-mute">Every transmitted invoice is delivered and accepted.</p>
        </Card>
      )}

      <div className="space-y-3">
        {groups.map(([code, list]) => {
          const meta = REJECTION_CODES[code];
          const isFixed = !!fixed[code];
          return (
            <Card key={code} pad={false}>
              <div className="card-pad">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 max-w-[48rem]">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="mono rounded-lg bg-[#f7e8e6] px-2 py-1 font-medium text-[#9a3a31]">{code}</span>
                      <Badge tone="neutral">{meta?.side ?? "ASP"} side</Badge>
                      <Badge tone="bad">
                        {list.length} invoice{list.length === 1 ? "" : "s"}
                      </Badge>
                    </div>
                    <h2 className="mt-3 text-[1.35rem] font-medium tracking-[-0.035em]">{meta?.title ?? "Rejected by provider"}</h2>
                    <p className="mt-2 text-[0.9rem] leading-relaxed text-ink-mute">{meta?.hint}</p>
                    <p className="mt-3 flex gap-2 text-[0.86rem]">
                      <IconWrench size={16} className="mt-0.5 flex-none text-blue" />
                      <span>
                        <span className="font-medium">Fix: </span>
                        {meta?.fix}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-none flex-wrap gap-2 lg:flex-col lg:items-stretch">
                    <button type="button" className="pill" onClick={() => fixCode(code)} disabled={isFixed} aria-pressed={isFixed}>
                      {isFixed ? <IconCheck size={16} /> : <IconWrench size={16} />}
                      {isFixed ? "Master data fixed" : "Fix master data"}
                    </button>
                    <button type="button" className="pill pill-primary" onClick={() => doResubmit(code)} disabled={!isFixed} aria-describedby={`${code}-help`}>
                      <IconRefresh size={16} /> Resubmit {list.length > 1 ? `all ${list.length}` : ""}
                    </button>
                    <p id={`${code}-help`} className="text-[0.74rem] text-ink-mute lg:max-w-[12rem] lg:text-center">
                      {isFixed ? "Ready: the same key is reused, so the ASP de-duplicates." : "Fix the data first, or it will be rejected again."}
                    </p>
                  </div>
                </div>
              </div>
              <div className="table-wrap border-t border-[rgb(17_17_17/.08)]">
                <table className="dtable min-w-[680px]">
                  <thead>
                    <tr>
                      <th scope="col">Invoice</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">Buyer TRN</th>
                      <th scope="col" className="num">
                        Amount
                      </th>
                      <th scope="col">Peppol</th>
                      <th scope="col">FTA</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((i) => (
                      <tr key={i.id}>
                        <td>
                          <Link href={`/invoices/${i.id}`} className="font-medium hover:text-blue">
                            {i.number}
                          </Link>
                          <p className="text-[0.74rem] text-ink-mute">{fmtDate(i.issueDate)}</p>
                        </td>
                        <td>{i.buyer.name}</td>
                        <td className="tabular-nums text-ink-mute">{i.buyer.trn}</td>
                        <td className="num">{aed(invoiceTotals(i.lines).gross)}</td>
                        <td>
                          <PeppolBadge state={i.peppol} />
                        </td>
                        <td>
                          <FtaBadge state={i.fta} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          );
        })}
      </div>

      {Object.values(notice).length > 0 && (
        <div role="status" className="sr-only">
          {Object.values(notice).join(". ")}
        </div>
      )}

      {resolved.length > 0 && (
        <Card pad={false} className="mt-3">
          <div className="card-pad pb-3">
            <p className="eyebrow mb-2.5">Resolved</p>
            <h2 className="text-[1.25rem] font-medium tracking-[-0.035em]">Resubmitted and accepted</h2>
          </div>
          <div className="table-wrap">
            <table className="dtable min-w-[720px]">
              <thead>
                <tr>
                  <th scope="col">Invoice</th>
                  <th scope="col">Was</th>
                  <th scope="col">Idempotency key</th>
                  <th scope="col">Resubmitted</th>
                  <th scope="col">Now</th>
                </tr>
              </thead>
              <tbody>
                {resolved.map((i) => (
                  <tr key={i.id} className="anim-in">
                    <td>
                      <Link href={`/invoices/${i.id}`} className="font-medium hover:text-blue">
                        {i.number}
                      </Link>
                    </td>
                    <td className="mono text-ink-mute">{i.resolvedCode}</td>
                    <td className="mono">{i.idempotencyKey}</td>
                    <td className="text-ink-mute">{i.resubmittedAt ? fmtDateTime(i.resubmittedAt) : ""}</td>
                    <td className="space-x-1.5 whitespace-nowrap">
                      <PeppolBadge state={i.peppol} />
                      <FtaBadge state={i.fta} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  );
}

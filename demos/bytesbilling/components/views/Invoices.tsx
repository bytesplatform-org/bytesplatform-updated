"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Card, FtaBadge, OutcomeBadge, PageHeader, PeppolBadge } from "../ui";
import { aed, fmtDate, invoiceTotals, outcome } from "@/lib/format";
import { useStore } from "@/lib/store";

const FILTERS = ["All", "Complete", "In progress", "Needs action"] as const;

export default function Invoices() {
  const { invoices } = useStore();
  const router = useRouter();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return invoices.filter(
      (i) =>
        (filter === "All" || outcome(i).label === filter) &&
        (!needle || `${i.number} ${i.buyer.name} ${i.buyer.trn}`.toLowerCase().includes(needle)),
    );
  }, [invoices, filter, q]);

  return (
    <>
      <PageHeader
        eyebrow="Outbound"
        title="Invoices"
        intro="Peppol delivery and FTA reporting are separate states. An invoice is only complete when the buyer has it and the FTA accepted it."
        actions={
          <Link href="/new" className="pill pill-primary">
            New invoice
          </Link>
        }
      />

      <Card pad={false}>
        <div className="flex flex-col gap-3 border-b border-[rgb(17_17_17/.08)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter by outcome" className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => {
              const n = f === "All" ? invoices.length : invoices.filter((i) => outcome(i).label === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                  className={`pill pill-sm ${filter === f ? "pill-dark" : "pill-quiet"}`}
                >
                  {f} <span className="tabular-nums opacity-60">{n}</span>
                </button>
              );
            })}
          </div>
          <div className="sm:w-72">
            <label htmlFor="search" className="sr-only">
              Search invoices
            </label>
            <input id="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search number, buyer or TRN" className="input min-h-[2.4rem] rounded-full text-[0.85rem]" />
          </div>
        </div>
        <div className="table-wrap">
          <table className="dtable min-w-[880px]">
            <thead>
              <tr>
                <th scope="col">Invoice</th>
                <th scope="col">Buyer</th>
                <th scope="col">Buyer TRN</th>
                <th scope="col" className="num">
                  Amount incl. VAT
                </th>
                <th scope="col">Peppol</th>
                <th scope="col">FTA</th>
                <th scope="col">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((i) => (
                <tr key={i.id} className="row-link" onClick={() => router.push(`/invoices/${i.id}`)}>
                  <td>
                    <Link href={`/invoices/${i.id}`} className="font-medium hover:text-blue" onClick={(e) => e.stopPropagation()}>
                      {i.number}
                    </Link>
                    <p className="text-[0.74rem] text-ink-mute">{fmtDate(i.issueDate)}</p>
                  </td>
                  <td className="max-w-[15rem]">
                    <p className="truncate">{i.buyer.name}</p>
                    <p className="text-[0.74rem] text-ink-mute">{i.buyer.city}</p>
                  </td>
                  <td className="tabular-nums text-ink-mute">{i.buyer.trn}</td>
                  <td className="num">{aed(invoiceTotals(i.lines).gross)}</td>
                  <td>
                    <PeppolBadge state={i.peppol} />
                  </td>
                  <td>
                    <FtaBadge state={i.fta} />
                  </td>
                  <td>
                    <OutcomeBadge inv={i} />
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-ink-mute">
                    No invoices match.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

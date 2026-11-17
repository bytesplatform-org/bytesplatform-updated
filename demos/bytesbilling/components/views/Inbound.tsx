"use client";

import { IconCheck, IconX } from "../icons";
import { Badge, Card, PageHeader } from "../ui";
import type { MatchCheck } from "@/lib/data";
import { aed, fmtDate } from "@/lib/format";
import { useStore } from "@/lib/store";

function Check({ label, status, note, refNo }: { label: string; status: MatchCheck; note?: string; refNo?: string }) {
  const styles = {
    match: "bg-[#e9f2ec] text-[#2f6a47]",
    variance: "bg-[#f7f0e1] text-[#86601d]",
    missing: "bg-[#f7e8e6] text-[#9a3a31]",
  }[status];
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span className={`mt-0.5 grid h-6 w-6 flex-none place-items-center rounded-full text-[0.7rem] font-semibold ${styles}`} aria-hidden>
        {status === "match" ? <IconCheck size={13} strokeWidth={2.4} /> : status === "variance" ? "≈" : <IconX size={13} strokeWidth={2.4} />}
      </span>
      <div className="min-w-0 text-[0.8rem] leading-snug">
        <p className="font-medium">
          {label}
          {refNo && refNo !== "—" && <span className="ml-1.5 font-normal text-ink-mute">{refNo}</span>}
          <span className="sr-only">: {status === "match" ? "matched" : status}</span>
        </p>
        {note && <p className="text-ink-mute">{note}</p>}
      </div>
    </div>
  );
}

export default function Inbound() {
  const { inbound, postInbound } = useStore();
  const isMatched = (i: (typeof inbound)[number]) => i.po.status === "match" && i.grn.status === "match" && i.price.status === "match";
  const posted = inbound.filter((i) => i.posted).length;
  const ready = inbound.filter((i) => !i.posted && isMatched(i)).length;
  const exceptions = inbound.filter((i) => !i.posted && !isMatched(i)).length;

  return (
    <>
      <PageHeader
        eyebrow="Accounts payable"
        title="Inbound"
        intro="Supplier e-invoices arrive over Peppol through the same hub. Each is matched three ways, against the purchase order, the goods receipt and the invoice itself, before it posts to accounts payable."
      />

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { l: "Matched, ready to post", v: ready, tone: "text-ink" },
          { l: "Exceptions to review", v: exceptions, tone: "text-[#86601d]" },
          { l: "Posted to AP", v: posted, tone: "text-ink" },
        ].map((k) => (
          <div key={k.l} className="card card-pad">
            <p className="text-[0.78rem] text-ink-mute">{k.l}</p>
            <p className={`mt-2 text-[2.2rem] font-medium leading-none tracking-[-0.05em] tabular-nums ${k.tone}`}>{k.v}</p>
          </div>
        ))}
      </div>

      <ul className="space-y-3">
        {inbound.map((i) => {
          const ok = isMatched(i);
          return (
            <li key={i.id} className="card card-pad">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,2fr)_auto] lg:items-center">
                <div className="min-w-0">
                  <p className="truncate font-medium">{i.supplier}</p>
                  <p className="mt-0.5 text-[0.78rem] text-ink-mute">
                    {i.number} · received {fmtDate(i.received)}
                  </p>
                  <p className="mt-2 text-[1.05rem] font-medium tabular-nums tracking-[-0.02em]">{aed(i.amount)}</p>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Check label="PO" refNo={i.po.ref} status={i.po.status} note={i.po.note} />
                  <Check label="Goods receipt" refNo={i.grn.ref} status={i.grn.status} note={i.grn.note} />
                  <Check label="Price & qty" status={i.price.status} note={i.price.note} />
                </div>
                <div className="flex items-center gap-2 lg:justify-end">
                  {i.posted ? (
                    <Badge tone="ok">Posted to AP</Badge>
                  ) : ok ? (
                    <button type="button" className="pill pill-sm pill-primary" onClick={() => postInbound(i.id, "Inbound invoice 3-way matched and posted to AP")}>
                      Post to AP
                    </button>
                  ) : (
                    <>
                      <Badge tone="warn">Exception</Badge>
                      <button type="button" className="pill pill-sm" onClick={() => postInbound(i.id, "Exception approved by finance and posted to AP")}>
                        Approve &amp; post
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}

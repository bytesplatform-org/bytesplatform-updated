"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { IconArrowRight, IconCheck, IconPlus, IconTrash } from "../icons";
import RuleList from "../RuleList";
import { Card, CardHead, PageHeader } from "../ui";
import { BUYERS, ERP_NAME, invoiceNumber, SELLER } from "@/lib/data";
import { addDays, aed, amount, invoiceTotals, isoDay, lineNet, VAT_LABELS, VAT_RATES } from "@/lib/format";
import { usePrefersReducedMotion, useStore } from "@/lib/store";
import { invoiceToDoc } from "@/lib/ubl";
import { validateDoc } from "@/lib/rules";
import type { Invoice, Line, VatCategory } from "@/lib/types";

type Draft = { buyerName: string; buyerTrn: string; endpoint: string; city: string; street: string; poRef: string; lines: Line[] };

let lineSeq = 100;
const newLine = (p: Partial<Line> = {}): Line => ({ id: `n${lineSeq++}`, description: "", qty: 1, unitPrice: 0, category: "S", rate: 5, ...p });

/* Starts with deliberate mistakes so the rules have something to say. */
const START: () => Draft = () => ({
  buyerName: "Blue Dune Interiors LLC",
  buyerTrn: "10027654320",
  endpoint: "",
  city: "Dubai",
  street: "Al Quoz 3, Warehouse 18",
  poRef: "BDI-PO-3307",
  lines: [
    newLine({ description: "Industrial LED floodlight 200W", qty: 10, unitPrice: 485 }),
    newLine({ description: "Delivery and on-site installation", qty: 1, unitPrice: 950, rate: 15 }),
    newLine({ description: "", qty: 1, unitPrice: -200 }),
  ],
});

const STEPS = [
  { label: "Built PINT AE XML", detail: "UBL 2.1 document generated and schema-validated" },
  { label: "Sent to ASP", detail: "Submitted with an idempotency key" },
  { label: "Peppol delivered", detail: "Buyer's access point acknowledged" },
  { label: "FTA reported", detail: "Tax Data Document submitted" },
  { label: "FTA accepted", detail: "Acknowledged by the FTA platform" },
] as const;

const FINAL: Pick<Invoice, "peppol" | "fta"> = { peppol: "Delivered", fta: "Accepted" };
const PATCHES: Partial<Invoice>[] = [{}, { peppol: "Sent" }, { peppol: "Delivered" }, { fta: "Reported" }, { fta: "Accepted" }];

function lineIssues(l: Line) {
  const out: string[] = [];
  if (!l.description.trim()) out.push("description");
  if (!(l.qty > 0)) out.push("qty");
  if (!(l.unitPrice >= 0)) out.push("price");
  if (l.category === "S" && l.rate !== 5) out.push("rate");
  if (l.category !== "S" && l.rate !== 0) out.push("rate");
  return out;
}

export default function NewInvoice() {
  const { invoices, addInvoice, updateInvoice, log } = useStore();
  const reduced = usePrefersReducedMotion();
  const [d, setD] = useState<Draft>(START);
  const [phase, setPhase] = useState<"edit" | "sending" | "done">("edit");
  const [step, setStep] = useState(-1);
  const [created, setCreated] = useState<Invoice | null>(null);
  const timers = useRef<number[]>([]);
  const pending = useRef<string | null>(null);

  const nextN = useMemo(() => Math.max(1300, ...invoices.map((i) => Number(i.id) || 0)) + 1, [invoices]);
  const today = isoDay(new Date());
  const number = invoiceNumber(nextN, new Date().getFullYear());

  const buyer = { name: d.buyerName, trn: d.buyerTrn.replace(/\s/g, ""), endpoint: d.endpoint.trim(), street: d.street, city: d.city, emirate: "DU" };
  const results = useMemo(() => validateDoc(invoiceToDoc({ number, issueDate: today, buyer, lines: d.lines }, SELLER), "form"), [d, number, today]); // eslint-disable-line react-hooks/exhaustive-deps
  const errors = results.filter((r) => r.status === "fail");
  const fieldError = (f: string) => errors.find((r) => r.field === f);
  const t = invoiceTotals(d.lines);

  useEffect(
    () => () => {
      timers.current.forEach((x) => clearTimeout(x));
      if (pending.current) updateInvoice(pending.current, FINAL);
    },
    [updateInvoice],
  );

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));
  const setLine = (id: string, patch: Partial<Line>) =>
    setD((p) => ({ ...p, lines: p.lines.map((l) => (l.id === id ? { ...l, ...patch } : l)) }));

  const pickBuyer = (idx: string) => {
    const b = BUYERS[Number(idx)];
    if (!b) return;
    setD((p) => ({ ...p, buyerName: b.name, buyerTrn: b.trn, endpoint: b.endpoint, city: b.city, street: b.street }));
  };

  const fixAll = () =>
    setD((p) => ({
      ...p,
      buyerTrn: "100276543200003",
      endpoint: "0235:100276543200003",
      lines: p.lines
        .map((l) => ({ ...l, rate: VAT_RATES[l.category] }))
        .filter((l) => l.description.trim() || l.unitPrice > 0)
        .map((l) => ({ ...l, unitPrice: Math.abs(l.unitPrice), qty: l.qty > 0 ? l.qty : 1 })),
    }));

  const submit = () => {
    if (errors.length) return;
    const id = String(nextN);
    const now = new Date();
    const inv: Invoice = {
      id,
      number,
      issueDate: today,
      dueDate: isoDay(addDays(now, 30)),
      createdAt: now.toISOString(),
      source: ERP_NAME,
      buyer,
      lines: d.lines,
      peppol: "Queued",
      fta: "Pending",
      firstPass: true,
      poRef: d.poRef || undefined,
      idempotencyKey: `idem-${number.toLowerCase()}`,
    };
    addInvoice(inv);
    log(`Invoice created and validated (${results.length}/${results.length} rules) · sent to ASP`, number);
    pending.current = id;
    setCreated(inv);
    setPhase("sending");
    setStep(0);
    const gap = reduced ? 120 : 850;
    PATCHES.forEach((patch, i) => {
      timers.current.push(
        window.setTimeout(() => {
          if (Object.keys(patch).length) updateInvoice(id, patch);
          setStep(i + 1);
          if (i === PATCHES.length - 1) {
            pending.current = null;
            setPhase("done");
            log("FTA accepted", number, "ASP webhook");
          }
        }, gap * (i + 1)),
      );
    });
  };

  const restart = () => {
    setD({ ...START(), buyerName: "", buyerTrn: "", endpoint: "", street: "", poRef: "", lines: [newLine()] });
    setPhase("edit");
    setStep(-1);
    setCreated(null);
  };

  const lineFail = errors.filter((r) => r.field === "lines");

  return (
    <>
      <PageHeader
        eyebrow="Outbound"
        title="New invoice"
        intro="Raise an invoice as your ERP would. Every keystroke runs the same PINT AE and UAE VAT rules BytesBilling applies before anything reaches your ASP."
      />

      <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1fr)_400px]">
        <form className="min-w-0 space-y-3" onSubmit={(e) => (e.preventDefault(), submit())} aria-label="Invoice">
          <fieldset disabled={phase !== "edit"} className="space-y-3 disabled:opacity-60">
            <Card>
              <CardHead eyebrow="Header" title={number} aside={<span className="text-[0.8rem] text-ink-mute">Issue date {today}</span>} />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <p className="field-label">Seller</p>
                  <div className="input input-readonly flex flex-col justify-center py-2 leading-tight">
                    <span className="text-[0.88rem] text-ink">{SELLER.name}</span>
                    <span className="text-[0.75rem]">TRN {SELLER.trn}</span>
                  </div>
                </div>
                <div>
                  <label htmlFor="pick" className="field-label">
                    Fill from customer master
                  </label>
                  <select id="pick" className="input" defaultValue="" onChange={(e) => pickBuyer(e.target.value)}>
                    <option value="" disabled>
                      Choose a saved customer…
                    </option>
                    {BUYERS.map((b, i) => (
                      <option key={b.trn} value={i}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            <Card>
              <CardHead eyebrow="Buyer" title="Customer details" />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {(
                  [
                    { k: "buyerName", label: "Buyer legal name", field: "buyerName", ph: "e.g. Gulf Horizon Contracting LLC" },
                    { k: "buyerTrn", label: "Buyer TRN", field: "buyerTrn", ph: "15 digits, starts with 100", mode: "numeric" },
                    { k: "endpoint", label: "Peppol endpoint", field: "buyerEndpoint", ph: "0235:100XXXXXXXXXXXX" },
                    { k: "poRef", label: "Buyer PO reference (optional)", ph: "e.g. PO-4471" },
                    { k: "street", label: "Street address", ph: "Building, street, area" },
                    { k: "city", label: "City", ph: "Dubai" },
                  ] as { k: keyof Draft; label: string; field?: string; ph: string; mode?: "numeric" }[]
                ).map((f) => {
                  const err = f.field ? (f.field === "buyerEndpoint" ? fieldError("buyerEndpoint") : fieldError(f.field)) : undefined;
                  return (
                    <div key={f.k}>
                      <label htmlFor={f.k} className="field-label">
                        {f.label}
                      </label>
                      <input
                        id={f.k}
                        className={`input ${f.k === "buyerTrn" || f.k === "endpoint" ? "tabular-nums" : ""}`}
                        value={d[f.k] as string}
                        placeholder={f.ph}
                        inputMode={f.mode}
                        aria-invalid={err ? true : undefined}
                        aria-describedby={err ? `${f.k}-err` : undefined}
                        onChange={(e) => set(f.k, e.target.value as never)}
                      />
                      {err && (
                        <p id={`${f.k}-err`} className="mt-1.5 text-[0.76rem] leading-snug text-[#9a3a31]">
                          <span className="mono font-medium">{err.id}</span> {err.hint}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card>
              <CardHead
                eyebrow="Lines"
                title="Line items"
                aside={
                  <button type="button" className="pill pill-sm" onClick={() => setD((p) => ({ ...p, lines: [...p.lines, newLine()] }))}>
                    <IconPlus size={15} /> Add line
                  </button>
                }
              />
              <div className="hidden grid-cols-[minmax(0,1fr)_72px_116px_150px_70px_104px_40px] gap-2 px-1 pb-2 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-ink-mute md:grid" aria-hidden>
                <span>Description</span>
                <span>Qty</span>
                <span>Unit price</span>
                <span>VAT category</span>
                <span>Rate %</span>
                <span className="text-right">Net</span>
                <span />
              </div>
              <ul className="space-y-2">
                {d.lines.map((l, i) => {
                  const bad = lineIssues(l);
                  const inv = (k: string) => (bad.includes(k) ? true : undefined);
                  return (
                    <li
                      key={l.id}
                      className={`grid grid-cols-2 gap-2 rounded-2xl p-2 md:grid-cols-[minmax(0,1fr)_72px_116px_150px_70px_104px_40px] md:items-center md:p-1 ${bad.length ? "bg-[#fbf1ef]/70" : ""}`}
                    >
                      <div className="col-span-2 md:col-span-1">
                        <label htmlFor={`d-${l.id}`} className="field-label md:sr-only">
                          Line {i + 1} description
                        </label>
                        <input id={`d-${l.id}`} className="input" value={l.description} aria-invalid={inv("description")} placeholder="Item or service" onChange={(e) => setLine(l.id, { description: e.target.value })} />
                      </div>
                      <div>
                        <label htmlFor={`q-${l.id}`} className="field-label md:sr-only">
                          Quantity
                        </label>
                        <input id={`q-${l.id}`} type="number" step="any" className="input tabular-nums" value={Number.isNaN(l.qty) ? "" : l.qty} aria-invalid={inv("qty")} onChange={(e) => setLine(l.id, { qty: e.target.valueAsNumber })} />
                      </div>
                      <div>
                        <label htmlFor={`p-${l.id}`} className="field-label md:sr-only">
                          Unit price (AED)
                        </label>
                        <input id={`p-${l.id}`} type="number" step="0.01" className="input tabular-nums" value={Number.isNaN(l.unitPrice) ? "" : l.unitPrice} aria-invalid={inv("price")} onChange={(e) => setLine(l.id, { unitPrice: e.target.valueAsNumber })} />
                      </div>
                      <div>
                        <label htmlFor={`c-${l.id}`} className="field-label md:sr-only">
                          VAT category
                        </label>
                        <select id={`c-${l.id}`} className="input" value={l.category} onChange={(e) => setLine(l.id, { category: e.target.value as VatCategory, rate: VAT_RATES[e.target.value as VatCategory] })}>
                          {(Object.keys(VAT_LABELS) as VatCategory[]).map((c) => (
                            <option key={c} value={c}>
                              {c} · {VAT_LABELS[c]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor={`r-${l.id}`} className="field-label md:sr-only">
                          VAT rate %
                        </label>
                        <input id={`r-${l.id}`} type="number" step="any" className="input tabular-nums" value={Number.isNaN(l.rate) ? "" : l.rate} aria-invalid={inv("rate")} onChange={(e) => setLine(l.id, { rate: e.target.valueAsNumber })} />
                      </div>
                      <p className="self-center text-right text-[0.88rem] tabular-nums max-md:col-span-2 max-md:text-left">
                        <span className="text-ink-mute md:hidden">Net </span>
                        {Number.isFinite(lineNet(l)) ? amount(lineNet(l)) : "–"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setD((p) => ({ ...p, lines: p.lines.filter((x) => x.id !== l.id) }))}
                        className="grid h-10 w-10 place-items-center justify-self-end rounded-full text-ink-mute hover:bg-[rgb(17_17_17/.05)] hover:text-ink max-md:col-start-2 max-md:row-start-4"
                        aria-label={`Remove line ${i + 1}`}
                      >
                        <IconTrash size={17} />
                      </button>
                    </li>
                  );
                })}
              </ul>
              {d.lines.length === 0 && <p className="rounded-2xl border border-dashed border-[rgb(17_17_17/.2)] p-6 text-center text-[0.86rem] text-ink-mute">No lines yet. Add at least one.</p>}
              {lineFail.length > 0 && (
                <ul className="mt-3 space-y-1 text-[0.78rem] text-[#9a3a31]">
                  {lineFail.map((r) => (
                    <li key={r.id}>
                      <span className="mono font-medium">{r.id}</span> {r.hint}
                    </li>
                  ))}
                </ul>
              )}
              <dl className="ml-auto mt-6 grid max-w-[20rem] grid-cols-[1fr_auto] gap-x-6 gap-y-1.5 border-t border-[rgb(17_17_17/.08)] pt-4 text-[0.88rem]">
                <dt className="text-ink-mute">Total without VAT</dt>
                <dd className="num">{Number.isFinite(t.net) ? amount(t.net) : "–"}</dd>
                <dt className="text-ink-mute">VAT</dt>
                <dd className="num">{Number.isFinite(t.vat) ? amount(t.vat) : "–"}</dd>
                <dt className="font-medium">Total incl. VAT</dt>
                <dd className="num font-medium">{Number.isFinite(t.gross) ? aed(t.gross) : "–"}</dd>
              </dl>
            </Card>
          </fieldset>
        </form>

        <aside className="min-w-0 xl:sticky xl:top-24" aria-label="Validation">
          {phase === "edit" ? (
            <Card>
              <CardHead
                eyebrow="Live validation"
                title={errors.length ? `${errors.length} issue${errors.length === 1 ? "" : "s"} to fix` : "Ready to send"}
                aside={
                  <span className={`badge ${errors.length ? "badge-bad" : "badge-ok"}`} role="status">
                    {results.length - errors.length}/{results.length}
                  </span>
                }
              />
              <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[rgb(17_17_17/.06)]" aria-hidden>
                <div className={`h-full rounded-full transition-all duration-500 ${errors.length ? "bg-[#c97d74]" : "bg-[#6ea683]"}`} style={{ width: `${((results.length - errors.length) / results.length) * 100}%` }} />
              </div>
              <div className="max-h-[min(52vh,520px)] overflow-y-auto pr-1">
                <RuleList results={results} />
              </div>
              <div className="mt-5 space-y-2.5 border-t border-[rgb(17_17_17/.08)] pt-5">
                <button type="button" onClick={submit} disabled={errors.length > 0} aria-describedby="submit-note" className="pill pill-primary w-full min-h-[3rem]">
                  Submit to ASP <IconArrowRight size={16} />
                </button>
                <p id="submit-note" className="text-center text-[0.76rem] text-ink-mute">
                  {errors.length ? "Blocked locally: nothing leaves until every rule passes." : "All rules pass. The ASP will receive a valid PINT AE document."}
                </p>
                {errors.length > 0 && (
                  <button type="button" onClick={fixAll} className="pill pill-sm pill-quiet w-full">
                    Apply suggested fixes
                  </button>
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <CardHead eyebrow={phase === "done" ? "Complete" : "Transmitting"} title={phase === "done" ? "Delivered and accepted" : "Sending to ASP…"} />
              <ol className="space-y-4" aria-live="polite">
                {STEPS.map((s, i) => {
                  const state = step > i ? "done" : step === i ? "active" : "todo";
                  return (
                    <li key={s.label} className={`flex gap-3 ${state === "todo" ? "opacity-45" : ""}`}>
                      <span
                        className={`grid h-7 w-7 flex-none place-items-center rounded-full ${state === "done" ? "bg-blue text-white" : "border border-[rgb(36_87_255/.35)] text-blue"}`}
                        aria-hidden
                      >
                        {state === "done" ? <IconCheck size={14} /> : state === "active" ? <span className="anim-spin h-3.5 w-3.5 rounded-full border-2 border-blue border-t-transparent" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                      </span>
                      <div>
                        <p className="text-[0.9rem] font-medium">
                          {s.label}
                          <span className="sr-only"> {state === "done" ? "complete" : state === "active" ? "in progress" : "waiting"}</span>
                        </p>
                        <p className="text-[0.78rem] text-ink-mute">{s.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
              {phase === "done" && created && (
                <div className="anim-in mt-6 space-y-2.5 border-t border-[rgb(17_17_17/.08)] pt-5">
                  <p className="text-[0.84rem] text-ink-mute">
                    {created.number} is in the invoice list and the archive, with key <span className="mono">{created.idempotencyKey}</span>.
                  </p>
                  <Link href={`/invoices/${created.id}`} className="pill pill-primary w-full">
                    View invoice <IconArrowRight size={16} />
                  </Link>
                  <button type="button" onClick={restart} className="pill w-full">
                    Create another
                  </button>
                </div>
              )}
            </Card>
          )}
        </aside>
      </div>
    </>
  );
}

"use client";

import { useMemo, useState } from "react";
import { IconShield, IconUpload } from "../icons";
import RuleList from "../RuleList";
import { Card, CardHead, PageHeader } from "../ui";
import { buildSeedInvoices, SELLER } from "@/lib/data";
import { aed } from "@/lib/format";
import { validateDoc } from "@/lib/rules";
import { invoiceToXml, parseXml } from "@/lib/ubl";
import type { RuleResult } from "@/lib/types";

function samples() {
  const inv = buildSeedInvoices(new Date()).find((i) => i.id === "1299")!;
  const good = invoiceToXml(inv, SELLER);
  return [
    { id: "valid", label: "Valid invoice", xml: good },
    { id: "trn", label: "Bad buyer TRN", xml: invoiceToXml(inv, SELLER, { buyerTrn: "20073419020" }) },
    { id: "totals", label: "Wrong totals", xml: invoiceToXml(inv, SELLER, { taxInclusive: 21_637.5, payable: 21_637.5 }) },
  ];
}

type Outcome = { error?: string; results?: RuleResult[]; summary?: string };

function run(xml: string): Outcome {
  const { doc, error } = parseXml(xml);
  if (!doc) return { error };
  return {
    results: validateDoc(doc, "xml"),
    summary: `${doc.number || "No number"} · ${doc.buyer.name || "no buyer"} · ${Number.isFinite(doc.totals.taxInclusive) ? aed(doc.totals.taxInclusive) : "no total"}`,
  };
}

export default function Validator() {
  const list = useMemo(samples, []);
  const [xml, setXml] = useState(list[1].xml);
  const [active, setActive] = useState<string | null>("trn");
  const [out, setOut] = useState<Outcome>(() => run(list[1].xml));

  const load = (id: string) => {
    const s = list.find((x) => x.id === id)!;
    setXml(s.xml);
    setActive(id);
    setOut(run(s.xml));
  };

  const onFile = async (f: File | undefined) => {
    if (!f) return;
    const text = await f.text();
    setXml(text);
    setActive(null);
    setOut(run(text));
  };

  const fails = out.results?.filter((r) => r.status === "fail").length ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Compliance engine"
        title="Validator"
        intro="Paste any UBL 2.1 invoice, from your ERP or a supplier, and see exactly which PINT AE and UAE VAT rules it would fail before an ASP ever sees it. Runs entirely in your browser."
      />
      <div className="grid grid-cols-1 items-start gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card className="min-w-0">
          <CardHead eyebrow="Input" title="Invoice XML" />
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Load a sample">
            {list.map((s) => (
              <button key={s.id} type="button" onClick={() => load(s.id)} aria-pressed={active === s.id} className={`pill pill-sm ${active === s.id ? "pill-dark" : ""}`}>
                {s.label}
              </button>
            ))}
            <label className="pill pill-sm pill-quiet cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-blue">
              <IconUpload size={15} /> Upload .xml
              <input type="file" accept=".xml,application/xml,text/xml" className="sr-only" onChange={(e) => onFile(e.target.files?.[0])} />
            </label>
          </div>
          <label htmlFor="xml" className="sr-only">
            Invoice XML
          </label>
          <textarea
            id="xml"
            value={xml}
            onChange={(e) => {
              setXml(e.target.value);
              setActive(null);
            }}
            spellCheck={false}
            className="mono h-[28rem] w-full resize-y rounded-2xl border border-[rgb(17_17_17/.12)] bg-[#11131c] p-4 text-[0.76rem] leading-relaxed text-[#d7dae8] focus:border-blue focus:outline-none focus:ring-4 focus:ring-[rgb(36_87_255/.15)]"
          />
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => setOut(run(xml))} className="pill pill-primary">
              <IconShield size={16} /> Validate
            </button>
            <button
              type="button"
              onClick={() => {
                setXml("");
                setActive(null);
                setOut({});
              }}
              className="pill"
            >
              Clear
            </button>
          </div>
        </Card>

        <Card className="min-w-0" >
          <CardHead
            eyebrow="Result"
            title={out.error ? "Could not read the document" : out.results ? (fails ? `${fails} rule${fails === 1 ? "" : "s"} failed` : "Valid PINT AE invoice") : "Nothing validated yet"}
            aside={
              out.results && (
                <span className={`badge ${fails ? "badge-bad" : "badge-ok"}`}>
                  {out.results.length - fails}/{out.results.length} passed
                </span>
              )
            }
          />
          <div role="status" aria-live="polite">
            {out.error && <p className="rounded-2xl bg-[#fbf1ef] p-4 text-[0.86rem] text-[#7d3029]">{out.error}</p>}
            {out.results && (
              <>
                <p className="mb-4 text-[0.84rem] text-ink-mute">{out.summary}</p>
                {fails > 0 ? (
                  <p className="mb-4 rounded-2xl border border-[#ecc9c4] bg-white p-4 text-[0.84rem] leading-relaxed">
                    <strong className="font-medium">Blocked.</strong> BytesBilling would stop this document locally and send the hints below to the finance team instead of letting the ASP reject it.
                  </p>
                ) : (
                  <p className="mb-4 rounded-2xl bg-[#e9f2ec] p-4 text-[0.84rem] leading-relaxed text-[#2f6a47]">Every rule passed. This document would be handed to the ASP for Peppol exchange and FTA reporting.</p>
                )}
                <RuleList results={out.results} />
              </>
            )}
            {!out.error && !out.results && <p className="text-[0.88rem] text-ink-mute">Load a sample or paste XML, then press Validate.</p>}
          </div>
        </Card>
      </div>
    </>
  );
}

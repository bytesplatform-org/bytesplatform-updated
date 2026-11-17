"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import { Badge, Card, CardHead, PageHeader, btn, cx } from "./ui";
import { IconAlert, IconArrowRight, IconCheck, IconDownload, IconFile, IconPen, IconUpload } from "./Icons";
import { CLAUSES, EXTRACTION_STEPS, MATRIX, SAMPLE_RFP, getOpportunity, type MatrixRow, type MatrixStatus } from "@/lib/data";

type Phase = "idle" | "extracting" | "done";
const OWNERS = ["D. Okafor", "R. Lindqvist", "A. Reyes", "M. Haddad", "J. Castillo", "Unassigned"];
const STATUS_TONE = { Covered: "good", Partial: "warn", Gap: "bad" } as const;

function reducedMotion() {
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  } catch {
    return false;
  }
}

function toCsv(rows: MatrixRow[]) {
  const head = ["Req ID", "Requirement", "Source section", "Clause", "Status", "Owner", "Response / evidence"];
  const esc = (s: string) => `"${s.replace(/"/g, '""')}"`;
  return [head, ...rows.map((r) => [r.id, r.requirement, r.section, r.clause, r.status, r.owner, r.response])]
    .map((line) => line.map(esc).join(","))
    .join("\r\n");
}

export function ComplianceView() {
  const params = useSearchParams();
  const linked = getOpportunity(params.get("opp") ?? "");
  const [phase, setPhase] = useState<Phase>("idle");
  const [step, setStep] = useState(0);
  const [fileName, setFileName] = useState(SAMPLE_RFP.file);
  const [drag, setDrag] = useState(false);
  const [rows, setRows] = useState<MatrixRow[]>(MATRIX);
  const [filter, setFilter] = useState<"All" | MatrixStatus>("All");
  const timers = useRef<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), []);

  function run(name = SAMPLE_RFP.file) {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
    setFileName(name);
    setRows(MATRIX);
    setFilter("All");
    setPhase("extracting");
    setStep(0);
    const each = reducedMotion() ? 120 : 750;
    EXTRACTION_STEPS.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setStep(i + 1), each * (i + 1)));
    });
    timers.current.push(
      window.setTimeout(() => {
        setPhase("done");
        requestAnimationFrame(() => resultsRef.current?.focus());
      }, each * (EXTRACTION_STEPS.length + 1)),
    );
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    run(f ? f.name : SAMPLE_RFP.file);
  }

  const counts = useMemo(
    () => ({
      Covered: rows.filter((r) => r.status === "Covered").length,
      Partial: rows.filter((r) => r.status === "Partial").length,
      Gap: rows.filter((r) => r.status === "Gap").length,
    }),
    [rows],
  );
  const shown = filter === "All" ? rows : rows.filter((r) => r.status === filter);
  const score = Math.round(((counts.Covered + counts.Partial * 0.5) / rows.length) * 100);

  function exportCsv() {
    const blob = new Blob(["﻿" + toCsv(rows)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ECMS_compliance_matrix_DEMO.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function setOwner(id: string, owner: string) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, owner } : r)));
  }
  function cycleStatus(id: string) {
    const next: Record<MatrixStatus, MatrixStatus> = { Gap: "Partial", Partial: "Covered", Covered: "Gap" };
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status: next[r.status] } : r)));
  }

  return (
    <>
      <PageHeader
        eyebrow="Contract analysis & compliance"
        title="Compliance matrix"
        sub="Drop in a solicitation. BytesGov extracts every shall-statement, maps Sections L and M, checks FAR and DFARS clauses, and flags the gaps before your reviewers do."
        actions={
          phase === "done" ? (
            <>
              <button type="button" onClick={exportCsv} className={btn.primary}>
                <IconDownload width={16} height={16} /> Export CSV
              </button>
              <button type="button" onClick={() => setPhase("idle")} className={btn.ghost}>
                New upload
              </button>
            </>
          ) : undefined
        }
      />

      {linked && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-2xl border border-blue/20 bg-blue/[0.05] px-4 py-3 text-[0.84rem]">
          <IconFile width={16} height={16} className="text-blue" />
          <span>
            Opened from <strong className="font-semibold">{linked.title}</strong>
            {linked.id !== SAMPLE_RFP.oppId && <span className="text-ink-mute"> · the demo uses the sample ECMS solicitation for every pursuit</span>}
          </span>
        </div>
      )}

      {phase === "idle" && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          className={cx(
            "rise relative grid place-items-center rounded-[26px] border-2 border-dashed px-6 py-16 text-center transition sm:py-20",
            drag ? "border-blue bg-blue/[0.06]" : "border-ink/15 bg-white/50",
          )}
        >
          <span className="grid size-14 place-items-center rounded-full bg-blue/10 text-blue">
            <IconUpload width={24} height={24} />
          </span>
          <p className="mt-5 text-[1.35rem] font-medium tracking-[-0.04em]">Drop a solicitation here</p>
          <p className="mt-1.5 max-w-md text-[0.9rem] text-ink-mute">
            PDF, DOCX or a SAM.gov notice link. In this demo, files never leave your browser and the sample matrix is shown.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <button type="button" onClick={() => run()} className={btn.primary}>
              Load sample RFP <IconArrowRight width={16} height={16} />
            </button>
            <button type="button" onClick={() => inputRef.current?.click()} className={btn.ghost}>
              Choose a file
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="sr-only"
              tabIndex={-1}
              aria-label="Choose a solicitation file"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) run(f.name);
                e.target.value = "";
              }}
            />
          </div>
          <p className="mt-6 text-[0.76rem] text-ink-mute">Sample: {SAMPLE_RFP.file} · {SAMPLE_RFP.pages} pages</p>
        </div>
      )}

      {phase === "extracting" && (
        <Card className="rise mx-auto max-w-2xl">
          <CardHead title="Analysing solicitation" meta={fileName} />
          <div className="p-5">
            <div className="h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
              <div className="h-full rounded-full bg-blue transition-[width] duration-700" style={{ width: `${(step / EXTRACTION_STEPS.length) * 100}%` }} />
            </div>
            <ol className="mt-5 space-y-3" aria-live="polite">
              {EXTRACTION_STEPS.map((s, i) => {
                const state = i < step ? "done" : i === step ? "active" : "todo";
                return (
                  <li key={s.label} className={cx("flex items-start gap-3 transition", state === "todo" && "opacity-40")}>
                    <span
                      className={cx(
                        "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border",
                        state === "done" ? "border-blue bg-blue text-white" : "border-ink/20",
                      )}
                    >
                      {state === "done" ? (
                        <IconCheck width={13} height={13} />
                      ) : state === "active" ? (
                        <span className="spin size-3.5 rounded-full border-2 border-blue/30 border-t-blue" />
                      ) : null}
                    </span>
                    <span>
                      <span className="block text-[0.92rem] font-medium">{s.label}</span>
                      {state !== "todo" && <span className="block text-[0.8rem] text-ink-mute">{s.detail}</span>}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </Card>
      )}

      {phase === "done" && (
        <div ref={resultsRef} tabIndex={-1} className="rise outline-none">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Card as="div" className="p-5">
              <p className="text-[0.78rem] font-medium text-ink-mute">Compliance coverage</p>
              <p className="mt-2 text-[2.2rem] font-medium leading-none tracking-[-0.05em] tabular-nums">{score}%</p>
              <p className="mt-2 text-[0.76rem] text-ink-mute">{rows.length} requirements mapped</p>
            </Card>
            {(["Covered", "Partial", "Gap"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFilter(filter === s ? "All" : s)}
                aria-pressed={filter === s}
                className={cx(
                  "rounded-[22px] border bg-white/65 p-5 text-left transition hover:bg-white",
                  filter === s ? "border-ink" : "border-[var(--bp-hairline)]",
                )}
              >
                <p className="flex items-center justify-between text-[0.78rem] font-medium text-ink-mute">
                  {s} <Badge tone={STATUS_TONE[s]}>{s === "Gap" ? "Action" : s === "Partial" ? "Review" : "Ready"}</Badge>
                </p>
                <p className="mt-2 text-[2.2rem] font-medium leading-none tracking-[-0.05em] tabular-nums">{counts[s]}</p>
                <p className="mt-2 text-[0.76rem] text-ink-mute">{filter === s ? "Showing only these · click to clear" : "Click to filter"}</p>
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
            <Card className="min-w-0 overflow-hidden">
              <CardHead
                title="Requirements matrix"
                meta={`${fileName} · Sections C, I, K, L and M`}
                action={
                  <div className="flex flex-wrap gap-1" role="group" aria-label="Filter by status">
                    {(["All", "Covered", "Partial", "Gap"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setFilter(f)}
                        aria-pressed={filter === f}
                        className={cx(
                          "rounded-full px-3 py-1 text-[0.78rem] font-medium transition",
                          filter === f ? "bg-ink text-paper" : "text-ink-mute hover:bg-ink/[0.05] hover:text-ink",
                        )}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                }
              />
              <div className="hidden grid-cols-[64px_minmax(0,1fr)_120px_92px_130px] gap-4 border-b border-[var(--bp-hairline)] px-5 py-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-ink-mute lg:grid">
                <span>Ref</span>
                <span>Requirement</span>
                <span>Source</span>
                <span>Status</span>
                <span>Owner</span>
              </div>
              <ul className="divide-y divide-[var(--bp-hairline)]">
                {shown.map((r) => (
                  <li key={r.id} className="grid gap-x-4 gap-y-2 px-5 py-4 lg:grid-cols-[64px_minmax(0,1fr)_120px_92px_130px] lg:items-start">
                    <span className="text-[0.8rem] font-semibold tabular-nums text-ink-mute">{r.id}</span>
                    <div className="min-w-0">
                      <p className="text-[0.88rem] font-medium leading-snug">{r.requirement}</p>
                      <p className="mt-1 text-[0.78rem] text-ink-mute">{r.response}</p>
                      {r.clause && <p className="mt-1.5 inline-block rounded-md bg-ink/[0.05] px-1.5 py-0.5 font-mono text-[0.72rem]">{r.clause}</p>}
                    </div>
                    <span className="text-[0.8rem] text-ink-mute">
                      <span className="lg:hidden">Source: </span>
                      {r.section}
                    </span>
                    <div className="flex flex-wrap items-center gap-3 lg:contents">
                      <button type="button" onClick={() => cycleStatus(r.id)} title="Click to change status" aria-label={`Status ${r.status}, click to change`} className="justify-self-start">
                        <Badge tone={STATUS_TONE[r.status]} className="transition hover:brightness-95">
                          {r.status === "Gap" && <IconAlert width={11} height={11} />}
                          {r.status}
                        </Badge>
                      </button>
                      <div>
                        <label htmlFor={`owner-${r.id}`} className="sr-only">
                          Owner for {r.id}
                        </label>
                        <select
                          id={`owner-${r.id}`}
                          value={r.owner}
                          onChange={(e) => setOwner(r.id, e.target.value)}
                          className={cx(
                            "h-8 w-[130px] rounded-full border border-[var(--bp-hairline)] bg-white/70 px-3 text-[0.78rem] outline-none focus:border-blue",
                            r.owner === "Unassigned" && "text-[#a3281b]",
                          )}
                        >
                          {OWNERS.map((o) => (
                            <option key={o}>{o}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <div className="grid content-start gap-4">
              <Card>
                <CardHead title="Clauses detected" meta={`${CLAUSES.length} shown of 27 incorporated`} />
                <ul className="divide-y divide-[var(--bp-hairline)]">
                  {CLAUSES.map((c) => (
                    <li key={c.id} className="px-5 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[0.76rem] font-semibold">{c.id}</span>
                        {c.action ? <Badge tone="warn">Action</Badge> : <Badge tone="good">Met</Badge>}
                      </div>
                      <p className="mt-1 text-[0.78rem] leading-snug text-ink-mute">{c.name}</p>
                    </li>
                  ))}
                </ul>
              </Card>
              <Card as="div" className="p-5">
                <p className="font-semibold tracking-[-0.015em]">Next: write to the matrix</p>
                <p className="mt-1 text-[0.84rem] text-ink-mute">Proposal Studio uses this matrix as the outline, so every section answers a requirement.</p>
                <Link href="/proposals?opp=army-cloud-mod" className={cx(btn.dark, "mt-4 w-full")}>
                  <IconPen width={16} height={16} /> Open in Proposal Studio
                </Link>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

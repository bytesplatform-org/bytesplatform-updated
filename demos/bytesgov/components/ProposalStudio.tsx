"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Badge, Card, PageHeader, btn, cx } from "./ui";
import { IconAlert, IconCheck, IconDownload, IconFile, IconLock, IconShieldCheck, IconSpark, IconX } from "./Icons";
import { SECTIONS, WIN_THEMES, getOpportunity, type Section } from "@/lib/data";

type Attestation = { name: string; role: string; hash: string; at: string; snapshot: string };

const XREF: Record<string, { id: string; status: "Covered" | "Partial" | "Gap"; text: string }[]> = {
  exec: [
    { id: "M.2.1", status: "Covered", text: "Technical approach weighted above price" },
    { id: "I.19", status: "Covered", text: "CMMC Level 2 at time of award" },
  ],
  tech: [
    { id: "C.3.1", status: "Covered", text: "Wave plan within 60 days" },
    { id: "C.3.4", status: "Partial", text: "Zero-trust reference architecture" },
    { id: "C.3.7", status: "Covered", text: "Continuous ATO artefacts" },
  ],
  mgmt: [{ id: "M.2.3", status: "Partial", text: "Transition-in risk assessment" }],
  staff: [{ id: "C.5.2", status: "Gap", text: "Cloud Architect with active Secret clearance" }],
  pp: [{ id: "L.6.1", status: "Partial", text: "Three references over $5M within five years" }],
  price: [{ id: "L.8.3", status: "Covered", text: "Limitations on Subcontracting calculation" }],
};

const ROLES = ["Capture lead", "Proposal manager", "Contracts manager", "Program manager", "Chief executive"];

async function sha256(text: string) {
  const data = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function serialise(sections: Section[], texts: Record<string, string>) {
  return sections.map((s) => `${s.volume}\n${s.title}\n\n${texts[s.id] ?? ""}`).join("\n\n---\n\n");
}

const words = (t: string) => (t.trim() ? t.trim().split(/\s+/).length : 0);

export function ProposalStudio() {
  const params = useSearchParams();
  const opp = getOpportunity(params.get("opp") ?? "") ?? getOpportunity("army-cloud-mod")!;
  const [texts, setTexts] = useState<Record<string, string>>(() => Object.fromEntries(SECTIONS.map((s) => [s.id, s.text])));
  const [active, setActive] = useState(SECTIONS[0].id);
  const [att, setAtt] = useState<Attestation | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const doc = useMemo(() => serialise(SECTIONS, texts), [texts]);
  const stale = att !== null && att.snapshot !== doc;
  const state: "draft" | "attested" | "stale" = !att ? "draft" : stale ? "stale" : "attested";
  const section = SECTIONS.find((s) => s.id === active)!;
  const edited = (id: string) => texts[id] !== SECTIONS.find((s) => s.id === id)!.text;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    const close = () => setErr(null);
    d.addEventListener("close", close);
    return () => d.removeEventListener("close", close);
  }, []);

  function openAttest() {
    dialog.current?.showModal();
    requestAnimationFrame(() => nameRef.current?.focus());
  }

  async function attest(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const role = String(f.get("role") ?? ROLES[0]);
    if (!name) return;
    setBusy(true);
    try {
      const hash = await sha256(doc);
      const now = new Date();
      const at = `${now.toISOString().slice(0, 10)} ${now.toTimeString().slice(0, 5)}`;
      setAtt({ name, role, hash, at, snapshot: doc });
      dialog.current?.close();
    } catch {
      setErr("This browser could not compute SHA-256 (crypto.subtle needs HTTPS or localhost).");
    } finally {
      setBusy(false);
    }
  }

  function exportDraft() {
    if (!att || stale) return;
    const header = `ATTESTED by ${att.name} (${att.role}) at ${att.at}\nsha256 ${att.hash}\n${opp.title} · ${opp.notice}\nDEMO DOCUMENT: sample content only\n\n`;
    const blob = new Blob([header + doc], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ECMS_proposal_attested_DEMO.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  const volumes = Array.from(new Set(SECTIONS.map((s) => s.volume)));
  const short = (h: string) => `${h.slice(0, 8)}…${h.slice(-6)}`;

  return (
    <>
      <PageHeader
        eyebrow="Proposal Studio"
        title="Draft, review, attest"
        sub={
          <>
            {opp.title} · <span className="whitespace-nowrap">{opp.notice}</span>. AI drafts every section from your compliance matrix and
            capability library; nothing leaves as final until a named person signs for it.
          </>
        }
        actions={
          <>
            <button type="button" onClick={openAttest} className={state === "attested" ? btn.ghost : btn.primary}>
              <IconShieldCheck width={16} height={16} /> {state === "draft" ? "Attest draft" : state === "stale" ? "Re-attest" : "Attest again"}
            </button>
            <button type="button" onClick={exportDraft} disabled={state !== "attested"} className={btn.dark} title={state !== "attested" ? "Attest the current draft to export" : undefined}>
              <IconDownload width={16} height={16} /> Export
            </button>
          </>
        }
      />

      {/* attestation banner */}
      <div
        role="status"
        aria-live="polite"
        className={cx(
          "mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border px-4 py-3 text-[0.86rem]",
          state === "draft" && "border-ink bg-ink text-paper",
          state === "attested" && "border-[#17663f]/20 bg-[#e3f3ea] text-[#10462c]",
          state === "stale" && "border-[#8a5a00]/25 bg-[#fbf0dc] text-[#5e3d00]",
        )}
      >
        {state === "draft" && (
          <>
            <span className="inline-flex items-center gap-2 font-semibold tracking-[0.06em]">
              <IconLock width={16} height={16} /> DRAFT — NOT FOR SUBMISSION
            </span>
            <span className="text-paper/70">AI-assisted content. A named reviewer must attest before this can be exported.</span>
          </>
        )}
        {state === "attested" && att && (
          <>
            <span className="inline-flex items-center gap-2 font-semibold">
              <IconCheck width={16} height={16} /> Attested by {att.name}
            </span>
            <span className="min-w-0 break-all">
              {att.role} · {att.at} · <span className="font-mono text-[0.8rem]">sha256 {short(att.hash)}</span>
            </span>
          </>
        )}
        {state === "stale" && att && (
          <>
            <span className="inline-flex items-center gap-2 font-semibold">
              <IconAlert width={16} height={16} /> Attestation stale
            </span>
            <span className="min-w-0 break-all">
              The draft changed after {att.name} attested <span className="font-mono text-[0.8rem]">sha256 {short(att.hash)}</span>. Re-attest to export.
            </span>
          </>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[280px_minmax(0,1fr)_280px]">
        {/* outline */}
        <Card as="aside" className="h-max p-3">
          <p className="px-2 pb-2 pt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-mute">Outline</p>
          <nav aria-label="Proposal outline">
            {volumes.map((v) => (
              <div key={v} className="mb-2">
                <p className="px-2 py-1.5 text-[0.78rem] font-semibold">{v}</p>
                <ul className="ml-2 border-l border-[var(--bp-hairline)] pl-2">
                  {SECTIONS.filter((s) => s.volume === v).map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setActive(s.id)}
                        aria-current={active === s.id ? "true" : undefined}
                        className={cx(
                          "flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[0.84rem] transition",
                          active === s.id ? "bg-blue/[0.09] font-semibold text-blue" : "text-ink/80 hover:bg-ink/[0.04]",
                        )}
                      >
                        <span className="min-w-0 flex-1 truncate">{s.title}</span>
                        {edited(s.id) && <span className="size-1.5 shrink-0 rounded-full bg-[#d99a1e]" title="Edited" aria-label="edited" />}
                        <span className="shrink-0 text-[0.7rem] tabular-nums text-ink-mute">{words(texts[s.id])}w</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="mt-2 border-t border-[var(--bp-hairline)] px-2 pt-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-ink-mute">Win themes</p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {WIN_THEMES.map((t) => (
                <li key={t}>
                  <Badge tone="blue">{t}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        {/* editor */}
        <Card className="min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--bp-hairline)] px-5 py-4">
            <div className="min-w-0">
              <p className="text-[0.74rem] text-ink-mute">{section.volume}</p>
              <h2 className="text-[1.15rem] font-semibold tracking-[-0.03em]">{section.title}</h2>
            </div>
            <div className="flex items-center gap-2 text-[0.76rem] text-ink-mute">
              <span>{section.pages}</span>
              <span aria-hidden>·</span>
              <span className="tabular-nums">{words(texts[active])} words</span>
              {edited(active) && (
                <button
                  type="button"
                  onClick={() => setTexts((t) => ({ ...t, [active]: section.text }))}
                  className="ml-1 rounded-full px-2 py-0.5 font-medium text-ink underline decoration-ink/20 underline-offset-2 hover:decoration-blue"
                >
                  Revert
                </button>
              )}
            </div>
          </div>
          <div className="relative">
            {state !== "attested" && (
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 grid select-none place-items-center overflow-hidden text-[clamp(3rem,9vw,7rem)] font-semibold tracking-[-0.04em] text-ink/[0.035]"
              >
                <span className="-rotate-[18deg] whitespace-nowrap">DRAFT</span>
              </span>
            )}
            <label htmlFor="draft-editor" className="sr-only">
              {section.title} draft text
            </label>
            <textarea
              id="draft-editor"
              value={texts[active]}
              onChange={(e) => setTexts((t) => ({ ...t, [active]: e.target.value }))}
              spellCheck
              className="relative block min-h-[460px] w-full resize-y bg-transparent px-5 py-5 text-[0.97rem] leading-[1.75] text-ink outline-none sm:px-8 sm:py-7"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2 border-t border-[var(--bp-hairline)] px-5 py-3 text-[0.76rem] text-ink-mute">
            <IconSpark width={14} height={14} className="text-blue" />
            Drafted from 3 past-performance records and 14 boilerplate blocks. Edits are tracked against the attested hash.
          </div>
        </Card>

        {/* cross reference */}
        <Card as="aside" className="h-max lg:col-span-2 xl:col-span-1">
          <div className="border-b border-[var(--bp-hairline)] px-5 py-4">
            <h2 className="text-[1.02rem] font-semibold tracking-[-0.02em]">Requirements answered</h2>
            <p className="mt-0.5 text-[0.8rem] text-ink-mute">From the compliance matrix</p>
          </div>
          <ul className="divide-y divide-[var(--bp-hairline)]">
            {(XREF[active] ?? []).map((x) => (
              <li key={x.id} className="flex items-start gap-3 px-5 py-3">
                <IconFile width={16} height={16} className="mt-0.5 shrink-0 text-ink-mute" />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.8rem] font-semibold tabular-nums">{x.id}</p>
                  <p className="text-[0.8rem] leading-snug text-ink-mute">{x.text}</p>
                </div>
                <Badge tone={x.status === "Covered" ? "good" : x.status === "Partial" ? "warn" : "bad"}>{x.status}</Badge>
              </li>
            ))}
          </ul>
          <div className="border-t border-[var(--bp-hairline)] px-5 py-4 text-[0.78rem] leading-relaxed text-ink-mute">
            Attestation pins the reviewer&apos;s name to a SHA-256 hash of the full draft. Change one character and the attestation goes stale.
          </div>
        </Card>
      </div>

      <dialog
        ref={dialog}
        aria-labelledby="attest-title"
        className="m-auto w-[min(460px,calc(100vw-32px))] rounded-[24px] border border-[var(--bp-hairline)] bg-paper p-0 text-ink shadow-[0_30px_80px_-30px_rgb(17_17_17/0.5)]"
      >
        <form onSubmit={attest} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 id="attest-title" className="text-[1.6rem] font-medium leading-none tracking-[-0.05em]">
                Attest this draft<span className="text-blue">.</span>
              </h2>
              <p className="mt-2 text-[0.86rem] text-ink-mute">
                Your name is recorded against a hash of all {SECTIONS.length} sections ({words(doc)} words) in the audit log.
              </p>
            </div>
            <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-ink/5">
              <IconX width={16} height={16} />
            </button>
          </div>
          <div className="mt-6 space-y-4">
            <div>
              <label htmlFor="att-name" className="mb-1.5 block text-[0.82rem] font-medium">
                Reviewer name
              </label>
              <input
                ref={nameRef}
                id="att-name"
                name="name"
                required
                defaultValue="Jordan Castillo"
                autoComplete="name"
                className="h-11 w-full rounded-2xl border border-[var(--bp-hairline)] bg-white px-4 outline-none focus:border-blue focus:ring-4 focus:ring-blue/10"
              />
            </div>
            <div>
              <label htmlFor="att-role" className="mb-1.5 block text-[0.82rem] font-medium">
                Role
              </label>
              <select
                id="att-role"
                name="role"
                defaultValue={ROLES[0]}
                className="h-11 w-full rounded-2xl border border-[var(--bp-hairline)] bg-white px-4 outline-none focus:border-blue focus:ring-4 focus:ring-blue/10"
              >
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <label className="flex items-start gap-3 rounded-2xl border border-[var(--bp-hairline)] bg-white/70 p-3.5 text-[0.84rem] leading-snug">
              <input type="checkbox" required className="mt-0.5 size-4 accent-[#2457ff]" />
              I have reviewed the full draft, including AI-generated content, and accept responsibility for it.
            </label>
            {err && <p className="text-[0.82rem] text-[#a3281b]">{err}</p>}
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => dialog.current?.close()} className={btn.ghost}>
              Cancel
            </button>
            <button type="submit" disabled={busy} className={btn.primary}>
              <IconShieldCheck width={16} height={16} /> {busy ? "Hashing…" : "Attest & sign"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}

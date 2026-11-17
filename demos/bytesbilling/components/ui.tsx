import type { ReactNode } from "react";
import { ftaTone, outcome, peppolTone, type Tone } from "@/lib/format";
import type { FtaState, Invoice, PeppolState } from "@/lib/types";

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow ${className}`}>{children}</p>;
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  actions,
}: {
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 md:mb-10 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="headline mt-4 text-[clamp(2.1rem,4.4vw,3.6rem)]">
          {title}
          <span className="dot">.</span>
        </h1>
        {intro && <p className="mt-4 max-w-[46rem] text-[0.98rem] leading-relaxed text-ink-mute">{intro}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2.5">{actions}</div>}
    </header>
  );
}

export function Badge({ tone, children, className = "" }: { tone: Tone; children: ReactNode; className?: string }) {
  return <span className={`badge badge-${tone} ${className}`}>{children}</span>;
}

export function PeppolBadge({ state }: { state: PeppolState }) {
  return (
    <Badge tone={peppolTone[state]}>
      <span className="sr-only">Peppol: </span>
      {state}
    </Badge>
  );
}

export function FtaBadge({ state }: { state: FtaState }) {
  return (
    <Badge tone={ftaTone[state]}>
      <span className="sr-only">FTA: </span>
      {state}
    </Badge>
  );
}

export function OutcomeBadge({ inv }: { inv: Pick<Invoice, "peppol" | "fta"> }) {
  const o = outcome(inv);
  return <Badge tone={o.tone}>{o.label}</Badge>;
}

export function Card({ children, className = "", pad = true }: { children: ReactNode; className?: string; pad?: boolean }) {
  return <section className={`card ${pad ? "card-pad" : ""} ${className}`}>{children}</section>;
}

export function CardHead({ eyebrow, title, aside }: { eyebrow?: string; title: ReactNode; aside?: ReactNode }) {
  return (
    <div className="mb-5 flex items-start justify-between gap-4">
      <div className="min-w-0">
        {eyebrow && <Eyebrow className="mb-2.5">{eyebrow}</Eyebrow>}
        <h2 className="text-[1.25rem] font-medium tracking-[-0.035em]">{title}</h2>
      </div>
      {aside}
    </div>
  );
}

export function DemoBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border border-dashed border-[rgb(36_87_255/.4)] bg-[rgb(36_87_255/.05)] px-3 py-1 text-[0.72rem] font-medium text-blue ${className}`}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-blue" />
      Demo workspace · sample data
    </span>
  );
}

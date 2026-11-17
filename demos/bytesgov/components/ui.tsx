import type { ReactNode } from "react";
import type { Verdict } from "@/lib/data";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-mute", className)}>
      <span aria-hidden className="size-1.5 rounded-full bg-blue" />
      {children}
    </p>
  );
}

export function Dot() {
  return <span className="text-blue">.</span>;
}

export function PageHeader({
  eyebrow,
  title,
  sub,
  actions,
}: {
  eyebrow: string;
  title: ReactNode;
  sub?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
      <div className="min-w-0 max-w-3xl">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-3 text-[clamp(2rem,4.2vw,3.25rem)] font-medium leading-[0.98] tracking-[-0.055em] text-balance">
          {title}
          <Dot />
        </h1>
        {sub && <p className="mt-3 max-w-2xl text-[0.98rem] leading-relaxed text-ink-mute text-pretty">{sub}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
  );
}

export function Card({
  children,
  className,
  as: As = "section",
}: {
  children: ReactNode;
  className?: string;
  as?: "section" | "div" | "article" | "aside";
}) {
  return <As className={cx("rounded-[22px] border border-[var(--bp-hairline)] bg-white/65 backdrop-blur-sm", className)}>{children}</As>;
}

export function CardHead({ title, meta, action }: { title: ReactNode; meta?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--bp-hairline)] px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-[1.02rem] font-semibold tracking-[-0.02em]">{title}</h2>
        {meta && <p className="mt-0.5 text-[0.8rem] text-ink-mute">{meta}</p>}
      </div>
      {action}
    </div>
  );
}

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full bg-blue px-5 py-2.5 text-[0.9rem] font-medium text-white transition hover:bg-[#1c46d6] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
  dark:
    "inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-2.5 text-[0.9rem] font-medium text-paper transition hover:bg-black active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
  ghost:
    "inline-flex items-center justify-center gap-2 rounded-full border border-[var(--bp-hairline)] bg-white/60 px-5 py-2.5 text-[0.9rem] font-medium text-ink transition hover:border-ink/40 hover:bg-white active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
  small:
    "inline-flex items-center justify-center gap-1.5 rounded-full border border-[var(--bp-hairline)] bg-white/60 px-3 py-1.5 text-[0.8rem] font-medium text-ink transition hover:border-ink/40 hover:bg-white",
};

type Tone = "blue" | "ink" | "good" | "warn" | "bad" | "mute";

const TONES: Record<Tone, string> = {
  blue: "bg-blue/10 text-blue border-blue/20",
  ink: "bg-ink text-paper border-ink",
  good: "bg-[#e3f3ea] text-[#17663f] border-[#17663f]/15",
  warn: "bg-[#fbf0dc] text-[#8a5a00] border-[#8a5a00]/15",
  bad: "bg-[#fbe5e2] text-[#a3281b] border-[#a3281b]/15",
  mute: "bg-ink/[0.05] text-ink-mute border-[var(--bp-hairline)]",
};

export function Badge({ tone = "mute", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[0.72rem] font-semibold tracking-[-0.005em]",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function pwinTone(p: number): Tone {
  if (p >= 45) return "good";
  if (p >= 28) return "warn";
  return "bad";
}

export function Meter({ value, label, className }: { value: number; label?: string; className?: string }) {
  const tone = value >= 45 ? "bg-blue" : value >= 28 ? "bg-[#d99a1e]" : "bg-[#c9483a]";
  return (
    <div className={cx("flex items-center gap-2.5", className)}>
      <div
        role="meter"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-label={label ?? "Probability of win"}
        className="h-1.5 w-full min-w-14 overflow-hidden rounded-full bg-ink/[0.08]"
      >
        <div className={cx("h-full rounded-full", tone)} style={{ width: `${value}%` }} />
      </div>
      <span className="w-9 shrink-0 text-right text-[0.85rem] font-semibold tabular-nums">{value}%</span>
    </div>
  );
}

export function VerdictBadge({ v }: { v: Verdict }) {
  const tone: Tone = v === "Bid" ? "good" : v === "Bid with conditions" ? "warn" : v === "Team" ? "blue" : "bad";
  return <Badge tone={tone}>{v === "Team" ? "Team as sub" : v}</Badge>;
}

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-blue/25 bg-blue/[0.07] px-2.5 py-1 text-[0.7rem] font-semibold text-blue",
        className,
      )}
    >
      <span aria-hidden className="size-1.5 rounded-full bg-blue demo-pulse" />
      Demo workspace · sample data
    </span>
  );
}

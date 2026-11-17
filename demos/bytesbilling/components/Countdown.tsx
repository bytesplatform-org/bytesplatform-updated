"use client";

import { MILESTONES, nextMilestone } from "@/lib/data";
import { fmtDate } from "@/lib/format";
import { useNow } from "@/lib/store";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), mins: Math.floor((s % 3600) / 60) };
}

/** Countdown to the next mandate milestone, computed from the viewer's clock. */
export function useMandate() {
  const now = useNow(30_000);
  const m = nextMilestone(now ?? new Date(MILESTONES[0].date));
  const ms = now ? new Date(m.date).getTime() - now.getTime() : null;
  return { now, milestone: m, left: ms === null ? null : parts(ms) };
}

export default function Countdown({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { milestone, left } = useMandate();
  const units: [string, number | undefined][] = [
    ["days", left?.days],
    ["hrs", left?.hours],
    ["min", left?.mins],
  ];
  const mute = tone === "dark" ? "text-white/60" : "text-ink-mute";
  return (
    <div>
      <p className={`text-[0.8rem] ${mute}`}>
        Next deadline · <span className={tone === "dark" ? "text-white" : "text-ink"}>{milestone.label}</span>
      </p>
      <div className="mt-2 flex items-end gap-4" aria-live="off">
        {units.map(([label, v]) => (
          <div key={label} className="flex items-baseline gap-1">
            <span className="text-[2rem] font-medium tabular-nums tracking-[-0.05em]">
              {v === undefined ? "––" : String(v).padStart(label === "days" ? 1 : 2, "0")}
            </span>
            <span className={`text-[0.75rem] ${mute}`}>{label}</span>
          </div>
        ))}
      </div>
      <p className={`mt-1 text-[0.75rem] ${mute}`}>
        {fmtDate(milestone.date.slice(0, 10))} · {milestone.who}
      </p>
    </div>
  );
}

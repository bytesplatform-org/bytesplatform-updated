import { IconCheck, IconX } from "./icons";
import type { RuleResult } from "@/lib/types";

export default function RuleList({ results, showPassed = true }: { results: RuleResult[]; showPassed?: boolean }) {
  const ordered = [...results.filter((r) => r.status === "fail"), ...(showPassed ? results.filter((r) => r.status === "pass") : [])];
  return (
    <ul className="space-y-1.5">
      {ordered.map((r) => (
        <li
          key={r.id}
          className={`flex gap-3 rounded-2xl px-3 py-2.5 ${r.status === "fail" ? "bg-[#fbf1ef]" : ""}`}
        >
          <span
            className={`mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full ${
              r.status === "pass" ? "bg-[#e9f2ec] text-[#2f6a47]" : "bg-[#f3d9d5] text-[#9a3a31]"
            }`}
            aria-hidden
          >
            {r.status === "pass" ? <IconCheck size={12} strokeWidth={2.4} /> : <IconX size={12} strokeWidth={2.4} />}
          </span>
          <div className="min-w-0">
            <p className="text-[0.84rem] leading-snug">
              <span className={`mono mr-2 font-medium ${r.status === "fail" ? "text-[#9a3a31]" : "text-ink-mute"}`}>{r.id}</span>
              <span className={r.status === "pass" ? "text-ink/80" : "font-medium text-ink"}>{r.title}</span>
              <span className="sr-only">: {r.status === "pass" ? "passed" : "failed"}</span>
            </p>
            {r.status === "fail" && r.hint && <p className="mt-1 text-[0.8rem] leading-relaxed text-[#7d3029]/90">{r.hint}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

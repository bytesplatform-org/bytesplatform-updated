import { cx } from "./ui";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cx("size-8 shrink-0", className)} aria-hidden="true">
      <rect width="32" height="32" rx="9" fill="#2457ff" />
      <path d="M7 12.2L16 7l9 5.2" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14.5v8M14 14.5v8M18 14.5v8M22 14.5v8" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M7.5 25h17" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function Logo({ className, sub = true }: { className?: string; sub?: boolean }) {
  return (
    <span className={cx("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[1.08rem] font-semibold tracking-[-0.04em]">
          BytesGov<span className="text-blue">.</span>
        </span>
        {sub && <span className="mt-1 text-[0.64rem] font-medium tracking-[0.02em] text-ink-mute">by BytesPlatform</span>}
      </span>
    </span>
  );
}

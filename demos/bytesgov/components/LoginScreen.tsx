"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CapitolArt } from "./CapitolArt";
import { Logo } from "./Logo";
import { IconArrowLeft, IconArrowRight, IconEye, IconEyeOff, IconLock, IconShieldCheck, IconSpark, IconCheck } from "./Icons";
import { Dot, DemoBadge, btn, cx } from "./ui";
import { setSignedIn } from "@/lib/session";
import { SITE_URL } from "@/lib/format";

const BADGES = [
  { icon: IconLock, label: "Secure by design" },
  { icon: IconSpark, label: "AI-powered" },
  { icon: IconCheck, label: "Proven results" },
];

export function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("demo@bytesgov.com");
  const [password, setPassword] = useState("demo-workspace-2026");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setSignedIn(email || "demo@bytesgov.com");
    router.push("/dashboard");
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.08fr_1fr]">
      {/* ---------- brand panel ---------- */}
      <section className="relative isolate flex min-h-[540px] flex-col overflow-hidden border-b border-[var(--bp-hairline)] bg-[radial-gradient(120%_90%_at_15%_0%,#d9e0ff_0%,#e6e9fb_45%,#f0f1fa_100%)] px-6 pb-8 pt-6 sm:px-10 lg:min-h-dvh lg:border-b-0 lg:border-r lg:px-14 lg:pb-12 lg:pt-10">
        <CapitolArt className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[78%] w-full opacity-90" />
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(240_241_250/0)_35%,rgb(240_241_250/0.72)_100%)]" />

        <div className="flex items-center justify-between gap-4">
          <Logo />
          <DemoBadge className="hidden sm:inline-flex" />
        </div>

        <div className="mt-auto max-w-xl pt-16">
          <p className="mb-5 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">
            <span aria-hidden className="size-1.5 rounded-full bg-blue" />
            Federal contracting intelligence
          </p>
          <h1 className="text-[clamp(2.7rem,6.2vw,5.2rem)] font-medium leading-[0.92] tracking-[-0.06em]">
            Know your odds
            <br />
            <em className="font-medium italic text-blue">before you bid</em>
            <Dot />
          </h1>
          <p className="mt-6 max-w-md text-[1.02rem] leading-relaxed text-ink/75 text-pretty">
            Calibrated win probability, compliance matrices and proposal drafts for every contract you pursue.
          </p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {BADGES.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--bp-hairline)] bg-white/70 px-3.5 py-1.5 text-[0.8rem] font-medium backdrop-blur"
              >
                <Icon width={14} height={14} className="text-blue" />
                {label}
              </li>
            ))}
          </ul>
          <p className="mt-10 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8rem] text-ink-mute">
            <IconShieldCheck width={15} height={15} className="text-blue" />
            Tenant-isolated, encrypted at rest, audited.
            <Link href="/trust" className="font-medium text-ink underline decoration-ink/25 underline-offset-4 hover:decoration-blue">
              Trust &amp; Security
            </Link>
          </p>
        </div>
      </section>

      {/* ---------- sign-in panel ---------- */}
      <section className="flex flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-10">
        <div className="flex justify-end">
          <DemoBadge className="sm:hidden" />
        </div>
        <div className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
          <h2 className="text-[2.4rem] font-medium leading-none tracking-[-0.055em]">
            Welcome back<Dot />
          </h2>
          <p className="mt-2 text-ink-mute">Sign in to your account</p>

          <form onSubmit={submit} className="mt-9 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-[0.82rem] font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-2xl border border-[var(--bp-hairline)] bg-white px-4 text-[0.95rem] outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
              />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="password" className="block text-[0.82rem] font-medium">
                  Password
                </label>
                <span className="text-[0.78rem] text-ink-mute">Any password works in the demo</span>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={show ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-[var(--bp-hairline)] bg-white pl-4 pr-12 text-[0.95rem] outline-none transition focus:border-blue focus:ring-4 focus:ring-blue/10"
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  aria-label={show ? "Hide password" : "Show password"}
                  aria-pressed={show}
                  className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-mute transition hover:bg-ink/5 hover:text-ink"
                >
                  {show ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={busy} className={cx(btn.primary, "h-12 w-full text-[0.98rem]")}>
              {busy ? (
                <>
                  <span aria-hidden className="spin size-4 rounded-full border-2 border-white/40 border-t-white" />
                  Signing in
                </>
              ) : (
                <>
                  Sign in <IconArrowRight width={17} height={17} />
                </>
              )}
            </button>
          </form>

          <Link
            href="/dashboard"
            className="mt-4 text-center text-[0.88rem] font-medium text-ink-mute underline decoration-ink/20 underline-offset-4 transition hover:text-ink hover:decoration-blue"
          >
            Explore without signing in
          </Link>

          <p className="mx-auto mt-10 inline-flex items-center gap-2 rounded-full border border-[var(--bp-hairline)] bg-white/60 px-3.5 py-1.5 text-[0.74rem] font-medium text-ink-mute">
            <IconShieldCheck width={14} height={14} className="text-blue" />
            Veteran owned &amp; operated · Secured platform
          </p>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 text-[0.78rem] text-ink-mute">
          <a href={SITE_URL} className="inline-flex items-center gap-1.5 font-medium transition hover:text-ink">
            <IconArrowLeft width={14} height={14} /> bytesplatform.com
          </a>
          <span>Sample data only. Not affiliated with any agency.</span>
        </footer>
      </section>
    </main>
  );
}

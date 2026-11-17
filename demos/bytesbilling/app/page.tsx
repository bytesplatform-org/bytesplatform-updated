"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import Countdown from "@/components/Countdown";
import { IconArrowLeft, IconArrowRight, IconLock } from "@/components/icons";
import LoginArt from "@/components/LoginArt";
import { DemoBadge } from "@/components/ui";
import { SESSION_KEY } from "@/lib/store";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bytesplatform.com";

function signIn() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* storage blocked: the demo still works */
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    signIn();
    router.push("/dashboard");
  };

  return (
    <main className="grid min-h-dvh grid-cols-1 gap-3 p-3 lg:grid-cols-[1.08fr_1fr]">
      {/* Left: brand panel */}
      <section className="relative flex flex-col overflow-hidden rounded-[2rem] border border-[rgb(17_17_17/.08)] bg-[radial-gradient(120%_80%_at_0%_0%,#dfe5ff_0%,rgba(223,229,255,0)_60%),radial-gradient(90%_70%_at_100%_100%,#e4e9ff_0%,rgba(228,233,255,0)_55%),#f7f8fd] px-6 pb-7 pt-7 sm:px-10 sm:pt-9 lg:px-12">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2.5 text-[0.95rem] font-semibold tracking-[-0.02em]">
            <svg width="26" height="26" viewBox="0 0 32 32" aria-hidden>
              <rect width="32" height="32" rx="9" fill="#fff" />
              <path d="M6 24c4.8 0 6.4-16 11.2-16 4 0 5.4 6.4 8.8 6.4" fill="none" stroke="#2457ff" strokeWidth="3.2" strokeLinecap="round" />
            </svg>
            BytesBilling
          </span>
          <DemoBadge className="hidden sm:inline-flex" />
        </div>

        <div className="mt-10 lg:mt-14">
          <p className="eyebrow">UAE e-invoicing compliance</p>
          <h1 className="headline mt-5 text-[clamp(2.5rem,5.4vw,4.6rem)]">
            Every invoice,
            <br />
            <em className="font-medium not-italic text-ink-mute">valid before it leaves</em>
            <span className="dot">.</span>
          </h1>
          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Capabilities">
            {["PINT AE validated", "Peppol-ready", "FTA-reportable"].map((t) => (
              <li key={t} className="rounded-full border border-[rgb(17_17_17/.12)] bg-white/70 px-3.5 py-1.5 text-[0.8rem] font-medium backdrop-blur">
                {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="mx-auto my-8 w-full max-w-[560px] lg:my-auto lg:py-6">
          <LoginArt />
        </div>

        <div className="mt-auto flex flex-col gap-4 rounded-[1.4rem] border border-[rgb(17_17_17/.08)] bg-white/70 p-5 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <Countdown />
          <p className="max-w-[17rem] text-[0.78rem] leading-relaxed text-ink-mute">
            Penalties start at AED 5,000 a month for missing the mandate, and AED 100 per late invoice.
          </p>
        </div>
      </section>

      {/* Right: form */}
      <section className="flex flex-col px-4 py-8 sm:px-10 lg:px-16">
        <div className="flex justify-end sm:hidden">
          <DemoBadge />
        </div>
        <div className="mx-auto my-auto w-full max-w-[420px] py-8">
          <p className="eyebrow">Sign in</p>
          <h2 className="headline mt-4 text-[clamp(2.2rem,4vw,3rem)]">
            Welcome back<span className="dot">.</span>
          </h2>
          <p className="mt-3 text-[0.95rem] text-ink-mute">Al Noor Trading LLC (demo) · finance workspace</p>

          <form onSubmit={submit} className="mt-9 space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="field-label">
                Work email
              </label>
              <input id="email" name="email" type="email" autoComplete="username" defaultValue="finance@demo-trading.ae" className="input min-h-[3.25rem]" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="field-label">
                  Password
                </label>
                <span className="mb-1.5 text-[0.75rem] text-ink-mute">Any password works</span>
              </div>
              <input id="password" name="password" type="password" autoComplete="current-password" defaultValue="demo-password" className="input min-h-[3.25rem]" />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="group flex min-h-[3.75rem] w-full items-center justify-between rounded-full bg-blue py-2 pl-7 pr-2 text-[0.98rem] font-medium text-white shadow-[0_14px_36px_rgb(36_87_255/.28)] transition hover:bg-[#1d47d9] disabled:opacity-70"
            >
              {busy ? "Signing in…" : "Sign in"}
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-blue transition-transform group-hover:translate-x-0.5">
                <IconArrowRight />
              </span>
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3 text-[0.8rem] text-ink-mute">
            <span className="h-px flex-1 bg-[rgb(17_17_17/.12)]" />
            or
            <span className="h-px flex-1 bg-[rgb(17_17_17/.12)]" />
          </div>
          <Link
            href="/dashboard"
            onClick={signIn}
            className="mt-5 flex min-h-[3.25rem] w-full items-center justify-center gap-2 rounded-full border border-[rgb(17_17_17/.14)] bg-white text-[0.92rem] font-medium transition hover:border-[rgb(17_17_17/.3)]"
          >
            Explore without signing in
          </Link>

          <p className="mt-8 flex items-start gap-2 text-[0.76rem] leading-relaxed text-ink-mute">
            <IconLock size={15} className="mt-0.5 flex-none" />
            Demo workspace. Every company, TRN and amount is fictional, and nothing is sent to an ASP, Peppol or the FTA.
          </p>
        </div>

        <footer className="mx-auto w-full max-w-[420px]">
          <a href={SITE} className="inline-flex items-center gap-2 text-[0.85rem] font-medium text-ink-mute transition hover:text-ink">
            <IconArrowLeft size={16} /> bytesplatform.com
          </a>
        </footer>
      </section>
    </main>
  );
}

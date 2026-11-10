"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroNav from "@/components/hero/HeroNav";
import ActionPill from "@/components/ui/ActionPill";
import SiteFooter from "@/components/sections/SiteFooter";
import { capabilities, erps, faqs, milestones, penalties, phases, problem, roles, sources, steps } from "@/data/einvoicing";
import { emailPattern, sendContactMessage } from "@/lib/contact";
import { fontsReady, prefersReducedMotion } from "@/lib/animation/prefs";
import { mountScroll } from "@/lib/animation/scroll";
import { mountFooterLift } from "@/lib/animation/footerLift";
// The submit button wears the site pill; its styles live with ActionPill.
import "@/components/ui/ActionPill.css";
import GoogleSourceButton from "@/components/ui/GoogleSourceButton";
import heroFoot from "@/components/ui/HeroFoot.module.css";
import styles from "./EInvoicingPage.module.css";

gsap.registerPlugin(ScrollTrigger);

const DAY = 86_400_000;
const pad = (n: number) => String(n).padStart(2, "0");
const timelineStart = Date.parse(milestones[0].date);
const timelineEnd = Date.parse(milestones[milestones.length - 1].date);
const position = (time: number) => Math.min(1, Math.max(0, (time - timelineStart) / (timelineEnd - timelineStart)));
const shortDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Dubai" });

/** The next deadline still ahead, re-evaluated every second so the countdown rolls over on its own. */
function useNextMilestone() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const next = now === null ? null : milestones.find((milestone) => Date.parse(milestone.date) > now) ?? null;
  return { now, next };
}

function Countdown() {
  const { now, next } = useNextMilestone();
  // Rendered only after mount: the server can't know the visitor's clock.
  if (now === null || !next) return <div className={styles.countdown} aria-hidden />;
  const left = Date.parse(next.date) - now;
  const parts = [
    { value: Math.floor(left / DAY), unit: "days" },
    { value: Math.floor((left % DAY) / 3_600_000), unit: "hrs" },
    { value: Math.floor((left % 3_600_000) / 60_000), unit: "min" },
    { value: Math.floor((left % 60_000) / 1000), unit: "sec" },
  ];
  return (
    <div className={styles.countdown} role="timer" aria-label={`${parts[0].value} days until ${next.label}`}>
      <p className={styles.countdownLabel}><span className={styles.pulse} aria-hidden />{next.label} · {shortDate(next.date)}</p>
      <div className={styles.countdownDigits} aria-hidden>
        {parts.map((part) => (
          <span key={part.unit}>
            <strong>{part.unit === "days" ? part.value : pad(part.value)}</strong>
            <small>{part.unit}</small>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Each word rides up out of its own clipped slot; `tail` rides with the last one. */
function Words({ text, tail }: { text: string; tail?: ReactNode }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          <span className={styles.wordSlot}>
            <span data-word className={styles.word}>{word}{index === words.length - 1 && tail}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

type Lead = { name: string; company: string; email: string; phone: string; role: string; erp: string };
const emptyLead: Lead = { name: "", company: "", email: "", phone: "", role: "", erp: "" };

function validateLead(lead: Lead) {
  const errors: Partial<Record<keyof Lead, string>> = {};
  if (!lead.name.trim()) errors.name = "Required";
  if (!lead.company.trim()) errors.company = "Required";
  if (!emailPattern.test(lead.email.trim())) errors.email = "Enter a valid email";
  // UAE and international numbers: 7–15 digits, any formatting.
  const digits = lead.phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) errors.phone = "Enter a valid phone number";
  return errors;
}

function LeadForm() {
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (key: keyof Lead, value: string) => {
    const next = { ...lead, [key]: key === "phone" ? value.replace(/[^0-9\s()+-]/g, "") : value };
    setLead(next);
    if (touched) setErrors(validateLead(next));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    const found = validateLead(lead);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      // The shared EmailJS template has name/email/phone/message; the rest leads the message.
      await sendContactMessage({
        name: lead.name.trim(),
        email: lead.email.trim(),
        phone: lead.phone.trim(),
        message: [
          "UAE e-invoicing readiness review request",
          `Company: ${lead.company.trim()}`,
          lead.role && `Role: ${lead.role}`,
          lead.erp && `ERP: ${lead.erp}`,
        ].filter(Boolean).join("\n"),
      });
      setStatus("sent");
      setLead(emptyLead);
      setTouched(false);
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className={styles.sent} role="status">
        <span className={styles.sentMark} aria-hidden><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
        <p className={styles.formTitle}>Request received<span className="hero-period">.</span></p>
        <p className={styles.formNote}>We&apos;ll be in touch within one business day to schedule your readiness review.</p>
      </div>
    );
  }

  const input = (key: keyof Lead, label: string, type = "text", autoComplete?: string) => (
    <label className={styles.field} data-invalid={Boolean(errors[key])}>
      <span>{label}</span>
      <input name={key} type={type} autoComplete={autoComplete} value={lead[key]} aria-invalid={Boolean(errors[key])} onChange={(event) => set(key, event.target.value)} />
      {errors[key] && <em className={styles.error}>{errors[key]}</em>}
    </label>
  );

  return (
    <form className={styles.form} noValidate onSubmit={submit}>
      <p className={styles.formTitle}>Book a free readiness review</p>
      <p className={styles.formNote}>Tell us about your setup. We&apos;ll reply within one business day.</p>
      <div className={styles.formGrid}>
        {input("name", "Full name", "text", "name")}
        {input("company", "Company", "text", "organization")}
        {input("email", "Work email", "email", "email")}
        {input("phone", "Phone", "tel", "tel")}
        <label className={styles.field}>
          <span>Your role</span>
          <select name="role" value={lead.role} onChange={(event) => set("role", event.target.value)}>
            <option value="">Select…</option>
            {roles.map((role) => <option key={role}>{role}</option>)}
          </select>
        </label>
        <label className={styles.field}>
          <span>ERP</span>
          <select name="erp" value={lead.erp} onChange={(event) => set("erp", event.target.value)}>
            <option value="">Select…</option>
            {erps.map((erp) => <option key={erp.name}>{erp.name}</option>)}
            <option>Not sure</option>
          </select>
        </label>
      </div>
      <button type="submit" className={`action-pill ${styles.submit}`} disabled={status === "sending"}>
        <span aria-hidden className="action-pill__fill" />
        <span className="action-pill__label relative z-[1]">{status === "sending" ? "Sending…" : "Request my review"}</span>
        <span aria-hidden className="action-pill__icon">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </span>
      </button>
      {status === "error" && <p className={styles.error} role="alert">Couldn&apos;t send your request. Please try again or email info@bytesplatform.com.</p>}
      <p className={styles.consent}>
        By submitting, you agree to our <a href="/privacy-policy">Privacy Policy</a> and to being contacted about your request.
      </p>
    </form>
  );
}

function Timeline() {
  const { now } = useNextMilestone();
  const today = now === null ? null : position(now);
  const ref = useRef<HTMLDivElement>(null);
  // The track fills up to today (a CSS transition) the first time it scrolls into view.
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); observer.disconnect(); }
    }, { rootMargin: "0px 0px -20% 0px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={styles.timeline}>
      <div className={styles.track}>
        <span
          className={styles.trackFill}
          // --fill drives the vertical track on phones; transform the horizontal one.
          style={{ transform: `scaleX(${seen ? today ?? 0 : 0})`, "--fill": seen ? today ?? 0 : 0 } as React.CSSProperties}
        />
        {today !== null && today > 0 && today < 1 && (
          <span className={styles.today} style={{ left: `${today * 100}%` }}><em>Today</em></span>
        )}
      </div>
      <ol className={styles.milestones}>
        {milestones.map((milestone) => {
          const at = position(Date.parse(milestone.date));
          const past = now !== null && Date.parse(milestone.date) <= now;
          return (
            <li key={milestone.id} data-past={past} style={{ left: `${at * 100}%` }}>
              <span className={styles.dot} aria-hidden />
              <time dateTime={milestone.date}>{shortDate(milestone.date)}</time>
              <span>{milestone.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function EInvoicingPage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => mountScroll({ smooth: !prefersReducedMotion() }), []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const releaseFooter = mountFooterLift(el);
    const context = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.timeline({ delay: 0.1 })
        .from("[data-hero-title] [data-word]", { yPercent: 115, duration: 1.3, stagger: 0.07, ease: "expo.out" })
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.3);

      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((heading) => {
        gsap.from(heading.querySelectorAll("[data-word]"), {
          yPercent: 115, duration: 1.1, stagger: 0.05, ease: "expo.out",
          scrollTrigger: { trigger: heading, start: "top 86%", once: true },
        });
      });

      gsap.set("[data-reveal]", { opacity: 0 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.07, ease: "expo.out", overwrite: true }),
      });

      // The process rail draws down as the steps pass.
      gsap.from("[data-rail]", {
        scaleY: 0, ease: "none",
        scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: true },
      });

      // The dark panel grows from an inset card to full width, like the Industries chapter.
      gsap.fromTo("[data-deadlines]",
        { clipPath: "inset(0% 5% 0% 5% round 2.5rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none", scrollTrigger: { trigger: "[data-deadlines]", start: "top bottom", end: "top 20%", scrub: true } });

      // The logo turns light while the dark panel sits under the nav.
      const nav = document.querySelector<HTMLElement>("[data-hero-nav]");
      if (nav) {
        ScrollTrigger.create({
          trigger: "[data-deadlines]", start: "top 64px", end: "bottom 64px",
          onToggle: (self) => { nav.dataset.tone = self.isActive ? "dark" : ""; },
          onKill: () => { delete nav.dataset.tone; },
        });
      }
    }, el);
    let cancelled = false;
    void fontsReady().then(() => { if (!cancelled) ScrollTrigger.refresh(); });
    return () => {
      cancelled = true;
      context.revert();
      releaseFooter();
    };
  }, []);

  return (
    <>
      <div ref={root} className={styles.page}>
        <HeroNav />

        {/* ------------------------------------------------------------ hero */}
        <section id="top" className={styles.hero}>
          <div className={styles.heroText}>
            <div data-hero-fade><Countdown /></div>
            <h1 data-hero-title className={styles.heroTitle}>
              <Words text="UAE e-invoicing," />
              <br />
              <Words text="ERP-ready" tail={<span className="hero-period">.</span>} />
            </h1>
            <p data-hero-fade className={styles.heroIntro}>
              Appointing an accredited service provider is the legal step. Getting clean, PINT AE-valid invoice data out of
              your ERP is the real work. We audit, fix and integrate your ERP so every e-invoice passes before it
              reaches your ASP, whichever ASP you choose.
            </p>
            <ul data-hero-fade className={styles.capabilities}>
              {capabilities.map((item) => <li key={item}><span className="hero-dot" aria-hidden />{item}</li>)}
            </ul>
          </div>
          <div className={styles.formColumn}>
            <div data-hero-fade><GoogleSourceButton /></div>
            <div id="review" data-hero-fade className={styles.formCard}>
              <LeadForm />
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- problem */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 data-lines className={styles.h2}><Words text={problem.heading} /></h2>
            <p data-reveal className={styles.body}>{problem.body}</p>
          </div>
          <div className={styles.cards}>
            {problem.points.map((point, index) => (
              <article data-reveal key={point.title} className={`${styles.card} ${index === 1 ? styles.cardAccent : ""}`}>
                <span className={styles.index}>{pad(index + 1)}</span>
                <h3>{point.title}</h3>
                <p>{point.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------ erps */}
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <h2 data-lines className={styles.h2}><Words text="Works with the ERP you already run" /></h2>
            <p data-reveal className={styles.body}>
              Your ERP stays the system of record. Bring your exact version and module list, and we confirm the
              integration scope in writing before any work starts.
            </p>
          </div>
          <ul className={styles.erps}>
            {erps.map((erp) => (
              <li data-reveal key={erp.name}>
                <strong>{erp.name}</strong>
                <span>{erp.editions}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* --------------------------------------------------------- process */}
        <section className={`${styles.section} ${styles.split}`}>
          <div className={styles.splitAside}>
            <h2 data-lines className={styles.h2}><Words text="Ready in four stages" /></h2>
            <p data-reveal className={styles.body}>All inside your existing systems. No ERP replacement, no lock-in to a single ASP.</p>
            <div data-reveal><ActionPill href="#review" label="Book a readiness review" /></div>
          </div>
          <ol data-steps className={styles.steps}>
            <span data-rail aria-hidden className={styles.rail} />
            {steps.map((step, index) => (
              <li data-reveal key={step.title} className={styles.step}>
                <span className={styles.index}>{pad(index + 1)}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------- deadlines */}
        <section data-deadlines className={styles.deadlines}>
          <div className={styles.deadlinesInner}>
            <div className={styles.sectionHead}>
              <h2 data-lines className={styles.h2}><Words text="Two phases, fixed dates" /></h2>
              <p data-reveal className={styles.bodyDark}>
                The mandate rolls out by annual revenue. Obligations are identical; only the ASP appointment and
                go-live dates differ.
              </p>
            </div>

            <Timeline />

            <div className={styles.phases}>
              {phases.map((phase) => (
                <article data-reveal key={phase.name} className={styles.phase}>
                  <p className={styles.phaseName}>{phase.name}</p>
                  <h3>{phase.who}</h3>
                  <ul>
                    <li>{phase.asp}</li>
                    <li>{phase.live}</li>
                  </ul>
                </article>
              ))}
            </div>

            <div data-reveal className={styles.penalties}>
              <p className={styles.phaseName}>Penalties</p>
              <ul>
                {penalties.map((penalty) => (
                  <li key={penalty.amount}>
                    <strong>{penalty.amount}</strong> <span>{penalty.per}</span>
                    <p>{penalty.what}</p>
                  </li>
                ))}
              </ul>
              <p className={styles.sourceNote}>
                Under Cabinet Decision 106 of 2025 and Ministerial Decisions 243 &amp; 244 of 2025. Indicative only.
                Confirm your exposure with your tax adviser. Sources:{" "}
                {sources.map((source, index) => (
                  <Fragment key={source.href}>
                    {index > 0 && ", "}
                    <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
                  </Fragment>
                ))}
                .
              </p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- faq */}
        <section className={`${styles.section} ${styles.split}`}>
          <div className={styles.splitAside}>
            <h2 data-lines className={styles.h2}><Words text="Questions, answered" /></h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <details data-reveal key={faq.q} className={styles.faq}>
                <summary>{faq.q}<span aria-hidden className={styles.faqIcon} /></summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------- cta */}
        <section className={styles.cta}>
          <h2 data-lines className={styles.ctaTitle}><Words text="Start with the audit, not the contract" tail={<span className="hero-period">.</span>} /></h2>
          <p data-reveal className={styles.body}>
            A data audit gives you a written gap report, a committed timeline and an honest answer on whether your
            go-live date is achievable, whichever ASP you appoint.
          </p>
          <div data-reveal><ActionPill href="#review" label="Book a readiness review" /></div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}

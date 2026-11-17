"use client";

import { Fragment, createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroNav from "@/components/hero/HeroNav";
import ActionPill from "@/components/ui/ActionPill";
import SiteFooter from "@/components/sections/SiteFooter";
import {
  audienceContent, audienceKeys, company, deadlines, evidence, faqs, market, naics, naicsNote, needs, packages, proof, roles,
  sources, steps, titleIIDeadline, vehicles,
} from "@/data/govcon";
import { demoUrls } from "@/data/demos";
import { emailPattern, sendContactMessage } from "@/lib/contact";
import { fontsReady, prefersReducedMotion } from "@/lib/animation/prefs";
import { mountScroll } from "@/lib/animation/scroll";
import { mountFooterLift } from "@/lib/animation/footerLift";
import "@/components/ui/ActionPill.css";
// Shares the e-invoicing page's layout system (hero, sections, cards, dark panel, faq)
// so both landing pages read as one family; this page's own pieces live in `styles`.
import ui from "@/components/einvoicing/EInvoicingPage.module.css";
import styles from "./GovContractorsPage.module.css";
import GovHeroCanvas from "./GovHeroCanvas";
import { createLiquidMedia } from "@/lib/govcon/liquidMedia";
import { governmentServices, govServicePath } from "@/data/governmentServices";
import { mountReveal } from "@/lib/govcon/reveal";
import CountUp from "./CountUp";
import type { AudienceKey } from "@/data/govcon";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

/** True while copy still holds a [bracketed] placeholder; such fields aren't rendered. */
const isPlaceholder = (text: string) => /\[[^\]]*\]/.test(text);
const realProof = proof.filter((item) => !Object.values(item).some(isPlaceholder));
const realCompany = company.filter((row) => !isPlaceholder(row.value));

/** The audience tab in use. Everything the tabs swap reads it from here. */
const AudienceContext = createContext<AudienceKey>("state");

/** ?audience=state|prime|small; the older ?for= links still work; anything else is "state". */
function audienceFromSearch(search: string): AudienceKey {
  const params = new URLSearchParams(search);
  const wanted = params.get("audience");
  if (audienceKeys.includes(wanted as AudienceKey)) return wanted as AudienceKey;
  const legacy: Record<string, AudienceKey> = { agency: "state", prime: "prime", smb: "small" };
  return legacy[params.get("for") ?? ""] ?? "state";
}

/** Scrolls to the call form and focuses its first field, optionally filling the message field. */
function openCallForm(prefill?: string) {
  window.dispatchEvent(new CustomEvent("govcon:call", { detail: prefill ?? null }));
}

/** Each word rides up out of its own clipped slot; `tail` rides with the last one. */
function Words({ text, tail }: { text: string; tail?: ReactNode }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          <span className={ui.wordSlot}>
            <span data-word className={ui.word}>{word}{index === words.length - 1 && tail}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

type Lead = { name: string; company: string; email: string; phone: string; role: string; need: string; details: string };
const emptyLead: Lead = { name: "", company: "", email: "", phone: "", role: "", need: "", details: "" };

function validateLead(lead: Lead) {
  const errors: Partial<Record<keyof Lead, string>> = {};
  if (!lead.name.trim()) errors.name = "Required";
  if (!lead.company.trim()) errors.company = "Required";
  if (!emailPattern.test(lead.email.trim())) errors.email = "Enter a valid email";
  const digits = lead.phone.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) errors.phone = "Enter a valid phone number";
  return errors;
}

function LeadForm() {
  const audience = useContext(AudienceContext);
  const { form, label: audienceLabel } = audienceContent[audience];
  const [lead, setLead] = useState<Lead>(emptyLead);
  const [errors, setErrors] = useState<Partial<Record<keyof Lead, string>>>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Hero buttons and the scan card send visitors here (openCallForm): the form
  // scrolls into view, focuses its first field, and may pre-fill the message.
  useEffect(() => {
    const fill = (event: Event) => {
      const prefill = (event as CustomEvent<string | null>).detail;
      setStatus("idle");
      if (prefill) setLead((current) => ({ ...current, details: prefill }));
      const name = document.querySelector<HTMLInputElement>('#call input[name="name"]');
      name?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "center" });
      name?.focus({ preventScroll: true });
    };
    window.addEventListener("govcon:call", fill);
    return () => window.removeEventListener("govcon:call", fill);
  }, []);

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
          "Government contracting enquiry",
          `Audience: ${audience} (${audienceLabel})`,
          `${form.companyLabel}: ${lead.company.trim()}`,
          lead.role && `Organization: ${lead.role}`,
          lead.need && `Need: ${lead.need}`,
          lead.details.trim() && `Solicitation or website: ${lead.details.trim()}`,
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
      <div className={ui.sent} role="status">
        <span className={ui.sentMark} aria-hidden><svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg></span>
        <p className={ui.formTitle}>Request received<span className="hero-period">.</span></p>
        <p className={ui.formNote}>We&apos;ll reply within one business day to set up a capability call.</p>
      </div>
    );
  }

  const input = (key: keyof Lead, label: string, type = "text", autoComplete?: string) => (
    <label className={ui.field} data-invalid={Boolean(errors[key])}>
      <span>{label}</span>
      <input name={key} type={type} autoComplete={autoComplete} value={lead[key]} aria-invalid={Boolean(errors[key])} onChange={(event) => set(key, event.target.value)} />
      {errors[key] && <em className={ui.error}>{errors[key]}</em>}
    </label>
  );

  const select = (key: "role" | "need", label: string, options: string[]) => (
    <label className={ui.field}>
      <span>{label}</span>
      <select name={key} value={lead[key]} onChange={(event) => set(key, event.target.value)}>
        <option value="">Select…</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );

  return (
    <form className={ui.form} noValidate onSubmit={submit}>
      {/* Which tab the lead came from, for sales. */}
      <input type="hidden" name="audience" value={audience} />
      <p className={ui.formTitle}>Book a capability call</p>
      <p className={ui.formNote}>Tell us about the solicitation or the problem. We reply within one business day.</p>
      <div className={ui.formGrid}>
        {input("name", "Full name", "text", "name")}
        {input("company", form.companyLabel, "text", "organization")}
        {input("email", "Work email", "email", "email")}
        {input("phone", "Phone", "tel", "tel")}
        {select("role", "You are a", roles)}
        {select("need", "You need", needs)}
        <label className={`${ui.field} ${styles.wide}`}>
          <span>Solicitation # or your website URL (optional)</span>
          <input name="details" aria-describedby="details-hint" value={lead.details} onChange={(event) => set("details", event.target.value)} />
          <small id="details-hint" className={ui.consent}>{form.helper}</small>
        </label>
      </div>
      <button type="submit" className={`action-pill ${ui.submit}`} disabled={status === "sending"}>
        <span aria-hidden className="action-pill__fill" />
        <span className="action-pill__label relative z-[1]">{status === "sending" ? "Sending…" : "Request a call"}</span>
        <span aria-hidden className="action-pill__icon">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </span>
      </button>
      {status === "error" && <p className={ui.error} role="alert">Couldn&apos;t send your request. Please try again or email info@bytesplatform.com.</p>}
      <p className={ui.consent}>
        By submitting, you agree to our <a href="/privacy-policy">Privacy Policy</a> and to being contacted about your request.
      </p>
    </form>
  );
}

/** "Free accessibility scan": collects a URL and passes it to the call form. */
function ScanForm() {
  const [url, setUrl] = useState("");
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = url.trim();
    if (!value) return;
    openCallForm(value);
  };
  return (
    <form id="scan" className={styles.scan} onSubmit={submit}>
      <p className={styles.scanTitle}>Free accessibility scan</p>
      <p className={styles.scanNote}>
        See how your current site measures against Section 508 and ADA Title II, before a resident or an auditor does.
      </p>
      <div className={styles.scanRow}>
        <label className="sr-only" htmlFor="scan-url">Your website address</label>
        <input id="scan-url" type="url" inputMode="url" placeholder="Your website address" value={url} onChange={(event) => setUrl(event.target.value)} />
        <button type="submit">Run scan</button>
      </div>
    </form>
  );
}

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Time left until the large-government ADA Title II date, split into units. */
function timeToTitleII(now: number) {
  const left = Math.max(0, Date.parse(titleIIDeadline) - now);
  return {
    days: Math.floor(left / 86_400_000),
    hours: Math.floor((left % 86_400_000) / 3_600_000),
    minutes: Math.floor((left % 3_600_000) / 60_000),
    seconds: Math.floor((left % 60_000) / 1000),
  };
}

/**
 * A live countdown to the ADA Title II deadline: days count up when the panel
 * comes into view, then hours, minutes and seconds tick every second. The
 * server renders the current values (the route revalidates daily), so it
 * reads right without JavaScript; screen readers get the day count once, not
 * every tick.
 */
function TitleIIClock() {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const left = timeToTitleII(now);
  return (
    <div data-reveal className={styles.clock}>
      <div className={styles.clockDigits}>
        <span className={styles.clockDays}>
          <strong><CountUp to={left.days} /></strong>
          <small>days</small>
        </span>
        {([["hrs", left.hours], ["min", left.minutes], ["sec", left.seconds]] as const).map(([unit, value]) => (
          <span key={unit} aria-hidden>
            <strong suppressHydrationWarning>{pad2(value)}</strong>
            <small>{unit}</small>
          </span>
        ))}
      </div>
      <p className={styles.clockCaption}>
        <span className={styles.pulse} aria-hidden />
        until large state and local governments must meet WCAG 2.1 AA · Apr 26, 2027
      </p>
    </div>
  );
}

/**
 * Renders every audience's version of a block, stacked in one grid cell: the
 * cell always holds the tallest version, so switching tabs never moves the
 * page. The active version fades and slides in; the others stay hidden from
 * view, from assistive tech and from the keyboard. The default ("state")
 * version is what the server renders as the visible one.
 */
function Swap({ layerClassName = "", children }: { layerClassName?: string; children: (key: AudienceKey, on: boolean) => ReactNode }) {
  const active = useContext(AudienceContext);
  return (
    <div className={styles.swap}>
      {audienceKeys.map((key) => {
        const on = key === active;
        return (
          <div key={key} className={`${styles.swapLayer} ${layerClassName}`} data-active={on} aria-hidden={!on} inert={!on}>
            {children(key, on)}
          </div>
        );
      })}
    </div>
  );
}

/**
 * The audience tabs (WAI-ARIA tabs pattern): arrows move focus between tabs,
 * Home / End jump to the ends, Enter / Space select. Only the selected tab is
 * in the page's tab order. On phones the bar scrolls sideways and keeps the
 * selected tab in view.
 */
function AudienceTabs({ onSelect }: { onSelect: (key: AudienceKey) => void }) {
  const active = useContext(AudienceContext);
  const list = useRef<HTMLDivElement>(null);
  const tabs = useRef<Partial<Record<AudienceKey, HTMLButtonElement | null>>>({});

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = audienceKeys.length - 1;
    const next = { ArrowRight: index === last ? 0 : index + 1, ArrowLeft: index === 0 ? last : index - 1, Home: 0, End: last }[event.key];
    if (next === undefined) return;
    event.preventDefault();
    tabs.current[audienceKeys[next]]?.focus();
  };

  useEffect(() => {
    const bar = list.current;
    const tab = tabs.current[active];
    if (!bar || !tab || bar.scrollWidth <= bar.clientWidth) return;
    bar.scrollTo({ left: tab.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }, [active]);

  return (
    <div className={styles.tabsBar}>
      <div ref={list} data-hero-fade role="tablist" aria-label="Choose your organization type" className={styles.audienceTabs}>
        {audienceKeys.map((key, index) => {
          const on = key === active;
          return (
            <button
              key={key}
              ref={(node) => { tabs.current[key] = node; }}
              id={`audience-tab-${key}`}
              type="button"
              role="tab"
              aria-selected={on}
              aria-controls="audience-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => onSelect(key)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className={styles.tabFull}>{audienceContent[key].label}</span>
              <span className={styles.tabShort} aria-hidden>{audienceContent[key].short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** The hero's text column: each audience's eyebrow, headline, sub and buttons. */
function AudienceHero({ children }: { children: ReactNode }) {
  return (
    <div className={ui.heroText}>
      <Swap layerClassName={styles.audienceLayer}>
        {(key, on) => {
          const { hero } = audienceContent[key];
          // Only the visible version is a real <h1>; the others hold their space.
          const Title = on ? "h1" : "div";
          return (
            <>
              <p data-hero-fade className={styles.eyebrow}><span className="hero-dot" aria-hidden />{hero.eyebrow}</p>
              <Title data-hero-title className={ui.heroTitle}>
                {hero.headline.map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 && <br />}
                    <Words text={line} tail={index === hero.headline.length - 1 ? <span className="hero-period">.</span> : undefined} />
                  </Fragment>
                ))}
              </Title>
              <p data-hero-fade className={ui.heroIntro}>{hero.sub}</p>
              <div data-hero-fade className={styles.heroActions}>
                {hero.cta.kind === "link"
                  ? <ActionPill href={hero.cta.href} label={hero.cta.label} />
                  : <ActionPill label={hero.cta.label} onClick={() => openCallForm((hero.cta as { prefill: string }).prefill)} />}
                <button type="button" className={`${styles.textLink} ${styles.linkButton}`} onClick={() => openCallForm()}>
                  Book a capability call
                </button>
              </div>
            </>
          );
        }}
      </Swap>
      {children}
    </div>
  );
}

export default function GovContractorsPage() {
  const root = useRef<HTMLDivElement>(null);
  // The server renders "state"; ?audience= is applied once the page is live.
  const [audience, setAudience] = useState<AudienceKey>("state");
  // Whether ?audience= is in the URL (on load or after a tab click): if so,
  // the service card links carry it to the detail pages.
  const [audienceInUrl, setAudienceInUrl] = useState(false);

  useEffect(() => {
    setAudience(audienceFromSearch(window.location.search));
    const params = new URLSearchParams(window.location.search);
    setAudienceInUrl(params.has("audience") || params.has("for"));
  }, []);

  const selectAudience = useCallback((key: AudienceKey) => {
    setAudience(key);
    setAudienceInUrl(true);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set("audience", key);
      url.searchParams.delete("for");
      window.history.replaceState(window.history.state, "", url);
    } catch { /* the URL just doesn't update */ }
    try {
      (window as Window & { dataLayer?: unknown[] }).dataLayer?.push({ event: "audience_tab_select", audience: key });
    } catch { /* analytics is optional */ }
  }, []);
  const typesRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => mountScroll({ smooth: !prefersReducedMotion() }), []);

  // Reduced motion keeps the plain images; there is nothing to ripple.
  useEffect(() => {
    if (!typesRef.current || !liquidRef.current || prefersReducedMotion()) return;
    const liquid = createLiquidMedia(typesRef.current, liquidRef.current);
    return () => liquid?.dispose();
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const releaseFooter = mountFooterLift(el);
    let releaseReveal = () => {};
    const context = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.timeline({ delay: 0.1 })
        .from("[data-hero-title] [data-word]", { yPercent: 115, duration: 1.3, stagger: 0.07, ease: "expo.out" })
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.3);

      // Section headings and blocks: revealed by viewport checks that can't
      // miss (stale trigger positions used to leave the FAQ masked and faded).
      releaseReveal = mountReveal(el);

      gsap.from("[data-rail]", {
        scaleY: 0, ease: "none",
        scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 60%", scrub: true },
      });

      gsap.fromTo("[data-market]",
        { clipPath: "inset(0% 5% 0% 5% round 2.5rem)" },
        { clipPath: "inset(0% 0% 0% 0% round 0rem)", ease: "none", scrollTrigger: { trigger: "[data-market]", start: "top bottom", end: "top 20%", scrub: true } });

      const nav = document.querySelector<HTMLElement>("[data-hero-nav]");
      if (nav) {
        ScrollTrigger.create({
          trigger: "[data-market]", start: "top 64px", end: "bottom 64px",
          onToggle: (self) => { nav.dataset.tone = self.isActive ? "dark" : ""; },
          onKill: () => { delete nav.dataset.tone; },
        });
      }
    }, el);
    let cancelled = false;
    void fontsReady().then(() => { if (!cancelled) ScrollTrigger.refresh(); });
    return () => {
      cancelled = true;
      releaseReveal();
      context.revert();
      releaseFooter();
    };
  }, []);

  return (
    <AudienceContext.Provider value={audience}>
      <div ref={root} className={ui.page}>
        <HeroNav />

        {/* The tabs sit outside the panel they control: the hero. */}
        <div className={styles.audienceShell}>
        <AudienceTabs onSelect={selectAudience} />
        <div id="audience-panel" role="tabpanel" aria-labelledby={`audience-tab-${audience}`}>

        {/* ------------------------------------------------------------ hero */}
        <section id="top" className={`${ui.hero} ${styles.heroStage}`}>
          <GovHeroCanvas className={styles.heroCanvas} />
          <AudienceHero>
            <div data-hero-fade><ScanForm /></div>
          </AudienceHero>
          <div className={`${ui.formColumn} ${styles.formTop}`}>
            <div id="call" data-hero-fade className={ui.formCard}>
              <LeadForm />
            </div>
          </div>
        </section>

        </div>
        </div>

        {/* -------------------------------------------------------- services */}
        <section id="services" className={ui.section}>
          <div className={ui.sectionHead}>
            <h2 data-lines className={ui.h2}><Words text="What government buys, what you get" /></h2>
            <p data-reveal className={ui.body}>
              Each engagement is scoped to an outcome and mapped to the NAICS code it is usually issued under.
            </p>
          </div>
          <div ref={typesRef} className={styles.types}>
            {/* One WebGL canvas over the grid draws every card's image (liquid on hover). */}
            <canvas ref={liquidRef} aria-hidden className={styles.liquidCanvas} />
            {/* Each card is one link (its title), stretched over the whole card. */}
            {governmentServices.map((service) => (
              <article data-reveal data-liquid-card key={service.slug} className={styles.type}>
                <div data-liquid-media className={styles.media}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- also the WebGL texture source */}
                  <img src={service.image} alt="" loading="lazy" decoding="async" width={900} height={600} />
                </div>
                <div className={styles.typeHead}>
                  <span className={ui.index}>{service.number}</span>
                  <span className={styles.naicsTag}>NAICS {service.naics.join(" · ")}</span>
                </div>
                <h3>
                  <a className={styles.cardLink} href={`${govServicePath(service.slug)}${audienceInUrl ? `?audience=${audience}` : ""}`}>
                    {service.title}
                  </a>
                </h3>
                <p>{service.summary}</p>
                <ul>{service.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
              </article>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- evidence */}
        <section className={`${ui.section} ${ui.split}`}>
          <div className={ui.splitAside}>
            <h2 data-lines className={ui.h2}><Words text="Every release ships with the paperwork" /></h2>
            <p data-reveal className={ui.body}>
              Contracting officers and accessibility coordinators don&apos;t accept &ldquo;trust us&rdquo;. With each
              release we hand over the evidence they review, so acceptance takes days instead of months.
            </p>
            <div data-reveal><ActionPill href="#call" label="Request a sample evidence pack" /></div>
          </div>
          <ul className={styles.evidence}>
            {evidence.map((item) => (
              <li data-reveal key={item.name}>
                <svg viewBox="0 0 24 24" aria-hidden><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M9 13h6M9 17h4" /></svg>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                </span>
                <em>{item.format}</em>
              </li>
            ))}
          </ul>
        </section>

        {/* ----------------------------------------------------------- proof */}
        {/* Hidden until at least two results are real (no [placeholders]). */}
        {realProof.length >= 2 && <section className={ui.section}>
          <div className={ui.sectionHead}>
            <h2 data-lines className={ui.h2}><Words text="Proof, not promises" /></h2>
            <p data-reveal className={ui.body}>Before-and-after results from public-sector and contractor projects.</p>
          </div>
          <div className={ui.cards}>
            {realProof.map((item, index) => (
              <article data-reveal key={index} className={`${ui.card} ${styles.proof}`}>
                <span className={ui.index}>{item.who}</span>
                <p className={styles.proofProject}>{item.project}</p>
                <strong className={styles.proofValue}>{item.value}</strong>
                <p>{item.label}</p>
              </article>
            ))}
          </div>
        </section>}

        {/* ----------------------------------------------------------- naics */}
        <section className={`${ui.section} ${ui.split}`}>
          <div className={ui.splitAside}>
            <h2 data-lines className={ui.h2}><Words text="Codes we bid under" /></h2>
            <p data-reveal className={ui.body}>{naicsNote}</p>
          </div>
          <table data-reveal className={styles.naics}>
            <caption className="sr-only">NAICS codes and SBA small-business size standards</caption>
            <thead>
              <tr><th scope="col">NAICS</th><th scope="col">Industry</th><th scope="col">Size standard</th></tr>
            </thead>
            <tbody>
              {naics.map((row) => (
                <tr key={row.code}>
                  <th scope="row">{row.code}</th>
                  <td>{row.name}</td>
                  <td>{row.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* ------------------------------------------- vehicles & company data */}
        <section id="buy" className={ui.section}>
          <div className={ui.sectionHead}>
            <h2 data-lines className={ui.h2}><Words text="How agencies and primes buy from us" /></h2>
            <p data-reveal className={ui.body}>
              Start small and direct, or bring us onto your team. We only list contracts we actually hold.
            </p>
          </div>
          <ul className={`${ui.erps} ${styles.vehicles}`}>
            {vehicles.map((vehicle) => (
              <li data-reveal key={vehicle.name}>
                <strong>{vehicle.name}</strong>
                <span>{vehicle.status}</span>
              </li>
            ))}
          </ul>
          <div data-reveal className={styles.companyCard}>
            <p className={styles.eyebrow}><span className="hero-dot" aria-hidden />Company data</p>
            <dl>
              {realCompany.map((row) => (
                <div key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className={styles.productActions}>
              <ActionPill href="#call" label="Request our capability statement" />
            </div>
          </div>
        </section>

        {/* ---------------------------------------------- market & deadlines */}
        <section data-market data-count-scope className={ui.deadlines}>
          <div className={ui.deadlinesInner}>
            <div className={ui.sectionHead}>
              <h2 data-lines className={ui.h2}><Words text="The compliance clock is already running." /></h2>
              <p data-reveal className={ui.bodyDark}>
                Accessibility and cybersecurity rules now have firm dates. Agencies and contractors that start now finish
                on time.
              </p>
            </div>

            <TitleIIClock />

            <ul className={styles.stats}>
              {market.map((stat) => (
                <li data-reveal key={stat.label}>
                  <strong>{stat.count ? <CountUp {...stat.count} /> : stat.value}</strong>
                  <span>{stat.label}</span>
                  <small>{stat.source}</small>
                </li>
              ))}
            </ul>

            <div data-reveal className={ui.penalties}>
              <p className={ui.phaseName}>Key dates</p>
              <ol className={styles.dates}>
                {deadlines.map((deadline) => (
                  <li key={deadline.when}>
                    <time>{deadline.when}</time>
                    <p>{deadline.what}</p>
                  </li>
                ))}
              </ol>
              <p className={`${ui.sourceNote} ${styles.sourceNote}`}>
                Sources:{" "}
                {sources.map((source, index) => (
                  <Fragment key={source.href}>
                    {index > 0 && "; "}
                    <a href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
                  </Fragment>
                ))}
                .
              </p>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- product */}
        <section id="bytesgov" className={ui.section}>
          <div data-reveal className={styles.product}>
            <div>
              <p className={styles.eyebrow}><span className="hero-dot" aria-hidden />Our own product</p>
              <h2 className={styles.productTitle}>BytesGov<span className="hero-period">.</span></h2>
              <p className={ui.body}>
                We are a government contractor too. BytesGov is the platform we use to find, qualify and write bids, now
                open to small businesses and primes.
              </p>
              <div className={styles.productActions}>
                <ActionPill href={demoUrls.bytesgov} label="Try the demo" newTab />
                <a className={styles.textLink} href="/products/bytesgov">Product details</a>
                <a className={styles.textLink} href="/case-studies">Case studies</a>
              </div>
            </div>
            <ul className={styles.productList}>
              <li><strong>P(win)</strong><span>Eight-factor win probability on every notice</span></li>
              <li><strong>L &amp; M</strong><span>Compliance matrix with FAR and DFARS clauses</span></li>
              <li><strong>Draft</strong><span>Proposal drafts locked until a reviewer attests</span></li>
              <li><strong>8(a)</strong><span>Set-aside, teaming and incumbent intelligence</span></li>
            </ul>
          </div>
        </section>

        {/* --------------------------------------------------------- process */}
        <section className={`${ui.section} ${ui.split}`}>
          <div className={ui.splitAside}>
            <h2 data-lines className={ui.h2}><Words text="From notice to option year" /></h2>
            <p data-reveal className={ui.body}>One team from the capture call through sustainment.</p>
            <div data-reveal><ActionPill href="#call" label="Book a capability call" /></div>
          </div>
          <ol data-steps className={ui.steps}>
            <span data-rail aria-hidden className={ui.rail} />
            {steps.map((step, index) => (
              <li data-reveal key={step.title} className={ui.step}>
                <span className={ui.index}>{pad(index + 1)}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* -------------------------------------------------------- packages */}
        <section className={ui.section}>
          <div className={ui.sectionHead}>
            <h2 data-lines className={ui.h2}><Words text="Three ways to start" /></h2>
          </div>
          <div className={ui.cards}>
            {packages.map((item, index) => (
              <article data-reveal key={item.title} className={`${ui.card} ${styles.package} ${index === 0 ? `${ui.cardAccent} ${styles.packageAccent}` : ""}`}>
                <span className={ui.index}>{pad(index + 1)}</span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <ul>{item.includes.map((line) => <li key={line}>{line}</li>)}</ul>
                {!isPlaceholder(item.price) && <strong className={styles.price}>{item.price}</strong>}
              </article>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------- faq */}
        <section className={`${ui.section} ${ui.split}`}>
          <div className={ui.splitAside}>
            <h2 data-lines className={ui.h2}><Words text="Questions, answered" /></h2>
          </div>
          <div>
            {faqs.map((faq) => (
              <details data-reveal key={faq.q} className={ui.faq}>
                <summary>{faq.q}<span aria-hidden className={ui.faqIcon} /></summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------------- cta */}
        <section className={ui.cta}>
          <h2 data-lines className={ui.ctaTitle}><Words text="Bring us the solicitation" tail={<span className="hero-period">.</span>} /></h2>
          <p data-reveal className={ui.body}>
            Within one business day we&apos;ll tell you honestly whether we can help, what it will take to deliver, and
            where the risks are.
          </p>
          <div data-reveal><ActionPill href="#call" label="Book a capability call" /></div>
        </section>
      </div>

      <SiteFooter />
    </AudienceContext.Provider>
  );
}

"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroNav from "@/components/hero/HeroNav";
import SiteFooter from "@/components/sections/SiteFooter";
import { site } from "@/data/site";
import { serviceLinks } from "@/data/services";
import { productLinks } from "@/data/products";
import { emailPattern, phonePattern, sendContactMessage } from "@/lib/contact";
import { fontsReady, prefersReducedMotion } from "@/lib/animation/prefs";
import { mountScroll } from "@/lib/animation/scroll";
import { mountFooterLift } from "@/lib/animation/footerLift";
// The submit button wears the site pill; its styles live with ActionPill.
import "@/components/ui/ActionPill.css";
import GoogleSourceButton from "@/components/ui/GoogleSourceButton";
import heroFoot from "@/components/ui/HeroFoot.module.css";
import styles from "./ContactPage.module.css";

gsap.registerPlugin(ScrollTrigger);

const topics = [...serviceLinks.map((item) => item.label), ...productLinks.map((item) => item.label), "Something else"];

type Fields = { name: string; email: string; phone: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
const empty: Fields = { name: "", email: "", phone: "", message: "" };

function validate(fields: Fields): Errors {
  const errors: Errors = {};
  if (!fields.name.trim()) errors.name = "Tell us your name";
  if (!emailPattern.test(fields.email.trim())) errors.email = "Enter a valid email address";
  if (!phonePattern.test(fields.phone.trim())) errors.phone = "Enter a valid 10-digit phone number";
  if (!fields.message.trim()) errors.message = "Add a few words about your project";
  return errors;
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

export default function ContactPage() {
  const root = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState<Fields>(empty);
  const [topicsPicked, setTopicsPicked] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => mountScroll({ smooth: !prefersReducedMotion() }), []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const releaseFooter = mountFooterLift(el);
    const context = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.timeline({ delay: 0.1 })
        .from("[data-hero-title] [data-word]", { yPercent: 115, duration: 1.3, stagger: 0.08, ease: "expo.out" })
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.35);
    }, el);
    let cancelled = false;
    void fontsReady().then(() => { if (!cancelled) ScrollTrigger.refresh(); });
    return () => {
      cancelled = true;
      context.revert();
      releaseFooter();
    };
  }, []);

  // The success panel is shorter than the form; keep the footer trigger in step.
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [status]);

  const update = (name: keyof Fields, value: string) => {
    if (name === "phone") {
      value = value.replace(/[^0-9\s().+-]/g, "");
      if (value.replace(/\D/g, "").replace(/^1(?=\d{10})/, "").length > 10) return;
    }
    const next = { ...fields, [name]: value };
    setFields(next);
    // Errors appear after the first submit attempt, then update as you type.
    if (touched) setErrors(validate(next));
  };

  const toggleTopic = (topic: string) =>
    setTopicsPicked((picked) => (picked.includes(topic) ? picked.filter((item) => item !== topic) : [...picked, topic]));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setTouched(true);
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length) {
      const first = Object.keys(found)[0];
      root.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setStatus("sending");
    try {
      // The template has no topic field, so the picks lead the message.
      const message = topicsPicked.length
        ? `Interested in: ${topicsPicked.join(", ")}\n\n${fields.message.trim()}`
        : fields.message.trim();
      await sendContactMessage({ ...fields, name: fields.name.trim(), email: fields.email.trim(), message });
      setStatus("sent");
      setFields(empty);
      setTopicsPicked([]);
      setTouched(false);
    } catch {
      setStatus("error");
    }
  };

  const field = (name: keyof Fields, label: string, props: { type?: string; autoComplete?: string; inputMode?: "tel" | "email" } = {}) => (
    <label className={styles.field} data-invalid={Boolean(errors[name])}>
      <span className={styles.fieldLabel}>{label}</span>
      <input
        name={name}
        type={props.type ?? "text"}
        autoComplete={props.autoComplete}
        inputMode={props.inputMode}
        value={fields[name]}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        onChange={(event) => update(name, event.target.value)}
      />
      {errors[name] && <span id={`${name}-error`} className={styles.error}>{errors[name]}</span>}
    </label>
  );

  return (
    <>
      <div ref={root} className={styles.page}>
        <HeroNav />

        {/* ------------------------------------------------------------ hero */}
        <section id="top" className={styles.hero}>
          <h1 data-hero-title className={styles.heroTitle}>
            <Words text="Let's talk" tail={<span className="hero-period">.</span>} />
          </h1>
          <div className={heroFoot.foot}>
            <p data-hero-fade className={styles.heroIntro}>
              Questions, feedback or a project in mind. Tell us about it. Our team reads every message and replies
              promptly.
            </p>
            <div data-hero-fade><GoogleSourceButton /></div>
          </div>
        </section>

        {/* ----------------------------------------------------- form + info */}
        <section className={styles.main}>
          <aside data-hero-fade className={styles.info}>
            <div>
              <p className={styles.label}>Email</p>
              <a href={`mailto:${site.email}`} className={styles.bigLink}>{site.email}</a>
            </div>
            <div>
              <p className={styles.label}>Phone · Toll free</p>
              <a href={site.phoneHref} className={styles.bigLink}>{site.phone}</a>
            </div>
            <div>
              <p className={styles.label}>Studio</p>
              <a href={site.address.map} target="_blank" rel="noreferrer" className={styles.address}>
                {site.address.street}<br />{site.address.city}, {site.address.region}<br />{site.address.country}
              </a>
            </div>
            <div>
              <p className={styles.label}>Elsewhere</p>
              <div className={styles.socials}>
                <a href={site.social.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a>
                <a href={site.social.instagram} target="_blank" rel="noreferrer">Instagram ↗</a>
                <a href={site.social.facebook} target="_blank" rel="noreferrer">Facebook ↗</a>
              </div>
            </div>
          </aside>

          <div data-hero-fade className={styles.formWrap}>
            {/* Scroll target for the nav's "Start a project" on this page; sits above
                the card so the form lands below the fixed nav, not under it. */}
            <span id="message" aria-hidden className={styles.anchor} />
            {status === "sent" ? (
              <div className={styles.sent} role="status">
                <span className={styles.sentMark} aria-hidden>
                  <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
                </span>
                <p className={styles.sentTitle}>Message sent<span className="hero-period">.</span></p>
                <p className={styles.body}>Thanks for reaching out. We&apos;ll get back to you shortly, usually within one business day.</p>
                <button type="button" className={styles.textButton} onClick={() => setStatus("idle")}>Send another message</button>
              </div>
            ) : (
              <form className={styles.form} noValidate onSubmit={submit}>
                <fieldset className={styles.topics}>
                  <legend className={styles.fieldLabel}>What can we help with?</legend>
                  <div className={styles.chips}>
                    {topics.map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        aria-pressed={topicsPicked.includes(topic)}
                        onClick={() => toggleTopic(topic)}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <div className={styles.row}>
                  {field("name", "Your name", { autoComplete: "name" })}
                  {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
                </div>
                {field("phone", "Phone", { type: "tel", autoComplete: "tel", inputMode: "tel" })}

                <label className={styles.field} data-invalid={Boolean(errors.message)}>
                  <span className={styles.fieldLabel}>Tell us about your project</span>
                  <textarea
                    name="message"
                    rows={5}
                    value={fields.message}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    onChange={(event) => update("message", event.target.value)}
                  />
                  {errors.message && <span id="message-error" className={styles.error}>{errors.message}</span>}
                </label>

                <div className={styles.submitRow}>
                  <button type="submit" className="action-pill" disabled={status === "sending"}>
                    <span aria-hidden className="action-pill__fill" />
                    <span className="action-pill__label relative z-[1]">{status === "sending" ? "Sending…" : "Send message"}</span>
                    <span aria-hidden className="action-pill__icon">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                    </span>
                  </button>
                  {status === "error" && (
                    <p className={styles.error} role="alert">
                      Something went wrong sending your message. Please try again, or email us at{" "}
                      <a href={`mailto:${site.email}`}>{site.email}</a>.
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}

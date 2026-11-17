"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroNav from "@/components/hero/HeroNav";
import ActionPill from "@/components/ui/ActionPill";
import SiteFooter from "@/components/sections/SiteFooter";
import { caseStudies } from "@/data/caseStudies";
import { fontsReady, prefersReducedMotion } from "@/lib/animation/prefs";
import { mountScroll } from "@/lib/animation/scroll";
import { mountFooterLift } from "@/lib/animation/footerLift";
import ui from "@/components/einvoicing/EInvoicingPage.module.css";
import styles from "./CaseStudiesPage.module.css";

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, "0");

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

export default function CaseStudiesPage() {
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
      <div ref={root} className={ui.page}>
        <HeroNav />

        {/* ------------------------------------------------------------ hero */}
        <section id="top" className={styles.hero}>
          <p data-hero-fade className={styles.eyebrow}><span className="hero-dot" aria-hidden />Case studies &amp; live demos</p>
          <h1 data-hero-title className={ui.heroTitle}>
            <Words text="Products you" />
            <br />
            <Words text="can click through" tail={<span className="hero-period">.</span>} />
          </h1>
          <div className={styles.heroFoot}>
            <p data-hero-fade className={ui.heroIntro}>
              Two platforms we designed, engineered and run ourselves, one for government contractors and one for the UAE
              e-invoicing mandate. Read how they were built, then open the demo and try them with sample data.
            </p>
            <nav data-hero-fade aria-label="Case studies" className={styles.jump}>
              {caseStudies.map((study, index) => (
                <a key={study.slug} href={`#${study.slug}`}>
                  <span className={ui.index}>{pad(index + 1)}</span>
                  <strong>{study.name}</strong>
                  <span>{study.sector}</span>
                </a>
              ))}
            </nav>
          </div>
        </section>

        {caseStudies.map((study, studyIndex) => (
          <article key={study.slug} id={study.slug} className={styles.study} aria-labelledby={`${study.slug}-title`}>
            {/* -------------------------------------------------- intro */}
            <header className={styles.studyHead}>
              <p className={styles.eyebrow}>
                <span className="hero-dot" aria-hidden />
                {pad(studyIndex + 1)} · {study.sector}
              </p>
              <h2 id={`${study.slug}-title`} data-lines className={styles.studyTitle}>
                <Words text={study.name} tail={<span className="hero-period">.</span>} />
              </h2>
              <p data-reveal className={styles.tagline}>{study.tagline}</p>
              <p data-reveal className={ui.body}>{study.summary}</p>
            </header>

            {/* ------------------------------------------- demo launcher */}
            <aside data-reveal className={styles.demo} aria-label={`${study.name} demo`}>
              <div className={styles.demoWindow} aria-hidden>
                <span /><span /><span />
                <em>{study.demo.href ? new URL(study.demo.href).host : `${study.slug} demo`}</em>
              </div>
              <p className={styles.demoLabel}>Try it in the demo</p>
              <ol className={styles.tries}>
                {study.demo.tries.map((item, index) => (
                  <li key={item}><span className={ui.index}>{pad(index + 1)}</span>{item}</li>
                ))}
              </ol>
              <div className={styles.demoActions}>
                {study.demo.href ? (
                  <a className={`action-pill ${styles.launch}`} href={study.demo.href} target="_blank" rel="noreferrer">
                    <span aria-hidden className="action-pill__fill" />
                    <span className="action-pill__label relative z-[1]">Launch demo</span>
                    <span aria-hidden className="action-pill__icon">
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M7 17 17 7m0 0H8m9 0v9" /></svg>
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <ActionPill href="/contact" label="Request demo access" />
                )}
                <a className={styles.textLink} href="/contact">Book a guided walkthrough</a>
              </div>
            </aside>

            {/* ---------------------------------------------- challenge */}
            <section className={styles.block}>
              <h3 className={styles.blockLabel}>The challenge</h3>
              <ul className={styles.challenge}>
                {study.challenge.map((point) => <li data-reveal key={point}>{point}</li>)}
              </ul>
            </section>

            {/* --------------------------------------------------- built */}
            <section className={styles.block}>
              <h3 className={styles.blockLabel}>What we built</h3>
              <ul className={styles.built}>
                {study.built.map((item, index) => (
                  <li data-reveal key={item.title}>
                    <span className={ui.index}>{pad(index + 1)}</span>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </li>
                ))}
              </ul>
            </section>

            {/* -------------------------------------------- engineering */}
            <section className={`${styles.block} ${styles.engineering}`}>
              <h3 className={styles.blockLabel}>How it&apos;s engineered</h3>
              <div>
                <ul className={styles.points}>
                  {study.engineering.map((point) => <li data-reveal key={point}>{point}</li>)}
                </ul>
                <ul data-reveal className={ui.capabilities}>
                  {study.stack.map((item) => <li key={item}><span className="hero-dot" aria-hidden />{item}</li>)}
                </ul>
                <p data-reveal className={styles.more}>
                  <a className={styles.textLink} href={study.links.product}>{study.name} product page</a>
                  <a className={styles.textLink} href={study.links.related.href}>{study.links.related.label}</a>
                </p>
              </div>
            </section>
          </article>
        ))}

        {/* ------------------------------------------------------------- cta */}
        <section className={ui.cta}>
          <h2 data-lines className={ui.ctaTitle}><Words text="Your platform could be next" tail={<span className="hero-period">.</span>} /></h2>
          <p data-reveal className={ui.body}>
            We build products like these for clients too: contractor portals, CRMs, ERPs and compliance systems,
            designed and engineered in-house.
          </p>
          <div data-reveal className={styles.ctaActions}>
            <ActionPill href="/contact" label="Start a project" />
            <a className={styles.textLink} href="https://portfolio.bytesplatform.com/" target="_blank" rel="noreferrer">See more of our work</a>
          </div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}

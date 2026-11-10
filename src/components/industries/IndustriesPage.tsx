"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroNav from "@/components/hero/HeroNav";
import ActionPill from "@/components/ui/ActionPill";
import GoogleSourceButton from "@/components/ui/GoogleSourceButton";
import SiteFooter from "@/components/sections/SiteFooter";
import { industries } from "@/data/industries";
import { serviceLinks } from "@/data/services";
import { fontsReady, prefersReducedMotion } from "@/lib/animation/prefs";
import { mountScroll, jumpTo } from "@/lib/animation/scroll";
import styles from "./IndustriesPage.module.css";

gsap.registerPlugin(ScrollTrigger);

const { sectors } = industries;
const serviceLabel = (slug: string) => serviceLinks.find((service) => service.slug === slug)?.label ?? slug;
const pad = (n: number) => String(n).padStart(2, "0");

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

export default function IndustriesPage() {
  const root = useRef<HTMLDivElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => mountScroll({ smooth: !prefersReducedMotion() }), []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const footer = document.querySelector<HTMLElement>("[data-site-footer]");
    const stage = footer?.parentElement;

    const context = gsap.context(() => {
      // The page lifts away like the home page's Work panel, uncovering the fixed footer.
      // onUpdate rather than onToggle: a jump straight past the whole range never toggles.
      if (footer && stage) {
        ScrollTrigger.create({
          trigger: stage,
          start: "top bottom",
          end: "bottom bottom",
          onUpdate: (self) => {
            const lifted = self.progress > 0;
            if (lifted) footer.style.visibility = "visible";
            el.toggleAttribute("data-lifted", lifted);
          },
        });
      }

      // Whichever sector crosses the middle of the screen takes the ring.
      gsap.utils.toArray<HTMLElement>("[data-sector]").forEach((sector, index) => {
        ScrollTrigger.create({
          trigger: sector,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => { if (self.isActive) setActive(index); },
        });
      });

      // The logo turns light while the dark chapter sits under the nav.
      const nav = document.querySelector<HTMLElement>("[data-hero-nav]");
      if (nav) {
        ScrollTrigger.create({
          trigger: "[data-chapter]",
          start: "top 64px",
          end: "bottom 64px",
          onToggle: (self) => { nav.dataset.tone = self.isActive ? "dark" : ""; },
          onKill: () => { delete nav.dataset.tone; },
        });
      }

      // The ring fills as the whole list passes.
      ScrollTrigger.create({
        trigger: "[data-sectors]",
        start: "top center",
        end: "bottom center",
        onUpdate: (self) => arcRef.current?.style.setProperty("stroke-dashoffset", String(100 - self.progress * 100)),
      });

      if (reduced) return;

      gsap.timeline({ delay: 0.1 })
        .from("[data-hero-title] [data-word]", { yPercent: 115, duration: 1.3, stagger: 0.08, ease: "expo.out" })
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, stagger: 0.1, ease: "expo.out" }, 0.35);

      gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((heading) => {
        gsap.from(heading.querySelectorAll("[data-word]"), {
          yPercent: 115,
          duration: 1.1,
          stagger: 0.05,
          ease: "expo.out",
          scrollTrigger: { trigger: heading, start: "top 86%", once: true },
        });
      });

      gsap.set("[data-reveal]", { opacity: 0 });
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 90%",
        once: true,
        onEnter: (batch) => gsap.fromTo(batch, { y: 36, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, stagger: 0.08, ease: "expo.out", overwrite: true }),
      });

      // The dark chapter grows from an inset card to the full screen as it arrives.
      gsap.fromTo("[data-chapter]",
        { clipPath: "inset(0% 6% 0% 6% round 2.5rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0rem)",
          ease: "none",
          scrollTrigger: { trigger: "[data-chapter]", start: "top bottom", end: "top top", scrub: true },
        });
      // …and rounds its bottom corners as it leaves, like the pages lifting off the footer.
      // Full width throughout, so the light logo never straddles an edge.
      gsap.fromTo("[data-chapter]",
        { clipPath: "inset(0% 0% 0% 0% round 0rem 0rem 0rem 0rem)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 0rem 0rem 4rem 4rem)",
          ease: "none",
          immediateRender: false,
          scrollTrigger: { trigger: "[data-chapter]", start: "bottom bottom", end: "bottom 50%", scrub: true },
        });
    }, el);

    // Hiding waits for the corners to flatten, so the way back animates like the way in.
    const onCornersSettled = (event: TransitionEvent) => {
      if (event.target === el && event.propertyName.startsWith("border") && !el.hasAttribute("data-lifted") && footer) {
        footer.style.visibility = "hidden";
      }
    };
    el.addEventListener("transitionend", onCornersSettled);

    // Late webfonts change line breaks, and with them every trigger position.
    let cancelled = false;
    void fontsReady().then(() => { if (!cancelled) ScrollTrigger.refresh(); });

    return () => {
      cancelled = true;
      el.removeEventListener("transitionend", onCornersSettled);
      context.revert();
      el.removeAttribute("data-lifted");
      if (footer) footer.style.visibility = "";
    };
  }, []);

  const goTo = (index: number) => {
    const target = root.current?.querySelectorAll<HTMLElement>("[data-sector]")[index];
    if (!target) return;
    jumpTo(target.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2);
  };

  return (
    <>
      <div ref={root} className={styles.page}>
        <HeroNav />

        {/* ------------------------------------------------------------ hero */}
        <section id="top" className={styles.hero}>
          <h1 data-hero-title className={styles.heroTitle}>
            <Words text="Industries" />
            <br />
            <Words text="we serve" tail={<span className="hero-period">.</span>} />
          </h1>
          <div className={styles.heroFoot}>
            <p data-hero-fade className={styles.heroIntro}>{industries.intro}</p>
            <div data-hero-fade><GoogleSourceButton /></div>
          </div>
        </section>

        {/* --------------------------------------------------------- chapter */}
        <section id="sectors" data-chapter className={styles.chapter}>
          <header className={styles.chapterHead}>
            <h2 data-lines className={styles.chapterTitle}><Words text="Where we work" /></h2>
            <p data-reveal className={styles.chapterIntro}>{industries.chapterIntro}</p>
          </header>
          <div className={styles.chapterInner}>
            <aside className={styles.aside}>
              <div className={styles.asideSticky}>
                <div className={styles.ring} aria-hidden>
                  <svg viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="94" className={styles.ringTrackDark} />
                    <circle ref={arcRef} cx="100" cy="100" r="94" pathLength="100" className={styles.ringArc} />
                  </svg>
                  <div className={styles.ringCenter}>
                    <span className={styles.ringIndex}>{pad(active + 1)} / {pad(sectors.length)}</span>
                    <span key={active} className={styles.ringWord}>{sectors[active].word}</span>
                  </div>
                </div>
                <nav aria-label="Sectors" className={styles.index}>
                  {sectors.map((sector, index) => (
                    <button
                      key={sector.slug}
                      type="button"
                      data-active={index === active}
                      aria-current={index === active ? "true" : undefined}
                      aria-label={sector.name}
                      onClick={() => goTo(index)}
                    >
                      {sector.word}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            <div data-sectors className={styles.sectors}>
              {sectors.map((sector, index) => (
                <article key={sector.slug} data-sector data-active={index === active} className={styles.sector}>
                  <h3 className={styles.sectorName}>{sector.name}</h3>
                  <p className={styles.sectorIntro}>{sector.intro}</p>
                  <ul className={styles.points}>
                    {sector.points.map((point) => <li key={point}>{point}</li>)}
                  </ul>
                  <div className={styles.fit}>
                    <span className={styles.fitLabel}>Services that fit</span>
                    {sector.services.map((slug) => (
                      <a key={slug} href={`/services/${slug}`} className={styles.fitLink}>
                        {serviceLabel(slug)}
                        <span aria-hidden>↗</span>
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- cta */}
        <section className={styles.cta}>
          <h2 data-lines className={styles.ctaTitle}>
            <Words text={industries.cta.heading} tail={<span className="hero-period">?</span>} />
          </h2>
          <p data-reveal className={styles.body}>{industries.cta.body}</p>
          <div data-reveal>
            <ActionPill href="/contact" label="Start your project" />
          </div>
        </section>
      </div>

      <SiteFooter />
    </>
  );
}

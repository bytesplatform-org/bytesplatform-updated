"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroNav from "@/components/hero/HeroNav";
import ActionPill from "@/components/ui/ActionPill";
import StoryFilm from "@/components/sections/StoryFilm";
import SiteFooter from "@/components/sections/SiteFooter";
import { about } from "@/data/about";
import { site } from "@/data/site";
import { fontsReady, prefersReducedMotion } from "@/lib/animation/prefs";
import { mountScroll } from "@/lib/animation/scroll";
import styles from "./AboutPage.module.css";

gsap.registerPlugin(ScrollTrigger);

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

function SectionLabel({ index, children }: { index: string; children: string }) {
  return (
    <div className={styles.sectionLabel}>
      <span className="hero-dot" aria-hidden />
      <span className="hero-meta">{children}</span>
      <span className={`hero-meta ${styles.sectionIndex}`}>{index}</span>
    </div>
  );
}

export default function AboutPage() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => mountScroll({ smooth: !prefersReducedMotion() }), []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const reduced = prefersReducedMotion();
    const footer = document.querySelector<HTMLElement>("[data-site-footer]");
    const stage = footer?.parentElement;

    const context = gsap.context(() => {
      // The page lifts away like the home page's Work panel, uncovering the fixed footer.
      if (footer && stage) {
        ScrollTrigger.create({
          trigger: stage,
          start: "top bottom",
          end: "bottom bottom",
          // Driven from onUpdate rather than onToggle: a jump straight past the
          // whole range never toggles. Hiding waits for the corners to flatten
          // (see onCornersSettled), so the way back animates like the way in.
          onUpdate: (self) => {
            const lifted = self.progress > 0;
            if (lifted) footer.style.visibility = "visible";
            // The lift only toggles the corners; CSS animates them in and out.
            el.toggleAttribute("data-lifted", lifted);
          },
        });
      }
      if (reduced) return;

      const hero = gsap.timeline({ delay: 0.1 });
      hero
        .from("[data-hero-title] [data-word]", { yPercent: 115, duration: 1.3, stagger: 0.08, ease: "expo.out" })
        .from("[data-hero-fade]", { y: 24, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" }, 0.35);

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

      // The statement inks in word by word as it crosses the viewport.
      gsap.fromTo("[data-statement] [data-word]", { opacity: 0.14 }, {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: "[data-statement]", start: "top 78%", end: "bottom 45%", scrub: true },
      });

      gsap.from("[data-connector]", {
        scaleY: 0,
        ease: "none",
        scrollTrigger: { trigger: "[data-connector]", start: "top 85%", end: "bottom 60%", scrub: true },
      });
    }, el);

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

  return (
    <>
      <div ref={root} className={styles.page}>
        <HeroNav />

        {/* ------------------------------------------------------------ hero */}
        <section id="top" className={styles.hero}>
          <div className={styles.heroBody}>
            <h1 data-hero-title className={styles.heroTitle}>
              <Words text="Innovating the" />
              <br />
              <Words text="future" tail={<span className="hero-period">.</span>} />
            </h1>

            <p data-hero-fade className={styles.heroIntro}>{about.intro}</p>
          </div>
        </section>

        {/* ------------------------------------------------------- statement */}
        <section className={styles.section}>
          <SectionLabel index="01">Who we are</SectionLabel>
          <p data-statement className={styles.statement}>
            {about.statement.split(" ").map((word, index) => (
              <span key={index}><span data-word>{word}</span>{" "}</span>
            ))}
          </p>
        </section>

        {/* ----------------------------------------------------------- story */}
        <section className={styles.section}>
          <SectionLabel index="02">Discover our story</SectionLabel>
          <div className={styles.storyHead}>
            <h2 data-lines className={styles.h2}><Words text={about.story.title} /></h2>
            <p data-reveal className={styles.body}>{about.story.body}</p>
          </div>

          <StoryFilm />

          <ul className={styles.tags}>
            {about.story.tags.map((tag) => (
              <li data-reveal key={tag} className="hero-pill"><span className="hero-dot" aria-hidden />{tag}</li>
            ))}
          </ul>
        </section>

        {/* ---------------------------------------------------- capabilities */}
        <section className={styles.section}>
          <SectionLabel index="03">What we do</SectionLabel>
          <h2 data-lines className={styles.h2}><Words text="Every layer of your digital business, under one roof." /></h2>

          <ol className={styles.capabilities}>
            {about.capabilities.map((group, index) => (
              <li data-reveal key={group.title} className={styles.capability}>
                <span className={styles.capabilityIndex}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className={styles.capabilityTitle}>{group.title}</h3>
                <ul className={styles.capabilityItems}>
                  {group.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        {/* ------------------------------------------------------ philosophy */}
        <section className={`${styles.section} ${styles.philosophy}`}>
          <div className={styles.philosophyAside}>
            <SectionLabel index="04">Our philosophy</SectionLabel>
            <h2 data-lines className={styles.quote}>
              <Words text={about.philosophyQuote.replace(/\.$/, "")} tail={<span className="hero-period">.</span>} />
            </h2>
          </div>
          <div className={styles.philosophyText}>
            {about.philosophy.map((paragraph, index) => (
              <p data-reveal key={index} className={index === 0 ? styles.lead : styles.body}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* ------------------------------------------------------ advantages */}
        <section className={styles.section}>
          <SectionLabel index="05">The Bytes advantage</SectionLabel>
          <h2 data-lines className={styles.h2}><Words text="Built in the open. Shipped at speed." /></h2>

          <div className={styles.advantages}>
            {about.advantages.map((item, index) => (
              <article
                data-reveal
                key={item.title}
                className={`${styles.card} ${"stat" in item ? styles.cardAccent : ""}`}
              >
                <span className={styles.cardIndex}>{String(index + 1).padStart(2, "0")}</span>
                {"stat" in item && <span aria-hidden className={styles.cardStat}>{item.stat}</span>}
                <div>
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  <p className={styles.cardBody}>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------------------------------------------------- integrations */}
        <section className={`${styles.section} ${styles.integrations}`}>
          <div>
            <SectionLabel index="06">Integration ecosystem</SectionLabel>
            <h2 data-lines className={styles.h2}><Words text="A modern stack that plugs into yours." /></h2>
            <p data-reveal className={styles.body}>{about.stack}</p>
          </div>
          <ul className={styles.integrationList}>
            {about.integrations.map((group) => (
              <li data-reveal key={group.title} className={styles.integration}>
                <h3>{group.title}</h3>
                <p>{group.items.join(" · ")}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* --------------------------------------------------------- support */}
        <div className={styles.marquee} aria-label={`Ongoing care: ${about.support.join(", ")}`}>
          <div className={styles.marqueeTrack} aria-hidden>
            {[0, 1].map((copy) => (
              <span key={copy} className={styles.marqueeRun}>
                {about.support.map((item) => (
                  <span key={item} className={styles.marqueeItem}>{item}<span className={styles.marqueeDot} /></span>
                ))}
              </span>
            ))}
          </div>
        </div>

        {/* ------------------------------------------------------ subsidiary */}
        <section className={styles.section}>
          <SectionLabel index="07">Our subsidiary</SectionLabel>
          <div className={styles.subsidiary}>
            <div className={styles.org}>
              <div data-reveal className={styles.orgNode}>
                <span className="hero-meta">Parent company</span>
                <strong>{site.legalName}</strong>
              </div>
              <span data-connector aria-hidden className={styles.connector} />
              <a data-reveal href={about.subsidiary.url} target="_blank" rel="noreferrer" className={`${styles.orgNode} ${styles.orgLink}`}>
                <span className="hero-meta">Subsidiary</span>
                <strong>{about.subsidiary.name}</strong>
                <span aria-hidden className={styles.orgArrow}>↗</span>
              </a>
            </div>
            <p data-reveal className={styles.lead}>{about.subsidiary.body}</p>
          </div>
        </section>

        {/* ------------------------------------------------------------- cta */}
        <section className={styles.cta}>
          <p data-reveal className="hero-meta">Let&apos;s talk</p>
          <h2 data-lines className={styles.ctaTitle}>
            <Words text="Ready to build the future" tail={<span className="hero-period">?</span>} />
          </h2>
          <p data-reveal className={styles.body}>Transform your vision into reality. Scale your impact. Lead your market.</p>
          <div data-reveal>
            <ActionPill href="/contact" label="Start your project" />
          </div>
        </section>
      </div>

      <SiteFooter />

    </>
  );
}

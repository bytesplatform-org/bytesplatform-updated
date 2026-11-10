"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroNav from "@/components/hero/HeroNav";
import ActionPill from "@/components/ui/ActionPill";
import GoogleSourceButton from "@/components/ui/GoogleSourceButton";
import heroFoot from "@/components/ui/HeroFoot.module.css";
import SiteFooter from "@/components/sections/SiteFooter";
import { careers } from "@/data/careers";
import { site } from "@/data/site";
import { fontsReady, prefersReducedMotion } from "@/lib/animation/prefs";
import { mountScroll } from "@/lib/animation/scroll";
import { mountFooterLift } from "@/lib/animation/footerLift";
import styles from "./CareersPage.module.css";

gsap.registerPlugin(ScrollTrigger);

const teams = ["All", ...Array.from(new Set(careers.roles.map((role) => role.team)))];
const hiring = careers.roles.length > 0;

/** There is no upload backend: applications go to the studio inbox, subject prefilled. */
const applyHref = (subject: string) => `mailto:${site.email}?subject=${encodeURIComponent(subject)}`;

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

export default function CareersPage() {
  const root = useRef<HTMLDivElement>(null);
  const [team, setTeam] = useState("All");
  const [openRole, setOpenRole] = useState<string | null>(null);
  const roles = careers.roles.filter((role) => team === "All" || role.team === team);

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
    }, el);

    // Late webfonts change line breaks, and with them every trigger position.
    let cancelled = false;
    void fontsReady().then(() => { if (!cancelled) ScrollTrigger.refresh(); });

    return () => {
      cancelled = true;
      context.revert();
      releaseFooter();
    };
  }, []);

  // Filtering and expanding change the page height under every later trigger.
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [team, openRole]);

  return (
    <>
      <div ref={root} className={styles.page}>
        <HeroNav />

        {/* ------------------------------------------------------------ hero */}
        <section id="top" className={styles.hero}>
          <h1 data-hero-title className={styles.heroTitle}>
            <Words text="Build the future" />
            <br />
            <Words text="with us" tail={<span className="hero-period">.</span>} />
          </h1>
          <div className={styles.heroFoot}>
            <p data-hero-fade className={styles.heroIntro}>{careers.intro}</p>
            <div className={heroFoot.actions}>
              <div data-hero-fade><GoogleSourceButton /></div>
              <div data-hero-fade>
                <ActionPill href="#roles" label={hiring ? "Explore open roles" : "Join our talent pool"} />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- statement */}
        <section className={styles.section}>
          <p data-statement className={styles.statement}>
            {careers.statement.split(" ").map((word, index) => (
              <span key={index}><span data-word>{word}</span>{" "}</span>
            ))}
          </p>
        </section>

        {/* ----------------------------------------------------------- perks */}
        <section className={styles.section}>
          <h2 data-lines className={styles.h2}><Words text="What you get" /></h2>
          <ul className={styles.perks}>
            {careers.perks.map((perk) => (
              <li data-reveal key={perk}>
                <span className="hero-dot" aria-hidden />
                {perk}
              </li>
            ))}
          </ul>
        </section>

        {/* ----------------------------------------------------------- roles */}
        <section id="roles" className={styles.section}>
          <div className={styles.rolesHead}>
            <h2 data-lines className={styles.h2}>
              <Words text="Open roles" tail={hiring && <sup className={styles.count}>{careers.roles.length}</sup>} />
            </h2>
            {hiring && (
              <div data-reveal role="group" aria-label="Filter roles by team" className={styles.filters}>
                {teams.map((name) => (
                  <button
                    key={name}
                    type="button"
                    aria-pressed={team === name}
                    onClick={() => { setTeam(name); setOpenRole(null); }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {!hiring && (
            <div data-reveal className={styles.empty}>
              <p className={styles.emptyTitle}>No open roles right now<span className="hero-period">.</span></p>
              <div className={styles.emptyAside}>
                <p className={styles.body}>
                  We&apos;re not hiring for specific positions at the moment, but we&apos;re always glad to meet good
                  people. Send your CV and we&apos;ll reach out when something fits.
                </p>
                <ActionPill href={applyHref("General Application")} label="Send your CV" />
              </div>
            </div>
          )}

          {hiring && (
            <ul className={styles.roles}>
              {roles.map((role) => {
                const expanded = openRole === role.title;
                const id = `role-${role.title.replace(/\W+/g, "-").toLowerCase()}`;
                return (
                  <li key={role.title} className={styles.role} data-open={expanded}>
                    <button
                      type="button"
                      className={styles.roleHead}
                      aria-expanded={expanded}
                      aria-controls={id}
                      onClick={() => setOpenRole(expanded ? null : role.title)}
                    >
                      <span className={styles.roleTitle}>{role.title}</span>
                      <span className={styles.roleMeta}>{role.team}</span>
                      <span className={styles.roleMeta}>{careers.type}</span>
                      <span aria-hidden className={styles.roleIcon} />
                    </button>
                    <div id={id} className={styles.roleBody}>
                      <div className={styles.roleInner}>
                        <div>
                          <p className={styles.label}>What we&apos;re looking for</p>
                          <ul className={styles.requirements}>
                            {role.requirements.map((item) => <li key={item}>{item}</li>)}
                          </ul>
                        </div>
                        <div className={styles.roleAside}>
                          <p className={styles.body}>{careers.about}</p>
                          <p className={styles.label}>{careers.location}</p>
                          <ActionPill href={applyHref(`Job Application - ${role.title}`)} label="Apply for this role" />
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ------------------------------------------------------------- cta */}
        {/* With no roles listed, the empty state above already asks for a CV. */}
        {hiring && (
          <section className={styles.cta}>
            <h2 data-lines className={styles.ctaTitle}>
              <Words text="Don't see your role" tail={<span className="hero-period">?</span>} />
            </h2>
            <p data-reveal className={styles.body}>
              We&apos;re always glad to meet good people. Send your CV and a few lines about what you&apos;d like to work on.
            </p>
            <div data-reveal>
              <ActionPill href={applyHref("General Application")} label="Send your CV" />
            </div>
          </section>
        )}
      </div>

      <SiteFooter />
    </>
  );
}

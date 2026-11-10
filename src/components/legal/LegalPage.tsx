"use client";

import { Fragment, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroNav from "@/components/hero/HeroNav";
import SiteFooter from "@/components/sections/SiteFooter";
import CurrentLink from "@/components/ui/CurrentLink";
import GoogleSourceButton from "@/components/ui/GoogleSourceButton";
import heroFoot from "@/components/ui/HeroFoot.module.css";
import { fontsReady, prefersReducedMotion } from "@/lib/animation/prefs";
import { jumpTo, mountScroll } from "@/lib/animation/scroll";
import { mountFooterLift } from "@/lib/animation/footerLift";
import styles from "./LegalPage.module.css";

gsap.registerPlugin(ScrollTrigger);

export const legalPages = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms-conditions", label: "Terms & Conditions" },
  { href: "/refund-policy", label: "Refund Policy" },
] as const;

const slugify = (text: string) => text.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          <span className={styles.wordSlot}><span data-word className={styles.word}>{word}</span></span>
        </Fragment>
      ))}
    </>
  );
}

/** Shared frame for the legal pages; the policy text itself is passed in untouched. */
export default function LegalPage({ title, subtitle, children }: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const root = useRef<HTMLDivElement>(null);
  const prose = useRef<HTMLDivElement>(null);
  const [sections, setSections] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => mountScroll({ smooth: !prefersReducedMotion() }), []);

  // The contents list is read from the policy's own headings, so it can never drift from the text.
  useLayoutEffect(() => {
    const headings = Array.from(prose.current?.querySelectorAll("h2") ?? []);
    const found = headings.map((heading) => {
      heading.id ||= slugify(heading.textContent ?? "");
      return { id: heading.id, text: heading.textContent ?? "" };
    });
    setSections(found);
  }, []);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const releaseFooter = mountFooterLift(el);
    const context = gsap.context(() => {
      el.querySelectorAll<HTMLElement>("[data-legal-body] h2").forEach((heading) => {
        ScrollTrigger.create({
          trigger: heading,
          start: "top 160px",
          onEnter: () => setActive(heading.id),
          onEnterBack: () => setActive(heading.id),
        });
      });
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
  }, [sections]);

  // Land headings below the fixed nav rather than under it. Handled here so the
  // site-wide anchor router (offset 0) never sees the click.
  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    jumpTo(target.getBoundingClientRect().top + window.scrollY - 128);
    setActive(id);
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <>
      <div ref={root} className={styles.page}>
        <HeroNav />

        <section id="top" className={styles.hero}>
          <p data-hero-fade className={styles.label}>Legal</p>
          <h1 data-hero-title className={styles.heroTitle}><Words text={title} /></h1>
          <div className={heroFoot.foot}>
            <p data-hero-fade className={styles.heroIntro}>{subtitle}</p>
            <div data-hero-fade><GoogleSourceButton /></div>
          </div>
        </section>

        <div className={styles.layout}>
          <aside className={styles.aside}>
            <div className={styles.asideSticky}>
              {sections.length > 0 && (
                <nav aria-label="On this page">
                  <p className={styles.label}>On this page</p>
                  <ol className={styles.toc}>
                    {sections.map((section) => (
                      <li key={section.id}>
                        <a href={`#${section.id}`} data-active={active === section.id} onClick={(event) => goTo(event, section.id)}>
                          {section.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}
              <nav aria-label="Legal pages" className={styles.siblings}>
                <p className={styles.label}>Policies</p>
                {legalPages.map((page) => (
                  <CurrentLink key={page.href} href={page.href}>{page.label}</CurrentLink>
                ))}
              </nav>
            </div>
          </aside>

          <div ref={prose} data-legal-body className={styles.prose}>
            {children}
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

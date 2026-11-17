"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HeroNav from "@/components/hero/HeroNav";
import SiteFooter from "@/components/sections/SiteFooter";
import ActionPill from "@/components/ui/ActionPill";
import { mountFooterLift } from "@/lib/animation/footerLift";
import { prefersReducedMotion } from "@/lib/animation/prefs";
import { mountReveal } from "@/lib/govcon/reveal";
import { governmentServiceShared as shared, govServicePath, type GovernmentService } from "@/data/governmentServices";
import { audienceKeys, type AudienceKey } from "@/data/govcon";
import ServiceIcon, { type IconName } from "./ServiceIcons";
import styles from "./GovServicePage.module.css";

gsap.registerPlugin(ScrollTrigger);

const GOV = "/government-contractors";

/** Icons for the shared blocks, in the same order as their items. */
const stepIcons: IconName[] = ["phone", "search", "pencil", "cycle", "shield", "rocket", "lifebuoy"];
const managementIcons: IconName[] = ["user", "calendar", "board", "stamp", "coin", "box"];
const waysIcons: IconName[] = ["contract", "inbox", "team", "wrench"];
const audienceCards: { key: AudienceKey; label: string; icon: IconName }[] = [
  { key: "state", label: "State & local", icon: "building" },
  { key: "prime", label: "Federal prime", icon: "briefcase" },
  { key: "small", label: "Small business", icon: "store" },
];

/**
 * ?audience= (picked with the hero tabs) is read after mount, the pages being
 * static: it stays on every link back into the government pages, so the call
 * form's hidden audience field still knows where the lead came from, and it
 * highlights the matching "Who it's for" card.
 */
function useAudience() {
  const [audience, setAudience] = useState<AudienceKey | null>(null);
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("audience");
    if (audienceKeys.includes(wanted as AudienceKey)) setAudience(wanted as AudienceKey);
  }, []);
  return { audience, query: audience ? `?audience=${audience}` : "" };
}

/** A section's heading row: a small number and the H2. */
function Head({ index, title }: { index: number; title: string }) {
  return (
    <div className={styles.head}>
      <span className={styles.headIndex} aria-hidden>{String(index).padStart(2, "0")}</span>
      <h2 data-reveal>{title}</h2>
    </div>
  );
}

/**
 * A government service detail page. Content comes from governmentServices;
 * the three middle blocks are shared. Blocks fade up into view, and the
 * "How it works" line fills as you scroll; reduced motion shows everything still.
 */
export default function GovServicePage({ service, related }: { service: GovernmentService; related: GovernmentService[] }) {
  const root = useRef<HTMLDivElement>(null);
  const { audience, query } = useAudience();
  const callHref = `${GOV}${query}#call`;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const releaseFooter = mountFooterLift(el);
    let releaseReveal = () => {};
    const context = gsap.context(() => {
      if (prefersReducedMotion()) return;
      gsap.timeline({ delay: 0.15 })
        .from("[data-hero-in]", { y: 28, opacity: 0, duration: 1, stagger: 0.08, ease: "expo.out" })
        .from("[data-hero-image]", { scale: 1.06, opacity: 0, duration: 1.4, ease: "expo.out" }, 0.1);
      releaseReveal = mountReveal(el);
      gsap.from("[data-steps-fill]", {
        scaleY: 0, ease: "none",
        scrollTrigger: { trigger: "[data-steps]", start: "top 70%", end: "bottom 65%", scrub: true },
      });
    }, el);
    return () => {
      releaseReveal();
      context.revert();
      releaseFooter();
    };
  }, []);

  let section = 0;

  return (
    <>
      <div ref={root} className={styles.page}>
        <HeroNav />

        <article className={styles.wrap}>
          {/* ------------------------------------------------------ hero */}
          <header className={styles.hero}>
            <div className={styles.heroText}>
              <nav data-hero-in aria-label="Breadcrumb" className={styles.breadcrumb}>
                <ol>
                  <li><a href={`${GOV}${query}`}>Government</a></li>
                  <li><a href={`${GOV}${query}#services`}>Services</a></li>
                  <li><span aria-current="page">{service.title}</span></li>
                </ol>
              </nav>
              <p data-hero-in className={styles.meta}>
                <span className={styles.number}>{service.number}</span>
                <span className={styles.naics}>NAICS {service.naics.join(" · ")}</span>
              </p>
              <h1 data-hero-in className={styles.title}>{service.title}<span className="hero-period">.</span></h1>
              <p data-hero-in className={styles.lead}>{service.summary}</p>
              <div data-hero-in className={styles.actions}>
                <ActionPill href={callHref} label="Book a capability call" />
                <a className={styles.secondary} href={`${GOV}${query}#services`}>All services</a>
              </div>
            </div>
            <div className={styles.heroMedia}>
              {/* eslint-disable-next-line @next/next/no-img-element -- static, decorative */}
              <img data-hero-image className={styles.banner} src={service.image} alt="" width={900} height={600} />
            </div>
          </header>

          {/* ------------------------------------------------ who it's for */}
          <section className={styles.section}>
            <Head index={++section} title="Who it's for" />
            <ul className={styles.audiences}>
              {audienceCards.map((card) => (
                <li data-reveal key={card.key} className={styles.tile} data-current={audience === card.key || undefined}>
                  <span className={styles.icon}><ServiceIcon name={card.icon} /></span>
                  <strong>{card.label}</strong>
                  <span>{service.whoItsFor[card.key]}</span>
                  {audience === card.key && <em className={styles.you}>You</em>}
                </li>
              ))}
            </ul>
          </section>

          {/* ------------------------------------------ problem → solution */}
          <section className={styles.section}>
            <Head index={++section} title="The problem" />
            <ul className={styles.problems}>
              {service.problems.map((problem) => (
                <li data-reveal key={problem} className={styles.problem}>
                  <span className={`${styles.icon} ${styles.iconMuted}`}><ServiceIcon name="alert" /></span>
                  <span>{problem}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <Head index={++section} title="What we do" />
            <ul className={styles.grid3}>
              {service.whatWeDo.map((item) => (
                <li data-reveal key={item.lead} className={styles.tile}>
                  <span className={`${styles.icon} ${styles.iconBlue}`}><ServiceIcon name="check" /></span>
                  <strong>{item.lead.replace(/:$/, "")}</strong>
                  {item.line && <span>{item.line.charAt(0).toUpperCase() + item.line.slice(1)}.</span>}
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <Head index={++section} title="What you get" />
            <ul className={styles.deliverables}>
              {service.deliverables.map((deliverable) => (
                <li data-reveal key={deliverable}>
                  <ServiceIcon name="file" className={styles.fileIcon} />
                  {deliverable}
                </li>
              ))}
            </ul>
          </section>

          {/* -------------------------------------------- shared: process */}
          <section className={styles.section}>
            <Head index={++section} title="How it works" />
            <ol data-steps className={styles.steps}>
              <span aria-hidden className={styles.stepsTrack}><span data-steps-fill className={styles.stepsFill} /></span>
              {shared.howItWorks.map((step, index) => (
                <li data-reveal key={step.lead} className={styles.step}>
                  <span className={styles.stepDot}><ServiceIcon name={stepIcons[index]} /></span>
                  <div>
                    <span className={styles.stepNumber}>Step {index + 1}</span>
                    <strong>{step.lead}</strong>
                    <p>{step.line}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className={styles.section}>
            <Head index={++section} title="How we manage your project" />
            <ul className={styles.grid3}>
              {shared.management.map((item, index) => (
                <li data-reveal key={item.lead} className={styles.tile}>
                  <span className={styles.icon}><ServiceIcon name={managementIcons[index]} /></span>
                  <strong>{item.lead.replace(/:$/, "")}</strong>
                  <span>{item.line.charAt(0).toUpperCase() + item.line.slice(1)}.</span>
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.section}>
            <Head index={++section} title="Ways to work with us" />
            <ul className={styles.grid4}>
              {shared.waysToWork.map((item, index) => (
                <li data-reveal key={item.lead} className={styles.tile}>
                  <span className={styles.icon}><ServiceIcon name={waysIcons[index]} /></span>
                  <strong>{item.lead.replace(/:$/, "")}</strong>
                  <span>{item.line.charAt(0).toUpperCase() + item.line.slice(1)}.</span>
                </li>
              ))}
            </ul>
          </section>

          {/* ------------------------------------------------------ faq */}
          <section className={`${styles.section} ${styles.narrow}`}>
            <Head index={++section} title="Questions" />
            <div>
              {service.faqs.map((faq) => (
                <details data-reveal key={faq.q} className={styles.faq}>
                  <summary>{faq.q}<span aria-hidden className={styles.faqIcon} /></summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* -------------------------------------------------- related */}
          <section className={styles.section}>
            <Head index={++section} title="Related services" />
            <ul className={styles.related}>
              {related.map((item) => (
                <li data-reveal key={item.slug}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- decorative thumbnail */}
                  <img src={item.image} alt="" width={900} height={600} loading="lazy" />
                  <div>
                    <span className={styles.relatedNumber}>{item.number}</span>
                    <h3><a href={`${govServicePath(item.slug)}${query}`}>{item.title}</a></h3>
                    <p>{item.summary}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* ------------------------------------------------------ cta */}
          <section data-reveal aria-labelledby="service-cta" className={styles.cta}>
            <h2 id="service-cta">Have a solicitation or a problem to solve?</h2>
            <div className={styles.ctaActions}>
              <ActionPill href={callHref} label="Book a capability call" />
              <p>We reply within one business day.</p>
            </div>
          </section>
        </article>
      </div>

      <SiteFooter />
    </>
  );
}

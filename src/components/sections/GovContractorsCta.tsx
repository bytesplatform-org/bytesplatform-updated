"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ActionPill from "@/components/ui/ActionPill";
import { prefersReducedMotion } from "@/lib/animation/prefs";
import { Rule, Words } from "./reveal";

gsap.registerPlugin(ScrollTrigger);

const OFFER = ["Websites & portals", "CRMs", "ERPs", "BytesGov platform", "Section 508 · NIST · FAR"];

/**
 * FOR GOVERNMENT CONTRACTORS: the closing call to action on the home page,
 * pointing to the government contractors page and the live demos.
 */
export default function GovContractorsCta() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    // Same pattern as Stats and Clients: hidden states up front, tweened *to*
    // rest, measured after Work's late pin (refreshPriority -1).
    const context = gsap.context(() => {
      const ease = "expo.out";
      gsap.set("[data-gov-head] [data-rule]", { scaleX: 0 });
      gsap.set("[data-gov-head] [data-eyebrow] > :not([data-rule])", { x: -16, opacity: 0 });
      gsap.set("[data-gov-card]", { y: 60, opacity: 0 });
      gsap.set("[data-gov-card] [data-word]", { yPercent: 115 });
      gsap.set("[data-gov-fade]", { y: 24, opacity: 0 });
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top 80%", toggleActions: "play none none reverse", refreshPriority: -1 } })
        .to("[data-gov-head] [data-rule]", { scaleX: 1, duration: 1.4, ease: "power3.inOut" })
        .to("[data-gov-head] [data-eyebrow] > :not([data-rule])", { x: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease }, 0.2)
        .to("[data-gov-card]", { y: 0, opacity: 1, duration: 1.3, ease }, 0.25)
        .to("[data-gov-card] [data-word]", { yPercent: 0, duration: 1.2, stagger: 0.05, ease }, 0.45)
        .to("[data-gov-fade]", { y: 0, opacity: 1, duration: 1, stagger: 0.06, ease }, 0.7);
    }, section);
    return () => context.revert();
  }, []);

  return (
    <section ref={root} aria-labelledby="gov-heading" className="pb-[clamp(5rem,14vh,10rem)]">
      <div className="mx-auto max-w-[1800px] px-[var(--bp-gut)]">
        <div data-gov-head>
          <div data-eyebrow className="relative flex items-center gap-[0.7rem] pt-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">
            <Rule />
            <span className="hero-dot" aria-hidden />
            <span>For government contractors</span>
          </div>
        </div>

        <div
          data-gov-card
          className="mt-[clamp(2rem,5vw,4rem)] grid gap-[clamp(2rem,4vw,4rem)] rounded-[clamp(1.75rem,3vw,2.75rem)] bg-[#1a1a1a] p-[clamp(1.75rem,5vw,5rem)] text-paper lg:grid-cols-[1.3fr_1fr] lg:items-end"
        >
          <div>
            <h2
              id="gov-heading"
              className="max-w-[16ch] text-[clamp(2.4rem,5.4vw,5.5rem)] font-medium leading-[0.98] tracking-[-0.06em]"
            >
              <Words text="The software powerhouse behind government contractors" tail={<span className="text-blue">.</span>} />
            </h2>
            <ul data-gov-fade className="mt-[clamp(1.5rem,3vw,2.5rem)] flex flex-wrap gap-2">
              {OFFER.map((item) => (
                <li key={item} className="rounded-full border border-[rgb(240_241_250/0.18)] px-[0.85rem] py-[0.45rem] text-[0.82rem] font-medium text-[rgb(240_241_250/0.85)]">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-6">
            <p data-gov-fade className="max-w-[34rem] text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.6] text-[rgb(240_241_250/0.7)]">
              Federal, state and local agencies buy modern websites, portals, CRMs and ERPs every week. We build them for
              the primes and small businesses who win that work, and we run our own contracting platform, BytesGov.
            </p>
            <div data-gov-fade className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <ActionPill href="/government-contractors" label="Explore government work" />
              <a
                href="/case-studies"
                className="font-medium text-paper underline decoration-[rgb(240_241_250/0.3)] underline-offset-[0.3em] transition-colors duration-300 hover:text-[#8aa2ff] hover:decoration-current"
              >
                See case studies &amp; demos
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animation/prefs";
import { Rule, Words } from "./reveal";
import StoryFilm from "./StoryFilm";

gsap.registerPlugin(ScrollTrigger);

const TAGS = ["High-quality production", "Professional team", "Innovative solutions"] as const;

/**
 * DISCOVER OUR STORY — the company film from the previous site's /about page.
 * Opens the closing sheet that slides over Work. The film card is StoryFilm.
 */
export default function StorySection() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = root.current;
    if (!section || prefersReducedMotion()) return;
    // Like StatsSection: measured after Work's pin (refreshPriority -1), with
    // hidden states set up front and tweened *to* the resting state.
    const context = gsap.context(() => {
      const ease = "expo.out";
      const trigger = (el: string, start = "top 80%") => ({
        trigger: el,
        start,
        toggleActions: "play none none reverse",
        refreshPriority: -1,
      });

      gsap.set("[data-story-head] [data-rule]", { scaleX: 0 });
      gsap.set("[data-story-head] [data-eyebrow] > :not([data-rule])", { x: -16, opacity: 0 });
      gsap.set("[data-story-head] [data-word]", { yPercent: 115 });
      gsap.set("[data-story-head] [data-story-body]", { y: 18, opacity: 0 });
      gsap.timeline({ scrollTrigger: trigger("[data-story-head]") })
        .to("[data-story-head] [data-rule]", { scaleX: 1, duration: 1.4, ease: "power3.inOut" })
        .to("[data-story-head] [data-eyebrow] > :not([data-rule])", { x: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease }, 0.2)
        .to("[data-story-head] [data-word]", { yPercent: 0, duration: 1.2, stagger: 0.05, ease }, 0.25)
        .to("[data-story-head] [data-story-body]", { y: 0, opacity: 1, duration: 1, ease }, 0.5);

      gsap.set("[data-story-tag]", { y: 12, opacity: 0 });
      gsap.timeline({ scrollTrigger: trigger("[data-story-tags]", "top 95%") })
        .to("[data-story-tag]", { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease });
    }, section);

    return () => context.revert();
  }, []);

  return (
    <section
      ref={root}
      id="story"
      aria-labelledby="story-heading"
      className="px-[var(--bp-gut)] pt-[clamp(6rem,18vh,12rem)]"
    >
      <div className="mx-auto max-w-[1800px]">
        <div data-story-head className="grid gap-y-8 md:grid-cols-[1.2fr_1fr] md:items-end md:gap-x-[clamp(1.5rem,4vw,5rem)]">
          <div>
            <div data-eyebrow className="relative flex items-center gap-[0.7rem] pt-4 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-ink-mute">
              <Rule />
              <span className="hero-dot" aria-hidden />
              <span>Discover our story</span>
            </div>
            <h2
              id="story-heading"
              className="mt-[clamp(2rem,5vw,4rem)] max-w-[16ch] text-[clamp(2.4rem,5vw,5rem)] font-medium leading-[1] tracking-[-0.055em] text-ink"
            >
              <Words text="Watch how we turn ideas into powerful digital solutions" tail={<span className="text-blue">.</span>} />
            </h2>
          </div>
          <p
            data-story-body
            className="max-w-[46ch] text-[clamp(1rem,1.2vw,1.2rem)] leading-[1.5] tracking-[-0.015em] text-ink-mute"
          >
            From concept to deployment, see how our team collaborates to deliver exceptional digital experiences that
            exceed expectations and drive measurable results.
          </p>
        </div>

        <StoryFilm className="mt-[clamp(3rem,7vw,6rem)]" />

        <ul data-story-tags className="mt-[clamp(1.5rem,3vw,2.5rem)] flex flex-wrap justify-center gap-3">
          {TAGS.map((tag) => (
            <li key={tag} data-story-tag className="hero-pill">
              <span className="hero-dot" aria-hidden />
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

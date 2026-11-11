"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animation/prefs";
import { Rule, Words } from "./reveal";
import StoryFilm from "./StoryFilm";

gsap.registerPlugin(ScrollTrigger);

/** The home page's portrait cut of the story (360 × 640). */
const FILM_SOURCES = [{ src: "/story/home-story.mp4", type: "video/mp4" }];
const FILM_POSTER = "/story/home-story-poster.jpg";

const TAGS = ["High-quality production", "Professional team", "Innovative solutions"] as const;

/**
 * DISCOVER OUR STORY — the company film from the previous site's /about page.
 * Opens the closing sheet that slides over Work: text beside a portrait cut
 * of the film (the card is StoryFilm).
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
      {/* Text on the left, the portrait film on the right (stacked on phones:
          text, film, tags). The film sizes itself to the screen's height. */}
      <div className="mx-auto grid max-w-[1800px] gap-y-[clamp(2.5rem,6vw,4rem)] md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:grid-rows-[1fr_auto_1fr] md:gap-x-[clamp(2rem,6vw,8rem)] md:gap-y-[clamp(2rem,3vw,3rem)]">
        <div data-story-head className="md:col-start-1 md:row-start-2">
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
          <p
            data-story-body
            className="mt-[clamp(1.5rem,3vw,2.5rem)] max-w-[46ch] text-[clamp(1rem,1.2vw,1.2rem)] leading-[1.5] tracking-[-0.015em] text-ink-mute"
          >
            From concept to deployment, see how our team collaborates to deliver exceptional digital experiences that
            exceed expectations and drive measurable results.
          </p>
        </div>

        <div className="md:col-start-2 md:row-span-3 md:row-start-1 md:self-center">
          <StoryFilm sources={FILM_SOURCES} poster={FILM_POSTER} ratio={9 / 16} />
        </div>

        <ul data-story-tags className="flex flex-wrap justify-center gap-3 md:col-start-1 md:row-start-3 md:justify-start md:self-start">
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

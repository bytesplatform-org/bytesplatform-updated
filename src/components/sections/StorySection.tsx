"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animation/prefs";
import { Rule, Words } from "./reveal";
import ShowreelPlayer from "./ShowreelPlayer";
import "./FluidVideoTransition.css";

gsap.registerPlugin(ScrollTrigger);

const STORY_SOURCES = [{ src: "/story/our-story.mp4", type: "video/mp4" }];
const STORY_POSTER = "/story/our-story-poster.webp";

const TAGS = ["High-quality production", "Professional team", "Innovative solutions"] as const;

/**
 * DISCOVER OUR STORY — the company film from the previous site's /about page.
 * Opens the closing sheet that slides over Work. A muted loop plays while the
 * card is on screen; its button opens the full-screen player with sound.
 */
export default function StorySection() {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLVideoElement>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerPointer, setPlayerPointer] = useState({ x: 0, y: 0 });
  const openPlayer = (event: MouseEvent<HTMLButtonElement>) => {
    setPlayerPointer({ x: event.clientX, y: event.clientY });
    setPlayerOpen(true);
  };
  const closePlayer = useCallback(() => setPlayerOpen(false), []);

  // The muted loop plays only while on screen and while the player is closed.
  useEffect(() => {
    const video = preview.current;
    if (!video || prefersReducedMotion()) return;
    if (playerOpen) {
      video.pause();
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    observer.observe(video);
    return () => observer.disconnect();
  }, [playerOpen]);

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

      gsap.set("[data-story-media]", { y: 60, opacity: 0 });
      gsap.set("[data-story-tag]", { y: 12, opacity: 0 });
      gsap.timeline({ scrollTrigger: trigger("[data-story-media]", "top 85%") })
        .to("[data-story-media]", { y: 0, opacity: 1, duration: 1.3, ease })
        .to("[data-story-tag]", { y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease }, 0.4);
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

        {/* Fits the viewport: full width, unless that would be taller than
            the screen (less the header), then sized by height instead. */}
        <div
          data-story-media
          className="relative mx-auto mt-[clamp(3rem,7vw,6rem)] aspect-video w-full max-w-[calc((100svh-12rem)*16/9)] overflow-hidden rounded-[clamp(1rem,2vw,2rem)] bg-ink"
        >
          <video
            ref={preview}
            muted
            loop
            playsInline
            preload="none"
            poster={STORY_POSTER}
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
          >
            {STORY_SOURCES.map((source) => (
              <source key={source.src} src={source.src} type={source.type} />
            ))}
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-ink/35 to-ink/5">
            <button
              type="button"
              data-story-trigger
              aria-label="Watch our story full screen with sound"
              onClick={openPlayer}
              className="reel-button relative isolate flex size-[clamp(4.25rem,5.5vw,6.125rem)] shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-paper/25 bg-ink/30 text-paper backdrop-blur-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
            >
              <span aria-hidden className="reel-button__fill absolute inset-0 -z-10 bg-blue" />
              {/* Full-screen corners. */}
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-[30%] w-auto"
              >
                <path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5" />
              </svg>
            </button>
          </div>
        </div>

        <ul className="mt-[clamp(1.5rem,3vw,2.5rem)] flex flex-wrap justify-center gap-3">
          {TAGS.map((tag) => (
            <li key={tag} data-story-tag className="hero-pill">
              <span className="hero-dot" aria-hidden />
              {tag}
            </li>
          ))}
        </ul>
      </div>

      <ShowreelPlayer
        open={playerOpen}
        initialPointer={playerPointer}
        onClose={closePlayer}
        sources={STORY_SOURCES}
        poster={STORY_POSTER}
        label="story"
        trigger="[data-story-trigger]"
      />
    </section>
  );
}

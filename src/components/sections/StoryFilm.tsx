"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/animation/prefs";
import ShowreelPlayer from "./ShowreelPlayer";
import "./FluidVideoTransition.css";

gsap.registerPlugin(ScrollTrigger);

type VideoSource = { src: string; type: string };

/** The landscape company film (16:9), the default. */
const STORY_SOURCES: VideoSource[] = [{ src: "/story/our-story.mp4", type: "video/mp4" }];
const STORY_POSTER = "/story/our-story-poster.webp";

type StoryFilmProps = {
  className?: string;
  sources?: VideoSource[];
  poster?: string;
  /** The film's width ÷ height: 16 / 9 landscape, 9 / 16 portrait. */
  ratio?: number;
};

/**
 * The company film card, shared by the home page and /about. A muted loop
 * plays while on screen; the frosted button opens the full-screen player
 * with sound. As the card scrolls in, a clip-path window grows to the full
 * frame while the video underneath keeps its size (scrubbed, both ways).
 * Sized to fit the viewport: as wide as its column, unless that would be
 * taller than the screen (less the header), then by height instead.
 */
export default function StoryFilm({
  className = "",
  sources = STORY_SOURCES,
  poster = STORY_POSTER,
  ratio = 16 / 9,
}: StoryFilmProps) {
  const portrait = ratio < 1;
  const frame = useRef<HTMLDivElement>(null);
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
    const media = frame.current;
    if (!media || prefersReducedMotion()) return;
    const mm = gsap.matchMedia();
    mm.add({ wide: "(min-width: 768px)", narrow: "(max-width: 767px)" }, (ctx) => {
      const radius = getComputedStyle(media).borderTopLeftRadius;
      // A tall card opens from a squarer window; a wide one from a letterbox.
      const from = portrait
        ? "inset(18% 14% 18% 14%"
        : ctx.conditions?.wide ? "inset(22% 26% 22% 26%" : "inset(24% 10% 24% 10%";
      gsap.fromTo(
        media,
        { clipPath: `${from} round ${radius})` },
        {
          clipPath: `inset(0% 0% 0% 0% round ${radius})`,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: media,
            start: "top bottom",
            end: "center center",
            scrub: 0.6,
            // On the home page this sits below Work's late pin; measure after it.
            refreshPriority: -1,
          },
        },
      );
    });
    return () => mm.revert();
  }, [portrait]);

  const frameStyle = {
    aspectRatio: ratio,
    maxWidth: `calc((100svh - 12rem) * ${ratio})`,
  } as CSSProperties;

  return (
    <>
      <div
        ref={frame}
        style={frameStyle}
        className={`relative mx-auto w-full overflow-hidden rounded-[clamp(1rem,2vw,2rem)] bg-ink ${className}`}
      >
        <video
          ref={preview}
          muted
          loop
          playsInline
          preload="none"
          poster={poster}
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        >
          {sources.map((source) => (
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

      <ShowreelPlayer
        open={playerOpen}
        initialPointer={playerPointer}
        onClose={closePlayer}
        sources={sources}
        poster={poster}
        label="story"
        trigger="[data-story-trigger]"
        fit={portrait ? "contain" : "cover"}
      />
    </>
  );
}

"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import HeroNav from "./HeroNav";
import HeroTypography from "./HeroTypography";
import MobileHeroProject from "./MobileHeroProject";
import ServingLine from "./ServingLine";
import GoogleSourceButton from "@/components/ui/GoogleSourceButton";

import { prefersReducedMotion, fontsReady, introsReady } from "@/lib/animation/prefs";
import { mountScroll } from "@/lib/animation/scroll";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;

    const q = <T extends Element>(s: string) => el.querySelector<T>(s);

    const hero = q<HTMLElement>("[data-hero]");
    const word = q<HTMLElement>("[data-word]");
    const period = q<HTMLElement>("[data-period]");
    if (!hero || !word) return;

    const reduced = prefersReducedMotion();
    let releaseScroll: (() => void) | null = null;

    // ----------------------------------------------------------- the period
    let periodTl: gsap.core.Timeline | null = null;
    const onPeriodEnter = () => {
      if (reduced) return;
      periodTl?.kill();
      periodTl = gsap.timeline();
      periodTl.to(period, { scale: 1.16, duration: 0.5, ease: "expo.out" }, 0);
    };
    const onPeriodLeave = () => {
      if (reduced) return;
      gsap.to(period, { scale: 1, duration: 0.7, ease: "expo.out" });
    };
    period?.addEventListener("pointerenter", onPeriodEnter);
    period?.addEventListener("pointerleave", onPeriodLeave);

    // ------------------------------------------------------- the word morph
    // Every letter starts as a blurred blob; the #hero-morph threshold turns
    // the blur into hard-edged liquid. The tracking starts tight so the blobs
    // merge, then opens as they condense into letterforms, left to right. At
    // the end the threshold relaxes to identity and the filter comes off, so
    // the word is left as plain, antialiased text.
    let morphTl: gsap.core.Timeline | null = null;
    let finishMorph: (() => void) | null = null;
    let cancelled = false;

    function runSimpleReveal() {
      const chars = Array.from(word!.querySelectorAll<HTMLElement>("[data-char]"));
      const finish = () => {
        word!.dataset.morph = "done";
        gsap.set(chars, { clearProps: "opacity" });
        finishMorph = null;
      };
      finishMorph = finish;
      gsap.set(chars, { opacity: 0 });
      word!.dataset.morph = "simple";
      morphTl = gsap.timeline({ onComplete: finish }).to(chars, {
        opacity: 1,
        duration: 0.45,
        stagger: 0.045,
        ease: "power2.out",
      });
    }

    function needsSimpleReveal() {
      if (window.matchMedia("(max-width: 639px), (hover: none) and (pointer: coarse)").matches) return true;
      // Three.js requires WebGL 2. Release this capability probe immediately.
      try {
        const probe = document.createElement("canvas").getContext("webgl2");
        if (!probe) return true;
        probe.getExtension("WEBGL_lose_context")?.loseContext();
        return false;
      } catch {
        return true;
      }
    }

    function runMorph() {
      const chars = Array.from(word!.querySelectorAll<HTMLElement>("[data-char]"));
      const matrix = el!.querySelector("[data-morph-matrix]");
      if (!chars.length || !matrix) {
        word!.dataset.morph = "done";
        return;
      }

      const cs = getComputedStyle(word!);
      const size = parseFloat(cs.fontSize) || 100;
      const tracking = parseFloat(cs.letterSpacing) || 0;

      /** alpha' = slope · alpha + offset — steep = liquid, (1, 0) = identity */
      const threshold = { slope: 22, offset: -10 };
      const writeMatrix = () =>
        matrix.setAttribute(
          "values",
          `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${threshold.slope} ${threshold.offset}`,
        );
      writeMatrix();

      gsap.set(chars, { opacity: 0, filter: `blur(${size * 0.28}px)` });
      gsap.set(word, { letterSpacing: `${tracking - size * 0.09}px` });
      word!.dataset.morph = "run";

      const finish = () => {
        word!.dataset.morph = "done";
        gsap.set(chars, { clearProps: "opacity,filter" });
        gsap.set(word, { clearProps: "letterSpacing" });
        finishMorph = null;
      };
      finishMorph = finish;

      const STAGGER = 0.07;
      const SHARPEN = 1.3;
      /** when the last letter is all but sharp */
      const sharp = STAGGER * (chars.length - 1) + SHARPEN - 0.4;

      morphTl = gsap.timeline({ onComplete: finish });
      morphTl
        .to(chars, { opacity: 1, duration: 0.5, ease: "power1.out", stagger: STAGGER }, 0)
        .to(chars, { filter: "blur(0px)", duration: SHARPEN, ease: "power3.out", stagger: STAGGER }, 0)
        .to(word, { letterSpacing: `${tracking}px`, duration: 1.8, ease: "expo.out" }, 0.1)
        // relax the threshold to identity so the edges regain antialiasing
        .to(threshold, {
          slope: 1,
          offset: 0,
          duration: 0.4,
          ease: "power2.inOut",
          onUpdate: writeMatrix,
        }, sharp);
    }

    // ------------------------------------------------------- the hero foot
    // The meta line lifts in word by word as the morph settles, and the phone
    // CTA grows out of a dot into its full pill before its label arrives.
    const metaParts = el.querySelectorAll<HTMLElement>("[data-meta-part]");
    const metaSlash = q<HTMLElement>("[data-meta-slash]");
    const foot = q<HTMLElement>("[data-hero-foot]");
    const cta = q<HTMLElement>("[data-hero-cta]");
    const source = q<HTMLElement>("[data-hero-source]");
    const ctaParts = el.querySelectorAll<HTMLElement>("[data-hero-cta-part]");
    let footTl: gsap.core.Timeline | null = null;

    function runFoot() {
      // Like the morph, apply every start state synchronously with gsap.set
      // before the CSS pending state hands over, so the foot can never paint
      // a frame in its resting (visible) state between the two.
      const ease = "expo.out";
      // Only on phones is the CTA laid out; measure it to start as a centred dot.
      const ctaLaidOut = !!(foot && cta && cta.offsetWidth);
      gsap.set(metaParts, { yPercent: 110 });
      if (metaSlash) gsap.set(metaSlash, { opacity: 0, rotate: -90, scale: 0.4 });
      if (source) gsap.set(source, { opacity: 0, y: 28 });
      if (ctaLaidOut) {
        // The pill's clip-path reads --cta-side, inherited from the foot so the
        // pill's own transform tweens never touch it. A custom property tweens
        // as a plain length, where browsers would normalise an inset() string.
        const side = Math.max(0, (cta!.offsetWidth - cta!.offsetHeight) / 2);
        gsap.set(foot, { "--cta-side": `${side}px` });
        gsap.set(cta, { opacity: 0, y: 24 });
        gsap.set(ctaParts, { opacity: 0, y: 8 });
      }
      if (foot) foot.dataset.foot = "run";

      footTl = gsap.timeline({ delay: 0.35 })
        .to(metaParts, { yPercent: 0, duration: 1.1, stagger: 0.12, ease }, 0)
        .to(metaSlash ?? [], { opacity: 1, rotate: 0, scale: 1, duration: 0.9, ease }, 0.08)
        // The Google pill rises from below and fades in alongside the meta line.
        .to(source ?? [], { y: 0, duration: 1.1, ease }, 0.2)
        .to(source ?? [], { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.2);
      if (ctaLaidOut) {
        footTl
          .to(cta, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 0.15)
          .to(foot, { "--cta-side": "0px", duration: 1, ease: "expo.inOut" }, 0.55)
          .to(ctaParts, { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease }, 1.05);
      }
    }

    function showFoot() {
      footTl?.kill();
      // Reset by hand, not with gsap.set: while the site loader is up GSAP's
      // timeline is held, so a clearProps tween would be queued and fire later,
      // wiping the entrance's start states (React remounts in dev do this).
      const parts = [...metaParts, metaSlash, cta, source, ...ctaParts].filter((part): part is HTMLElement => !!part);
      gsap.killTweensOf(parts);
      for (const part of parts) {
        for (const prop of ["transform", "translate", "rotate", "scale", "opacity"]) part.style.removeProperty(prop);
      }
      if (foot) foot.dataset.foot = "done";
      foot?.style.removeProperty("--cta-side");
    }

    // ------------------------------------------------------------- startup
    // Reduced motion: the composition is simply there — no morph, no trail,
    // no parallax.
    if (reduced) {
      word.dataset.morph = "done";
      if (foot) foot.dataset.foot = "done";
      releaseScroll = mountScroll({ smooth: false });
      return cleanup;
    }

    if (foot) foot.dataset.foot = "pending";
    releaseScroll = mountScroll({ smooth: true });
    // wait for the webfont so the letters condense into their final shapes,
    // and for the site loader to finish so the morph plays in view
    Promise.all([fontsReady(900), introsReady()]).then(() => {
      if (cancelled) return;
      if (needsSimpleReveal()) runSimpleReveal();
      else runMorph();
      runFoot();
    });

    function cleanup() {
      cancelled = true;
      // never leave the foot hidden behind a killed timeline
      showFoot();
      morphTl?.kill();
      // never leave the word blurred or filtered behind a killed timeline
      finishMorph?.();
      periodTl?.kill();
      period?.removeEventListener("pointerenter", onPeriodEnter);
      period?.removeEventListener("pointerleave", onPeriodLeave);
      releaseScroll?.();
    }

    return cleanup;
  }, []);

  return (
    <div ref={root}>
      <div
        data-hero
        id="top"
        className="relative flex h-[100svh] flex-col justify-between overflow-clip"
      >
        <HeroNav />
        <MobileHeroProject />

        <div className="relative z-10 flex flex-1 items-end px-[var(--bp-gut)] pb-5 sm:pb-[8svh]">
          <HeroTypography />
        </div>

        <div
          data-hero-foot
          data-foot="pending"
          className="relative z-10 flex flex-col gap-6 px-[var(--bp-gut)] pb-[var(--bp-gut)] sm:flex-row sm:items-end sm:justify-between"
        >
          <ServingLine />

          {/* Phones only: the nav drops its "Start a project" below 640px, so the
              hero carries it as a full-width button. */}
          <a
            href="/contact"
            data-hero-cta
            className="flex h-14 items-center justify-center gap-3 rounded-full bg-[#1f2028] [clip-path:inset(0_var(--cta-side,0px)_round_999px)] text-[0.95rem] font-medium text-paper transition-colors duration-300 active:bg-blue sm:hidden"
          >
            <span data-hero-cta-part className="inline-block">Start a project</span>
            <svg data-hero-cta-part viewBox="0 0 16 16" aria-hidden className="h-4 w-4 fill-none stroke-current" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3.2 12.8 12.8 3.2m0 0H5.4m7.4 0v7.4" />
            </svg>
          </a>

          {/* Bottom-right, where inner pages carry their CTA pill. On phones it
              stacks under the full-width "Start a project". */}
          <div data-hero-source>
            <GoogleSourceButton />
          </div>
        </div>
      </div>
    </div>
  );
}

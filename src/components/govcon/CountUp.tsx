"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "@/lib/animation/prefs";

type CountUpProps = {
  to: number;
  prefix?: string;
  suffix?: string;
  /** Seconds. */
  duration?: number;
  className?: string;
};

/**
 * A number that counts up from 0 once its section ([data-count-scope], or the
 * number itself) is 30% in view. The same GSAP counter as the home page's
 * stats. The server renders the final value, so it reads correctly without
 * JavaScript; reduced motion shows it straight away. Screen readers get only
 * the final value, never the intermediate ones. Only the digits change; the
 * prefix and suffix stay put, and tabular figures keep the width steady.
 */
export default function CountUp({ to, prefix = "", suffix = "", duration = 1.2, className }: CountUpProps) {
  const digits = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = digits.current;
    if (!node) return;
    // The client's value wins over a server-rendered one (dates move on).
    node.textContent = String(to);
    if (prefersReducedMotion()) return;

    node.textContent = "0";
    const counter = { n: 0 };
    let tween: gsap.core.Tween | null = null;
    const scope = node.closest<HTMLElement>("[data-count-scope]") ?? node;
    // 30% in view, measured against the smaller of the section and the screen:
    // a section taller than ~3 screens (the dark panel on phones) could never
    // show 30% of itself at once.
    const observer = new IntersectionObserver(([entry]) => {
      const needed = 0.3 * Math.min(entry.boundingClientRect.height, window.innerHeight);
      if (!entry.isIntersecting || entry.intersectionRect.height < needed) return;
      observer.disconnect();
      tween = gsap.to(counter, {
        n: to,
        duration,
        ease: "power2.out",
        onUpdate: () => { node.textContent = String(Math.round(counter.n)); },
      });
    }, { threshold: Array.from({ length: 21 }, (_, i) => i / 20) });
    observer.observe(scope);
    return () => {
      observer.disconnect();
      tween?.kill();
    };
  }, [to, duration]);

  return (
    <span className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      <span className="sr-only" suppressHydrationWarning>{prefix}{to}{suffix}</span>
      <span aria-hidden>
        {prefix}
        <span ref={digits} suppressHydrationWarning>{to}</span>
        {suffix}
      </span>
    </span>
  );
}

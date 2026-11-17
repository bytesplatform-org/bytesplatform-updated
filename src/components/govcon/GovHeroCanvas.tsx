"use client";

import { useEffect, useRef } from "react";
import { createHeroField } from "@/lib/govcon/heroField";
import { prefersReducedMotion } from "@/lib/animation/prefs";

/** The hero's WebGL backdrop; decorative, so hidden from assistive tech. */
export default function GovHeroCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const field = createHeroField(canvas, { reducedMotion: prefersReducedMotion() });
    return () => field?.dispose();
  }, []);
  return <canvas ref={canvasRef} aria-hidden className={className} />;
}

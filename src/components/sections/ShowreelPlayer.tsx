"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/animation/scroll";
import styles from "./ShowreelPlayer.module.css";

type VideoSource = { src: string; type: string };

type ShowreelPlayerProps = {
  open: boolean;
  initialPointer: { x: number; y: number };
  onClose: () => void;
  /** The film to play; defaults to the BytesPlatform showreel. */
  sources?: VideoSource[];
  poster?: string;
  /** Names the film in the dialog's labels ("showreel" → "Close showreel"). */
  label?: string;
  /** Selector for the button that opened the player, refocused on close. */
  trigger?: string;
  /** "cover" fills wide screens (the reel's shape); "contain" always letterboxes. */
  fit?: "cover" | "contain";
};

const SHOWREEL_SOURCES: VideoSource[] = [
  { src: "/showreel/showreel-av1.webm", type: 'video/webm; codecs="av01,opus"' },
  { src: "/showreel/showreel.mp4", type: "video/mp4" },
];

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
};

export default function ShowreelPlayer({
  open,
  initialPointer,
  onClose,
  sources = SHOWREEL_SOURCES,
  poster = "/showreel/player-poster.webp",
  label = "showreel",
  trigger = "[data-showreel-trigger]",
  fit = "cover",
}: ShowreelPlayerProps) {
  const ringId = `${useId()}-close-ring`;
  const playerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [overControls, setOverControls] = useState(false);
  const pointerTarget = useRef({ x: 0, y: 0 });
  const pointerCurrent = useRef({ x: 0, y: 0 });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    wasOpenRef.current = true;
    // Freeze the page (Lenis, wheel, touch, keys) while the reel plays, and tell
    // the scroll indicator to step aside.
    const releaseScroll = lockScroll({ allowWithin: playerRef.current ?? undefined });
    document.documentElement.dataset.scrollLocked = "showreel";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);

    const video = videoRef.current;
    closeRef.current?.focus({ preventScroll: true });
    if (video) {
      video.currentTime = 0;
      video.muted = false;
      setMuted(false);
      video.play().catch(() => setPlaying(false));
    }

    return () => {
      releaseScroll();
      delete document.documentElement.dataset.scrollLocked;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (!open) return;
    const start = initialPointer;
    pointerTarget.current = start;
    pointerCurrent.current = start;
    let frame = 0;
    const followPointer = () => {
      const current = pointerCurrent.current;
      const target = pointerTarget.current;
      current.x += (target.x - current.x) * 0.14;
      current.y += (target.y - current.y) * 0.14;
      playerRef.current?.style.setProperty("--showreel-cursor-x", `${current.x}px`);
      playerRef.current?.style.setProperty("--showreel-cursor-y", `${current.y}px`);
      frame = window.requestAnimationFrame(followPointer);
    };
    frame = window.requestAnimationFrame(followPointer);
    return () => window.cancelAnimationFrame(frame);
  }, [initialPointer, open]);

  useEffect(() => {
    if (open) return;
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    document.querySelector<HTMLButtonElement>(trigger)?.focus({ preventScroll: true });
    const reset = window.setTimeout(() => {
      const video = videoRef.current;
      if (!video) return;
      video.pause();
      video.currentTime = 0;
      setCurrentTime(0);
    }, 800);
    return () => window.clearTimeout(reset);
  }, [open, trigger]);

  if (!mounted) return null;

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const seek = (value: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = value;
    setCurrentTime(value);
  };

  const playerStyle = {
    "--showreel-cursor-x": `${initialPointer.x}px`,
    "--showreel-cursor-y": `${initialPointer.y}px`,
    "--showreel-progress": `${duration ? (currentTime / duration) * 100 : 0}%`,
  } as CSSProperties;

  return createPortal(
    <div
      ref={playerRef}
      className={styles.player}
      data-open={open}
      data-fit={fit}
      data-controls-hover={overControls}
      style={playerStyle}
      role="dialog"
      aria-modal="true"
      aria-label={`BytesPlatform ${label}`}
      aria-hidden={!open}
      onClick={onClose}
      onPointerMove={(event) => {
        pointerTarget.current = { x: event.clientX, y: event.clientY };
      }}
    >
      <video
        ref={videoRef}
        className={styles.video}
        playsInline
        preload="none"
        poster={poster}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onEnded={() => {
          setPlaying(false);
          // Close by itself once the reel has played through.
          onClose();
        }}
      >
        {sources.map((source) => (
          <source key={source.src} src={source.src} type={source.type} />
        ))}
      </video>

      <button ref={closeRef} type="button" className={styles.close} onClick={onClose} aria-label={`Close ${label}`}>
        <span aria-hidden />
        <span aria-hidden />
        {/* "Click to exit" circling inside the button, around the ×. */}
        <svg aria-hidden viewBox="0 0 100 100" className={styles.closeRing}>
          <defs>
            <path id={ringId} d="M50 50 m-37 0 a37 37 0 1 1 74 0 a37 37 0 1 1 -74 0" />
          </defs>
          <text>
            <textPath href={`#${ringId}`} textLength="230" lengthAdjust="spacing">
              CLICK TO EXIT • CLICK TO EXIT •
            </textPath>
          </text>
        </svg>
      </button>

      <div
        className={styles.controls}
        onClick={(event) => event.stopPropagation()}
        onPointerEnter={() => setOverControls(true)}
        onPointerLeave={() => setOverControls(false)}
      >
        <button type="button" onClick={togglePlayback} className={styles.controlButton}>
          {playing ? "Pause" : "Play"}
        </button>
        <span className={styles.time}>{formatTime(currentTime)}</span>
        <input
          className={styles.timeline}
          type="range"
          min="0"
          max={duration || 0}
          step="0.01"
          value={Math.min(currentTime, duration || 0)}
          onChange={(event) => seek(Number(event.currentTarget.value))}
          aria-label={`${label[0].toUpperCase()}${label.slice(1)} progress`}
        />
        <span className={styles.time}>{formatTime(duration)}</span>
        <button type="button" onClick={toggleMute} className={styles.controlButton}>
          {muted ? "Unmute" : "Mute"}
        </button>
      </div>
    </div>,
    document.body,
  );
}

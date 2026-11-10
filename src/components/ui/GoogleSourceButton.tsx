"use client";

import type { MouseEvent } from "react";
import { site } from "@/data/site";
import styles from "./GoogleSourceButton.module.css";

/** Google's four-colour "G". */
const GoogleG = () => (
  <svg viewBox="0 0 48 48" aria-hidden>
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

/** The API publisher.js (loaded in the root layout) puts on window.PREFERRED_SOURCE. */
type PreferredSourceApi = { addPreferredSource: () => void };
declare global {
  interface Window {
    PREFERRED_SOURCE?: unknown[] | { api?: PreferredSourceApi };
  }
}

/** Opens Google's "Add as a preferred source" popup. False if the runtime isn't loaded. */
function openGooglePopup() {
  const runtime = window.PREFERRED_SOURCE;
  const api = runtime && !Array.isArray(runtime) ? runtime.api : undefined;
  if (!api) return false;
  api.addPreferredSource();
  return true;
}

/**
 * "Add to Preferred Sources", dressed as the nav's action pill. Clicking opens
 * Google's own popup (same as Google's widget); if Google's script is blocked
 * it falls back to the preferred-source page. Hover turns it blue and swaps
 * the dot for an outbound arrow.
 */
export default function GoogleSourceButton({ className = "" }: { className?: string }) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Let modified clicks (new tab, etc.) follow the link as usual.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    if (openGooglePopup()) event.preventDefault();
  };

  return (
    <a
      href={site.links.googlePreferredSource}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      aria-label="Add BytesPlatform as a preferred source on Google"
      className={`${styles.button} ${className}`.trim()}
    >
      <span className={styles.g} aria-hidden><GoogleG /></span>
      <span>Add to Preferred Sources</span>
      <span className={styles.end} aria-hidden>
        <span className={styles.dot} />
        <svg className={styles.arrow} viewBox="0 0 16 16">
          <path d="M4.5 11.5 11.5 4.5m0 0H6m5.5 0V10" />
        </svg>
      </span>
    </a>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import type { PostHeading } from "@/lib/blogFormat";
import styles from "./Blog.module.css";

/** How far down the viewport a heading must pass before its section counts as the one being read. */
const READ_LINE = 0.3;

/**
 * The post's contents list. On wide screens it sits in the sticky aside and
 * marks the section being read; on narrow ones it opens from a "Contents"
 * button above the article. Clicks go through the site's anchor routing
 * (mountScroll), and headings carry a scroll-margin so they land below the nav.
 */
export default function PostToc({ headings }: { headings: PostHeading[] }) {
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const targets = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => el !== null);
    if (!targets.length) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * READ_LINE;
      let current: string | null = null;
      for (const el of targets) {
        if (el.getBoundingClientRect().top <= line) current = el.id;
        else break;
      }
      setActive(current);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  // Keep the active entry visible when the list is taller than its box,
  // scrolling only the list, never the page.
  useEffect(() => {
    const box = list.current;
    const item = active ? box?.querySelector<HTMLElement>(`[data-id="${CSS.escape(active)}"]`) : null;
    if (!box || !item || box.scrollHeight <= box.clientHeight) return;
    const top = item.offsetTop; // the list is position: relative, so this is within it
    if (top < box.scrollTop || top + item.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTo({ top: top - box.clientHeight / 3, behavior: "smooth" });
    }
  }, [active]);

  return (
    <nav className={styles.toc} aria-label="Contents" data-open={open || undefined}>
      <button
        type="button"
        className={styles.tocToggle}
        aria-expanded={open}
        aria-controls="post-contents"
        onClick={() => setOpen((value) => !value)}
      >
        <span className={styles.label}>Contents</span>
        <span aria-hidden className={styles.tocChevron} />
      </button>
      <ol id="post-contents" ref={list} className={styles.tocList} data-lenis-prevent>
        <li data-level={2}>
          <a href="#top" onClick={() => setOpen(false)}>(Top)</a>
        </li>
        {headings.map((heading) => (
          <li key={heading.id} data-id={heading.id} data-level={heading.level}>
            <a
              href={`#${heading.id}`}
              aria-current={active === heading.id ? "location" : undefined}
              onClick={() => setOpen(false)}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

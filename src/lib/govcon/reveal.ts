import gsap from "gsap";

/**
 * Scroll reveals that can't get stuck. Headings marked [data-lines] rise word
 * by word, and [data-reveal] blocks fade and rise, once they come into view.
 *
 * Instead of trigger positions measured up front (which go stale when images
 * load or the viewport is resized, leaving content hidden), every pending
 * element is checked against the viewport on scroll, resize, load and print.
 * Anything in view, or already scrolled past, is revealed; nothing stays
 * hidden once the reader (or a full-page capture) reaches it.
 */
export function mountReveal(root: HTMLElement) {
  const headings = Array.from(root.querySelectorAll<HTMLElement>("[data-lines]"));
  const blocks = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
  const pending = new Set<HTMLElement>([...headings, ...blocks]);

  headings.forEach((heading) => gsap.set(heading.querySelectorAll("[data-word]"), { yPercent: 115 }));
  gsap.set(blocks, { opacity: 0, y: 36 });

  const reveal = (elements: HTMLElement[], instant: boolean) => {
    const words = elements.filter((el) => el.hasAttribute("data-lines"));
    const rest = elements.filter((el) => !el.hasAttribute("data-lines"));
    words.forEach((heading) => {
      const targets = heading.querySelectorAll("[data-word]");
      if (instant) gsap.set(targets, { yPercent: 0 });
      else gsap.to(targets, { yPercent: 0, duration: 1.1, stagger: 0.05, ease: "expo.out", overwrite: true });
    });
    if (!rest.length) return;
    if (instant) gsap.set(rest, { opacity: 1, y: 0 });
    else gsap.to(rest, { opacity: 1, y: 0, duration: 1.1, stagger: 0.07, ease: "expo.out", overwrite: true });
  };

  let frame = 0;
  const check = () => {
    frame = 0;
    // Reveal a little before the bottom edge, but never more than 100px in (a
    // full-page capture makes the window as tall as the page); at the very end
    // of the page, anything on screen counts, as nothing can scroll further up.
    const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    const line = atEnd ? window.innerHeight : window.innerHeight - Math.min(window.innerHeight * 0.1, 100);
    const inView: HTMLElement[] = [];
    const passed: HTMLElement[] = [];
    pending.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < 0) passed.push(el);
      else if (rect.top < line) inView.push(el);
    });
    [...inView, ...passed].forEach((el) => pending.delete(el));
    // Jumped past (an anchor link, a fast fling): show it at once.
    if (passed.length) reveal(passed, true);
    if (inView.length) reveal(inView, false);
    if (!pending.size) detach();
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(check);
  };
  const revealAll = () => {
    reveal([...pending], true);
    pending.clear();
    detach();
  };

  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("load", schedule);
  window.addEventListener("beforeprint", revealAll);
  function detach() {
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    window.removeEventListener("load", schedule);
    window.removeEventListener("beforeprint", revealAll);
  }
  schedule();

  return () => {
    cancelAnimationFrame(frame);
    detach();
  };
}

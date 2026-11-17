"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { COMPACT_QUERY, prefersReducedMotion } from "@/lib/animation/prefs";
import { glideTo } from "@/lib/animation/scroll";
import { createDiveScene } from "@/lib/fluid/diveScene";
import { createServiceCardInteraction } from "@/lib/services/cardInteraction";
import ActionPill from "@/components/ui/ActionPill";
import "./ServicesSection.css";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { label: "AI Automation & AI Agents", href: "/services/ai-automation" },
  { label: "Custom SaaS & Product Development", href: "/services/saas-product-development" },
  { label: "Web & Mobile App Development", href: "/services/web-mobile-app-development" },
  { label: "CRM & ERP Systems", href: "/services/crm-erp-systems" },
  { label: "Government Opportunity & Proposal Technology", href: "/services/government-proposal-technology" },
  { label: "E-Invoicing & Business System Integration", href: "/services/e-invoicing-integration" },
  { label: "Government Contractors", href: "/government-contractors" },
] as const;
/** Degrees between cards around the ring, and how much wider the ring must be
 * than the original six-card ring (60°) for neighbours to keep the same gap. */
const CARD_STEP = 360 / SERVICES.length;
const RING_SPREAD = Math.sin(Math.PI / 6) / Math.sin(Math.PI / SERVICES.length);
// Disable this after tuning; copy the panel values into DEFAULT_RING first.
const SHOW_RING_CONTROLS = false;
const DEFAULT_RING = { rotationX: 5, rotationY: 0, rotationZ: 7, cameraX: 103, cameraY: 142, cameraZ: 200 };
type RingSettings = typeof DEFAULT_RING;
const STORAGE_KEY = "bytes-services-ring-v3";
const DESCRIPTIONS = [
  "Intelligent systems that automate workflows and actions.",
  "Purpose-built software. From first idea to your next big launch.",
  "Digital experiences that work beautifully on every screen.",
  "Your people, processes and data. Connected in one place.",
  "Find the right opportunities. Build proposals that win.",
  "Seamless invoicing and systems that work together.",
  "Websites, portals, CRMs and ERPs built to pass the audit.",
];
const WORKFLOWS = [
  ["New lead", "Form submission", "AI Agent", "Analyze, enrich, and take action", "Send personalized email", "Notify team", "Update CRM"],
  ["Your idea", "Product discovery", "Product engine", "Build, test, and ship", "Design experience", "Deploy product", "Scale up"],
  ["New experience", "Web + mobile", "Application", "Fast, intuitive, connected", "Responsive design", "Connect API", "Launch app"],
  ["Business data", "One source of truth", "Connected operations", "Manage, track, and grow", "Sync customers", "Plan resources", "View insights"],
  ["New opportunity", "Matched to your business", "Proposal engine", "Research, qualify, and respond", "Review requirements", "Build proposal", "Submit response"],
  ["New invoice", "Ready to process", "Integration hub", "Validate, sync, and deliver", "Validate invoice", "Sync accounts", "Confirm delivery"],
  ["New solicitation", "Agency or prime", "Delivery team", "Build, test, and document", "Accessibility audit", "Security evidence", "Agency sign-off"],
];

function Workflow({ index }: { index: number }) {
  const words = WORKFLOWS[index];
  return <div className="service-workflow" aria-hidden="true">
    <svg className="service-workflow__wires" viewBox="0 0 340 380" fill="none"><path d="M135 65 V110 Q135 130 155 130 M155 190 V220 Q155 240 125 240 V330 M125 250 H165 M125 290 H165 M125 330 H165" stroke="white" strokeWidth="2" />{[[135,90],[155,205],[165,250],[165,290],[165,330]].map(([x,y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="#1550ff" stroke="white" strokeWidth="1.5" />)}</svg>
    <div className="service-workflow__lead"><span className="service-workflow__icon">▤</span><div>{words[0]}<small>{words[1]}</small></div></div>
    <div className="service-workflow__agent"><span className="service-workflow__icon">✧</span><div>{words[2]}<small>{words[3]}</small></div></div>
    <div className="service-workflow__status"><span>● &nbsp; Agent running...</span><small>✓ &nbsp; Analyzing input</small><small>✓ &nbsp; Enriching data</small><small>✓ &nbsp; Preparing actions</small><small>◌ &nbsp; Completing workflow</small></div>
    <div className="service-workflow__actions">{words.slice(4).map((word, i) => <div key={word}><span className="service-workflow__icon">{["✉", "⌘", "▱"][i]}</span>{word}<b>✓</b></div>)}</div>
  </div>;
}
function ServiceCard({ index }: { index: number }) {
  const service = SERVICES[index];
  return <a href={service.href} className="service-orbit-card" style={{ "--card-angle": `${-index * CARD_STEP}deg` } as CSSProperties}>
    <div className="service-orbit-card__surface">
      <span className="service-orbit-card__number">{String(index + 1).padStart(2, "0")}</span>
      <div className="service-orbit-card__copy"><div className="service-orbit-card__title">{service.label}</div><p>{DESCRIPTIONS[index]}</p></div>
      <Workflow index={index} />
      <span className="service-orbit-card__open" aria-hidden="true">Explore service ↗</span>
    </div>
  </a>;
}

/** Phones: a short category and the service's three key steps, in order. */
const MOBILE_DETAILS = [
  { category: "Automation", steps: ["Capture the lead", "Analyze & enrich", "Take action"] },
  { category: "Product", steps: ["Shape the idea", "Build & test", "Launch & scale"] },
  { category: "Apps", steps: ["Design the experience", "Connect the API", "Launch the app"] },
  { category: "Operations", steps: ["Unify your data", "Manage & track", "Grow with insight"] },
  { category: "Government", steps: ["Discover opportunities", "Qualify & respond", "Build proposal"] },
  { category: "Finance", steps: ["Validate invoices", "Sync accounts", "Confirm delivery"] },
  { category: "GovCon", steps: ["Scope the solicitation", "Build to Section 508", "Deliver with evidence"] },
] as const;

/** The phone card: number and category, the steps, then the title and link. */
function MobileServiceCard({ index }: { index: number }) {
  const service = SERVICES[index];
  const details = MOBILE_DETAILS[index];
  return <a href={service.href} className="service-mobile-card" data-service-mobile-card>
    <div className="service-mobile-card__head">
      <span className="service-mobile-card__number">{String(index + 1).padStart(2, "0")}</span>
      <span className="service-mobile-card__tag">{details.category}</span>
    </div>
    <ol className="service-mobile-card__steps" aria-label="How it works">
      {details.steps.map((step, i) => <li key={step} data-step={i}>
        <span aria-hidden className="service-mobile-card__dot" />
        {step}
        <span aria-hidden className="service-mobile-card__chevron">›</span>
      </li>)}
    </ol>
    <h3 className="service-mobile-card__title">{service.label}</h3>
    <p className="service-mobile-card__text">{DESCRIPTIONS[index]}</p>
    <span className="service-mobile-card__link">Explore service <span aria-hidden>→</span></span>
  </a>;
}

function DesktopServicesRing({ camera, ring }: { camera: React.RefObject<HTMLDivElement | null>; ring: React.RefObject<HTMLDivElement | null> }) {
  return <div className="services-perspective">
    <div ref={camera} className="services-camera">
      <div ref={ring} className="services-ring">
        {SERVICES.map((service, index) => <ServiceCard key={service.href} index={index} />)}
      </div>
    </div>
  </div>;
}

function MobileServicesTrack({ track }: { track: React.RefObject<HTMLDivElement | null> }) {
  return <div className="services-mobile-viewport">
    <div ref={track} className="services-mobile-track">
      {SERVICES.map((service, index) => <MobileServiceCard key={service.href} index={index} />)}
    </div>
  </div>;
}
// Each card step (CARD_STEP degrees) is one screen; cards stay visible into the portal.
const ORBIT_SCROLL_SCREENS = SERVICES.length - 1;
const EXIT_SCROLL_SCREENS = 0.3;
const STACK_SCROLL_SCREENS = ORBIT_SCROLL_SCREENS + EXIT_SCROLL_SCREENS;
// The dive into Featured Work is scrubbed by scroll (see diveScene): it starts
// just after the pill has scaled in, flies into the pill, then holds the title
// on the blue while the stage is still pinned. The handoff's last screen is the
// reveal, as Work rises behind the blue.
const DIVE_START_SCREENS = STACK_SCROLL_SCREENS + 0.04;
const DIVE_ZOOM_SCREENS = 1;
const DIVE_TITLE_SCREENS = 0.8;
const HANDOFF_SCROLL_SCREENS = DIVE_START_SCREENS + DIVE_ZOOM_SCREENS + DIVE_TITLE_SCREENS;
// Tablets and phones skip the dive (and its pill's exit beat): the stage
// lifts away to reveal Featured Work as soon as the last card settles.
const COMPACT_HANDOFF_SCREENS = ORBIT_SCROLL_SCREENS + 0.05;

export default function ServicesSection() {
  const root = useRef<HTMLElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const camera = useRef<HTMLDivElement>(null);
  const mobileTrack = useRef<HTMLDivElement>(null);
  const [settings, setSettings] = useState<RingSettings>(DEFAULT_RING);
  const [mounted, setMounted] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const settingsRef = useRef(settings);
  const desktopActive = useRef(false);
  const scrollAngle = useRef(0);
  const entryAngle = useRef(0);
  const applyRing = () => {
    if (!desktopActive.current) return;
    const value = settingsRef.current;
    if (ring.current) ring.current.style.transform = `rotateX(${value.rotationX}deg) rotateZ(${value.rotationZ}deg) rotateY(${value.rotationY + scrollAngle.current + entryAngle.current}deg)`;
    // Camera values are tuned at a 1000px card; the CSS units rescale them per breakpoint.
    if (camera.current) camera.current.style.transform = `translateZ(var(--ring-focal)) translate3d(calc(var(--cam-x) * ${-value.cameraX}), calc(var(--cam-y) * ${-value.cameraY}), calc(var(--cam-z) * ${-value.cameraZ}))`;
  };
  useEffect(() => {
    setMounted(true);
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && Object.keys(DEFAULT_RING).every(key => Number.isFinite(saved[key]))) setSettings(saved);
    } catch { /* Use defaults if storage is unavailable. */ }
    const stage = root.current?.querySelector("[data-services-stage]");
    const observer = new IntersectionObserver(([entry]) => setControlsVisible(entry.isIntersecting), { threshold: 0.1 });
    if (stage) observer.observe(stage);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    settingsRef.current = settings;
    applyRing();
    if (mounted) try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); } catch { /* Settings still work without storage. */ }
  }, [settings, mounted]);

  useEffect(() => {
    const section = root.current;
    const handoff = section?.querySelector<HTMLElement>("[data-services-handoff]");
    const stage = section?.querySelector<HTMLElement>("[data-services-stage]");
    const pill = section?.querySelector<HTMLElement>("[data-services-pill]");
    const canvasLayer = document.querySelector<HTMLCanvasElement>("[data-intro-canvas]")?.parentElement;
    const overlay = document.querySelector<HTMLElement>("[data-services-dive-overlay]");
    const next = document.querySelector<HTMLElement>("[data-featured-work]");
    if (!section || !handoff || !stage || !pill || !overlay || !next) return;

    const reduced = prefersReducedMotion();
    const context = gsap.context(() => {
      if (reduced) return;
      const upperWords = gsap.utils.toArray<HTMLElement>("[data-heading-upper] > span");
      const lowerWords = gsap.utils.toArray<HTMLElement>("[data-heading-lower] > span");
      const heading = gsap.timeline({ scrollTrigger: { trigger: section, start: "top 72%", toggleActions: "play none none reverse" } });
      heading
        .fromTo(upperWords, { xPercent: -135, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.15, stagger: { each: 0.12, from: "end" }, ease: "expo.out" })
        .fromTo(lowerWords, { xPercent: 120, opacity: 0 }, { xPercent: 0, opacity: 1, duration: 1.1, stagger: 0.1, ease: "expo.out" }, 0.16);
    }, section);

    const media = gsap.matchMedia();
    media.add("(min-width: 768px)", () => {
      if (reduced) return;
      desktopActive.current = true;
      const desktopContext = gsap.context(() => {
        // Reveal the card faces as the stage enters. Keep the camera and ring
        // fully opaque so their 3D children do not flatten during the entrance.
        const cardSurfaces = gsap.utils.toArray<HTMLElement>(".service-orbit-card .service-orbit-card__surface", section);
        const pillWrap = section.querySelector<HTMLElement>("[data-services-pill-wrap]");
        const entrance = gsap.timeline({
          scrollTrigger: {
            trigger: handoff,
            start: "top 80%",
            end: "top 8%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        const revealTurn = { angle: -12 };
        entrance.fromTo(revealTurn, { angle: -12 }, {
          angle: 0, duration: 1, ease: "power2.out",
          onUpdate: () => { entryAngle.current = revealTurn.angle; applyRing(); },
        }, 0);
        entrance.fromTo(cardSurfaces,
          { "--entry-y": "64px", "--entry-scale": 0.86, "--entry-opacity": 0 },
          { "--entry-y": "0px", "--entry-scale": 1, "--entry-opacity": 1, duration: 1, ease: "power2.out" }, 0);
        // Wait until the stage is pinned: only then is the bottom button fully
        // on screen. Its reveal occupies the first fifth of the orbit scroll.
        if (pillWrap) gsap.fromTo(pillWrap,
          { y: 42, scale: 0.88, autoAlpha: 0 },
          {
            y: 0, scale: 1, autoAlpha: 1, ease: "power2.out",
            scrollTrigger: {
              trigger: handoff,
              start: "top top",
              end: "top -20%",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

        const orbit = { angle: 0 };
        const stackTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: handoff, start: "top top",
            end: () => `+=${window.innerHeight * STACK_SCROLL_SCREENS}`,
            // Lenis already smooths the scroll; avoid adding a second lag.
            scrub: true, invalidateOnRefresh: true,
          },
        });
        // Keep the 3D hierarchy opaque: fading a preserve-3d parent flattens
        // its children and can project back-facing cards into the viewport.
        stackTimeline.to(orbit, { angle: ORBIT_SCROLL_SCREENS * CARD_STEP, duration: ORBIT_SCROLL_SCREENS, ease: "none", onUpdate: () => { scrollAngle.current = orbit.angle; applyRing(); } }, 0);
        stackTimeline.set({}, {}, STACK_SCROLL_SCREENS);
      }, section);
      const disposeInteraction = createServiceCardInteraction(section);
      applyRing();
      return () => { desktopActive.current = false; disposeInteraction(); desktopContext.revert(); };
    });

    media.add("(max-width: 767px)", () => {
      if (reduced || !mobileTrack.current) return;
      const track = mobileTrack.current;
      const cards = Array.from(track.querySelectorAll<HTMLElement>("[data-service-mobile-card]"));
      // The card nearest the screen's centre is in focus (--focus 1); its
      // neighbours shrink and fade toward 0 as they move off to the sides.
      const focus = () => {
        const middle = window.innerWidth / 2;
        for (const card of cards) {
          const r = card.getBoundingClientRect();
          const away = Math.min(1, Math.abs(r.left + r.width / 2 - middle) / (r.width + 12));
          card.style.setProperty("--focus", (1 - away).toFixed(3));
        }
      };
      const mobileContext = gsap.context(() => {
        gsap.fromTo(track, { x: 0 }, {
          x: () => (track.firstElementChild as HTMLElement).offsetLeft - (track.lastElementChild as HTMLElement).offsetLeft,
          ease: "none",
          onUpdate: focus,
          scrollTrigger: {
            trigger: handoff,
            start: "top top",
            end: () => `+=${window.innerHeight * ORBIT_SCROLL_SCREENS}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }, section);
      focus();
      return () => { mobileContext.revert(); cards.forEach(card => card.style.removeProperty("--focus")); };
    });

    // "all" always matches, so this runs everywhere (GSAP only calls it when
    // some condition matches) and re-runs whenever "compact" flips.
    media.add({ all: "all", compact: COMPACT_QUERY }, context => {
      if (reduced || context.conditions?.compact) return;
      const dive = createDiveScene({
        section: handoff,
        // The blue line lives on the shared canvas. It must move with the cards
        // for the dive to read as a camera move into the button.
        layers: canvasLayer ? [canvasLayer, stage] : [stage],
        pill,
        overlay,
        next,
        startOffset: () => window.innerHeight * DIVE_START_SCREENS,
        zoomLength: () => window.innerHeight * DIVE_ZOOM_SCREENS,
        titleLength: () => window.innerHeight * DIVE_TITLE_SCREENS,
        freeze: () => window.dispatchEvent(new Event("intro:dive-freeze")),
        thaw: () => window.dispatchEvent(new Event("intro:dive-thaw")),
        setLoaderState: (progress, active, direction, holdWork) => window.dispatchEvent(new CustomEvent("intro:loader-state", {
          detail: { progress, active, direction, holdWork },
        })),
      });
      return () => dive.kill();
    });
    const refreshFrame = window.requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      window.cancelAnimationFrame(refreshFrame);
      media.revert();
      context.revert();
    };
  }, []);

  const enterWork = () => {
    const handoff = root.current?.querySelector<HTMLElement>("[data-services-handoff]");
    if (!handoff) return;
    // Scroll through the scrubbed dive to Work's top, so it plays on the way.
    const work = document.querySelector<HTMLElement>("[data-featured-work]");
    const to = work ? work.getBoundingClientRect().top + window.scrollY : handoff.getBoundingClientRect().top + window.scrollY + handoff.offsetHeight;
    glideTo(to, 2.4);
  };

  return (
    <section id="services" ref={root} data-services className="services-section relative">
      <header className="services-heading relative z-[2] overflow-hidden px-[var(--bp-gut)] py-[clamp(6rem,12vw,12rem)]">
        <h2 className="mx-auto w-full max-w-[1800px] text-[clamp(4.25rem,10.8vw,12rem)] font-normal leading-[0.9] tracking-[-0.075em] text-ink">
          <span data-heading-upper className="flex flex-wrap gap-x-[0.22em]">
            <span>What</span><span>we</span><span>do,</span>
          </span>
          <span data-heading-lower className="flex flex-wrap gap-x-[0.22em] lg:pl-[8%]">
            <span>built</span><span>to</span><span>perform.</span>
          </span>
        </h2>
      </header>

      <div
        data-services-handoff
        className="services-handoff relative z-[2]"
        style={{ "--handoff-screens": HANDOFF_SCROLL_SCREENS + 1, "--handoff-compact-screens": COMPACT_HANDOFF_SCREENS + 1 } as CSSProperties}
        aria-label="Our services"
      >
        <div data-services-stage className="services-stage sticky top-0 h-[100svh] overflow-hidden px-[var(--bp-gut)]" style={{ "--ring-k": RING_SPREAD } as CSSProperties}>
          <div className="services-stack relative mx-auto h-full max-w-[1800px]">
            <div data-services-pill-wrap className="services-pill-wrap absolute inset-0 z-20 flex items-end justify-center">
              <ActionPill portal label="View featured work" onClick={enterWork} className="pointer-events-auto" />
            </div>

            <DesktopServicesRing camera={camera} ring={ring} />
            <MobileServicesTrack track={mobileTrack} />
          </div>
        </div>
      </div>
      {SHOW_RING_CONTROLS && mounted && controlsVisible && createPortal(
        <aside className="ring-controls" aria-label="Service ring controls" data-lenis-prevent>
          <button className="ring-controls__toggle" onClick={() => setPanelOpen(!panelOpen)} aria-expanded={panelOpen}>Ring studio <span>{panelOpen ? "−" : "+"}</span></button>
          {panelOpen && <div className="ring-controls__body">
            <p>Scroll spins Y. Rotation values are offsets.<br />Camera positions are in pixels from the pivot.</p>
            {(["rotationX", "rotationY", "rotationZ", "cameraX", "cameraY", "cameraZ"] as const).map(key => <label key={key}>
              <span>{key.startsWith("rotation") ? "Ring" : "Camera"} {key.slice(-1)}</span>
              <input type="range" min={key.startsWith("rotation") ? -180 : -1200} max={key.startsWith("rotation") ? 180 : 1200} step="1" value={settings[key]} onChange={event => setSettings(value => ({ ...value, [key]: Number(event.target.value) }))} />
              <input aria-label={`${key} value`} type="number" value={settings[key]} onChange={event => setSettings(value => ({ ...value, [key]: Number(event.target.value) }))} />
            </label>)}
            <div className="ring-controls__buttons"><button onClick={() => setSettings(DEFAULT_RING)}>Reset</button><button onClick={async () => { try { await navigator.clipboard.writeText(JSON.stringify(settings, null, 2)); setCopied(true); } catch { setCopied(false); } }}>{copied ? "Copied values" : "Copy values"}</button></div>
          </div>}
        </aside>, document.body)}
    </section>
  );
}

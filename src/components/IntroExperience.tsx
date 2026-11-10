"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./hero/Hero";
import FluidVideoTransition from "./sections/FluidVideoTransition";
import ServicesSection from "./sections/ServicesSection";
import FeaturedWork from "./sections/FeaturedWork";
import StorySection from "./sections/StorySection";
import StatsSection from "./sections/StatsSection";
import TestimonialsSection from "./sections/TestimonialsSection";
import ClientsSection from "./sections/ClientsSection";
import SiteFooter from "./sections/SiteFooter";
import { createFloatingCards, type FloatingCards } from "@/lib/hero/floatingCards";
import { createInkTrail, type InkTrail } from "@/lib/hero/inkTrail";
import { resetIntroWebGLReady, markIntroWebGLReady, setIntroReadinessStage, introReadinessDebug, introReadyLog } from "@/lib/introWebGLReadiness";
import { watchVideoFrame, fluidVideoLog } from "@/lib/fluid/videoFrameReadiness";
import { createFluidVideoRenderer } from "@/lib/fluid/createFluidVideoRenderer";
import { createAutoScrollScene } from "@/lib/fluid/autoScrollScene";
import { createPearlTrail } from "@/lib/intro/pearlTrail";
import { createSheet } from "@/lib/intro/sheet";
import { createOrbitalLines } from "@/lib/intro/orbitalLines";
import { createServiceCards } from "@/lib/services/serviceCards";
import { COMPACT_QUERY, isCoarsePointer, prefersReducedMotion } from "@/lib/animation/prefs";
import LineDrawingTool from "./dev/LineDrawingTool";
import { ENABLE_LINE_DRAWING_TOOL, lineBreakpoint } from "@/lib/intro/lineData";
import { createRootCardsScene } from "@/lib/work/rootCardsScene";
import { projects } from "@/data/projects";

gsap.registerPlugin(ScrollTrigger);

/** Work's pinned scroll, in screens: 3 was tuned for 7 projects, so it grows per card. */
const WORK_SCROLL_SCREENS = (3 / 7) * projects.length;
/** Tablets and phones scroll the cards slower: a longer pin for the same journey. */
const WORK_COMPACT_SLOWDOWN = 3;

const responsive = (width: number) => width < 768
  ? { strength: 0.6, duration: 1.3 }
  : width < 1024 ? { strength: 0.8, duration: 1.5 } : { strength: 1, duration: 1.7 };

/** One persistent canvas, renderer and visual tick for every visual section. */
/**
 * Work's closing hold: the camera finishes on the last card before the pin
 * ends, so its smoothing settles and the card sits centred before Stats starts
 * sliding over it. Desktop keeps 15% of its pin; tablets and phones only a
 * short beat (in screens), so the slower compact pin doesn't stall at the end.
 */
const WORK_END_HOLD = 0.15;
const WORK_COMPACT_HOLD_SCREENS = 0.2;

/** How fast Work drifts up (relative to the page) as Stats slides over it. */
const WORK_PARALLAX = 0.35;

export default function IntroExperience() {
  const root = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = root.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const canvasLayer = canvas.parentElement as HTMLElement;
    const hero = container.querySelector<HTMLElement>("[data-hero]")!;
    const studio = container.querySelector<HTMLElement>("[data-fluid-transition]")!;
    const services = container.querySelector<HTMLElement>("[data-services]")!;
    const servicesHandoff = services.querySelector<HTMLElement>("[data-services-handoff]")!;
    const work = container.querySelector<HTMLElement>("[data-featured-work]")!;
    const footer = container.querySelector<HTMLElement>("[data-site-footer]")!;
    const stats = container.querySelector<HTMLElement>("[data-stats]");
    const start = container.querySelector<HTMLElement>("[data-media-start]")!;
    const end = container.querySelector<HTMLElement>("[data-media-end]")!;
    const video = container.querySelector<HTMLVideoElement>("[data-fluid-video]")!;
    const reel = container.querySelector<HTMLElement>("[data-reel-overlay]");
    const serviceCardElements = Array.from(container.querySelectorAll<HTMLElement>("[data-service-card-visual]"));
    let reelShown = -1;
    const reduced = prefersReducedMotion();
    const readinessToken = resetIntroWebGLReady();
    const readinessStage = (stage: string) => setIntroReadinessStage(readinessToken, stage);
    if (reduced) markIntroWebGLReady(readinessToken, true);
    const coarse = isCoarsePointer();
    // Touch-only screens have no pointer to follow, so the pointer-driven effects
    // (the site-wide pearl trail and the hero's ink reveal) are never set up there:
    // no listeners, no simulation, no extra passes.
    const touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    // Tablets and phones have no dive into Work: Services lifts away instead
    // and Work is revealed beneath it (see the scissor around workScene below).
    const compact = window.matchMedia(COMPACT_QUERY);
    const workSlowdown = () => (compact.matches ? WORK_COMPACT_SLOWDOWN : 1);
    /** Share of the pin held at the end, after the camera reaches the last card. */
    const workHold = () => (compact.matches ? WORK_COMPACT_HOLD_SCREENS / (WORK_SCROLL_SCREENS * WORK_COMPACT_SLOWDOWN) : WORK_END_HOLD);
    const workCameraProgress = (pin: number) => Math.min(1, pin / (1 - workHold()));
    const loading = new AbortController();
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    } catch {
      markIntroWebGLReady(readinessToken, true);
      // Even without WebGL, retain muted HTML playback when the reel enters.
      let visible = false;
      const resumeFallback = () => {
        if (!reduced && !document.hidden && visible) void video.play().catch(() => {});
        else video.pause();
      };
      const observer = new IntersectionObserver(entries => {
        visible = !!entries[0]?.isIntersecting;
        resumeFallback();
      });
      observer.observe(studio);
      document.addEventListener("visibilitychange", resumeFallback);
      return () => {
        observer.disconnect();
        document.removeEventListener("visibilitychange", resumeFallback);
        video.pause();
        resetIntroWebGLReady();
      };
    }
    introReadyLog("renderer created");
    readinessStage("video-frame");
    renderer.setClearColor(0, 0);
    const lines = createOrbitalLines();
    const serviceCards = createServiceCards();
    const fluid = reduced ? null : createFluidVideoRenderer(renderer, {
      video, segments: coarse ? [48, 32] : [72, 48],
      radius: [18, 28], strength: responsive(window.innerWidth).strength,
    });
    // Latched once the real fluid pass has run under the HTML video for enough
    // advancing frames; only context loss (suspend/restart) clears it.
    let fluidVideoReady = false;
    let contextLost = false;
    const showFallback = () => {
      fluidVideoReady = false;
      readinessStage("video-frame");
      video.style.transition = "";
      video.style.opacity = "";
      if (reel) {
        reelShown = 0;
        reel.style.opacity = "0";
        reel.style.visibility = "hidden";
      }
    };
    const frames = fluid ? watchVideoFrame(video, {
      frame: first => {
        if (first) fluid.prepare();
        else fluid.markTextureForUpdate();
      },
      wake: () => fluid.markTextureForUpdate(),
      changed: ready => {
        if (!ready) { showFallback(); return; }
        // The canvas already holds this frame's real fluid pass under the
        // video, so uncovering it is a like-for-like swap.
        fluidVideoReady = true;
        markIntroWebGLReady(readinessToken);
        video.style.transition = "opacity 120ms linear";
        video.style.opacity = "0";
        fluidVideoLog(video, "HTML video handoff");
      },
    }) : null;
    const playVideo = () => {
      fluidVideoLog(video, "HTML video play requested");
      void video.play().catch(() => {});
    };
    let cards: FloatingCards | null = null;
    let ink: InkTrail | null = null;
    let disposed = false;
    let width = 1;
    let height = 1;
    let heroHeight = 1;
    let studioHeight = 1;
    let dpr = 1;
    let needsResize = true;
    let videoVisible = false;
    let loaderProgress = 0;
    let loaderActive = false;
    let holdWorkForLoader = false;
    let workVisible = false;
    let workInteractive = false;
    let workScene: ReturnType<typeof createRootCardsScene> | null = null;
    let workTrigger: ScrollTrigger | null = null;
    const pointer = { x: 0, y: 0, has: false };
    // While the site loader/page transition is up, the pointer isn't tracked
    // and the trail neither starts nor draws (see RouteTransition).
    const inTransition = () => document.documentElement.hasAttribute("data-site-transition");
    const onPointer = (event: PointerEvent) => {
      if (inTransition()) { pointer.has = false; return; }
      pointer.x = event.clientX; pointer.y = event.clientY; pointer.has = true;
    };
    const onLeave = () => { pointer.has = false; ink?.setMouse(-1, -1); };
    if (!touchOnly) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    const onLoaderState = (event: Event) => {
      const detail = (event as CustomEvent<{
        progress: number;
        active: boolean;
        direction: "forward" | "backward";
        holdWork: boolean;
      }>).detail;
      loaderProgress = THREE.MathUtils.clamp(detail.progress, 0, 1);
      loaderActive = detail.active;
      holdWorkForLoader = detail.holdWork;
    };
    window.addEventListener("intro:loader-state", onLoaderState);

    // Composite the hero trail behind the shared scene and its blue line.
    const sceneTarget = new THREE.WebGLRenderTarget(1, 1, { depthBuffer: false, stencilBuffer: false });
    const pearlTrail = touchOnly ? null : createPearlTrail(renderer, sceneTarget.texture);
    const statsSheet = createSheet(0xf0f1fa);
    // The canvas paints Stats' paper from here on; the DOM keeps only its text.
    if (stats) stats.dataset.sheet = "canvas";
    const inkScene = new THREE.Scene();
    const camera = new THREE.Camera();
    const inkGeometry = new THREE.PlaneGeometry(2, 2);
    const inkUniforms = {
      uInk: { value: null as THREE.Texture | null }, uScene: { value: sceneTarget.texture },
      uViewport: { value: new THREE.Vector2() }, uHeroBottom: { value: 1 },
      uHasInk: { value: 0 },
    };
    const inkMaterial = new THREE.ShaderMaterial({
      uniforms: inkUniforms, depthTest: false, depthWrite: false, blending: THREE.NoBlending,
      vertexShader: `varying vec2 vUv;
        void main() { vUv=uv; gl_Position=vec4(position.xy,0.0,1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform sampler2D uInk, uScene;
        uniform vec2 uViewport;
        uniform float uHeroBottom, uHasInk;
        void main() {
          vec4 base=texture2D(uScene,vUv);
          if(uHasInk<0.5) { gl_FragColor=base; return; }
          vec4 ink=texture2D(uInk,vUv);
          float screenY=(1.0-vUv.y)*uViewport.y;
          float studioMode=smoothstep(uHeroBottom-8.0,uHeroBottom+8.0,screenY);
          vec4 hero=vec4(base.rgb+ink.rgb*(1.0-base.a),base.a+ink.a*(1.0-base.a));
          gl_FragColor=mix(hero,base,studioMode);
        }`,
    });
    const inkMesh = new THREE.Mesh(inkGeometry, inkMaterial);
    inkMesh.frustumCulled = false;
    inkScene.add(inkMesh);
    // The same composite, blended over what is already on screen (sceneTarget
    // is premultiplied): redraws the intro's line over the paper strip that
    // rounds Services' bottom corners during the compact Work reveal.
    const inkOverMaterial = new THREE.ShaderMaterial({
      uniforms: inkUniforms, vertexShader: inkMaterial.vertexShader, fragmentShader: inkMaterial.fragmentShader,
      depthTest: false, depthWrite: false, blending: THREE.CustomBlending,
      blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    });
    const inkOverScene = new THREE.Scene();
    const inkOverMesh = new THREE.Mesh(inkGeometry, inkOverMaterial);
    inkOverMesh.frustumCulled = false;
    inkOverScene.add(inkOverMesh);
    /** Paper behind Services, for its rounded bottom corners as it lifts off Work. */
    const servicesSheet = createSheet(0xf0f1fa);

    const state = { progress: 0 };
    const tune = responsive(window.innerWidth);
    const timeline = gsap.timeline({ paused: true });
    timeline.to(state, { progress: 1, duration: tune.duration, ease: "sine.inOut" }, 0);
    const sceneScroll = reduced ? null : createAutoScrollScene(studio, timeline);

    type Layout = { bounds: DOMRect; stage: DOMRect; heroRect: DOMRect; studioRect: DOMRect; servicesRect: DOMRect; servicesHandoffRect: DOMRect; workRect: DOMRect; startRect: DOMRect; endRect: DOMRect };
    const measureLayout = (): Layout => ({
      bounds: container.getBoundingClientRect(), stage: canvas.getBoundingClientRect(),
      heroRect: hero.getBoundingClientRect(), studioRect: studio.getBoundingClientRect(),
      servicesRect: services.getBoundingClientRect(),
      servicesHandoffRect: servicesHandoff.getBoundingClientRect(),
      workRect: work.getBoundingClientRect(),
      startRect: start.getBoundingClientRect(), endRect: end.getBoundingClientRect(),
    });
    let frozenLayout: Layout | null = null;
    const freezeLayout = () => { frozenLayout = measureLayout(); };
    const thawLayout = () => { frozenLayout = null; };
    window.addEventListener("intro:dive-freeze", freezeLayout);
    window.addEventListener("intro:dive-thaw", thawLayout);
    const measure = () => {
      needsResize = true;
    };
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    observer.observe(studio);
    observer.observe(services);
    observer.observe(work);
    window.addEventListener("resize", measure, { passive: true });

    let workCancelled = false;
    void document.fonts.load("600 84px Rajdhani").catch(() => {}).then(() => {
      if (disposed || workCancelled) return;
      try {
        workScene = createRootCardsScene(canvas, renderer);
      } catch {
        return;
      }
      workScene.resize(Math.max(1, window.innerWidth), Math.max(1, window.innerHeight));
      workTrigger = ScrollTrigger.create({
        trigger: work,
        pin: true,
        start: "top top",
        end: () => `+=${Math.round(window.innerHeight * WORK_SCROLL_SCREENS * workSlowdown())}`,
        invalidateOnRefresh: true,
        scrub: true,
        onUpdate: self => workScene?.setProgress(workCameraProgress(self.progress)),
      });
      workScene.setProgress(workCameraProgress(workTrigger.progress));
      workScene.setVisible(false);
      ScrollTrigger.refresh();
    });

    if (!reduced && !touchOnly) void createFloatingCards(loading.signal).then(loaded => {
      if (!loaded) return;
      if (disposed) { loaded.destroy(); return; }
      cards = loaded;
      ink = createInkTrail(renderer, cards.canvas);
      inkUniforms.uInk.value = ink?.texture ?? null;
      needsResize = true;
    });

    const tick = (time: number, elapsed: number) => {
      if (disposed || document.hidden) return;
      const { bounds, stage, heroRect, studioRect, servicesRect, servicesHandoffRect, workRect, startRect, endRect } = frozenLayout ?? measureLayout();
      // A shared full-screen canvas cannot use intersection preloading here:
      // drawing Work even one frame early replaces the still-visible Services
      // scene. Activate it only once its pinned section reaches the viewport.
      // The pinned element's DOMRect changes coordinate modes when GSAP
      // releases it. Drive the outro from the trigger's absolute scroll range
      // instead so the value stays continuous across that handoff.
      const workStart = workTrigger?.start ?? Number.POSITIVE_INFINITY;
      const workEnd = workTrigger?.end ?? Number.POSITIVE_INFINITY;
      const scrollY = window.scrollY;
      // Stats slides up over Work (which stays put), then lifts off the fixed
      // footer. Its paper is drawn on this canvas (see sheet below) so the
      // pointer trail keeps running across it; the canvas rises above the
      // footer while Stats is on screen and is transparent outside the sheet.
      const statsRect = stats?.getBoundingClientRect() ?? null;
      const statsOnScreen = !!statsRect && statsRect.top < window.innerHeight && statsRect.bottom > 0;
      const workOnStage = workTrigger
        ? scrollY >= workStart - 1 && (!statsRect || statsRect.top > 0)
        : workRect.top <= 1 && workRect.bottom > 1;
      canvasLayer.style.zIndex = statsOnScreen ? "2" : "0";
      canvasLayer.style.pointerEvents = statsOnScreen ? "none" : "";
      footer.style.visibility = statsRect && statsRect.bottom < window.innerHeight + 1 ? "visible" : "hidden";
      // On the way back, keep Work alive underneath the descending blue wipe
      // until the handoff jumps to Services; otherwise the canvas flashes blank.
      // Compact: Work draws as soon as its section rises into view, clipped to
      // the area below its top edge, so Services lifts off to reveal it.
      const workRising = compact.matches && !workOnStage && workRect.top < window.innerHeight && workRect.bottom > 0;
      const shouldRenderWork = workOnStage || holdWorkForLoader || workRising;
      const shouldInteractWithWork = workOnStage && !statsOnScreen && !loaderActive;
      if (workVisible !== shouldRenderWork || workInteractive !== shouldInteractWithWork) {
        workVisible = shouldRenderWork;
        workInteractive = shouldInteractWithWork;
        workScene?.setVisible(workVisible && !document.hidden, workInteractive && !document.hidden);
      }
      if (needsResize) {
        needsResize = false;
        width = Math.max(1, stage.width);
        height = Math.max(1, stage.height);
        heroHeight = heroRect.height;
        studioHeight = studioRect.height;
        dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
        renderer.setPixelRatio(dpr);
        renderer.setSize(width, height, false);
        cards?.resize(heroRect.width, heroHeight);
        ink?.resize(width, height, dpr);
        sceneTarget.setSize(Math.round(width * dpr), Math.round(height * dpr));
        // Shape and pace the line against the services heading plus one
        // pinned screen (its original height), not the long card-stack scroll,
        // so the curve keeps its sweep instead of stretching into a straight run.
        const servicesLeadIn = Math.max(0, servicesHandoffRect.top - servicesRect.top);
        lines.resize(width, height, heroHeight, studioHeight, servicesLeadIn + height * 1.06);
        workScene?.resize(width, height);
        inkUniforms.uViewport.value.set(width, height);
        if (fluid) fluid.strength = responsive(width).strength;
      }
      const inStudio = studioRect.top < window.innerHeight && studioRect.bottom > 0;
      // Decode and warm the reel at the top of the page, even while the
      // global GSAP timeline is held by the loader. The shared ticker runs.
      const shouldPlayVideo = !reduced && (inStudio || !fluidVideoReady);
      if (videoVisible !== shouldPlayVideo) {
        videoVisible = shouldPlayVideo;
        if (shouldPlayVideo) {
          playVideo();
        } else video.pause();
      }
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) {
        pearlTrail?.update(0, 0, 0, false, width, height);
        return;
      }
      if (contextLost) {
        updateReadout();
        return;
      }
      const dt = Math.min(elapsed / 1000, 0.05);
      const trailBottom = Math.max(workRect.bottom, statsRect?.bottom ?? -Infinity);
      const transitioning = inTransition();
      if (transitioning) pointer.has = false;
      const trailPointer = !transitioning && !reduced && !coarse && pointer.has && pointer.y >= heroRect.top && pointer.y < trailBottom;
      pearlTrail?.update(dt, pointer.x - stage.left, pointer.y - stage.top, trailPointer, width, height);
      const inHero = heroRect.bottom > 0 && heroRect.top < window.innerHeight;
      renderer.autoClear = true;
      if (ink && cards && inHero) {
        const heroPointer = pointer.has && pointer.y >= heroRect.top && pointer.y < heroRect.bottom;
        const x = heroPointer ? (pointer.x - stage.left) / width : -1;
        const y = heroPointer ? 1 - (pointer.y - stage.top) / height : -1;
        ink.setHeroRegion(heroRect.top - stage.top, heroHeight, height);
        ink.setMouse(x, heroPointer ? 1 - (pointer.y - heroRect.top) / heroHeight : -1);
        if (inHero) cards.render(dt, pointer.has ? x : 0.5, pointer.has ? y : 0.5);
        ink.render(dt);
      }
      renderer.setRenderTarget(sceneTarget);
      renderer.clear();
      renderer.autoClear = false;
      const scroll = Math.max(0, -bounds.top);
      // Nothing at the top; the one continuous path draws itself from its start
      // as the page scrolls through sections 1 → 2. The camera holds once the
      // services stage pins so the line stays put behind the card stack.
      const handoffScroll = servicesHandoffRect.top - bounds.top;
      const lineProgress = lines.progressAtScroll(scroll);
      // The line only belongs to the intro (hero → services). Past that, leave
      // it out of sceneTarget: the pointer trail refracts sceneTarget, and would
      // otherwise reveal a stray piece of line over Work and Stats.
      // No line on phones (the line layouts' own "mobile" breakpoint).
      const phone = lineBreakpoint(window.innerWidth) === "mobile";
      // The line holds still while the stage is pinned, then leaves with it.
      const unpinScroll = handoffScroll + servicesHandoffRect.height - height;
      const lineOffset = scroll <= handoffScroll ? scroll : handoffScroll + Math.max(0, scroll - unpinScroll);
      if (!phone && servicesRect.bottom > 0) lines.render(renderer, lineOffset, reduced ? 1 : lineProgress);
      const inServices = servicesRect.top < window.innerHeight && servicesRect.bottom > 0;
      if (inServices) serviceCards.render(renderer, serviceCardElements, stage, pointer, reduced ? 0 : time, dt);
      // The real fluid pass runs from the first decoded frame, wherever the
      // reel is, underneath the still-opaque HTML video. Warm-up counts these
      // very renders; the video only hands off once they have run across
      // advancing frames (see watchVideoFrame). After that, only in view.
      const fluidLayoutValid = startRect.width > 0 && startRect.height > 0 && endRect.width > 0 && endRect.height > 0;
      const videoHasFrame = video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0;
      if (fluid && fluidLayoutValid && videoHasFrame && (inStudio || !fluidVideoReady)) {
        const rect = (r: DOMRect) => ({ x: r.left - stage.left, y: r.top - stage.top, w: r.width, h: r.height });
        fluid.layout({ w: width, h: height }, rect(startRect), rect(endRect));
        fluid.debugMode = Number(studio.dataset.debugMode || 0);
        fluid.render(state.progress);
        if (!fluidVideoReady && !renderer.getContext().isContextLost()) {
          readinessStage("fluid-warmup");
          frames?.rendered();
        }
      }
      // Fade the reel title in as the video settles into its final frame.
      const reelOpacity = reduced || !fluidVideoReady ? 0 : Math.round(Math.min(1, Math.max(0, (state.progress - 0.7) / 0.3)) * 100) / 100;
      if (reel && reelOpacity !== reelShown) {
        reelShown = reelOpacity;
        reel.style.opacity = String(reelOpacity);
        reel.style.visibility = reelOpacity > 0 ? "visible" : "hidden";
      }
      renderer.setRenderTarget(null);
      renderer.clear();
      inkUniforms.uHasInk.value = ink ? 1 : 0;
      inkUniforms.uHeroBottom.value = heroRect.bottom - stage.top;
      // While Stats is up the canvas sits above the footer, transparent outside
      // the sheet; the intro layers (the blue line) must not show through there.
      if (!statsOnScreen) renderer.render(inkScene, camera);

      // Work joins the same renderer after the earlier sections leave view.
      if (workScene && workVisible) {
        // Parallax as Stats slides over: Work drifts up at a fraction of the
        // scroll speed instead of holding still.
        // Rising into view (compact): Work sits lower and drifts up at the same
        // slow pace it leaves at under Stats, while Services lifts off it.
        const clipTop = workRising ? Math.max(0, workRect.top - stage.top) : 0;
        workScene.setScrollOffset(clipTop > 0 ? -clipTop * WORK_PARALLAX : workTrigger ? Math.max(0, scrollY - workEnd) * WORK_PARALLAX : 0);
        // Draw Work only below Services' bottom edge, plus a corner radius
        // above it (the scissor only touches the screen pass; Work's render
        // targets ignore it).
        const cornerRadius = THREE.MathUtils.clamp(width * 0.04, 28, 64);
        const workFrom = Math.max(0, clipTop - cornerRadius);
        if (clipTop > 0) {
          renderer.setScissor(0, 0, width, Math.max(0, height - workFrom));
          renderer.setScissorTest(true);
        }
        workScene.frame();
        if (clipTop > 0) {
          // Paper over that strip with rounded bottom corners, like Stats'
          // top ones, then the intro's line back on top of the paper.
          const autoClear = renderer.autoClear;
          renderer.autoClear = false;
          renderer.setScissor(0, height - clipTop, width, clipTop - workFrom);
          servicesSheet.render(renderer, { w: width, h: height }, new DOMRect(stage.left, workRect.top - height * 2, width, height * 2), stage.top, cornerRadius);
          if (!statsOnScreen) renderer.render(inkOverScene, camera);
          renderer.autoClear = autoClear;
          renderer.setScissorTest(false);
        }
      }
      // Stats' paper, over Work and under the trail.
      if (statsOnScreen && statsRect) {
        const autoClear = renderer.autoClear;
        renderer.setRenderTarget(null);
        renderer.autoClear = false;
        statsSheet.render(renderer, { w: width, h: height }, statsRect, stage.top, THREE.MathUtils.clamp(width * 0.04, 28, 64));
        renderer.autoClear = autoClear;
      }

      // The loader is a WebGL layer too, so the shared canvas never breaks.
      if (loaderProgress > 0) {
        const blueHeight = Math.ceil(height * loaderProgress);
        renderer.setScissor(0, height - blueHeight, width, blueHeight);
        renderer.setScissorTest(true);
        renderer.setClearColor(0x2457ff, 1);
        renderer.clear(true, true, true);
        renderer.setScissorTest(false);
        renderer.setClearColor(0, 0);
      }

      // Liquid sits above the line; the hero masking trail stays below it.
      renderer.setScissorTest(false);
      if (!transitioning) pearlTrail?.render();
      updateReadout();
    };
    const updateReadout = () => {
      const readout = studio.querySelector<HTMLElement>("[data-fluid-readout]");
      if (readout) readout.textContent = `${introReadinessDebug()} · video readyState: ${video.readyState} · ${frames?.debug() ?? "VideoTexture disabled"} · production WebGL ready: ${fluidVideoReady ? "yes" : "no"} · HTML video visible: ${video.style.opacity === "0" ? "no" : "yes"} · video size: ${video.videoWidth}×${video.videoHeight} · canvas: ${canvas.width}×${canvas.height} · DPR: ${dpr} · context lost: ${contextLost ? "yes" : "no"} · progress: ${state.progress.toFixed(2)}`;
    };
    const onContextLost = (event: Event) => {
      event.preventDefault();
      contextLost = true;
      frames?.suspend();
      showFallback();
      if (stats) delete stats.dataset.sheet;
      fluidVideoLog(video, "webglcontextlost");
      updateReadout();
    };
    const onContextRestored = () => {
      // Three's earlier listener reinitializes its GPU caches. Retain all
      // shared scenes, targets, listeners and the single ticker; Three lazily
      // reuploads their resources. Warm-up restarts with real renders, and
      // its first decoded frame re-prepares the video texture.
      contextLost = false;
      needsResize = true;
      showFallback();
      if (stats) stats.dataset.sheet = "canvas";
      if (!reduced) frames?.restart();
      fluidVideoLog(video, "webglcontextrestored");
      updateReadout();
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);
    const onVisibility = () => {
      if (document.hidden) video.pause();
      else if (videoVisible && !reduced) {
        playVideo();
      }
      workScene?.setVisible(workVisible && !document.hidden, workInteractive && !document.hidden);
    };
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) onVisibility();
    };
    window.addEventListener("pageshow", onPageShow);
    document.addEventListener("visibilitychange", onVisibility);
    gsap.ticker.add(tick);
    frames?.restart();
    return () => {
      disposed = true;
      resetIntroWebGLReady();
      workCancelled = true;
      loading.abort();
      gsap.ticker.remove(tick);
      sceneScroll?.kill();
      timeline.kill();
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("intro:dive-freeze", freezeLayout);
      window.removeEventListener("intro:dive-thaw", thawLayout);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("intro:loader-state", onLoaderState);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      frames?.dispose();
      video.pause();
      video.style.transition = "";
      video.style.opacity = "";
      canvas.style.transform = "";
      canvas.style.borderRadius = "";
      canvas.style.transition = "";
      canvasLayer.style.zIndex = "";
      canvasLayer.style.pointerEvents = "";
      footer.style.visibility = "";
      pearlTrail?.dispose();
      statsSheet.dispose();
      servicesSheet.dispose();
      inkOverMaterial.dispose();
      if (stats) delete stats.dataset.sheet;
      ink?.destroy();
      cards?.destroy();
      fluid?.dispose();
      serviceCards.dispose();
      workTrigger?.kill();
      workScene?.dispose();
      lines.dispose();
      sceneTarget.dispose();
      inkGeometry.dispose();
      inkMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    // overflow-clip (not hidden: no scroll container, so sticky still works)
    // keeps the dive's hugely scaled layers from growing the page's scroll
    // height mid-zoom, which threw the scroll indicator and Lenis's limit.
    <div ref={root} data-intro-experience className="relative overflow-clip">
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} data-intro-canvas className="pointer-events-none sticky top-0 block h-[100svh] w-full" />
      </div>
      <Hero />
      <FluidVideoTransition />
      <ServicesSection />
      <div
        data-services-dive-overlay
        aria-hidden
        className="pointer-events-none invisible fixed inset-0 z-[100] flex items-center justify-center opacity-0 [will-change:clip-path]"
      >
        <div
          data-dive-title
          className="overflow-hidden px-[0.08em] pb-[0.1em] text-center text-[clamp(3.5rem,9vw,9rem)] font-medium leading-none tracking-[-0.07em] text-paper"
        >
          <span data-dive-title-word className="inline-block">Featured</span>{" "}
          <span data-dive-title-word className="inline-block">Work</span>
        </div>
      </div>
      <FeaturedWork />
      {/* The closing sheet: slides up over Work (which stays put), then lifts
          off the fixed footer. Its paper is painted by this canvas (data-sheet)
          so the pointer trail runs across it; the DOM carries only content. */}
      <div data-stats className="relative z-[3] rounded-[clamp(1.75rem,4vw,4rem)] bg-paper">
        <StorySection />
        <StatsSection />
        <TestimonialsSection />
        <ClientsSection />
      </div>
      <SiteFooter />
      {ENABLE_LINE_DRAWING_TOOL && <LineDrawingTool root={root} />}
    </div>
  );
}

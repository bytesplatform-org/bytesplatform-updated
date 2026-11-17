import * as THREE from "three";

/**
 * The government contractors hero: a light cousin of the home page's canvas.
 * A dot grid breathes on a slow wave and parts around the pointer, a few
 * "contract" nodes pulse in the site blue, and on wider screens one thick blue
 * ribbon (the home page's orbital line) runs through the right-hand side:
 * loading draws its first stretch and scrolling through the hero draws the
 * rest, while the line trails the page in parallax.
 *
 * One renderer, two draw calls, page-space pixels with a y-down camera. It
 * renders only while on screen, and a single still frame for reduced motion.
 */

const BLUE = new THREE.Vector3(36 / 255, 87 / 255, 1);
const INK = new THREE.Vector3(17 / 255, 17 / 255, 17 / 255);

/** The ribbon's path, as fractions of the canvas: in from the top right,
 * looping over the form, down the open gutter between the headline and the
 * form, under the form and back out on the right. */
const WIDE_PATH: [number, number][] = [
  [1.06, 0.05], [0.84, 0.16], [0.63, 0.08], [0.52, 0.25], [0.535, 0.5],
  [0.525, 0.75], [0.6, 0.965], [0.8, 0.985], [0.96, 0.92], [1.08, 0.76],
];
/** Ribbon samples along the path. */
const SAMPLES = 320;

const dotsVertex = /* glsl */ `
  attribute vec2 aGrid;
  attribute float aSeed;
  uniform float uTime;
  uniform float uIntro;
  uniform float uDpr;
  uniform vec2 uRes;
  uniform vec2 uPointer;
  uniform float uPointerOn;
  varying float vMix;
  varying float vAlpha;

  void main() {
    vec2 p = aGrid;
    // A slow, crossing swell, so the field never sits perfectly still.
    float wave = sin(p.x * 0.011 + uTime * 0.55) * cos(p.y * 0.014 - uTime * 0.42);
    p.y += wave * 3.5;

    // Dots part around the pointer and light up blue.
    vec2 away = p - uPointer;
    float d = length(away);
    float near = exp(-(d * d) / 16000.0) * uPointerOn;
    p += (d > 0.001 ? away / d : vec2(0.0)) * near * 22.0;

    // A few nodes pulse on their own: the contracts on the board.
    float node = step(0.965, aSeed);
    float pulse = node * pow(0.5 + 0.5 * sin(uTime * 1.6 + aSeed * 61.0), 6.0);

    // Revealed as a wash from the top right corner.
    float reach = length((aGrid - vec2(uRes.x, 0.0)) / max(uRes.x, uRes.y));
    float reveal = smoothstep(0.0, 0.25, uIntro * 1.5 - reach);

    // Quieter behind the headline (the left of a wide hero).
    float wide = step(900.0, uRes.x);
    // Phones stack text across the full width, so the whole field stays quiet.
    float textFade = mix(0.5, mix(0.35, 1.0, smoothstep(0.15, 0.6, aGrid.x / uRes.x)), wide);

    vMix = max(near, max(pulse, node * 0.55));
    vAlpha = reveal * textFade * (0.55 + 0.45 * wave * wave) + near * 0.4;
    gl_PointSize = (2.1 + near * 3.2 + pulse * 4.5 + node * 1.2) * uDpr;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  }
`;

const dotsFragment = /* glsl */ `
  uniform vec3 uBlue;
  uniform vec3 uInk;
  varying float vMix;
  varying float vAlpha;

  void main() {
    float r = length(gl_PointCoord - 0.5) * 2.0;
    float aa = max(fwidth(r), 0.001);
    float disc = 1.0 - smoothstep(1.0 - aa, 1.0, r);
    vec3 color = mix(uInk, uBlue, clamp(vMix, 0.0, 1.0));
    float alpha = disc * vAlpha * mix(0.2, 0.95, clamp(vMix, 0.0, 1.0));
    if (alpha < 0.004) discard;
    gl_FragColor = vec4(color, alpha);
  }
`;

const ribbonVertex = /* glsl */ `
  attribute float side;
  attribute float along;
  varying float vSide;
  varying float vAlong;
  void main() {
    vSide = side;
    vAlong = along;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ribbonFragment = /* glsl */ `
  uniform vec3 uBlue;
  uniform float uProgress;
  varying float vSide;
  varying float vAlong;
  void main() {
    if (vAlong > uProgress) discard;
    float aa = max(fwidth(vSide), 0.001);
    float edge = 1.0 - smoothstep(1.0 - aa, 1.0, abs(vSide));
    gl_FragColor = vec4(uBlue, edge);
  }
`;

export type HeroField = { dispose: () => void };

export function createHeroField(canvas: HTMLCanvasElement, options: { reducedMotion: boolean }): HeroField | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    return null; // No WebGL: the hero simply has no backdrop.
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);

  const dotsMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uIntro: { value: options.reducedMotion ? 1 : 0 },
      uDpr: { value: 1 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(-9999, -9999) },
      uPointerOn: { value: 0 },
      uBlue: { value: BLUE },
      uInk: { value: INK },
    },
    vertexShader: dotsVertex,
    fragmentShader: dotsFragment,
    transparent: true, depthTest: false, depthWrite: false,
  });
  const dots = new THREE.Points(new THREE.BufferGeometry(), dotsMaterial);
  dots.frustumCulled = false;
  scene.add(dots);

  const ribbonMaterial = new THREE.ShaderMaterial({
    uniforms: { uBlue: { value: BLUE }, uProgress: { value: options.reducedMotion ? 1 : 0 } },
    vertexShader: ribbonVertex,
    fragmentShader: ribbonFragment,
    // The y-down camera flips winding; without DoubleSide the ribbon is culled.
    transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide,
  });
  // The ribbon is rebuilt in place every frame (it sways), so its buffers are
  // allocated once: two vertices per sample, a triangle pair between samples.
  const ribbonPositions = new Float32Array((SAMPLES + 1) * 2 * 3);
  const ribbonGeometry = new THREE.BufferGeometry();
  ribbonGeometry.setAttribute("position", new THREE.BufferAttribute(ribbonPositions, 3).setUsage(THREE.DynamicDrawUsage));
  ribbonGeometry.setAttribute("side", new THREE.Float32BufferAttribute(Array.from({ length: (SAMPLES + 1) * 2 }, (_, i) => (i % 2 ? -1 : 1)), 1));
  ribbonGeometry.setAttribute("along", new THREE.Float32BufferAttribute(Array.from({ length: (SAMPLES + 1) * 2 }, (_, i) => Math.floor(i / 2) / SAMPLES), 1));
  const ribbonIndex: number[] = [];
  for (let i = 0; i < SAMPLES; i++) {
    const a = i * 2;
    ribbonIndex.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  ribbonGeometry.setIndex(ribbonIndex);
  const ribbon = new THREE.Mesh(ribbonGeometry, ribbonMaterial);
  ribbon.frustumCulled = false;

  // Round caps on both ends, the leading one riding the drawing tip, so the
  // line never ends on a flat cut (the home page's orbital line does the same).
  const capGeometry = new THREE.CircleGeometry(1, 48);
  const capRadii = new Float32Array(capGeometry.attributes.position.count);
  for (let i = 0; i < capRadii.length; i++) {
    capRadii[i] = Math.min(1, Math.hypot(capGeometry.attributes.position.getX(i), capGeometry.attributes.position.getY(i)));
  }
  capGeometry.setAttribute("radius", new THREE.BufferAttribute(capRadii, 1));
  const capMaterial = new THREE.ShaderMaterial({
    uniforms: { uBlue: { value: BLUE } },
    vertexShader: /* glsl */ `attribute float radius; varying float vRadius;
      void main() { vRadius = radius; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `uniform vec3 uBlue; varying float vRadius;
      void main() { float aa = max(fwidth(vRadius), 0.001); gl_FragColor = vec4(uBlue, 1.0 - smoothstep(1.0 - aa, 1.0, vRadius)); }`,
    transparent: true, depthTest: false, depthWrite: false, side: THREE.DoubleSide,
  });
  const startCap = new THREE.Mesh(capGeometry, capMaterial);
  const tipCap = new THREE.Mesh(capGeometry, capMaterial);

  // Moving the group moves the line and both caps together.
  const line = new THREE.Group();
  line.add(ribbon, startCap, tipCap);
  scene.add(line);

  const anchors = WIDE_PATH.map(() => new THREE.Vector3());
  const curve = new THREE.CatmullRomCurve3(anchors, false, "centripetal");
  const point = new THREE.Vector3();
  const tangent = new THREE.Vector3();
  let halfWidth = 9;

  /** Re-lays the ribbon along the path, each anchor swaying on its own slow orbit. */
  const buildRibbon = (time: number, progress: number) => {
    WIDE_PATH.forEach(([x, y], i) => {
      const sway = i === 0 ? 0 : 1;
      anchors[i].set(
        x * width + sway * Math.sin(time * 0.55 + i * 1.7) * 16,
        y * height + sway * Math.cos(time * 0.45 + i * 1.3) * 12,
        0,
      );
    });
    for (let i = 0; i <= SAMPLES; i++) {
      const t = i / SAMPLES;
      curve.getPoint(t, point);
      curve.getTangent(t, tangent);
      const nx = -tangent.y * halfWidth;
      const ny = tangent.x * halfWidth;
      const o = i * 6;
      ribbonPositions[o] = point.x + nx;
      ribbonPositions[o + 1] = point.y + ny;
      ribbonPositions[o + 3] = point.x - nx;
      ribbonPositions[o + 4] = point.y - ny;
    }
    ribbonGeometry.attributes.position.needsUpdate = true;
    ribbonMaterial.uniforms.uProgress.value = progress;

    curve.getPoint(0, point);
    startCap.position.copy(point);
    startCap.scale.setScalar(halfWidth);
    curve.getPoint(Math.max(0, Math.min(1, progress)), point);
    tipCap.position.copy(point);
    tipCap.scale.setScalar(halfWidth);
    startCap.visible = tipCap.visible = progress > 0.002;
  };

  /** Rebuilds the grid and ribbon for the canvas's CSS size. */
  const layout = (width: number, height: number) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setSize(width, height, false);
    camera.right = width;
    camera.bottom = height;
    camera.updateProjectionMatrix();
    dotsMaterial.uniforms.uDpr.value = dpr;
    dotsMaterial.uniforms.uRes.value.set(width, height);

    const gap = width < 640 ? 20 : 26;
    const grid: number[] = [];
    const seeds: number[] = [];
    for (let y = gap / 2; y < height; y += gap) {
      for (let x = gap / 2; x < width; x += gap) {
        grid.push(x, y);
        // A stable hash, so the same dots pulse after every resize.
        const h = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
        seeds.push(h - Math.floor(h));
      }
    }
    dots.geometry.dispose();
    dots.geometry = new THREE.BufferGeometry();
    dots.geometry.setAttribute("aGrid", new THREE.Float32BufferAttribute(grid, 2));
    dots.geometry.setAttribute("aSeed", new THREE.Float32BufferAttribute(seeds, 1));
    // `position` is unused by the shader but sets the draw count.
    dots.geometry.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array((grid.length / 2) * 3), 3));

    // Below 900px the form stacks under the headline, leaving no free column
    // for the ribbon to loop through without crossing text.
    line.visible = width >= 900;
    halfWidth = Math.min(18, width / 90) / 2;
  };

  const host = canvas.parentElement ?? canvas;
  let width = 0;
  let height = 0;
  const resize = () => {
    const rect = host.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    if (w === width && h === height) return;
    width = w;
    height = h;
    layout(w, h);
    if (options.reducedMotion || !running) buildRibbon(0, options.reducedMotion ? 1 : 0);
    if (options.reducedMotion || !running) renderer.render(scene, camera);
  };

  // Pointer, eased toward its target each frame.
  const target = new THREE.Vector2(-9999, -9999);
  const pointer = dotsMaterial.uniforms.uPointer.value as THREE.Vector2;
  let pointerOn = 0;
  let pointerTarget = 0;
  const onPointer = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const rect = canvas.getBoundingClientRect();
    target.set(event.clientX - rect.left, event.clientY - rect.top);
    if (pointer.x < -9000) pointer.copy(target);
    pointerTarget = target.y >= 0 && target.y <= rect.height ? 1 : 0;
  };
  const onLeave = () => { pointerTarget = 0; };

  const start = performance.now();
  let raf = 0;
  let running = false;
  /** Eased 0–1 progress of the hero scrolling off the top. */
  let scrolled = 0;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const elapsed = (now - start) / 1000;
    dotsMaterial.uniforms.uTime.value = elapsed;
    // The dots wash in first; the ribbon draws after them, easing out.
    dotsMaterial.uniforms.uIntro.value = Math.min(1, elapsed / 1.8);
    const drawn = Math.min(1, Math.max(0, (elapsed - 0.35) / 2.2));
    const rect = canvas.getBoundingClientRect();
    const scrollTarget = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height * 0.6)));
    scrolled += (scrollTarget - scrolled) * 0.1;
    buildRibbon(elapsed, (1 - Math.pow(1 - drawn, 3)) * 0.5 + scrolled * 0.5);
    // Counter-shifted down, so on screen they scroll slower than the page:
    // the line hangs back and keeps drawing while the hero leaves.
    line.position.y = scrolled * height * 0.3;
    dots.position.y = scrolled * height * 0.1;
    pointer.lerp(target, 0.12);
    pointerOn += (pointerTarget - pointerOn) * 0.08;
    dotsMaterial.uniforms.uPointerOn.value = pointerOn;
    renderer.render(scene, camera);
  };
  const play = () => {
    if (running || options.reducedMotion) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };
  const pause = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);
  const visibility = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : pause()));
  visibility.observe(canvas);
  if (!options.reducedMotion) {
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
  }
  if (options.reducedMotion) renderer.render(scene, camera);

  return {
    dispose() {
      pause();
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      dots.geometry.dispose();
      ribbonGeometry.dispose();
      capGeometry.dispose();
      capMaterial.dispose();
      dotsMaterial.dispose();
      ribbonMaterial.dispose();
      renderer.dispose();
    },
  };
}

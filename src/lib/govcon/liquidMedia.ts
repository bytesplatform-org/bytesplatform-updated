import * as THREE from "three";

/**
 * Liquid image cards. Every `[data-liquid-media]` box inside `container` gets a
 * WebGL plane drawn on one shared canvas laid over the grid. Hovering a card
 * makes its image ripple like liquid and its edges wobble; leaving it settles
 * the image back. Touch screens get one short ripple as each card scrolls in.
 *
 * Planes follow their boxes every frame (rects and the card's opacity), so the
 * page's scroll reveals and hover lifts carry the images along. The DOM <img>
 * stays as the fallback and is only hidden once its texture is on the GPU.
 */

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uStrength;
  uniform vec2 uSize;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    // Each edge bows into one smooth arc (zero at the corners, widest mid-edge)
    // that slowly breathes in and out, like a drop of liquid, never a ragged
    // wave. Each side breathes on its own phase so the shape gently shifts.
    // The plane is a unit quad scaled to the box, so offsets are in pixels / size.
    const float PI = 3.14159265;
    vec2 side = (uv - 0.5) * 2.0;
    float arcX = sin(uv.y * PI);
    float arcY = sin(uv.x * PI);
    float breatheX = 0.65 + 0.35 * sin(uTime * 1.8 + (side.x > 0.0 ? 0.0 : 2.1));
    float breatheY = 0.65 + 0.35 * sin(uTime * 1.5 + (side.y > 0.0 ? 1.0 : 3.2));
    pos.x += side.x * arcX * breatheX * uStrength * 7.0 / uSize.x;
    pos.y += side.y * arcY * breatheY * uStrength * 7.0 / uSize.y;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uStrength;
  uniform float uAlpha;
  uniform float uRadius;
  uniform vec2 uSize;
  uniform vec2 uImage;
  varying vec2 vUv;

  float roundedBox(vec2 p, vec2 halfSize, float r) {
    vec2 q = abs(p) - halfSize + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    // object-fit: cover
    float planeAspect = uSize.x / uSize.y;
    float imageAspect = uImage.x / uImage.y;
    vec2 scale = planeAspect > imageAspect
      ? vec2(1.0, imageAspect / planeAspect)
      : vec2(planeAspect / imageAspect, 1.0);
    vec2 uv = (vUv - 0.5) * scale + 0.5;

    // The liquid ripple, plus a slight zoom while it runs.
    uv = (uv - 0.5) * (1.0 - 0.04 * uStrength) + 0.5;
    uv.y += uStrength * 0.02 * sin(uv.x * 15.0 + uTime * 4.0);
    uv.x += uStrength * 0.02 * cos(uv.y * 15.0 + uTime * 4.0);
    vec3 color = texture2D(uTexture, clamp(uv, 0.0, 1.0)).rgb;
    // A faint sheen along the crests sells the depth.
    color += uStrength * 0.06 * sin(uv.x * 15.0 + uv.y * 9.0 + uTime * 4.0);

    vec2 p = (vUv - 0.5) * uSize;
    float d = roundedBox(p, uSize * 0.5, uRadius);
    float mask = 1.0 - smoothstep(-0.75, 0.75, d);
    gl_FragColor = vec4(color, mask * uAlpha);
  }
`;

type Plane = {
  box: HTMLElement;
  card: HTMLElement;
  img: HTMLImageElement;
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  strength: number;
  target: number;
  pulse: number;
};

export function createLiquidMedia(container: HTMLElement, canvas: HTMLCanvasElement) {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  } catch {
    return null; // The plain images stay.
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
  const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);
  const loader = new THREE.TextureLoader();
  const touch = window.matchMedia("(hover: none)").matches;

  const planes: Plane[] = Array.from(container.querySelectorAll<HTMLElement>("[data-liquid-media]")).map((box) => {
    const img = box.querySelector("img")!;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: null },
        uTime: { value: Math.random() * 10 },
        uStrength: { value: 0 },
        uAlpha: { value: 0 },
        uRadius: { value: 16 },
        uSize: { value: new THREE.Vector2(1, 1) },
        uImage: { value: new THREE.Vector2(3, 2) },
      },
      vertexShader,
      fragmentShader,
      transparent: true, depthTest: false, depthWrite: false,
      // The y-down camera flips winding.
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.visible = false;
    mesh.frustumCulled = false;
    scene.add(mesh);
    loader.load(img.currentSrc || img.src, (texture) => {
      // Sampled and written as-is, so the photo matches the <img> it replaces.
      texture.colorSpace = THREE.NoColorSpace;
      texture.minFilter = THREE.LinearFilter;
      // The camera is y-down (page pixels), so the default upload flip would
      // show every photo upside down; upload it unflipped instead.
      texture.flipY = false;
      material.uniforms.uTexture.value = texture;
      material.uniforms.uImage.value.set(texture.image.width, texture.image.height);
      mesh.visible = true;
      box.dataset.liquid = "ready";
    });
    return { box, card: box.closest<HTMLElement>("[data-liquid-card]") ?? box, img, mesh, strength: 0, target: 0, pulse: 0 };
  });

  // Hover drives each card's ripple; touch gets one ripple as the card arrives.
  const listeners: Array<() => void> = [];
  planes.forEach((plane) => {
    const enter = () => { plane.target = 1; };
    const leave = () => { plane.target = 0; };
    plane.card.addEventListener("pointerenter", enter);
    plane.card.addEventListener("pointerleave", leave);
    plane.card.addEventListener("focusin", enter);
    plane.card.addEventListener("focusout", leave);
    listeners.push(() => {
      plane.card.removeEventListener("pointerenter", enter);
      plane.card.removeEventListener("pointerleave", leave);
      plane.card.removeEventListener("focusin", enter);
      plane.card.removeEventListener("focusout", leave);
    });
  });
  const arrival = touch
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const plane = planes.find((p) => p.box === entry.target);
          if (plane && entry.isIntersecting) plane.pulse = 1.1;
        });
      }, { threshold: 0.6 })
    : null;
  planes.forEach((plane) => arrival?.observe(plane.box));

  let width = 0;
  let height = 0;
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, Math.round(rect.width));
    height = Math.max(1, Math.round(rect.height));
    renderer.setSize(width, height, false);
    camera.right = width;
    camera.bottom = height;
    camera.updateProjectionMatrix();
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  let last = performance.now();
  let raf = 0;
  let running = false;
  const frame = (now: number) => {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const origin = canvas.getBoundingClientRect();
    for (const plane of planes) {
      const rect = plane.box.getBoundingClientRect();
      const uniforms = plane.mesh.material.uniforms;
      plane.mesh.position.set(rect.left - origin.left + rect.width / 2, rect.top - origin.top + rect.height / 2, 0);
      plane.mesh.scale.set(rect.width, rect.height, 1);
      uniforms.uSize.value.set(rect.width, rect.height);
      uniforms.uRadius.value = parseFloat(getComputedStyle(plane.box).borderTopLeftRadius) || 0;
      uniforms.uAlpha.value = parseFloat(getComputedStyle(plane.card).opacity);
      if (plane.pulse > 0) plane.pulse -= dt;
      const target = Math.max(plane.target, plane.pulse > 0.35 ? 1 : 0);
      plane.strength += (target - plane.strength) * 0.08;
      if (plane.strength < 0.002) plane.strength = 0;
      uniforms.uStrength.value = plane.strength;
      uniforms.uTime.value += dt;
    }
    renderer.render(scene, camera);
  };
  // Only draw while the grid is on screen.
  const visibility = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    } else if (!entry.isIntersecting && running) {
      running = false;
      cancelAnimationFrame(raf);
    }
  });
  visibility.observe(container);

  return {
    dispose() {
      cancelAnimationFrame(raf);
      visibility.disconnect();
      resizeObserver.disconnect();
      arrival?.disconnect();
      listeners.forEach((off) => off());
      planes.forEach((plane) => {
        plane.mesh.material.uniforms.uTexture.value?.dispose();
        plane.mesh.material.dispose();
        delete plane.box.dataset.liquid;
      });
      geometry.dispose();
      renderer.dispose();
    },
  };
}

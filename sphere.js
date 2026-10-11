/*
 * Hero sphere — a ball made of a few thousand small purple spheres.
 * It turns slowly; balls near the cursor swell outward and light up.
 */
import * as THREE from 'three';

const canvas = document.getElementById('sphere');
const hero = document.getElementById('hero');
if (canvas && hero) init();

function init() {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    return; // no WebGL — the hero just stays dark
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = window.matchMedia('(max-width: 768px)').matches;

  /* ── Tuning ── */
  const R = 1;                      // sphere radius (world units)
  const SCREEN_FRACTION = 0.46;     // sphere diameter as a fraction of hero height
  const COUNT = small ? 2600 : 5200;
  const BALL_MIN = small ? 0.034 : 0.026;
  const BALL_MAX = small ? 0.05 : 0.04;
  const SPIN = 0.07;                // radians per second
  const HOVER_RADIUS = 0.55;        // how far the cursor's influence reaches
  const HOVER_PUSH = 0.32;          // how far balls swell outward

  // Purple gradient across the screen, top-left (light) to bottom-right (deep).
  const LIGHT = new THREE.Color('#f0abfc');
  const MID = new THREE.Color('#a855f7');
  const DEEP = new THREE.Color('#3b0764');
  const HOT = new THREE.Color('#f5c2ff');
  const GRADIENT_DIR = new THREE.Vector2(-0.6, 0.8);

  /* ── Scene ── */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

  scene.add(new THREE.AmbientLight('#ffffff', 0.45));
  const key = new THREE.DirectionalLight('#ffffff', 2.8);
  key.position.set(-3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight('#a78bfa', 1.6);
  rim.position.set(3, -2, -4);
  scene.add(rim);

  const geo = new THREE.IcosahedronGeometry(1, 2);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.32, metalness: 0.15 });
  const mesh = new THREE.InstancedMesh(geo, mat, COUNT);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  scene.add(mesh);

  /* ── Ball layout: a dense outer shell, a few inside, a few strays ── */
  const home = new Float32Array(COUNT * 3);   // unit direction * radius
  const size = new Float32Array(COUNT);
  const phase = new Float32Array(COUNT);
  const heat = new Float32Array(COUNT);       // 0..1, eased hover influence
  const dir = new THREE.Vector3();
  for (let i = 0; i < COUNT; i++) {
    // uniform direction on the sphere
    const u = Math.random() * 2 - 1;
    const a = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    dir.set(s * Math.cos(a), u, s * Math.sin(a));
    const stray = Math.random() < 0.03;
    const r = stray
      ? R * (1.04 + Math.random() * 0.14)
      : R * (1 - 0.16 * Math.random() ** 2);
    home[i * 3] = dir.x * r;
    home[i * 3 + 1] = dir.y * r;
    home[i * 3 + 2] = dir.z * r;
    size[i] = BALL_MIN + Math.random() * (BALL_MAX - BALL_MIN);
    phase[i] = Math.random() * Math.PI * 2;
  }

  /* ── Pointer → hit point on the sphere ── */
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const hitSphere = new THREE.Sphere(new THREE.Vector3(), R * 1.02);
  const hit = new THREE.Vector3();
  let pointerActive = false;

  function onPointer(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY < rect.top || e.clientY > rect.bottom) { pointerActive = false; return; }
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    pointerActive = true;
  }
  if (!reduceMotion) {
    window.addEventListener('pointermove', onPointer, { passive: true });
    hero.addEventListener('pointerleave', () => { pointerActive = false; });
    window.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') pointerActive = false; });
  }

  /* ── Sizing ── */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // Fit the sphere to a fraction of the height, but never wider than 80% of the width.
    const frac = Math.min(SCREEN_FRACTION, 0.8 * camera.aspect);
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    camera.position.set(0, 0, (2 * R) / (frac * 2 * Math.tan(halfFov)));
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(canvas);
  resize();

  /* ── Frame ── */
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const scl = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const nrm = new THREE.Vector3();
  const col = new THREE.Color();
  const spin = new THREE.Euler(0.35, 0, 0);
  const spinQ = new THREE.Quaternion();
  let angle = 0, last = performance.now(), running = true;

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!reduceMotion) angle += dt * SPIN;
    spin.y = angle;
    spinQ.setFromEuler(spin);

    let hasHit = false;
    if (pointerActive) {
      raycaster.setFromCamera(pointer, camera);
      hasHit = raycaster.ray.intersectSphere(hitSphere, hit) !== null;
    }
    const ease = Math.min(1, dt * 6);
    const t = now / 1000;

    for (let i = 0; i < COUNT; i++) {
      pos.set(home[i * 3], home[i * 3 + 1], home[i * 3 + 2]).applyQuaternion(spinQ);
      nrm.copy(pos).normalize();

      let target = 0;
      if (hasHit) {
        const d = pos.distanceTo(hit);
        if (d < HOVER_RADIUS) {
          const f = 1 - d / HOVER_RADIUS;
          target = f * f * (3 - 2 * f);
        }
      }
      heat[i] += (target - heat[i]) * ease;

      const breathe = reduceMotion ? 0 : 0.012 * Math.sin(t * 1.2 + phase[i]);
      pos.addScaledVector(nrm, heat[i] * HOVER_PUSH + breathe);

      scl.setScalar(size[i] * (1 + heat[i] * 0.35));
      m.compose(pos, q, scl);
      mesh.setMatrixAt(i, m);

      // screen-space diagonal gradient, then heat toward a hot lavender
      const g = THREE.MathUtils.clamp(0.5 + 0.5 * (pos.x * GRADIENT_DIR.x + pos.y * GRADIENT_DIR.y) / R, 0, 1);
      if (g > 0.5) col.copy(MID).lerp(LIGHT, (g - 0.5) * 2);
      else col.copy(DEEP).lerp(MID, g * 2);
      col.lerp(HOT, heat[i]);
      col.multiplyScalar(1 + heat[i] * 1.6);
      mesh.setColorAt(i, col);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.instanceColor.needsUpdate = true;

    renderer.render(scene, camera);
    if (running && !reduceMotion) requestAnimationFrame(frame);
  }

  // Only animate while the hero is on screen and the tab is visible.
  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on && !reduceMotion) { last = performance.now(); requestAnimationFrame(frame); }
  }
  let heroVisible = true;
  new IntersectionObserver(([e]) => {
    heroVisible = e.isIntersecting;
    setRunning(heroVisible && !document.hidden);
  }).observe(hero);
  document.addEventListener('visibilitychange', () => setRunning(heroVisible && !document.hidden));

  requestAnimationFrame(frame);
  canvas.classList.add('ready');
}

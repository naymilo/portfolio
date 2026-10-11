/*
 * Particle sphere — thousands of balls simulated on the GPU.
 * Each ball springs toward its spot on a slowly turning sphere; the cursor
 * parts them on hover and flings them on a fast swipe, then they drift back.
 *
 * Used by the homepage hero (index.html) and the tuning page (sphere-lab.html).
 */
import * as THREE from 'three';
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

const small = matchMedia('(max-width: 768px)').matches;

// Tuned in the sphere lab. "Copy settings" there produces this shape.
export const DEFAULTS = {
  // shape
  particles: small ? 64 : 96,    // texture side; ball count = side²
  screenSize: 0.57,              // sphere diameter as a fraction of the canvas height
  shell: 0,                      // shell thickness (0 = a single skin)
  strays: 0.03,                  // fraction of loose balls outside the shell
  ballSize: small ? 0.05 : 0.036,
  spin: 0.25,
  // physics
  lightness: 0.8,                // how easily the cursor moves them (1 / mass)
  fling: 15,                     // force from swipe speed — slice to throw balls
  push: 8.5,                     // gentle parting just from hovering
  radius: 0.45,
  depthReach: 0.36,              // 0 = a slice hits the whole column, 1 = only nearby depth
  returnPull: 10,                // spring back to the cluster
  airDrag: 4.35,                 // low = balls fly far and bounce, high = they stop quickly
  maxSpeed: 14,
  jitter: 0.48,
  // look
  light: '#ffffff',              // top-left of the gradient
  mid: '#ffffff',
  deep: '#707070',               // bottom-right
  hot: '#ffffff',                // fast-moving balls
  specular: 0.14,
  rim: 0.14,
  glowGain: 0.36,
  glowFloor: 0.07,
  bloom: 0.4,
  bloomRadius: 0.36,
  bloomThreshold: 0.61,
  exposure: 0.79,
};

const R = 1;

/* ── GPU simulation shaders ── */
const velocityShader = /* glsl */`
  uniform float uDt, uTime, uReturn, uDrag, uPush, uRadius, uFling, uLight, uDepth, uMaxSpeed, uJitter, uActive;
  uniform vec3 uPointer, uPointerPrev, uPointerVel;
  uniform mat3 uRot;
  uniform sampler2D uHome;

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec3 p = texture2D(texturePosition, uv).xyz;
    vec3 v = texture2D(textureVelocity, uv).xyz;
    vec4 h = texture2D(uHome, uv);
    vec3 home = uRot * h.xyz;

    // spring back toward the (rotating) home position, with air drag
    vec3 acc = uReturn * (home - p) - uDrag * v;

    // cursor: distance to the path it swept this frame, so fast slices don't skip balls
    vec3 ab = uPointer - uPointerPrev;
    float t = clamp(dot(p - uPointerPrev, ab) / max(dot(ab, ab), 1e-6), 0.0, 1.0);
    vec3 d = p - (uPointerPrev + ab * t);
    d.z *= uDepth;                                 // how much depth shields a ball
    float f = uActive * (1.0 - smoothstep(0.0, uRadius, length(d)));
    vec3 outward = normalize(p + 1e-5);
    vec3 away = normalize(d + outward * 0.3 + 1e-5);
    float speed = length(uPointerVel);
    // hover parts them; swipe speed throws them along the swipe and out of the way
    acc += f * uLight * (uPush * away + uFling * (uPointerVel + away * speed * 0.6));

    // a little life when nothing is happening
    float s = h.w * 61.0;
    acc += uJitter * vec3(sin(uTime * 1.3 + s), sin(uTime * 1.1 + s * 1.7), sin(uTime * 1.7 + s * 2.3));

    v += acc * uDt;
    float sp = length(v);
    if (sp > uMaxSpeed) v *= uMaxSpeed / sp;
    gl_FragColor = vec4(v, 1.0);
  }
`;
const positionShader = /* glsl */`
  uniform float uDt;
  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 p = texture2D(texturePosition, uv);
    p.xyz += texture2D(textureVelocity, uv).xyz * uDt;
    gl_FragColor = p;
  }
`;

/* ── Render shaders: each particle is a point shaded as a ball ── */
const ballVertex = /* glsl */`
  uniform sampler2D uPos, uVel;
  uniform float uSize, uScale, uGlowGain, uGlowFloor;
  uniform vec3 uLight, uMid, uDeep, uHot;
  uniform vec2 uGradDir;
  attribute vec2 aRef;
  attribute float aSeed;
  varying vec3 vColor;
  varying float vGlow;

  void main() {
    vec3 p = texture2D(uPos, aRef).xyz;
    vec3 v = texture2D(uVel, aRef).xyz;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;

    // only motion beyond the idle spin/jitter glows — i.e. balls the cursor shoved
    vGlow = clamp((length(v) - uGlowFloor) * uGlowGain, 0.0, 1.0);
    float size = uSize * mix(0.7, 1.15, aSeed) * (1.0 + vGlow * 0.3);
    gl_PointSize = size * uScale / -mv.z;

    // diagonal gradient across the screen: light top-left → deep bottom-right
    float g = clamp(0.5 + 0.5 * dot(p.xy, uGradDir), 0.0, 1.0);
    vec3 c = g > 0.5 ? mix(uMid, uLight, (g - 0.5) * 2.0) : mix(uDeep, uMid, g * 2.0);
    vColor = mix(c, uHot, vGlow);
  }
`;
const ballFragment = /* glsl */`
  uniform float uSpecular, uRim;
  varying vec3 vColor;
  varying float vGlow;

  void main() {
    vec2 c = gl_PointCoord * 2.0 - 1.0;
    c.y = -c.y;
    float r2 = dot(c, c);
    if (r2 > 1.0) discard;

    vec3 n = vec3(c, sqrt(1.0 - r2));        // fake sphere normal
    vec3 L = normalize(vec3(-0.5, 0.65, 0.8));
    vec3 H = normalize(L + vec3(0.0, 0.0, 1.0));
    float diff = max(dot(n, L), 0.0);
    float spec = pow(max(dot(n, H), 0.0), 60.0);
    float fres = pow(1.0 - n.z, 3.0);

    vec3 col = vColor * (0.18 + 0.9 * diff)
             + uSpecular * spec
             + uRim * fres * vColor
             + vGlow * vColor * 1.2;
    gl_FragColor = vec4(col, 1.0 - smoothstep(0.82, 1.0, r2));

    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

/**
 * Mount the sphere on a canvas.
 *   settings  — a DEFAULTS-shaped object; mutate it, then call apply() / rebuild()
 *   options.background — clear color behind the balls
 *   options.pauseWhenHidden — element; animation pauses while it's off screen
 * Returns { settings, info, apply, rebuild }, or null when the browser can't run it.
 */
export function createParticleSphere(canvas, settings = { ...DEFAULTS }, options = {}) {
  const S = settings;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  } catch (e) {
    return null;
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(options.background || '#0a0a0a');
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);

  // multisampled target so the ball edges stay smooth through the bloom pass
  const composer = new EffectComposer(renderer,
    new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 }));
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), S.bloom, S.bloomRadius, S.bloomThreshold);
  composer.addPass(bloomPass);
  composer.addPass(new OutputPass());

  const ballMaterial = new THREE.ShaderMaterial({
    vertexShader: ballVertex,
    fragmentShader: ballFragment,
    uniforms: {
      uPos: { value: null }, uVel: { value: null },
      uSize: { value: S.ballSize }, uScale: { value: 1 },
      uGlowGain: { value: S.glowGain }, uGlowFloor: { value: S.glowFloor },
      uLight: { value: new THREE.Color(S.light) }, uMid: { value: new THREE.Color(S.mid) },
      uDeep: { value: new THREE.Color(S.deep) }, uHot: { value: new THREE.Color(S.hot) },
      uGradDir: { value: new THREE.Vector2(-0.6, 0.8) },
      uSpecular: { value: S.specular }, uRim: { value: S.rim },
    },
    alphaToCoverage: true,
  });

  const info = { count: '' };
  const rot = new THREE.Euler(0.35, 0, 0);
  const rotM4 = new THREE.Matrix4();
  let gpu, posVar, velVar, points, homeTexture;

  function rebuild() {
    if (gpu) gpu.dispose();
    if (points) { scene.remove(points); points.geometry.dispose(); }
    if (homeTexture) homeTexture.dispose();

    const side = S.particles;
    const count = side * side;
    gpu = new GPUComputationRenderer(side, side, renderer);

    // home positions: dense shell, some inside, a few strays; w = random seed
    const home = new Float32Array(count * 4);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * 2 - 1, a = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      const r = Math.random() < S.strays
        ? R * (1.04 + Math.random() * 0.16)
        : R * (1 - S.shell * Math.random() ** 2);
      home[i * 4] = s * Math.cos(a) * r;
      home[i * 4 + 1] = u * r;
      home[i * 4 + 2] = s * Math.sin(a) * r;
      home[i * 4 + 3] = Math.random();
    }
    homeTexture = new THREE.DataTexture(home, side, side, THREE.RGBAFormat, THREE.FloatType);
    homeTexture.needsUpdate = true;

    // start already rotated like the current frame, so nothing springs on load
    const pos0 = gpu.createTexture();
    const start = new THREE.Matrix4().makeRotationFromEuler(rot);
    const tmp = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      tmp.set(home[i * 4], home[i * 4 + 1], home[i * 4 + 2]).applyMatrix4(start);
      pos0.image.data.set([tmp.x, tmp.y, tmp.z, home[i * 4 + 3]], i * 4);
    }
    const vel0 = gpu.createTexture();   // zeros

    velVar = gpu.addVariable('textureVelocity', velocityShader, vel0);
    posVar = gpu.addVariable('texturePosition', positionShader, pos0);
    gpu.setVariableDependencies(velVar, [posVar, velVar]);
    gpu.setVariableDependencies(posVar, [posVar, velVar]);

    Object.assign(velVar.material.uniforms, {
      uDt: { value: 0 }, uTime: { value: 0 }, uReturn: { value: S.returnPull }, uDrag: { value: S.airDrag },
      uPush: { value: S.push }, uRadius: { value: S.radius }, uFling: { value: S.fling },
      uLight: { value: S.lightness }, uDepth: { value: S.depthReach }, uMaxSpeed: { value: S.maxSpeed },
      uJitter: { value: S.jitter }, uActive: { value: 0 },
      uPointer: { value: new THREE.Vector3(99, 99, 99) }, uPointerPrev: { value: new THREE.Vector3(99, 99, 99) },
      uPointerVel: { value: new THREE.Vector3() },
      uRot: { value: new THREE.Matrix3() }, uHome: { value: homeTexture },
    });
    posVar.material.uniforms.uDt = { value: 0 };

    if (gpu.init() !== null) return false;

    // one vertex per particle; aRef = where its data lives in the textures
    const refs = new Float32Array(count * 2), seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      refs[i * 2] = ((i % side) + 0.5) / side;
      refs[i * 2 + 1] = (Math.floor(i / side) + 0.5) / side;
      seeds[i] = home[i * 4 + 3];
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    geo.setAttribute('aRef', new THREE.BufferAttribute(refs, 2));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    points = new THREE.Points(geo, ballMaterial);
    points.frustumCulled = false;
    scene.add(points);
    info.count = count.toLocaleString();
    return true;
  }

  /* ── Sizing ── */
  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloomPass.resolution.set(w, h);
    camera.aspect = w / h;
    const frac = Math.min(S.screenSize, 0.8 * camera.aspect);
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    camera.position.set(0, 0, (2 * R) / (frac * 2 * Math.tan(halfFov)));
    camera.updateProjectionMatrix();
    // pixels per world unit at distance 1 — turns ball size into gl_PointSize
    ballMaterial.uniforms.uScale.value = renderer.domElement.height * 0.5 * camera.projectionMatrix.elements[5];
  }
  new ResizeObserver(resize).observe(canvas);

  /* ── Pointer → a point in the scene (on the sphere, or a plane through it), plus its velocity ── */
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const hitSphere = new THREE.Sphere(new THREE.Vector3(), R * 1.05);
  const hitPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3(), lastHit = new THREE.Vector3(), hitVel = new THREE.Vector3();
  const rawVel = new THREE.Vector3();
  let pointerIn = false, hadHit = false, active = 0;
  if (!reduceMotion) {
    canvas.addEventListener('pointermove', e => {
      const rect = canvas.getBoundingClientRect();
      ndc.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      pointerIn = true;
    }, { passive: true });
    canvas.addEventListener('pointerleave', () => { pointerIn = false; });
    canvas.addEventListener('pointerup', e => { if (e.pointerType !== 'mouse') pointerIn = false; });
  }

  /* ── Loop ── */
  let angle = 0, last = performance.now(), time = 0, running = true, first = true;

  function step(now) {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    time += dt;
    angle += dt * S.spin;
    rot.y = angle;
    rotM4.makeRotationFromEuler(rot);

    let hasHit = false;
    if (pointerIn) {
      raycaster.setFromCamera(ndc, camera);
      hasHit = raycaster.ray.intersectSphere(hitSphere, hit) !== null
        || raycaster.ray.intersectPlane(hitPlane, hit) !== null;
    }
    const u = velVar.material.uniforms;
    if (hasHit && hadHit && dt > 0) {
      rawVel.subVectors(hit, lastHit).divideScalar(dt);
      if (rawVel.length() > 40) rawVel.setLength(40);
      hitVel.lerp(rawVel, 0.6);
      u.uPointerPrev.value.copy(lastHit);
    } else {
      hitVel.multiplyScalar(0.8);
      if (hasHit) u.uPointerPrev.value.copy(hit);
    }
    if (hasHit) { lastHit.copy(hit); u.uPointer.value.copy(hit); }
    hadHit = hasHit;
    active += ((hasHit ? 1 : 0) - active) * Math.min(1, dt * 10);

    u.uTime.value = time;
    u.uRot.value.setFromMatrix4(rotM4);
    u.uActive.value = active;
    u.uPointerVel.value.copy(hitVel);

    // two substeps keep the spring stable
    const sub = dt / 2;
    u.uDt.value = sub;
    posVar.material.uniforms.uDt.value = sub;
    gpu.compute();
    gpu.compute();

    ballMaterial.uniforms.uPos.value = gpu.getCurrentRenderTarget(posVar).texture;
    ballMaterial.uniforms.uVel.value = gpu.getCurrentRenderTarget(velVar).texture;
    composer.render();

    if (first) { first = false; canvas.classList.add('ready'); }
  }

  function frame(now) {
    step(now);
    if (running && !reduceMotion) requestAnimationFrame(frame);
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (on && !reduceMotion) { last = performance.now(); requestAnimationFrame(frame); }
  }

  /* ── Push the current settings into the shaders ── */
  function apply() {
    const v = velVar.material.uniforms;
    v.uReturn.value = S.returnPull; v.uDrag.value = S.airDrag; v.uPush.value = S.push;
    v.uRadius.value = S.radius; v.uFling.value = S.fling; v.uLight.value = S.lightness;
    v.uDepth.value = S.depthReach; v.uMaxSpeed.value = S.maxSpeed; v.uJitter.value = S.jitter;
    const b = ballMaterial.uniforms;
    b.uSize.value = S.ballSize; b.uGlowGain.value = S.glowGain; b.uGlowFloor.value = S.glowFloor;
    b.uSpecular.value = S.specular; b.uRim.value = S.rim;
    b.uLight.value.set(S.light); b.uMid.value.set(S.mid); b.uDeep.value.set(S.deep); b.uHot.value.set(S.hot);
    bloomPass.strength = S.bloom; bloomPass.radius = S.bloomRadius; bloomPass.threshold = S.bloomThreshold;
    renderer.toneMappingExposure = S.exposure;
    resize();
  }

  if (!rebuild()) { renderer.dispose(); return null; }  // e.g. no float render targets
  apply();

  // Only animate while visible on screen and the tab is in front.
  if (options.pauseWhenHidden) {
    let onScreen = true;
    new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      setRunning(onScreen && !document.hidden);
    }).observe(options.pauseWhenHidden);
    document.addEventListener('visibilitychange', () => setRunning(onScreen && !document.hidden));
  }
  requestAnimationFrame(frame);   // with reduced motion this draws one still frame

  return {
    settings: S,
    info,
    apply,
    rebuild() { const ok = rebuild(); apply(); return ok; },
  };
}

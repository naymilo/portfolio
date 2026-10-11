/* Shared nav + footer for every page, plus homepage scrolling. Load after config.js. */
(() => {
  const config = CONFIG;
  const onHome = !!document.getElementById('hero');
  const home = onHome ? homeScroll() : null;

  /* ── Nav ── */
  const logo = document.getElementById('nav-logo');
  logo.textContent = config.nav.logo;
  if (home) logo.addEventListener('click', e => { e.preventDefault(); home.toTop(); });

  const navLinks = document.getElementById('nav-links');
  config.nav.links.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = link.label;
    if (link.scrollTo) {
      a.href = onHome ? link.scrollTo : 'index.html' + link.scrollTo;
      if (home) a.addEventListener('click', e => { e.preventDefault(); home.toWork(); });
    } else if (link.href) {
      a.href = link.href;
    }
    li.appendChild(a);
    navLinks.appendChild(li);
  });

  /* ── Clicking the hero's scroll cue goes to the work too ── */
  const cue = document.querySelector('.hero-scroll-cue');
  if (home && cue) cue.addEventListener('click', () => home.toWork());

  /* ── Footer ── */
  const footer = document.getElementById('footer');
  if (footer) {
    const social = config.footer.social
      .map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`)
      .join('');
    footer.innerHTML = `
      <div class="footer-inner">
        <span class="footer-name">© ${new Date().getFullYear()} ${config.siteTitle}</span>
        <div class="footer-social">${social}</div>
      </div>
    `;
  }

  /*
   * Homepage: the hero and the work index behave like two slides.
   * Any scroll down from the hero glides to the work; scrolling up from the
   * top of the work glides back. Past that, the page scrolls normally.
   * The URL shows #work only while you're on the work section.
   */
  function homeScroll() {
    const work = document.getElementById('work');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const workTop = () => work.offsetTop;
    const EDGE = 2;                       // px of slack when deciding "at the top of the work"
    // starts moving immediately, settles softly — feels responsive
    const easeOutQuart = t => 1 - (1 - t) ** 4;

    let animating = false, animId = 0;
    let lockDir = 0, lockTimer = 0;       // direction whose leftover momentum is being swallowed

    function animateTo(top) {
      const start = scrollY, dist = top - start;
      const dir = Math.sign(dist);
      lock(dir);
      if (reduce || Math.abs(dist) < 2) { scrollTo(0, top); syncHash(); return; }
      const duration = Math.min(600, 340 + Math.abs(dist) * 0.2);   // ≈ 0.5s for a full screen
      const t0 = performance.now(), id = ++animId;                   // a newer glide cancels this one
      animating = true;
      const step = now => {
        if (id !== animId) return;
        const t = Math.min(1, (now - t0) / duration);
        scrollTo(0, start + dist * easeOutQuart(t));
        if (t < 1) requestAnimationFrame(step);
        else { animating = false; lock(dir); syncHash(); }
      };
      requestAnimationFrame(step);
    }

    // Swallow trackpad momentum in `dir` until it pauses — but never block the other direction.
    function lock(dir) {
      lockDir = dir;
      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => { if (!animating) lockDir = 0; }, 140);
    }

    // where should a scroll of `delta` px go from here? null = let the page scroll normally
    function snapTarget(delta) {
      const y = scrollY, wt = workTop();
      if (y < wt - EDGE) return delta > 0 ? wt : 0;                  // anywhere in the hero
      if (delta < 0 && y + delta <= wt + EDGE) return 0;              // going up past the top of the work
      return null;
    }

    function glideFrom(delta) {
      const target = snapTarget(delta);
      if (target === null) return false;
      const dir = Math.sign(target - scrollY);
      // same direction as a glide in progress / its momentum: just swallow it
      if (dir === lockDir || dir === 0) { if (dir !== 0) lock(dir); return true; }
      animateTo(target);
      return true;
    }

    /* Mouse wheel / trackpad */
    addEventListener('wheel', e => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;   // pinch-zoom, sideways swipes
      if (e.deltaY === 0) return;
      // leftover momentum in the glide's direction is eaten wherever we are, so the landing doesn't drift
      if (lockDir !== 0 && Math.sign(e.deltaY) === lockDir) { e.preventDefault(); lock(lockDir); return; }
      if (glideFrom(e.deltaY)) e.preventDefault();
    }, { passive: false });

    /* Touch: a swipe past a small threshold triggers the glide */
    let touchY = null;
    addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
    addEventListener('touchmove', e => {
      if (touchY === null) return;
      if (animating) { e.preventDefault(); return; }
      const dy = touchY - e.touches[0].clientY;            // > 0 = finger moving up = scroll down
      if (dy === 0) return;
      if (snapTarget(dy) === null) return;
      e.preventDefault();
      if (Math.abs(dy) > 30) { touchY = null; glideFrom(dy); }
    }, { passive: false });
    addEventListener('touchend', () => { touchY = null; }, { passive: true });

    /* Keyboard */
    addEventListener('keydown', e => {
      if (e.target.closest('input, textarea, select, [contenteditable]')) return;
      const down = ['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.shiftKey;
      const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
      if (!down && !up) return;
      const delta = (down ? 1 : -1) * innerHeight * 0.4;
      if (snapTarget(delta) === null) return;
      e.preventDefault();
      lockDir = 0;                         // a key press is always a fresh intent
      glideFrom(delta);
    });

    /* Keep the URL honest: #work on the work section, clean at the top */
    function syncHash() {
      const want = scrollY >= workTop() - innerHeight / 2 ? '#work' : '';
      if (location.hash !== want) history.replaceState(null, '', location.pathname + location.search + want);
    }
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; if (!animating) syncHash(); });
    }, { passive: true });

    // Arriving from another page via index.html#work: land on the work, no animation.
    // (after the page script has rendered the rows, so the page is tall enough)
    if (location.hash === '#work') {
      history.scrollRestoration = 'manual';
      addEventListener('DOMContentLoaded', () => scrollTo(0, workTop()));
    }

    return { toWork: () => animateTo(workTop()), toTop: () => animateTo(0) };
  }
})();

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
    const easeInOutQuart = t => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2);

    let animating = false, locked = false, lockTimer = 0;

    function animateTo(top) {
      const start = scrollY, dist = top - start;
      // swallow trackpad momentum until it dies down, so the glide isn't followed by a jolt
      lock();
      if (reduce || Math.abs(dist) < 2) { scrollTo(0, top); syncHash(); return; }
      const duration = Math.min(750, 420 + Math.abs(dist) * 0.18);   // ≈ 0.6s for a full screen
      const t0 = performance.now();
      animating = true;
      const step = now => {
        const t = Math.min(1, (now - t0) / duration);
        scrollTo(0, start + dist * easeInOutQuart(t));
        if (t < 1) requestAnimationFrame(step);
        else { animating = false; lock(); syncHash(); }
      };
      requestAnimationFrame(step);
    }

    function lock() {
      locked = true;
      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => { if (!animating) locked = false; }, 160);
    }

    // which way should a scroll of `dir` (+1 down, -1 up) go from here? null = scroll normally
    function snapTarget(dir) {
      const y = scrollY, wt = workTop();
      if (y < wt - EDGE) return dir > 0 ? wt : 0;     // anywhere in the hero
      if (y <= wt + EDGE && dir < 0) return 0;          // at the top of the work, going up
      return null;
    }

    /* Mouse wheel / trackpad */
    addEventListener('wheel', e => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;   // pinch-zoom, sideways swipes
      if (animating || locked) {
        if (snapTarget(Math.sign(e.deltaY)) !== null || animating) { e.preventDefault(); lock(); }
        return;
      }
      if (Math.abs(e.deltaY) < 1) return;
      const target = snapTarget(Math.sign(e.deltaY));
      if (target === null) return;
      e.preventDefault();
      if (Math.abs(target - scrollY) > EDGE) animateTo(target);
    }, { passive: false });

    /* Touch: a swipe past a small threshold triggers the glide */
    let touchY = null;
    addEventListener('touchstart', e => { touchY = e.touches[0].clientY; }, { passive: true });
    addEventListener('touchmove', e => {
      if (touchY === null) return;
      if (animating) { e.preventDefault(); return; }
      const dy = touchY - e.touches[0].clientY;            // > 0 = finger moving up = scroll down
      if (dy === 0) return;
      const target = snapTarget(Math.sign(dy));
      if (target === null) return;
      e.preventDefault();
      if (Math.abs(dy) > 30) { touchY = null; if (Math.abs(target - scrollY) > EDGE) animateTo(target); }
    }, { passive: false });
    addEventListener('touchend', () => { touchY = null; }, { passive: true });

    /* Keyboard */
    addEventListener('keydown', e => {
      if (e.target.closest('input, textarea, select, [contenteditable]')) return;
      const down = ['ArrowDown', 'PageDown', ' '].includes(e.key) && !e.shiftKey;
      const up = ['ArrowUp', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey);
      if (!down && !up) return;
      const target = snapTarget(down ? 1 : -1);
      if (target === null) return;
      e.preventDefault();
      if (!animating && Math.abs(target - scrollY) > EDGE) animateTo(target);
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

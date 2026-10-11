/* Shared nav + footer for every page, plus homepage link scrolling. Load after config.js. */
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
   * Homepage: normal scrolling. Clicking "Work" (or the scroll cue) smooth-scrolls
   * to the work index, the logo back to the top. The URL shows #work only while
   * you're on the work section.
   */
  function homeScroll() {
    const work = document.getElementById('work');
    const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const workTop = () => work.offsetTop;

    function syncHash() {
      const want = scrollY >= workTop() - innerHeight / 2 ? '#work' : '';
      if (location.hash !== want) history.replaceState(null, '', location.pathname + location.search + want);
    }
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => { ticking = false; syncHash(); });
    }, { passive: true });

    // Arriving from another page via index.html#work: land on the work
    // (after the page script has rendered the rows, so the page is tall enough).
    if (location.hash === '#work') {
      history.scrollRestoration = 'manual';
      addEventListener('DOMContentLoaded', () => scrollTo(0, workTop()));
    }

    return {
      toWork: () => scrollTo({ top: workTop(), behavior }),
      toTop: () => scrollTo({ top: 0, behavior }),
    };
  }
})();

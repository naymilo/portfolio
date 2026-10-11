/* Shared nav + footer for every page. Load after config.js. */
(() => {
  const config = CONFIG;
  const onHome = !!document.getElementById('hero');

  function scrollToSection(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    history.replaceState(null, '', hash);
  }

  /* ── Nav ── */
  document.getElementById('nav-logo').textContent = config.nav.logo;
  const navLinks = document.getElementById('nav-links');
  config.nav.links.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = link.label;
    if (link.scrollTo) {
      a.href = onHome ? link.scrollTo : 'index.html' + link.scrollTo;
      if (onHome) a.addEventListener('click', e => {
        e.preventDefault();
        scrollToSection(link.scrollTo);
      });
    } else if (link.href) {
      a.href = link.href;
    }
    li.appendChild(a);
    navLinks.appendChild(li);
  });

  /* ── Clicking the hero's scroll cue goes to the work too ── */
  const cue = document.querySelector('.hero-scroll-cue');
  if (cue) cue.addEventListener('click', () => scrollToSection('#work'));

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
})();

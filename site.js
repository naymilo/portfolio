/* Shared nav + footer for every page. Load after config.js. */
(() => {
  const config = CONFIG;
  const onHome = !!document.getElementById('hero');

  /* ── Nav ── */
  document.getElementById('nav-logo').textContent = config.nav.logo;
  const navLinks = document.getElementById('nav-links');
  config.nav.links.forEach(link => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.textContent = link.label;
    if (link.scrollTo) {
      a.href = onHome ? link.scrollTo : 'index.html' + link.scrollTo;
    } else if (link.href) {
      a.href = link.href;
    }
    li.appendChild(a);
    navLinks.appendChild(li);
  });

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

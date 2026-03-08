// ─── Détection de profondeur ──────────────────────────────────────────────────
const isInPages = window.location.pathname.includes('/pages/');
const root      = isInPages ? '../' : './';

// ─── Hamburger ────────────────────────────────────────────────────────────────
const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
  document.body.classList.toggle('menu-open');
});

document.addEventListener('click', (e) => {
  if (
    navMenu.classList.contains('active') &&
    !navMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
  }
});

// ─── Dropdown ────────────────────────────────────────────────────────────────
const dropdowns = document.querySelectorAll('.dropdown');

dropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector('.dropbtn');
  trigger.addEventListener('click', (e) => {
    if (window.innerWidth > 768) return;
    e.preventDefault();
    dropdown.classList.toggle('open');
  });
});

document.addEventListener('click', (e) => {
  dropdowns.forEach((dd) => {
    if (!dd.contains(e.target)) dd.classList.remove('open');
  });
});

// ─── Lien actif dans la navbar ───────────────────────────────────────────────
(function highlightActiveNav() {
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';

  navMenu.querySelectorAll('a:not(.logo-link):not(.btn)').forEach((link) => {
    const linkFile = link.getAttribute('href').split('/').pop();
    if (linkFile === currentFile) {
      link.classList.add('nav-active');
      // Si c'est un lien dans un dropdown, marquer aussi le parent
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) parentDropdown.classList.add('nav-active');
    }
  });

  // Marquer "Projets" si on est sur une page projet ou stage
  const projectPages = ['ProjetGestionVersionGit.html','Dunewave.html','Stage.html','Stage2.html','Projets.html'];
  if (projectPages.includes(currentFile)) {
    const dropbtn = navMenu.querySelector('.dropbtn');
    if (dropbtn) dropbtn.classList.add('nav-active');
  }
})();

// ─── Footer dynamique ────────────────────────────────────────────────────────
const footerLinks = [
  { label: 'CV',          href: 'pages/CV.html'         },
  { label: 'Projets',     href: 'pages/Projets.html'    },
  { label: 'Stages',      href: 'pages/Stage.html'      },
  { label: 'Veille',      href: 'pages/Veille.html'     },
  { label: 'Compétences', href: 'pages/Competence.html' },
  { label: 'Contact',     href: 'pages/Contact.html'    },
];

fetch(root + 'footer.html')
  .then((res) => res.text())
  .then((html) => {
    document.body.insertAdjacentHTML('beforeend', html);

    const nav = document.getElementById('footer-nav-links');
    if (nav) {
      footerLinks.forEach(({ label, href }) => {
        const a = document.createElement('a');
        a.href = isInPages ? href.replace('pages/', '') : href;
        a.textContent = label;
        nav.appendChild(a);
      });
    }
  })
  .catch(() => {
    console.warn('Footer non chargé — utilise un serveur local (ex: Live Server).');
  });
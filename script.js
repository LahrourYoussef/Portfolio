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
      const parentDropdown = link.closest('.dropdown');
      if (parentDropdown) parentDropdown.classList.add('nav-active');
    }
  });

  const projectPages = ['ProjetGestionVersionGit.html','Dunewave.html','Stages.html','Projets.html'];
  if (projectPages.includes(currentFile)) {
    const dropbtn = navMenu.querySelector('.dropbtn');
    if (dropbtn) dropbtn.classList.add('nav-active');
  }
})();

// ─── Footer dynamique ────────────────────────────────────────────────────────
const footerLinks = [
  { label: 'CV',          href: 'pages/CV.html'         },
  { label: 'Projets',     href: 'pages/Projets.html'    },
  { label: 'Stages',      href: 'pages/Stages.html'     },
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

// ─── Carrousel technos ────────────────────────────────────────────────────────
(function () {
  const track = document.querySelector('.techno-logos');
  const bar   = document.getElementById('scrollerBar');
  const thumb = document.getElementById('scrollerThumb');
  if (!track) return;

  let isDraggingTrack = false;
  let isDraggingThumb = false;
  let startX          = 0;
  let scrollLeft      = 0;
  let animOffset      = 0;
  let thumbStartX     = 0;
  let thumbStartLeft  = 0;
  const speed         = 1;

  track.style.animation  = 'none';
  track.style.willChange = 'transform';
  track.style.cursor     = 'grab';

  function halfWidth() {
    return track.scrollWidth / 2;
  }

  // Synchronise la position du thumb avec animOffset
  function updateThumb() {
    if (!bar || !thumb) return;
    const barW    = bar.offsetWidth;
    const thumbW  = thumb.offsetWidth;
    const maxLeft = barW - thumbW;
    const hw      = halfWidth();
    const progress = (Math.abs(animOffset) % hw) / hw;
    thumb.style.left = (progress * maxLeft) + 'px';
  }

  function tick() {
    if (!isDraggingTrack && !isDraggingThumb) {
      animOffset -= speed;
      if (Math.abs(animOffset) >= halfWidth()) {
        animOffset += halfWidth();
      }
      track.style.transform = `translateX(${animOffset}px)`;
      updateThumb();
    }
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // ── Drag sur le carrousel (souris) ──
  track.addEventListener('mousedown', (e) => {
    isDraggingTrack    = true;
    startX             = e.clientX;
    scrollLeft         = animOffset;
    track.style.cursor = 'grabbing';
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingTrack) return;
    const delta = e.clientX - startX;
    animOffset  = scrollLeft + delta;
    const hw    = halfWidth();
    animOffset  = ((animOffset % hw) + hw) % hw * -1;
    track.style.transform = `translateX(${animOffset}px)`;
    updateThumb();
  });

  window.addEventListener('mouseup', () => {
    if (!isDraggingTrack) return;
    isDraggingTrack    = false;
    track.style.cursor = 'grab';
  });

  // ── Drag sur le thumb (souris) ──
  thumb?.addEventListener('mousedown', (e) => {
    isDraggingThumb = true;
    thumbStartX     = e.clientX;
    thumbStartLeft  = parseFloat(thumb.style.left) || 0;
    e.preventDefault();
    e.stopPropagation(); // empêche de déclencher le drag du carrousel
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingThumb) return;
    const barW    = bar.offsetWidth;
    const thumbW  = thumb.offsetWidth;
    const maxLeft = barW - thumbW;
    const delta   = e.clientX - thumbStartX;
    const newLeft = Math.min(Math.max(thumbStartLeft + delta, 0), maxLeft);
    thumb.style.left = newLeft + 'px';
    // Répercute sur le carrousel
    const progress = newLeft / maxLeft;
    animOffset     = -(progress * halfWidth());
    track.style.transform = `translateX(${animOffset}px)`;
  });

  window.addEventListener('mouseup', () => {
    isDraggingThumb = false;
  });

  // ── Drag sur le carrousel (tactile) ──
  track.addEventListener('touchstart', (e) => {
    isDraggingTrack = true;
    startX          = e.touches[0].clientX;
    scrollLeft      = animOffset;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    if (!isDraggingTrack) return;
    const delta = e.touches[0].clientX - startX;
    animOffset  = scrollLeft + delta;
    const hw    = halfWidth();
    animOffset  = ((animOffset % hw) + hw) % hw * -1;
    track.style.transform = `translateX(${animOffset}px)`;
    updateThumb();
  }, { passive: true });

  track.addEventListener('touchend', () => { isDraggingTrack = false; });

  // ── Drag sur le thumb (tactile) ──
  thumb?.addEventListener('touchstart', (e) => {
    isDraggingThumb = true;
    thumbStartX     = e.touches[0].clientX;
    thumbStartLeft  = parseFloat(thumb.style.left) || 0;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDraggingThumb) return;
    const barW    = bar.offsetWidth;
    const thumbW  = thumb.offsetWidth;
    const maxLeft = barW - thumbW;
    const delta   = e.touches[0].clientX - thumbStartX;
    const newLeft = Math.min(Math.max(thumbStartLeft + delta, 0), maxLeft);
    thumb.style.left      = newLeft + 'px';
    const progress        = newLeft / maxLeft;
    animOffset            = -(progress * halfWidth());
    track.style.transform = `translateX(${animOffset}px)`;
  }, { passive: true });

  window.addEventListener('touchend', () => { isDraggingThumb = false; });
})();

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.node-label').forEach(label => {
      label.addEventListener('click', (e) => {
          const parent = label.parentElement;
          if (parent.classList.contains('folder')) {
              parent.classList.toggle('open');
              // Change l'icône selon l'état
              const icon = label.querySelector('.icon');
              icon.textContent = parent.classList.contains('open') ? '📂' : '📁';
          }
      });
  });
});
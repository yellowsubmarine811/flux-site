/* ============================================================
   FLUX Agency — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Image Swap on Row Hover (Home page) ---- */
  const heroImage = document.getElementById('heroImage');
  const projectRows = document.querySelectorAll('.project-row');

  if (heroImage && projectRows.length) {
    projectRows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        const newSrc = row.dataset.image;
        const newAlt = row.dataset.alt;

        if (!newSrc || heroImage.src.endsWith(newSrc)) return;

        heroImage.classList.add('transitioning');

        setTimeout(() => {
          heroImage.src = newSrc;
          heroImage.alt = newAlt;
          heroImage.classList.remove('transitioning');
        }, 250);
      });
    });
  }

  /* ---- Page Load Animation (Home page) ---- */
  if (document.body.classList.contains('home')) {
    const descriptor  = document.querySelector('.descriptor');
    const btnCta      = document.querySelector('.btn-cta');
    const wordmark    = document.querySelector('.wordmark');
    const listHeader  = document.querySelector('.list-header');
    const rows        = document.querySelectorAll('.project-row');
    const hero        = document.querySelector('.hero-image');

    const els = [descriptor, btnCta, wordmark, listHeader, hero, ...rows].filter(Boolean);

    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const sequence = [
      { el: descriptor, delay: 100 },
      { el: btnCta,     delay: 200 },
      { el: wordmark,   delay: 300 },
      { el: listHeader, delay: 400 },
      { el: hero,       delay: 350 },
      ...Array.from(rows).map((row, i) => ({ el: row, delay: 450 + i * 70 }))
    ];

    sequence.forEach(({ el, delay }) => {
      if (!el) return;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
    });
  }

  /* ---- Case Study: Page Load Animation ---- */
  if (document.body.classList.contains('case')) {
    const header    = document.querySelector('.case-header');
    const meta      = document.querySelector('.case-meta');
    const figures   = document.querySelectorAll('.case-figure');
    const nextProj  = document.querySelector('.next-project');
    const caseHero  = document.querySelector('.case-hero-image');

    const els = [caseHero, header, meta, ...figures, nextProj].filter(Boolean);

    els.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    [
      { el: caseHero, delay: 100 },
      { el: header,   delay: 150 },
      { el: meta,     delay: 250 },
      ...Array.from(figures).map((f, i) => ({ el: f, delay: 350 + i * 100 })),
      { el: nextProj, delay: 550 },
    ].forEach(({ el, delay }) => {
      if (!el) return;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
    });
  }

  /* ---- Lightbox (Case Study) ---- */
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');
  const zoomBtns      = document.querySelectorAll('.zoom-btn');
  const figureImgs    = document.querySelectorAll('.case-figure img');

  if (lightbox) {
    const openLightbox = (img) => {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
      lightboxClose.focus();
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    // Zoom button click
    zoomBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const figure = btn.closest('.case-figure');
        const img = figure?.querySelector('img');
        if (img) openLightbox(img);
      });
    });

    // Image click — same lightbox behaviour
    figureImgs.forEach(img => {
      img.addEventListener('click', () => openLightbox(img));
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

});

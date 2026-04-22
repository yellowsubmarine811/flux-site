/* ============================================================
   FLUX Agency — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- Lightbox (shared, called after case content is rendered) ---- */
  function initLightbox() {
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    if (!lightbox) return;

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

    document.querySelectorAll('.zoom-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const img = btn.closest('.case-figure')?.querySelector('img');
        if (img) openLightbox(img);
      });
    });

    document.querySelectorAll('.case-figure img').forEach(img => {
      img.addEventListener('click', () => openLightbox(img));
    });

    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  }

  /* ---- Case page: static animation (for any non-dynamic case pages) ---- */
  function animateCaseStatic() {
    const header   = document.querySelector('.case-header');
    const meta     = document.querySelector('.case-meta');
    const figures  = document.querySelectorAll('.case-figure');
    const nextProj = document.querySelector('.next-project');
    const caseHero = document.querySelector('.case-hero-image');

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

  /* ---- Home page ---- */
  if (document.body.classList.contains('home')) {
    const heroImage     = document.getElementById('heroImage');
    const projectListEl = document.getElementById('projectList');
    const descriptor    = document.querySelector('.descriptor');
    const btnCta        = document.querySelector('.btn-cta');
    const wordmark      = document.querySelector('.wordmark');
    const listHeader    = document.querySelector('.list-header');
    const hero          = document.querySelector('.hero-image');

    // Pre-hide static elements for stagger animation
    [descriptor, btnCta, wordmark, listHeader, hero].filter(Boolean).forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(8px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    fetch('content/projects.json')
      .then(r => r.json())
      .then(projects => {
        // Set default hero image to first project
        if (projects[0] && heroImage) {
          heroImage.src = projects[0].heroImage;
          heroImage.alt = projects[0].name;
        }

        // Render project rows
        projects.forEach(p => {
          const a = document.createElement('a');
          a.className = 'project-row';
          a.href = `work/project.html?id=${p.id}`;
          a.dataset.image = p.heroImage;
          a.dataset.alt = p.name;
          a.style.opacity = '0';
          a.style.transform = 'translateY(8px)';
          a.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          a.innerHTML = `
            <span class="project-number">${p.number}</span>
            <span class="project-name">${p.name}</span>
            <span class="project-tags">${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}</span>
            <span class="project-year">${p.year}</span>
            <span class="project-arrow" aria-hidden="true">→</span>
          `;
          projectListEl.appendChild(a);
        });

        // Hover image swap
        let currentSrc = heroImage.src;
        projectListEl.querySelectorAll('.project-row').forEach(row => {
          row.addEventListener('mouseenter', () => {
            const newSrc = row.dataset.image;
            if (!newSrc || currentSrc === newSrc) return;
            heroImage.classList.add('transitioning');
            setTimeout(() => {
              heroImage.src = newSrc;
              heroImage.alt = row.dataset.alt;
              currentSrc = newSrc;
              heroImage.classList.remove('transitioning');
            }, 250);
          });
        });

        // Staggered reveal animation
        const rows = projectListEl.querySelectorAll('.project-row');
        const sequence = [
          { el: descriptor,  delay: 100 },
          { el: btnCta,      delay: 200 },
          { el: wordmark,    delay: 300 },
          { el: listHeader,  delay: 400 },
          { el: hero,        delay: 350 },
          ...Array.from(rows).map((row, i) => ({ el: row, delay: 450 + i * 70 })),
        ];

        sequence.forEach(({ el, delay }) => {
          if (!el) return;
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
        });
      });
  }

  /* ---- Case Study page ---- */
  if (document.body.classList.contains('case')) {
    const id = new URLSearchParams(window.location.search).get('id');

    if (id) {
      // Dynamic project page: fetch data, render, then animate
      fetch('../content/projects.json')
        .then(r => r.json())
        .then(projects => {
          const project     = projects.find(p => p.id === id);
          if (!project) return;
          const nextProject = projects.find(p => p.id === project.nextProject);

          // Update page title and breadcrumb
          document.title = `${project.name} — FLUX`;
          const breadcrumb = document.getElementById('breadcrumbName');
          if (breadcrumb) breadcrumb.textContent = project.name;

          // Hero image
          const heroImg = document.querySelector('.case-hero-image');
          if (heroImg) {
            heroImg.src = project.heroImage;
            heroImg.alt = `${project.name} project hero`;
          }

          // Meta section
          const metaEl = document.getElementById('caseMeta');
          if (metaEl) {
            const num = (project.number.match(/\d+/) || ['01'])[0];
            metaEl.innerHTML = `
              <div class="meta-row">
                <span class="project-number">${project.number}</span>
              </div>
              <h1 class="case-title">${project.name}</h1>
              <div class="meta-field">
                <span class="meta-key">PROJECT</span>
                <span class="meta-value">[ PRJ_${num} // ${project.name} ]</span>
              </div>
              <div class="meta-field">
                <span class="meta-key">YEAR</span>
                <span class="meta-value">${project.year}</span>
              </div>
              <div class="meta-field">
                <span class="meta-key">TAGS</span>
                <span class="meta-value">${project.tags.map(t => `<span class="tag">${t}</span>`).join('')}</span>
              </div>
              <div class="case-intro">
                <span class="meta-key">[ INTRO ]</span>
                <p>"${project.intro}"</p>
              </div>
            `;
          }

          // Case images + next project
          const imagesEl = document.getElementById('caseImages');
          if (imagesEl) {
            const zoomSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.5"/>
              <line x1="10.5" y1="7.5" x2="10.5" y2="13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="7.5" y1="10.5" x2="13.5" y2="10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
              <line x1="15.5" y1="15.5" x2="20" y2="20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>`;

            const figuresHTML = project.caseImages.map(img => `
              <figure class="case-figure">
                <img src="${img.image}" alt="${img.alt}" loading="lazy" />
                <figcaption>
                  <span>${img.caption}</span>
                  <button class="zoom-btn" aria-label="Zoom image">${zoomSvg}</button>
                </figcaption>
              </figure>
            `).join('');

            const nextHTML = nextProject ? `
              <div class="next-project">
                <span class="next-label">NEXT PROJECT</span>
                <a href="project.html?id=${nextProject.id}" class="next-project-link">
                  <span class="next-name">${nextProject.name} →</span>
                  <img
                    class="next-project-thumb"
                    src="${nextProject.heroImage.replace('w=1200', 'w=200')}"
                    alt="${nextProject.name} project thumbnail"
                    loading="lazy"
                  />
                </a>
              </div>
            ` : '';

            imagesEl.innerHTML = figuresHTML + nextHTML;
          }

          // Init lightbox now that figures are in the DOM
          initLightbox();

          // Animate
          const header   = document.querySelector('.case-header');
          const meta     = document.getElementById('caseMeta');
          const figures  = document.querySelectorAll('.case-figure');
          const nextProj = document.querySelector('.next-project');
          const caseHero = document.querySelector('.case-hero-image');

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
        });

    } else {
      // Static case page (e.g. meridian.html): animate existing DOM
      animateCaseStatic();
      initLightbox();
    }
  }

});

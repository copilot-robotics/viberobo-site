/* Viberobo main.js — nav, reveal, particles, spotlight, filters, FAQ */
(function () {
  const $  = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* year */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* nav scroll + progress bar */
  const nav = $('#nav'), progress = $('#progress');
  addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', scrollY > 24);
    if (progress) {
      const h = document.documentElement;
      progress.style.transform = `scaleX(${h.scrollTop / (h.scrollHeight - h.clientHeight || 1)})`;
    }
  }, { passive: true });

  /* mobile menu */
  const menuBtn = $('#menuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => document.body.classList.toggle('menu-open'));
    $$('nav.main a').forEach(a => a.addEventListener('click', () => document.body.classList.remove('menu-open')));
  }

  /* reveal on scroll */
  if (REDUCED) {
    $$('[data-reveal]').forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]').forEach(el => io.observe(el));
  }

  /* card spotlight */
  if (matchMedia('(hover:hover)').matches && !REDUCED) {
    $$('.card').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* star particles */
  const cv = $('#stars');
  if (cv && !REDUCED) {
    const ctx = cv.getContext('2d');
    let W, H, pts = [];
    const resize = () => {
      W = cv.width  = innerWidth * devicePixelRatio;
      H = cv.height = innerHeight * devicePixelRatio;
      cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
      const n = Math.min(80, Math.floor(innerWidth / 18));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: (0.4 + Math.random() * 1.3) * devicePixelRatio,
        vx: (Math.random() - .5) * .12 * devicePixelRatio,
        vy: (-0.04 - Math.random() * .16) * devicePixelRatio,
        a: .08 + Math.random() * .28, tw: .4 + Math.random() * 1.6, ph: Math.random() * 6.28
      }));
    };
    resize(); addEventListener('resize', resize);
    (function draw(t) {
      requestAnimationFrame(draw);
      if (document.hidden) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
        const tw = .6 + .4 * Math.sin(t * .001 * p.tw + p.ph);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.283);
        ctx.fillStyle = `rgba(160,225,248,${p.a * tw})`;
        ctx.fill();
      }
    })(0);
  }

  /* neural-network background (AI constellation, hero of home page) */
  const ncv = $('#neural');
  if (ncv && !REDUCED) {
    const nctx = ncv.getContext('2d');
    let NW, NH, nodes = [];
    const nsize = () => {
      const r = ncv.parentElement.getBoundingClientRect();
      NW = ncv.width  = r.width  * devicePixelRatio;
      NH = ncv.height = r.height * devicePixelRatio;
      ncv.style.width = r.width + 'px'; ncv.style.height = r.height + 'px';
      const n = Math.min(64, Math.floor(r.width / 24));
      nodes = Array.from({ length: n }, () => ({
        x: Math.random() * NW, y: Math.random() * NH,
        vx: (Math.random() - .5) * .22 * devicePixelRatio,
        vy: (Math.random() - .5) * .22 * devicePixelRatio,
        r: (0.9 + Math.random() * 1.7) * devicePixelRatio
      }));
    };
    nsize(); addEventListener('resize', nsize);
    (function ndraw() {
      requestAnimationFrame(ndraw);
      if (document.hidden) return;
      nctx.clearRect(0, 0, NW, NH);
      const maxD = 150 * devicePixelRatio;
      for (const p of nodes) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > NW) p.vx *= -1;
        if (p.y < 0 || p.y > NH) p.vy *= -1;
      }
      nctx.lineWidth = devicePixelRatio * .7;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            nctx.strokeStyle = `rgba(96,175,255,${(1 - d / maxD) * .17})`;
            nctx.beginPath(); nctx.moveTo(a.x, a.y); nctx.lineTo(b.x, b.y); nctx.stroke();
          }
        }
      }
      for (const p of nodes) {
        nctx.beginPath();
        nctx.arc(p.x, p.y, p.r, 0, 6.283);
        nctx.fillStyle = 'rgba(130,205,255,.4)';
        nctx.fill();
      }
    })();
  }

  /* template filters */
  const tabs = $$('.f-tab');
  if (tabs.length) {
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('on'));
      tab.classList.add('on');
      const cat = tab.dataset.cat;
      $$('.tpl[data-cat]').forEach(card => {
        card.classList.toggle('hide', cat !== 'all' && card.dataset.cat !== cat);
      });
    }));
  }

  /* FAQ accordion */
  $$('.faq-item').forEach(item => {
    const q = $('.faq-q', item), a = $('.faq-a', item);
    if (!q || !a) return;
    q.addEventListener('click', () => {
      const open = item.classList.contains('open');
      $$('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        $('.faq-a', o).style.maxHeight = null;
      });
      if (!open) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* recalc open FAQ height when language switches */
  document.addEventListener('vb:lang', () => {
    $$('.faq-item.open .faq-a').forEach(a => { a.style.maxHeight = a.scrollHeight + 'px'; });
  });
})();

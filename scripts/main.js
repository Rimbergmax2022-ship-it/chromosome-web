/* =============================================================
   CHROMOSOME COSMETICS — interactions
   ============================================================= */
(() => {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Product data ----------
     מקור אמת: החנות של Chromosome Cosmetics ב-Shopify (products.json).
     img   = תמונת המוצר האמיתית מ-Shopify CDN (ציבורית).
     fallback = איור מקומי שמוצג אם התמונה לא נטענת.
     handle = הכתובת בחנות (chromosomecosmetics.com/products/<handle>).
  */
  const CDN = 'https://cdn.shopify.com/s/files/1/0792/1342/8965/files/';
  const PRODUCTS = [
    { handle:'deep-nourishing-cream', img: CDN+'IMG_8914.jpg?v=1767447064', fallback:'assets/product-1.svg', tag:'רב מכר', name:'קרם הזנה עמוק', en:'Deep Nourishing Cream · 50ml',
      desc:'פורמולה עשירה מחמאת שיאה, חמאת מנגו ושמנים בכבישה קרה — הזנה עמוקה שמחזירה לעור רכות, גמישות וברק טבעי.', price:129.90 },
    { handle:'cell-restore-cream', img: CDN+'92B4262D-79F7-4E12-A262-722B4182B80D.jpg?v=1778480312', fallback:'assets/product-4.svg', tag:'פרימיום', name:'קרם לשיקום העור', en:'Cell Restore Cream',
      desc:'קרם עשיר לשיקום עור יבש במיוחד, מגורה או סדוק. חמאת שיאה וקקאו וקומפלקס שמנים בכבישה קרה להזנה עמוקה.', price:169.90 },
    { handle:'foot-cream', img: CDN+'7980E029-1E3D-4BBA-A1E2-47269A7A0B11.png?v=1778480313', fallback:'assets/product-3.svg', tag:'רגליים', name:'קרם רגליים', en:'Foot Cream',
      desc:'קרם עשיר המזין את עור כף הרגל ושומר על רכות, גמישות ולחות מתמשכת לאורך היום.', price:119.90 },
    { handle:'hand-cream', img: CDN+'502D02F3-81E7-4BA9-83FC-3BB6FA0DCFE2.jpg?v=1778480312', fallback:'assets/product-2.svg', tag:'ידיים', name:'קרם ידיים', en:'Hand Cream',
      desc:'חמאת שיאה, אלוורה ושמני פירות טבעיים — מרקם קליל שנספג מהר ומותיר ידיים רכות ונעימות.', price:119.90 },
    { handle:'body-cream', img: CDN+'DD5DC935-F231-43FB-A87D-24A78E41E7C7.png?v=1778480312', fallback:'assets/product-5.svg', tag:'גוף', name:'קרם גוף', en:'Body Cream',
      desc:'נוסחה עשירה עם חמאת שיאה ואלוורה, ויטמין E ותמצית קלנדולה — הזנה עמוקה לעור גוף גמיש ורגוע.', price:119.90 },
    { handle:'foot-scrub', img: CDN+'c6d79b90-a29b-49aa-afbd-bb23bdd280f3.jpg?v=1768034543', fallback:'assets/product-6.svg', tag:'פילינג', name:'פילינג לכפות הרגליים', en:'Foot Scrub',
      desc:'פילינג פחם פעיל ובוץ ים המלח לניקוי יסודי והחלקת עור כף הרגל, לתחושת רעננות ורכות.', price:139.90 },
    { handle:'callus-softing-spray', img: CDN+'5AE8739B-A302-4DE0-85D1-9FAD3FF189EA.png?v=1778480312', fallback:'assets/product-6.svg', tag:'רגליים', name:'תרסיס לריכוך יבלות', en:'Callus Softening Spray · 250ml',
      desc:'תרסיס חומצות פירות ותמציות בוטניות לריכוך עור מחוספס והסרת תאים יבשים, עם חומצה היאלורונית ללחות מיידית.', price:118.00 },
    { handle:'enzimatic-cuticle-remover', img: CDN+'30E682BC-632F-40B4-A82A-D923B4993AE2.png?v=1778480312', fallback:'assets/product-4.svg', tag:'מניקור', name:'מסיר עורמיות אנזימטי', en:'Enzymatic Cuticle Remover',
      desc:'אנזימים טבעיים מפפאיה המרככים את הקוטיקולה וממיסים בעדינות תאי עור עודפים — הסרה עדינה ובטוחה.', price:89.90 },
  ];
  const STORE = 'https://chromosomecosmetics.com/products/';
  const nis = n => '₪' + n.toFixed(2).replace(/\.00$/, '');

  /* ---------- Render product cards ---------- */
  const grid = $('#product-grid');
  if (grid) {
    grid.innerHTML = PRODUCTS.map(p => `
      <article class="card reveal" data-reveal data-tilt>
        <a class="card__media" href="${STORE}${p.handle}" target="_blank" rel="noopener" aria-label="${p.name}">
          <span class="card__tag">${p.tag}</span>
          <img src="${p.img}" alt="${p.name}" loading="lazy"
               onerror="this.onerror=null;this.src='${p.fallback}';this.closest('.card__media').classList.add('is-fallback')" />
        </a>
        <h3 class="card__name">${p.name}</h3>
        <p class="card__en">${p.en}</p>
        <p class="card__desc">${p.desc}</p>
        <div class="card__foot">
          <span class="card__price">${nis(p.price)}</span>
          <button class="card__add" data-add>הוספה לעגלה</button>
        </div>
      </article>`).join('');
  }

  /* ---------- Preloader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => $('#loader')?.classList.add('done'), 650);
  });

  /* ---------- Year ---------- */
  const y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- Nav scroll + mobile ---------- */
  const nav = $('#nav');
  const onScroll = () => nav?.classList.toggle('scrolled', window.scrollY > 40);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  const burger = $('#burger'), links = $('.nav__links');
  burger?.addEventListener('click', () => {
    links.classList.toggle('open');
    burger.classList.toggle('active');
  });
  $$('.nav__links a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
  $$('[data-reveal]').forEach(el => io.observe(el));

  /* ---------- Count-up stats ---------- */
  const counters = $$('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count;
      if (target === 0) { cio.unobserve(el); return; } // static text stat
      let n = 0; const step = Math.max(1, Math.ceil(target / 45));
      const tick = () => { n = Math.min(target, n + step); el.textContent = n; if (n < target) requestAnimationFrame(tick); };
      tick(); cio.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => cio.observe(c));

  /* ---------- Custom cursor ---------- */
  const cur = $('.cursor'), dot = $('.cursor-dot');
  if (cur && !matchMedia('(hover: none)').matches) {
    let mx = 0, my = 0, cx = 0, cy = 0;
    addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
    const loop = () => { cx += (mx - cx) * .18; cy += (my - cy) * .18; cur.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(loop); };
    loop();
    $$('a, button, [data-tilt], input').forEach(el => {
      el.addEventListener('mouseenter', () => cur.classList.add('is-hover'));
      el.addEventListener('mouseleave', () => cur.classList.remove('is-hover'));
    });
  }

  /* ---------- Hero parallax (mouse depth) ---------- */
  const stage = $('#stage');
  if (stage && !reduce) {
    const depths = $$('[data-depth]', stage);
    let tx = 0, ty = 0, rx = 0, ry = 0;
    addEventListener('mousemove', e => {
      tx = (e.clientX / innerWidth - .5);
      ty = (e.clientY / innerHeight - .5);
    });
    const loop = () => {
      rx += (tx - rx) * .06; ry += (ty - ry) * .06;
      depths.forEach(el => {
        const d = +el.dataset.depth * 100;
        el.style.transform = `translate3d(${-rx * d}px, ${-ry * d}px, 0)`;
      });
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- 3D tilt + spotlight on cards ---------- */
  if (!reduce) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', `${px * 100}%`);
        card.style.setProperty('--my', `${py * 100}%`);
        card.style.transform = `perspective(900px) rotateY(${(px - .5) * 8}deg) rotateX(${-(py - .5) * 8}deg) translateY(-6px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Cart counter ---------- */
  let cart = 0; const cartN = $('.nav__cart span');
  document.addEventListener('click', e => {
    if (e.target.matches('[data-add]')) {
      cart++; if (cartN) { cartN.textContent = cart; cartN.animate(
        [{ transform: 'scale(1)' }, { transform: 'scale(1.6)' }, { transform: 'scale(1)' }], { duration: 320 }); }
      const t = e.target; const orig = t.textContent; t.textContent = 'נוסף ✓';
      setTimeout(() => (t.textContent = orig), 1200);
    }
  });

  /* ---------- Newsletter ---------- */
  const form = $('#joinForm'), msg = $('#joinMsg');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input').value.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    msg.style.color = ok ? 'var(--emerald)' : 'var(--rose)';
    msg.textContent = ok ? 'תודה! ברוכה הבאה למעגל הפנימי של כרומוזום ✦' : 'נא להזין כתובת אימייל תקינה';
    if (ok) form.reset();
  });

  /* ---------- DNA double-helix canvas ---------- */
  const canvas = $('#helix');
  if (canvas && !reduce) {
    const ctx = canvas.getContext('2d');
    let W, H, dpr;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.width = canvas.offsetWidth * dpr;
      H = canvas.height = canvas.offsetHeight * dpr;
    };
    resize(); addEventListener('resize', resize);

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      const cx = W * 0.72;            // helix anchored toward the visual centre-right
      const amp = Math.min(W, H) * 0.10;
      const nodes = 34;
      const gap = H / nodes;
      for (let i = 0; i < nodes; i++) {
        const yy = i * gap;
        const phase = i * 0.34 + t;
        const x1 = cx + Math.sin(phase) * amp;
        const x2 = cx + Math.sin(phase + Math.PI) * amp;
        const depth = (Math.cos(phase) + 1) / 2; // 0..1 front/back

        // rung
        ctx.strokeStyle = `rgba(201,168,106,${0.05 + depth * 0.14})`;
        ctx.lineWidth = 1 * dpr;
        ctx.beginPath(); ctx.moveTo(x1, yy); ctx.lineTo(x2, yy); ctx.stroke();

        // nodes
        const r1 = (2 + depth * 3) * dpr;
        const r2 = (2 + (1 - depth) * 3) * dpr;
        ctx.fillStyle = `rgba(232,213,168,${0.25 + depth * 0.55})`;
        ctx.beginPath(); ctx.arc(x1, yy, r1, 0, 7); ctx.fill();
        ctx.fillStyle = `rgba(127,209,185,${0.2 + (1 - depth) * 0.45})`;
        ctx.beginPath(); ctx.arc(x2, yy, r2, 0, 7); ctx.fill();
      }
      t += 0.012;
      requestAnimationFrame(draw);
    };
    draw();
  }
})();

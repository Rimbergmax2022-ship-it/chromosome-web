/* =============================================================
   CHROMOSOME COSMETICS — interactions
   ============================================================= */
(() => {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Product data (EDIT ME — swap prices/images/text) ---------- */
  const PRODUCTS = [
    { img: 'assets/product-1.svg', tag: 'רב מכר', name: 'סרום ההתחדשות', desc: 'סרום פפטידים מרוכז למיצוק, החלקת קווים והברקת גוון העור.', price: 420 },
    { img: 'assets/product-2.svg', tag: 'לחות', name: 'תמצית ביו־סלולרית', desc: 'תמצית לחות תלת־מולקולרית לעור נימוח, גמיש ומלא חיות.', price: 380 },
    { img: 'assets/product-3.svg', tag: 'עיניים', name: 'קרם עיניים כרומוזום', desc: 'מפחית נפיחות וקווים דקים סביב העין עם קפאין ופפטידים.', price: 290 },
    { img: 'assets/product-4.svg', tag: 'יוקרה', name: 'שמן פנים זהב', desc: 'תערובת שמנים יקרים ל-24K זוהר, הזנה עמוקה וגימור קטיפתי.', price: 460 },
    { img: 'assets/product-5.svg', tag: 'טיפול', name: 'מסכת התחדשות תאית', desc: 'מסכת לילה עשירה המחדשת את העור בזמן שאתם ישנים.', price: 340 },
    { img: 'assets/product-6.svg', tag: 'ניקוי', name: 'תרחיף ניקוי עדין', desc: 'מנקה לעומק מבלי לפגוע במחסום הלחות הטבעי של העור.', price: 240 },
  ];

  /* ---------- Render product cards ---------- */
  const grid = $('#product-grid');
  if (grid) {
    grid.innerHTML = PRODUCTS.map(p => `
      <article class="card reveal" data-reveal data-tilt>
        <div class="card__media">
          <span class="card__tag">${p.tag}</span>
          <img src="${p.img}" alt="${p.name}" loading="lazy" />
        </div>
        <h3 class="card__name">${p.name}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__foot">
          <span class="card__price">₪${p.price} <small>/ ₪</small></span>
          <button class="card__add" data-add>הוספה</button>
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

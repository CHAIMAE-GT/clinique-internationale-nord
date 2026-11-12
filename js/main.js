/* Clinique Internationale du Nord — scripts */
(function () {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* Menu responsive + header sticky */
  const burger = $('.burger'), menu = $('#menu'), header = $('header');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => {
    if (!a.nextElementSibling) menu.classList.remove('open');
  }));

  /* Scroll : ombre du header + bouton retour en haut */
  const top = $('#top');
  addEventListener('scroll', () => {
    header.classList.toggle('s', scrollY > 10);
    top.classList.toggle('v', scrollY > 600);
  }, { passive: true });
  top.addEventListener('click', () => scrollTo({ top: 0 }));

  /* Apparition au scroll + compteurs animés */
  const count = el => {
    const end = +el.dataset.n, t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 1400, 1);
      el.textContent = Math.round(end * p).toLocaleString('fr-FR');
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    $$('[data-n]', e.target).forEach(count);
    io.unobserve(e.target);
  }), { threshold: .15 });
  $$('.rv').forEach(el => io.observe(el));

  /* Blog : filtres + recherche */
  if ($('#q')) {
  const posts = $$('.post'), q = $('#q');
  let cat = 'all';
  const filter = () => {
    const term = q.value.trim().toLowerCase();
    let n = 0;
    posts.forEach(p => {
      const ok = (cat === 'all' || p.dataset.cat === cat) && p.textContent.toLowerCase().includes(term);
      p.hidden = !ok; if (ok) n++;
    });
    $('#none').hidden = n > 0;
  };
  q.addEventListener('input', filter);
  $$('.chip').forEach(c => c.addEventListener('click', () => {
    $$('.chip').forEach(x => x.classList.remove('on'));
    c.classList.add('on'); cat = c.dataset.cat; filter();
  }));

  }

  /* Formulaires : validation + état de chargement */
  const msgs = {
    name: 'Indiquez votre nom complet.',
    email: 'Entrez une adresse e-mail valide.',
    phone: 'Entrez un numéro de téléphone valide.',
    message: 'Écrivez votre message (10 caractères minimum).'
  };
  const valid = f => {
    const v = f.value.trim();
    if (f.name === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (f.name === 'phone') return /^[+\d\s().-]{8,}$/.test(v);
    if (f.name === 'message') return v.length >= 10;
    return v.length > 1;
  };
  $$('form').forEach(form => {
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', e => {
      e.preventDefault();
      let ok = true;
      $$('[data-v]', form).forEach(f => {
        const good = valid(f);
        f.setAttribute('aria-invalid', !good);
        f.nextElementSibling.textContent = good ? '' : msgs[f.name];
        if (!good) ok = false;
      });
      if (!ok) return;
      const btn = $('button[type=submit]', form), label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Envoi en cours…';
      /* TODO backend : remplacer par fetch('/api/contact.php', {method:'POST', body:new FormData(form)}) */
      setTimeout(() => {
        form.reset(); btn.disabled = false; btn.textContent = label;
        $('.ok', form.parentElement).hidden = false;
      }, 900);
    });
  });

  /* Année dynamique */
  $('#yr').textContent = new Date().getFullYear();
})();

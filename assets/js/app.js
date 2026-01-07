const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => Array.from(el.querySelectorAll(s));

function smoothScroll() {
  $$('a[data-scroll]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      history.replaceState(null, '', href);
    });
  });
}

function toast(msg){
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=> t.classList.remove('show'), 1600);
}

function drawer(){
  const drawer = $('#drawer');
  const btn = $('#fab');
  const close = $('#drawerClose');
  const toggle = () => drawer.classList.toggle('open');

  btn.addEventListener('click', toggle);
  close.addEventListener('click', toggle);

  document.addEventListener('click', (e) => {
    if (!drawer.classList.contains('open')) return;
    const within = drawer.contains(e.target) || btn.contains(e.target);
    if (!within) drawer.classList.remove('open');
  });

  $$('[data-copy]').forEach(b => {
    b.addEventListener('click', async () => {
      const val = b.getAttribute('data-copy');
      try{
        await navigator.clipboard.writeText(val);
        toast('Номер скопирован');
      }catch(err){
        toast('Не удалось скопировать');
      }
    });
  });
}

const SERVICES = [
  {
    id: 'tile',
    title: 'Плитка и санузлы',
    img: 'assets/img/tile.jpg',
    desc: 'Аккуратная укладка плитки, подготовка основания, затирка, гидроизоляция, откосы и примыкания.',
    bullets: ['Разметка и раскладка', 'Гидроизоляция и уклоны', 'Ровные швы, крестики/СВП', 'Скрытые люки и ревизии']
  },
  {
    id: 'laminate',
    title: 'Ламинат и кварц-винил',
    img: 'assets/img/laminate.jpg',
    desc: 'Подложка, выравнивание, аккуратные примыкания, плинтусы, пороги и стыки с плиткой.',
    bullets: ['Диагностика основания', 'Компенсационные зазоры', 'Плинтусы и доборы', 'Стыковка материалов']
  },
  {
    id: 'glass',
    title: 'Душевые перегородки из закаленного стекла',
    img: 'assets/img/glass.jpg',
    desc: 'Замер, подбор фурнитуры, монтаж перегородок и дверей. Чистые силиконовые швы и герметичность.',
    bullets: ['Замер и проектирование', 'Фурнитура премиум-класса', 'Монтаж по уровню', 'Герметизация и тест']
  },
  {
    id: 'parquet',
    title: 'Паркет и инженерная доска',
    img: 'assets/img/parquet.jpg',
    desc: 'Подготовка основания, укладка, шлифовка и покрытие. Приятная тактильность и долговечность.',
    bullets: ['Контроль влажности', 'Клеевая/плавающая укладка', 'Шлифовка и масло/лак', 'Реставрация участков']
  },
  {
    id: 'wallpaper',
    title: 'Обои и декоративные покрытия',
    img: 'assets/img/wallpaper.jpg',
    desc: 'Идеальные стыки, подготовка стен, покраска. Чистота в процессе и аккуратная сдача.',
    bullets: ['Шпатлевка и грунт', 'Поклейка винил/флизелин', 'Покраска без подтеков', 'Защита поверхностей']
  },
  {
    id: 'turnkey',
    title: 'Ремонт под ключ',
    img: 'assets/img/gallery4.jpg',
    desc: 'План работ, смета, контроль качества, сроки и коммуникации. Один подрядчик — один результат.',
    bullets: ['Смета и календарный план', 'Поставка материалов', 'Фотоотчеты', 'Финишная уборка и сдача']
  }
];

function servicesCards(){
  const root = $('#servicesGrid');
  if (!root) return;
  root.innerHTML = SERVICES.map(s => `
    <article class="service" role="button" tabindex="0" data-service="${s.id}">
      <div class="service__img" style="background-image:url('${s.img}')"></div>
      <div class="service__title">${s.title}</div>
      <p class="service__desc">${s.desc}</p>
      <div class="service__meta">
        <span class="pill">Гарантия</span>
        <span class="pill">Чистая работа</span>
        <span class="pill">Сроки</span>
      </div>
    </article>
  `).join('');

  root.addEventListener('click', (e) => {
    const card = e.target.closest('[data-service]');
    if (!card) return;
    const id = card.getAttribute('data-service');
    openService(id);
  });

  root.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('[data-service]');
    if (!card) return;
    e.preventDefault();
    openService(card.getAttribute('data-service'));
  });
}

function modal(){
  const modal = $('#modal');
  const close = () => modal.classList.remove('open');
  $('#modalClose').addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', (e)=> { if (e.key === 'Escape') close(); });
}

function openService(id){
  const s = SERVICES.find(x => x.id === id);
  if (!s) return;

  $('#modalTitle').textContent = s.title;
  $('#modalText').textContent = s.desc;

  const img = $('#modalImg');
  img.style.backgroundImage = `url('${s.img}')`;

  const list = $('#modalList');
  list.innerHTML = s.bullets.map(b => `<div class="li">• ${b}</div>`).join('');

  $('#modal').classList.add('open');
}

function gallery(){
  $$('.gitem').forEach((g) => {
    g.addEventListener('click', () => {
      const img = g.querySelector('img');
      if (!img) return;
      $('#modalTitle').textContent = 'Пример работы';
      $('#modalText').textContent = img.getAttribute('alt') || 'Фрагмент проекта';
      $('#modalImg').style.backgroundImage = `url('${img.getAttribute('src')}')`;
      $('#modalList').innerHTML = `<div class="li">• Реальный объект • Чистые примыкания • Контроль качества</div>`;
      $('#modal').classList.add('open');
    });
  });
}

function estimate(){
  const form = $('#estimateForm');
  if (!form) return;

  const out = $('#estimateOut');
  const calc = () => {
    const area = parseFloat($('#area').value || '0');
    const level = $('#level').value; // cosmetic/standard/premium
    const extras = $$('input[name="extra"]:checked').map(x=>x.value);

    const base = Math.max(area, 0);
    const rateMap = { cosmetic: 190, standard: 260, premium: 360 }; // BYN / m2 (illustrative)
    const rate = rateMap[level] || 260;

    let extra = 0;
    if (extras.includes('bath')) extra += 1400;
    if (extras.includes('glass')) extra += 900;
    if (extras.includes('design')) extra += 700;

    const approx = Math.round(base * rate + extra);
    out.textContent = isFinite(approx) && approx > 0
      ? `Ориентир: ${approx.toLocaleString('ru-RU')} BYN`
      : 'Введите площадь — получите ориентир по бюджету';
  };

  form.addEventListener('input', calc);
  calc();
}

function contact(){
  const form = $('#contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#c_name').value.trim();
    const phone = $('#c_phone').value.trim();
    const msg = $('#c_msg').value.trim();
    if (!phone) { toast('Укажите телефон'); return; }

    const subject = encodeURIComponent('Заявка на ремонт — Aurora Renova');
    const body = encodeURIComponent(
      `Имя: ${name || '-'}\nТелефон: ${phone}\n\nСообщение:\n${msg || '-'}\n\n(Отправлено с сайта)`
    );
    // Opens user's mail client. Replace with your backend when needed.
    window.location.href = `mailto:info@aurora-renova.example?subject=${subject}&body=${body}`;
    toast('Открою почту для отправки');
  });
}

function year(){
  const y = new Date().getFullYear();
  const el = $('#year');
  if (el) el.textContent = String(y);
}

document.addEventListener('DOMContentLoaded', () => {
  smoothScroll();
  mobileNav();
  drawer();
  servicesCards();
  modal();
  gallery();
  estimate();
  contact();
  year();
});

function mobileNav(){
  const burger = document.getElementById('navBurger');
  const overlay = document.getElementById('navMobile');
  const close = document.getElementById('navClose');
  const panel = overlay ? overlay.querySelector('.nav__mobilePanel') : null;

  if (!burger || !overlay || !close || !panel) return;

  const open = () => {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    burger.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('nav-open'); // <-- добавить
  };

  const shut = () => {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    burger.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
    document.body.classList.remove('nav-open'); // <-- добавить
  };

  burger.addEventListener('click', () => overlay.classList.contains('open') ? shut() : open());
  close.addEventListener('click', shut);

  // click on dark overlay closes, click inside panel doesn't
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) shut();
  });

  // close on escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') shut();
  });

  // close after clicking any menu link (works with smoothScroll)
  overlay.querySelectorAll('a[data-scroll]').forEach(a => {
    a.addEventListener('click', () => shut());
  });
}
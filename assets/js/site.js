/* Matriz de São José · interações (sem dependências) */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Data e hora no Recife ---------- */
  const agora = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Recife' }));
  const dia0 = d => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const addD = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
  const DIAS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

  /* ---------- Calendário litúrgico (tempo, semana e cor do dia) ---------- */
  function pascoa(y) { // algoritmo gregoriano anônimo
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const mes = Math.floor((h + l - 7 * m + 114) / 31), dia = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, mes - 1, dia);
  }
  const advento1 = y => { const n = new Date(y, 11, 25); return addD(n, -(n.getDay() || 7) - 21); };
  const batismo = y => { const ep = new Date(y, 0, 6); return addD(ep, 7 - ep.getDay()); }; // domingo depois de 6/1
  const ord = n => n + 'ª';
  function liturgia(d) {
    d = dia0(d); const y = d.getFullYear(), P = pascoa(y), cinzas = addD(P, -46), ramos = addD(P, -7), pent = addD(P, 49), adv = advento1(y), bat = batismo(y);
    const dow = d.getDay(), dom = addD(d, -dow), sem = n => `${DIAS[dow]} da ${ord(n)} Semana`;
    const COR = { verde: '#3f7a3a', roxo: '#5b2a7a', branco: '#efe6d2', vermelho: '#c0261f', rosa: '#d98aa6' };
    const fixo = { '2-19': ['Solenidade de São José, Esposo da Virgem Maria', 'branco'], '4-1': ['São José Operário', 'branco'], '11-2': ['Comemoração dos Fiéis Defuntos', 'roxo'], '11-25': ['Natal do Senhor', 'branco'], '0-1': ['Santa Maria, Mãe de Deus', 'branco'] };
    const k = `${d.getMonth()}-${d.getDate()}`;
    if (k === '11-25' || k === '0-1') return { txt: fixo[k][0], tempo: 'Tempo do Natal', cor: COR.branco };
    if (k === '2-19' && !(d >= ramos && d <= P)) return { txt: fixo[k][0], tempo: 'Padroeiro da paróquia', cor: COR.branco };
    if (k === '4-1' && dow !== 0) return { txt: fixo[k][0], tempo: 'Padroeiro da paróquia', cor: COR.branco };
    if (k === '11-2') return { txt: fixo[k][0], tempo: 'Tempo Comum', cor: COR.roxo };
    if (d.getMonth() === 11 && d.getDate() > 25) return { txt: `${DIAS[dow]} na Oitava do Natal`, tempo: 'Tempo do Natal', cor: COR.branco };
    if (d >= adv) { const n = Math.floor((d - adv) / 864e5 / 7) + 1; return { txt: dow ? sem(n).replace('Semana', 'Semana do Advento') : `${ord(n)} Domingo do Advento`, tempo: 'Advento', cor: n === 3 && !dow ? COR.rosa : COR.roxo }; }
    if (d < bat || (+d === +bat)) return { txt: +d === +bat ? 'Batismo do Senhor' : `${DIAS[dow]} do Tempo do Natal`, tempo: 'Tempo do Natal', cor: COR.branco };
    if (d >= cinzas && d < ramos) {
      if (+d === +cinzas) return { txt: 'Quarta-feira de Cinzas', tempo: 'Quaresma', cor: COR.roxo };
      const n = Math.floor((d - addD(cinzas, 4)) / 864e5 / 7) + 1;
      return { txt: d < addD(cinzas, 4) ? `${DIAS[dow]} depois das Cinzas` : dow ? sem(n).replace('Semana', 'Semana da Quaresma') : `${ord(n)} Domingo da Quaresma`, tempo: 'Quaresma', cor: n === 4 && !dow ? COR.rosa : COR.roxo };
    }
    if (d >= ramos && d < P) { const t = ['Domingo de Ramos', 'Segunda-feira Santa', 'Terça-feira Santa', 'Quarta-feira Santa', 'Quinta-feira Santa', 'Sexta-feira da Paixão', 'Sábado Santo'][dow]; return { txt: t, tempo: 'Semana Santa', cor: dow === 0 || dow === 5 ? COR.vermelho : COR.roxo }; }
    if (d >= P && d <= pent) {
      if (+d === +pent) return { txt: 'Domingo de Pentecostes', tempo: 'Tempo Pascal', cor: COR.vermelho };
      const n = Math.floor((d - P) / 864e5 / 7) + 1;
      return { txt: +d === +P ? 'Domingo da Páscoa' : dow ? sem(n).replace('Semana', 'Semana da Páscoa') : `${ord(n)} Domingo da Páscoa`, tempo: 'Tempo Pascal', cor: COR.branco };
    }
    // Tempo Comum
    let n;
    if (d < cinzas) n = Math.floor((d - bat) / 864e5 / 7) + 1;
    else n = 34 - Math.round((adv - addD(dom, 7)) / 864e5 / 7);
    if (!dow && n === 34) return { txt: 'Nosso Senhor Jesus Cristo, Rei do Universo', tempo: 'Tempo Comum', cor: COR.branco };
    return { txt: dow ? sem(n) + ' do Tempo Comum' : `${ord(n)} Domingo do Tempo Comum`, tempo: 'Tempo Comum', cor: COR.verde };
  }

  /* ---------- Horários e próxima missa ---------- */
  const MISSAS = { 0: ['08:00', '11:00', '17:30'], 1: ['12:00'], 2: ['12:00'], 3: ['12:00'], 4: ['12:00'], 5: ['12:00'], 6: [] };
  const hm = s => s.replace(':00', 'h').replace(':', 'h');
  function proxima(n) {
    for (let k = 0; k < 8; k++) {
      const d = addD(dia0(n), k);
      for (const h of MISSAS[d.getDay()]) {
        const [H, M] = h.split(':').map(Number), t = new Date(d.getFullYear(), d.getMonth(), d.getDate(), H, M);
        if (t > n) return { t, k, h, dow: d.getDay() };
      }
    }
  }
  function fala(p, n) {
    const quando = p.k === 0 ? 'hoje' : p.k === 1 ? 'amanhã' : DIAS[p.dow].toLowerCase().replace('-feira', '');
    const min = Math.round((p.t - n) / 6e4);
    const falta = p.k === 0 && min < 180 ? (min < 60 ? ` · em ${min} min` : ` · em ${Math.floor(min / 60)}h${String(min % 60).padStart(2, '0')}`) : '';
    return `${quando}, às ${hm(p.h)}${falta}`;
  }
  const now = agora(), L = liturgia(now), P = proxima(now);
  $$('[data-liturgia]').forEach(el => el.textContent = L.txt);
  $$('[data-tempo]').forEach(el => el.textContent = L.tempo);
  $$('[data-cor]').forEach(el => el.style.setProperty('--lc', L.cor));
  $$('[data-proxima]').forEach(el => el.textContent = fala(P, now));
  $$('[data-hoje]').forEach(el => el.textContent = DIAS[now.getDay()]);
  const hojeMissas = MISSAS[now.getDay()];
  $$('[data-hoje-missas]').forEach(el => el.textContent = hojeMissas.length ? 'Missa ' + (hojeMissas.length > 1 ? 'às ' + hojeMissas.map(hm).join(', ').replace(/, ([^,]*)$/, ' e $1') : 'às ' + hm(hojeMissas[0])) : 'Sem missa hoje · confissões das 9h às 12h');
  const key = now.getDay() === 0 ? 'domingo' : now.getDay() === 6 ? 'sabado' : 'semana';
  const row = $(`.day[data-day="${key}"]`); if (row) row.classList.add('is-today');

  /* ---------- Cabeçalho, menu, barra do celular ---------- */
  const mbar = $('.mbar');
  const onScroll = () => { mbar && mbar.classList.toggle('show', scrollY > innerHeight * .6); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const burger = $('.burger'), menu = $('.menu');
  if (burger && menu) {
    const top = () => document.documentElement.style.setProperty('--menu-top', $('.site-header').getBoundingClientRect().bottom + 'px');
    burger.addEventListener('click', () => { top(); const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); document.body.style.overflow = o ? 'hidden' : ''; });
    $$('a', menu).forEach(a => a.addEventListener('click', () => { menu.classList.remove('open'); burger.setAttribute('aria-expanded', false); document.body.style.overflow = ''; }));
  }

  /* ---------- Revelação suave ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- Vídeos que tocam só quando visíveis ---------- */
  const vio = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { if (v.dataset.src && !v.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause(); }), { threshold: .2 });
  $$('video[data-inview]').forEach(v => {
    if (v.dataset.srcMobile && innerWidth < 760) v.dataset.src = v.dataset.srcMobile;
    if (reduce) { v.removeAttribute('autoplay'); if (v.dataset.src) v.src = v.dataset.src; return; }
    vio.observe(v);
  });

  /* ---------- Players com botão ---------- */
  $$('.player').forEach(p => { const v = $('video', p), b = $('.play', p); b && b.addEventListener('click', () => { p.classList.add('playing'); v.controls = true; v.play(); }); });
  // YouTube leve: só carrega o player quando a pessoa clica (privacidade e velocidade)
  $$('.yt[data-id]').forEach(b => b.addEventListener('click', () => {
    const f = document.createElement('iframe');
    f.src = `https://www.youtube-nocookie.com/embed/${b.dataset.id}?autoplay=1&rel=0`;
    f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'; f.allowFullscreen = true; f.title = b.getAttribute('aria-label') || 'Homilia';
    b.replaceChildren(f);
  }, { once: true }));

  /* ---------- Voo pela Matriz: a rolagem conduz o drone ---------- */
  const fly = $('.fly');
  if (fly) {
    const canvas = $('canvas', fly), ctx = canvas.getContext('2d');
    const N = +fly.dataset.frames, base = innerWidth < 760 ? fly.dataset.srcMobile : fly.dataset.src;
    const frames = new Array(N), steps = $$('.fly-step', fly), marks = $$('.fly-meter span', fly), load = $('.fly-load', fly);
    let cur = -1, loaded = 0, started = false;
    const pad = n => String(n).padStart(3, '0');
    const size = () => { const r = Math.min(devicePixelRatio || 1, 2); canvas.width = canvas.clientWidth * r; canvas.height = canvas.clientHeight * r; ctx.imageSmoothingQuality = 'high'; cur = -1; draw(); };
    const nearest = i => { for (let d = 0; d < N; d++) { if (frames[i - d]?.complete && frames[i - d].naturalWidth) return frames[i - d]; if (frames[i + d]?.complete && frames[i + d].naturalWidth) return frames[i + d]; } return null; };
    const paint = img => { if (!img) return; const cw = canvas.width, ch = canvas.height, s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight), w = img.naturalWidth * s, h = img.naturalHeight * s; ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h); };
    const prog = () => { const r = fly.getBoundingClientRect(); return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight))); };
    function draw() {
      const p = prog(), i = Math.min(N - 1, Math.round(p * (N - 1)));
      if (i !== cur) { cur = i; paint(nearest(i)); }
      const k = Math.min(steps.length - 1, Math.floor(p * steps.length));
      steps.forEach((s, j) => s.classList.toggle('on', j === k));
      marks.forEach((m, j) => m.classList.toggle('on', j === k));
    }
    const start = () => {
      if (started) return; started = true;
      const order = []; for (const st of [12, 6, 3, 1]) for (let i = 0; i < N; i += st) if (!order.includes(i)) order.push(i);
      let q = 0;
      const next = () => {
        if (q >= order.length) return;
        const i = order[q++], img = new Image(); img.decoding = 'async';
        img.onload = img.onerror = () => { loaded++; if (load) load.textContent = loaded < N ? `Carregando o voo · ${Math.round(loaded / N * 100)}%` : ''; if (Math.abs(i - cur) < 8 || loaded < 3) { cur = -1; draw(); } next(); };
        img.src = `${base}f${pad(i + 1)}.webp`; frames[i] = img;
      };
      for (let c = 0; c < 6; c++) next();
    };
    new IntersectionObserver(es => es.forEach(e => e.isIntersecting && start()), { rootMargin: '200% 0px' }).observe(fly);
    addEventListener('scroll', () => requestAnimationFrame(draw), { passive: true });
    addEventListener('resize', size); size();
  }

  /* ---------- Pedido de oração: monta a mensagem e abre o WhatsApp ---------- */
  const pedido = $('#pedido');
  if (pedido) pedido.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(pedido), texto = (f.get('texto') || '').trim(), nome = (f.get('nome') || '').trim();
    if (!texto) return;
    const abre = f.get('tipo') === 'missa' ? 'Olá! Quero marcar uma intenção de missa na Matriz de São José.' : 'Olá! Tenho um pedido de oração para a Matriz de São José.';
    window.open('https://wa.me/558132245801?text=' + encodeURIComponent(abre + '\n\n' + texto + (nome ? '\n\n' + nome : '')), '_blank', 'noopener');
  });
  $$('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); b.textContent = 'Endereço copiado'; }
    catch { b.textContent = b.dataset.copy; }
  }));

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
})();

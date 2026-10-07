(function () {
  const $app = document.getElementById('app');
  const KEY = 'mathnovel.v1';
  const EXTS = ['png', 'webp', 'jpg', 'jpeg', 'gif'];
  const MOODS = ['neutral', 'happy', 'think'];
  const LEVEL_XP = 150;
  const RANKS = ['Первокурсник', 'Второкурсник', 'Третьекурсник', 'Четверокурсник', 'Бакалавр', 'Магистрант', 'Магистр', 'Аспирант', 'Кандидат наук', 'Доцент', 'Доктор наук', 'Профессор', 'Академик'];
  const PASS = 70;
  const TEACHER = {
    mira: { name: 'Мирой', bg: 'classroom_day', resume: 'С возвращением! В прошлый раз мы остановились на середине урока.', end: 'Урок окончен! Теперь практика и тест: без них знания не закрепятся.', hero: 'Привет, {name}! Я Мира.', intro: 'Полный курс: логика и функции, комплексные числа, линейная алгебра, матан, вероятность, дискретка, алгоритмы и мост к квантовым вычислениям. В каждом модуле урок-новелла, ДЗ с автопроверкой, тест, конспект и подборка лучших материалов.', title: 'Математика для квантового инженера' },
    vega: { name: 'Вегой', bg: 'phys_lab', resume: 'О, вернулся! Мы остановились на середине. Продолжим с того места?', end: 'Урок окончен! Дальше практика и тест: формулу надо проверить руками, иначе это не физика.', hero: 'Привет, {name}! Я Вега.', intro: 'Физика с самого начала и до квантового компьютера: измерения, механика, волны, поля, свет, тепло, относительность, кванты, спин, запутанность и декогеренция. В каждом модуле урок с опытами, ДЗ с автопроверкой, тест, конспект, материалы и интерактивная «Лаборатория».', title: 'Физика для квантового инженера' }
  };
  const BOARD_SAY_VEGA = [
    'Смотри на доску, но не верь ей на слово: каждую формулу здесь можно проверить опытом.',
    'Перепиши формулу и рядом подпиши, в каких единицах каждая буква. Единицы ловят половину ошибок.',
    'Прикинь порядок величины до того, как считать точно. Если ответ отличается в тысячу раз, где-то потерян множитель.',
    'Если символ непонятен, его расшифровка есть прямо на доске. Не пропускай.',
    'Это место стоит повторить руками: перерисуй схему и подпиши силы или поля.',
    'Назад кнопкой ◀ возвращаться не стыдно. Стыдно делать вид, что понял.',
    'Запомни идею и эксперимент, который её доказал. Формула придёт следом.'
  ];
  const BOARD_SAY = [
    'Смотри на доску и не торопись. Формулы лучше переписать от руки.',
    'Прочитай каждую строчку. Если какой-то символ непонятен, найди его расшифровку прямо на доске.',
    'Это важное место. Перепиши себе в тетрадь хотя бы главную формулу.',
    'Попробуй сначала сам предсказать следующую строчку выкладки, а потом сверься.',
    'Не спеши жать «дальше». Пример на доске стоит повторить руками.',
    'Если что-то не сходится, вернись на шаг назад кнопкой ◀. Это нормально.',
    'Запомни идею, а не только формулу: зачем мы это делаем и что получаем.'
  ];

  let S = load();
  function load() {
    const base = { name: 'Карим', xp: 0, mods: {}, exams: {}, last: null };
    let o = base;
    try { o = Object.assign(base, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { o = base; }
    const st = o.story = o.story || {};
    ['aff', 'flags', 'picks', 'seen', 'pos'].forEach(k => { st[k] = st[k] || {}; });
    if (st.free === undefined) st.free = false;
    return o;
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
  function ms(id) {
    const s = S.mods[id] || (S.mods[id] = {});
    s.tasks = s.tasks || {}; s.choices = s.choices || {};
    if (s.story === undefined) s.story = false;
    if (s.test === undefined) s.test = null;
    return s;
  }
  function addXp(n, why) { S.xp += n; save(); toast('+' + n + ' XP' + (why ? ' · ' + why : '')); }
  function toast(t) {
    const d = document.createElement('div'); d.className = 'toast'; d.textContent = t;
    document.body.appendChild(d); setTimeout(() => d.remove(), 1800);
  }
  function trust(who, n) {
    const c = window.WORLD && WORLD.CH[who];
    const d = document.createElement('div'); d.className = 'toast trust';
    d.style.background = c ? c.color : '#f472b6';
    d.textContent = (c ? c.name : who) + ': доверие ' + (n > 0 ? '+' : '') + n + ' ♥';
    document.body.appendChild(d); setTimeout(() => d.remove(), 2200);
  }
  window.CORE = { S: () => S, app: $app, save, esc: s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])), math: r => math(r), xp: addXp, trust, go: h => { location.hash = h; } };

  function level() {
    const lvl = Math.floor(S.xp / LEVEL_XP) + 1;
    return { lvl, rank: RANKS[Math.min(Math.floor((lvl - 1) / 2), RANKS.length - 1)], pct: Math.round(100 * (S.xp % LEVEL_XP) / LEVEL_XP) };
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function strip(html) { return String(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); }
  function math(root) {
    if (!window.renderMathInElement) return;
    try {
      renderMathInElement(root, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false }
        ], throwOnError: false
      });
    } catch (e) {}
  }
  function trackOf(id) { return id && id[0] === 'p' ? 'phys' : 'math'; }
  function blocksOf(track) { return track === 'phys' ? (window.PHYSICS || []) : CURRICULUM; }
  function blocks() { return CURRICULUM.concat(window.PHYSICS || []); }
  function live(track) { return blocks().flatMap(b => b.modules.map(x => x[0])).filter(id => !track || trackOf(id) === track).map(id => COURSE.modules[id]).filter(m => m && !m.stub); }
  function titleOf(id) { const x = blocks().flatMap(b => b.modules).find(x => x[0] === id); return x ? x[1] : id; }
  function teacherOf(m) { return (m && m.teacher) || (m && trackOf(m.id) === 'phys' ? 'vega' : 'mira'); }
  function courseHash(track) { return track === 'phys' ? '#/course/phys' : '#/course'; }

  const spriteCache = {};
  function fallbackSvg() {
    return '<svg viewBox="0 0 200 300" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M30 300c0-70 30-95 70-95s70 25 70 95z" fill="#2b3a6b"/><rect x="88" y="165" width="24" height="40" fill="#f1c7a6"/>' +
      '<ellipse cx="100" cy="115" rx="48" ry="56" fill="#f1c7a6"/><path d="M50 118c-8-70 40-90 70-72 30 8 40 40 30 72-6-30-20-48-52-48-30 0-44 20-48 48z" fill="#2a1a1a"/>' +
      '<path d="M52 110c-10 60 4 90 12 96-6-30-2-60 6-86zM148 110c10 60-4 90-12 96 6-30 2-60-6-86z" fill="#2a1a1a"/>' +
      '<g fill="none" stroke="#222" stroke-width="4"><circle cx="80" cy="118" r="15"/><circle cx="120" cy="118" r="15"/><path d="M95 118h10"/></g>' +
      '<circle cx="80" cy="118" r="5" fill="#3a2a2a"/><circle cx="120" cy="118" r="5" fill="#3a2a2a"/><path d="M88 148q12 9 24 0" stroke="#a5424f" stroke-width="3" fill="none"/></svg>';
  }
  function resolveSprite(mood, cb) {
    if (spriteCache[mood] !== undefined) return cb(spriteCache[mood]);
    const cfg = window.SPRITES || {};
    if (cfg[mood]) { spriteCache[mood] = cfg[mood]; return cb(cfg[mood]); }
    const list = EXTS.map(e => 'assets/mira_' + mood + '.' + e);
    let i = 0;
    (function next() {
      if (i >= list.length) {
        if (mood !== 'neutral') return resolveSprite('neutral', u => { spriteCache[mood] = u; cb(u); });
        spriteCache[mood] = null; return cb(null);
      }
      const im = new Image(); const u = list[i++];
      im.onload = () => { spriteCache[mood] = u; cb(u); };
      im.onerror = next; im.src = u;
    })();
  }
  function putSprite(box, mood) {
    resolveSprite(mood, u => {
      if (!u) { box.innerHTML = fallbackSvg(); return; }
      box.innerHTML = /\.(webm|mp4|mov)$/i.test(u)
        ? '<video src="' + u + '" autoplay loop muted playsinline></video>'
        : '<img src="' + u + '" alt="Мира">';
    });
  }

  function go(h) { location.hash = h; }
  function route() {
    document.onkeydown = null;
    const p = (location.hash || '#/').slice(2).split('/');
    window.scrollTo(0, 0);
    if (p[0] === 'm' && p[1]) {
      if (p[2] === 'story') return story(p[1]);
      return moduleView(p[1], p[2] || 'overview', p[3]);
    }
    if (p[0] === 'exam' && p[1]) return examView(p[1]);
    if (p[0] === 'course') return courseHome(p[1] === 'phys' ? 'phys' : 'math');
    if (p[0] === 'day' && p[1] !== undefined) return dayView(Number(p[1]));
    if (p[0] === 'ch' && p[1]) return chapterView(p[1]);
    if (p[0] === 'club') return clubView();
    school();
  }

  function modProgress(id) {
    const m = COURSE.modules[id], s = S.mods[id];
    const hwN = m && m.homework ? m.homework.length : 0;
    if (!m || m.stub || !s) return { story: false, hw: 0, hwN, test: null };
    return { story: s.story, hw: Object.values(s.tasks || {}).filter(Boolean).length, hwN, test: s.test };
  }

  function courseHome(track) {
    track = track || 'math';
    const BL = blocksOf(track), teacher = track === 'phys' ? 'vega' : 'mira', T = TEACHER[teacher];
    let total = 0, done = 0;
    BL.forEach(b => b.modules.forEach(([id]) => { total++; const s = S.mods[id]; if (s && s.test && s.test.pass) done++; }));
    const L = level();
    const lastM = S.last && COURSE.modules[S.last] && !COURSE.modules[S.last].stub && trackOf(S.last) === track ? COURSE.modules[S.last] : null;
    const first = BL[0].modules[0][0];
    let h = '<div class="wrap">' + nav(track === 'phys' ? 'course/phys' : 'course') + '<div class="top"><h1>' + T.title + '</h1>' +
      '<div class="xp" title="' + S.xp + ' XP"><b>' + L.rank + '</b> · ур. ' + L.lvl + '<div class="bar"><i style="width:' + L.pct + '%"></i></div>' + S.xp + ' XP</div></div>' +
      '<div class="hero"><div id="heroImg"></div><div style="flex:1"><h2 style="margin:0">' + esc(T.hero.replace('{name}', S.name)) + '</h2>' +
      '<p>' + T.intro + '</p>' +
      '<p>Зачтено модулей: <b>' + done + ' / ' + total + '</b> · <span class="howto">Имя: <input id="nm" class="inp sm" value="' + esc(S.name) + '"></span></p>' +
      '<div class="row">' + (lastM ? '<button class="btn" id="cont">▶ Продолжить: ' + esc(lastM.title) + '</button>' : '<button class="btn" id="cont">▶ Начать с модуля ' + first.toUpperCase() + '</button>') +
      '<a class="btn ghost" href="' + courseHash(track === 'phys' ? 'math' : 'phys') + '">' + (track === 'phys' ? '∑ Курс математики (Мира)' : 'ψ Курс физики (Вега)') + '</a></div></div></div>' +
      '<div class="search"><input id="q" class="inp" placeholder="' + (track === 'phys' ? 'Поиск по конспектам физики: закон Ома, фотоэффект, декогеренция…' : 'Поиск по конспектам всех модулей: собственные значения, Байес, Дейкстра…') + '" autocomplete="off"><div id="qr"></div></div>';
    BL.forEach(b => {
      const liveN = b.modules.filter(([id]) => COURSE.modules[id] && !COURSE.modules[id].stub && (COURSE.modules[id].test || []).length).length;
      const ex = S.exams[b.id];
      h += '<div class="block" style="--c:' + b.color + '"><h2>' + esc(b.title) +
        (b.modules.length > 1 && liveN ? '<button class="btn ghost sm exam" data-b="' + b.id + '">Экзамен блока' + (ex ? ' · ' + ex.pct + '%' + (ex.pass ? ' ✓' : '') : '') + '</button>' : '') + '</h2><div class="grid">';
      b.modules.forEach(([id, title]) => {
        const m = COURSE.modules[id], stub = !m || m.stub, p = modProgress(id);
        h += '<div class="mod' + (stub ? ' stub' : '') + '" style="--c:' + b.color + '" data-id="' + id + '"><div class="n">' + id.toUpperCase() + (m && m.duration ? ' · ' + esc(m.duration) : '') + '</div><div class="t">' + esc(stub ? title : m.title) + '</div><div class="st">' +
          (stub ? '<span class="chip">скоро</span>' :
            '<span class="chip' + (p.story ? ' on' : '') + '">урок</span><span class="chip' + (p.hwN && p.hw === p.hwN ? ' on' : '') + '">ДЗ ' + p.hw + '/' + p.hwN + '</span><span class="chip' + (p.test && p.test.pass ? ' on' : '') + '">тест' + (p.test ? ' ' + p.test.pct + '%' : '') + '</span>') + '</div></div>';
      });
      h += '</div></div>';
    });
    const finId = track === 'phys' ? 'allp' : 'all', fin = S.exams[finId];
    h += '<div class="panel" style="margin-top:28px;display:flex;gap:14px;align-items:center;flex-wrap:wrap"><div style="flex:1"><b>Итоговый экзамен' + (track === 'phys' ? ' по физике' : ' по математике') + '</b><div class="howto">30 случайных вопросов из всех модулей курса. Зачёт от ' + PASS + '%.</div></div><button class="btn" id="final">Сдать' + (fin ? ' · лучший ' + fin.pct + '%' : '') + '</button></div>';
    h += '<p class="howto" style="margin-top:24px">Картинки и фоны: <code>assets/</code>, промпты в <code>ASSETS.md</code> и <code>PROMPTS.md</code>. Прогресс хранится в этом браузере. <a href="#" id="reset">Сбросить прогресс</a></p></div>';
    $app.innerHTML = h;
    WORLD.putChar(document.getElementById('heroImg'), teacher, 'neutral');
    document.getElementById('nm').onchange = e => { S.name = e.target.value.trim() || 'Карим'; save(); courseHome(track); };
    document.getElementById('cont').onclick = () => go(lastM ? '#/m/' + lastM.id : '#/m/' + first);
    document.getElementById('final').onclick = () => go('#/exam/' + finId);
    document.getElementById('reset').onclick = e => {
      e.preventDefault();
      const a = e.target;
      if (a.dataset.armed) { localStorage.removeItem(KEY); S = load(); courseHome(track); return; }
      a.dataset.armed = '1'; a.textContent = 'Точно сбросить? Нажми ещё раз';
    };
    $app.querySelectorAll('.mod').forEach(el => el.onclick = () => go('#/m/' + el.dataset.id));
    $app.querySelectorAll('.exam').forEach(el => el.onclick = e => { e.stopPropagation(); go('#/exam/' + el.dataset.b); });
    const q = document.getElementById('q'), qr = document.getElementById('qr');
    q.oninput = () => {
      const s = q.value.trim().toLowerCase();
      if (s.length < 3) { qr.innerHTML = ''; return; }
      const res = [];
      live(track).forEach(m => (m.story || []).forEach((b, k) => {
        if (!b.board) return;
        const txt = strip(b.board + ' ' + (b.html || '')).toLowerCase();
        const at = txt.indexOf(s);
        if (at >= 0) res.push({ m, k, title: b.board, snip: txt.slice(Math.max(0, at - 50), at + 90) });
      }));
      qr.innerHTML = res.length ? res.slice(0, 40).map(r => '<a href="#/m/' + r.m.id + '/notes/' + r.k + '"><b>' + r.m.id.toUpperCase() + ' · ' + esc(strip(r.title)) + '</b><small>…' + esc(r.snip) + '…</small></a>').join('') : '<div class="howto">Ничего не нашлось.</div>';
    };
  }

  function moduleView(id, tab, arg) {
    const m = COURSE.modules[id];
    const track = trackOf(id), home = courseHash(track);
    if (!m || m.stub) {
      $app.innerHTML = '<div class="wrap"><p><a href="' + home + '">← К карте курса</a></p><div class="panel"><h3>' + esc(titleOf(id)) + '</h3><p>Этот модуль ещё не написан.</p></div></div>'; return;
    }
    S.last = id; save();
    const teacher = teacherOf(m), T = TEACHER[teacher] || TEACHER.mira;
    const ids = live(track).map(x => x.id), at = ids.indexOf(id);
    const prev = at > 0 ? ids[at - 1] : null, nextId = at >= 0 && at < ids.length - 1 ? ids[at + 1] : null;
    const tabs = [['overview', 'Обзор'], ['notes', 'Конспект'], ['practice', 'Практика (' + (m.homework || []).length + ')'], ['test', 'Тест'], ['links', 'Материалы']];
    if (m.lab && m.lab.length) tabs.push(['lab', '🔬 Лаборатория (' + m.lab.length + ')']);
    let h = '<div class="wrap"><div class="row" style="justify-content:space-between"><a href="' + home + '">← К карте курса</a><span>' +
      (prev ? '<a href="#/m/' + prev + '">‹ ' + prev.toUpperCase() + '</a>' : '') + (nextId ? ' &nbsp; <a href="#/m/' + nextId + '">' + nextId.toUpperCase() + ' ›</a>' : '') + '</span></div>' +
      '<h1 style="margin:.3em 0 .1em">' + esc(m.title) + '</h1><div class="howto">' + esc(m.block || '') + ' · ' + esc(m.duration || '') + '</div>' +
      '<div class="tabs"><button class="btn" id="play">▶ Урок с ' + T.name + '</button>' +
      tabs.map(t => '<button class="tab' + (t[0] === tab ? ' on' : '') + '" data-t="' + t[0] + '">' + t[1] + '</button>').join('') + '</div><div id="tabBody"></div></div>';
    $app.innerHTML = h;
    $app.querySelector('#play').onclick = () => go('#/m/' + id + '/story');
    $app.querySelectorAll('.tab').forEach(b => b.onclick = () => go('#/m/' + id + '/' + b.dataset.t));
    const body = $app.querySelector('#tabBody');
    if (tab === 'practice') practice(m, body);
    else if (tab === 'test') testView(m, body);
    else if (tab === 'links') linksView(m, body);
    else if (tab === 'notes') notesView(m, body);
    else if (tab === 'lab') labView(m, body, arg);
    else overview(m, body, T);
    math(body);
    if (tab === 'notes' && arg != null) { const t = document.getElementById('b' + arg); if (t) { t.scrollIntoView({ block: 'start' }); t.classList.add('flash'); } }
  }

  function overview(m, body, T) {
    const p = modProgress(m.id);
    body.innerHTML = '<div class="panel"><h3>О чём модуль</h3>' + (m.summary || '') + '</div>' +
      (m.goals ? '<div class="panel"><h3>После модуля ты сможешь</h3><ul>' + m.goals.map(g => '<li>' + g + '</li>').join('') + '</ul></div>' : '') +
      (m.cheat ? '<div class="panel"><h3>Шпаргалка</h3>' + m.cheat + '</div>' : '') +
      '<div class="panel"><b>Порядок:</b> урок с ' + (T || TEACHER.mira).name + ' → практика → тест (зачёт от ' + PASS + '%) → материалы для углубления. Конспект — все доски урока на одной странице для повторения.<br>Статус: урок ' + (p.story ? '✓' : '—') + ' · ДЗ ' + p.hw + '/' + p.hwN + ' · тест ' + (p.test ? p.test.pct + '%' : '—') + '</div>';
  }

  function notesView(m, body) {
    const boards = (m.story || []).map((b, k) => [b, k]).filter(x => x[0].board);
    body.innerHTML = '<div class="panel"><b>Конспект урока</b> — ' + boards.length + ' досок. Удобно повторять перед тестом. Содержание: ' +
      boards.map(([b, k], n) => '<a href="#/m/' + m.id + '/notes/' + k + '">' + (n + 1) + '. ' + esc(strip(b.board)) + '</a>').join(' · ') + '</div>' +
      boards.map(([b, k], n) => '<div class="panel notes" id="b' + k + '"><h3>' + (n + 1) + '. ' + b.board + '</h3>' + (b.html || '') + '</div>').join('') +
      (m.cheat ? '<div class="panel notes"><h3>Шпаргалка</h3>' + m.cheat + '</div>' : '');
  }

  function labView(m, body, arg) {
    const L = m.lab || [];
    if (!L.length) { body.innerHTML = '<div class="panel">У этого модуля нет интерактивной лаборатории. Демо из «Квантовой лаборатории» подключены к модулям P05 и P07–P16.</div>'; return; }
    const k = Math.max(0, Math.min(L.length - 1, parseInt(arg, 10) || 0)), cur = L[k];
    const url = (window.LAB_URL || '../quantum-lab/index.html') + '#/' + cur.id;
    body.innerHTML = '<div class="panel"><b>Интерактивная лаборатория.</b> Численные модели из проекта «Квантовая лаборатория»: покрути ползунки, выполни задание, ответь на вопросы. Открывается прямо здесь; если окно пустое, открой демо в новой вкладке (папка <code>quantum-lab</code> должна лежать рядом с папкой игры).</div>' +
      '<div class="tabs labbtns">' + L.map((x, i) => '<button class="tab' + (i === k ? ' on' : '') + '" data-k="' + i + '">' + esc(x.title) + '</button>').join('') + '</div>' +
      '<div class="panel" style="padding:10px"><div class="row" style="justify-content:space-between;margin-bottom:8px"><b>' + esc(cur.title) + '</b>' + (cur.note ? '<span class="howto">' + esc(cur.note) + '</span>' : '') + '<a class="btn ghost sm" href="' + esc(url) + '" target="_blank" rel="noopener">Открыть в новой вкладке ↗</a></div>' +
      '<iframe class="labframe" src="' + esc(url) + '" title="' + esc(cur.title) + '"></iframe></div>';
    body.querySelectorAll('.labbtns .tab').forEach(b => b.onclick = () => go('#/m/' + m.id + '/lab/' + b.dataset.k));
  }

  function linksView(m, body) {
    body.innerHTML = '<div class="panel links"><h3>Материалы из интернета</h3>' + (m.links || []).map(l =>
      '<a href="' + esc(l.url) + '" target="_blank" rel="noopener"><span class="kind">' + esc(l.kind || 'ссылка') + '</span><b>' + esc(l.title) + '</b>' + (l.note ? '<small>' + esc(l.note) + '</small>' : '') + '</a>').join('') + '</div>';
  }

  function evalExpr(src) {
    const s = String(src).toLowerCase().replace(/−|–/g, '-').replace(/×|·/g, '*').replace(/÷|:/g, '/').replace(/\s+/g, '').replace(/(\d),(\d)/g, '$1.$2');
    let i = 0;
    const F = { sqrt: Math.sqrt, '√': Math.sqrt, ln: Math.log, lg: Math.log10, log: Math.log10, log2: Math.log2, sin: Math.sin, cos: Math.cos, tan: Math.tan, tg: Math.tan, exp: Math.exp, abs: Math.abs };
    const names = Object.keys(F).sort((a, b) => b.length - a.length);
    function peek() { return s[i]; }
    function expr() { let v = term(); while (peek() === '+' || peek() === '-') { const o = s[i++]; const r = term(); v = o === '+' ? v + r : v - r; } return v; }
    function startsPrimary() { const c = peek(); return c !== undefined && (/[0-9.(√πe]/.test(c) || names.some(n => s.startsWith(n, i)) || s.startsWith('pi', i)); }
    function term() {
      let v = power();
      for (;;) {
        if (peek() === '*') { i++; v *= power(); }
        else if (peek() === '/') { i++; v /= power(); }
        else if (startsPrimary()) v *= power();
        else return v;
      }
    }
    function power() { const b = unary(); if (peek() === '^') { i++; return Math.pow(b, power()); } return b; }
    function unary() { if (peek() === '-') { i++; return -unary(); } if (peek() === '+') { i++; return unary(); } return primary(); }
    function primary() {
      const c = peek();
      if (c === '(') { i++; const v = expr(); if (s[i++] !== ')') throw 0; return v; }
      const num = s.slice(i).match(/^(\d+\.?\d*|\.\d+)(e-?\d+)?/);
      if (num) { i += num[0].length; return parseFloat(num[0]); }
      if (s.startsWith('pi', i)) { i += 2; return Math.PI; }
      if (c === 'π') { i++; return Math.PI; }
      for (const n of names) if (s.startsWith(n, i)) { i += n.length; return F[n](power()); }
      if (c === 'e') { i++; return Math.E; }
      throw 0;
    }
    try { const v = expr(); if (i !== s.length) return NaN; return v; } catch (e) { return NaN; }
  }
  function decimals(src) { const m = String(src).trim().replace(/−|–/g, '-').match(/^-?\d+[.,](\d+)$/); return m ? m[1].length : 0; }
  function normText(s) { return String(s).toLowerCase().replace(/−|–/g, '-').replace(/[\s·*]/g, '').replace(/⁄/g, '/'); }
  function checkTask(t, val) {
    if (t.type === 'choice') return Number(val) === t.answer;
    if (t.type === 'num') {
      const v = evalExpr(val); if (!isFinite(v)) return false;
      const tol = t.tol == null ? 1e-6 : t.tol, k = decimals(val);
      return [].concat(t.answer).some(a => Math.abs(v - a) <= tol * (t.tol == null ? Math.max(1, Math.abs(a)) : Math.abs(a)) || (k >= 2 && Math.abs(v - a) <= 0.5 * Math.pow(10, -k) * (1 + 1e-9)));
    }
    const v = normText(val); return [].concat(t.answer).some(a => normText(a) === v);
  }

  function practice(m, body) {
    const st = ms(m.id), H = m.homework || [];
    const solved = () => H.filter(t => st.tasks[t.id]).length;
    body.innerHTML = '<div class="panel" id="hwSum"></div>' + H.map((t, i) => {
      const done = st.tasks[t.id];
      let inp;
      if (t.type === 'choice') inp = t.opts.map((o, k) => '<label class="opt"><input type="radio" name="r' + i + '" value="' + k + '">' + o + '</label>').join('');
      else inp = '<input class="inp" type="text" placeholder="' + (t.type === 'num' ? 'число, 3/4 или sqrt(2)/2' : 'ответ') + '" autocomplete="off">';
      return '<div class="panel task' + (done ? ' solved' : '') + '" data-i="' + i + '"><div class="q"><b>Задача ' + (i + 1) + '.</b> ' + t.q + '</div>' + inp +
        '<div class="row" style="margin-top:8px"><button class="btn sm chk">Проверить</button>' + (t.hint ? '<button class="btn ghost sm hnt">Подсказка</button>' : '') + '</div>' +
        '<div class="fb">' + (done ? '<span class="ok">✓ решено</span>' : '') + '</div>' +
        '<details class="sol"><summary>Показать решение</summary>' + (t.sol || '') + '</details></div>';
    }).join('');
    const sum = () => { body.querySelector('#hwSum').innerHTML = 'Решено <b>' + solved() + ' / ' + H.length + '</b>. Сначала думай сам, потом подсказка, решение — в крайнем случае. Приближённые ответы принимаются с 2+ знаками после запятой.'; };
    sum();
    body.querySelectorAll('.task').forEach(el => {
      const t = H[el.dataset.i], fb = el.querySelector('.fb');
      const run = () => {
        let val;
        if (t.type === 'choice') { const r = el.querySelector('input:checked'); if (!r) return; val = r.value; }
        else { val = el.querySelector('input[type=text]').value; if (!String(val).trim()) return; }
        if (checkTask(t, val)) {
          fb.innerHTML = '<span class="ok">✓ Верно!</span>'; el.classList.add('solved');
          if (!st.tasks[t.id]) { st.tasks[t.id] = true; addXp(t.xp || 10, 'задача'); sum(); }
        } else fb.innerHTML = '<span class="bad">✗ Не то. Попробуй ещё или открой подсказку.</span>';
        save();
      };
      el.querySelector('.chk').onclick = run;
      const inp = el.querySelector('input[type=text]'); if (inp) inp.onkeydown = e => { if (e.key === 'Enter') run(); };
      const hb = el.querySelector('.hnt'); if (hb) hb.onclick = () => { fb.innerHTML = '<span style="color:var(--gold)">💡 ' + t.hint + '</span>'; math(fb); };
    });
  }

  function renderQuiz(body, Q, intro, onDone) {
    body.innerHTML = '<div class="panel">' + intro + '</div>' +
      Q.map((q, i) => '<div class="panel" data-i="' + i + '">' + (q.src ? '<div class="howto">' + esc(q.src) + '</div>' : '') + '<b>' + (i + 1) + '.</b> ' + q.q + q.opts.map((o, k) =>
        '<label class="opt"><input type="radio" name="q' + i + '" value="' + k + '">' + o + '</label>').join('') + '<div class="why"></div></div>').join('') +
      '<div class="row"><button class="btn" id="fin">Завершить</button> <span id="res"></span></div>';
    math(body);
    body.querySelector('#fin').onclick = () => {
      let ok = 0;
      body.querySelectorAll('.panel[data-i]').forEach(el => {
        const q = Q[el.dataset.i], r = el.querySelector('input:checked');
        el.querySelectorAll('.opt').forEach((o, k) => { o.classList.remove('right', 'wrong'); if (k === q.correct) o.classList.add('right'); else if (r && Number(r.value) === k) o.classList.add('wrong'); });
        if (r && Number(r.value) === q.correct) ok++;
        el.querySelector('.why').innerHTML = q.why || '';
      });
      const pct = Math.round(100 * ok / Q.length), pass = pct >= PASS;
      body.querySelector('#res').innerHTML = '<b class="' + (pass ? 'ok' : 'bad') + '">' + ok + ' / ' + Q.length + ' (' + pct + '%) — ' + (pass ? 'зачёт!' : 'пока не зачёт, разбери ошибки и попробуй снова') + '</b>';
      math(body);
      onDone(pct, pass);
    };
  }

  function testView(m, body) {
    const st = ms(m.id), T = m.test || [];
    renderQuiz(body, T, 'Зачёт от ' + PASS + '%. ' + (st.test ? 'Лучший результат: <b>' + st.test.pct + '%</b>.' : 'После ответа на каждый вопрос появится разбор.'), (pct, pass) => {
      const was = st.test && st.test.pass;
      if (!st.test || pct > st.test.pct) st.test = { pct, pass: pass || !!was };
      else if (pass) st.test.pass = true;
      if (pass && !was) addXp(50, 'тест сдан');
      save();
    });
  }

  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function examView(bid) {
    const blk = blocks().find(b => b.id === bid), all = bid === 'all' || bid === 'allp';
    const ids = all ? blocksOf(bid === 'allp' ? 'phys' : 'math').flatMap(b => b.modules.map(x => x[0])) : blk ? blk.modules.map(x => x[0]) : [];
    const pool = [];
    ids.forEach(id => { const m = COURSE.modules[id]; if (m && !m.stub) (m.test || []).forEach(q => pool.push(Object.assign({ src: id.toUpperCase() + ' · ' + m.title }, q))); });
    const Q = shuffle(pool).slice(0, all ? 30 : 15);
    const name = all ? (bid === 'allp' ? 'Итоговый экзамен по физике' : 'Итоговый экзамен по математике') : 'Экзамен: ' + (blk ? blk.title : bid);
    const home = courseHash(bid === 'allp' || (blk && blk.modules[0] && trackOf(blk.modules[0][0]) === 'phys') ? 'phys' : 'math');
    $app.innerHTML = '<div class="wrap"><p><a href="' + home + '">← К карте курса</a></p><h1>' + esc(name) + '</h1><div id="tabBody"></div></div>';
    const body = $app.querySelector('#tabBody');
    if (!Q.length) { body.innerHTML = '<div class="panel">В этом блоке пока нет вопросов.</div>'; return; }
    const prevBest = S.exams[bid];
    renderQuiz(body, Q, Q.length + ' случайных вопросов из тестов ' + (all ? 'всех модулей' : 'модулей блока') + '. Каждая попытка — новый набор. Зачёт от ' + PASS + '%.' + (prevBest ? ' Лучший результат: <b>' + prevBest.pct + '%</b>.' : '') + ' <a href="#/exam/' + bid + '" id="again">Новый набор</a>', (pct, pass) => {
      const was = S.exams[bid] && S.exams[bid].pass;
      if (!S.exams[bid] || pct > S.exams[bid].pct) S.exams[bid] = { pct, pass: pass || !!was };
      else if (pass) S.exams[bid].pass = true;
      if (pass && !was) addXp(all ? 300 : 100, 'экзамен сдан');
      save();
    });
    body.querySelector('#again').onclick = e => { e.preventDefault(); examView(bid); window.scrollTo(0, 0); };
  }

  function dayOf(mod) { return DAYS.find(d => d.mod === mod || d.phys === mod); }
  function story(id) {
    const m = COURSE.modules[id]; if (!m || m.stub) return go('#/');
    S.last = id; save();
    const st = ms(id), day = dayOf(id), teacher = teacherOf(m), T = TEACHER[teacher] || TEACHER.mira;
    const SAY = teacher === 'vega' ? BOARD_SAY_VEGA : BOARD_SAY;
    const back = () => go(day ? '#/day/' + day.n : '#/m/' + id);
    NOVEL.play({
      title: m.title, beats: m.story || [], bg: m.bg || T.bg, speaker: teacher,
      store: st.choices, keyPrefix: '',
      getPos: () => st.pos, onPos: p => { st.pos = p === null ? 0 : p; save(); },
      boardSay: p => SAY[(parseInt(p, 10) || 0) % SAY.length],
      resumeSpeaker: teacher, resumeText: T.resume,
      onExit: back,
      onFinish: () => { if (!st.story) { st.story = true; addXp(20, 'урок пройден'); } save(); },
      endSpeaker: teacher, endMood: 'happy', endText: T.end,
      endButtons: [
        { label: 'Перейти к практике', fn: () => go('#/m/' + id + '/practice') },
        { label: 'Открыть конспект', fn: () => go('#/m/' + id + '/notes') },
        { label: day ? 'К расписанию дня' : 'К карте', fn: back },
        { label: 'Пройти урок заново', fn: () => { st.pos = 0; save(); story(id); } }
      ]
    });
  }

  function nav(active) {
    return '<div class="navbar">' + [['', 'Школа'], ['course', 'Математика'], ['course/phys', 'Физика'], ['club', 'Клуб']].map(t => '<a class="' + (t[0] === active ? 'on' : '') + '" href="#/' + t[0] + '">' + t[1] + '</a>').join('') + '</div>';
  }
  const pad2 = n => (n < 10 ? '0' : '') + n;
  function dayChapters(n) {
    return Object.values(STORY.chapters).filter(c => c.day === n).sort((a, b) => (a.part < b.part ? -1 : 1));
  }
  function chap(n, part) { return STORY.chapters['d' + pad2(n) + part]; }
  function dayState(n) {
    const d = DAYS[n], m = COURSE.modules[d.mod], st = S.mods[d.mod] || {};
    const pm = d.phys ? COURSE.modules[d.phys] : null, pst = (d.phys && S.mods[d.phys]) || {}, hasP = !!(pm && !pm.stub);
    const hwN = m && !m.stub ? (m.homework || []).length : 0;
    const hw = Object.values(st.tasks || {}).filter(Boolean).length;
    const pHwN = hasP ? (pm.homework || []).length : 0;
    const pHw = Object.values(pst.tasks || {}).filter(Boolean).length;
    const morning = chap(n, 'a'), mid = chap(n, 'm'), evening = chap(n, 'b'), epi = chap(n, 'c');
    const o = {
      d, morning, mid, evening, epi, hwN, hw, pHwN, pHw, hasP,
      mSeen: !morning || !!S.story.seen[morning.id], lesson: !!st.story, hwOk: hwN === 0 || hw >= Math.ceil(hwN * 0.6),
      nSeen: !mid || !!S.story.seen[mid.id], pLesson: !hasP || !!pst.story, pHwOk: pHwN === 0 || pHw >= Math.ceil(pHwN * 0.6),
      test: !!(st.test && st.test.pass), pTest: !hasP || !!(pst.test && pst.test.pass),
      eSeen: !evening || !!S.story.seen[evening.id], cSeen: !epi || !!S.story.seen[epi.id]
    };
    o.tests = o.test && o.pTest;
    o.done = o.tests && o.eSeen && o.cSeen;
    return o;
  }
  function dayUnlocked(n) { return n === 0 || S.story.free || dayState(n - 1).done; }
  function nextStep(n) {
    const o = dayState(n);
    if (!o.mSeen) return { label: 'Утро: сцена', href: '#/ch/' + o.morning.id };
    if (!o.lesson) return { label: 'Урок математики с Мирой', href: '#/m/' + o.d.mod + '/story' };
    if (!o.nSeen) return { label: 'Полдень: сцена', href: '#/ch/' + o.mid.id };
    if (!o.pLesson) return { label: 'Урок физики с Вегой', href: '#/m/' + o.d.phys + '/story' };
    if (!o.hwOk) return { label: 'Практика по математике (' + o.hw + '/' + o.hwN + ')', href: '#/m/' + o.d.mod + '/practice' };
    if (!o.pHwOk) return { label: 'Практика по физике (' + o.pHw + '/' + o.pHwN + ')', href: '#/m/' + o.d.phys + '/practice' };
    if (!o.test) return { label: 'Тест по математике', href: '#/m/' + o.d.mod + '/test' };
    if (!o.pTest) return { label: 'Тест по физике', href: '#/m/' + o.d.phys + '/test' };
    if (!o.eSeen) return { label: 'Вечер: сцена', href: '#/ch/' + o.evening.id };
    if (!o.cSeen) return { label: 'Эпилог', href: '#/ch/' + o.epi.id };
    return null;
  }
  function currentDay() {
    for (let n = 0; n < DAYS.length; n++) if (!dayState(n).done) return n;
    return DAYS.length - 1;
  }

  function school() {
    const L = level(), cur = currentDay(), cs = dayState(cur), step = nextStep(cur);
    const doneDays = DAYS.filter((d, n) => dayState(n).done).length;
    let h = '<div class="wrap">' + nav('') + '<div class="top"><h1>Горизонт · Формула лета</h1><div class="xp" title="' + S.xp + ' XP"><b>' + L.rank + '</b> · ур. ' + L.lvl + '<div class="bar"><i style="width:' + L.pct + '%"></i></div>' + S.xp + ' XP</div></div>' +
      '<div class="hero"><div id="heroImg"></div><div style="flex:1"><div class="howto">' + esc(cs.d.week) + ' · ' + esc(cs.d.date) + '</div><h2 style="margin:.1em 0">День ' + cs.d.n + '. ' + esc(cs.d.title) + '</h2>' +
      '<p>' + esc(cs.d.blurb) + '</p><p class="howto">Пройдено дней: <b>' + doneDays + ' / ' + DAYS.length + '</b></p>' +
      '<div class="row">' + (step ? '<button class="btn" id="cont">▶ ' + esc(step.label) + '</button>' : '<button class="btn" id="cont">День пройден</button>') + '<button class="btn ghost" id="openday">Открыть день</button></div></div></div>';
    let week = '';
    DAYS.forEach((d, n) => {
      if (d.week !== week) { if (week) h += '</div>'; week = d.week; h += '<div class="block" style="--c:#f472b6"><h2>' + esc(week) + '</h2><div class="grid">'; }
      const o = dayState(n), un = dayUnlocked(n);
      const chip = (on, t) => '<span class="chip' + (on ? ' on' : '') + '">' + t + '</span>';
      h += '<div class="mod day' + (un ? '' : ' stub') + (n === cur ? ' cur' : '') + '" data-n="' + n + '" style="--c:#f472b6"><div class="n">День ' + n + ' · ' + esc(d.date) + ' · ' + d.mod.toUpperCase() + (d.phys ? ' + ' + d.phys.toUpperCase() : '') + '</div><div class="t">' + esc(d.title) + '</div><div class="st">' +
        (un ? chip(o.mSeen && !!o.morning, 'утро') + chip(o.lesson, '∑') + chip(o.nSeen && !!o.mid, 'полдень') + chip(o.pLesson && o.hasP, 'ψ') + chip(o.hwOk && o.pHwOk && (o.hwN + o.pHwN) > 0, 'ДЗ ' + (o.hw + o.pHw) + '/' + (o.hwN + o.pHwN)) + chip(o.tests, 'тесты') + chip(o.eSeen && !!o.evening, 'вечер') : '<span class="chip">🔒 закрыто</span>') + '</div></div>';
    });
    h += '</div></div>';
    h += '<p class="howto" style="margin-top:12px">День устроен так: утро → урок математики с Мирой (∑) → полдень, переход в южное крыло → урок физики с Вегой (ψ) → практика и тесты по обоим предметам → вечер в клубе.</p>';
    h += '<p class="howto" style="margin-top:24px"><label><input type="checkbox" id="free"' + (S.story.free ? ' checked' : '') + '> Свободный режим: не блокировать дни и вечерние сцены до зачёта тестов</label> · Имя: <input id="nm" class="inp sm" value="' + esc(S.name) + '"> · <a href="#" id="reset">Сбросить прогресс</a></p></div>';
    $app.innerHTML = h;
    WORLD.putChar(document.getElementById('heroImg'), 'mira', 'neutral');
    document.getElementById('cont').onclick = () => step ? go(step.href) : go('#/day/' + cur);
    document.getElementById('openday').onclick = () => go('#/day/' + cur);
    document.getElementById('free').onchange = e => { S.story.free = e.target.checked; save(); school(); };
    document.getElementById('nm').onchange = e => { S.name = e.target.value.trim() || 'Карим'; save(); school(); };
    document.getElementById('reset').onclick = e => {
      e.preventDefault(); const a = e.target;
      if (a.dataset.armed) { localStorage.removeItem(KEY); S = load(); school(); return; }
      a.dataset.armed = '1'; a.textContent = 'Точно сбросить? Нажми ещё раз';
    };
    $app.querySelectorAll('.mod.day').forEach(el => el.onclick = () => go('#/day/' + el.dataset.n));
  }

  function dayView(n) {
    if (!(n >= 0 && n < DAYS.length)) return school();
    const o = dayState(n), d = o.d, un = dayUnlocked(n), eveningOpen = o.tests || S.story.free;
    const step = (ok, num, title, sub, btn, href, locked) => '<div class="panel step' + (locked ? ' locked' : '') + '"><div class="stn' + (ok ? ' ok' : '') + '">' + (ok ? '✓' : num) + '</div><div style="flex:1"><b>' + title + '</b><div class="howto">' + sub + '</div></div>' +
      (locked ? '<span class="howto">🔒</span>' : '<button class="btn sm' + (ok ? ' ghost' : '') + '" data-h="' + href + '">' + btn + '</button>') + '</div>';
    let h = '<div class="wrap">' + nav('') + '<div class="row" style="justify-content:space-between"><a href="#/">← К расписанию</a><span>' +
      (n > 0 ? '<a href="#/day/' + (n - 1) + '">‹ День ' + (n - 1) + '</a>' : '') + (n < DAYS.length - 1 ? ' &nbsp; <a href="#/day/' + (n + 1) + '">День ' + (n + 1) + ' ›</a>' : '') + '</span></div>' +
      '<div class="howto" style="margin-top:12px">' + esc(d.week) + ' · ' + esc(d.date) + ' · модули ' + d.mod.toUpperCase() + (d.phys ? ' и ' + d.phys.toUpperCase() : '') + '</div><h1 style="margin:.1em 0">День ' + n + '. ' + esc(d.title) + '</h1><p>' + esc(d.blurb) + '</p>';
    if (!un) h += '<div class="panel">🔒 Этот день откроется, когда ты зачтёшь предыдущий (оба теста от ' + PASS + '% и вечерняя сцена). Или включи «свободный режим» на главной.</div>';
    let k = 0;
    h += step(o.mSeen && !!o.morning, ++k, 'Утро', o.morning ? esc(o.morning.title) : 'сцена ещё не написана', o.mSeen ? 'Пересмотреть' : 'Смотреть', o.morning ? '#/ch/' + o.morning.id : '', !un || !o.morning);
    h += step(o.lesson, ++k, 'Урок математики с Мирой · ' + d.mod.toUpperCase(), esc(titleOf(d.mod)) + ': теория на досках, вопросы по ходу', o.lesson ? 'Пересмотреть' : 'Начать', '#/m/' + d.mod + '/story', !un);
    if (o.mid) h += step(o.nSeen, ++k, 'Полдень · переход в южное крыло', esc(o.mid.title), o.nSeen ? 'Пересмотреть' : 'Смотреть', '#/ch/' + o.mid.id, !un);
    if (o.hasP) h += step(o.pLesson, ++k, 'Урок физики с Вегой · ' + d.phys.toUpperCase(), esc(titleOf(d.phys)) + ': опыты, доски, вопросы по ходу', o.pLesson ? 'Пересмотреть' : 'Начать', '#/m/' + d.phys + '/story', !un);
    h += step(o.hwOk && o.hwN > 0, ++k, 'Практика по математике', 'Домашка с автопроверкой: решено ' + o.hw + ' из ' + o.hwN + ' (достаточно 60%, но лучше все)', 'Решать', '#/m/' + d.mod + '/practice', !un);
    if (o.hasP) h += step(o.pHwOk && o.pHwN > 0, ++k, 'Практика по физике', 'Задачи с автопроверкой: решено ' + o.pHw + ' из ' + o.pHwN + ' (достаточно 60%)', 'Решать', '#/m/' + d.phys + '/practice', !un);
    h += step(o.test, ++k, 'Тест по математике', 'Зачёт от ' + PASS + '%', 'Пройти', '#/m/' + d.mod + '/test', !un);
    if (o.hasP) h += step(o.pTest, ++k, 'Тест по физике', 'Зачёт от ' + PASS + '%. Оба теста открывают вечернюю сцену', 'Пройти', '#/m/' + d.phys + '/test', !un);
    h += step(o.eSeen && !!o.evening, ++k, 'Вечер', o.evening ? (eveningOpen ? esc(o.evening.title) : 'откроется после обоих тестов') : 'сцена ещё не написана', o.eSeen ? 'Пересмотреть' : 'Смотреть', o.evening ? '#/ch/' + o.evening.id : '', !un || !o.evening || !eveningOpen);
    if (o.epi) h += step(o.cSeen, ++k, 'Эпилог', esc(o.epi.title), o.cSeen ? 'Пересмотреть' : 'Смотреть', '#/ch/' + o.epi.id, !un || !(o.eSeen || S.story.free));
    h += '<p class="howto">Конспекты, шпаргалки и материалы: <a href="#/m/' + d.mod + '">модуль ' + d.mod.toUpperCase() + '</a>' + (o.hasP ? ' · <a href="#/m/' + d.phys + '">модуль ' + d.phys.toUpperCase() + '</a>' + ((COURSE.modules[d.phys].lab || []).length ? ' · <a href="#/m/' + d.phys + '/lab">🔬 лаборатория</a>' : '') : '') + '</p></div>';
    $app.innerHTML = h;
    $app.querySelectorAll('[data-h]').forEach(b => b.onclick = () => go(b.dataset.h));
  }

  function chapterView(id) {
    const ch = STORY.chapters[id]; if (!ch) return go('#/');
    const n = ch.day, st = S.story, day = DAYS[n], mod = day ? day.mod : null;
    const toDay = () => go('#/day/' + n);
    const btns = [];
    if (ch.part === 'a' && mod) btns.push({ label: 'К уроку с Мирой', fn: () => go('#/m/' + mod + '/story') });
    if (ch.part === 'm' && day && day.phys) btns.push({ label: 'К уроку с Вегой', fn: () => go('#/m/' + day.phys + '/story') });
    if (ch.part === 'b') {
      const epi = chap(n, 'c');
      if (epi) btns.push({ label: 'К эпилогу', fn: () => go('#/ch/' + epi.id) });
      else if (n < DAYS.length - 1) btns.push({ label: 'К следующему дню', fn: () => go('#/day/' + (n + 1)) });
    }
    btns.push({ label: 'К расписанию дня', fn: toDay });
    btns.push({ label: 'Пересмотреть сцену', fn: () => { st.pos[id] = 0; save(); chapterView(id); } });
    NOVEL.play({
      title: 'День ' + n + ' · ' + ch.title, beats: ch.beats, bg: ch.bg || 'black',
      store: st.picks, keyPrefix: id + ':',
      getPos: () => st.pos[id], onPos: p => { st.pos[id] = p === null ? 0 : p; save(); },
      onExit: toDay,
      onFinish: () => { if (!st.seen[id]) { st.seen[id] = true; addXp(15, 'сцена'); } save(); },
      endText: ch.endText || 'Конец сцены.', endButtons: btns
    });
  }

  function clubView() {
    const ids = ['mira', 'vega', 'yuna', 'sonya', 'avrora', 'nika'];
    let h = '<div class="wrap">' + nav('club') + '<div class="top"><h1>Клуб «Нулевая точка»</h1></div><p class="howto">Доверие растёт, когда ты помогаешь, слушаешь и выбираешь добрые варианты в сценах. Оно влияет на финал.</p><div class="grid cards">';
    ids.forEach(id => {
      const c = WORLD.CH[id], t = NOVEL.trust10(S, id);
      h += '<div class="panel clubcard" style="--c:' + c.color + '"><div class="face" data-id="' + id + '"></div><div><h3 style="margin:0;color:' + c.color + '">' + esc(c.name) + '</h3><div class="howto">' + esc(c.role) + '</div><p>' + esc(c.bio || c.desc) + '</p>' +
        (id === 'mira' || id === 'vega' ? '' : '<div class="hearts" title="Доверие: ' + t + '">' + Array.from({ length: 10 }, (_, k) => '<i class="' + (k < t ? 'on' : '') + '">♥</i>').join('') + ' <span class="howto">' + t + '</span></div>') + '</div></div>';
    });
    h += '</div></div>';
    $app.innerHTML = h;
    $app.querySelectorAll('.face').forEach(el => WORLD.putChar(el, el.dataset.id, 'neutral'));
  }

  if (window.WORLD && WORLD.preload) WORLD.preload();
  window.addEventListener('hashchange', route);
  route();
})();

(function () {
  const SLOTS = ['farleft', 'left', 'center', 'right', 'farright'];
  const AUTO = ['center', 'left', 'right', 'farleft', 'farright'];

  function core() { return window.CORE; }
  function W() { return window.WORLD; }

  let MAXAFF = null;
  function maxAff() {
    if (MAXAFF) return MAXAFF;
    MAXAFF = {};
    const walk = bs => (bs || []).forEach(b => {
      if (b.if) { walk(b.beats); walk(b.else); return; }
      if (b.pick) {
        const best = {};
        b.pick.opts.forEach(o => { if (o.aff) for (const k in o.aff) best[k] = Math.max(best[k] || 0, o.aff[k]); });
        for (const k in best) MAXAFF[k] = (MAXAFF[k] || 0) + best[k];
      }
    });
    Object.values((window.STORY || { chapters: {} }).chapters).forEach(ch => walk(ch.beats));
    return MAXAFF;
  }
  function needAff(who, v) { return v >= 6 ? Math.ceil((v / 10) * (maxAff()[who] || 10)) : v; }
  function trust10(S, who) { const m = maxAff()[who]; return m ? Math.min(10, Math.round(10 * (S.story.aff[who] || 0) / m)) : Math.min(10, S.story.aff[who] || 0); }

  function condOk(c, S) {
    if (!c) return true;
    const st = S.story;
    if (c.flag && !st.flags[c.flag]) return false;
    if (c.noflag && st.flags[c.noflag]) return false;
    if (c.flags && !c.flags.every(f => st.flags[f])) return false;
    if (c.aff) for (const k in c.aff) if ((st.aff[k] || 0) < needAff(k, c.aff[k])) return false;
    if (c.lt) for (const k in c.lt) if ((st.aff[k] || 0) >= needAff(k, c.lt[k])) return false;
    if (c.seen && !st.seen[c.seen]) return false;
    return true;
  }

  function makeStream(beats, S) {
    let stack = [{ a: beats, i: 0 }];
    return {
      next() {
        while (stack.length) {
          const f = stack[stack.length - 1];
          if (f.i >= f.a.length) { stack.pop(); continue; }
          const b = f.a[f.i];
          const path = stack.map((fr, k) => (k === stack.length - 1 ? fr.i : fr.i - 1)).join('.');
          f.i++;
          if (b.if) {
            if (condOk(b.if, S)) stack.push({ a: b.beats || [], i: 0 });
            else if (b.else) stack.push({ a: b.else, i: 0 });
            continue;
          }
          return { b, path };
        }
        return null;
      },
      snap() { return stack.map(f => ({ a: f.a, i: f.i })); },
      restore(s) { stack = s.map(f => ({ a: f.a, i: f.i })); },
      top() { return stack.length ? stack[0].i : 0; }
    };
  }

  function deepFill(v) {
    const nm = window.CORE ? window.CORE.S().name : '';
    if (typeof v === 'string') return v.indexOf('{name}') < 0 ? v : v.replace(/\{name\}/g, nm);
    if (Array.isArray(v)) return v.map(deepFill);
    if (v && typeof v === 'object') { const o = {}; for (const k in v) o[k] = k === 'beats' || k === 'else' ? v[k] : deepFill(v[k]); return o; }
    return v;
  }

  function play(opts) {
    const C = core(), S = C.S(), app = C.app;
    const beats = opts.beats || [];
    const DEF = opts.speaker || 'mira';
    let stream = makeStream(beats, S);
    let scene = { bg: opts.bg || 'classroom_day', chars: [], speaker: null };
    let history = [], waiting = false, ended = false, cur = null;

    app.innerHTML = '<div class="stage vn" id="vn"><div class="bgl on" id="bgA"></div><div class="bgl" id="bgB"></div>' +
      '<div class="prog"><i id="pg"></i></div><div class="hud"><button class="btn ghost sm" id="back">← Выйти</button><div class="ttl">' + C.esc(opts.title || '') +
      '</div><button class="btn ghost sm" id="prev" title="Назад (←)">◀</button><span id="pos" class="howto"></span>' +
      (window.VOICE ? '<button class="btn ghost sm" id="vtg" title="Озвучка">' + (VOICE.isOn() ? '🔊' : '🔇') + '</button>' : '') + '</div>' +
      '<div class="cast" id="cast"></div><div id="layer"></div><div class="dlg"><div class="box" id="box"></div></div></div>';
    const vn = app.querySelector('#vn'), cast = app.querySelector('#cast'), layer = app.querySelector('#layer'), box = app.querySelector('#box');
    const bgs = [app.querySelector('#bgA'), app.querySelector('#bgB')];
    let bgTop = 0;
    W().setBg(bgs[0], scene.bg);

    app.querySelector('#back').onclick = () => { window.VOICE && VOICE.stop(); opts.onExit && opts.onExit(); };
    app.querySelector('#prev').onclick = () => back();
    const vtg = app.querySelector('#vtg');
    if (vtg) vtg.onclick = e => { e.stopPropagation(); vtg.textContent = VOICE.toggle() ? '🔊' : '🔇'; };
    const say = (sp, text) => { if (window.VOICE) VOICE.speak(sp, text); };

    function setBgNow(id, animate) {
      const curEl = bgs[bgTop];
      if (curEl.dataset.bg === id) return;
      if (!animate) { W().setBg(curEl, id); return; }
      const nxt = bgs[1 - bgTop];
      W().setBg(nxt, id);
      nxt.classList.add('on'); curEl.classList.remove('on');
      bgTop = 1 - bgTop;
    }

    function syncCast(animate) {
      const want = {}; scene.chars.forEach(c => want[c.id] = c);
      cast.querySelectorAll('.ch').forEach(el => { if (!want[el.dataset.id]) { if (animate) { el.classList.add('out'); setTimeout(() => el.remove(), 320); } else el.remove(); } });
      scene.chars.forEach(c => {
        let el = cast.querySelector('.ch[data-id="' + c.id + '"]:not(.out)');
        if (!el) {
          el = document.createElement('div'); el.className = 'ch'; el.dataset.id = c.id;
          el.innerHTML = '<div class="art"></div>'; cast.appendChild(el);
          if (animate) { el.classList.add('in'); setTimeout(() => el.classList.remove('in'), 30); }
        }
        SLOTS.forEach(s => el.classList.remove('s-' + s)); el.classList.add('s-' + c.slot);
        if (el.dataset.mood !== c.mood) { el.dataset.mood = c.mood; W().putChar(el.querySelector('.art'), c.id, c.mood); }
        el.classList.toggle('on', scene.speaker === c.id);
        el.classList.toggle('dim', !!scene.speaker && scene.speaker !== c.id);
      });
    }

    function freeSlot() {
      const used = scene.chars.map(c => c.slot);
      return AUTO.find(s => used.indexOf(s) < 0) || 'right';
    }
    function ensure(id, mood, slot) {
      let c = scene.chars.find(x => x.id === id);
      if (!c) { c = { id, slot: slot || freeSlot(), mood: mood || 'neutral' }; scene.chars.push(c); }
      else { if (slot) c.slot = slot; if (mood) c.mood = mood; }
      return c;
    }
    function isChar(id) { return !!W().CH[id]; }

    function applyScene(b) {
      let any = false;
      if (b.bg && !b.title) { scene.bg = b.bg; any = true; }
      if (b.show) { [].concat(b.show).forEach(x => { if (typeof x === 'string') ensure(x, 'neutral'); else ensure(x.id, x.m || 'neutral', x.at); }); any = true; }
      if (b.hide) { const h = [].concat(b.hide); scene.chars = h.indexOf('all') >= 0 ? [] : scene.chars.filter(c => h.indexOf(c.id) < 0); any = true; }
      if (b.mood) { for (const k in b.mood) ensure(k, b.mood[k]); any = true; }
      if (b.fx && !b.t && !b.title) { vn.classList.remove('fx-shake', 'fx-flash'); void vn.offsetWidth; vn.classList.add('fx-' + b.fx); any = true; }
      const visual = b.t !== undefined || b.board || b.choice || b.pick || b.title;
      return any && !visual;
    }

    function speakerName(s) {
      if (s === 'you') return { name: C.S().name, cls: 'you', color: '#38bdf8' };
      if (s === 'narr' || !s) return { name: '', cls: 'narr' };
      const ch = W().CH[s];
      return ch ? { name: ch.name, cls: '', color: ch.color } : { name: s, cls: '', color: '#94a3b8' };
    }
    function nameTag(s) {
      const n = speakerName(s);
      return n.name ? '<div class="who ' + n.cls + '" style="background:' + n.color + '">' + C.esc(n.name) + '</div>' : '';
    }
    function setSpeaker(s, mood) {
      if (isChar(s)) { ensure(s, mood || undefined); scene.speaker = s; if (mood) ensure(s, mood); }
      else scene.speaker = null;
    }

    function progress(path) {
      const t = stream.top();
      app.querySelector('#pos').textContent = Math.min(t, beats.length) + ' / ' + beats.length;
      app.querySelector('#pg').style.width = (100 * Math.min(t, beats.length) / Math.max(1, beats.length)) + '%';
    }

    const F = x => (x == null ? x : String(x).replace(/\{name\}/g, C.S().name));
    function render(b0, path) {
      const b = deepFill(b0);
      layer.innerHTML = ''; waiting = false; vn.classList.remove('hb');
      box.style.display = '';
      progress(path);
      if (b.title) {
        if (b.bg) scene.bg = b.bg;
        scene.speaker = null; syncScene(true);
        layer.innerHTML = '<div class="titlecard"><div class="tc-main">' + b.title + '</div>' + (b.sub ? '<div class="tc-sub">' + b.sub + '</div>' : '') + '</div>';
        box.style.display = 'none'; C.math(layer); window.VOICE && VOICE.stop(); return;
      }
      if (b.board) {
        setSpeaker(b.s || DEF, b.m || b.mood);
        syncScene(true);
        vn.classList.add('hb');
        layer.innerHTML = '<div class="board"><h3>' + b.board + '</h3><div class="bd">' + (b.html || '') + '</div><div class="ft"><button class="btn" id="bn">Понятно, дальше ▶</button></div></div>';
        box.innerHTML = nameTag(b.s || DEF) + '<div class="txt">' + (b.say || (opts.boardSay ? opts.boardSay(path) : '')) + '</div>';
        C.math(layer); C.math(box);
        say(b.s || DEF, b0.say || (opts.boardSay ? opts.boardSay(path) : ''));
        layer.querySelector('#bn').onclick = next; return;
      }
      if (b.choice || b.pick) {
        const isPick = !!b.pick, c = b.choice || b.pick, c0 = b0.choice || b0.pick;
        const sp = c.s || b.s || (isPick ? 'narr' : DEF);
        setSpeaker(sp, b.m || b.mood || (isPick ? undefined : 'think'));
        syncScene(true);
        const key = (opts.keyPrefix || '') + path;
        box.innerHTML = nameTag(sp) + '<div class="txt' + (sp === 'narr' ? ' narr' : '') + '">' + c.q + '</div><div class="opts">' + c.opts.map((o, k) => '<button data-k="' + k + '">' + o.t + '</button>').join('') + '</div>';
        C.math(box); waiting = true; say(sp, c0.q);
        const tx = box.querySelector('.txt'); let first = true;
        const prevPick = isPick ? opts.store[key] : undefined;
        box.querySelectorAll('.opts button').forEach(bt => bt.onclick = e => {
          e.stopPropagation(); if (bt.classList.contains('locked')) return;
          const k = Number(bt.dataset.k), o = c.opts[k];
          if (isPick) {
            box.querySelectorAll('.opts button').forEach(x => x.classList.add('locked'));
            bt.classList.add('picked');
            if (opts.store[key] === undefined) {
              opts.store[key] = k;
              const st = C.S().story;
              if (o.aff) for (const who in o.aff) { st.aff[who] = (st.aff[who] || 0) + o.aff[who]; C.trust(who, o.aff[who]); }
              if (o.flag) st.flags[o.flag] = true;
              C.save();
            }
            const rs = o.rs || (o.r ? (c.rs || sp) : sp);
            if (o.r) { setSpeaker(rs, o.m); syncScene(true); box.querySelector('.who') && box.querySelector('.who').remove(); tx.insertAdjacentHTML('beforebegin', nameTag(rs)); tx.className = 'txt' + (rs === 'narr' ? ' narr' : ''); tx.innerHTML = o.r; C.math(tx); say(rs, c0.opts[k].r); }
            box.querySelector('.opts').style.display = 'none';
            waiting = false; box.insertAdjacentHTML('beforeend', '<div class="nx">нажми — дальше ▶</div>');
          } else {
            bt.classList.add(o.ok ? 'right' : 'wrong');
            tx.innerHTML = o.r || (o.ok ? 'Верно!' : 'Не совсем.'); C.math(tx); say(sp, c0.opts[k].r || (o.ok ? 'Верно!' : 'Не совсем.'));
            setSpeaker(sp, o.ok ? 'happy' : 'think'); syncScene(true);
            if (o.ok) {
              if (first && !opts.store[key]) { opts.store[key] = true; C.xp(5, 'с первого раза'); C.save(); }
              waiting = false; box.querySelectorAll('.opts button').forEach(x => x.classList.add('locked'));
              box.insertAdjacentHTML('beforeend', '<div class="nx">нажми — дальше ▶</div>');
            } else first = false;
          }
        });
        return;
      }
      const sp = b.s || DEF;
      setSpeaker(sp, b.m || b.mood);
      if (sp === 'you') scene.speaker = '__you';
      if (sp === 'narr') scene.speaker = null;
      syncScene(true);
      box.innerHTML = nameTag(sp) + '<div class="txt' + (sp === 'narr' ? ' narr' : '') + '">' + b.t + '</div><div class="nx">нажми — дальше ▶</div>';
      C.math(box); say(sp, b0.t);
    }

    function syncScene(animate) { setBgNow(scene.bg, animate); syncCast(animate); }
    function cloneScene() { return { bg: scene.bg, chars: scene.chars.map(c => ({ ...c })), speaker: scene.speaker }; }

    function show(r, replay) {
      cur = r;
      if (!replay) history.push({ stack: stream.snap(), scene: cloneScene(), r });
      opts.onPos && opts.onPos(r.path);
      render(r.b, r.path);
    }

    function step() {
      for (;;) {
        const r = stream.next();
        if (!r) return finish();
        if (applyScene(r.b)) { if (r.b.bg || r.b.show || r.b.hide || r.b.mood) syncScene(true); continue; }
        show(r); return;
      }
    }
    function next() { if (waiting || ended) return; step(); }
    function back() {
      if (ended) {
        ended = false; waiting = false;
        const e = history[history.length - 1]; if (!e) return;
        stream.restore(e.stack); scene = { bg: e.scene.bg, chars: e.scene.chars.map(c => ({ ...c })), speaker: e.scene.speaker };
        syncScene(false); show(e.r, true); return;
      }
      if (history.length < 2) return;
      history.pop();
      const e = history[history.length - 1];
      stream.restore(e.stack); scene = { bg: e.scene.bg, chars: e.scene.chars.map(c => ({ ...c })), speaker: e.scene.speaker };
      syncScene(false); show(e.r, true);
    }

    function finish() {
      ended = true; layer.innerHTML = ''; vn.classList.remove('hb'); box.style.display = '';
      scene.speaker = null; if (opts.endMood) { ensure(opts.endSpeaker || DEF, opts.endMood); }
      syncScene(true);
      opts.onPos && opts.onPos(null);
      opts.onFinish && opts.onFinish();
      const btns = (opts.endButtons || []).map((b, k) => '<button data-k="' + k + '">' + b.label + '</button>').join('');
      box.innerHTML = nameTag(opts.endSpeaker || 'narr') + '<div class="txt' + (opts.endSpeaker ? '' : ' narr') + '">' + (opts.endText || 'Конец сцены.') + '</div><div class="opts">' + btns + '</div>';
      box.querySelectorAll('.opts button').forEach(bt => bt.onclick = e => { e.stopPropagation(); window.VOICE && VOICE.stop(); opts.endButtons[bt.dataset.k].fn(); });
      waiting = true; say(opts.endSpeaker, opts.endText);
      progress();
    }

    function fastForward(target) {
      const ff = makeStream(beats, C.S());
      for (;;) {
        const r = ff.next(); if (!r) return false;
        if (r.path === target) { stream = ff; return r; }
        const b = r.b;
        applyScene(b);
        if (b.title && b.bg) scene.bg = b.bg;
        if ((b.t !== undefined || b.board || b.choice || b.pick) && (b.s || b.board || b.choice || b.pick)) {
          const sp = b.s || (b.board ? DEF : (b.choice ? (b.choice.s || DEF) : (b.pick.s || 'narr')));
          if (isChar(sp)) ensure(sp, b.m || b.mood);
        }
      }
    }

    vn.onclick = null; box.onclick = next;
    document.onkeydown = e => {
      if (!document.querySelector('.vn')) { document.onkeydown = null; return; }
      if (e.target && e.target.tagName === 'BUTTON' && e.key === 'Enter') return;
      const onBoard = !!layer.querySelector('.board');
      if (e.key === 'Enter' || e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === ' ' && !onBoard) { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); back(); }
      else if (e.key === 'Escape') opts.onExit && opts.onExit();
    };
    layer.addEventListener('click', e => { if (layer.querySelector('.titlecard') && !e.target.closest('button')) next(); });

    const startPos = opts.getPos && opts.getPos();
    if (startPos !== undefined && startPos !== null && String(startPos) !== '0' && String(startPos) !== '') {
      waiting = true; setBgNow(scene.bg, false);
      box.innerHTML = nameTag(opts.resumeSpeaker || 'narr') + '<div class="txt' + (opts.resumeSpeaker ? '' : ' narr') + '">' + (opts.resumeText || 'Вы остановились на середине. Продолжить с этого места?') + '</div><div class="opts"><button id="r1">Продолжить с того места</button><button id="r2">Начать сначала</button></div>';
      if (opts.resumeSpeaker) { ensure(opts.resumeSpeaker, 'happy'); syncScene(false); say(opts.resumeSpeaker, opts.resumeText); }
      box.querySelector('#r1').onclick = e => {
        e.stopPropagation();
        const r = fastForward(String(startPos));
        if (r) { waiting = false; syncScene(false); show(r); } else { waiting = false; stream = makeStream(beats, C.S()); scene.chars = []; step(); }
      };
      box.querySelector('#r2').onclick = e => { e.stopPropagation(); waiting = false; scene.chars = []; stream = makeStream(beats, C.S()); step(); };
    } else {
      step();
    }
  }

  window.NOVEL = { play, condOk, makeStream, maxAff, trust10 };
})();

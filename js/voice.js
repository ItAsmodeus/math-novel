(function () {
  const VOICED = { mira: true };
  const KEY = 'mn_voice';
  let cur = null, on = true;
  try { on = localStorage.getItem(KEY) !== 'off'; } catch (e) {}

  function fnv(s) {
    const b = new TextEncoder().encode(s);
    let h = 0x811c9dc5;
    for (let i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 0x01000193) >>> 0; }
    return ('0000000' + h.toString(16)).slice(-8);
  }
  function stop() { if (cur) { cur.pause(); cur.removeAttribute('src'); cur.load(); cur = null; } }
  function speak(sp, text) {
    stop();
    if (!on || !VOICED[sp] || !text || typeof text !== 'string') return;
    const a = new Audio('assets/voice/' + fnv(sp + '|' + text) + '.mp3');
    a.onerror = () => { if (cur === a) cur = null; };
    cur = a;
    const p = a.play(); if (p && p.catch) p.catch(() => {});
  }
  function toggle() {
    on = !on;
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch (e) {}
    if (!on) stop();
    return on;
  }
  window.addEventListener('hashchange', stop);
  window.VOICE = { speak, stop, toggle, isOn: () => on, has: sp => !!VOICED[sp] };
})();

window.R = String.raw;
(function () {
  const MATH = /\$\$[\s\S]+?\$\$|\$[^$]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\]/g;
  const LOST = [
    [/\x08/g, '\\b'], [/\x0B/g, '\\v'], [/\x0C/g, '\\f'],
    [/\t(?=heta|imes|au\b|ext|ilde|op\b|o\b|riangle)/g, '\\t'],
    [/\n(?=abla|eq|otin|eg\b|mid|subseteq)/g, '\\n'],
    [/\r(?=ho\b|ight|angle|ceil|floor|vert)/g, '\\r']
  ];
  function fixMath(seg) {
    LOST.forEach(([re, to]) => { seg = seg.replace(re, to); });
    return seg.replace(/<(?!\/?[a-zA-Z][^<>]*>)/g, '\\lt ');
  }
  function fixStr(s) { return s.indexOf('$') < 0 && s.indexOf('\\(') < 0 && s.indexOf('\\[') < 0 ? s : s.replace(MATH, fixMath); }
  function walk(v, key) {
    if (typeof v === 'string') return key === 'url' || key === 'answer' ? v : fixStr(v);
    if (Array.isArray(v)) return v.map(x => walk(x, key));
    if (v && typeof v === 'object') { for (const k in v) v[k] = walk(v[k], k); return v; }
    return v;
  }
  window.fixMathDeep = v => walk(v);
  window.COURSE = {
    modules: {},
    register(m) { this.modules[m.id] = walk(m); }
  };
})();

(function () {
  const STYLE = 'anime visual novel style, clean line art, soft cel shading, warm summer light, high detail';
  const BG_TAIL = ', no characters, no people, no text, wide 16:9 composition, 1920x1080, ' + STYLE;

  const BG_EN = {
    "station_day": "a small railway station on a lake shore, platform with a canopy roof, rails, pine trees, bright summer morning sky",
    "station_sunset": "the same small lakeside railway station at sunset, orange sky, long shadows, empty platform, a feeling of farewell",
    "gate": "ornate wrought-iron entrance gate of an old boarding lyceum, a tree-lined alley behind it and a white building with a red roof, lush summer greenery",
    "school_hall": "a long bright school corridor with old parquet floor, tall windows along one side, notice boards and posters, daytime light",
    "classroom_day": "a spacious school classroom in daytime: green chalkboard, rows of wooden desks, large windows with summer light, flowers on the windowsills",
    "classroom_evening": "the same classroom in the evening: warm orange sunset light from the windows, long shadows from the desks, empty rows",
    "club_room": "a cozy attic club room: old sofa, kettle and mugs, a chalkboard with formulas, bookshelf, string lights, warm daylight",
    "club_evening": "the same cozy club room in the evening: desk lamp and string lights on, sunset behind the window, tea and notebooks on the table",
    "canteen": "a bright school canteen with long wooden tables, windows facing the lake, serving counter with pots, morning light",
    "library": "an old library full of books up to the ceiling, a rolling ladder, reading tables with green lamps, dust motes in evening sunlight",
    "lake_beach": "a sandy beach on a lake shore, clear water, pine trees in the distance, a wooden pier, bright sunny day",
    "lake_sunset": "the same lake shore at sunset: pink-orange sky, golden path on the water, silhouettes of pines, calm and romantic mood",
    "lake_road": "an asphalt road along a lake, trees and grass on both sides, summer, hills in the distance, good for a bike ride",
    "forest_path": "a forest trail between tall pines, slanting sun rays, moss and ferns, fresh and slightly mysterious",
    "mountain_fog": "a hillside with pines in thick morning fog, low visibility, the silhouette of a lake faintly visible below",
    "campfire_night": "a night campfire in a clearing by a lake, sparks, a starry sky, logs around the fire, warm light on the trees",
    "rooftop_night": "a flat roof of a lyceum at night, railing, a huge starry sky with the Milky Way, lights of the lake in the distance, quiet",
    "dorm_room": "a small dormitory room: bed, desk with a lamp, window with a lake view, posters and string lights, evening",
    "rain_window": "a club room window during a downpour: raindrops on the glass, grey sky, pines outside, cozy warm dim light inside",
    "fair": "a summer fair on the lyceum square: colorful tent-stalls, garlands of flags and lanterns, a faceless crowd, daytime",
    "old_lab": "an abandoned quantum laboratory: a gold-colored cryostat with tubes, dusty desks with monitors, whiteboards full of formulas, bluish light, cobwebs, a sense of mystery",
    "server_room": "a dark computer class at night: rows of monitors with code, green and blue server rack lights, cups of cold coffee",
    "festival_stage": "an open-air festival stage by a lake in the evening: string lights, spotlights, a screen without text, silhouettes of an audience, festive mood"
  };

  function rnd(seed) { let s = seed || 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }

  const OPS = {
    sky: (c1, c2) => `<defs><linearGradient id="sk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#sk)"/>`,
    wall: (c1, c2) => `<defs><linearGradient id="wl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect width="1600" height="900" fill="url(#wl)"/>`,
    sun: (x, y, r, c) => `<defs><radialGradient id="sn${x | 0}"><stop offset="0" stop-color="${c}" stop-opacity="1"/><stop offset=".25" stop-color="${c}" stop-opacity=".85"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient></defs><circle cx="${x}" cy="${y}" r="${r * 4}" fill="url(#sn${x | 0})"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`,
    moon: (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r * 2.6}" fill="#cfe3ff" opacity=".12"/><circle cx="${x}" cy="${y}" r="${r}" fill="#f4f7ff"/><circle cx="${x + r * .35}" cy="${y - r * .2}" r="${r * .9}" fill="#0d1230" opacity=".12"/>`,
    stars: (n, seed) => { const r = rnd(seed || 7); let o = ''; for (let i = 0; i < n; i++) o += `<circle cx="${r() * 1600 | 0}" cy="${r() * 520 | 0}" r="${(r() * 1.8 + .6).toFixed(1)}" fill="#fff" opacity="${(r() * .6 + .35).toFixed(2)}"/>`; return o; },
    clouds: (n, seed, c) => { const r = rnd(seed || 3); let o = ''; for (let i = 0; i < n; i++) { const x = r() * 1500, y = 80 + r() * 260, w = 120 + r() * 160; o += `<g fill="${c || '#fff'}" opacity=".75"><ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w * .22}"/><ellipse cx="${x + w * .4}" cy="${y - w * .12}" rx="${w * .5}" ry="${w * .2}"/></g>`; } return o; },
    mountains: (c, y) => `<path d="M0 ${y}L180 ${y - 150}L330 ${y - 60}L520 ${y - 210}L720 ${y - 70}L900 ${y - 170}L1100 ${y - 40}L1300 ${y - 190}L1450 ${y - 90}L1600 ${y - 150}V900H0Z" fill="${c}"/>`,
    hills: (c, y, amp) => `<path d="M0 ${y}C250 ${y - (amp || 70)} 450 ${y + 40} 700 ${y - 20}S1150 ${y - (amp || 70)} 1350 ${y}S1520 ${y - 30} 1600 ${y - 10}V900H0Z" fill="${c}"/>`,
    water: (y, c1, c2) => `<defs><linearGradient id="wt${y}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs><rect y="${y}" width="1600" height="${900 - y}" fill="url(#wt${y})"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${(i * 337 + 80) % 1500}" y="${y + 24 + i * 22}" width="${160 + i * 20}" height="3" rx="1.5" fill="#fff" opacity=".28"/>`).join(''),
    ground: (c, y) => `<rect y="${y}" width="1600" height="${900 - y}" fill="${c}"/>`,
    trees: (c, y, n, seed, sz) => { const r = rnd(seed || 5); let o = ''; for (let i = 0; i < n; i++) { const x = (i + .3 + r() * .4) * 1600 / n, h = (sz || 200) * (.7 + r() * .6); o += `<rect x="${x - 6}" y="${y - 20}" width="12" height="60" fill="#3b2a1e"/><ellipse cx="${x}" cy="${y - h * .45}" rx="${h * .34}" ry="${h * .55}" fill="${c}"/>`; } return o; },
    pines: (c, y, n, seed, sz) => { const r = rnd(seed || 9); let o = ''; for (let i = 0; i < n; i++) { const x = (i + .3 + r() * .4) * 1600 / n, h = (sz || 260) * (.7 + r() * .6); o += `<path d="M${x} ${y - h}L${x + h * .22} ${y - h * .45}L${x + h * .12} ${y - h * .45}L${x + h * .3} ${y}H${x - h * .3}L${x - h * .12} ${y - h * .45}H${x - h * .22}Z" fill="${c}"/>`; } return o; },
    fog: (o) => `<defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e8eef5" stop-opacity="0"/><stop offset=".5" stop-color="#e8eef5" stop-opacity="${o}"/><stop offset="1" stop-color="#e8eef5" stop-opacity="0"/></linearGradient></defs><rect y="200" width="1600" height="600" fill="url(#fg)"/>`,
    floor: (c, y) => `<rect y="${y}" width="1600" height="${900 - y}" fill="${c}"/>` + [0, 1, 2, 3, 4].map(i => `<rect y="${y + 30 + i * (900 - y) / 5}" width="1600" height="2" fill="#000" opacity=".12"/>`).join(''),
    windows: (n, y, w, h, s1, s2, frame) => { let o = `<defs><linearGradient id="ws" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></linearGradient></defs>`; const gap = 1600 / n; for (let i = 0; i < n; i++) { const x = gap * i + (gap - w) / 2; o += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#ws)" stroke="${frame || '#5c4630'}" stroke-width="10"/><path d="M${x + w / 2} ${y}V${y + h}M${x} ${y + h / 2}H${x + w}" stroke="${frame || '#5c4630'}" stroke-width="6"/>`; } return o; },
    board: (x, y, w, h) => `<rect x="${x - 14}" y="${y - 14}" width="${w + 28}" height="${h + 28}" fill="#6b4a2b"/><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#1d3f37"/><path d="M${x + 40} ${y + 60}h${w * .5}M${x + 40} ${y + 110}h${w * .35}M${x + 40} ${y + 160}h${w * .6}" stroke="#e8f0ec" stroke-width="5" opacity=".55" stroke-linecap="round"/>`,
    desks: (c, y) => [0, 1, 2, 3].map(i => `<g fill="${c}"><rect x="${120 + i * 380}" y="${y}" width="260" height="22" rx="4"/><rect x="${140 + i * 380}" y="${y + 22}" width="12" height="110"/><rect x="${348 + i * 380}" y="${y + 22}" width="12" height="110"/></g>`).join(''),
    shelves: (c, n) => { let o = ''; const r = rnd(11), cols = ['#b5533c', '#4f7cac', '#c9a227', '#5b8a5a', '#8e5ea2', '#d98e73']; for (let s = 0; s < 4; s++) { const y = 140 + s * 170; o += `<rect x="0" y="${y + 120}" width="1600" height="14" fill="${c}"/>`; for (let k = 0; k < (n || 40); k++) { const bw = 18 + r() * 22, bx = k * 1600 / (n || 40) + 6, bh = 70 + r() * 45; o += `<rect x="${bx}" y="${y + 120 - bh}" width="${bw}" height="${bh}" fill="${cols[(r() * 6) | 0]}" opacity=".85"/>`; } } return o; },
    glow: (n, c, seed) => { const r = rnd(seed || 13); let o = ''; for (let i = 0; i < n; i++) { const x = r() * 1500 + 50, y = 100 + r() * 500; o += `<circle cx="${x}" cy="${y}" r="${60 + r() * 90}" fill="${c}" opacity=".10"/>`; } return o; },
    lanterns: (n, y, seed) => { const r = rnd(seed || 4), cols = ['#ff8fab', '#ffd166', '#8ecae6', '#b8f2e6', '#f4a261']; let o = `<path d="M0 ${y}Q800 ${y + 80} 1600 ${y}" fill="none" stroke="#2b2b2b" stroke-width="3"/>`; for (let i = 0; i < n; i++) { const t = (i + .5) / n, x = t * 1600, yy = y + 80 * 4 * t * (1 - t) + 10, c = cols[(r() * 5) | 0]; o += `<circle cx="${x}" cy="${yy + 18}" r="26" fill="${c}" opacity=".25"/><circle cx="${x}" cy="${yy + 18}" r="11" fill="${c}"/>`; } return o; },
    stage: () => `<rect x="180" y="610" width="1240" height="40" fill="#5a3b2a"/><rect x="180" y="650" width="1240" height="250" fill="#2a1d18"/><path d="M420 0L260 610H560ZM1180 0L1040 610H1340ZM800 0L560 610H1040Z" fill="#fff3c4" opacity=".10"/>`,
    fire: (x, y) => `<circle cx="${x}" cy="${y - 20}" r="180" fill="#ff9a3c" opacity=".16"/><path d="M${x - 40} ${y}L${x} ${y - 120}L${x + 40} ${y}Z" fill="#ff8a1f"/><path d="M${x - 22} ${y}L${x} ${y - 78}L${x + 22} ${y}Z" fill="#ffd166"/><rect x="${x - 70}" y="${y}" width="140" height="14" rx="7" fill="#4a2f1b"/>`,
    rain: () => Array.from({ length: 70 }, (_, i) => { const r = rnd(i + 3), x = r() * 1700, y = r() * 900; return `<path d="M${x} ${y}l-14 46" stroke="#cfe3ff" stroke-width="2" opacity=".35"/>`; }).join('') + '<rect width="1600" height="900" fill="#1a2538" opacity=".25"/>',
    building: (c, y) => `<rect x="300" y="${y - 260}" width="1000" height="260" fill="${c}"/><path d="M280 ${y - 260}L800 ${y - 380}L1320 ${y - 260}Z" fill="#7a3b3b"/>` + [0, 1, 2, 3, 4, 5].map(i => `<rect x="${350 + i * 160}" y="${y - 200}" width="80" height="90" fill="#ffe9a8" opacity=".85"/>`).join(''),
    gate: () => `<rect x="420" y="360" width="60" height="420" fill="#c9c2b6"/><rect x="1120" y="360" width="60" height="420" fill="#c9c2b6"/><rect x="400" y="340" width="780" height="40" rx="6" fill="#d7d0c4"/><path d="M480 520H1120M480 600H1120M480 680H1120" stroke="#3a3a3a" stroke-width="8"/>`,
    roof: (c) => `<path d="M0 120H1600V210H0Z" fill="${c}"/><rect x="200" y="210" width="26" height="600" fill="#4b4b55"/><rect x="1380" y="210" width="26" height="600" fill="#4b4b55"/>`,
    rails: () => `<path d="M0 760H1600M0 820H1600" stroke="#55555f" stroke-width="10"/>` + Array.from({ length: 24 }, (_, i) => `<rect x="${i * 70}" y="748" width="14" height="84" fill="#6b5846"/>`).join(''),
    road: (c) => `<path d="M-100 900L560 560H1040L1700 900Z" fill="${c}"/><path d="M800 900V560" stroke="#fff" stroke-width="8" stroke-dasharray="40 30" opacity=".6"/>`,
    tables: (c) => [0, 1, 2, 3].map(i => `<g><rect x="${60 + i * 400}" y="560" width="320" height="26" rx="6" fill="${c}"/><rect x="${90 + i * 400}" y="586" width="14" height="150" fill="${c}"/><rect x="${360 + i * 400}" y="586" width="14" height="150" fill="${c}"/></g>`).join(''),
    tents: (seed) => { const r = rnd(seed || 2), cols = ['#e76f51', '#2a9d8f', '#e9c46a', '#8ecae6']; return [0, 1, 2, 3].map(i => `<g><path d="M${100 + i * 380} 560L${230 + i * 380} 430L${360 + i * 380} 560Z" fill="${cols[(r() * 4) | 0]}"/><rect x="${100 + i * 380}" y="560" width="260" height="14" fill="#6b4a2b"/></g>`).join(''); },
    equipment: () => [0, 1, 2].map(i => `<g><rect x="${220 + i * 420}" y="330" width="170" height="380" rx="10" fill="#3a4156"/><rect x="${240 + i * 420}" y="360" width="130" height="90" fill="#7fd1c7" opacity=".5"/><circle cx="${305 + i * 420}" cy="560" r="36" fill="#222a3a"/></g>`).join(''),
    monitors: () => [0, 1, 2, 3].map(i => `<g><rect x="${120 + i * 380}" y="430" width="270" height="170" rx="8" fill="#10151f"/><rect x="${132 + i * 380}" y="442" width="246" height="146" fill="#1d4d4a" opacity=".85"/><path d="M${150 + i * 380} 480h120M${150 + i * 380} 510h180M${150 + i * 380} 540h90" stroke="#9ff3d6" stroke-width="5" opacity=".8"/></g>`).join(''),
    sofa: (c) => `<rect x="170" y="560" width="520" height="150" rx="24" fill="${c}"/><rect x="170" y="500" width="520" height="90" rx="24" fill="${c}"/><rect x="150" y="540" width="46" height="170" rx="18" fill="${c}"/><rect x="664" y="540" width="46" height="170" rx="18" fill="${c}"/>`,
    bed: (c) => `<rect x="920" y="520" width="540" height="190" rx="18" fill="${c}"/><rect x="920" y="480" width="120" height="130" rx="18" fill="#f3efe7"/>`,
    vig: () => `<defs><radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient></defs><rect width="1600" height="900" fill="url(#vg)"/>`,
    tint: (c, o) => `<rect width="1600" height="900" fill="${c}" opacity="${o}"/>`
  };

  function svgBg(recipe) {
    let body = '';
    recipe.forEach(op => { const f = OPS[op[0]]; if (f) body += f(...op.slice(1)); });
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice">${body}${OPS.vig()}</svg>`;
  }

  const DAYLAKE = [['sky', '#8fd3ff', '#fdf3d7'], ['clouds', 5, 3], ['sun', 1180, 220, 50, '#fff6c9']];
  const EVELAKE = [['sky', '#ff9e7a', '#ffe0a8'], ['clouds', 4, 8, '#ffd9c9'], ['sun', 520, 470, 60, '#ffd27a']];
  const NIGHT = [['sky', '#070b24', '#1c2a5e'], ['stars', 130, 7], ['moon', 1290, 150, 54]];

  const BG = {
    station_day: { title: 'Станция у озера, утро', tier: 1, recipe: [...DAYLAKE, ['hills', '#7fb383', 520, 60], ['water', 560, '#8ad0ea', '#4aa0cf'], ['ground', '#cdbf9f', 700], ['roof', '#8c4c3b'], ['rails']],
      desc: 'маленькая железнодорожная станция на берегу озера, платформа с навесом, рельсы, сосны, утро, яркое летнее небо', },
    station_sunset: { title: 'Станция, закат (проводы)', tier: 3, recipe: [...EVELAKE, ['hills', '#4d6b57', 520, 60], ['water', 560, '#f3a47c', '#7f6aa6'], ['ground', '#a9937c', 700], ['roof', '#6b3a34'], ['rails']],
      desc: 'та же станция у озера на закате: оранжевое небо, длинные тени, пустая платформа, ощущение прощания', },
    gate: { title: 'Ворота лицея «Горизонт»', tier: 1, recipe: [...DAYLAKE.slice(0, 2), ['hills', '#79b07d', 470, 50], ['trees', '#3f8a4f', 520, 9, 4, 240], ['ground', '#9bc27a', 600], ['building', '#e6d9c3', 600], ['gate'], ['road', '#cfc6b6']],
      desc: 'парадные кованые ворота старого лицея-интерната, за ними аллея и белое здание с красной крышей, лето, зелень', },
    school_hall: { title: 'Коридор лицея', tier: 2, recipe: [['wall', '#efe4cf', '#d8c8a8'], ['windows', 4, 120, 180, 320, '#8fd3ff', '#fdf3d7'], ['floor', '#9a7650', 700], ['glow', 4, '#fff3b0', 2]],
      desc: 'длинный светлый школьный коридор со старым паркетом, высокие окна по одной стороне, стенды, доски объявлений, дневной свет', },
    classroom_day: { title: 'Класс, день', tier: 1, recipe: [['wall', '#efe6d2', '#d9c9a9'], ['board', 430, 130, 740, 300], ['windows', 3, 140, 160, 300, '#8fd3ff', '#fdf3d7'], ['floor', '#a47c52', 640], ['desks', '#7c5a3a', 600], ['glow', 3, '#fff7c9', 5]],
      desc: 'просторный школьный класс днём: зелёная меловая доска, ряды деревянных парт, большие окна с летним светом, на подоконниках цветы', },
    classroom_evening: { title: 'Класс, вечер', tier: 2, recipe: [['wall', '#e9c9a0', '#b98a62'], ['board', 430, 130, 740, 300], ['windows', 3, 140, 160, 300, '#ff9e7a', '#ffe0a8'], ['floor', '#7d5a3d', 640], ['desks', '#5b3f2a', 600], ['tint', '#ff7a3c', .12]],
      desc: 'тот же класс вечером: тёплый оранжевый закатный свет из окон, длинные тени от парт, пустые ряды', },
    club_room: { title: 'Клуб «Нулевая точка»', tier: 1, recipe: [['wall', '#d8c7aa', '#a98f6e'], ['board', 90, 110, 560, 300], ['windows', 2, 120, 170, 250, '#8fd3ff', '#fdf3d7'], ['floor', '#7f5f43', 650], ['sofa', '#6c7ea8'], ['bed', '#00000000'], ['glow', 4, '#ffe9a8', 3]],
      desc: 'уютная клубная комната под крышей: старый диван, чайник и кружки, доска с формулами, стеллаж с книгами, гирлянда, тёплый дневной свет', },
    club_evening: { title: 'Клуб, вечер', tier: 2, recipe: [['wall', '#7b5a4a', '#3e2a2a'], ['board', 90, 110, 560, 300], ['windows', 2, 120, 170, 250, '#ff9e7a', '#7f6aa6'], ['floor', '#4a3426', 650], ['sofa', '#44507a'], ['glow', 6, '#ffbf69', 6], ['tint', '#2a1020', .12]],
      desc: 'клубная комната вечером: включена лампа и гирлянда, за окном закат, на столе чай и тетради, уютно и тепло', },
    canteen: { title: 'Столовая', tier: 1, recipe: [['wall', '#f1e6d0', '#d8c6a4'], ['windows', 3, 150, 150, 200, '#8fd3ff', '#fdf3d7'], ['floor', '#b79a73', 640], ['tables', '#8a6a48'], ['glow', 3, '#fff7c9', 8]],
      desc: 'светлая школьная столовая с длинными деревянными столами, окна на озеро, раздача с кастрюлями, утренний свет', },
    library: { title: 'Библиотека', tier: 2, recipe: [['wall', '#6b4a35', '#3b281d'], ['shelves', '#4a3224', 40], ['glow', 5, '#ffcf7a', 12], ['tint', '#ffb35c', .10]],
      desc: 'старая библиотека до потолка в книгах, лестница-стремянка, читальные столы с зелёными лампами, пыль в лучах вечернего солнца', },
    lake_beach: { title: 'Озеро, пляж, день', tier: 1, recipe: [...DAYLAKE, ['hills', '#6aa87a', 430, 60], ['water', 470, '#82d2ee', '#3b97cb'], ['ground', '#f0dfae', 700]],
      desc: 'песчаный пляж на берегу озера, чистая вода, сосны вдали, деревянный пирс, яркий солнечный день', },
    lake_sunset: { title: 'Озеро, закат', tier: 1, recipe: [...EVELAKE, ['hills', '#4a5f6e', 450, 70], ['water', 480, '#f3a47c', '#6a5a9a'], ['ground', '#c8a87a', 720]],
      desc: 'тот же берег озера на закате: розово-оранжевое небо, золотая дорожка на воде, силуэты сосен, романтично и спокойно', },
    lake_road: { title: 'Дорога вдоль озера', tier: 3, recipe: [...DAYLAKE.slice(0, 2), ['hills', '#6aa87a', 400, 60], ['water', 440, '#82d2ee', '#3b97cb'], ['trees', '#3f8a4f', 520, 8, 4, 230], ['ground', '#a6c97e', 560], ['road', '#c9c1b2']],
      desc: 'асфальтовая дорога вдоль озера, по бокам деревья и трава, лето, вдали холмы; подходит для велопрогулки', },
    forest_path: { title: 'Лесная тропа', tier: 2, recipe: [['sky', '#cfe9d0', '#f3f0c9'], ['pines', '#2f6b4a', 600, 10, 6, 420], ['pines', '#1f5238', 700, 7, 9, 520], ['ground', '#6b5a3a', 700], ['glow', 5, '#fff3b0', 14]],
      desc: 'лесная тропа между высокими соснами, косые лучи солнца, мох и папоротники, свежо и немного таинственно', },
    mountain_fog: { title: 'Холм в тумане', tier: 2, recipe: [['sky', '#cfd8e3', '#eef1f4'], ['mountains', '#9db0c2', 520], ['pines', '#5e7b6e', 680, 8, 3, 360], ['fog', .7], ['ground', '#7d8f78', 760]],
      desc: 'склон холма с соснами, сильный утренний туман, видимость мала, вдали проступает силуэт озера внизу', },
    campfire_night: { title: 'Костёр, ночь', tier: 2, recipe: [...NIGHT, ['pines', '#08101a', 720, 9, 12, 420], ['ground', '#10151f', 730], ['fire', 800, 720]],
      desc: 'ночной костёр на поляне у озера, искры, звёздное небо, брёвна вокруг костра, тёплый свет на деревьях', },
    rooftop_night: { title: 'Крыша, ночь', tier: 2, recipe: [...NIGHT, ['hills', '#0c1230', 600, 40], ['ground', '#1a2040', 700], ['rails']],
      desc: 'плоская крыша лицея ночью, перила, огромное звёздное небо и Млечный путь, вдали огни озера, тихо', },
    dorm_room: { title: 'Комната в общежитии', tier: 2, recipe: [['wall', '#e0cfb5', '#bca57f'], ['windows', 1, 300, 240, 220, '#ff9e7a', '#ffe0a8'], ['floor', '#8a6a48', 660], ['bed', '#c9546a'], ['glow', 3, '#ffe9a8', 15]],
      desc: 'маленькая комната в общежитии: кровать, письменный стол с лампой, окно на озеро, постеры и гирлянда, вечер', },
    rain_window: { title: 'Дождь за окном', tier: 3, recipe: [['sky', '#51647d', '#8a9bb0'], ['pines', '#2a3b44', 650, 10, 4, 400], ['rain'], ['windows', 2, 520, 600, 120, '#51647d', '#8a9bb0', '#e8dcc4']],
      desc: 'окно клубной комнаты во время ливня: капли на стекле, серое небо, сосны за окном, уют внутри, тусклый тёплый свет', },
    fair: { title: 'Ярмарка', tier: 2, recipe: [['sky', '#9fd8ff', '#fdf3d7'], ['clouds', 4, 5], ['trees', '#3f8a4f', 480, 8, 6, 220], ['ground', '#b9cf8a', 520], ['tents', 3], ['lanterns', 10, 190, 8]],
      desc: 'летняя ярмарка на площади лицея: разноцветные палатки-аттракционы, гирлянды флажков и фонариков, толпа без лиц, день', },
    old_lab: { title: 'Старая лаборатория «Горизонт»', tier: 1, recipe: [['wall', '#2c3a4a', '#18222e'], ['equipment'], ['monitors'], ['floor', '#202a36', 690], ['glow', 4, '#7fd1c7', 17], ['tint', '#0a1a20', .10]],
      desc: 'заброшенная квантовая лаборатория: криостат с блестящими золотистыми трубками, пыльные столы с мониторами, доски в формулах, голубоватый свет, паутина, ощущение тайны', },
    server_room: { title: 'Компьютерный класс, ночь', tier: 3, recipe: [['wall', '#141a2b', '#0b0f1c'], ['monitors'], ['floor', '#0f1424', 700], ['glow', 5, '#63e6be', 19]],
      desc: 'тёмный компьютерный класс ночью: ряды мониторов с кодом, зелёные и голубые огни серверной стойки, чашки с остывшим кофе', },
    festival_stage: { title: 'Сцена фестиваля', tier: 1, recipe: [['sky', '#2a1f4d', '#a45a7a'], ['stars', 60, 4], ['pines', '#150f2a', 600, 9, 5, 380], ['stage'], ['lanterns', 12, 140, 6]],
      desc: 'открытая сцена фестиваля вечером у озера: гирлянды, прожекторы, экран с надписью без текста, зрители-силуэты, праздничное настроение', },
    black: { title: 'Чёрный экран', tier: 0, recipe: [['wall', '#000', '#000']], desc: 'служебный', }
  };

  Object.keys(BG).forEach(id => {
    const b = BG[id]; b.id = id;
    b.prompt = b.tier === 0 ? '' : 'Anime visual novel background: ' + (BG_EN[id] || b.desc) + BG_TAIL;
    b.svg = svgBg(b.recipe);
  });

  const MOODS_ALL = ['neutral', 'happy', 'think', 'shy', 'sad', 'angry', 'surprised'];

  const STYLE_REF = 'Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). ';
  const CH = {
    mira: { bio: 'Куратор клуба. Спокойная, остроумная, строгая к пониманию и добрая к людям. Любимый вопрос: «Почему?». О её прошлом в лаборатории «Горизонт» лучше спрашивать осторожно.', id: 'mira', name: 'Мира-сэнсэй', color: '#f472b6', tier: 0, role: 'куратор клуба, математик-физик',
      look: { skin: '#f1c7a6', hair: '#2a1a1a', eyes: '#3a2a2a', style: 'long', glasses: true, outfit: '#2b3a6b', accent: '#b23a48' },
      desc: 'Куратор клуба, бывшая сотрудница квантовой лаборатории. Спокойная, остроумная, строгая к пониманию и добрая к людям. Картинки neutral/happy/think уже готовы.',
      appearance: '' },
    yuna: { bio: 'Бегунья с рыжим хвостом, громче всех смеётся и уверена, что математика не для неё. Зато умеет вести за собой и никогда не сдаётся на последних метрах.', id: 'yuna', name: 'Юна', color: '#fb923c', tier: 1, role: 'спортсменка, «математика не для меня»',
      look: { skin: '#f6cfae', hair: '#e8793a', eyes: '#3f9d5a', style: 'ponytail', glasses: false, outfit: '#3d6fd1', accent: '#ffffff' },
      desc: '18 лет, бегунья, шумная и добрая, смеётся громче всех, уверена, что «математика не для неё». Через неё идёт тема «ошибка — это данные».',
      appearance: 'a cheerful 18-year-old girl athlete, short-to-medium copper-orange hair tied in a high ponytail with a small white sports headband, big bright green eyes, warm tan skin, wearing the school summer uniform: white short-sleeve shirt, blue-and-white athletic zip jacket tied around her waist, short pleated skirt with athletic shorts, running sneakers, energetic confident posture' },
    sonya: { bio: 'Живёт в библиотеке и пишет стихи. Говорит тихо, но видит красоту там, где другие видят только знаки. Очень боится выступать.', id: 'sonya', name: 'Соня', color: '#a78bfa', tier: 1, role: 'тихая библиотекарь, пишет стихи',
      look: { skin: '#f7dccb', hair: '#e9e6f2', eyes: '#8a8fe0', style: 'long', glasses: false, outfit: '#7b6fb0', accent: '#f4e6ff' },
      desc: '18 лет, тихая, живёт в библиотеке, пишет стихи и видит красоту в формулах. Боится выступать. Через неё идёт тема красоты математики и выступления.',
      appearance: 'a shy 18-year-old girl, very long straight silvery-white hair with side-swept bangs and a thin lilac hairpin, large soft lavender-blue eyes, pale skin, wearing the school uniform with a long oversized lilac cardigan with sleeves covering her hands, holding a small notebook against her chest, timid gentle expression' },
    avrora: { bio: 'Староста лицея и главная отличница. Строгая, прямая и колкая, потому что от неё привыкли ждать только идеала. Соперница, из которой может выйти лучший друг.', id: 'avrora', name: 'Аврора', color: '#c084fc', tier: 1, role: 'староста, отличница, перфекционистка',
      look: { skin: '#f3d3bf', hair: '#3b2160', eyes: '#9a5bd6', style: 'twin', glasses: false, outfit: '#2c2f55', accent: '#d9b84a' },
      desc: '19 лет, староста лицея, отличница, соперница героя. Строгая, прямая, под давлением ожиданий. Через неё идёт тема доказательств, ошибок и перфекционизма.',
      appearance: 'a poised 19-year-old girl class president, long dark-violet hair worn straight with a sharp high ponytail, amethyst purple eyes with a stern confident look, fair skin, wearing a crisp school blazer in dark navy with gold trim, white shirt, thin tie and a green class-president armband, upright posture, arms sometimes crossed' },
    nika: { bio: 'Ночной кодер в больших наушниках. Отвечает коротко и с сарказмом, прячется за ноутбуком. Алгоритмы любит больше, чем людей, но, кажется, не совсем.', id: 'nika', name: 'Ника', color: '#2dd4bf', tier: 1, role: 'гик, алгоритмы и код ночами',
      look: { skin: '#f1cdb4', hair: '#27c4b0', eyes: '#2a3a55', style: 'bob', glasses: false, outfit: '#2f3b4f', accent: '#ff5d8f', headphones: true },
      desc: '18 лет, ночной кодер, наушники никогда не снимает, прячется за ноутбуком от людей. Через неё идут алгоритмы, графы и тема «вернуться к людям».',
      appearance: 'a tired but clever 18-year-old girl hacker, short teal-turquoise bob haircut with uneven bangs, sleepy half-lidded dark-blue eyes with faint dark circles, big over-ear headphones around her neck, an oversized dark hoodie with a small pink pixel-heart print over the school uniform, a laptop under her arm, slight smirk' },
    director: { id: 'director', name: 'Директор Орлов', color: '#94a3b8', tier: 3, role: 'директор лицея (эпизодический)',
      look: { skin: '#e8c4a8', hair: '#8a8a95', eyes: '#3a3a45', style: 'short', glasses: true, outfit: '#3a3f4f', accent: '#d9b84a' },
      desc: 'Валентин Сергеевич Орлов, директор лицея. Деловой и прагматичный, не злодей: ему нужны результаты, а не красота. Появляется редко. Картинка необязательна.',
      appearance: 'a dignified middle-aged man, school director, short grey hair, rectangular glasses, dark grey suit with a gold lapel pin, calm stern face with a hint of warmth, anime style, mature proportions' }
  };

  const CH_MOOD_TXT = {
    neutral: 'calm natural expression, relaxed pose',
    happy: 'bright happy smile, eyes closed or sparkling, cheerful pose',
    think: 'thoughtful expression, finger near chin, eyes looking aside',
    shy: 'embarrassed blushing expression, looking away, hands fidgeting',
    sad: 'sad downcast expression, slightly teary eyes',
    angry: 'annoyed puffed-cheek or stern frowning expression, arms crossed',
    surprised: 'surprised wide-open eyes and open mouth'
  };
  Object.values(CH).forEach(c => {
    c.moodsTier1 = ['neutral'];
    c.moodsTier2 = ['happy', 'think', 'shy', 'sad', 'angry', 'surprised'];
    c.prompts = {};
    MOODS_ALL.forEach(m => {
      if (!c.appearance) return;
      c.prompts[m] = (m === 'neutral' ? '' : STYLE_REF + 'Same character as before (same face, hair and outfit). ') +
        'Anime visual novel character sprite, ' + c.appearance + '. Expression: ' + CH_MOOD_TXT[m] + '. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, ' + STYLE + '. Transparent background (PNG), no text, no watermark, no background objects.';
    });
  });

  function charSvg(id, mood) {
    const c = CH[id]; if (!c) return '';
    const L = c.look, m = mood || 'neutral';
    const hairBack = L.style === 'long' ? `<path d="M118 190c-26 120 4 220 22 250h120c18-30 48-130 22-250z" fill="${L.hair}"/>`
      : L.style === 'twin' ? `<path d="M120 190c-30 100-50 200-30 260h40c-4-70 0-150 10-200zM280 190c30 100 50 200 30 260h-40c4-70 0-150-10-200z" fill="${L.hair}"/>`
        : L.style === 'ponytail' ? `<path d="M270 130c60 10 90 70 70 180c-10-60-30-100-70-110z" fill="${L.hair}"/>` : '';
    const hairTop = L.style === 'bob'
      ? `<path d="M122 205c-6-110 40-150 80-150s86 40 78 150c-6-30-12-60-30-78-30 20-90 20-130 0-12 20-14 48-18 78z" fill="${L.hair}"/><path d="M118 190v70h26v-70zM256 190v70h26v-70z" fill="${L.hair}"/>`
      : L.style === 'short' ? `<path d="M130 160c0-70 30-100 72-100s70 30 68 100c-20-30-40-40-68-40s-52 10-72 40z" fill="${L.hair}"/>`
        : `<path d="M122 205c-6-110 40-150 80-150s86 40 78 150c-10-40-20-70-40-86-40 30-80 30-120 0-10 16-14 46-18 86z" fill="${L.hair}"/>`;
    const eyeY = 205, eyes = {
      happy: [-1, 1].map(s => `<path d="M${200 + s * 40 - 16} ${eyeY + 4}q16 -22 32 0" stroke="#2a1a1a" stroke-width="5" fill="none" stroke-linecap="round"/>`).join(''),
      shy: [-1, 1].map(s => `<ellipse cx="${200 + s * 40 + 6}" cy="${eyeY}" rx="11" ry="14" fill="${L.eyes}"/><circle cx="${200 + s * 40 + 10}" cy="${eyeY - 4}" r="4" fill="#fff"/>`).join('') + `<ellipse cx="146" cy="232" rx="16" ry="8" fill="#ff8fa3" opacity=".55"/><ellipse cx="254" cy="232" rx="16" ry="8" fill="#ff8fa3" opacity=".55"/>`,
      sad: [-1, 1].map(s => `<ellipse cx="${200 + s * 40}" cy="${eyeY + 2}" rx="11" ry="14" fill="${L.eyes}"/><circle cx="${200 + s * 40 + 3}" cy="${eyeY - 3}" r="4" fill="#fff"/><path d="M${200 + s * 40 - 16} ${eyeY - 22}l${s * 24} ${-s * -8 - 4}" stroke="#2a1a1a" stroke-width="4"/>`).join(''),
      angry: [-1, 1].map(s => `<ellipse cx="${200 + s * 40}" cy="${eyeY + 3}" rx="11" ry="12" fill="${L.eyes}"/><circle cx="${200 + s * 40 + 3}" cy="${eyeY}" r="4" fill="#fff"/><path d="M${200 + s * 40 - 20} ${eyeY - 20 + (s > 0 ? 10 : 0)}L${200 + s * 40 + 20} ${eyeY - 20 + (s > 0 ? 0 : 10)}" stroke="#2a1a1a" stroke-width="5"/>`).join(''),
      surprised: [-1, 1].map(s => `<ellipse cx="${200 + s * 40}" cy="${eyeY}" rx="14" ry="18" fill="#fff" stroke="#2a1a1a" stroke-width="3"/><circle cx="${200 + s * 40}" cy="${eyeY}" r="8" fill="${L.eyes}"/>`).join('')
    }[m] || [-1, 1].map(s => `<ellipse cx="${200 + s * 40}" cy="${eyeY}" rx="11" ry="14" fill="${L.eyes}"/><circle cx="${200 + s * 40 + 3}" cy="${eyeY - 4}" r="4" fill="#fff"/>` + (m === 'think' && s > 0 ? `<path d="M${200 + s * 40 - 16} ${eyeY - 26}q16 -8 32 -2" stroke="#2a1a1a" stroke-width="4" fill="none"/>` : '')).join('');
    const mouth = {
      happy: '<path d="M178 262q22 28 44 0z" fill="#b2394a"/>',
      shy: '<path d="M186 266q14 8 28 0" stroke="#a5424f" stroke-width="4" fill="none" stroke-linecap="round"/>',
      sad: '<path d="M184 272q16 -14 32 0" stroke="#a5424f" stroke-width="4" fill="none" stroke-linecap="round"/>',
      angry: '<path d="M184 270h32" stroke="#a5424f" stroke-width="5" stroke-linecap="round"/>',
      surprised: '<ellipse cx="200" cy="268" rx="9" ry="12" fill="#b2394a"/>',
      think: '<path d="M188 266q12 5 24 -2" stroke="#a5424f" stroke-width="4" fill="none" stroke-linecap="round"/>'
    }[m] || '<path d="M184 264q16 12 32 0" stroke="#a5424f" stroke-width="4" fill="none" stroke-linecap="round"/>';
    const glasses = L.glasses ? `<g fill="none" stroke="#222" stroke-width="4"><rect x="144" y="186" width="48" height="40" rx="12"/><rect x="208" y="186" width="48" height="40" rx="12"/><path d="M192 204h16"/></g>` : '';
    const phones = L.headphones ? `<path d="M126 190c0-80 150-80 148 0" stroke="#222" stroke-width="12" fill="none"/><rect x="112" y="176" width="26" height="50" rx="10" fill="#222"/><rect x="262" y="176" width="26" height="50" rx="10" fill="${L.accent}"/>` : '';
    const body = `<rect x="176" y="270" width="48" height="90" fill="${L.skin}"/><path d="M30 700c0-210 60-340 170-340s170 130 170 340z" fill="${L.outfit}"/><path d="M164 348l36 90 36-90z" fill="#fff" opacity=".92"/><path d="M200 438l-22-70M200 438l22-70" stroke="${L.accent}" stroke-width="6" stroke-linecap="round"/>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700">${hairBack}${body}<ellipse cx="200" cy="200" rx="76" ry="88" fill="${L.skin}"/>${hairTop}${eyes}${mouth}${glasses}${phones}</svg>`;
  }

  function bgCss(id) {
    const b = BG[id] || BG.black;
    return 'url("data:image/svg+xml;utf8,' + encodeURIComponent(b.svg) + '")';
  }

  const bgCache = {};
  function resolveBg(id, cb) {
    if (bgCache[id] !== undefined) return cb(bgCache[id]);
    const exts = ['jpg', 'png', 'webp', 'jpeg'];
    let i = 0;
    (function next() {
      if (i >= exts.length) { bgCache[id] = null; return cb(null); }
      const u = 'assets/bg_' + id + '.' + exts[i++]; const im = new Image();
      im.onload = () => { bgCache[id] = u; cb(u); }; im.onerror = next; im.src = u;
    })();
  }
  function setBg(el, id) {
    el.dataset.bg = id;
    el.style.backgroundImage = bgCss(id);
    if (id === 'black') return;
    resolveBg(id, u => { if (u && el.dataset.bg === id) el.style.backgroundImage = 'url("' + u + '")'; });
  }

  const spCache = {};
  const EXTS = ['png', 'webp', 'jpg', 'jpeg', 'gif'];
  function resolveChar(id, mood, cb) {
    const key = id + ':' + mood;
    if (spCache[key] !== undefined) return cb(spCache[key]);
    const cfg = (window.SPRITES || {})[key] || (id === 'mira' ? (window.SPRITES || {})[mood] : null);
    if (cfg) { spCache[key] = cfg; return cb(cfg); }
    const list = EXTS.map(e => 'assets/' + id + '_' + mood + '.' + e);
    let i = 0;
    (function next() {
      if (i >= list.length) {
        if (mood !== 'neutral') return resolveChar(id, 'neutral', u => { spCache[key] = u; cb(u); });
        spCache[key] = null; return cb(null);
      }
      const im = new Image(), u = list[i++];
      im.onload = () => { spCache[key] = u; cb(u); }; im.onerror = next; im.src = u;
    })();
  }
  function putChar(box, id, mood) {
    const m = MOODS_ALL.indexOf(mood) < 0 ? 'neutral' : mood;
    box.dataset.want = id + ':' + m;
    resolveChar(id, m, u => {
      if (box.dataset.want !== id + ':' + m) return;
      if (!u) { box.innerHTML = charSvg(id, m); return; }
      box.innerHTML = /\.(webm|mp4|mov)$/i.test(u) ? '<video src="' + u + '" autoplay loop muted playsinline></video>' : '<img src="' + u + '" alt="' + (CH[id] ? CH[id].name : id) + '">';
    });
    if (!box.firstChild) box.innerHTML = charSvg(id, m);
  }

  window.WORLD = { BG, CH, MOODS: MOODS_ALL, setBg, putChar, charSvg, resolveChar, bgCss };
})();

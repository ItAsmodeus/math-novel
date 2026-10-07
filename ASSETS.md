# Графика для новеллы «Горизонт · Формула лета»

Этот файл описывает **все фоны и всех персонажей**, которые нужны игре, вместе с готовыми промптами для генерации (ChatGPT / любой генератор картинок). Игра работает уже сейчас: пока картинок нет, она рисует **запасные** сцены и силуэты. Каждая загруженная картинка автоматически заменяет свою заглушку, ничего менять в коде не нужно.

## Как работает подстановка

- Фон: `assets/bg_<id>.jpg` (подойдёт также `.png`/`.webp`).
- Персонаж: `assets/<id>_<настроение>.png` (подойдёт также `.webp`/`.gif`/`.jpg`). **Прозрачный фон обязателен** (PNG с альфа-каналом). Если для настроения нет файла, игра берёт `<id>_neutral`, а если и его нет, рисует силуэт.
- Мира: `assets/mira_neutral.png`, `mira_happy.png`, `mira_think.png` (уже готовы). Остальные её настроения (shy, sad, angry, surprised) пока подставляются нейтральным кадром.
- Анимацию можно подложить позже теми же именами (`.webp`/`.gif`) или `.webm` через `js/sprites.js`.

## Как генерировать, чтобы всё выглядело одной игрой

1. **Один стиль.** Загрузи в чат с генератором одну готовую картинку Миры и пиши: «draw in exactly the same art style as this reference image». Промпты персонажей уже содержат эту фразу.
2. **Один персонаж = один чат.** Сначала генерируй `neutral`, потом в том же чате остальные настроения («same character as before…»). Так лицо и одежда совпадут.
3. **Фоны: стиль и композиция.** В каждом промпте уже заданы стиль (детальная цифровая живопись с мягким cel-шейдингом, как у героинь), свет, палитра и композиция: центр и нижняя треть остаются свободными, потому что туда встаёт персонаж и окно диалога. Для единого вида: сначала сделай **один тестовый фон** (например, `gate`), приложи к следующим запросам его и один спрайт героини как образец («same art style, color treatment and line quality as these references»). Если фон вышел слишком «фотореалистичным», добавь `flat cel-shaded, painterly`; если слишком мягким, добавь `crisp line art, sharper details`; если в центре много предметов, добавь `empty open space in the center`.
4. **Прозрачный фон у персонажей.** Если генератор не даёт прозрачность и рисует фон, скажи мне: я вырежу фон скриптом.
5. Любую картинку можно переделать: просто положи новый файл с тем же именем поверх.

## Что генерировать в первую очередь

**Минимальный набор (13 картинок)** уже сильно оживит игру: 9 фонов уровня 1 и 4 «нейтральных» спрайта героинь. Остальное можно добавлять постепенно.

| Уровень | Что | Сколько |
|---|---|---|
| 1 | фоны уровня 1 (ниже) + нейтральные спрайты Юны, Сони, Авроры, Ники | 9 фонов + 4 спрайта |
| 2 | фоны уровня 2 + настроения `happy`, `think`, `shy` у каждой героини | 10 фонов + 12 спрайтов |
| 3 | фоны уровня 3 + настроения `sad`, `angry`, `surprised`; директор | 4 фонов + 12 спрайтов + директор |

---

## Статус: что уже лежит в assets/ и что осталось сгенерировать

(Таблицы собираются автоматически по реальным файлам в папке assets/.)

### Персонажи (главный кадр — neutral, остальные настроения необязательны)

| Персонаж | neutral | happy | think | shy | sad | angry | surprised |
|---|---|---|---|---|---|---|---|
| Мира-сэнсэй | ✅ | ✅ | ✅ | — (neutral) | — (neutral) | — (neutral) | — (neutral) |
| Вега | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Юна | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Соня | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Аврора | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Ника | ✅ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |
| Директор Орлов | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ | ⬜ |

### Фоны

| Фон | Уровень | Статус |
|---|---|---|
| `station_day` — Станция у озера, утро | 1 | ⬜ нужен |
| `station_sunset` — Станция, закат (проводы) | 3 | ⬜ нужен |
| `gate` — Ворота лицея «Горизонт» | 1 | ⬜ нужен |
| `school_hall` — Коридор лицея | 2 | ⬜ нужен |
| `classroom_day` — Класс, день | 1 | ⬜ нужен |
| `classroom_evening` — Класс, вечер | 2 | ⬜ нужен |
| `club_room` — Клуб «Нулевая точка» | 1 | ⬜ нужен |
| `club_evening` — Клуб, вечер | 2 | ⬜ нужен |
| `canteen` — Столовая | 1 | ⬜ нужен |
| `library` — Библиотека | 2 | ⬜ нужен |
| `lake_beach` — Озеро, пляж, день | 1 | ⬜ нужен |
| `lake_sunset` — Озеро, закат | 1 | ⬜ нужен |
| `lake_road` — Дорога вдоль озера | 3 | ⬜ нужен |
| `forest_path` — Лесная тропа | 2 | ⬜ нужен |
| `mountain_fog` — Холм в тумане | 2 | ⬜ нужен |
| `campfire_night` — Костёр, ночь | 2 | ⬜ нужен |
| `rooftop_night` — Крыша, ночь | 2 | ⬜ нужен |
| `dorm_room` — Комната в общежитии | 2 | ⬜ нужен |
| `rain_window` — Дождь за окном | 3 | ⬜ нужен |
| `fair` — Ярмарка | 2 | ⬜ нужен |
| `old_lab` — Старая лаборатория «Горизонт» | 1 | ✅ есть |
| `phys_lab` — Физическая лаборатория (южное крыло) | 1 | ✅ есть |
| `server_room` — Компьютерный класс, ночь | 3 | ⬜ нужен |
| `festival_stage` — Сцена фестиваля | 1 | ⬜ нужен |

**Следующий шаг:** фоны уровня 1, которых ещё нет: `station_day`, `gate`, `classroom_day`, `club_room`, `canteen`, `lake_beach`, `lake_sunset`, `festival_stage`. Пока файла нет, игра рисует запасную сцену, поэтому играть можно всегда.

---

## Фоны

Формат: 16:9, 1920×1080 (или больше), без людей и без текста.

### Уровень 1

#### `station_day`: Станция у озера, утро
- **Файл:** `assets/bg_station_day.jpg`
- **Где используется:** День 0 (приезд, утро)
- **Описание:** маленькая железнодорожная станция на берегу озера, платформа с навесом, рельсы, сосны, утро, яркое летнее небо.
- **Промпт:**

```
Anime visual novel background: a small provincial railway station on a calm lake shore on an early summer morning: a low platform with a wooden canopy roof and an old bench, a single track curving away along the water, a dense pine forest on the far shore, a fresh blue sky with soft cumulus clouds, long cool morning shadows. Palette: fresh greens, sky blue, warm weathered wood. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `gate`: Ворота лицея «Горизонт»
- **Файл:** `assets/bg_gate.jpg`
- **Где используется:** День 0 (ворота, встреча с Мирой), День 7
- **Описание:** парадные кованые ворота старого лицея-интерната, за ними аллея и белое здание с красной крышей, лето, зелень.
- **Промпт:**

```
Anime visual novel background: the entrance of an old summer boarding lyceum: tall ornate wrought-iron gates with circular and sine-wave patterns in the metal, stone pillars, a wide tree-lined gravel alley behind them leading to a white two-storey building with a red roof and a small clock tower, lush summer foliage, bright midday sun. Palette: fresh green, white, brick red. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `classroom_day`: Класс, день
- **Файл:** `assets/bg_classroom_day.jpg`
- **Где используется:** фон уроков с Мирой (все дни) и утренних сцен в классе
- **Описание:** просторный школьный класс днём: зелёная меловая доска, ряды деревянных парт, большие окна с летним светом, на подоконниках цветы.
- **Промпт:**

```
Anime visual novel background: a spacious school classroom in daytime: a large green chalkboard with faint chalk formulas and a circle-with-a-dot emblem in the corner, rows of old wooden desks, big windows on the left with summer trees outside, flowers on the windowsill, sunlight beams across the floor, a teacher's desk with a stack of notebooks. Palette: warm wood, chalk green, bright daylight. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `club_room`: Клуб «Нулевая точка»
- **Файл:** `assets/bg_club_room.jpg`
- **Где используется:** клуб «Нулевая точка»: дни 0, 6, 12, 14
- **Описание:** уютная клубная комната под крышей: старый диван, чайник и кружки, доска с формулами, стеллаж с книгами, гирлянда, тёплый дневной свет.
- **Промпт:**

```
Anime visual novel background: a cozy attic club room under a sloped wooden ceiling: a worn sofa with plaid blankets, a low table with a kettle and mismatched mugs, a big chalkboard with mathematical formulas and a painted circle-with-a-dot emblem, a bookshelf crammed with books and models, hanging string lights, a round attic window with daylight, a few potted plants. Palette: warm wood, soft cream, muted blue and green accents. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `canteen`: Столовая
- **Файл:** `assets/bg_canteen.jpg`
- **Где используется:** завтраки и обеды: дни 1, 9
- **Описание:** светлая школьная столовая с длинными деревянными столами, окна на озеро, раздача с кастрюлями, утренний свет.
- **Промпт:**

```
Anime visual novel background: a bright school canteen in the morning: long wooden tables and benches in rows, large windows showing the lake and pines, a serving counter with steaming pots and trays, a chalk menu board without legible text, bowls of fruit, sunlight on the tables, clean and lively atmosphere. Palette: warm wood, fresh green, soft yellow light. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `lake_beach`: Озеро, пляж, день
- **Файл:** `assets/bg_lake_beach.jpg`
- **Где используется:** озеро днём: дни 2, 9
- **Описание:** песчаный пляж на берегу озера, чистая вода, сосны вдали, деревянный пирс, яркий солнечный день.
- **Промпт:**

```
Anime visual novel background: a sandy beach on a clear mountain lake on a bright summer day: gentle waves, a wooden pier reaching into the water, a few overturned boats, a ring of tall pines, white clouds, sparkling water, distant hills. Palette: turquoise, sand gold, deep pine green, bright blue sky. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `lake_sunset`: Озеро, закат
- **Файл:** `assets/bg_lake_sunset.jpg`
- **Где используется:** закаты у озера: дни 2, 3, 8, 10, 15, 16
- **Описание:** тот же берег озера на закате: розово-оранжевое небо, золотая дорожка на воде, силуэты сосен, романтично и спокойно.
- **Промпт:**

```
Anime visual novel background: the same lake shore at sunset: a pink-orange sky with streaked clouds, a golden reflection path across calm water, dark silhouettes of pines and the wooden pier, soft warm rim light on the sand, calm and slightly romantic mood. Palette: peach, rose, gold, deep violet-blue shadows. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `old_lab`: Старая лаборатория «Горизонт»
- **Файл:** `assets/bg_old_lab.jpg`
- **Где используется:** лаборатория: дни 7, 9, 15, 16
- **Описание:** заброшенная квантовая лаборатория: криостат с блестящими золотистыми трубками, пыльные столы с мониторами, доски в формулах, голубоватый свет, паутина, ощущение тайны.
- **Промпт:**

```
Anime visual novel background: an abandoned quantum laboratory: a gold-colored cryostat with intricate tubes hanging from the ceiling, dusty desks with old monitors and cables, whiteboards full of faded formulas, a bluish cold glow from a few still-running panels, cobwebs, a slice of daylight from a high dusty window, a sense of mystery and unfinished work. Palette: teal, deep blue, brass gold, grey dust. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```


#### `phys_lab`: Физическая лаборатория (южное крыло)
- **Файл:** `assets/bg_phys_lab.jpg`
- **Где используется:** все уроки физики с Вегой (P00–P15), большинство полуденных сцен
- **Описание:** светлая физическая лаборатория-класс в южном крыле: оптический стол с лазером, маятник под потолком, осциллограф, катушки, доска со схемами волн и орбит, окно на озеро.
- **Промпт:**

```
Anime visual novel background: a bright physics laboratory classroom in the south wing of an old lyceum: a long black optical table with a small red laser beam bouncing between tiny mirrors, a tall pendulum on a thin wire hanging from the high ceiling, wooden lab benches with an old oscilloscope, copper coils, a glass bell jar and brass instruments, a large whiteboard covered with sketches of waves, orbits and arrows, shelves of glass jars and books, a big window on the left showing the lake and pines in summer light, a slightly chaotic but cozy scientific mood. Palette: warm cream walls, brass and copper, sage green, a red laser accent. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `festival_stage`: Сцена фестиваля
- **Файл:** `assets/bg_festival_stage.jpg`
- **Где используется:** Фестиваль: день 16
- **Описание:** открытая сцена фестиваля вечером у озера: гирлянды, прожекторы, экран с надписью без текста, зрители-силуэты, праздничное настроение.
- **Промпт:**

```
Anime visual novel background: an open-air festival stage by a lake at dusk: strings of warm lights across the stage, spotlights cutting through the evening haze, a large blank screen behind the stage, rows of chairs and silhouetted audience far back, lake and pines in the background, a festive and hopeful mood. Palette: purple dusk sky, warm gold lights, deep blue water. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

### Уровень 2

#### `school_hall`: Коридор лицея
- **Файл:** `assets/bg_school_hall.jpg`
- **Где используется:** коридор: переходы между сценами, дни 0, 5, 12, 14
- **Описание:** длинный светлый школьный коридор со старым паркетом, высокие окна по одной стороне, стенды, доски объявлений, дневной свет.
- **Промпт:**

```
Anime visual novel background: a long bright school corridor in an old building: warm wooden parquet floor, tall arched windows on the left casting bright rectangles of sunlight, notice boards with colorful flyers, a row of lockers, potted plants at the windows, dust motes in the light, perspective vanishing toward a far door. Palette: warm cream walls, golden light, soft green accents. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `classroom_evening`: Класс, вечер
- **Файл:** `assets/bg_classroom_evening.jpg`
- **Где используется:** вечерние уроки и разговоры в классе
- **Описание:** тот же класс вечером: тёплый оранжевый закатный свет из окон, длинные тени от парт, пустые ряды.
- **Промпт:**

```
Anime visual novel background: the same classroom in the evening: deep orange sunset light pouring through the windows, long dramatic shadows of desks across the floor, the green chalkboard glowing faintly, an empty and peaceful atmosphere, a few papers on a desk. Palette: amber, orange, deep brown, muted green. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `club_evening`: Клуб, вечер
- **Файл:** `assets/bg_club_evening.jpg`
- **Где используется:** клубные вечера: дни 0–3, 5, 6, 12, 14
- **Описание:** клубная комната вечером: включена лампа и гирлянда, за окном закат, на столе чай и тетради, уютно и тепло.
- **Промпт:**

```
Anime visual novel background: the same cozy attic club room in the evening: a desk lamp and string lights glowing warmly, sunset orange light through the round window, steam rising from mugs of tea, open notebooks on the low table, soft long shadows, intimate and homey mood. Palette: honey amber, warm brown, dusk purple in the window. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `library`: Библиотека
- **Файл:** `assets/bg_library.jpg`
- **Где используется:** Соня: дни 3, 12
- **Описание:** старая библиотека до потолка в книгах, лестница-стремянка, читальные столы с зелёными лампами, пыль в лучах вечернего солнца.
- **Промпт:**

```
Anime visual novel background: an old two-level school library at sunset: floor-to-ceiling wooden bookshelves, a rolling ladder, a spiral staircase to a gallery, reading tables with green banker lamps, a round window with golden sunbeams full of floating dust, a cozy nook with an armchair. Palette: deep brown, gold, muted green, lavender shadows. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `forest_path`: Лесная тропа
- **Файл:** `assets/bg_forest_path.jpg`
- **Где используется:** лагерный квест и поход: дни 4, 10
- **Описание:** лесная тропа между высокими соснами, косые лучи солнца, мох и папоротники, свежо и немного таинственно.
- **Промпт:**

```
Anime visual novel background: a forest trail between tall pines on a bright morning: slanting sunbeams through the trunks, moss, ferns and mushrooms, a winding earth path with roots, a hint of mist, a mossy boulder, fresh and slightly mysterious mood. Palette: emerald and deep green, golden light, soft brown. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `mountain_fog`: Холм в тумане
- **Файл:** `assets/bg_mountain_fog.jpg`
- **Где используется:** поход в туман: день 10
- **Описание:** склон холма с соснами, сильный утренний туман, видимость мала, вдали проступает силуэт озера внизу.
- **Промпт:**

```
Anime visual novel background: a hillside trail among scattered pines in thick morning fog: very low visibility, layered soft grey-white mist, the vague silhouette of a lake far below, the closest trees sharp and the distant ones fading, a cold quiet mood. Palette: pale blue-grey, muted green, soft white. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `campfire_night`: Костёр, ночь
- **Файл:** `assets/bg_campfire_night.jpg`
- **Где используется:** костёр: день 9
- **Описание:** ночной костёр на поляне у озера, искры, звёздное небо, брёвна вокруг костра, тёплый свет на деревьях.
- **Промпт:**

```
Anime visual novel background: a night campfire in a clearing by a lake: a bright fire with rising sparks, logs arranged in a circle, a starry sky with the Milky Way, dark pines around, the lake faintly reflecting the stars, warm firelight on the nearest trees and ground. Palette: deep navy, warm orange firelight, silver starlight. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `rooftop_night`: Крыша, ночь
- **Файл:** `assets/bg_rooftop_night.jpg`
- **Где используется:** ночные разговоры: дни 1, 5, 11, 13
- **Описание:** плоская крыша лицея ночью, перила, огромное звёздное небо и Млечный путь, вдали огни озера, тихо.
- **Промпт:**

```
Anime visual novel background: a flat rooftop of an old lyceum at night: a metal railing, a water tank and a small door in the distance, a huge starry sky with the Milky Way, faint lights of the lakeside far below, a calm and contemplative mood, soft blue moonlight. Palette: midnight blue, violet, silver, warm window glow. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `dorm_room`: Комната в общежитии
- **Файл:** `assets/bg_dorm_room.jpg`
- **Где используется:** комнаты общежития: дни 5, 13
- **Описание:** маленькая комната в общежитии: кровать, письменный стол с лампой, окно на озеро, постеры и гирлянда, вечер.
- **Промпт:**

```
Anime visual novel background: a small dormitory room in the evening: a single bed with a patterned blanket, a desk with a lamp and stacked notebooks, a window with the lake and sunset behind it, posters and string lights on the wall, a rug and a few plants, lived-in and cozy. Palette: warm beige, soft orange sunset, muted teal. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `fair`: Ярмарка
- **Файл:** `assets/bg_fair.jpg`
- **Где используется:** ярмарка: день 11
- **Описание:** летняя ярмарка на площади лицея: разноцветные палатки-аттракционы, гирлянды флажков и фонариков, толпа без лиц, день.
- **Промпт:**

```
Anime visual novel background: a summer fair on the lyceum square on a sunny day: colorful tent-stalls with striped awnings, garlands of paper flags and lanterns, wooden game booths, balloons, a faceless blurred crowd far in the background, bright festive mood. Palette: saturated red, yellow, teal, sky blue. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

### Уровень 3

#### `station_sunset`: Станция, закат (проводы)
- **Файл:** `assets/bg_station_sunset.jpg`
- **Где используется:** Эпилог, проводы
- **Описание:** та же станция у озера на закате: оранжевое небо, длинные тени, пустая платформа, ощущение прощания.
- **Промпт:**

```
Anime visual novel background: the same small lakeside railway station at sunset: empty platform, the wooden canopy and bench, the track leading into the distance, the lake reflecting an orange-pink sky, long soft shadows, a quiet bittersweet farewell mood. Palette: warm orange, pink, deep teal water. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `lake_road`: Дорога вдоль озера
- **Файл:** `assets/bg_lake_road.jpg`
- **Где используется:** велогонка и прогулки: дни 7, 8
- **Описание:** асфальтовая дорога вдоль озера, по бокам деревья и трава, лето, вдали холмы; подходит для велопрогулки.
- **Промпт:**

```
Anime visual novel background: a quiet asphalt road winding along a lake on a summer afternoon: tall trees and wildflowers along the verge, a low stone wall, the sparkling lake on one side, soft hills in the distance, dappled sunlight on the road, perspective leading the eye to the horizon, good for a bike ride. Palette: fresh green, warm asphalt gray, sky blue. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `rain_window`: Дождь за окном
- **Файл:** `assets/bg_rain_window.jpg`
- **Где используется:** дождливый день: день 6
- **Описание:** окно клубной комнаты во время ливня: капли на стекле, серое небо, сосны за окном, уют внутри, тусклый тёплый свет.
- **Промпт:**

```
Anime visual novel background: a club room window during a heavy downpour: raindrops streaming down the glass, a grey-blue sky and dark pines outside, the interior warmly lit by a small lamp, steam from a mug on the sill, a sense of shelter and quiet. Palette: cool blue-grey outside, warm amber inside. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

#### `server_room`: Компьютерный класс, ночь
- **Файл:** `assets/bg_server_room.jpg`
- **Где используется:** компьютерный класс Ники: дни 13, 14
- **Описание:** тёмный компьютерный класс ночью: ряды мониторов с кодом, зелёные и голубые огни серверной стойки, чашки с остывшим кофе.
- **Промпт:**

```
Anime visual novel background: a dark computer classroom at night: rows of monitors showing glowing lines of code, a server rack with green and blue blinking lights, cups of cold coffee, tangled cables, a hoodie draped over a chair, cool blue light and neon accents. Palette: deep navy, cyan, green, a touch of magenta. Style: high-quality anime visual novel background art, detailed digital painting with soft cel shading and clean fine line art, rich but harmonious colors, volumetric light, subtle depth of field, cinematic anime film scenery. Composition: wide 16:9 shot at eye level with clear foreground, midground and background; keep the center and the lower third calm and uncluttered because a character sprite and a dialogue box will cover them; light source clearly defined. Strictly no characters, no people, no figures, no text, no letters, no logos, no UI, no watermark. 1920x1080.
```

---

## Персонажи

Формат: вертикальная картинка 2:3 (например, 1024×1536), персонаж по пояс или до колен, **прозрачный фон**, лицо крупно. Один и тот же персонаж на всех картинках.

### Мира-сэнсэй (`mira`)
- **Роль:** куратор клуба, математик-физик
- **Кто это:** Куратор клуба, бывшая сотрудница квантовой лаборатории. Спокойная, остроумная, строгая к пониманию и добрая к людям. Картинки neutral/happy/think уже готовы.
- **Файлы:** `assets/mira_neutral.png`, `mira_happy.png`, `mira_think.png`, `mira_shy.png`, `mira_sad.png`, `mira_angry.png`, `mira_surprised.png`
- **Статус:** картинки neutral/happy/think уже готовы. Остальные настроения необязательны.

### Юна (`yuna`)
- **Роль:** спортсменка, «математика не для меня»
- **Кто это:** 18 лет, бегунья, шумная и добрая, смеётся громче всех, уверена, что «математика не для неё». Через неё идёт тема «ошибка — это данные».
- **Файлы:** `assets/yuna_neutral.png`, `yuna_happy.png`, `yuna_think.png`, `yuna_shy.png`, `yuna_sad.png`, `yuna_angry.png`, `yuna_surprised.png`
- **Внешность:** a cheerful 18-year-old girl athlete, short-to-medium copper-orange hair tied in a high ponytail with a small white sports headband, big bright green eyes, warm tan skin, wearing the school summer uniform: white short-sleeve shirt, blue-and-white athletic zip jacket tied around her waist, short pleated skirt with athletic shorts, running sneakers, energetic confident posture.
- **Уровень:** neutral: уровень 1; happy/think/shy: уровень 2; sad/angry/surprised: уровень 3

**neutral**

```
Anime visual novel character sprite, a cheerful 18-year-old girl athlete, short-to-medium copper-orange hair tied in a high ponytail with a small white sports headband, big bright green eyes, warm tan skin, wearing the school summer uniform: white short-sleeve shirt, blue-and-white athletic zip jacket tied around her waist, short pleated skirt with athletic shorts, running sneakers, energetic confident posture. Expression: calm natural expression, relaxed pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**happy**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a cheerful 18-year-old girl athlete, short-to-medium copper-orange hair tied in a high ponytail with a small white sports headband, big bright green eyes, warm tan skin, wearing the school summer uniform: white short-sleeve shirt, blue-and-white athletic zip jacket tied around her waist, short pleated skirt with athletic shorts, running sneakers, energetic confident posture. Expression: bright happy smile, eyes closed or sparkling, cheerful pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**think**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a cheerful 18-year-old girl athlete, short-to-medium copper-orange hair tied in a high ponytail with a small white sports headband, big bright green eyes, warm tan skin, wearing the school summer uniform: white short-sleeve shirt, blue-and-white athletic zip jacket tied around her waist, short pleated skirt with athletic shorts, running sneakers, energetic confident posture. Expression: thoughtful expression, finger near chin, eyes looking aside. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**shy**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a cheerful 18-year-old girl athlete, short-to-medium copper-orange hair tied in a high ponytail with a small white sports headband, big bright green eyes, warm tan skin, wearing the school summer uniform: white short-sleeve shirt, blue-and-white athletic zip jacket tied around her waist, short pleated skirt with athletic shorts, running sneakers, energetic confident posture. Expression: embarrassed blushing expression, looking away, hands fidgeting. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**sad**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a cheerful 18-year-old girl athlete, short-to-medium copper-orange hair tied in a high ponytail with a small white sports headband, big bright green eyes, warm tan skin, wearing the school summer uniform: white short-sleeve shirt, blue-and-white athletic zip jacket tied around her waist, short pleated skirt with athletic shorts, running sneakers, energetic confident posture. Expression: sad downcast expression, slightly teary eyes. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**angry**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a cheerful 18-year-old girl athlete, short-to-medium copper-orange hair tied in a high ponytail with a small white sports headband, big bright green eyes, warm tan skin, wearing the school summer uniform: white short-sleeve shirt, blue-and-white athletic zip jacket tied around her waist, short pleated skirt with athletic shorts, running sneakers, energetic confident posture. Expression: annoyed puffed-cheek or stern frowning expression, arms crossed. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**surprised**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a cheerful 18-year-old girl athlete, short-to-medium copper-orange hair tied in a high ponytail with a small white sports headband, big bright green eyes, warm tan skin, wearing the school summer uniform: white short-sleeve shirt, blue-and-white athletic zip jacket tied around her waist, short pleated skirt with athletic shorts, running sneakers, energetic confident posture. Expression: surprised wide-open eyes and open mouth. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

### Соня (`sonya`)
- **Роль:** тихая библиотекарь, пишет стихи
- **Кто это:** 18 лет, тихая, живёт в библиотеке, пишет стихи и видит красоту в формулах. Боится выступать. Через неё идёт тема красоты математики и выступления.
- **Файлы:** `assets/sonya_neutral.png`, `sonya_happy.png`, `sonya_think.png`, `sonya_shy.png`, `sonya_sad.png`, `sonya_angry.png`, `sonya_surprised.png`
- **Внешность:** a shy 18-year-old girl, very long straight silvery-white hair with side-swept bangs and a thin lilac hairpin, large soft lavender-blue eyes, pale skin, wearing the school uniform with a long oversized lilac cardigan with sleeves covering her hands, holding a small notebook against her chest, timid gentle expression.
- **Уровень:** neutral: уровень 1; happy/think/shy: уровень 2; sad/angry/surprised: уровень 3

**neutral**

```
Anime visual novel character sprite, a shy 18-year-old girl, very long straight silvery-white hair with side-swept bangs and a thin lilac hairpin, large soft lavender-blue eyes, pale skin, wearing the school uniform with a long oversized lilac cardigan with sleeves covering her hands, holding a small notebook against her chest, timid gentle expression. Expression: calm natural expression, relaxed pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**happy**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a shy 18-year-old girl, very long straight silvery-white hair with side-swept bangs and a thin lilac hairpin, large soft lavender-blue eyes, pale skin, wearing the school uniform with a long oversized lilac cardigan with sleeves covering her hands, holding a small notebook against her chest, timid gentle expression. Expression: bright happy smile, eyes closed or sparkling, cheerful pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**think**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a shy 18-year-old girl, very long straight silvery-white hair with side-swept bangs and a thin lilac hairpin, large soft lavender-blue eyes, pale skin, wearing the school uniform with a long oversized lilac cardigan with sleeves covering her hands, holding a small notebook against her chest, timid gentle expression. Expression: thoughtful expression, finger near chin, eyes looking aside. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**shy**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a shy 18-year-old girl, very long straight silvery-white hair with side-swept bangs and a thin lilac hairpin, large soft lavender-blue eyes, pale skin, wearing the school uniform with a long oversized lilac cardigan with sleeves covering her hands, holding a small notebook against her chest, timid gentle expression. Expression: embarrassed blushing expression, looking away, hands fidgeting. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**sad**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a shy 18-year-old girl, very long straight silvery-white hair with side-swept bangs and a thin lilac hairpin, large soft lavender-blue eyes, pale skin, wearing the school uniform with a long oversized lilac cardigan with sleeves covering her hands, holding a small notebook against her chest, timid gentle expression. Expression: sad downcast expression, slightly teary eyes. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**angry**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a shy 18-year-old girl, very long straight silvery-white hair with side-swept bangs and a thin lilac hairpin, large soft lavender-blue eyes, pale skin, wearing the school uniform with a long oversized lilac cardigan with sleeves covering her hands, holding a small notebook against her chest, timid gentle expression. Expression: annoyed puffed-cheek or stern frowning expression, arms crossed. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**surprised**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a shy 18-year-old girl, very long straight silvery-white hair with side-swept bangs and a thin lilac hairpin, large soft lavender-blue eyes, pale skin, wearing the school uniform with a long oversized lilac cardigan with sleeves covering her hands, holding a small notebook against her chest, timid gentle expression. Expression: surprised wide-open eyes and open mouth. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

### Аврора (`avrora`)
- **Роль:** староста, отличница, перфекционистка
- **Кто это:** 19 лет, староста лицея, отличница, соперница героя. Строгая, прямая, под давлением ожиданий. Через неё идёт тема доказательств, ошибок и перфекционизма.
- **Файлы:** `assets/avrora_neutral.png`, `avrora_happy.png`, `avrora_think.png`, `avrora_shy.png`, `avrora_sad.png`, `avrora_angry.png`, `avrora_surprised.png`
- **Внешность:** a poised 19-year-old girl class president, long dark-violet hair worn straight with a sharp high ponytail, amethyst purple eyes with a stern confident look, fair skin, wearing a crisp school blazer in dark navy with gold trim, white shirt, thin tie and a green class-president armband, upright posture, arms sometimes crossed.
- **Уровень:** neutral: уровень 1; happy/think/shy: уровень 2; sad/angry/surprised: уровень 3

**neutral**

```
Anime visual novel character sprite, a poised 19-year-old girl class president, long dark-violet hair worn straight with a sharp high ponytail, amethyst purple eyes with a stern confident look, fair skin, wearing a crisp school blazer in dark navy with gold trim, white shirt, thin tie and a green class-president armband, upright posture, arms sometimes crossed. Expression: calm natural expression, relaxed pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**happy**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a poised 19-year-old girl class president, long dark-violet hair worn straight with a sharp high ponytail, amethyst purple eyes with a stern confident look, fair skin, wearing a crisp school blazer in dark navy with gold trim, white shirt, thin tie and a green class-president armband, upright posture, arms sometimes crossed. Expression: bright happy smile, eyes closed or sparkling, cheerful pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**think**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a poised 19-year-old girl class president, long dark-violet hair worn straight with a sharp high ponytail, amethyst purple eyes with a stern confident look, fair skin, wearing a crisp school blazer in dark navy with gold trim, white shirt, thin tie and a green class-president armband, upright posture, arms sometimes crossed. Expression: thoughtful expression, finger near chin, eyes looking aside. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**shy**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a poised 19-year-old girl class president, long dark-violet hair worn straight with a sharp high ponytail, amethyst purple eyes with a stern confident look, fair skin, wearing a crisp school blazer in dark navy with gold trim, white shirt, thin tie and a green class-president armband, upright posture, arms sometimes crossed. Expression: embarrassed blushing expression, looking away, hands fidgeting. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**sad**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a poised 19-year-old girl class president, long dark-violet hair worn straight with a sharp high ponytail, amethyst purple eyes with a stern confident look, fair skin, wearing a crisp school blazer in dark navy with gold trim, white shirt, thin tie and a green class-president armband, upright posture, arms sometimes crossed. Expression: sad downcast expression, slightly teary eyes. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**angry**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a poised 19-year-old girl class president, long dark-violet hair worn straight with a sharp high ponytail, amethyst purple eyes with a stern confident look, fair skin, wearing a crisp school blazer in dark navy with gold trim, white shirt, thin tie and a green class-president armband, upright posture, arms sometimes crossed. Expression: annoyed puffed-cheek or stern frowning expression, arms crossed. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**surprised**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a poised 19-year-old girl class president, long dark-violet hair worn straight with a sharp high ponytail, amethyst purple eyes with a stern confident look, fair skin, wearing a crisp school blazer in dark navy with gold trim, white shirt, thin tie and a green class-president armband, upright posture, arms sometimes crossed. Expression: surprised wide-open eyes and open mouth. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

### Ника (`nika`)
- **Роль:** гик, алгоритмы и код ночами
- **Кто это:** 18 лет, ночной кодер, наушники никогда не снимает, прячется за ноутбуком от людей. Через неё идут алгоритмы, графы и тема «вернуться к людям».
- **Файлы:** `assets/nika_neutral.png`, `nika_happy.png`, `nika_think.png`, `nika_shy.png`, `nika_sad.png`, `nika_angry.png`, `nika_surprised.png`
- **Внешность:** a tired but clever 18-year-old girl hacker, short teal-turquoise bob haircut with uneven bangs, sleepy half-lidded dark-blue eyes with faint dark circles, big over-ear headphones around her neck, an oversized dark hoodie with a small pink pixel-heart print over the school uniform, a laptop under her arm, slight smirk.
- **Уровень:** neutral: уровень 1; happy/think/shy: уровень 2; sad/angry/surprised: уровень 3

**neutral**

```
Anime visual novel character sprite, a tired but clever 18-year-old girl hacker, short teal-turquoise bob haircut with uneven bangs, sleepy half-lidded dark-blue eyes with faint dark circles, big over-ear headphones around her neck, an oversized dark hoodie with a small pink pixel-heart print over the school uniform, a laptop under her arm, slight smirk. Expression: calm natural expression, relaxed pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**happy**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a tired but clever 18-year-old girl hacker, short teal-turquoise bob haircut with uneven bangs, sleepy half-lidded dark-blue eyes with faint dark circles, big over-ear headphones around her neck, an oversized dark hoodie with a small pink pixel-heart print over the school uniform, a laptop under her arm, slight smirk. Expression: bright happy smile, eyes closed or sparkling, cheerful pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**think**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a tired but clever 18-year-old girl hacker, short teal-turquoise bob haircut with uneven bangs, sleepy half-lidded dark-blue eyes with faint dark circles, big over-ear headphones around her neck, an oversized dark hoodie with a small pink pixel-heart print over the school uniform, a laptop under her arm, slight smirk. Expression: thoughtful expression, finger near chin, eyes looking aside. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**shy**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a tired but clever 18-year-old girl hacker, short teal-turquoise bob haircut with uneven bangs, sleepy half-lidded dark-blue eyes with faint dark circles, big over-ear headphones around her neck, an oversized dark hoodie with a small pink pixel-heart print over the school uniform, a laptop under her arm, slight smirk. Expression: embarrassed blushing expression, looking away, hands fidgeting. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**sad**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a tired but clever 18-year-old girl hacker, short teal-turquoise bob haircut with uneven bangs, sleepy half-lidded dark-blue eyes with faint dark circles, big over-ear headphones around her neck, an oversized dark hoodie with a small pink pixel-heart print over the school uniform, a laptop under her arm, slight smirk. Expression: sad downcast expression, slightly teary eyes. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**angry**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a tired but clever 18-year-old girl hacker, short teal-turquoise bob haircut with uneven bangs, sleepy half-lidded dark-blue eyes with faint dark circles, big over-ear headphones around her neck, an oversized dark hoodie with a small pink pixel-heart print over the school uniform, a laptop under her arm, slight smirk. Expression: annoyed puffed-cheek or stern frowning expression, arms crossed. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**surprised**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a tired but clever 18-year-old girl hacker, short teal-turquoise bob haircut with uneven bangs, sleepy half-lidded dark-blue eyes with faint dark circles, big over-ear headphones around her neck, an oversized dark hoodie with a small pink pixel-heart print over the school uniform, a laptop under her arm, slight smirk. Expression: surprised wide-open eyes and open mouth. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

### Вега (`vega`)
- **Роль:** преподаватель физики, экспериментатор; ведёт весь физический трек и полуденные сцены. Подробно: `PHYSICS.md`.
- **Описание:** 24 года, выпускница физфака. Пепельно-серые волосы в небрежном пучке с карандашом, янтарные глаза, веснушки, белый халат поверх горчичной водолазки, очки-гогглы на голове. Энергичная, быстрая, всё проверяет опытом («Давай проверим!»). Шесть лет назад была лаборанткой в старой лаборатории.
- **Файлы:** `assets/vega_<настроение>.png`. Обязательно `neutral`; уровень 2: `happy`, `think`; уровень 3: `shy`, `sad`, `surprised`, `angry`.

#### `vega_neutral.png`
```
Anime visual novel character sprite, a bright, energetic 24-year-old female physicist, ash-grey hair in a loose messy high bun with a pencil stuck through it and a few loose strands framing her face, large warm amber-gold eyes, light freckles, a small confident grin, wearing an unbuttoned white lab coat with rolled-up sleeves and a faint scorch mark on one cuff over a mustard-yellow fitted turtleneck, dark high-waisted shorts, white sneakers, laboratory safety goggles pushed up on her head, an ID badge on a lanyard, holding a small red laser pointer, lively posture. Expression: calm natural expression, relaxed pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

#### `vega_happy.png`
```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a bright, energetic 24-year-old female physicist, ash-grey hair in a loose messy high bun with a pencil stuck through it and a few loose strands framing her face, large warm amber-gold eyes, light freckles, a small confident grin, wearing an unbuttoned white lab coat with rolled-up sleeves and a faint scorch mark on one cuff over a mustard-yellow fitted turtleneck, dark high-waisted shorts, white sneakers, laboratory safety goggles pushed up on her head, an ID badge on a lanyard, holding a small red laser pointer, lively posture. Expression: bright happy smile, eyes closed or sparkling, cheerful pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

#### `vega_think.png`
```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a bright, energetic 24-year-old female physicist, ash-grey hair in a loose messy high bun with a pencil stuck through it and a few loose strands framing her face, large warm amber-gold eyes, light freckles, a small confident grin, wearing an unbuttoned white lab coat with rolled-up sleeves and a faint scorch mark on one cuff over a mustard-yellow fitted turtleneck, dark high-waisted shorts, white sneakers, laboratory safety goggles pushed up on her head, an ID badge on a lanyard, holding a small red laser pointer, lively posture. Expression: thoughtful expression, finger near chin, eyes looking aside. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

#### `vega_shy.png`
```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a bright, energetic 24-year-old female physicist, ash-grey hair in a loose messy high bun with a pencil stuck through it and a few loose strands framing her face, large warm amber-gold eyes, light freckles, a small confident grin, wearing an unbuttoned white lab coat with rolled-up sleeves and a faint scorch mark on one cuff over a mustard-yellow fitted turtleneck, dark high-waisted shorts, white sneakers, laboratory safety goggles pushed up on her head, an ID badge on a lanyard, holding a small red laser pointer, lively posture. Expression: embarrassed blushing expression, looking away, hands fidgeting. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

#### `vega_sad.png`
```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a bright, energetic 24-year-old female physicist, ash-grey hair in a loose messy high bun with a pencil stuck through it and a few loose strands framing her face, large warm amber-gold eyes, light freckles, a small confident grin, wearing an unbuttoned white lab coat with rolled-up sleeves and a faint scorch mark on one cuff over a mustard-yellow fitted turtleneck, dark high-waisted shorts, white sneakers, laboratory safety goggles pushed up on her head, an ID badge on a lanyard, holding a small red laser pointer, lively posture. Expression: sad downcast expression, slightly teary eyes. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

#### `vega_angry.png`
```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a bright, energetic 24-year-old female physicist, ash-grey hair in a loose messy high bun with a pencil stuck through it and a few loose strands framing her face, large warm amber-gold eyes, light freckles, a small confident grin, wearing an unbuttoned white lab coat with rolled-up sleeves and a faint scorch mark on one cuff over a mustard-yellow fitted turtleneck, dark high-waisted shorts, white sneakers, laboratory safety goggles pushed up on her head, an ID badge on a lanyard, holding a small red laser pointer, lively posture. Expression: annoyed puffed-cheek or stern frowning expression, arms crossed. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

#### `vega_surprised.png`
```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a bright, energetic 24-year-old female physicist, ash-grey hair in a loose messy high bun with a pencil stuck through it and a few loose strands framing her face, large warm amber-gold eyes, light freckles, a small confident grin, wearing an unbuttoned white lab coat with rolled-up sleeves and a faint scorch mark on one cuff over a mustard-yellow fitted turtleneck, dark high-waisted shorts, white sneakers, laboratory safety goggles pushed up on her head, an ID badge on a lanyard, holding a small red laser pointer, lively posture. Expression: surprised wide-open eyes and open mouth. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

### Директор Орлов (`director`)
- **Роль:** директор лицея (эпизодический)
- **Кто это:** Валентин Сергеевич Орлов, директор лицея. Деловой и прагматичный, не злодей: ему нужны результаты, а не красота. Появляется редко. Картинка необязательна.
- **Файлы:** `assets/director_neutral.png`, `director_happy.png`, `director_think.png`, `director_shy.png`, `director_sad.png`, `director_angry.png`, `director_surprised.png`
- **Внешность:** a dignified middle-aged man, school director, short grey hair, rectangular glasses, dark grey suit with a gold lapel pin, calm stern face with a hint of warmth, anime style, mature proportions.
- **Уровень:** 3 (необязательно)

**neutral**

```
Anime visual novel character sprite, a dignified middle-aged man, school director, short grey hair, rectangular glasses, dark grey suit with a gold lapel pin, calm stern face with a hint of warmth, anime style, mature proportions. Expression: calm natural expression, relaxed pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**happy**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a dignified middle-aged man, school director, short grey hair, rectangular glasses, dark grey suit with a gold lapel pin, calm stern face with a hint of warmth, anime style, mature proportions. Expression: bright happy smile, eyes closed or sparkling, cheerful pose. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**think**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a dignified middle-aged man, school director, short grey hair, rectangular glasses, dark grey suit with a gold lapel pin, calm stern face with a hint of warmth, anime style, mature proportions. Expression: thoughtful expression, finger near chin, eyes looking aside. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**shy**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a dignified middle-aged man, school director, short grey hair, rectangular glasses, dark grey suit with a gold lapel pin, calm stern face with a hint of warmth, anime style, mature proportions. Expression: embarrassed blushing expression, looking away, hands fidgeting. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**sad**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a dignified middle-aged man, school director, short grey hair, rectangular glasses, dark grey suit with a gold lapel pin, calm stern face with a hint of warmth, anime style, mature proportions. Expression: sad downcast expression, slightly teary eyes. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**angry**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a dignified middle-aged man, school director, short grey hair, rectangular glasses, dark grey suit with a gold lapel pin, calm stern face with a hint of warmth, anime style, mature proportions. Expression: annoyed puffed-cheek or stern frowning expression, arms crossed. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

**surprised**

```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Same character as before (same face, hair and outfit). Anime visual novel character sprite, a dignified middle-aged man, school director, short grey hair, rectangular glasses, dark grey suit with a gold lapel pin, calm stern face with a hint of warmth, anime style, mature proportions. Expression: surprised wide-open eyes and open mouth. Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

---

## Где какое настроение используется

- `neutral`: обычный разговор. `happy`: радость, победа, шутка. `think`: сомнение, размышление, загадка. `shy`: смущение, признание. `sad`: грусть, провал, разочарование. `angry`: раздражение, спор (Аврора, Юна). `surprised`: неожиданность.
- Герой (игрок) на экране не показывается: он говорит «за кадром», остальные персонажи на этот момент слегка затемняются.

## Музыка и звуки (необязательно)

Сейчас игра без звука. Если захочешь добавить: мягкое фортепиано/гитара для сцен у озера, тревожные струнные для сцен с лабораторией, праздничная музыка для Фестиваля.

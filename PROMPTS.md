# Промпты для картинок Миры и Веги (ChatGPT)

У тебя 3 бесплатные генерации — вот как потратить их с толком. Сохрани результаты в `assets/`:

| Файл | Эмоция | Когда показывается |
|---|---|---|
| `mira_neutral.png` | спокойная, объясняет | основной кадр |
| `mira_happy.png` | улыбается, радуется | похвала, верный ответ |
| `mira_think.png` | задумчивая, палец у подбородка | разбор ошибки, загадка |

Любое расширение подойдёт: png, jpg, webp, gif. Если какого-то файла нет, игра берёт `mira_neutral`, а без него рисует заглушку.

## Как генерировать, чтобы это была одна и та же девушка
1. Сначала отправь **Промпт 1** и дождись результата.
2. Потом в том же чате отправь **Промпт 2** и **Промпт 3**, они начинаются с «Тот же персонаж, что на предыдущем изображении…». Так лицо, причёска и очки совпадут.

## Общий стиль (уже вставлен в каждый промпт)
Аниме-стиль, чистая линия, мягкая цветокоррекция, брюнетка, очки, строгая, но тёплая учительница.

---

## Промпт 1 — mira_neutral.png
```
Anime-style illustration of a young female teacher, vertical orientation, upper body to hips, centered, facing the viewer. Long straight dark-brown/black hair with side-swept bangs, a small half-up hair clip, large expressive dark eyes behind thin stylish rectangular glasses. Calm, friendly, confident expression, a gentle slight smile. Wearing a white button-up blouse with rolled sleeves, a dark navy pencil skirt-style vest/cardigan, and a thin red ribbon tie. One hand holding a piece of white chalk, the other relaxed. Clean anime line art, soft cel shading, high detail, warm light. Transparent background (PNG), no text, no watermark, no background objects.
```

## Промпт 2 — mira_happy.png
```
Same character as in the previous image (same face, same long dark hair, same glasses, same outfit), vertical, upper body to hips, centered. Now she is smiling brightly with eyes closed in happiness, cheeks slightly blushed, one hand raised with a thumbs-up or a small proud clap. Cheerful, encouraging teacher energy. Same anime style and lighting. Transparent background (PNG), no text, no watermark.
```

## Промпт 3 — mira_think.png
```
Same character as in the previous image (same face, same long dark hair, same glasses, same outfit), vertical, upper body to hips, centered. Now she looks thoughtful: one hand under her chin, the other index finger raised slightly as if explaining an idea, head tilted a little, eyes looking up and to the side, a small curious smile. Same anime style and lighting. Transparent background (PNG), no text, no watermark.
```

---

## Если фон получился не прозрачный
Скажи мне, я вырежу фон локально и положу готовые файлы в `assets/`.

## Позже: анимация
Анимированные `.webp` или `.gif` с теми же именами (`mira_neutral.webp` и т.д.) игра подхватит сама, без правок кода. Если сделаешь видео (например, зацикленные клипы из Veo/Flow), положи их в `assets/` и пропиши в `js/sprites.js`:

```js
window.SPRITES = { neutral: 'assets/mira_neutral.webm', happy: 'assets/mira_happy.webm', think: 'assets/mira_think.webm' };
```

Для прозрачного фона у видео нужен `.webm` с альфа-каналом (VP9). Обычный `.mp4` тоже работает, но с фоном.


---

# Вега (преподаватель физики, южное крыло)

Файлы: `assets/vega_neutral.png`, `vega_happy.png`, `vega_think.png`. Пока файлов нет, игра рисует процедурный силуэт (серый пучок, халат, гогглы). Генерируй в одном чате, сначала загрузив картинку Миры как референс стиля. Если генераций мало: сначала `vega_neutral`, остальные настроения игра возьмёт из него.

## Промпт 1 — vega_neutral.png
```
Draw in exactly the same art style, proportions and level of detail as the reference image of Mira that I upload (clean anime line art, soft cel shading). Anime visual novel character sprite of a bright, energetic 24-year-old female physicist: ash-grey hair in a loose messy high bun with a pencil stuck through it and a few loose strands framing her face, large warm amber-gold eyes, light freckles, a small confident grin. She wears an unbuttoned white lab coat with rolled-up sleeves and a faint scorch mark on one cuff, over a mustard-yellow fitted turtleneck, dark high-waisted shorts, white sneakers, laboratory safety goggles pushed up on her head, an ID badge on a lanyard. She holds a small red laser pointer in one hand. Expression: calm, curious, friendly, about to say "let's test it". Vertical composition, upper body to hips (or full body to knees), centered, facing the viewer, anime visual novel style, clean line art, soft cel shading, warm summer light, high detail. Transparent background (PNG), no text, no watermark, no background objects.
```

## Промпт 2 — vega_happy.png
```
Same character as in the previous image (same face, same ash-grey messy bun with the pencil, same goggles, same white lab coat and mustard turtleneck). Now she is delighted: bright wide smile with eyes closed in happiness, one fist raised in a small victorious "it worked!" gesture, the other hand holding the laser pointer, a few strands of hair bouncing. Same anime visual novel style, clean line art, soft cel shading, same lighting, vertical composition, upper body to hips, centered. Transparent background (PNG), no text, no watermark.
```

## Промпт 3 — vega_think.png
```
Same character as in the previous image (same face, hair, goggles, lab coat and outfit). Now she is thinking hard: she has pulled the pencil out of her bun and taps it against her chin, one eyebrow raised, eyes looking up and to the side, lips slightly pursed, head tilted a little, a loose strand of hair falling over her forehead. Same anime visual novel style, clean line art, soft cel shading, same lighting, vertical composition, upper body to hips, centered. Transparent background (PNG), no text, no watermark.
```

Остальные настроения (shy, sad, surprised) — по тому же принципу «Same character as before…», см. `ASSETS.md`.

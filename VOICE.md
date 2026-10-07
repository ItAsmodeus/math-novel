# Озвучка

Мира говорит голосом Марины (XTTS-v2, zero-shot клон по референсу `~/scripts/novel_voice/marina_ref.wav`,
60 с из «Новой записи 7»). Остальные персонажи пока без голоса.

## Как это работает
- `js/voice.js` — `VOICE.speak(speaker, rawText)`: ищет `assets/voice/<fnv1a32(speaker + '|' + rawText)>.mp3`,
  где `rawText` — строка из `js/story/*.js` / `js/modules/*.js` до подстановки `{name}`. Нет файла — тишина.
- `js/novel.js` вызывает `say(...)` для реплик, доски, вопросов и ответов, финала и экрана «продолжить».
- Кнопка 🔊/🔇 в шапке сцены; состояние в `localStorage.mn_voice`.
- Озвучены только персонажи из `VOICED` в `voice.js` (сейчас `mira`).

## Генерация
```
cd ~/scripts/novel_voice
node extract.js ~/Desktop/Apps/math-novel mira lines.json
~/Desktop/Projects/ely-voice/.venv-xtts/bin/python -I gen.py lines.json ~/Desktop/Apps/math-novel/assets/voice
```
`gen.py` пропускает уже существующие файлы, поэтому после правки текста достаточно перезапустить обе команды:
досинтезируются только новые/изменённые реплики. Скорость ~17 символов/с, ~5 с реплики за 6 с.
Прогресс: `tail -f ~/scripts/novel_voice/gen.log`. Имя игрока в аудио: `NOVEL_NAME=Карим` (env).

Формулы `$...$` читаются по словарю в `gen.py` (`LATEX`, `GREEK`), HTML-теги убираются.
Другой голос для другого персонажа: добавить в `VOICED`, второй референс и ветку в `gen.py` по `speaker`.

Вега (`vega`, физический трек, см. `PHYSICS.md`) пока не озвучена. Новые реплики Миры в полуденных сценах (d14m, d16m) и в d00b/d16c тоже не озвучены: достаточно перезапустить `extract.js` + `gen.py`, досинтезируются только новые строки.

# ECHO Localization

ECHO uses one shared gameplay/runtime for Traditional Chinese and English. Traditional Chinese remains the Season 1 master text; English is a presentation layer only.

## Files

- `js/i18n.js` — language selection, persistence, and `ECHO_I18N.t()` runtime.
- `js/locales/en.js` — English catalog. The exact Traditional Chinese source string is the translation key.
- `css/i18n.css` — English/mobile layout adjustments.
- `js/locales/en-art.js` + `js/i18n-art.js` — English reading layers for evidence images that contain baked-in Chinese text. Original image bytes are not changed.
- `scripts/check-localization.cjs` — dependency-free localization coverage/syntax QA.
- `scripts/smoke-localization.cjs` — optional local browser smoke test.

## Editing or adding text

1. Keep the canonical Traditional Chinese wording in the chapter/runtime source.
2. Wrap player-visible dynamic text with `ECHO_I18N.t('中文原文')`.
3. Add the same exact Chinese key to `js/locales/en.js` with a concise natural-English value.
4. Do not translate branch IDs, save keys, asset paths, telemetry event names, audio dispatch markers, or gameplay state values.
5. If an evidence image contains essential Chinese text, keep the image unchanged and add an English reading-layer entry instead of generating a separate gameplay asset.
6. Run `node scripts/check-localization.cjs` before committing.

## Character naming / locked identity

For the bilingual Season 1 build, 林雨晴 is rendered as **Lin Yuqing** in English. Her canonical profile is **26 years old, executive at a multinational company**.

## Analytics

Existing telemetry event names and funnel semantics are unchanged. Each event includes `language` (`zh-TW` or `en`) so Chinese and English acceptance/funnel performance can be compared.

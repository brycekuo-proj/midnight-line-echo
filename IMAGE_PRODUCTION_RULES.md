# ECHO Image Production Rules

Status: LOCKED WORKFLOW v1
Target repository: brycekuo-proj/midnight-line-echo
Local target root: /Users/user/Bryce AI Studio/Games/ECHO/

## Rule 1 — Canon-first image planning

All new images must be justified by the locked Season 1 canon before generation.

Priority:
1. `docs/canon/season1/`
2. Existing runtime image assets under `img/`
3. Existing chapter/runtime implementation

Do not generate decorative images merely to fill empty space.

Before generation, classify every requested visual as one of:
- `evidence_photo`: in-world photo / screenshot / evidence
- `fixed_scene`: fixed cinematic or ending background
- `character_scene`: scene containing established characters
- `interactive_ui`: must be implemented in HTML/CSS/JS, not as a dead image

Interactive systems such as Permission Whack, Territory, Mirror Fragment, Evidence Archive, Link Board, Online List and map interactions must remain real UI unless canon explicitly requires a static photograph.

Existing evidence must be reused where canon refers to the same event. Do not redraw an existing canonical evidence image just because it appears in a later chapter.

## Rule 2 — Character and style consistency

ECHO visual identity is locked to realistic in-world evidence photography / restrained cinematic realism.

Global visual constraints:
- realistic photographic appearance
- psychological-horror tone
- low saturation and restrained contrast
- subtle digital / archival imperfection
- mobile-chat evidence readability
- no anime conversion
- no painterly illustration
- no glossy poster look
- no excessive horror effects
- no redesign of established characters

Character identity anchors:
- EVA: `img/eva/eva_normal.jpg`, `img/eva/eva_digital.jpg`, `img/eva/eva_glitch.jpg`
- K: `img/k/k_normal.jpg`, `img/k/k_scared.jpg`, `img/k/k_glitch.jpg`
- Lin Yuqing: `img/rain/rain_normal.jpg`, `img/rain/rain_glitch1.jpg`, `img/rain/rain_glitch2.jpg`

Generation hierarchy:
1. Use approved MASTER / anchor image.
2. For variants of the same scene, use image editing / reference continuation rather than independent text-to-image generation.
3. Preserve face, hair, body proportions, clothing, camera position, lens feel, lighting and room geometry unless canon explicitly changes them.
4. If a variant changes more than the canon-authorized differences, QA = FAIL.

Special lock for CH2-2 room spot-the-difference:
- Generate `ch22_room_diff_A` first as MASTER.
- Generate `ch22_room_diff_B` only as a controlled variant of A.
- B may change only:
  1. clock 22:47 -> 23:16
  2. teddy bear disappears and bed surface becomes dark plaid blanket
  3. pink note appears beside desk lamp
  4. glass bottle / aroma item becomes a lit candle
  5. wall/desk photo arrangement changes and one extra small photo appears
- Camera, perspective, room layout and all other objects must remain visually matched.

## Rule 3 — Dual-storage, QA and release gate

Every approved generated image must exist in BOTH locations:

Local Mac:
`/Users/user/Bryce AI Studio/Games/ECHO/<repo-relative-path>`

GitHub:
`brycekuo-proj/midnight-line-echo` on the active production branch, normally `main`

Canonical production image paths:
`img/scenes/`

Pipeline metadata:
`asset_pipeline/image_manifest.json`

Prompt / generation specifications:
`asset_pipeline/prompts/`

Required lifecycle:
`planned -> generated -> qa_pending -> approved -> integrated`

No image may be integrated into chapter code before `approved`.

For every generated image record:
- asset id
- canon source
- role/type
- local path
- GitHub path
- anchor references
- generation mode (`generate` or `edit`)
- allowed changes
- forbidden changes
- dimensions
- QA status
- SHA-256 after approval
- commit SHA after GitHub upload

Sync rule:
- The local file and GitHub file must be byte-identical after approval.
- Verify SHA-256 locally and compare after GitHub sync where supported.
- If either side is missing, status must be `sync_incomplete`, never `approved_synced`.

Do not overwrite an approved MASTER during experimentation.
Use `_v1`, `_v2`, etc. during review, then promote the chosen file to the canonical filename.

## Initial canonical new-image queue

1. `ch22_room_diff_A.jpg` — CH2-2 room MASTER
2. `ch22_room_diff_B.jpg` — CH2-2 controlled variant
3. `ch31_group_photo.jpg` — K + Lin Yuqing + faceless player + composited EVA
4. `ch5_choice_candy.jpg` — white sync space, left red candy / right blue candy
5. `ending_offline_rain.jpg` — fixed rain-night image for Offline ending
6. `ending_highsync_eva_space.jpg` — generate only if existing `room_white.jpg` fails visual QA

Existing tunnel/document assets must be reused rather than regenerated.

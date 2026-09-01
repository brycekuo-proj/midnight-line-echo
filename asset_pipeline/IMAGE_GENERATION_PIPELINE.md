# ECHO Image Generation Pipeline

## Purpose

This file defines how ChatGPT Image Generation outputs are promoted into the ECHO production repository while preserving character identity, scene continuity and byte-identical Mac/GitHub storage.

## Generation modes

### `generate`
Use only for a new canonical MASTER scene.

Required inputs:
- canon scene description
- global ECHO style lock
- relevant character anchor references
- target aspect ratio / minimum resolution
- explicit forbidden changes

### `edit`
Mandatory for controlled variants of an approved MASTER.

Use when:
- same room / same camera / same characters continue across images
- only a small canon-defined set of objects changes
- facial identity must stay stable

CH2-2 B is always `edit`; independent regeneration is forbidden.

## Output handling

Canonical scene/evidence output root:
`img/scenes/`

Canonical mini-game GUI output root:
`img/ui/`

Mini-game rule:
- every chapter mini-game must have dedicated graphical assets
- generated GUI assets support, but never replace, HTML/CSS/JS interaction
- avoid baking localized text, counters, scores or dynamic values into reusable GUI images whenever DOM rendering is possible
- shared states should be exported as transparent overlays or reusable components when practical

Temporary reviews:
`asset_pipeline/qa/`

Prompt specs:
`asset_pipeline/prompts/`

When Image Generation returns an approved image:
1. Save the original generated file without recompression.
2. Copy it to the canonical Mac repo path.
3. Record dimensions and SHA-256 in `image_manifest.json`.
4. Set status `qa_pending`.
5. Perform visual QA.
6. If PASS, set status `approved`.
7. Commit the exact same bytes to GitHub.
8. Verify local and GitHub paths match.
9. Set status `approved_synced`.
10. Only then modify chapter code to reference the canonical path.

## Resumable queue automation

The production queue is controlled by `run_generation_queue.py`.

Default backend is `desktop`, which prepares `desktop_generation_queue.json` for ChatGPT Desktop built-in image generation and does **not** use an external API key.

Typical workflow:

1. Reconcile candidates already saved locally:
   `python3 asset_pipeline/run_generation_queue.py --reconcile-only`
2. Preview the next jobs without changing generation state:
   `python3 asset_pipeline/run_generation_queue.py --dry-run --batch-size 5`
3. Prepare a Desktop batch:
   `python3 asset_pipeline/run_generation_queue.py --backend desktop --batch-size 5`
4. Desktop worker follows `DESKTOP_IMAGE_WORKER.md` and saves each original PNG to the queue job's `save_output_as` path.
5. After every saved image, rerun `--reconcile-only`. This is the checkpoint that makes interrupted sessions resumable.
6. Human/visual QA changes a candidate to `approved` with `update_manifest_status.py`.
7. `promote_approved_assets.py` promotes only approved candidates using the existing importer.

The optional `--backend api` path explicitly invokes `generate_openai_image.py` and therefore requires local OpenAI API credentials. Never use it unless the user intentionally chooses API generation.

Queue/checkpoint files:
- `asset_pipeline/desktop_generation_queue.json`
- `asset_pipeline/pipeline_checkpoint.json`

Generation and QA remain separate. `queued` or `generated` never means approved.

## QA gates

### Character consistency
FAIL if any established character visibly changes:
- facial structure
- eye shape
- hairstyle
- apparent age
- clothing identity
- body proportions

### Style consistency
FAIL if output becomes:
- anime
- painterly
- glossy promotional artwork
- overly cinematic compared with existing evidence assets
- strongly stylized in a way that breaks the fake-phone-evidence illusion

### Scene continuity
For edit variants, compare:
- camera position
- perspective
- lens / framing
- lighting direction
- room geometry
- unchanged object placement

Any unintended drift = FAIL.

### Canon accuracy
Every visible clue must correspond to the locked canon.
Do not add new story clues unless explicitly approved.

## Initial prompt spec — CH2-2 Room A

Asset:
`ch22_room_diff_A`

Goal:
Create the MASTER evidence photograph used in the CH2-2 spot-the-difference interaction.

Scene:
A realistic young professional woman's bedroom at night during heavy rain. The image should look like an authentic phone photograph or archived evidence image, not concept art. Cold blue-grey ambience from rainy night outside, with a restrained warm desk-lamp accent.

Required visible objects:
- clearly readable clock showing 22:47
- neatly made light-colored bed
- teddy bear on the bed
- desk lamp
- desk area with enough space beside the lamp for a later pink note
- glass bottle / aroma object on the right side
- wall and desk photographs in a stable arrangement
- enough fixed furniture and architectural detail to make A/B comparison reliable

Composition lock:
- landscape-oriented evidence-photo composition suitable for vertical mobile lightbox
- medium-wide fixed camera
- room geometry must be easy to reproduce
- no person visible
- no dramatic Dutch angle
- no hidden monster
- no extra horror clue

Style lock:
realistic photographic evidence, subtle low saturation, psychological-horror restraint, soft sensor grain, natural indoor lighting, no anime, no illustration, no fantasy effects.

Future edit requirement:
Room B must be created from this approved A MASTER, not regenerated from text.

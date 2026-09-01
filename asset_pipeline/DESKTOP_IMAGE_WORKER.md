# ECHO Desktop Image Worker

Purpose: process `asset_pipeline/desktop_generation_queue.json` with ChatGPT Desktop built-in image generation while preserving resumability and avoiding external API charges.

## Worker contract

1. Read `IMAGE_PRODUCTION_RULES.md`.
2. Read `MINIGAME_UI_ASSET_PLAN.md`.
3. Read `asset_pipeline/IMAGE_GENERATION_PIPELINE.md`.
4. Read `asset_pipeline/desktop_generation_queue.json`.
5. Process jobs strictly in array order.
6. For each job, read its `prompt_file` and use the job `asset_id` as the target-selection key. Generate only that requested asset, not every output described by a shared prompt file.
7. Use ChatGPT Desktop built-in image generation. Do not use an external OpenAI API key unless the user explicitly chooses the API backend.
8. For `mode=edit`, load `edit_input` as the locked source and preserve all non-authorized content.
9. Save the original generated PNG directly to `save_output_as` without recompression or renaming.
10. After every successful save, run:
   `python3 asset_pipeline/run_generation_queue.py --reconcile-only`
   so the manifest records the completed candidate immediately.
11. Reconcile also sends that newly generated image to the configured Telegram chat as a status report. The local config is `asset_pipeline/local_telegram_config.json`; the current chat ID is `1571185855`. Pre-integration historical candidates are not backfilled automatically.
12. Telegram delivery is best-effort and must never delete or invalidate a successfully generated candidate. If delivery fails, the candidate stays `generated`, `telegram_reported=false`, and the next reconcile retries it.
13. If one image-generation job fails, record the failure, leave other successfully saved candidates intact, and continue only when safe. Never delete earlier candidates.
14. Do not promote, commit, push, or modify chapter code during generation. QA and promotion are separate stages.

## Resume rule

After interruption, rerun the queue preparation command for the desired asset IDs. Existing saved candidates are reconciled first, so completed jobs become `generated`; unfinished queued jobs are emitted again with the same next available version.

## QA rule

A candidate being generated does not mean it is approved. Human/visual QA must explicitly change the asset to `approved` before `promote_approved_assets.py` can copy it into canonical `img/` paths.

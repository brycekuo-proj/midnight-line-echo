# LEGACY Prompt Spec — CH3-2 SSD Personality Archive GUI

> Deprecated for CH3-2 gameplay as of 2026-09-03. Do not regenerate this as the chapter's primary mini-game UI. CH3-2 now uses the ONLINE GAME / Moderator Deduction hidden-role interface. Existing SSD images may remain only as backing art or post-win archive atmosphere.

Mini-game ID: `ssd_archive`
Asset type: `minigame_ui`
Canon: `docs/canon/season1/1-3-2(new)_260526_232201.txt`
Outputs: `mg_ch32_ssd_panel`, `mg_ch32_ssd_card`, `mg_ch32_ssd_label`, `mg_ch32_ssd_detail`

## Goal and art direction

Create the final personality-storage archive shown after the online-status investigation: multiple SSD-like personality records held by a clean but unnervingly permanent system. Use near-black graphite, cold steel, muted off-white, restrained cyan status light, subtle violet preservation glow, archival wear, and mobile portrait readability. No brand marks, cyberpunk overload, colorful hardware, or baked names/status text.

## Assets

- `mg_ch32_ssd_panel`: portrait archive drawer/rack background with several empty SSD bays and a blank warning/footer zone; no SilentRoom-specific clue or labels baked in.
- `mg_ch32_ssd_card`: isolated transparent reusable SSD/personality module with blank face and small neutral status-light area.
- `mg_ch32_ssd_label`: isolated transparent blank archival label strip sized for DOM-rendered personality name/status.
- `mg_ch32_ssd_detail`: isolated transparent detail-panel shell with blank identity, retention-status, metadata, and action zones.

## Implementation lock

Personality names, online duration, selection, missing-SilentRoom logic, retention state, warnings, and management permissions stay in HTML/CSS/JS. Generate only the named asset.

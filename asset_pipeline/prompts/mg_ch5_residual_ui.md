# Prompt Spec — CH5 Residual Voices GUI

Mini-game ID: `residual_voices`
Asset type: `minigame_ui`
Canon: `docs/canon/season1/1-5(new)_260528_024502.txt`
Outputs: `mg_ch5_residual_bg`, `mg_ch5_residual_bubble`, `mg_ch5_residual_overlay`

## Goal and art direction

Create a non-live residual-message layer where preserved voices remain after their senders are gone. Use deep blue-black/graphite, low saturation, faint rain-like vertical noise, muted off-white ghost structure, restrained violet-white persistence, and almost imperceptible cyan chat traces. Empty, quiet, intimate, and readable on a portrait phone. No spirits, faces, monsters, gore, or loud paranormal effects.

## Assets

- `mg_ch5_residual_bg`: portrait atmospheric chat-layer background with large quiet negative space and faint receding message lanes; no bubbles or text baked in.
- `mg_ch5_residual_bubble`: isolated transparent reusable ghost-message bubble shell, softly degraded at edges but fully readable when DOM text overlays it.
- `mg_ch5_residual_overlay`: transparent low-opacity persistence/echo overlay with subtle repeated bubble-edge traces and vertical archival noise.

## Implementation lock

Sender names, residual dialogue, ordering, timing, read state, and interaction remain HTML/CSS/JS. Generate only the named asset.

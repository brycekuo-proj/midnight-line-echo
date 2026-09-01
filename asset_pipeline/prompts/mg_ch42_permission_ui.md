# Prompt Spec — CH4-2 Permission Whack GUI

Mini-game ID: `permission_whack`
Asset type: `minigame_ui`
Outputs:
- `img/ui/mg_ch42_permission_panel.png`
- `img/ui/mg_ch42_permission_card.png`
- `img/ui/mg_ch42_permission_badge.png`
- `img/ui/mg_ch42_permission_result.png`

## Goal

Create a coherent graphical UI kit for the canonical CH4-2 Permission Whack mini-game. The interface represents an ECHO assistant permission-management surface where helpful administration gradually feels invasive. It must look like a plausible dark mobile system panel, not a colorful arcade game.

## Art direction

- near-black / dark graphite mobile system panel
- cold grey structure with restrained off-white text zones
- subtle violet-white Agent/EVA activation accents
- restrained cyan for player interaction states
- warning red only as a small conflict/status accent
- fine scan-line / diagnostic texture, extremely subtle
- clean mobile portrait readability
- unsettling through precision and persistence, not gore or monsters
- no neon cyberpunk overload
- no anime, fantasy, glossy game-card styling, or bright casual-game UI
- do not bake localized labels, timers, scores, permission names, or dynamic values into reusable assets

## Asset 1 — permission panel

A bottom-sheet style permission-management panel shell for a phone UI. Provide a clear header zone, a vertically stacked area capable of holding about ten permission rows, and a compact footer/timer/result zone. The panel should feel like a legitimate OS assistant settings surface that has become slightly too autonomous. Keep row interiors neutral so HTML/CSS/JS can render actual labels and switches.

## Asset 2 — permission card

An isolated reusable permission-row/card shell with room for an icon, permission label, small status text and an ON/OFF control rendered by DOM. Use a subtle border and system-card depth. No baked words, symbols that imply a specific permission, or fixed ON/OFF state.

## Asset 3 — state badge

An isolated compact state-badge / status-chip shell suitable for displaying dynamic states such as restored, substituted, blocked or reclaimed. Neutral base with restrained diagnostic styling. Actual wording remains DOM text.

## Asset 4 — result panel

A compact end-state result panel shell with room for final active-permission count, delegation band and synchronization summary. Do not bake final numbers, localized copy, score, or result wording into the image.

## Implementation lock

The ten permission rows, permission names, switch states, 30-second timer, EVA restore/substitution waves, taps, scoring and result logic remain HTML/CSS/JS. Generated images provide only the coherent graphical shells and reusable state surfaces.

## Target-selection rule

When a generation job names one asset ID, generate only that requested asset from the sections above, not the whole kit in one image. Preserve the same art direction and scale language across all four outputs.

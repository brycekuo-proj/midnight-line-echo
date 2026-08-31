# Prompt Spec — CH2-2 Spot-the-Difference GUI

Mini-game ID: `spot_the_difference`
Asset type: `minigame_ui`
Outputs:
- `img/ui/mg_ch22_spotdiff_frame.png`
- `img/ui/mg_ch22_spotdiff_marker.png`
- `img/ui/mg_ch22_spotdiff_complete.png`

## Goal

Create a restrained graphical interface kit for the CH2-2 room comparison mini-game. The actual Room A / Room B photographs remain separate evidence images and are inserted by HTML/CSS/JS.

## Art direction

- dark cold blue-grey mobile investigation UI
- thin diagnostic lines
- subtle rain-night / archive mood
- understated system labels
- slight digital imperfection
- high readability over photographic evidence
- transparent PNG where the asset is intended as an overlay
- no cartoon game styling
- no bright casual-game decoration

## Asset 1 — frame

A clean dual-evidence comparison frame designed for two vertically stacked photographs on a portrait phone screen. Include visual separation, subtle corner brackets, image labels A/B and a compact `0/5` progress zone. Do not bake actual room photographs into this asset.

## Asset 2 — marker

A transparent difference marker overlay: thin irregular diagnostic circle / scan ring with a subtle pulse-ready design. It must remain readable on both bright and dark photo areas. No text.

## Asset 3 — complete

A compact transparent result panel suitable for overlay after all five differences are found. Visual language: investigation completed / record matched. Keep text areas minimal so final localized text can be rendered by HTML.

## Implementation lock

All counters, clickable hotspots, labels and completion logic remain DOM/JS. Generated assets provide visual shells and overlays only.

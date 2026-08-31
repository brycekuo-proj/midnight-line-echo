# Prompt Spec — CH4-2 Territory GUI

Mini-game ID: `territory`
Asset type: `minigame_ui`
Outputs:
- `img/ui/mg_ch42_territory_board.png`
- `img/ui/mg_ch42_territory_cell_idle.png`
- `img/ui/mg_ch42_territory_cell_agent.png`
- `img/ui/mg_ch42_territory_cell_player.png`
- `img/ui/mg_ch42_territory_timer.png`
- `img/ui/mg_ch42_territory_result.png`

## Goal

Create a coherent graphical UI kit for the canonical CH4-2 5x5 Territory mini-game. The board must feel like an internal ECHO background-service control surface, not a colorful arcade board.

## Art direction

- near-black / dark graphite system panel
- cold grey interface structure
- restrained cyan / violet digital accents
- subtle warning-red only for conflict / danger state
- minimal scan-line / service-monitor texture
- mobile portrait readability
- understated psychological-horror technology
- no fantasy board-game look
- no neon cyberpunk overload
- no baked gameplay text that must be localized later

## Asset 1 — board

A clean 5x5 territory control surface background with clearly separated square slots, thin diagnostic borders and a compact header/footer area for status. The generated board must leave each of the 25 cell interiors visually neutral so DOM state layers can be placed over them.

## Asset 2 — idle cell

Transparent / isolated neutral cell state. Dim inactive system-region appearance. No symbols that imply ownership.

## Asset 3 — Agent cell

Transparent / isolated owned-cell state representing EVA / Agent control. Calm, precise, subtly violet-white system activation; not aggressive.

## Asset 4 — player cell

Transparent / isolated owned-cell state representing player control. Cooler cyan / human-input activation. Must be clearly distinguishable from Agent ownership even on a small phone screen.

## Asset 5 — timer

A compact countdown frame suitable for displaying `00:60` down to zero using HTML text. The image provides only frame, tick marks and system styling; actual digits remain DOM text.

## Asset 6 — result

A compact result panel shell with space for player territory count, Agent territory count and result/synchronization summary. Do not bake final numbers or localized copy into the image.

## Implementation lock

The 25 cells, click handling, waves, countdown, scoring and winner logic remain HTML/CSS/JS. Images provide the visual board and state layers only.

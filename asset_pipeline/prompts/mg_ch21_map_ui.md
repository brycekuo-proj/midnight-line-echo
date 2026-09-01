# Prompt Spec — CH2-1 Underground Map GUI

Mini-game ID: `underground_map`
Asset type: `minigame_ui`
Canon: `docs/canon/season1/1-2-1(new)_260525_230830 (1).txt`
Outputs: `mg_ch21_map_base`, `mg_ch21_map_markers`, `mg_ch21_map_panel`

## Goal and art direction

Create a coherent dark investigative map kit for the Wanhua underground-passage search. It should feel like a plausible archived transit/security diagram: near-black graphite, desaturated blue-grey concrete, thin cold-grey route lines, restrained cyan interaction accents, tiny warning-red anomaly accents, subtle rain/sensor grain, mobile portrait readability. No hacker-movie neon, cartoon map, fantasy, anime, decorative clues, labels, or dynamic text.

## Assets

- `mg_ch21_map_base`: portrait-oriented top-down passage diagram with two entrances/exits, corridor bends, a CCTV coverage area, a blind spot, and a graffiti-wall area. Leave the points neutral and unlabeled for DOM hit targets; no people or evidence photo.
- `mg_ch21_map_markers`: one transparent marker sprite sheet containing four clearly separated reusable tokens for exit, CCTV, blind spot, and graffiti/anomaly. Simple pictograms only, no words or letters.
- `mg_ch21_map_panel`: one isolated transparent-bottom-sheet/info-panel shell with blank title, evidence, and action zones for DOM content.

## Implementation lock

Tap targets, discovered state, labels, dialogue, clue counts, and zoom remain HTML/CSS/JS. Generate only the named asset in each job, except the manifest-defined marker sheet which intentionally contains its four marker tokens.

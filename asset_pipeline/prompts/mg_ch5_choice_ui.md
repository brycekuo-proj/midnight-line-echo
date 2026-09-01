# Prompt Spec — CH5 Choice Candy GUI

Mini-game ID: `choice_candy`
Asset type: `minigame_ui`
Canon: `docs/canon/season1/1-5(new)_260528_024502.txt`
Outputs: `mg_ch5_choice_highlight`, `mg_ch5_choice_result`

## Goal and art direction

Create minimal UI layers for the red/blue candy choice inside a pure white synchronization space. The scene image supplies hands and candies; these assets add only restrained selection and result surfaces. Use soft translucent white, fine neutral-grey structure, extremely restrained red/blue edge color, and silent clinical elegance. No dark dashboard, fantasy magic, arcade glow, or text.

## Assets

- `mg_ch5_choice_highlight`: one isolated transparent soft elliptical/radial selection halo usable beneath either candy; neutral white core with balanced faint red and blue edge hints so CSS can tint it.
- `mg_ch5_choice_result`: one isolated transparent minimal white-glass result panel shell with subtle grey edge and blank space for route/synchronization DOM text.

## Implementation lock

Hit targets, hover/tap state, which candy is selected, route dispatch, result copy, and synchronization state remain HTML/CSS/JS. Generate only the named asset.

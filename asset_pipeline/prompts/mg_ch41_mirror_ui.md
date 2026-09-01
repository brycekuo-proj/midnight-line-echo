# Prompt Spec — CH4-1 Mirror Fragment / Mirror Lock GUI

Mini-game IDs: `mirror_fragment`, `mirror_lock`
Asset type: `minigame_ui`
Canon: `docs/canon/season1/1-4-1(new)_260527_142931.txt`
Outputs: `mg_ch41_mirror_board`, `mg_ch41_mirror_fragment`, `mg_ch41_mirror_lock_overlay`, `mg_ch41_mirror_screenshot`

## Goal and art direction

Create a restrained mirrored-chat contamination kit. It should feel like the existing chat system has reflected its own output structure: dark graphite and smoke-grey glass, muted off-white, faint violet-white mirror traces, restrained cyan interaction, subtle reversed scan direction and near-symmetry. Horror comes from classification and overlap, not cracked-mirror clichés, faces, gore, or aggressive glitch.

## Assets

- `mg_ch41_mirror_board`: portrait bottom drawer/puzzle board with a blank reconstruction lane for 5–6 fragments, an interpretation zone, and a compact status footer.
- `mg_ch41_mirror_fragment`: isolated transparent draggable mirrored-text fragment shell with blank interior; irregular digital/glass edge, not literal broken glass.
- `mg_ch41_mirror_lock_overlay`: transparent low-opacity mirrored interference overlay for choice locking/overwriting, with reflected bubble contours and alignment traces but no readable content.
- `mg_ch41_mirror_screenshot`: one in-world phone screenshot/evidence visual showing a structurally mirrored chat bubble/output layer and faint doubled interface geometry; no readable dialogue, names, time, or choices.

## Implementation lock

Mirrored phrases, fragments, drag order, interpretation choices, locks, overwritten replies, scores, and localized content remain HTML/CSS/JS. Generate only the named asset.

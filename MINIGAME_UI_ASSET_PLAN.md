# ECHO Mini-game UI Asset Plan

Status: LOCKED WORKFLOW v1
Project: Midnight Line: ECHO
Repo: brycekuo-proj/midnight-line-echo

## Purpose

All chapter mini-games in ECHO must be presented as real graphical interfaces. Text-only interaction or plain button lists are not acceptable as final production UI.

Each mini-game must combine:
- HTML/CSS/JS interaction logic
- dedicated graphical UI assets
- chapter-specific visual language
- ECHO-wide art direction consistency
- mobile-first readability

The UI must remain interactive. Generated images support the interface; they do not replace the interactive implementation with a dead screenshot.

## Global visual direction

- dark, restrained, low-saturation digital interface
- psychological-horror tone
- fake system / archive / diagnostic / chat-extension feel
- subtle glitch or archival imperfection only where canon supports it
- mobile portrait readability
- no cartoon UI
- no anime restyle
- no bright casual-game palette
- no unrelated decorative imagery

## Mini-game asset matrix

### CH2-1 — Underground Map Investigation
Interaction: tap investigation points and reveal local evidence.

Assets:
- `mg_ch21_map_base.png`
- `mg_ch21_map_marker_exit.png`
- `mg_ch21_map_marker_cctv.png`
- `mg_ch21_map_marker_blindspot.png`
- `mg_ch21_map_marker_graffiti.png`
- `mg_ch21_map_panel.png`

Implementation note: use generated map/panel visuals as layers while hit targets, state and dialogue remain real DOM/JS interaction.

### CH2-2 — Room Spot-the-Difference
Interaction: compare two matched room photos and mark five differences.

Assets:
- `ch22_room_diff_A.jpg`
- `ch22_room_diff_B.jpg`
- `mg_ch22_spotdiff_frame.png`
- `mg_ch22_spotdiff_marker.png`
- `mg_ch22_spotdiff_complete.png`

Critical lock: B must be an edit of approved A and may only contain the five canon differences.

### CH3-1 — Memory Repair
Interaction: drag / reorder 6–8 corrupted message positions with additional decoy fragments, then submit the full arrangement for 1A2B evaluation.

Critical lock: never reveal per-fragment correctness. The mini-game UI must not explain the rules or show instructional prose. The current `xAyB` value is permanently displayed in the mini-game UI's upper-right status position and is updated in place after each submission; do not render separate result/history messages elsewhere. A = correct fragment in the correct position, B = correct fragment in a wrong position. Current runtime uses 7 positions + 2 decoys.

Assets:
- `mg_ch31_memory_board.png`
- `mg_ch31_memory_card.png`
- `mg_ch31_memory_slot.png`
- `mg_ch31_memory_complete.png`

### CH3-2 — ONLINE GAME / Moderator Deduction
Interaction: one persistent three-round hidden-role game. Read testimony, mark suspicion, watch two users go offline, then make one final moderator vote. Offline candidates remain selectable in the final vote.

Current backing assets (reused temporarily; no longer define the mechanic):
- `mg_ch32_ssd_panel.png`
- `mg_ch32_ssd_card.png`
- `mg_ch32_ssd_label.png`
- `mg_ch32_ssd_detail.png`

Future CH3-2 art refresh should target online roster cards / moderator-vote UI, not SSD inspection.

### CH3-3 — Audio Verification
Interaction: play, compare and verify suspicious audio evidence.

Assets:
- `mg_ch33_audio_panel.png`
- `mg_ch33_waveframe.png`
- `mg_ch33_audio_button.png`
- `mg_ch33_audio_result.png`

### CH4-1 — Mirror Fragment / Mirror Lock
Interaction: reconstruct mirrored text, then resolve mirror-overwrite choice state.

Assets:
- `mg_ch41_mirror_board.png`
- `mg_ch41_mirror_fragment.png`
- `mg_ch41_mirror_lock_overlay.png`
- `mg_ch41_mirror_screenshot.png`

### CH4-2 — Permission Whack
Interaction: quickly allow/block permission cards.

Assets:
- `mg_ch42_permission_panel.png`
- `mg_ch42_permission_card.png`
- `mg_ch42_permission_badge.png`
- `mg_ch42_permission_result.png`

### CH4-2 — Territory
Interaction: 5x5 player-versus-Agent territory control with countdown and result state.

Assets:
- `mg_ch42_territory_board.png`
- `mg_ch42_territory_cell_idle.png`
- `mg_ch42_territory_cell_agent.png`
- `mg_ch42_territory_cell_player.png`
- `mg_ch42_territory_timer.png`
- `mg_ch42_territory_result.png`

### CH5 — Evidence Archive
Interaction: inspect accumulated evidence through a graphical archive.

Assets:
- `mg_ch5_archive_panel.png`
- `mg_ch5_archive_card.png`
- `mg_ch5_archive_thumbframe.png`
- `mg_ch5_archive_detail.png`

Existing evidence images should be reused inside the graphical archive rather than regenerated.

### CH5 — ECHO Link Board
Interaction: connect evidence nodes to the central ECHO node.

Assets:
- `mg_ch5_linkboard_base.png`
- `mg_ch5_linkboard_echo_node.png`
- `mg_ch5_linkboard_evidence_node.png`
- `mg_ch5_linkboard_connection_glow.png`
- `mg_ch5_linkboard_complete.png`

### CH5 — Residual Voices
Interaction: inspect non-live residual messages in a graphical echo layer.

Assets:
- `mg_ch5_residual_bg.png`
- `mg_ch5_residual_bubble.png`
- `mg_ch5_residual_overlay.png`

### CH5 — Choice Candy
Interaction: choose red or blue candy in the white synchronization space.

Assets:
- `ch5_choice_candy.jpg`
- `mg_ch5_choice_highlight.png`
- `mg_ch5_choice_result.png`

## Production priority

### Batch 1
1. CH2-2 Room Spot-the-Difference
2. CH4-2 Territory
3. CH5 ECHO Link Board

### Batch 2
4. CH3-1 Memory Repair
5. CH4-1 Mirror Fragment / Mirror Lock
6. CH5 Evidence Archive

### Batch 3
7. CH2-1 Underground Map
8. CH3-2 ONLINE GAME / Moderator Deduction
9. CH3-3 Audio Verification
10. CH5 Residual Voices

## Delivery rule

Every mini-game asset must have:
- asset ID
- chapter
- mini-game ID
- UI role
- output path
- generation mode
- dependency / anchor if any
- QA state
- local Mac presence
- GitHub sync state

Canonical GUI output root: `img/ui/`
Canonical scene/evidence root: `img/scenes/`

No mini-game is production-complete until both graphical assets and real interaction are integrated and QA-approved.

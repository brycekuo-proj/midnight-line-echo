# Prompt Spec — CH3-1 Memory Repair GUI

Mini-game ID: `memory_repair`
Asset type: `minigame_ui`
Canon: `docs/canon/season1/1-3-1(new)_260526_165733.txt`
Outputs: `mg_ch31_memory_board`, `mg_ch31_memory_card`, `mg_ch31_memory_slot`, `mg_ch31_memory_complete`

## Goal and art direction

Create a damaged-chat memory reconstruction kit that begins clinical and becomes quietly uncanny. Use dark blue-grey/graphite surfaces, muted off-white structure, restrained cyan for player interaction, faint violet-white preservation traces, blocked-pixel/archive corruption, and subtle scan lines. It must remain a plausible chat recovery tool, not a sci-fi console or puzzle toy. No baked dialogue, names, letters, scores, or localized text.

## Assets

- `mg_ch31_memory_board`: portrait bottom-sheet reconstruction board with blank fixed-message zones, a central reorder lane, several empty slots, and a compact status/footer zone.
- `mg_ch31_memory_card`: isolated transparent draggable message-fragment card shell, blank and wide enough for two DOM text lines.
- `mg_ch31_memory_slot`: isolated transparent empty drop-slot frame with a restrained broken-memory contour.
- `mg_ch31_memory_complete`: isolated transparent compact completion overlay with blank space for repair/preservation feedback.

## Implementation lock

Dialogue fragments, ordering, drag/drop, damaged characters, progress, correctness, and synchronization stay in HTML/CSS/JS. Generate only the asset ID named by the job.

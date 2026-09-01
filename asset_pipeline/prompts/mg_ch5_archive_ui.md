# Prompt Spec — CH5 Evidence Archive GUI

Mini-game ID: `evidence_archive`
Asset type: `minigame_ui`
Canon: `docs/canon/season1/1-5(new)_260528_024502.txt`
Outputs: `mg_ch5_archive_panel`, `mg_ch5_archive_card`, `mg_ch5_archive_thumbframe`, `mg_ch5_archive_detail`

## Goal and art direction

Create the final online-record archive that gathers seven previously seen evidence items. It must feel like a quiet chat-attached archival drawer: near-black graphite, desaturated blue-grey, muted paper/glass layers, off-white file structure, restrained cyan selection and faint violet preservation traces. Investigative and intimate, not a police-dashboard cliché or futuristic command center.

## Assets

- `mg_ch5_archive_panel`: portrait archive drawer background with a clean list/grid area for seven records, blank header, and blank status/footer.
- `mg_ch5_archive_card`: isolated transparent reusable file-card shell with thumbnail, timestamp/type, and short-label zones left empty.
- `mg_ch5_archive_thumbframe`: isolated transparent evidence-thumbnail frame with restrained archival corners and no image content.
- `mg_ch5_archive_detail`: isolated transparent large evidence-detail/lightbox shell with blank media, metadata, and navigation zones.

## Implementation lock

Reuse existing canonical evidence images. Evidence thumbnails, names, timestamps, the seven-item count, zoom, selection, and navigation remain HTML/CSS/JS. Generate no replacement evidence and only the named shell asset.

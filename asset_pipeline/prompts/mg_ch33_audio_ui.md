# Prompt Spec — CH3-3 Audio Verification GUI

Mini-game ID: `audio_verification`
Asset type: `minigame_ui`
Canon: `docs/canon/season1/1-3-3(new)_260527_001951.txt`
Outputs: `mg_ch33_audio_panel`, `mg_ch33_waveframe`, `mg_ch33_audio_button`, `mg_ch33_audio_result`

## Goal and art direction

Create a plausible forensic audio-comparison kit for three suspicious tunnel recordings. The interface becomes subtly unreliable without visual spectacle. Use dark graphite, desaturated blue-grey, muted off-white wave guides, restrained cyan playback accents, tiny warning-red discrepancy marks, subtle compression/scan-line texture, and mobile readability. No microphones with faces, monsters, loud glitch art, neon, or baked filenames/durations/letters.

## Assets

- `mg_ch33_audio_panel`: portrait bottom-sheet verifier with three blank stacked channel rows, a comparison/status zone, and compact footer.
- `mg_ch33_waveframe`: isolated transparent reusable waveform viewport/frame; waveform data itself remains DOM/canvas.
- `mg_ch33_audio_button`: isolated transparent neutral circular playback/control-button shell with no fixed play/pause symbol or state.
- `mg_ch33_audio_result`: isolated transparent compact verification-result panel with blank anomaly and synchronization zones.

## Implementation lock

Waveforms, A/B/C labels, filenames, durations, playback, selected answer, scoring, transcript clues, and result text remain HTML/CSS/JS. Generate only the named asset.

# Midnight Line: ECHO Canon Manifest

Purpose:
Map current runtime chapter ids to locked Season 1 canon source files.

Runtime integration note (2026-09-07): graphical mini-game assembly is wired across CH2-1 through CH5, and the Origin bonus runtime is now implemented as a dedicated Oracle-era 1-bit / CRT mode with Neural Drift. For the current gameplay / asset integration state, use `docs/CHAPTER_INTEGRATION_STATUS.md`. The canon-parity warnings below remain useful for dialogue, pacing and ending-split work.

Scope:
- Documentation only
- No dialogue rewritten here
- Source of truth priority follows `docs/canon/season1/README.md`:
  `(new)` / ending final files > legacy draft

Status legend:
- `implemented`: runtime chapter exists and roughly matches the intended route
- `legacy_canon`: canon exists from an earlier locked source, but that source is not yet migrated into `docs/canon/season1/`
- `partial`: runtime chapter exists but only partially matches locked canon
- `mismatch`: runtime chapter exists but meaningfully differs from locked canon
- `missing`: locked canon exists but no dedicated runtime implementation is present

## Runtime Mapping

| Runtime id | Canon source file | Chapter title | Status | Notes | Mismatch warnings |
| --- | --- | --- | --- | --- | --- |
| `1-1` | Legacy canon source carried forward from an earlier locked version; not yet migrated into `docs/canon/season1/` | 《已讀者》 | `legacy_canon` | Runtime chapter exists in `chapters/ch1-1.js`. Canon exists, but its source is legacy and has not yet been migrated into the Season 1 canon vault. | Source is not missing, but the legacy locked file is currently outside `docs/canon/season1/`, so this runtime chapter should be treated as canon-backed pending source migration into the vault. |
| `2-1` | `docs/canon/season1/1-2-1(new)_260525_230830 (1).txt` | 《地下道》 | `implemented` | K investigation route now includes investigation data, graphical underground-map exploration, clue tracking, graffiti discovery, CCTV evidence and time-anomaly follow-up. | Core locked mechanic is present. Remaining work is scene-by-scene canon dialogue/pacing QA and mobile hotspot QA. |
| `2-2` | `docs/canon/season1/1-2-2(new)_260525_232926.txt` | 《雨夜留言》 | `partial` | Lin Yuqing route now includes the graphical A/B room Spot-the-Difference interaction and continues into the existing rain-night evidence sequence. | Core mechanic is integrated, but the exact five visual differences and hotspot alignment still require visual QA against the locked canon. |
| `3-1` | `docs/canon/season1/1-3-1(new)_260526_165733.txt` | 《已讀中》 | `partial` | EVA / memory-corruption route now includes an interactive graphical Memory Repair sequence inside the rewrite event. | Repair gameplay is present, but the locked multi-act damaged-chat structure has not yet been reproduced scene-for-scene. |
| `3-2` | `docs/canon/season1/1-3-2(new)_260903_werewolf_final.txt` | 《在線中》 | `implemented` | Single-session ONLINE GAME now uses hidden-role deduction: 6 candidates, three discussion rounds, two forced offline eliminations, suspicion marks, and one final moderator vote. | Success verifies SilentRoom and preserves the high-sync CH4 route; failure reveals no correct answer, zeroes CH3-2 sync, and forces the low-sync CH4 route. |
| `3-3` | `docs/canon/season1/1-3-3(new)_260527_001951.txt` | 《不要開聲音》 | `partial` | K audio-anomaly route now includes a graphical Audio Verification sequence with multiple clips, waveform presentation and answer validation. | Core verification mechanic is present; exact canon clip ordering, scoring and pacing still need scene-level cross-check. |
| `4-1` | `docs/canon/season1/1-4-1(new)_260527_142931.txt` | 《鏡中已讀》 | `partial` | EVA high-sync route now includes graphical `Mirror Fragment` reconstruction and `Mirror Lock` resolution in addition to the existing identity-contamination sequence. | Core mirror mechanics are integrated, but interference timing and locked scene pacing still need canon QA. |
| `4-2` | `docs/canon/season1/1-4-2(new)_260527_211203.txt` | 《Agent》 | `implemented` | Runtime is now the EVA assistant-escalation route and contains real Permission Whack and 5×5 Territory interactions, both skinned with the generated production UI asset sets. | Core locked mechanics and chapter identity are present. Remaining work is dialogue/pacing QA rather than structural replacement. |
| `5` | `docs/canon/season1/1-5(new)_260528_024502.txt` | 《ECHO》 | `partial` | Runtime title is now aligned and the endgame includes Evidence Archive, ECHO Link Board, Residual Voices and Choice Candy before the final synchronization choice. | Core graphical endgame structure is present, but the dedicated mid/high canon endings and their exact staging are still not split into separate runtime units. |
| `end_normal` | `docs/canon/season1/Ending -fake _260528_172824.txt` | 《離線》 | `partial` | Runtime fake ending exists in `chapters/ch_end_normal.js`. It preserves the “returned to reality, then uncertainty reopens” idea. | Locked ending file emphasizes rain-image marquee pacing and a very restrained late reversal. Current runtime uses a chat-based postscript structure instead of the locked marquee presentation. |
| `end_mid` | `docs/canon/season1/Ending -mid sym_260528_172505.txt` | Canon ending concept: 《仍在線》 | `mismatch` | No dedicated runtime id exists; behavior is embedded in `showEnd5()` inside `chapters/ch5.js`. | Current runtime labels the mid ending as `《循環在線》` and uses a conventional ending screen. Locked canon specifies a slow “welcome” message wash in-chat followed by EVA’s late appearance. Presentation and naming differ. |
| `end_high` | `docs/canon/season1/Ending -hi sym_260528_172451.txt` | Canon ending concept: 《理解者》 | `mismatch` | No dedicated runtime id exists; behavior is embedded in `showEnd5()` inside `chapters/ch5.js`. | Current runtime labels the high-sync ending as `《永遠在一起》` and renders it through the standard ending overlay plus white page epilogue. Locked canon specifies a quieter white-space EVA encounter without normal chat framing. Naming and staging differ. |
| `origin` | `docs/canon/season1/1-番外(new)_260528_215910.txt` | 《ECHO的出現》 | `implemented` | Dedicated runtime exists in `chapters/ch_origin.js`; player route unlocks after 100% Season 1 completion and engineering mode opens it directly. | Canon presentation is implemented as a distinct 1-bit / CRT Oracle terminal with 60s qualification Neural Drift, 120s human synchronization, Gamma operator chat/archive flow and EVA joining the channel. |

## Additional Canon Files

| Canon file | Role | Notes |
| --- | --- | --- |
| `docs/canon/season1/Time line_260528_165301.txt` | Universe timeline reference | World chronology support file. Useful for future metadata and route ordering, but not itself a runtime chapter. |

## Current Runtime Coverage Summary

- Covered in some form:
  - `1-1`
  - `2-1`
  - `2-2`
  - `3-1`
  - `3-2`
  - `3-3`
  - `4-1`
  - `4-2`
  - `5`
  - fake ending
  - mid/high ending logic
  - `origin`

- Missing as dedicated runtime units:
  - dedicated `end_mid`
  - dedicated `end_high`

## Highest-Priority Remaining Canon Work

1. `3-2` still needs the locked online-confirmation / testimony / offline-confirmation loop; the current SSD archive is only a support interaction.
2. Mid and high endings are not modeled as canon-distinct runtime scenes; they are still condensed into `showEnd5()`.
3. `origin` is implemented; remaining work is mobile play-balance / visual QA for the two Neural Drift phases.
4. `1-1` remains legacy canon and its locked source still needs migration into `docs/canon/season1/`.
5. `2-2` requires visual QA of the exact five A/B differences and mobile hotspot positions.
6. `3-1`, `3-3`, `4-1`, `4-2`, and `5` now have their core graphical mechanics, but dialogue, scoring, timing and scene pacing still need line-by-line canon verification.

## Refactor Use

This manifest should be treated as the baseline mapping document for Phase 1 refactor planning:

- preserve runtime ids where practical
- introduce canon-backed scene manifests per route
- split mismatched endings into dedicated runtime scenes
- preserve Origin as a separate Oracle-era mode within the same static project

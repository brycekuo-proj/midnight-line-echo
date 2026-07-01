# Midnight Line: ECHO Canon Manifest

Purpose:
Map current runtime chapter ids to locked Season 1 canon source files.

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
| `2-1` | `docs/canon/season1/1-2-1(new)_260525_230830 (1).txt` | 《地下道》 | `partial` | Route identity is aligned: K investigation line, tunnel case, time anomaly, surveillance focus. | Locked canon specifies stronger investigation structure and explicit mechanics such as investigation data cards, interactive map exploration, clue tracking, and graffiti discovery. Current runtime is mostly linear chat with file cards and choice prompts, so gameplay structure differs materially. |
| `2-2` | `docs/canon/season1/1-2-2(new)_260525_232926.txt` | 《雨夜留言》 | `partial` | Route identity appears aligned: Lin Yuqing line, rain-night atmosphere, personal trace exploration. | Locked canon specifies a room-comparison / spot-the-difference interaction around two room photos. Current prototype route is not verified here as matching that mechanic and should be treated as only partial until cross-checked scene-by-scene. |
| `3-1` | `docs/canon/season1/1-3-1(new)_260526_165733.txt` | 《已讀中》 | `mismatch` | Runtime chapter exists in `chapters/ch3.js`. EVA / memory corruption route intent is present. | Locked canon defines a damaged-chat recovery chapter centered on drag-and-repair memory reconstruction across multiple acts. Current runtime uses conventional chat choices and injected text corruption instead of the specified repair mechanics. |
| `3-2` | `docs/canon/season1/1-3-2(new)_260526_232201.txt` | 《在線中》 | `partial` | Route identity is aligned: online-presence horror, Lin Yuqing, growing online user count, “still online” concept. | Locked canon defines a structured “online confirmation” system with viewable online list, testimony rounds, and per-round offline confirmation actions. Current runtime preserves the mood and theme but not the canon interaction model. |
| `3-3` | `docs/canon/season1/1-3-3(new)_260527_001951.txt` | 《不要開聲音》 | `partial` | Route identity is aligned: K line, audio anomaly, verification anxiety, third-breath motif. | Locked canon specifies explicit sound-verification gameplay with multiple clips and answer validation. Current runtime includes audio-message presentation and choices, but not the full validation minigame structure described in canon. |
| `4-1` | `docs/canon/season1/1-4-1(new)_260527_142931.txt` | 《鏡中已讀》 | `partial` | EVA high-sync route, identity blending, mirror contamination, and oppressive tone are aligned. | Locked canon specifies `Mirror Fragment` and `Mirror Lock` systems with mirrored text reconstruction and interference behavior. Current runtime delivers the concept through chat effects and choices, but not through the locked interaction model. |
| `4-2` | `docs/canon/season1/1-4-2(new)_260527_211203.txt` | Canon: 《Agent》 / Runtime UI: 《回音》 | `mismatch` | Runtime chapter exists in `chapters/ch4.js` as a room-audio / online-intrusion sequence. | This is the clearest runtime-to-canon divergence. Locked canon defines an EVA assistant escalation chapter, including permission management and territory/control systems. Current runtime title, premise, and mechanics differ substantially from canon. |
| `5` | `docs/canon/season1/1-5(new)_260528_024502.txt` | Canon: 《ECHO》 / Runtime UI: 《同步》 | `mismatch` | Runtime final chapter exists in `chapters/ch5.js` and already handles final route logic and ending dispatch. | Locked canon defines a more structured endgame with evidence archive, white-space truth review, and link-board style relationship review. Current runtime preserves final-reveal intent but uses a different chapter title and a different interaction structure. |
| `end_normal` | `docs/canon/season1/Ending -fake _260528_172824.txt` | 《離線》 | `partial` | Runtime fake ending exists in `chapters/ch_end_normal.js`. It preserves the “returned to reality, then uncertainty reopens” idea. | Locked ending file emphasizes rain-image marquee pacing and a very restrained late reversal. Current runtime uses a chat-based postscript structure instead of the locked marquee presentation. |
| `end_mid` | `docs/canon/season1/Ending -mid sym_260528_172505.txt` | Canon ending concept: 《仍在線》 | `mismatch` | No dedicated runtime id exists; behavior is embedded in `showEnd5()` inside `chapters/ch5.js`. | Current runtime labels the mid ending as `《循環在線》` and uses a conventional ending screen. Locked canon specifies a slow “welcome” message wash in-chat followed by EVA’s late appearance. Presentation and naming differ. |
| `end_high` | `docs/canon/season1/Ending -hi sym_260528_172451.txt` | Canon ending concept: 《理解者》 | `mismatch` | No dedicated runtime id exists; behavior is embedded in `showEnd5()` inside `chapters/ch5.js`. | Current runtime labels the high-sync ending as `《永遠在一起》` and renders it through the standard ending overlay plus white page epilogue. Locked canon specifies a quieter white-space EVA encounter without normal chat framing. Naming and staging differ. |
| `origin` | `docs/canon/season1/1-番外(new)_260528_215910.txt` | 《ECHO的出現》 | `missing` | Locked prequel / extra chapter exists in canon and is marked as Oracle-era origin material. | No dedicated runtime implementation, route entry, or alternate UI mode currently exists for the Origin prequel. Canon also requires a distinct 1-bit / CRT / research terminal presentation and the `Neural Drift` sync test. |

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

- Missing as dedicated runtime units:
  - `origin`
  - dedicated `end_mid`
  - dedicated `end_high`

## Highest-Priority Mismatch Warnings

1. `4-2` is canonically `《Agent》`, but the current runtime implements a different chapter concept (`《回音》`) with different mechanics and tone emphasis.
2. `5` is canonically `《ECHO》`, but the current runtime presents `《同步》` and uses a different final interaction structure.
3. `3-1`, `3-2`, `3-3`, and `4-1` preserve route themes but not the locked mechanics described in canon.
4. Mid and high endings are not modeled as canon-distinct runtime scenes; they are currently condensed into `showEnd5()`.
5. `origin` canon exists, but there is no runtime implementation or alternate UI mode for it.
6. `1-1` is legacy canon and should not be treated as missing, but its source file still needs to be migrated into `docs/canon/season1/` for vault completeness.

## Refactor Use

This manifest should be treated as the baseline mapping document for Phase 1 refactor planning:

- preserve runtime ids where practical
- introduce canon-backed scene manifests per route
- split mismatched endings into dedicated runtime scenes
- implement Origin as a separate mode within the same static project

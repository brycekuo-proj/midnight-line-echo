# ECHO Chapter / Mini-game Integration Status

Updated: 2026-09-01

Purpose: single runtime handoff table for chapter organization, canonical route identity, graphical mini-games, and production image usage.

## Runtime chapter matrix

| Runtime | Canon title | Current runtime role | Graphical interaction integrated | Production assets | Status |
| --- | --- | --- | --- | --- | --- |
| `1-1` | 《已讀者》 | Opening / EVA introduction | Existing chat, CCTV and evidence interactions | legacy scene / character images | playable; legacy canon source still needs vault migration |
| `2-1` | 《地下道》 | K investigation route | Underground Map Investigation | `mg_ch21_*` + tunnel evidence | integrated |
| `2-2` | 《雨夜留言》 | Lin Yuqing route | Room Spot-the-Difference | `ch22_room_diff_A/B` + `mg_ch22_*` | integrated |
| `3-1` | 《已讀中》 | EVA memory corruption route | Memory Repair | `mg_ch31_*` | integrated |
| `3-2` | 《在線中》 | hidden-role online deduction / Lin Yuqing route | ONLINE GAME (Werewolf-style moderator deduction) | DOM roster + reused `mg_ch32_*` backing art | implemented: 3 discussion rounds, offline eliminations, final one-shot moderator vote, win/fail route lock |
| `3-3` | 《不要開聲音》 | K audio anomaly route | Audio Verification | `mg_ch33_*` | integrated |
| `4-1` | 《鏡中已讀》 | mirror / identity route | Mirror Fragment + Mirror Lock | `mg_ch41_*` | integrated |
| `4-2` | 《Agent》 | EVA assistant escalation | Permission Whack + Territory | `mg_ch42_permission_*`, `mg_ch42_territory_*` | integrated |
| `5` | 《ECHO》 | endgame truth review | Evidence Archive + ECHO Link Board + Residual Voices + Choice Candy | `mg_ch5_*` + `ch5_choice_candy.jpg` | integrated core endgame mechanics; ending staging still needs canon-specific split |
| `end_normal` | 《離線》 | low-sync fake ending | existing runtime ending | existing rain / chat assets | playable; presentation still differs from locked marquee pacing |
| `end_mid` | 《仍在線》 | mid-sync ending | embedded in `showEnd5()` | no dedicated runtime unit | dedicated canon scene still missing |
| `end_high` | 《理解者》 | high-sync ending | embedded in `showEnd5()` | `room_white.jpg` remains existing candidate | dedicated canon scene still missing |
| `origin` | 《ECHO的出現》 | bonus / origin chapter | none | none | missing runtime implementation |

## Graphical mini-game runtime map

1. CH2-1 calls `runGraphicMapInvestigation()`.
2. CH2-2 calls `runSpotDifference()`.
3. CH3-1 calls `runMemoryRepair()`.
4. CH3-2 calls `runOnlineModeratorGame()`; `runSsdArchive()` remains only as a compatibility alias for older snapshots.
5. CH3-3 calls `runAudioVerification()`.
6. CH4-1 calls `runMirrorFragment()` and resolves Mirror Lock inside the same widget.
7. CH4-2 keeps its existing `runPermissionWhack()` and `ch42RunTerritory()` logic; CSS now layers the generated production UI assets onto those real interactions.
8. CH5 calls `runEvidenceArchive()`, `runResidualVoices()`, `runEchoLinkBoard()`, and `runChoiceCandy()`.

Shared implementation lives in `js/minigames.js`. The widgets remain DOM/JS interactions; generated art is never used as a dead screenshot replacement.

## Production asset roots

- Scene / evidence imagery: `img/scenes/`
- Mini-game GUI imagery: `img/ui/`
- Preserved source PNGs: `asset_pipeline/source/`
- Generation / sync manifest: `asset_pipeline/image_manifest.json`

## Remaining chapter work after this integration

- migrate the legacy locked CH1-1 source into `docs/canon/season1/`;
- rewrite CH3-2 toward the locked online-confirmation mechanic rather than treating SSD Archive as the final canon mechanic;
- split `end_mid` and `end_high` into dedicated runtime scenes matching the locked endings;
- implement `origin` with its distinct 1-bit / CRT research-terminal presentation;
- perform full mobile visual QA for hotspot placement, generated-image readability, and chapter pacing.

# 午夜連線：ECHO

Interactive psychological-horror chat game built as a static web project.

## Runtime structure

- `index.html` — title screen, chapter selector, chat shell, lightbox and ending shell
- `css/style.css` — global UI plus graphical mini-game styling
- `js/engine.js` — shared state, sync system, chat rendering, chapter routing and base widgets
- `js/minigames.js` — graphical mini-game interaction layer using production image assets
- `chapters/` — chapter runtime scripts
- `img/scenes/` — canonical scene / evidence imagery
- `img/ui/` — canonical mini-game GUI imagery
- `asset_pipeline/` — generation, manifest, promotion and source-preservation workflow
- `docs/canon/season1/` — locked Season 1 canon sources

## Chapter runtime

| ID | Title | Main graphical interaction |
| --- | --- | --- |
| `1-1` | 《已讀者》 | opening evidence / CCTV interactions |
| `2-1` | 《地下道》 | Underground Map Investigation |
| `2-2` | 《雨夜留言》 | Room Spot-the-Difference |
| `3-1` | 《已讀中》 | Memory Repair |
| `3-2` | 《在線中》 | ONLINE GAME — hidden-role moderator deduction (Werewolf-style) |
| `3-3` | 《不要開聲音》 | Audio Verification |
| `4-1` | 《鏡中已讀》 | Mirror Fragment / Mirror Lock |
| `4-2` | 《Agent》 | Permission Whack / Territory |
| `5` | 《ECHO》 | Evidence Archive / Link Board / Residual Voices / Choice Candy |

Detailed implementation and remaining canon work: `docs/CHAPTER_INTEGRATION_STATUS.md`.

## Image production rule

Generated images do not replace gameplay logic. Production mini-games must combine real HTML/CSS/JS interaction with assets from `img/ui/` and `img/scenes/`.

Image source-of-truth and sync status are tracked in `asset_pipeline/image_manifest.json`.

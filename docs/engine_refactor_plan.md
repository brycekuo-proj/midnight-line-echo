# Engine Refactor Plan

Purpose:
Define a safe Phase 2 plan for refactoring `js/engine.js` without changing visible UI, gameplay behavior, repository structure, or current chapter-facing APIs.

Constraints:
- No rebuild
- Vanilla HTML/CSS/JS only
- GitHub Pages compatible
- Preserve current shell and current progression behavior
- Preserve current runtime chapter ids
- Preserve compatibility for existing chapter scripts in `chapters/*.js`

Target:
Split `engine.js` by responsibility while keeping the current experience functionally identical during the transition.

## Current `engine.js` Responsibilities

`js/engine.js` currently combines:

- global state and persistence
- sync scoring and evaluation
- clock/timing helpers
- header/avatar management
- chat message rendering
- option rendering and choice handling
- silence timer behavior
- lightbox/media behavior
- file/evidence card behavior
- chapter transition and ending flow
- chapter select unlock logic

This is effective for a prototype, but it creates high coupling between story content, UI rendering, and progression logic.

## Refactor Principle

Do not change chapter files first.

The safest path is:

1. extract internal responsibilities behind stable wrappers
2. keep global function names available
3. move chapter files only after the compatibility layer is stable

That means `window.CHAPTERS[...]` files should continue calling the same APIs during Phase 2:

- `addMsg`
- `showOpts`
- `addSync`
- `subSync`
- `setHeader`
- `swapHeaderImg`
- `applyKGlitch`
- `openLB`
- `addFileCard`
- `fadeOut`
- `showEnd`
- `startChapter`
- `goChapterSelect`
- `sleep`
- `notification`
- `glitch`
- `flash`
- `startSilence`

## Proposed Module Split

### 1. `state / progress`

Suggested file:
- `js/state/progress.js`

Owns:
- `SYNC_MAX`
- `totalSync`
- `chapterSync`
- `currentChapter`
- `completedChapters`
- `backCount`
- `filesViewed`
- `silTimer`
- `silTriggered`
- `lbViewCount`
- `loadProgress()`
- `saveProgress()`
- sync mutation helpers
- derived progression helpers

What stays:
- same localStorage key: `echo_progress`
- same sync math
- same unlock thresholds unless later canon work changes them intentionally

What moves from `engine.js`:
- top-level mutable state block
- `loadProgress`
- `saveProgress`
- `addSync`
- `subSync`
- `getSyncEval`
- shared counters currently used by back button, file tracking, silence rewards, and lightbox view rewards

Why this is safe:
- low DOM coupling
- easiest logic to isolate first
- chapters mostly depend on exposed functions, not on direct state internals

Migration risk:
- medium risk if chapter files or router still implicitly read globals
- low visible UI risk if a compatibility export keeps the same global names

### 2. `ui / chat rendering`

Suggested files:
- `js/ui/chat.js`
- `js/ui/header.js`
- `js/ui/feedback.js`

Owns:
- DOM element references for chat shell
- `sleep`
- `scrollBottom`
- `showTyping`
- `mkAv`
- `setHeader`
- `swapHeaderImg`
- `applyKGlitch`
- `syncEvaAvatar`
- `addMsg`
- `gToast`
- `notification`
- `glitch`
- `flash`
- clock display updates

What stays:
- current HTML structure in `index.html`
- current CSS class names
- current message token behavior and visual output
- current avatar image paths

What moves from `engine.js`:
- all chat DOM render logic
- status/header manipulation
- notification and glitch helpers
- message bubble creation

Why this is safe:
- it preserves the shell exactly
- rendering can be extracted without changing chapter content
- chapter scripts already call high-level functions, not DOM constructors directly in most cases

Migration risk:
- medium risk because `addMsg` is central and heavily used
- high regression sensitivity around pacing, typing indicators, and special bubble rendering

### 3. `ui / media`

Suggested files:
- `js/ui/lightbox.js`
- `js/ui/media_cards.js`

Owns:
- lightbox behavior
- media token rendering helpers
- file card rendering
- file tracking logic related to viewed evidence
- image and audio special-case UI builders

What stays:
- current lightbox overlay element ids
- existing image assets
- current inline media behavior
- current special content markers for compatibility in Phase 2

What moves from `engine.js`:
- `openLB`
- `addFileCard`
- `trackFile`
- special media branches inside `addMsg` where possible

Why this is safe:
- media is already a conceptual subsystem
- this reduces the largest branch complexity inside `addMsg`

Migration risk:
- medium risk because current media rendering is intertwined with special string tokens
- safest approach is to keep token parsing in the compatibility layer at first, then delegate rendering to media helpers

### 4. `flow / router`

Suggested files:
- `js/flow/router.js`
- `js/flow/endings.js`
- `js/flow/chapter_select.js`

Owns:
- chapter start/reset behavior
- route transitions
- ending branching
- chapter select unlock state
- chapter-end overlay state

What stays:
- current chapter ids
- current `window.CHAPTERS` registration pattern
- current chapter select HTML layout
- current chapter-start entrypoint names

What moves from `engine.js`:
- `fadeOut`
- `showEnd`
- `updateChapterSelectUI`
- `goChapterSelect`
- `startChapter`

Why this is safe:
- chapters already treat these as runtime services
- router logic can be split without changing chapter scripts if the same globals remain available

Migration risk:
- high logic risk because router code controls unlocks, transitions, and ending dispatch
- visible regression risk is moderate if chapter reset state is missed

### 5. `interactions / widgets`

Suggested files:
- `js/interactions/options.js`
- `js/interactions/silence.js`
- `js/interactions/widgets.js`

Owns:
- option button rendering and resolution
- silence timer mechanic
- reusable interaction scaffolds for future canon restoration

What stays:
- current option UI
- current sync-up / sync-down choice behavior
- current silence bonus behavior during compatibility phase

What moves from `engine.js`:
- `clearOpts`
- `showOpts`
- `startSilence`

Future role:
- host upcoming canon-specific widgets without polluting base chat rendering
- examples:
  - memory repair
  - online list confirmation
  - sound verification
  - mirror fragment
  - permission control
  - link board
  - neural drift

Why this is safe:
- existing option and silence systems are already self-contained interaction primitives
- this gives a home for canon mechanics later without forcing a rewrite now

Migration risk:
- low to medium in compatibility mode
- higher only when future canon mechanics are introduced

### 6. `content compatibility layer`

Suggested file:
- `js/content/compat.js`

Purpose:
Preserve the current chapter script contract while internals move underneath it.

Owns:
- global exports expected by chapter files
- compatibility parsing for legacy message tokens
- stable bridge between old chapter scripts and refactored modules

What stays:
- existing chapter scripts remain in place
- existing function names remain callable globally
- current repository layout remains recognizable

What moves here:
- `window` bindings for legacy APIs
- token-to-render delegation such as:
  - `__K_PHOTO__`
  - `__CCTV__`
  - `__ROOM__`
  - `__RAIN_PHOTO__`
  - `__ROOM_WHITE__`
  - `__AUDIO:...`
  - `__ONLINE_COUNT:...`
  - `__SYNC_BAR:...`

Why this is necessary:
- chapter files are tightly coupled to the current engine API
- removing that coupling immediately would be high-risk and would force content rewrites
- the compatibility layer lets internals evolve while the prototype stays playable

Migration risk:
- low if treated as a thin export layer
- high if it becomes a second monolith; it should shrink over time, not grow

## What Stays In Place

These should remain unchanged during the initial refactor:

- `index.html` shell structure
- `css/style.css` class naming and overall appearance
- `chapters/*.js` file locations and registration style
- existing image and document asset paths
- global runtime entrypoints used by HTML:
  - `loadProgress()`
  - `startChapter()`
  - `goChapterSelect()`
- current gameplay timing, choice flow, and sync scoring behavior

## What Moves Out Of `engine.js`

By end state, `js/engine.js` should no longer directly contain the implementation for every subsystem.

Safest reduced role for `engine.js`:

- bootstrap load order
- import / initialize extracted modules
- expose compatibility globals
- keep only minimal orchestration

In other words, `engine.js` becomes a façade, not the whole runtime.

## Migration Risks By Area

### Lowest-risk extraction

- state/progress
- interactions/options
- interactions/silence

Reason:
- relatively small API surface
- limited DOM complexity

### Medium-risk extraction

- ui/header
- ui/feedback
- ui/media_cards
- ui/lightbox

Reason:
- visual output must remain identical
- relies on exact DOM ids and CSS classes

### Highest-risk extraction

- `addMsg` and token handling
- router/endings
- chapter reset/start flow

Reason:
- these functions coordinate the rest of the runtime
- a small change can alter pacing or break branching unexpectedly

## Safest Order Of Refactor

### Step 1. Stabilize the public API

Before moving logic, define the intended compatibility surface in writing:

- what chapter files are allowed to call
- which state values are internal only

Outcome:
- prevents accidental API breakage during extraction

### Step 2. Extract `state / progress`

Move:
- state variables
- persistence
- sync mutations
- sync evaluation helpers

Keep:
- same globals exported back through compatibility layer

Reason:
- smallest blast radius

### Step 3. Extract `interactions / widgets`

Move:
- options
- silence timer

Keep:
- `showOpts`
- `clearOpts`
- `startSilence`

Reason:
- these are isolated behavior units and a natural seam before tackling core rendering

### Step 4. Extract `ui / feedback` and `ui / header`

Move:
- notifications
- glitch/flash
- header/avatar management
- clock update

Reason:
- these are visible but bounded subsystems

### Step 5. Extract `ui / media`

Move:
- lightbox
- file cards
- media helpers

Keep:
- token compatibility intact

Reason:
- reduces branching pressure before touching main chat rendering

### Step 6. Extract `ui / chat rendering`

Move:
- `addMsg`
- `showTyping`
- `mkAv`
- scroll helpers

Reason:
- `addMsg` is the center of the prototype; delay this until surrounding helpers are already stable

### Step 7. Extract `flow / router`

Move:
- chapter start/reset
- ending dispatch
- select-screen unlock logic

Reason:
- router depends on state, rendering, and media already being stable

### Step 8. Reduce `engine.js` to bootstrap + compat façade

Final outcome:
- existing chapters still run
- internals are modular
- later canon restoration can happen chapter-by-chapter without another runtime rewrite

## Compatibility Strategy

During the entire refactor, preserve these rules:

1. Existing chapter files must keep working without edits where possible.
2. Existing DOM ids and CSS classes must not change.
3. Existing visible pacing should remain unchanged.
4. New modules should not require a bundler or framework.
5. Script loading should remain GitHub Pages safe.

Practical implication:

- either keep modules as plain browser scripts attached in `index.html`
- or continue to use `engine.js` as the top-level loader and namespace bridge

For this repository, the safest path is plain browser scripts plus a compatibility façade, not an ESM migration during the same refactor.

## Recommended End State

Repository shape after refactor should still feel familiar:

- `index.html`
- `css/style.css`
- `js/engine.js`
- `js/state/...`
- `js/ui/...`
- `js/flow/...`
- `js/interactions/...`
- `js/content/compat.js`
- `chapters/*.js`

This preserves the existing project shape while creating clean boundaries for later canon restoration work.

## Why This Plan Supports Later Canon Work

This split creates a safe place for the missing or mismatched canon mechanics without destabilizing the existing prototype:

- interaction-heavy canon chapters can add widgets instead of bloating `addMsg`
- endings can become distinct routed scenes
- Origin can live as a separate mode with its own UI layer
- chapter content can gradually move from imperative scene code toward structured scene data if desired later

Most importantly, the player-visible prototype can remain intact while the internal architecture becomes maintainable.

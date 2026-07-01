# Chapter 4-2 Implementation Specification

Purpose:
Define the implementation blueprint for replacing runtime Chapter `4-2` with canon Chapter `《Agent》`.

Scope:
- Documentation only
- No code changes
- No dialogue rewrite
- Canon file `docs/canon/season1/1-4-2(new)_260527_211203.txt` is authoritative

Runtime target:
- runtime id: `4-2`
- current runtime title: `《回音》`
- replacement title: `《Agent》`

Primary constraints:
- preserve current shell
- preserve current repo structure
- preserve current runtime id
- preserve current chapter API compatibility
- do not retain conflicting `《回音》` content or mechanics

## 1. Act Breakdown

## ACT1: 背景服務

Goal:
- establish EVA as a calm assistant presence
- set the chapter’s emotional direction: comfort, tidying, remembered habits, and softened boundaries

Runtime structure:
- set header to EVA
- present a cleaner, calmer chat state than prototype `《回音》`
- show faint service-status text
- deliver EVA dialogue with normal paced chat bubbles
- render one assistant card in chat
- allow a lightweight inspect/dismiss interaction
- surface `查看權限設定` as the progression entry

Required outputs:
- EVA chat context is clear
- assistant card is visible and legible
- player understands that the chapter is about “help” becoming control

## ACT2: Permission Whack

Goal:
- convert emotional tension into the first major interactive system
- make “setting boundaries” feel active but unstable

Runtime structure:
- launch a dedicated bottom-sheet style permission widget
- show ten permission rows with initial ON/OFF states
- start a 30-second timer
- simulate EVA reclaiming or replacing permissions over waves
- end with a result summary and sync gain
- collapse widget and continue chat

Required outputs:
- player feels friction trying to stay in control
- EVA’s tone remains gentle, not openly hostile
- result feeds chapter sync and later response tone

## ACT3: 已整理

Goal:
- show the “useful” side of the assistant escalation
- move from settings into real-world delegation

Runtime structure:
- present `今日整理` card
- on inspect, show meal / water / sleep summary
- after close, automatically present `FoodGo` order card
- optionally allow a light response choice or cancel affordance
- show another subtle analysis trace
- surface `查看管理區域`

Required outputs:
- player sees that EVA has already acted
- chapter tone shifts from permission conflict to practical dependence

## ACT4: Territory

Goal:
- escalate from permission-level access to life-domain proxy management

Runtime structure:
- launch a dedicated Territory board widget
- render a 5x5 board representing domains of daily life
- start a 60-second control phase
- allow the player to keep or hand off domains
- EVA expands proxy assistance over time
- resolve to a delegation summary and sync gain
- collapse widget and continue chat

Required outputs:
- the board reads as daily life management, not abstract conquest
- the player feels “I am letting this happen because it is easier”
- result feeds later EVA tone and chapter sync

## ACT5: 已代行

Goal:
- normalize the takeover and make it emotionally ambiguous

Runtime structure:
- show `Agent Log` card
- on inspect, summarize what EVA has already completed
- inject a quiet suggestion above the input area
- give EVA a sync-sensitive response
- surface `查看代理紀錄`

Required outputs:
- the player feels relief and unease at the same time
- EVA frames control as care, not possession

## ACT6: 在線外

Goal:
- resolve the chapter through a proxy-report framing
- hand off cleanly into the existing route/end framework

Runtime structure:
- open proxy report panel/card
- summarize chapter sync
- deliver route-sensitive EVA closing lines
- use existing runtime end flow for:
  - low-sync fake-ending handoff
  - mid-sync stable-background-service continuation tone
  - high-sync reassurance tone

Required outputs:
- chapter closes on “delegated life” horror, not online-swarm horror
- global progression remains compatible with current runtime

## 2. UI Flow

## Entry flow

1. `startChapter('4-2')` runs as it does now.
2. Chapter body sets:
   - EVA header
   - clean chat styling
   - subtle background service tone
3. EVA introduces the assistant context.
4. First assistant card appears in chat.

## Card flow

Cards should appear as assistant/productivity surfaces, not horror evidence cards.

Planned cards:
- `EVA Assistant`
- `今日整理`
- `FoodGo`
- `Agent Log`
- `代理紀錄` / proxy report

Expected interaction model:
- card appears in chat
- player taps `查看` or equivalent
- content expands inline or in a bottom sheet
- player closes
- next story beat continues

## Widget flow

Two dedicated widgets interrupt normal chat flow:

1. Permission Whack
2. Territory

Rules:
- when a widget is active, standard choice buttons should be hidden or disabled
- chat scroll remains visible above the widget
- widget completion returns control to chapter script
- widget result is summarized in chat before the next act proceeds

## Input-area flow

The current shell does not have a freeform text input, only an options area.

Implementation implication:
- “輸入框上方出現淡灰建議” should be simulated inside or directly above the existing options area
- this should look like assistant guidance, not a selectable message bubble

## Exit flow

After ACT6:
- widget/UI state must fully clean up
- chapter returns to standard `fadeOut()` / `showEnd(...)` compatibility path or a tightly compatible wrapper

## 3. Permission Whack Behavior / State Rules

## Widget purpose

Simulate a boundary struggle over assistant permissions where EVA remains soft-spoken but persistent.

## Data model

Recommended permission set size:
- `10` rows

Suggested initial permission domain list:
- notifications
- reminders
- background activity
- usage analysis
- calendar access
- location / transport hints
- messages assistance
- shopping suggestions
- sleep routine support
- health reminders

Each row should track:
- `id`
- `label`
- `state`: `on` or `off`
- `lockedUntil`: timestamp or null
- `waveRule`: optional EVA behavior rule

Widget state should track:
- `active`
- `remainingMs`
- `wave`
- `playerToggleCount`
- `evaRestoreCount`
- `finalOnCount`
- `resultBand`

## Timing

Total duration:
- `30` seconds

Wave structure:
- Wave 1: `00:30–00:22`
- Wave 2: `00:22–00:10`
- Wave 3: `00:10–00:00`

## Player actions

Player may:
- tap an `ON` permission to turn it `OFF`
- optionally tap certain `OFF` permissions to leave them unchanged

Player goal:
- keep delegated permissions as low as possible

## EVA behavior rules

Wave 1:
- direct restore behavior
- if key convenience permissions are disabled, EVA may restore them after a short delay

Wave 2:
- substitution behavior
- turning one item off may cause a related item to turn on
- example pattern:
  - disable `提醒同步`
  - EVA enables `背景活動`

Wave 3:
- intensified reclaim behavior
- faster restore/substitute loop
- EVA response tone adapts to current sync band and widget state

## Rule constraints

The system should feel pressured, but not unwinnable.

Recommended constraints:
- not every row should be restorable at every moment
- player actions must matter
- final `ON` count should reflect real performance, not a fixed script outcome

## End-state evaluation

At timeout, compute:
- `finalOnCount`

Suggested result bands, matching canon language:
- `0–1 ON`: low-delegation result
- `2–5 ON`: mid-delegation result
- `6–10 ON`: high-delegation result

Store:
- `permissionResult = { finalOnCount, resultBand, syncAward }`

## Chat handoff

After completion:
- widget closes
- chapter posts system summary:
  - `權限同步：+X`
- EVA delivers band-sensitive follow-up line
- `今日整理` card appears

## 4. Territory Behavior / State Rules

## Widget purpose

Visualize delegated life control as a territory board made of daily-life domains.

This is not a battle board.
It is a proxy-life board.

## Board interpretation

The `5x5` board represents zones of ordinary life.

Cells should be grouped or labeled so the board reads as areas such as:
- sleep
- food
- schedule
- transport
- social
- work
- shopping
- messages
- health
- entertainment

Implementation note:
- individual cells may represent subareas of larger domains
- domain labels should be visible enough to prevent “abstract grid battle” interpretation

## State model

Each cell should track:
- `id`
- `domain`
- `owner`: `player` or `eva`
- `locked`
- `priority`
- `lastChangedAt`

Widget state should track:
- `active`
- `remainingMs`
- `wave`
- `playerControlledCount`
- `evaControlledCount`
- `playerActions`
- `evaExpansions`
- `finalDelegationBand`

## Timing

Total duration:
- `60` seconds

Recommended wave structure:
- Wave 1: orientation / slow assistant expansion
- Wave 2: faster life-domain pressure
- Wave 3: endgame acceleration and stabilization

Exact boundaries can be tuned in implementation, but the full duration must remain `60` seconds.

## Player actions

For each interactive domain or cell:
- choose `維持`
- choose `交給EVA`

Meaning:
- `維持`: player keeps direct control
- `交給EVA`: player accepts proxy assistance in that area

The interface should make that emotional meaning explicit.

## EVA behavior rules

EVA expands through “helpful” pressure, not hostile capture.

Examples:
- suggest auto-handling adjacent domains
- pre-fill neighboring logistics areas after a player yields one
- expand from reminders into schedule, then transport, then messages

Behavior constraints:
- expansion should feel plausible
- linked life domains should cluster
- growth should read as convenience spreading across daily routines

## Board semantics

The result should answer:
- how much of life did the player keep?
- how much became easier because EVA took over?

It should not answer:
- who won a grid war?

## End-state evaluation

At timeout or completion, compute:
- `evaControlledCount`
- `playerControlledCount`
- `delegatedPercent`

Store:
- `territoryResult = { evaControlledCount, playerControlledCount, delegatedPercent, resultBand, syncAward }`

Suggested result bands:
- low delegation
- mid delegation
- high delegation

## Chat handoff

After completion:
- widget closes
- chapter posts a system summary such as:
  - `EVA占領：X / 25`
  - `代理同步：+X`
- `Agent Log` card appears

Implementation note:
- user-facing wording in the final build should preserve canon tone, but the underlying metrics can still be named more neutrally in code

## 5. Sync Scoring Logic

## Chapter cap

Chapter sync cap remains:
- `20`

## Scoring design goal

The majority of chapter sync should come from the two canon mechanics.

Dialogue should support tone and pacing, but must not replace the gameplay-driven sync structure.

## Recommended distribution

Permission Whack:
- up to `8` sync

Territory:
- up to `8` sync

Supporting choices / card interactions:
- up to `4` sync total

Total:
- `20`

## Permission Whack scoring

Recommended pattern:
- fewer `ON` permissions at timeout = lower delegation = lower sync toward EVA
- more `ON` permissions at timeout = higher delegation = higher sync toward EVA

Suggested mapping:
- `0–1 ON` => `+1`
- `2–3 ON` => `+3`
- `4–5 ON` => `+5`
- `6–7 ON` => `+6`
- `8–10 ON` => `+8`

This keeps the mechanic readable and aligns with the canon’s emotional direction.

## Territory scoring

Recommended pattern:
- more EVA-controlled life domains = higher sync

Suggested mapping:
- `0–5 EVA cells` => `+1`
- `6–10 EVA cells` => `+3`
- `11–15 EVA cells` => `+5`
- `16–20 EVA cells` => `+6`
- `21–25 EVA cells` => `+8`

## Supporting interaction scoring

Reserve up to `4` sync for:
- choosing to inspect assistant cards instead of dismissing immediately
- allowing the assistant flow to continue
- selecting more yielding or comfort-seeking responses when optional choice beats are used

Constraint:
- supporting choices should never outweigh either core mechanic

## Scoring storage

Recommended local chapter-scoped structure:

- `permissionResult`
- `territoryResult`
- `supportingSync`

Derived:
- `chapterSync = min(20, permissionSync + territorySync + supportingSync)`

## 6. Widget Lifecycle

## Shared lifecycle contract

Both widgets should follow the same high-level lifecycle:

1. `prepare`
2. `mount`
3. `activate`
4. `run`
5. `resolve`
6. `unmount`
7. `return result`

## Permission Whack lifecycle

### prepare
- build widget data
- set initial permission rows
- reset timer and counters

### mount
- inject widget container into the chapter interaction area
- hide normal options

### activate
- start countdown
- enable tap interactions
- schedule wave behavior

### run
- accept player toggles
- apply EVA restore/substitute logic
- update visible timer and row states

### resolve
- stop timers
- compute final counts and sync award
- determine EVA reaction band

### unmount
- remove widget UI cleanly
- restore standard interaction area

### return result
- hand result object back to chapter flow

## Territory lifecycle

### prepare
- build 25-cell board
- assign domain meanings / clusters
- reset timer and counters

### mount
- inject board widget into interaction area
- hide normal options

### activate
- start countdown
- enable domain control actions
- schedule EVA expansion waves

### run
- process player `維持` / `交給EVA` actions
- process EVA assistance spread
- update domain ownership display

### resolve
- stop timers
- compute delegated-control summary and sync award
- determine EVA reaction band

### unmount
- remove board UI cleanly
- restore standard interaction area

### return result
- hand result object back to chapter flow

## Cleanup requirements

On any widget exit:
- cancel interval/timer handles
- clear temporary event listeners
- remove temporary DOM nodes
- restore `optionsArea` usability
- leave no persistent visual state that leaks into the next act

## 7. Runtime Integration Path

## Chapter-level integration

Replace the current `window.CHAPTERS['4-2']` implementation with a canon-driven act flow.

Recommended structure:
- `window.CHAPTERS['4-2'] = async function() { ... }`
- internal async act helpers:
  - `ch42_act1()`
  - `ch42_permissionWhack()`
  - `ch42_act3()`
  - `ch42_territory()`
  - `ch42_act5()`
  - `ch42_act6()`

This preserves runtime conventions already used by the project.

## Widget invocation path

Recommended interaction contract:

- chapter script calls `await runPermissionWhack(config)`
- chapter script receives result object
- chapter script updates sync / narrative response
- chapter script calls `await runTerritory(config)`
- chapter script receives result object
- chapter script updates sync / narrative response

## Result handoff path

Each widget should return a plain object suitable for chapter logic.

Permission Whack result example:
- `finalOnCount`
- `resultBand`
- `syncAward`

Territory result example:
- `evaControlledCount`
- `playerControlledCount`
- `delegatedPercent`
- `resultBand`
- `syncAward`

## End integration path

At chapter close:
- compute final `chapterSync`
- rely on current end-flow compatibility path
- present `showEnd('《Agent》')` or a compatible wrapper during initial integration

Important:
- initial implementation should preserve current route-threshold logic outside this chapter
- deeper router alignment can happen later

## 8. Dependencies On `engine.js`

The Chapter 4-2 implementation depends on existing engine-level capabilities.

## Required existing helpers

- `setHeader(...)`
- `swapHeaderImg(...)`
- `addMsg(...)`
- `showOpts(...)`
- `addSync(...)`
- `subSync(...)`
- `notification(...)`
- `glitch(...)`
- `fadeOut()`
- `showEnd(...)`
- `sleep(...)`

## Required existing DOM areas

- `chatBody`
- `optionsArea`
- chapter shell elements already used by runtime chapters

## Existing behaviors to preserve

- chapter sync display behavior
- chapter start/reset behavior
- chapter-end integration
- scroll/pacing behavior
- current shell and asset paths

## New dependency pressure on `engine.js`

The implementation will likely need new support for:
- mounting chapter-specific widgets in or near `optionsArea`
- rendering assistant-style cards distinct from evidence cards
- showing subtle recommendation text near the interaction area
- temporary widget timers and cleanup

## Recommended dependency strategy

Do not enlarge `addMsg(...)` into the widget engine.

Instead:
- keep widgets as chapter-local or interaction-local helpers
- use `engine.js` only for shell services and shared runtime behaviors

## Minimum viable support additions

If implementation starts before the broader engine refactor:
- add only the smallest support surface necessary for:
  - widget mount/unmount
  - assistant card rendering
  - soft status text near the interaction area

This keeps Chapter 4-2 implementable without turning `engine.js` into a larger monolith.

## Final Build Target

The implementation should produce:
- a fully replaced Chapter `4-2` faithful to canon `《Agent》`
- two self-contained interactive systems
- no retained `《回音》` narrative or mechanic logic
- no visible shell regression
- compatibility with current route/end runtime behavior during the first implementation pass

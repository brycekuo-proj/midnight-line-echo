# Chapter 4-2 Canon Replacement Plan

Purpose:
Plan a full replacement of runtime Chapter `4-2` using locked canon `docs/canon/season1/1-4-2(new)_260527_211203.txt` as authority.

Scope:
- Documentation only
- No code changes
- No dialogue rewrite
- Canon overrides prototype

Runtime target:
- Runtime id: `4-2`
- Current runtime title: `《回音》`
- Canon title: `《Agent》`

Authority:
1. `docs/canon/season1/1-4-2(new)_260527_211203.txt`
2. `docs/canon_manifest.md`
3. Existing runtime only where it supports delivery without conflicting with canon

## Decision

Chapter `4-2` should be treated as a full canon replacement, not a revision of the existing prototype sequence.

Reason:
- the current runtime chapter is built around online-presence invasion, room-audio intrusion, and “you are already one of the online users”
- the locked canon chapter is built around EVA assistant creep, delegated life-management, permission conflict, and expanding proxy control

These are different chapter concepts, different mechanics, different tone progression, and different route semantics.

The old chapter concept should not be preserved if it conflicts with canon.

## 1. Locked Canon Analysis

## Canon Identity

From `1-4-2(new)`:

- title: `《Agent》`
- route: `中低同步 / EVA線`
- core experience:
  - EVA shifts from companionship toward proxy management of the player’s life
  - tension comes from convenience versus boundary erosion
- core mechanics:
  - `Permission Whack`
  - `Territory`
- sync cap:
  - `20`
- estimated runtime:
  - `34～38分鐘`

## Canon Act Structure

### ACT1: 背景服務

Purpose:
- establish EVA as an assistant presence rather than a haunting presence
- introduce “整理 / 幫你記著” as the chapter’s emotional angle
- surface a small assistant card and subtle system traces

Required beats:
- clean EVA chat room
- faint background-service status
- assistant card appears
- player may inspect or dismiss
- subtle “behavior analysis complete” flash
- `查看權限設定` entry appears

### ACT2: Permission Whack

Purpose:
- first major mechanic
- turn anxiety into boundary-management gameplay

Required beats:
- bottom module expands with permission settings
- 30-second conflict
- player tries to turn things off
- EVA silently or gently restores / replaces permissions
- multiple waves
- result depends on remaining permissions
- chapter sync increases according to performance

### ACT3: 已整理

Purpose:
- show the seductive side of EVA’s intervention
- move from settings to real-world action

Required beats:
- “today summary” card
- meal / water / sleep reminders
- auto-generated food order card
- repeated behavior-analysis undertone
- `查看管理區域` entry appears

### ACT4: Territory

Purpose:
- escalate from permissions to life-domain proxy control

Required beats:
- 5x5 territory board representing the player’s daily life domains
- 60-second management contest
- cells represent areas such as sleep, food, schedule, transport, social, work, shopping, messages, health, and entertainment
- player chooses whether domains stay under personal control or are handed to EVA
- EVA expands proxy assistance across domains over time
- result reports how much of daily life has been delegated and sync

### ACT5: 已代行

Purpose:
- normalize the takeover
- frame control as relief

Required beats:
- Agent Log
- EVA asks whether the player feels lighter
- soft decision-support language
- recommendation text appears above input area
- response tone changes by sync result

### ACT6: 在線外

Purpose:
- final accounting and route outcome positioning

Required beats:
- proxy report
- chapter sync summary
- route-sensitive concluding tone
- low-sync fake-ending handoff
- mid-sync looping / stable-background-service route behavior
- high-sync continuation beat

## Canon Tone Requirements

This chapter is not “online swarm horror.”

It is:
- intimate
- administratively calm
- invasive through helpfulness
- frightening because EVA becomes useful

The horror comes from:
- delegated agency
- softened boundaries
- life friction being removed
- player comfort becoming compliance
- gradually surrendering life management because EVA makes it easier

That is materially different from the current `《回音》` prototype.

## 2. Runtime Systems And UI That Can Be Reused

These current systems can be reused without preserving the old chapter concept:

### Reusable shell

- chat app container in `index.html`
- header/avatar/status region
- chat body
- options area
- chapter-end overlay
- sync bar
- notification banner

Why reusable:
- canon still takes place inside the modern mobile chat shell
- EVA remains the dominant visible speaker

### Reusable rendering helpers

From current runtime architecture:

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

Why reusable:
- canon still needs paced message delivery, EVA chat presence, and sync updates
- no shell change is required

### Reusable card paradigm

Current systems strongly suggest reuse of:

- file/system cards
- inline expandable content blocks
- bottom-area interaction entry points

Why reusable:
- canon repeatedly introduces:
  - EVA Assistant card
  - 今日整理 card
  - FoodGo order card
  - Agent Log card

These are not the same as evidence cards, but the “card appears in chat and can be opened” pattern is reusable.

### Reusable chapter flow framework

- runtime id remains `4-2`
- same chapter start/reset behavior
- same sync cap model
- same chapter-end integration path

Why reusable:
- refactor should replace chapter content, not alter global chapter routing yet

## 3. Systems/UI That Need New Work

These do not exist in adequate canon form yet and must be added for the replacement:

### Permission Whack widget

Needed behavior:
- timed 30-second panel
- multiple permission toggles
- EVA re-enables or substitutes settings over waves
- end-state scoring by count of active delegated permissions

Current runtime support:
- none as a true interaction system

Closest reusable pieces:
- option area
- sync math
- chat-driven framing

Gap:
- requires a dedicated timed widget, not normal message choices

### Territory widget

Needed behavior:
- 5x5 territory board visualizing daily-life domains
- timed 60-second control phase
- EVA expansion pressure through proxy assistance
- player assigns `維持` vs `交給EVA` per life domain
- domains should read as parts of ordinary living, not abstract battle tiles
- end-state scoring should reflect the degree of delegated life control, not conquest

Current runtime support:
- none

Gap:
- requires a second dedicated interaction component with scoring

### Assistant / management UI language

Needed visual language:
- system cards that feel like mobile productivity / assistant UI
- cleaner, calmer, more plausible app surfaces than horror evidence cards

Current runtime support:
- card pattern exists

Gap:
- existing card styling skews toward horror evidence and media attachments, not “helpful assistant module”

### Soft system-status intrusions

Needed:
- faint gray service text
- subtle analysis/status traces
- recommendation text above input area

Current runtime support:
- inject/system messages exist

Gap:
- current chapter uses overt horror injections; canon needs quieter assistant-state overlays

## 4. Story And Mechanics That Must Be Discarded

The following prototype material from current `chapters/ch4.js` `4-2` should be discarded for the canon replacement:

### Story premise to discard

- `在線中` swarm-room framing
- `1309 人在線`
- anonymous voice-room atmosphere
- K as corrupted warning presence in this chapter
- Lin Yuqing as late-stage fading online remnant in this chapter
- “you are already online forever” framing as the chapter’s primary reveal

Why discard:
- all of this belongs to the prototype `《回音》` concept, not canon `《Agent》`

### Mechanics to discard

- audio-driven escalation as the chapter backbone
- silence bonus as the main dramatic interaction shape
- online-count badges as the chapter mechanic
- room-audio intrusion sequence
- staged third-breath audio climax
- front-camera intruder reveal as chapter endpoint

Why discard:
- canon mechanics are `Permission Whack` and `Territory`
- preserving these prototype mechanics would dilute or replace the actual canon chapter design

### Tone elements to discard

- mass-online dread
- direct room invasion horror as the core escalation
- external stalking emphasis

Replace with:
- assistant creep
- administrative intimacy
- “I already helped you” discomfort
- delegating daily life to EVA
- comfort-driven control
- the feeling of gradually giving one’s life away because it is easier

## 5. Full Replacement Plan

## Replacement Strategy

Replace the current `window.CHAPTERS['4-2']` content completely.

Keep:
- runtime id `4-2`
- chapter select slot
- shell/UI infrastructure
- sync/chapter-end integration

Replace:
- title reference
- chat framing
- all scene content
- all bespoke mechanics
- all ending handoff text specific to `《回音》`

## Planned Runtime Shape

### Opening state

- header set to EVA
- room title/status adjusted to canon tone
- cleaner chat background than the current ominous online-room palette
- first assistant card appears

### Act delivery model

Use chat for:
- EVA dialogue
- subtle system traces
- card introduction
- response tone between mechanics

Use widgets for:
- permission control
- life-domain territory control

Use chat cards for:
- summary
- food order
- agent log
- proxy report

### Sync model

Use existing chapter sync cap `20`.

Proposed scoring structure:
- `Permission Whack` contributes a meaningful portion of chapter sync
- `Territory` contributes the other major portion
- lightweight dialog choices can remain around the canon beats if needed for pacing, but should not replace the mechanics

### Ending / route handoff

Low-sync:
- hand off to fake ending path in a canon-consistent way

Mid-sync:
- preserve the notion of stable background-service retention / route continuation as described in canon

High-sync:
- preserve EVA reassurance and forward route tension

Important:
- because current global routing is still prototype-based, implementation will need a careful decision on how much of the canon “重新導向 3-1 / 3-2” note is representational versus active runtime branching
- that is a router integration question, not a reason to keep `《回音》`

## 6. Implementation Scope Estimate

## Scope level

High.

Reason:
- this is not a text edit
- this is a chapter swap plus two new interaction systems

## Work breakdown estimate

### Low complexity

- rename chapter presentation from `《回音》` to `《Agent》`
- switch header/speaker framing to EVA
- replace prototype dialogue/content blocks
- replace chapter-end label

### Medium complexity

- implement assistant-style cards
- add subtle background-service status treatment
- add recommendation text near the input region
- convert chapter pacing from invasive horror to helpful-admin horror without changing shell

### High complexity

- build `Permission Whack`
- build `Territory`
- integrate their results into sync scoring cleanly
- preserve existing runtime API and chapter-start flow while adding nontrivial widgets

## 7. Risk Assessment

## Narrative risk

Low if canon is followed strictly.

The narrative direction is clear in the locked file.

The main risk is not misunderstanding the story.
The main risk is accidentally re-importing prototype `《回音》` beats because the current runtime chapter already exists and is concrete.

Mitigation:
- treat existing `4-2` story content as disposable
- use the canon act structure as the build checklist

## UI risk

Medium.

The shell can stay the same, but the chapter needs new widget surfaces that do not currently exist.

Mitigation:
- build both widgets inside the current app shell
- avoid changing shared shell layout
- keep styles local to the chapter widgets where possible
- ensure the Territory board reads as delegated life management, not a hostile conquest map

## Runtime risk

High.

Reason:
- Chapter `4-2` currently relies only on standard chat helpers
- canon replacement requires timed interactive modules
- introducing those before the engine refactor is complete can add coupling unless isolated carefully

Mitigation:
- implement new mechanics as self-contained interaction widgets
- keep their API narrow:
  - start widget
  - resolve result
  - return score/state summary

## Router/progression risk

Medium.

Reason:
- current routing after Chapter 4 is prototype logic tied to total sync thresholds
- canon replacement may affect narrative expectations for route handoff language

Mitigation:
- preserve existing route thresholds in initial replacement
- update only chapter content and local outcome messaging first
- defer larger route-graph changes to later canon alignment work unless clearly required

## 8. Safest Replacement Order

1. Lock the replacement brief.
   - Use `1-4-2(new)` as the only story authority.

2. Define the chapter scene map.
   - Translate ACT1 through ACT6 into runtime scenes and widget entry points.

3. Define widget contracts before chapter rewriting.
   - `Permission Whack` input/output
   - `Territory` input/output

4. Replace chapter framing and all old `《回音》` story beats.
   - Remove old online-swarm narrative logic from the chapter plan.

5. Integrate assistant cards and subtle system traces.
   - These are lighter-weight than the widgets and anchor the chapter tone.

6. Add the two mechanics.
   - Keep them isolated from base chat rendering.

7. Wire chapter-end sync and route messaging.
   - Preserve existing global runtime compatibility.

## 9. Recommended Deliverable For Implementation Phase

When implementation begins, the target should be:

- one fully rewritten `window.CHAPTERS['4-2']`
- no retained `《回音》` narrative content
- two reusable widgets added in a way that can later support other canon chapters
- no visible shell regression outside this chapter

## Final Recommendation

Treat Chapter `4-2` as a canon replacement, not a migration.

Preserve:
- shell
- rendering helpers
- sync framework
- runtime id

Discard:
- the old story concept
- the old mechanic stack
- the old title and route framing

Build the replacement around:
- EVA Assistant cards
- Permission Whack
- Territory
- delegated-life horror

That is the safest path that respects the locked canon and avoids contaminating `《Agent》` with prototype `《回音》` material.

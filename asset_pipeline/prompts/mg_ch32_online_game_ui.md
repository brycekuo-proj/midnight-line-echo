# Prompt Spec — CH3-2 ONLINE GAME / Moderator Deduction UI

Mini-game ID: `online_moderator_game`
Chapter: 3-2 《在線中》
Status: canonical gameplay UI direction from 2026-09-03

Purpose:
Create atmospheric production UI backing assets for the existing DOM/JS hidden-role game. Art must support the real interaction, never replace it with a static screenshot.

Gameplay structure represented by the art:
- 6 anonymous online-user identity cards.
- Header area for `ONLINE 6 · R1/3`, reducing to 5 then 4.
- Three discussion rounds.
- Cards can visually become OFFLINE / greyed out.
- Local suspicion marks `○`, `?`, `ADMIN?` are rendered by DOM, so the art must leave clean space for them.
- Final screen presents all six candidates, including offline users, for one moderator accusation.
- No werewolf, villager, weapon, kill, blood, or death iconography.
- Visual language is a corrupted late-night chat moderation console, not fantasy Mafia art.

Needed future asset family:
- `mg_ch32_online_panel.png` — dark online-room frame / subtle system grid.
- `mg_ch32_online_card.png` — neutral candidate-card backing with room for name, status and testimony.
- `mg_ch32_online_offline.png` — optional subtle disconnected/static treatment.
- `mg_ch32_online_vote.png` — final moderator-identification frame.
- `mg_ch32_online_verified.png` — success overlay for admin-log access.

Style:
- ECHO dark psychological-horror UI.
- Near-black teal / desaturated cyan system glow.
- Clean mobile readability; no embedded explanatory text.
- Avoid decorative clutter behind testimony.
- Horror through persistent presence and system inconsistency, not jumpscare imagery.

Canonical mechanic note:
SilentRoom is the fixed Moderator in the story. 03:17 is an anomalous-user red herring. The art must not reveal either role before the final result.

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

Current portrait asset family:
- `img/ui/ch32/ch32_a1.jpg` — 阿澤 / male / 15
- `img/ui/ch32/ch32_b1.jpg` — 林薇 / female / 28
- `img/ui/ch32/ch32_c1.jpg` — 陳默 / male / 42
- `img/ui/ch32/ch32_a2.jpg` — 小葵 / female / 19
- `img/ui/ch32/ch32_b2.jpg` — 高翔 / male / 35
- `img/ui/ch32/ch32_c2.jpg` — 周伯 / male / 80

Portrait lock:
- 1:1 head-and-shoulders photographic portrait, one person only.
- Realistic, low-saturation, cold late-night lighting.
- Eye region deliberately blurred / digitally defocused.
- Non-bloody uncanny smile extends unnaturally toward both cheeks.
- No embedded names, ages, status labels, card borders or UI text; those remain DOM-rendered.
- Six people must remain clearly different in age, face, clothing and silhouette while sharing one photographic treatment.

Additional future backing asset family:
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
Internal id `silentroom` (display name 小葵 / A2) is the fixed Moderator in the story. Internal id `0317` (display name 周伯 / C2) is an anomalous-user red herring. The art must not reveal either role before the final result.

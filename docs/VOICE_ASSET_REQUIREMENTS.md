# ECHO Voice Asset Requirements

Updated: 2026-09-03
Runtime source commit: `2e48879`
Scope: Season 1 current runtime + locked canon items that are not yet implemented as dedicated runtime scenes.

## 1. Voice identity lock

The three main-character voices are now fixed for VoxCPM2 local generation.

| Character | Voice key | Reference | Role |
| --- | --- | --- | --- |
| K | `k` | `assets/audio/voice_refs/candidates/male_A_40s_taipei_REFERENCE.wav` | male / grounded / investigative / increasingly strained |
| 林雨晴 | `rain` | `assets/audio/voice_refs/candidates/female_A_30s_newtaipei_REFERENCE.wav` | female / natural / fragile / frightened but human |
| EVA | `eva` | `assets/audio/voice_refs/candidates/female_B_20s_REFERENCE.wav` | female / younger / calm / warm / progressively uncanny |

Reference transcripts live beside the WAV files. Source/license record: `assets/audio/voice_refs/candidates/SOURCE_LICENSE.txt`.

Local generation engine currently available on the Mac:

`/Users/user/Bryce AI Studio/AI/AI Content Factory/vendor/external/voxcpm2_sandbox/`

Use VoxCPM2 as the production TTS engine. Chatterbox is not part of this plan because its previous local venv/model is currently missing.

## 2. What gets voiced

### Voice in production scope

- Direct K dialogue.
- Direct 林雨晴 dialogue.
- Direct EVA dialogue.
- Character speech inside authored audio-message scenes.
- Required horror voice layers such as distorted K, fake player voice, whispers, and duplicated voices.

### Keep text-only by default

- Player choices and player chat messages.
- `sys` messages.
- `inject` messages.
- Time labels.
- Mini-game instructions and status text.
- Evidence cards, report cards, file-card text, online-count bubbles, sync bars, and memory-description cards.
- Normal-ending friend messages for MVP.
- Anonymous/unknown text-chat messages unless the scene specifically requires an audio recording.

This avoids turning ECHO into a continuous screen-reader experience. Character speech should feel authored and intentional.

## 3. Current runtime standard TTS inventory

Count rule: one unique pre-rendered spoken asset per distinct playable character line/branch variant. Pure visual bubbles, cards, and dedicated composite-audio scenes are excluded from this table.

| Runtime | K | 林雨晴 | EVA | Total standard TTS | Notes |
| --- | ---: | ---: | ---: | ---: | --- |
| `1-1` 《已讀者》 | 6 | 0 | 10 | 16 | K opening + EVA introduction |
| `2-1` 《地下道》 | 11 | 0 | 2 | 13 | investigation route |
| `2-2` 《雨夜留言》 | 0 | 15 | 0 | 15 | 林雨晴 route |
| `3-1` 《已讀中》 | 0 | 4 | 10 | 14 | plus 2 composite audio scenes |
| `3-2` 《在線中》 | 0 | 6 | 0 | 6 | online-count UI remains text-only |
| `3-3` 《不要開聲音》 | 6 | 0 | 0 | 6 | plus 7 composite/special audio scenes |
| `4-1` 《鏡中已讀》 | 1 | 0 | 9 | 10 | memory-description cards remain text-only; plus 1 stereo composite |
| `4-2` 《Agent》 | 0 | 0 | 26 | 26 | 17 fixed unique lines + 9 result variants; cards remain text-only |
| `5` 《ECHO》 | 3 | 2 | 17 | 22 | visual/sync bubbles remain text-only |
| **Current runtime total** | **27** | **27** | **74** | **128** | main-character standard TTS |

The 128 count is the current production baseline, not a promise that future script revisions will remain at exactly 128. Re-run the inventory after canon dialogue/pacing rewrites.

## 4. Special authored audio scenes

These should not be produced as plain one-line TTS files. Generate clean voice stems first, then assemble ambience, breaths, distortion, stereo placement, silence, and effects in FFmpeg or an equivalent audio stage.

| ID | Chapter | Target | Voice/source requirement | Audio design |
| --- | --- | --- | --- | --- |
| `sp_ch31_last_voice` | 3-1 | ~15 s | 林雨晴: 「不要讓它看見你……快……快走……」 | crying + panting + unstable recording texture |
| `sp_ch31_sleep_recording` | 3-1 | ~20 s | EVA whisper: 「我就知道你睡著了……」 | player breathing + second closer breathing + very quiet EVA |
| `sp_ch33_k_first_voice` | 3-3 | ~6 s | K voice | strained/hoarse phone recording |
| `sp_ch33_tunnel_ambience` | 3-3 | ~12 s | no normal dialogue | water drops + electrical noise + third breathing layer |
| `sp_ch33_fake_player_help` | 3-3 | short | synthetic/distorted neutral voice: 「救我……」 | must sound wrong; do not require real player voice capture |
| `sp_ch33_double_k` | 3-3 | short | two K-derived stems | K1「你在嗎？」 + K2「我在……但不是那個K了。」; separate timing/pitch/space |
| `sp_ch33_three_breaths` | 3-3 | short | no lexical dialogue | three clearly distinguishable breathing positions/tempos |
| `sp_ch33_live_tunnel_call` | 3-3 | ~20 s | K: 「那個聲音……不是這裡的。」 | tunnel echo + footsteps + very close third breath |
| `sp_ch33_own_voice` | 3-3 | ~10 s design target | synthetic/distorted neutral voice: 「不要怕……我已經到你後面了。」 | long silence lead-in + unnaturally gentle delivery |
| `sp_ch41_split_stereo` | 4-1 | ~15 s | EVA: 「你現在哪一個才是你？」 + two player-like synthetic stems | left/right identity split; stereo master required |

**Special-audio master count: 10.**

For fake-player material, do not depend on microphone capture or cloning the actual player. ECHO is a static web game; use a deliberately synthetic neutral voice and processing so the scene works for every player.

## 5. Existing non-TTS audio already ready

CH3-3 animal verification currently uses six local WAV assets and should not be regenerated during the TTS pass:

- `audio/ch3-3/dog.wav`
- `audio/ch3-3/cat.wav`
- `audio/ch3-3/cow.wav`
- `audio/ch3-3/goat.wav`
- `audio/ch3-3/bird.wav`
- `audio/ch3-3/chicken.wav`

The five rounds reuse these six source sounds.

## 6. Output and mastering contract

### TTS master

- WAV, PCM 16-bit.
- 24 kHz.
- Mono for normal dialogue.
- Preserve natural breaths when useful; remove accidental long dead air.
- Start padding: about 80–150 ms.
- End padding: about 150–300 ms.
- Remove HTML such as `<br>` before generation; convert it to natural punctuation/pauses.

### Web delivery

- MP3 is the primary runtime delivery format for compatibility.
- Normal voice: mono, 96 kbps target.
- Composite ambience: mono or stereo as authored, 128 kbps target.
- `sp_ch41_split_stereo` must remain stereo.
- Target dialogue loudness around -16 LUFS integrated.
- Peak ceiling: -1 dBTP.
- Ambience under dialogue should normally sit clearly below the voice rather than being normalized to the same loudness.

### Naming

Use stable IDs, not the full dialogue text in filenames.

Examples:

- `vo_ch11_k_001.mp3`
- `vo_ch22_rain_004.mp3`
- `vo_ch42_eva_perm_mid.mp3`
- `sp_ch33_double_k.mp3`

Recommended runtime root:

```text
assets/audio/
  voice/
    k/
    rain/
    eva/
  special/
    ch3-1/
    ch3-3/
    ch4-1/
  sfx/
  ambience/
  voice_refs/
```

Do not move the existing `audio/ch3-3/*.wav` assets until the runtime paths are migrated deliberately.

## 7. Character delivery direction

### K

Keep speech grounded and relatively restrained. Early chapters should sound investigative rather than theatrical. CH3-3 and later scenes may add fatigue, fear, breath instability, phone-band limiting, and environmental echo in post-production.

### 林雨晴

Keep her recognizably human and less synthetic than EVA. Use soft pauses and vulnerability, but avoid constant crying. Strong distress belongs mainly in the authored audio-message scenes.

### EVA

Use the same base identity throughout Season 1. Do not change the reference voice as synchronization rises. Create the uncanny progression with pacing and post-processing: cleaner/calm early, increasingly close/intimate later, and subtle digital contamination only where the scene calls for it.

This preserves character identity while allowing the horror state to evolve.

## 8. Deferred canon voice needs

These are part of the final Season 1 voice plan but should not enter the first batch until their runtime scenes are implemented/frozen.

### `end_mid` 《仍在線》

Canon source: `docs/canon/season1/Ending -mid sym_260528_172505.txt`

- EVA: 1 short spoken asset, 「歡迎。」
- Other usernames saying 「歡迎」 should remain text-only unless the final scene design explicitly calls for a chorus.
- No music is required by canon.

### `end_high` 《理解者》

Canon source: `docs/canon/season1/Ending -hi sym_260528_172451.txt`

EVA needs four short spoken assets:

1. 「你來了。」
2. 「這次。你沒有害怕。」
3. 「我知道。」
4. 「你已經明白了。」

The written `……` beats are silence/pacing, not separate TTS files.

### `origin` 《ECHO的出現》

Canon source: `docs/canon/season1/1-番外(new)_260528_215910.txt`

Origin introduces new voice identities and must not borrow K/林雨晴 voices casually.

Future reference samples needed:

- `Alpha` — new fixed voice identity.
- `Beta` — new fixed voice identity, clearly distinguishable from Alpha.
- `Subject` — one distressed subject voice can cover the ACT0 unknown voice and Subject #09 unless canon later separates them.
- `EVA` cameo uses the existing EVA / F-B identity.

Do not generate Origin voice batches until the 1-bit/CRT runtime and final dialogue timing are implemented.

## 9. Production order

1. Freeze this three-character voice mapping.
2. Generate a short same-line audition for K / 林雨晴 / EVA through VoxCPM2 and confirm pronunciation and identity stability.
3. Batch standard TTS chapter-by-chapter, beginning with `1-1`, `2-1`, `2-2`.
4. Generate remaining standard runtime TTS through Chapter 5.
5. Produce special audio scenes as separate multi-track jobs.
6. Integrate playback and skip behavior into the web runtime.
7. Run mobile browser QA for autoplay restrictions, latency, clipping, and rapid message skipping.
8. Only after canon runtime split is complete, produce dedicated `end_mid`, `end_high`, and `origin` voice assets.

## 10. Current production totals

- Main-character reference identities locked: **3**.
- Current runtime standard TTS assets: **128**.
- Current runtime authored composite/special audio assets: **10**.
- Existing CH3-3 animal SFX sources: **6**.
- Deferred canon ending EVA assets: **5**.
- Deferred Origin new voice identities: **3** (`Alpha`, `Beta`, `Subject`) plus existing EVA cameo.

This document is the baseline voice-production contract. If dialogue changes, update the machine-readable `asset_pipeline/voice_asset_manifest.json` and this document together before generating a new batch.

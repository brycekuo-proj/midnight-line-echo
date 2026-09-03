#!/usr/bin/env python3
"""Generate the authored ECHO audio-bubble assets with local VoxCPM2.

Scope is intentionally limited to the 10 runtime audio bubbles in CH3-1, CH3-3 and CH4-1.
Normal chat dialogue is not synthesized.

RAM policy requested for the Mac mini:
- generate at most 5 VoxCPM2 stems per model session
- unload the model, run gc + MPS cache cleanup
- sleep 10 seconds
- reload only if more stems remain
"""
from __future__ import annotations

import gc
import math
import os
from pathlib import Path
import subprocess
import sys
import time

import numpy as np
import soundfile as sf
import torch
from voxcpm import VoxCPM

REPO = Path(__file__).resolve().parents[1]
VROOT = Path('/Users/user/Bryce AI Studio/AI/AI Content Factory/vendor/external/voxcpm2_sandbox')
MODEL = VROOT / 'pretrained_models' / 'VoxCPM2'
WORK = REPO / 'asset_pipeline' / 'work' / 'voice_stems'
OUT31 = REPO / 'assets' / 'audio' / 'story' / 'ch3-1'
OUT33 = REPO / 'assets' / 'audio' / 'story' / 'ch3-3'
OUT41 = REPO / 'assets' / 'audio' / 'story' / 'ch4-1'
SR = 48000
RNG = np.random.default_rng(260903)

REFS = {
    'k': (
        REPO / 'assets/audio/voice_refs/candidates/male_A_40s_taipei_REFERENCE.wav',
        (REPO / 'assets/audio/voice_refs/candidates/male_A_40s_taipei_REFERENCE.txt').read_text(encoding='utf-8').strip(),
    ),
    'rain': (
        REPO / 'assets/audio/voice_refs/candidates/female_A_30s_newtaipei_REFERENCE.wav',
        (REPO / 'assets/audio/voice_refs/candidates/female_A_30s_newtaipei_REFERENCE.txt').read_text(encoding='utf-8').strip(),
    ),
    'eva': (
        REPO / 'assets/audio/voice_refs/candidates/female_B_20s_REFERENCE.wav',
        (REPO / 'assets/audio/voice_refs/candidates/female_B_20s_REFERENCE.txt').read_text(encoding='utf-8').strip(),
    ),
}

# Exactly nine VoxCPM2 stems are required for the ten final bubbles.
STEMS = [
    ('rain_last', 'rain', '（帶哭腔、害怕、呼吸急促）不要讓它看見你……快……快走……', 4101),
    ('eva_sleep', 'eva', '（極輕聲、近距離耳語、非常慢）我就知道你睡著了……', 4201),
    ('k_first', 'k', '（沙啞、疲憊、壓低聲音）……你聽得到我嗎？把音量開大一點……我只能用聲音跟你說了……', 4301),
    ('player_help', None, '（中性偏年輕、沒有明確性別、像在模仿陌生人、語氣不自然）救我……', 4401),
    ('k_one', 'k', '（緊張、壓低聲音）你在嗎？', 4302),
    ('k_two', 'k', '（空洞、疲憊、像隔著很遠的空間）我在……但不是那個K了。', 4303),
    ('k_tunnel', 'k', '（極度緊張、很小聲、像怕被聽見）那個聲音……不是這裡的。', 4304),
    ('player_behind', None, '（中性偏年輕、極度溫柔、平靜到不自然、靠得很近）不要怕……我已經到你後面了。', 4402),
    ('eva_split', 'eva', '（非常平靜、緩慢、近距離）你現在哪一個才是你？', 4202),
]


def log(msg: str) -> None:
    print(msg, flush=True)


def cleanup_model(model=None) -> None:
    if model is not None:
        try:
            del model
        except Exception:
            pass
    gc.collect()
    try:
        if torch.backends.mps.is_available():
            torch.mps.synchronize()
            torch.mps.empty_cache()
    except Exception:
        pass
    gc.collect()


def load_model() -> VoxCPM:
    log(f'[MODEL] loading VoxCPM2 from {MODEL}')
    return VoxCPM.from_pretrained(
        str(MODEL),
        load_denoiser=False,
        local_files_only=True,
        optimize=False,
        device='mps' if torch.backends.mps.is_available() else 'cpu',
    )


def make_stems() -> None:
    WORK.mkdir(parents=True, exist_ok=True)
    model = None
    generated_in_session = 0
    fresh_total = 0
    remaining = [s for s in STEMS if not (WORK / f'{s[0]}.wav').exists()]
    if not remaining:
        log('[TTS] all stems already exist; skipping VoxCPM2')
        return

    model = load_model()
    try:
        for idx, (stem_id, speaker, text, seed) in enumerate(STEMS, start=1):
            out = WORK / f'{stem_id}.wav'
            if out.exists() and out.stat().st_size > 1024:
                log(f'[TTS {idx}/{len(STEMS)}] SKIP existing {stem_id}')
                continue

            kwargs = dict(
                text=text,
                cfg_value=2.0,
                inference_timesteps=10,
                seed=seed,
                normalize=False,
            )
            if speaker:
                ref, transcript = REFS[speaker]
                # Highest-fidelity clone: same file as both prompt and reference.
                kwargs.update(
                    prompt_wav_path=str(ref),
                    prompt_text=transcript,
                    reference_wav_path=str(ref),
                )
            log(f'[TTS {idx}/{len(STEMS)}] generating {stem_id} speaker={speaker or "synthetic_player"}')
            wav = model.generate(**kwargs)
            wav = np.asarray(wav, dtype=np.float32).reshape(-1)
            sf.write(out, wav, model.tts_model.sample_rate, subtype='PCM_16')
            fresh_total += 1
            generated_in_session += 1
            log(f'[TTS {idx}/{len(STEMS)}] saved {out.name} ({len(wav)/model.tts_model.sample_rate:.2f}s)')
            del wav
            gc.collect()
            try:
                if torch.backends.mps.is_available():
                    torch.mps.empty_cache()
            except Exception:
                pass

            # Hard RAM break after every five newly generated outputs.
            if generated_in_session >= 5 and any(not (WORK / f'{s[0]}.wav').exists() for s in STEMS[idx:]):
                log('[RAM BREAK] 5 files completed: unloading VoxCPM2, clearing MPS cache, sleeping 10s')
                cleanup_model(model)
                model = None
                time.sleep(10)
                model = load_model()
                generated_in_session = 0
    finally:
        cleanup_model(model)
    log(f'[TTS] fresh stems generated: {fresh_total}')


def read_mono(path: Path) -> np.ndarray:
    x, sr = sf.read(path, dtype='float32', always_2d=False)
    if x.ndim == 2:
        x = x.mean(axis=1)
    if sr != SR:
        # VoxCPM2 outputs 48kHz; this path is mainly a guard for future changes.
        old_t = np.arange(len(x), dtype=np.float64) / sr
        new_len = int(round(len(x) * SR / sr))
        new_t = np.arange(new_len, dtype=np.float64) / SR
        x = np.interp(new_t, old_t, x).astype(np.float32)
    return x.astype(np.float32)


def lowpass(x: np.ndarray, alpha: float = 0.04) -> np.ndarray:
    y = np.empty_like(x)
    s = 0.0
    for i, v in enumerate(x):
        s += alpha * (float(v) - s)
        y[i] = s
    return y


def breath(seconds: float, bpm: float, amp: float = 0.12, phase: float = 0.0, close: bool = False) -> np.ndarray:
    n = int(seconds * SR)
    t = np.arange(n, dtype=np.float32) / SR
    noise = RNG.standard_normal(n).astype(np.float32)
    noise = lowpass(noise, 0.055 if close else 0.035)
    noise /= max(1e-6, float(np.max(np.abs(noise))))
    freq = bpm / 60.0
    env = np.maximum(0.0, np.sin(2 * np.pi * freq * t + phase)) ** (1.7 if close else 2.2)
    # soften clicks / constant zero floors
    env = 0.08 + 0.92 * env
    return (noise * env * amp).astype(np.float32)


def tunnel_bed(seconds: float) -> np.ndarray:
    n = int(seconds * SR)
    t = np.arange(n, dtype=np.float32) / SR
    noise = lowpass(RNG.standard_normal(n).astype(np.float32), 0.008) * 0.018
    hum = 0.006 * np.sin(2*np.pi*60*t) + 0.003 * np.sin(2*np.pi*120*t)
    x = noise + hum.astype(np.float32)
    # sparse metallic/water drops
    for when, freq in [(1.1, 1700), (3.4, 2200), (5.0, 1450), (7.8, 1950), (10.2, 2300), (13.7, 1600), (16.5, 2050)]:
        if when >= seconds:
            continue
        start = int(when * SR)
        dur = min(int(0.22*SR), n-start)
        tt = np.arange(dur, dtype=np.float32)/SR
        drop = 0.08*np.sin(2*np.pi*freq*tt)*np.exp(-18*tt)
        x[start:start+dur] += drop.astype(np.float32)
    return x.astype(np.float32)


def footsteps(seconds: float, times: list[float]) -> np.ndarray:
    n = int(seconds * SR)
    x = np.zeros(n, dtype=np.float32)
    for when in times:
        start = int(when*SR)
        if start >= n:
            continue
        dur = min(int(0.18*SR), n-start)
        tt = np.arange(dur, dtype=np.float32)/SR
        thump = (0.09*np.sin(2*np.pi*75*tt) + 0.05*RNG.standard_normal(dur)) * np.exp(-22*tt)
        x[start:start+dur] += thump.astype(np.float32)
    return x


def add_at(dst: np.ndarray, src: np.ndarray, start_sec: float, gain: float = 1.0, channel: int | None = None) -> None:
    start = int(start_sec * SR)
    if dst.ndim == 1:
        end = min(len(dst), start + len(src))
        if end > start:
            dst[start:end] += src[:end-start] * gain
    else:
        end = min(dst.shape[0], start + len(src))
        if end <= start:
            return
        if channel is None:
            dst[start:end, :] += src[:end-start, None] * gain
        else:
            dst[start:end, channel] += src[:end-start] * gain


def peak_limit(x: np.ndarray, peak: float = 0.92) -> np.ndarray:
    m = float(np.max(np.abs(x))) if x.size else 0.0
    if m > peak:
        x = x * (peak/m)
    return x.astype(np.float32)


def write_temp(name: str, audio: np.ndarray) -> Path:
    p = WORK / f'_mix_{name}.wav'
    sf.write(p, peak_limit(audio), SR, subtype='PCM_16')
    return p


def ffmpeg_master(temp: Path, out: Path, stereo: bool = False, phone: bool = False, eerie: bool = False) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    filters = []
    if phone:
        filters += ['highpass=f=180', 'lowpass=f=4200', 'aecho=0.7:0.35:65:0.12']
    if eerie:
        filters += ['aecho=0.8:0.45:110:0.18']
    filters += ['loudnorm=I=-16:TP=-1:LRA=11']
    cmd = [
        'ffmpeg', '-y', '-hide_banner', '-loglevel', 'error', '-i', str(temp),
        '-af', ','.join(filters), '-ar', '48000',
        '-ac', '2' if stereo else '1', '-codec:a', 'libmp3lame', '-b:a', '128k' if stereo else '96k', str(out)
    ]
    subprocess.run(cmd, check=True)
    dur = subprocess.check_output([
        'ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(out)
    ], text=True).strip()
    log(f'[MASTER] {out.relative_to(REPO)} duration={float(dur):.2f}s')


def compose() -> None:
    for p in [OUT31, OUT33, OUT41]:
        p.mkdir(parents=True, exist_ok=True)

    rain = read_mono(WORK/'rain_last.wav')
    eva_sleep = read_mono(WORK/'eva_sleep.wav')
    k_first = read_mono(WORK/'k_first.wav')
    player_help = read_mono(WORK/'player_help.wav')
    k_one = read_mono(WORK/'k_one.wav')
    k_two = read_mono(WORK/'k_two.wav')
    k_tunnel = read_mono(WORK/'k_tunnel.wav')
    player_behind = read_mono(WORK/'player_behind.wav')
    eva_split = read_mono(WORK/'eva_split.wav')

    # 1) CH3-1 last voice, fixed 15 s.
    x = np.zeros(15*SR, np.float32)
    add_at(x, breath(15, 19, 0.07, close=True), 0)
    add_at(x, rain, 2.0, 0.95)
    ffmpeg_master(write_temp('ch31_last_voice', x), OUT31/'ch31_last_voice.mp3', eerie=True)

    # 2) CH3-1 sleep recording, fixed 20 s, EVA arrives late.
    x = np.zeros(20*SR, np.float32)
    add_at(x, breath(20, 12, 0.065), 0)
    add_at(x, breath(20, 8.5, 0.105, phase=1.1, close=True), 0)
    add_at(x, eva_sleep, 12.0, 0.48)
    ffmpeg_master(write_temp('ch31_sleep_recording', x), OUT31/'ch31_sleep_recording.mp3', eerie=True)

    # 3) K first message. Canon duration is 11 s; runtime label is corrected to match.
    x = np.zeros(11*SR, np.float32)
    add_at(x, k_first, 0.55, 0.95)
    ffmpeg_master(write_temp('ch33_k_first_voice', x), OUT33/'ch33_k_first_voice.mp3', phone=True)

    # 4) Underground environment 12 s.
    x = tunnel_bed(12)
    add_at(x, breath(12, 6.4, 0.095, phase=0.6, close=True), 0)
    ffmpeg_master(write_temp('ch33_tunnel_ambience', x), OUT33/'ch33_tunnel_ambience.mp3', eerie=True)

    # 5) Fake player's "救我".
    x = np.zeros(6*SR, np.float32)
    add_at(x, tunnel_bed(6), 0, 0.45)
    add_at(x, player_help, 2.0, 0.85)
    ffmpeg_master(write_temp('ch33_fake_player_help', x), OUT33/'ch33_fake_player_help.mp3', eerie=True)

    # 6) Double K.
    x = np.zeros(9*SR, np.float32)
    add_at(x, tunnel_bed(9), 0, 0.35)
    add_at(x, k_one, 0.8, 0.95)
    add_at(x, k_two, 4.0, 0.75)
    ffmpeg_master(write_temp('ch33_double_k', x), OUT33/'ch33_double_k.mp3', eerie=True)

    # 7) Three breaths, stereo to make the third presence spatially obvious.
    x = np.zeros((10*SR, 2), np.float32)
    b1 = breath(10, 13, 0.075)
    b2 = breath(10, 10, 0.075, phase=1.0)
    b3 = breath(10, 6.2, 0.115, phase=0.45, close=True)
    add_at(x, b1, 0, 1.0, 0)
    add_at(x, b2, 0, 1.0, 1)
    add_at(x, b3, 0, 0.72, 0)
    add_at(x, b3, 0, 1.0, 1)
    ffmpeg_master(write_temp('ch33_three_breaths', x), OUT33/'ch33_three_breaths.mp3', stereo=True)

    # 8) Live tunnel call, fixed 20 s.
    x = tunnel_bed(20)
    add_at(x, footsteps(20, [2.1, 3.0, 5.5, 6.4, 9.0, 9.9]), 0, 0.9)
    add_at(x, breath(20, 6.0, 0.115, phase=0.2, close=True), 0)
    add_at(x, k_tunnel, 11.5, 0.96)
    ffmpeg_master(write_temp('ch33_live_tunnel_call', x), OUT33/'ch33_live_tunnel_call.mp3', phone=True, eerie=True)

    # 9) Own voice: 8 s silence instead of the contradictory 10 s silence inside a 10 s total label.
    x = np.zeros(15*SR, np.float32)
    add_at(x, player_behind, 8.0, 0.78)
    ffmpeg_master(write_temp('ch33_own_voice', x), OUT33/'ch33_own_voice.mp3', eerie=True)

    # 10) CH4-1 identity split, 15 s stereo. The script does not invent player dialogue;
    # left/right use voice-like whisper textures while EVA carries the only authored lexical line.
    x = np.zeros((15*SR, 2), np.float32)
    left = breath(15, 15, 0.085, phase=0.2, close=True)
    right = breath(15, 8, 0.085, phase=1.6, close=True)
    add_at(x, left, 0, 1.0, 0)
    add_at(x, right, 0, 1.0, 1)
    add_at(x, eva_split, 8.5, 0.85, 0)
    add_at(x, eva_split, 8.62, 0.62, 1)
    ffmpeg_master(write_temp('ch41_split_stereo', x), OUT41/'ch41_split_stereo.mp3', stereo=True, eerie=True)


def main() -> None:
    log('[ECHO AUDIO] production start')
    make_stems()
    compose()
    log('[ECHO AUDIO] production complete: 10 final audio bubbles')


if __name__ == '__main__':
    main()

// ═══════════════════════════════════════════════════════
//  ECHO TELEMETRY v1
//  Anonymous player funnel + duration tracking.
//  Remote delivery is enabled only when <meta name="echo-ga4-id"> contains a GA4 Measurement ID.
// ═══════════════════════════════════════════════════════
(function () {
  'use strict';

  const STORAGE = {
    playerId: 'echo_telemetry_player_id',
    firstTouch: 'echo_telemetry_first_touch',
    debugEvents: 'echo_telemetry_debug_events',
    analyticsOptOut: 'echo_analytics_opt_out'
  };
  const SESSION = {
    sessionId: 'echo_telemetry_session_id'
  };
  const MAX_DEBUG_EVENTS = 120;
  const isEngineering = /(?:^|\/)engineering\.html$/i.test(location.pathname);
  const isLocalHost = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|::1)$/i.test(location.hostname || '');
  const ga4Id = ((document.querySelector('meta[name="echo-ga4-id"]') || {}).content || '').trim();
  const query = new URLSearchParams(location.search);
  const debugEnabled = query.get('echo_debug') === '1';
  const analyticsSwitch = (query.get('echo_analytics') || '').toLowerCase();

  function randomId(prefix) {
    let id = '';
    if (window.crypto && typeof window.crypto.randomUUID === 'function') id = window.crypto.randomUUID().replace(/-/g, '');
    else id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    return prefix + '_' + id.slice(0, 24);
  }

  function safeGet(storage, key) {
    try { return storage.getItem(key); } catch (e) { return null; }
  }
  function safeSet(storage, key, value) {
    try { storage.setItem(key, value); } catch (e) {}
  }
  function safeJson(value, fallback) {
    try { return JSON.parse(value); } catch (e) { return fallback; }
  }

  if (analyticsSwitch === 'off') safeSet(localStorage, STORAGE.analyticsOptOut, '1');
  else if (analyticsSwitch === 'on') safeSet(localStorage, STORAGE.analyticsOptOut, '0');
  const analyticsOptOut = safeGet(localStorage, STORAGE.analyticsOptOut) === '1';
  function clean(value, maxLen) {
    if (value === undefined || value === null) return '';
    return String(value).replace(/[\r\n\t]+/g, ' ').trim().slice(0, maxLen || 100);
  }
  function scalarParams(obj) {
    const out = {};
    Object.keys(obj || {}).forEach((key) => {
      const value = obj[key];
      if (typeof value === 'string') out[key] = clean(value, 100);
      else if (typeof value === 'number' && Number.isFinite(value)) out[key] = value;
      else if (typeof value === 'boolean') out[key] = value ? 1 : 0;
    });
    return out;
  }

  function getOrCreatePlayerId() {
    let id = safeGet(localStorage, STORAGE.playerId);
    if (!id) {
      id = randomId('ep');
      safeSet(localStorage, STORAGE.playerId, id);
    }
    return id;
  }
  function getOrCreateSessionId() {
    let id = safeGet(sessionStorage, SESSION.sessionId);
    if (!id) {
      id = randomId('es');
      safeSet(sessionStorage, SESSION.sessionId, id);
    }
    return id;
  }

  function captureSessionTouch() {
    const q = new URLSearchParams(location.search);
    let refHost = '';
    try { refHost = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
    return {
      source: clean(q.get('utm_source') || refHost || 'direct', 64),
      medium: clean(q.get('utm_medium') || (refHost ? 'referral' : 'direct'), 64),
      campaign: clean(q.get('utm_campaign') || '', 80),
      content: clean(q.get('utm_content') || '', 80),
      term: clean(q.get('utm_term') || '', 80),
      referrer_host: clean(refHost, 100)
    };
  }

  function captureFirstTouch(sessionTouch) {
    const saved = safeJson(safeGet(localStorage, STORAGE.firstTouch), null);
    if (saved && saved.source) return saved;
    const touch = Object.assign({}, sessionTouch);
    safeSet(localStorage, STORAGE.firstTouch, JSON.stringify(touch));
    return touch;
  }

  const sessionTouch = captureSessionTouch();
  const state = {
    playerId: getOrCreatePlayerId(),
    sessionId: getOrCreateSessionId(),
    sessionTouch,
    firstTouch: captureFirstTouch(sessionTouch),
    sessionStartedAt: performance.now(),
    activeStartedAt: document.visibilityState === 'visible' ? performance.now() : null,
    activeMs: 0,
    lastReportedActiveMs: 0,
    currentLevel: null,
    minigames: new Map(),
    attempts: new Map(),
    openTracked: false,
    gameStarted: false,
    remoteEnabled: !isEngineering && !isLocalHost && !analyticsOptOut && /^G-[A-Z0-9]+$/i.test(ga4Id)
  };

  function setupGa4() {
    if (!state.remoteEnabled) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', ga4Id, {
      send_page_view: false,
      user_id: state.playerId,
      anonymize_ip: true
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4Id);
    document.head.appendChild(script);
  }

  function activeTotalMs() {
    let total = state.activeMs;
    if (state.activeStartedAt !== null) total += performance.now() - state.activeStartedAt;
    return Math.max(0, total);
  }

  function debugStore(entry) {
    let rows = safeJson(safeGet(localStorage, STORAGE.debugEvents), []);
    if (!Array.isArray(rows)) rows = [];
    rows.push(entry);
    if (rows.length > MAX_DEBUG_EVENTS) rows = rows.slice(rows.length - MAX_DEBUG_EVENTS);
    safeSet(localStorage, STORAGE.debugEvents, JSON.stringify(rows));
    if (debugEnabled && window.console) console.info('[ECHO telemetry]', entry.event, entry.params);
  }

  function send(eventName, params) {
    if (isEngineering) return;
    const name = clean(eventName, 40).replace(/[^a-zA-Z0-9_]/g, '_');
    if (!name) return;
    const payload = Object.assign({
      echo_session: state.sessionId,
      source: state.sessionTouch.source,
      medium: state.sessionTouch.medium,
      campaign: state.sessionTouch.campaign || undefined,
      referrer_host: state.sessionTouch.referrer_host || undefined,
      first_source: state.firstTouch.source,
      first_medium: state.firstTouch.medium,
      session_elapsed_sec: Math.round((performance.now() - state.sessionStartedAt) / 1000)
    }, scalarParams(params || {}));
    Object.keys(payload).forEach((key) => { if (payload[key] === '' || payload[key] === undefined) delete payload[key]; });

    debugStore({
      ts: new Date().toISOString(),
      event: name,
      params: payload
    });

    if (state.remoteEnabled && typeof window.gtag === 'function') {
      window.gtag('event', name, Object.assign({ transport_type: 'beacon' }, payload));
    }
  }

  function gameOpen() {
    if (state.openTracked || isEngineering) return;
    state.openTracked = true;
    send('game_open', { path: location.pathname || '/' });
  }

  function gameStart(mode) {
    if (mode !== 'player' || isEngineering) return;
    if (!state.gameStarted) {
      state.gameStarted = true;
      send('game_start', { mode: 'player' });
    }
  }

  function levelStart(levelId, extra) {
    if (isEngineering) return;
    if (state.currentLevel && !state.currentLevel.ended) levelExit('replaced');
    const id = clean(levelId, 40);
    state.currentLevel = {
      id,
      runId: randomId('lr'),
      startedAt: performance.now(),
      ended: false
    };
    send('level_start', Object.assign({ level_name: id, level_run: state.currentLevel.runId }, scalarParams(extra || {})));
  }

  function levelEnd(levelId, extra) {
    if (isEngineering) return;
    const id = clean(levelId || (state.currentLevel && state.currentLevel.id), 40);
    let durationMs = 0;
    let runId = '';
    if (state.currentLevel && state.currentLevel.id === id && !state.currentLevel.ended) {
      durationMs = performance.now() - state.currentLevel.startedAt;
      runId = state.currentLevel.runId;
      state.currentLevel.ended = true;
    }
    send('level_end', Object.assign({
      level_name: id,
      level_run: runId,
      duration_sec: Math.round(durationMs / 1000)
    }, scalarParams(extra || {})));
    if (state.currentLevel && state.currentLevel.id === id) state.currentLevel = null;
  }

  function levelExit(reason) {
    if (isEngineering || !state.currentLevel || state.currentLevel.ended) return;
    const level = state.currentLevel;
    level.ended = true;
    send('level_exit', {
      level_name: level.id,
      level_run: level.runId,
      reason: clean(reason || 'exit', 40),
      duration_sec: Math.round((performance.now() - level.startedAt) / 1000)
    });
    state.currentLevel = null;
  }

  function minigameKey(name) {
    return (state.currentLevel ? state.currentLevel.runId : 'no_level') + ':' + clean(name, 60);
  }

  function minigameStart(name, meta) {
    if (isEngineering) return 1;
    const game = clean(name, 60);
    const key = minigameKey(game);
    const attempt = (state.attempts.get(key) || 0) + 1;
    state.attempts.set(key, attempt);
    state.minigames.set(key, { startedAt: performance.now(), attempt });
    const base = Object.assign({
      minigame_name: game,
      level_name: state.currentLevel ? state.currentLevel.id : '',
      attempt
    }, scalarParams(meta || {}));
    send('minigame_start', base);
    if (attempt > 1) send('minigame_retry', Object.assign({}, base, { retry_count: attempt - 1, retry_reason: 'restart' }));
    return attempt;
  }

  function minigameEnd(name, result, meta) {
    if (isEngineering) return;
    const game = clean(name, 60);
    const key = minigameKey(game);
    const record = state.minigames.get(key);
    const resultParams = scalarParams(result || {});
    const durationSec = record ? Math.round((performance.now() - record.startedAt) / 1000) : 0;
    const completed = !!(result && result.completed !== false && !result.cancelled);
    const base = Object.assign({
      minigame_name: game,
      level_name: state.currentLevel ? state.currentLevel.id : '',
      attempt: record ? record.attempt : 1,
      duration_sec: durationSec,
      completed: completed ? 1 : 0
    }, resultParams, scalarParams(meta || {}));

    if (completed) send('minigame_complete', base);
    else send('minigame_exit', base);

    const explicitRetries = Math.max(
      0,
      Number(resultParams.mistakes) || 0,
      (Number(resultParams.attempts) || 1) - 1
    );
    if (explicitRetries > 0) {
      send('minigame_retry', Object.assign({}, base, {
        retry_count: explicitRetries,
        retry_reason: resultParams.mistakes ? 'mistake' : 'attempt'
      }));
    }
    state.minigames.delete(key);
  }

  function endingReached(endingId, extra) {
    if (isEngineering) return;
    send('ending_reached', Object.assign({ ending_id: clean(endingId, 60) }, scalarParams(extra || {})));
  }

  function progressReset() {
    if (isEngineering) return;
    send('progress_reset', { level_name: state.currentLevel ? state.currentLevel.id : '' });
  }

  function checkpointPlayTime(reason) {
    if (isEngineering) return;
    const total = activeTotalMs();
    const delta = Math.max(0, total - state.lastReportedActiveMs);
    if (delta < 1000 && reason !== 'pagehide') return;
    state.lastReportedActiveMs = total;
    send('play_time', {
      active_increment_sec: Math.round(delta / 1000),
      active_total_sec: Math.round(total / 1000),
      level_name: state.currentLevel ? state.currentLevel.id : '',
      reason: clean(reason || 'checkpoint', 30)
    });
  }

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      if (state.activeStartedAt !== null) {
        state.activeMs += performance.now() - state.activeStartedAt;
        state.activeStartedAt = null;
      }
      checkpointPlayTime('hidden');
    } else if (state.activeStartedAt === null) {
      state.activeStartedAt = performance.now();
    }
  });

  window.addEventListener('pagehide', () => {
    checkpointPlayTime('pagehide');
    if (state.currentLevel && !state.currentLevel.ended) levelExit('pagehide');
  });

  setupGa4();

  window.EchoTelemetry = Object.freeze({
    gameOpen,
    gameStart,
    levelStart,
    levelEnd,
    levelExit,
    minigameStart,
    minigameEnd,
    endingReached,
    progressReset,
    checkpointPlayTime,
    event: send,
    status: function () {
      return {
        engineering: isEngineering,
        localHost: isLocalHost,
        analyticsOptOut,
        remoteEnabled: state.remoteEnabled,
        ga4Id: state.remoteEnabled ? ga4Id : '',
        playerId: state.playerId,
        sessionId: state.sessionId,
        sessionTouch: Object.assign({}, state.sessionTouch),
        firstTouch: Object.assign({}, state.firstTouch),
        currentLevel: state.currentLevel ? state.currentLevel.id : null
      };
    },
    debugEvents: function () {
      return safeJson(safeGet(localStorage, STORAGE.debugEvents), []);
    }
  });

  gameOpen();
})();

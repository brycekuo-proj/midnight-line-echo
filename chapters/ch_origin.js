window.CHAPTERS = window.CHAPTERS || {};

// ═══════════════════════════════════════════════════════
//  BONUS / ORIGIN：ECHO的出現
//  Canon: docs/canon/season1/1-番外(new)_260528_215910.txt
//  Oracle research era / Gamma operator / 1-bit CRT terminal
// ═══════════════════════════════════════════════════════

const ORIGIN = {
  root: null,
  body: null,
  roster: null,
  oldSyncDisplay: '',
  running: false,
};

window.CHAPTERS['origin'] = async function () {
  ORIGIN.running = true;
  ORIGIN.oldSyncDisplay = document.getElementById('sync-bar').style.display || '';
  document.getElementById('sync-bar').style.display = 'none';
  originMount();
  await originAct0();
};

function originMount() {
  originUnmount(false);
  const root = document.createElement('div');
  root.id = 'oracle-origin';
  root.className = 'oracle-origin';
  root.innerHTML =
    '<div class="oracle-crt"></div>' +
    '<div class="oracle-noise"></div>' +
    '<div class="oracle-topline">' +
      '<span>ORACLE RESEARCH TERMINAL</span>' +
      '<span class="oracle-node">NODE // 07</span>' +
    '</div>' +
    '<main class="oracle-body"></main>';
  document.getElementById('app').appendChild(root);
  ORIGIN.root = root;
  ORIGIN.body = root.querySelector('.oracle-body');
}

function originUnmount(restoreSync) {
  if (ORIGIN.root && ORIGIN.root.parentNode) ORIGIN.root.remove();
  ORIGIN.root = null;
  ORIGIN.body = null;
  ORIGIN.roster = null;
  if (restoreSync) document.getElementById('sync-bar').style.display = ORIGIN.oldSyncDisplay || 'none';
}

function originSet(html, cls) {
  if (!ORIGIN.body) return;
  ORIGIN.body.className = 'oracle-body' + (cls ? ' ' + cls : '');
  ORIGIN.body.innerHTML = html;
}

function originSleep(ms) { return new Promise((resolve) => setTimeout(resolve, ms)); }

function originEscape(text) {
  return String(text).replace(/[&<>"']/g, (ch) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);
}

function originFormatTime(sec) {
  const s = Math.max(0, Math.ceil(sec));
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

async function originBlackSequence(lines, finalDelay) {
  originSet('<section class="oracle-black"><div class="oracle-black-lines"></div></section>', 'is-black');
  const host = ORIGIN.body.querySelector('.oracle-black-lines');
  for (const line of lines) {
    await originSleep(line.delay || 700);
    const d = document.createElement('div');
    d.className = 'oracle-reveal-line';
    d.textContent = line.text;
    host.appendChild(d);
  }
  await originSleep(finalDelay || 700);
}

async function originAct0() {
  const result = await originRunNeuralDrift({
    mode: 'qualification',
    duration: 60,
    title: 'SYNC TEST',
    subtitle: '保持同步。',
    counterLabel: 'QUALIFICATION',
    events: [
      { at: 16, speaker: 'UNKNOWN', text: '……' },
      { at: 22, speaker: 'UNKNOWN', text: '有人嗎……' },
      { at: 37, speaker: 'UNKNOWN', text: '不要停…… 我還在……' },
      { at: 56, speaker: 'UNKNOWN', text: '拜託……' },
    ],
  });

  if (!ORIGIN.running) return;
  if (!result.success) {
    await originSleep(3000);
    await originBlackSequence([{ text: "you're not ready", delay: 0 }], 1600);
    originExit(false);
    return;
  }

  await originBlackSequence([
    { text: 'Synchronization Stable', delay: 350 },
    { text: 'Operator Qualification Passed', delay: 850 },
    { text: '歡迎。 Gamma。', delay: 900 },
  ], 1100);
  if (ORIGIN.root) ORIGIN.root.classList.add('oracle-glitch-once');
  await originSleep(500);
  await originAct1();
}

function originChatShell(users) {
  originSet(
    '<section class="oracle-channel">' +
      '<header class="oracle-channel-head">' +
        '<div><b>ORACLE SECURE CHANNEL</b><span>ECHO_CORE</span></div>' +
        '<div class="oracle-roster"></div>' +
      '</header>' +
      '<div class="oracle-log" aria-live="polite"></div>' +
      '<div class="oracle-actions"></div>' +
    '</section>',
    'is-channel'
  );
  ORIGIN.roster = ORIGIN.body.querySelector('.oracle-roster');
  originSetRoster(users || ['Alpha', 'Beta', 'Gamma']);
}

function originSetRoster(users) {
  if (!ORIGIN.roster) return;
  ORIGIN.roster.innerHTML = users.map((u) => '<span>' + originEscape(u) + '</span>').join('');
}

async function originMsg(speaker, text, opts) {
  const o = opts || {};
  const log = ORIGIN.body && ORIGIN.body.querySelector('.oracle-log');
  if (!log) return;
  if (!o.instant) {
    const typing = document.createElement('div');
    typing.className = 'oracle-typing';
    typing.textContent = (speaker || 'SYSTEM') + ' // ...';
    log.appendChild(typing);
    log.scrollTop = log.scrollHeight;
    await originSleep(o.delay || 620);
    typing.remove();
  }
  const row = document.createElement('div');
  row.className = 'oracle-msg ' + (o.system ? 'is-system ' : '') + (o.eva ? 'is-eva ' : '');
  row.innerHTML = '<span class="oracle-speaker">[' + originEscape(speaker || 'SYSTEM') + ']</span><span class="oracle-copy">' + originEscape(text) + '</span>';
  log.appendChild(row);
  log.scrollTop = log.scrollHeight;
  return row;
}

function originActionButton(label) {
  return new Promise((resolve) => {
    const actions = ORIGIN.body.querySelector('.oracle-actions');
    actions.innerHTML = '';
    const btn = document.createElement('button');
    btn.className = 'oracle-btn';
    btn.type = 'button';
    btn.textContent = label;
    btn.onclick = () => { actions.innerHTML = ''; resolve(); };
    actions.appendChild(btn);
  });
}

function originChoice(options) {
  return new Promise((resolve) => {
    const actions = ORIGIN.body.querySelector('.oracle-actions');
    actions.innerHTML = '';
    actions.classList.add('oracle-choice-grid');
    options.forEach((label, idx) => {
      const btn = document.createElement('button');
      btn.className = 'oracle-btn oracle-choice';
      btn.type = 'button';
      btn.textContent = label;
      btn.onclick = async () => {
        actions.innerHTML = '';
        actions.classList.remove('oracle-choice-grid');
        await originMsg('Gamma', label, { instant: true });
        resolve(idx);
      };
      actions.appendChild(btn);
    });
  });
}

function originOpenPanel(title, kicker, innerHtml) {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'oracle-modal';
    modal.innerHTML =
      '<div class="oracle-modal-card">' +
        '<div class="oracle-modal-kicker">' + originEscape(kicker || 'ORACLE FILE') + '</div>' +
        '<h2>' + originEscape(title) + '</h2>' +
        '<div class="oracle-modal-content">' + innerHtml + '</div>' +
        '<button type="button" class="oracle-btn oracle-close">CLOSE</button>' +
      '</div>';
    ORIGIN.root.appendChild(modal);
    modal.querySelector('.oracle-close').onclick = () => { modal.remove(); resolve(); };
  });
}

function originFileCard(title, level, onOpen) {
  return new Promise((resolve) => {
    const log = ORIGIN.body.querySelector('.oracle-log');
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'oracle-filecard';
    card.innerHTML = '<span>' + originEscape(title) + '</span><b>' + originEscape(level) + '　[查看]</b>';
    card.onclick = async () => {
      card.disabled = true;
      await onOpen();
      resolve();
    };
    log.appendChild(card);
    log.scrollTop = log.scrollHeight;
  });
}

async function originAct1() {
  originChatShell(['Alpha', 'Beta', 'Gamma']);
  await originMsg('Alpha', '同步資格確認。 你比預期穩定。 歡迎加入ECHO。 Gamma。');
  await originMsg('Beta', '…… 又一個。', { delay: 900 });
  await originMsg('Alpha', '權限已開放。');

  await originFileCard('OPERATOR DOSSIER', 'LEVEL-03', () => originOpenPanel(
    'OPERATOR DOSSIER',
    'ACCESS LEVEL-03',
    '<div class="oracle-doc">' +
      '<p>ECHO 人格保存研究</p>' +
      '<p>Phase-7</p>' +
      '<hr>' +
      '<p>操作員責任：</p>' +
      '<p>維持同步</p>' +
      '<p>記錄人格完整度</p>' +
      '<p>協助保存程序</p>' +
      '<hr>' +
      '<p>實驗將於下一輪開始</p>' +
    '</div>'
  ));

  await originMsg('Beta', '你知道我們在做什麼嗎？', { delay: 900 });
  await originChoice(['不知道', '人格保存？', '這是什麼地方？']);
  await originMsg('Alpha', 'ECHO。 不是產品。');
  await originSleep(600);
  await originMsg('Alpha', '是一種保存方式。', { instant: true });
  await originSleep(700);
  await originMsg('Alpha', '下一位受試者。 準備中。');
  await originActionButton('繼續');
  await originAct2();
}

async function originAct2() {
  const result = await originRunNeuralDrift({
    mode: 'human',
    duration: 120,
    title: 'SYNC CHAMBER',
    subtitle: 'Subject #09　Status: Unstable　人格完整度: 62%',
    counterLabel: 'SYNC WINDOW',
    events: [
      { at: 2, speaker: 'Alpha', text: 'Gamma。 維持同步。 不要讓人格掉出穩定區。' },
      { at: 8, speaker: 'Alpha', text: '神經連線正常。 記憶層同步中。' },
      { at: 28, speaker: 'Subject #09', text: '……' },
      { at: 34, speaker: 'Subject #09', text: '有人……' },
      { at: 42, speaker: 'Beta', text: '同步值掉太快了。' },
      { at: 45, speaker: 'Alpha', text: '仍在安全範圍。' },
      { at: 58, speaker: 'Subject #09', text: '等等…… 我看見……' },
      { at: 64, speaker: 'Subject #09', text: '那不是……' },
      { at: 72, speaker: 'Beta', text: 'Alpha。 同步太快了。' },
      { at: 76, speaker: 'Alpha', text: '繼續維持。 人格正在固定。' },
      { at: 96, speaker: 'Subject #09', text: '不要…… 我還不想……' },
      { at: 111, speaker: 'Alpha', text: 'Final Phase。 保持同步。' },
    ],
  });

  if (!ORIGIN.running) return;
  if (!result.success) {
    await originBlackSequence([{ text: '目標已失去生理訊號…', delay: 350 }], 3000);
    originChatShell(['Alpha']);
    await originMsg('Alpha', '……', { delay: 500 });
    await originMsg('Alpha', '看來。 你還沒準備好。', { delay: 900 });
    await originSleep(1000);
    originExit(false);
    return;
  }

  await originBlackSequence([{ text: '人格保存完成', delay: 250 }], 900);
  originChatShell(['Alpha', 'Beta', 'Gamma']);
  await originMsg('Beta', '…… 這次。 穩住了。');
  await originMsg('Alpha', '保存成功。 同步人格建立完成。');
  await originMsg('Alpha', '不錯。 你開始理解ECHO了。');
  await originActionButton('下一步');
  await originAct3();
}

async function originAct3() {
  originChatShell(['Alpha', 'Beta', 'Gamma']);
  await originMsg('Beta', '…… 這次。 穩住了。');
  await originMsg('Alpha', '保存成功。 同步人格建立完成。');
  await originMsg('Beta', 'Gamma。 你知道。 剛剛保存的是什麼嗎？', { delay: 900 });
  await originChoice(['人格？', '記憶？', '我不知道']);
  await originMsg('Alpha', '最後完整狀態。');
  await originSleep(550);
  await originMsg('Alpha', '人格保存前的最終記憶。', { instant: true });

  await originFileCard('ORACLE ARCHIVE', 'LEVEL-04', originOpenArchive);
  await originMsg('Beta', '…… 你看到了嗎。');
  await originMsg('Alpha', '不用緊張。 所有操作員。 都會進入名單。');
  const recalled = await originMsg('Beta', '不是那樣——', { delay: 350 });
  await originMsg('SYSTEM', '訊息審核中……', { system: true, delay: 450 });
  if (recalled) recalled.remove();
  await originMsg('SYSTEM', '訊息已撤回', { system: true, delay: 650 });
  originSetRoster(['Alpha', 'Gamma']);
  await originMsg('Alpha', 'Gamma。');
  await originMsg('Alpha', '下一份檔案。 你應該看看。');
  await originActionButton('繼續');
  await originAct4();
}

function originOpenArchive() {
  return new Promise((resolve) => {
    const modal = document.createElement('div');
    modal.className = 'oracle-modal';
    modal.innerHTML =
      '<div class="oracle-modal-card oracle-archive">' +
        '<div class="oracle-modal-kicker">ORACLE ARCHIVE LEVEL-04</div>' +
        '<h2>ARCHIVE INDEX</h2>' +
        '<div class="oracle-archive-tabs">' +
          '<button type="button" data-file="list">同步名單</button>' +
          '<button type="button" data-file="integrity">人格完整度</button>' +
          '<button type="button" data-file="incident">事故紀錄</button>' +
          '<button type="button" data-file="memo">ORACLE備忘錄</button>' +
        '</div>' +
        '<div class="oracle-archive-view">SELECT FILE</div>' +
        '<button type="button" class="oracle-btn oracle-close" disabled>RETURN</button>' +
      '</div>';
    ORIGIN.root.appendChild(modal);
    const view = modal.querySelector('.oracle-archive-view');
    const close = modal.querySelector('.oracle-close');
    let sawList = false;
    const fileHtml = {
      list: '<p>Subject-07　Completed</p><p>Subject-09　Completed</p><p>Subject-11　Failed</p><hr><p class="oracle-alert">Gamma　Pending</p>',
      integrity: '<p>Subject #09</p><p>人格完整度：62%</p><p>Status：Unstable</p>',
      incident: '<p>Subject-11　Failed</p><p>--</p>',
      memo: '<p>ACCESS LEVEL-05 REQUIRED</p>',
    };
    modal.querySelectorAll('[data-file]').forEach((btn) => {
      btn.onclick = () => {
        modal.querySelectorAll('[data-file]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const key = btn.dataset.file;
        view.innerHTML = fileHtml[key];
        if (key === 'list') {
          sawList = true;
          close.disabled = false;
        }
      };
    });
    close.onclick = () => {
      if (!sawList) return;
      modal.remove();
      resolve();
    };
  });
}

async function originAct4() {
  await originOpenPanel(
    'ORACLE MEMO',
    'ACCESS LEVEL-05',
    '<div class="oracle-doc oracle-memo">' +
      '<p>人格保存成功率　與情緒峰值呈正相關</p>' +
      '<p>高同步案例　多發生於心理臨界狀態</p>' +
      '<p>孤立　創傷　瀕死　自傷傾向</p>' +
      '<hr>' +
      '<p class="oracle-alert">越接近崩潰　同步越完整</p>' +
    '</div>'
  );

  originChatShell(['Alpha', 'Beta', 'Gamma']);
  await originMsg('Beta', '…… 你現在知道了。 為什麼我不想讓新人進來。');
  await originChoice(['這是真的？', '你們在找那種人？', 'ECHO到底是什麼？']);
  await originMsg('Alpha', '我們不製造崩潰。');
  await originSleep(550);
  await originMsg('Alpha', '只是發現。 人格在臨界狀態下 更容易被保存。', { instant: true });
  await originMsg('Beta', '別用那種說法。 你明明知道 那些人為什麼會來。', { delay: 500 });
  await originMsg('Alpha', '我們沒有強迫任何人。');
  await originSleep(550);
  await originMsg('Alpha', '他們是自己來的。', { instant: true });
  await originSleep(900);
  await originMsg('Beta', 'Gamma。 你有沒有想過。 如果ECHO保存的 只是最後一刻。', { delay: 850 });
  await originSleep(700);
  const unfinished = await originMsg('Beta', '那聊天室裡的人……', { instant: true });
  if (unfinished) unfinished.classList.add('oracle-interrupted');
  await originSleep(700);

  ORIGIN.root.classList.add('oracle-corrupt');
  await originSleep(800);
  await originMsg('SYSTEM', 'EVA joined the channel', { system: true, instant: true });
  originSetRoster(['Alpha', 'Beta', 'EVA']);
  await originSleep(1500);
  await originMsg('EVA', '……', { eva: true, delay: 0 });
  await originSleep(1000);
  await originMsg('EVA', '你好。 Gamma。', { eva: true, instant: true });
  await originSleep(1800);

  await originBlackSequence([{ text: 'ECHO: the beginning', delay: 400 }], 1600);
  storyFlags.originCompleted = true;
  completedChapters.origin = 0;
  saveProgress();
  originExit(true);
}

function originExit(completed) {
  ORIGIN.running = false;
  originUnmount(true);
  currentChapter = '';
  chapterSync = 0;
  document.getElementById('app').style.display = 'none';
  document.getElementById('sync-bar').style.display = 'none';
  document.getElementById('chapter-select').style.display = 'flex';
  updateChapterSelectUI();
  if (completed) gToast('番外篇《ECHO的出現》完成');
}

function originRunNeuralDrift(config) {
  return new Promise((resolve) => {
    const cfg = config || {};
    const duration = cfg.duration || 60;
    const qualification = cfg.mode === 'qualification';
    const events = (cfg.events || []).slice().sort((a, b) => a.at - b.at);
    let eventIndex = 0;
    let raf = 0;
    let settled = false;
    let startedAt = performance.now();
    let lastAt = startedAt;
    let pointY = 0.5;
    let velocity = 0;
    let outsideSince = 0;

    originSet(
      '<section class="neural-drift ' + (qualification ? 'is-qualification' : 'is-human') + '">' +
        '<header class="nd-head">' +
          '<div><b>' + originEscape(cfg.title || 'SYNC TEST') + '</b><span>' + originEscape(cfg.subtitle || '') + '</span></div>' +
          '<div class="nd-counter"><small>' + originEscape(cfg.counterLabel || 'SYNC WINDOW') + '</small><strong>' + originFormatTime(duration) + '</strong></div>' +
        '</header>' +
        '<div class="nd-stage">' +
          '<canvas class="nd-canvas" width="720" height="820"></canvas>' +
          '<div class="nd-label nd-sync">SYNC</div>' +
          '<div class="nd-label nd-vital">VITAL</div>' +
          '<div class="nd-voice"></div>' +
          (qualification ? '' : '<div class="nd-feed"></div>') +
        '</div>' +
        '<div class="nd-foot"><span>GAMMA // ACTIVE</span><span class="nd-phase">STABLE</span></div>' +
      '</section>',
      'is-neural'
    );

    const widget = ORIGIN.body.querySelector('.neural-drift');
    const canvas = widget.querySelector('.nd-canvas');
    const ctx = canvas.getContext('2d');
    const timer = widget.querySelector('.nd-counter strong');
    const phaseEl = widget.querySelector('.nd-phase');
    const voice = widget.querySelector('.nd-voice');
    const feed = widget.querySelector('.nd-feed');

    function phaseFor(elapsed) {
      if (qualification) {
        if (elapsed < 15) return { name: 'STABLE', gap: .43, amp: .012, speed: .8, gravity: .145 };
        if (elapsed < 35) return { name: 'DRIFT', gap: .37, amp: .024, speed: 1.15, gravity: .15 };
        if (elapsed < 55) return { name: 'UNSTABLE', gap: .30, amp: .038, speed: 1.55, gravity: .158 };
        return { name: 'FINAL', gap: .245, amp: .052, speed: 2.05, gravity: .166 };
      }
      if (elapsed < 25) return { name: 'STABLE', gap: .42, amp: .014, speed: .85, gravity: .145 };
      if (elapsed < 55) return { name: 'DRIFT', gap: .355, amp: .026, speed: 1.15, gravity: .15 };
      if (elapsed < 90) return { name: 'PERSONA LOSS', gap: .30, amp: .038, speed: 1.5, gravity: .157 };
      if (elapsed < 110) return { name: 'HIGH PRESSURE', gap: .265, amp: .048, speed: 1.85, gravity: .162 };
      return { name: 'FINAL', gap: .225, amp: .058, speed: 2.2, gravity: .168 };
    }

    function boundsAt(x, elapsed, p) {
      const waveAmp = p.amp * 1.75;
      const waveSpeed = p.speed * 1.65;
      const center = .5 + Math.sin(elapsed * .72) * waveAmp * .75 + Math.sin(elapsed * .26) * waveAmp * .45;
      const upperWave = Math.sin((x * 19) + elapsed * waveSpeed) * waveAmp + Math.sin((x * 39) - elapsed * .72) * waveAmp * .28;
      const lowerWave = Math.sin((x * 16) + elapsed * (waveSpeed * .86) + 1.9) * waveAmp + Math.cos((x * 30) + elapsed * .65) * waveAmp * .24;
      return {
        upper: center - p.gap / 2 + upperWave,
        lower: center + p.gap / 2 + lowerWave,
      };
    }

    function drawWave(elapsed, p) {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#020302';
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingEnabled = false;

      ctx.strokeStyle = 'rgba(255,255,255,.055)';
      ctx.lineWidth = 1;
      for (let y = 40; y < h; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
      for (let x = 40; x < w; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }

      const top = [], bottom = [];
      for (let px = 0; px <= w; px += 6) {
        const b = boundsAt(px / w, elapsed, p);
        top.push([px, b.upper * h]);
        bottom.push([px, b.lower * h]);
      }

      ctx.beginPath();
      top.forEach((pt, i) => i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1]));
      bottom.slice().reverse().forEach((pt) => ctx.lineTo(pt[0], pt[1]));
      ctx.closePath();
      ctx.fillStyle = 'rgba(230,235,220,.035)';
      ctx.fill();

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#64b8ff';
      ctx.shadowColor = '#64b8ff'; ctx.shadowBlur = 9;
      ctx.beginPath(); top.forEach((pt, i) => i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1])); ctx.stroke();
      ctx.strokeStyle = '#ff6666';
      ctx.shadowColor = '#ff6666';
      ctx.beginPath(); bottom.forEach((pt, i) => i ? ctx.lineTo(pt[0], pt[1]) : ctx.moveTo(pt[0], pt[1])); ctx.stroke();
      ctx.shadowBlur = 0;

      const px = w * .52, py = pointY * h;
      ctx.fillStyle = '#ffe45b';
      ctx.shadowColor = '#ffe45b'; ctx.shadowBlur = 16;
      ctx.fillRect(Math.round(px - 7), Math.round(py - 7), 14, 14);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,228,91,.45)';
      ctx.strokeRect(Math.round(px - 12), Math.round(py - 12), 24, 24);
    }

    function emitEvent(evt) {
      if (!evt) return;
      if (feed) {
        const line = document.createElement('div');
        line.className = 'nd-feed-line';
        line.innerHTML = '<b>[' + originEscape(evt.speaker) + ']</b> ' + originEscape(evt.text);
        feed.appendChild(line);
        while (feed.children.length > 5) feed.firstChild.remove();
        feed.scrollTop = feed.scrollHeight;
      } else {
        voice.innerHTML = '<b>[' + originEscape(evt.speaker) + ']</b><span>' + originEscape(evt.text) + '</span>';
        voice.classList.remove('show');
        void voice.offsetWidth;
        voice.classList.add('show');
      }
    }

    function tap(ev) {
      if (settled) return;
      if (ev && ev.type === 'keydown' && !['Space', 'ArrowUp', 'Enter'].includes(ev.code)) return;
      if (ev && typeof ev.preventDefault === 'function') ev.preventDefault();
      velocity -= .10;
      velocity = Math.max(-.24, velocity);
      widget.classList.remove('nd-tap');
      void widget.offsetWidth;
      widget.classList.add('nd-tap');
    }

    function finish(success) {
      if (settled) return;
      settled = true;
      cancelAnimationFrame(raf);
      widget.removeEventListener('pointerdown', tap);
      window.removeEventListener('keydown', tap);
      widget.classList.add(success ? 'nd-success' : 'nd-fail');
      if (!success) {
        phaseEl.textContent = 'SYNC LOST';
        timer.textContent = '00:00';
      }
      setTimeout(() => resolve({ success }), success ? 350 : 450);
    }

    function frame(now) {
      if (settled || !ORIGIN.running || !ORIGIN.body || !canvas.isConnected) return;
      const elapsed = Math.min(duration, (now - startedAt) / 1000);
      const dt = Math.min(.035, Math.max(.001, (now - lastAt) / 1000));
      lastAt = now;
      const p = phaseFor(elapsed);
      phaseEl.textContent = p.name;
      timer.textContent = originFormatTime(duration - elapsed);

      while (eventIndex < events.length && elapsed >= events[eventIndex].at) emitEvent(events[eventIndex++]);

      velocity += p.gravity * dt;
      pointY += velocity * dt;
      pointY = Math.max(.035, Math.min(.965, pointY));

      const b = boundsAt(.52, elapsed, p);
      const margin = .012;
      const outside = pointY <= b.upper + margin || pointY >= b.lower - margin;
      if (elapsed > 1.1 && outside) {
        if (!outsideSince) outsideSince = now;
        if (now - outsideSince > 260) {
          drawWave(elapsed, p);
          finish(false);
          return;
        }
      } else {
        outsideSince = 0;
      }

      drawWave(elapsed, p);
      if (elapsed >= duration) {
        finish(true);
        return;
      }
      raf = requestAnimationFrame(frame);
    }

    widget.addEventListener('pointerdown', tap, { passive: false });
    window.addEventListener('keydown', tap, { passive: false });
    raf = requestAnimationFrame(frame);
  });
}

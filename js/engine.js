// ═══════════════════════════════════════════════════════
//  GLOBAL STATE
// ═══════════════════════════════════════════════════════
const SYNC_MAX = 20;
let totalSync = 0;
let chapterSync = 0;
let currentChapter = '';
let completedChapters = {};
let storyFlags = {};
let echoMode = null; // 'player' | 'engineer'; must be chosen on the landing screen.
let backCount = 0, filesViewed = 0, silTimer = null, silTriggered = false;
let lbViewCount = {};
let activeWidgetController = null;
let activeStoryAudio = null;

function loadProgress() {
  totalSync = 0;
  completedChapters = {};
  storyFlags = {};
  try {
    const s = localStorage.getItem('echo_progress');
    if (s) {
      const d = JSON.parse(s);
      totalSync = d.t || 0;
      completedChapters = d.c || {};
      storyFlags = d.f || {};
    }
  } catch(e) {}
}
function saveProgress() {
  if (echoMode !== 'player') return;
  try { localStorage.setItem('echo_progress', JSON.stringify({ t: totalSync, c: completedChapters, f: storyFlags })); } catch(e) {}
}

function resetPlayerProgress() {
  if (echoMode === 'player') {
    try { localStorage.removeItem('echo_progress'); } catch(e) {}
  }
  location.reload();
}

// ═══════════════════════════════════════════════════════
//  SYNC SYSTEM
// ═══════════════════════════════════════════════════════
function addSync(pts) {
  if (pts <= 0) return;
  chapterSync = Math.min(SYNC_MAX, chapterSync + pts);
  updateSyncUI();
}
function subSync(pts) { chapterSync = Math.max(0, chapterSync - pts); updateSyncUI(); }

function updateSyncUI() {
  const pct = Math.round(chapterSync / SYNC_MAX * 100);
  document.getElementById('sync-fill').style.width = pct + '%';
  const el = document.getElementById('sync-pct');
  el.textContent = chapterSync + '%';
  el.classList.remove('pulse');
  void el.offsetWidth;
  el.classList.add('pulse');
  const col = chapterSync <= 5 ? '#6644aa' : chapterSync <= 10 ? '#8833dd' : chapterSync <= 15 ? '#aa22ff' : '#cc44ff';
  document.getElementById('sync-fill').style.cssText = 'width:' + pct + '%;background:' + col + ';box-shadow:0 0 8px ' + col;
  el.style.color = col;
}

function getSyncEval(ch) {
  const s = chapterSync;
  const maps = {
    '1-1': [[5,'「你很抗拒我呢……沒關係，我有的是時間。」','強抵抗'],[10,'「你開始好奇我了，對嗎？」','調查傾向'],[15,'「我們越來越接近了……」','高沉浸'],[20,'「你已經是我的了……」','高依附']],
    '2-1': [[5,'「你還是不願意依靠我……」','強抵抗'],[10,'「地下道已經在等你了。」','調查傾向'],[15,'「你開始害怕了……那很好。」','高沉浸'],[20,'「帶你進去，是我一直想做的事。」','高依附']],
    '2-2': [[5,'「……你還是不相信我。」','強抵抗'],[10,'「你開始記起什麼了嗎？」','調查傾向'],[15,'「你的臉，我一直記得……」','高沉浸'],[18,'「你開始懷疑自己了。那就對了。」','高認知污染']],
    '3-1': [[5,'「你還在抗拒記憶……」','強抵抗'],[10,'「聊天室開始活過來了。」','調查傾向'],[15,'「你已經分不清哪些是自己說的了。」','高沉浸'],[20,'「我比你更了解你自己。」','高依附']],
    '3-2': [[5,'「你太快想離開了。」','低污染'],[10,'「你開始在乎聊天室了。」','調查沉浸'],[15,'「你快忘記怎麼離線了。」','高沉浸'],[20,'「歡迎留下來。」','在線同步']],
    '3-3': [[5,'K：「你還在嗎？」','低污染'],[10,'K：「第三個呼吸……你聽到了嗎？」','聲音沉浸'],[15,'K：「你快分不清耳機和現實了……」','高聽覺污染'],[20,'K：「它現在說的和你一模一樣。」','現實同步']],
    '4-1': [[5,'「你還在掙扎。」','低同步'],[10,'「你的記憶開始動搖了。」','認知污染'],[15,'「鏡子裡的那個……也越來越像你了。」','人格重疊'],[20,'「我們早就是同一個人了。」','高同步人格侵蝕']],
    '4-2': [[5,'「你還想自己處理一切。」','低代理'],[10,'「你開始讓我替你留著一些事。」','邊界鬆動'],[15,'「這樣比較安靜，不是嗎？」','代理依存'],[20,'「你不用記得，我會代你記得。」','高代理同步']],
    '5':   [[5,'「再見。」','低同步'],[10,'「你有時候還是會回來的。」','動搖同步'],[15,'「你幾乎不想離開了。」','高同步'],[20,'「永遠在一起。」','完全同步']],
  };
  const arr = maps[ch] || maps['1-1'];
  for (const [t, q, lv] of arr) { if (s <= t) return { q, lv }; }
  return { q: arr[arr.length - 1][1], lv: arr[arr.length - 1][2] };
}

// ═══════════════════════════════════════════════════════
//  CORE UTILS
// ═══════════════════════════════════════════════════════
let clockMin = 13, clockHour = 2;
setInterval(() => {
  clockMin++;
  if (clockMin >= 60) { clockMin = 0; clockHour = (clockHour + 1) % 24; }
  const el = document.getElementById('clock');
  if (el) el.textContent = '0' + clockHour + ':' + (clockMin < 10 ? '0' + clockMin : clockMin);
}, 18000);

const chatBody = document.getElementById('chat-body');
const optionsArea = document.getElementById('options-area');
const typingEl = document.getElementById('typing-indicator');

function ensureMiniGameOverlay() {
  let overlay = document.getElementById('minigame-overlay');
  if (overlay) return overlay;
  overlay = document.createElement('div');
  overlay.id = 'minigame-overlay';
  overlay.innerHTML = '<div class="minigame-overlay-backdrop"></div><div class="minigame-overlay-frame"></div>';
  document.getElementById('app').appendChild(overlay);
  return overlay;
}

function openMiniGameOverlay(node, cancel) {
  cancelActiveWidget('replaced');
  optionsArea.classList.remove('widget-open');
  optionsArea.innerHTML = '';

  const overlay = ensureMiniGameOverlay();
  const frame = overlay.querySelector('.minigame-overlay-frame');
  const savedScrollTop = chatBody.scrollTop;
  frame.innerHTML = '';
  frame.appendChild(node);
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden', 'false');

  const controller = {
    mountTarget: 'overlay',
    node,
    overlay,
    close: () => {
      frame.innerHTML = '';
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      requestAnimationFrame(() => { chatBody.scrollTop = savedScrollTop; });
    },
    cancel: (reason) => {
      controller.close();
      if (typeof cancel === 'function') cancel(reason);
    }
  };
  activeWidgetController = controller;
  return controller;
}

function closeMiniGameOverlay(controller) {
  const ctl = controller || activeWidgetController;
  if (!ctl || ctl.mountTarget !== 'overlay') return;
  if (activeWidgetController === ctl) activeWidgetController = null;
  if (typeof ctl.close === 'function') ctl.close();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function scrollBottom() { chatBody.scrollTop = chatBody.scrollHeight; }

function stopStoryAudio() {
  if (!activeStoryAudio) return;
  activeStoryAudio.player.pause();
  activeStoryAudio.player.currentTime = 0;
  if (activeStoryAudio.bubble) activeStoryAudio.bubble.classList.remove('playing');
  activeStoryAudio = null;
}

function showTyping(v, style) {
  typingEl.style.display = v ? 'flex' : 'none';
  if (v) {
    const bg = style === 'eva' ? 'var(--b-eva)' : style === 'rain' ? 'var(--b-rain)' : style === 'k' ? 'var(--b-k)' : 'var(--b-other)';
    document.getElementById('typ-bbl').style.background = bg;
    chatBody.appendChild(typingEl);
    scrollBottom();
  }
}

function mkAv(type) {
  const d = document.createElement('div');
  d.className = 'avatar sav av-' + type;
  if (type === 'unk') { d.textContent = '?'; return d; }
  const img = document.createElement('img');
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;display:block';
  if (type === 'eva') {
    img.src = 'img/eva/eva_normal.jpg';
    img.id = 'av-img-eva-' + Date.now();
    img.onerror = () => { d.classList.add('no-img'); img.remove(); };
  } else if (type === 'rain') {
    img.src = 'img/rain/rain_normal.jpg';
    img.onerror = () => img.remove();
  } else if (type === 'k') {
    img.src = 'img/k/k_normal.jpg';
    img.id = 'av-img-k-' + Date.now();
    img.onerror = () => img.remove();
  }
  d.appendChild(img);
  // K online dot — after img so it overlays correctly
  if (type === 'k') {
    const dot = document.createElement('div');
    dot.className = 'odot od-unk';
    d.appendChild(dot);
  }
  return d;
}

function gToast(txt) {
  const t = document.createElement('div');
  t.style.cssText = 'position:fixed;bottom:5.5rem;left:50%;transform:translateX(-50%);background:rgba(153,51,255,.15);border:1px solid rgba(153,51,255,.3);color:#cc44ff;font-size:.65rem;padding:.3rem .8rem;border-radius:20px;letter-spacing:.1em;z-index:180;pointer-events:none';
  t.textContent = txt;
  document.body.appendChild(t);
  t.animate([
    { opacity: 1, transform: 'translateX(-50%) translateY(0)' },
    { opacity: 0, transform: 'translateX(-50%) translateY(-8px)' }
  ], { duration: 2000, delay: 300, fill: 'forwards' });
  setTimeout(() => t.remove(), 2400);
}

function notification(icon, title, text) {
  document.getElementById('ni').textContent = icon;
  document.getElementById('nt').textContent = title;
  document.getElementById('nm').textContent = text;
  const b = document.getElementById('notif-banner');
  b.classList.add('show');
  setTimeout(() => b.classList.remove('show'), 3500);
}

function glitch() {
  const a = document.getElementById('app');
  a.classList.add('sg');
  setTimeout(() => a.classList.remove('sg'), 320);
}

function flash() {
  const f = document.getElementById('flash-overlay');
  f.style.transition = 'opacity .06s';
  f.style.opacity = '.5';
  setTimeout(() => { f.style.transition = 'opacity .5s'; f.style.opacity = '0'; }, 80);
}

function setHeader(type, name, status) {
  const av = document.getElementById('hdr-av');
  const dot = av.querySelector('.odot'); if (dot) dot.remove();
  av.className = 'avatar av-' + type;
  av.innerHTML = '';
  // real image
  const imgSrcs = {
    k: 'img/k/k_normal.jpg',
    eva: 'img/eva/eva_normal.jpg',
    rain: 'img/rain/rain_normal.jpg',
  };
  if (imgSrcs[type]) {
    const img = document.createElement('img');
    img.src = imgSrcs[type];
    img.id = 'hdr-av-img';
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;display:block';
    img.onerror = () => { av.classList.add('no-img'); img.remove(); };
    av.appendChild(img);
  } else {
    av.textContent = '?';
  }
  const d = document.createElement('div');
  d.className = 'odot ' + (type === 'eva' ? 'od-on' : type === 'rain' ? 'od-off' : 'od-unk');
  av.appendChild(d);
  const names = { k: 'K', eva: 'EVA', rain: '林雨晴', unk: '？？？' };
  const statuses = { k: '上線中', eva: 'ECHO 輔助系統', rain: '最後上線：3天前', unk: '身份不明' };
  document.getElementById('hdr-name').textContent = name || names[type] || type;
  document.getElementById('hdr-status').textContent = status || statuses[type] || '';
}

// 切換頭像圖片（不改變其他狀態）
function swapHeaderImg(src, filterStyle) {
  const img = document.getElementById('hdr-av-img');
  if (!img) return;
  img.style.transition = 'opacity .3s';
  img.style.opacity = '0';
  setTimeout(() => {
    img.src = src;
    if (filterStyle) img.style.filter = filterStyle;
    img.style.opacity = '1';
  }, 300);
}

// K glitch 效果（用 CSS filter 即時套用）
function applyKGlitch(intensity) {
  const img = document.getElementById('hdr-av-img');
  if (!img) return;
  img.src = 'img/k/k_glitch.jpg';
  const hue = intensity >= 2 ? '180deg' : '90deg';
  const sat = intensity >= 2 ? '3' : '2';
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%;filter:hue-rotate(' + hue + ') saturate(' + sat + ') brightness(1.2);animation:kglitch ' + (intensity >= 2 ? '0.8s' : '1.5s') + ' steps(2) infinite';
}

// EVA 頭像根據同步率自動升級
function syncEvaAvatar() {
  const img = document.getElementById('hdr-av-img');
  if (!img) return;
  const src = chapterSync >= 16 ? 'img/eva/eva_digital.jpg' :
              chapterSync >= 11 ? 'img/eva/eva_glitch.jpg' :
              'img/eva/eva_normal.jpg';
  if (img.src !== src) {
    img.style.transition = 'opacity .5s';
    img.style.opacity = '0';
    setTimeout(() => { img.src = src; img.style.opacity = '1'; }, 500);
  }
}

// ═══════════════════════════════════════════════════════
//  MESSAGE BUILDER
// ═══════════════════════════════════════════════════════
async function addMsg(type, content, opts) {
  const o = opts || {};
  const delay = o.delay !== undefined ? o.delay : 500;
  const typing = o.typing !== undefined ? o.typing : 900;
  const meta = o.meta || '';
  const isEva = o.isEva || false;
  const isRain = o.isRain || false;
  const isK = o.isK || false;
  const isUnk = o.isUnk || false;
  const recalled = o.recalled || false;
  const noTyping = o.noTyping || false;

  const spk = isEva ? 'eva' : isRain ? 'rain' : isK ? 'k' : 'other';

  if (!noTyping && type !== 'self' && type !== 'sys' && type !== 'time') {
    showTyping(true, spk);
    await sleep(typing);
    showTyping(false);
  } else {
    await sleep(delay);
  }

  if (type === 'sys') {
    const d = document.createElement('div');
    d.className = 'sys';
    d.innerHTML = content;
    chatBody.appendChild(d);
    scrollBottom();
    return d;
  }
  if (type === 'time') {
    const d = document.createElement('div');
    d.className = 'tlbl';
    d.textContent = content;
    chatBody.appendChild(d);
    return d;
  }

  const row = document.createElement('div');
  row.className = 'brow' + (type === 'self' ? ' self' : '');
  if (type !== 'self') {
    row.appendChild(mkAv(isEva ? 'eva' : isRain ? 'rain' : isUnk ? 'unk' : 'k'));
  }

  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;max-width:100%';

  const bbl = document.createElement('div');

  if (recalled) {
    bbl.className = 'bbl recalled';
    bbl.textContent = '訊息已收回';
  } else if (type === 'inject') {
    bbl.className = 'bbl bb-inject';
    bbl.innerHTML = content;
  } else if (content === '__K_PHOTO__') {
    bbl.className = 'bbl';
    bbl.style.cssText = 'padding:0;background:transparent';
    const p = document.createElement('div');
    p.id = 'k-photo-bubble';
    p.style.cssText = 'position:relative;width:220px;cursor:pointer;border-radius:12px;overflow:hidden;border:1px solid #2a2a3a';
    const img = document.createElement('img');
    img.src = 'img/scenes/tunnel_empty.jpg';
    img.style.cssText = 'width:100%;display:block;filter:brightness(.75) saturate(.7)';
    img.alt = '';
    const lbl = document.createElement('div');
    lbl.style.cssText = 'position:absolute;top:6px;left:8px;background:rgba(255,68,102,.85);color:#fff;font-size:.55rem;padding:1px 5px;border-radius:3px;letter-spacing:.05em';
    lbl.textContent = '時間異常';
    const ts = document.createElement('div');
    ts.style.cssText = 'position:absolute;bottom:6px;right:8px;background:rgba(0,0,0,.75);color:#ffaa00;font-size:.6rem;padding:1px 5px;border-radius:3px;font-family:monospace';
    ts.textContent = '03:17 AM';
    p.appendChild(img); p.appendChild(lbl); p.appendChild(ts);
    p.onclick = () => openLB('k');
    bbl.appendChild(p);
  } else if (content === '__CCTV__') {
    bbl.className = 'bbl';
    bbl.style.cssText = 'padding:0;background:transparent';
    const p = document.createElement('div');
    p.style.cssText = 'position:relative;width:220px;cursor:pointer;border-radius:8px;overflow:hidden;border:1px solid #1a2a1a';
    const img = document.createElement('img');
    img.src = 'img/scenes/tunnel_cctv.jpg';
    img.style.cssText = 'width:100%;display:block;filter:brightness(.7) saturate(.3) contrast(1.1)';
    img.alt = '';
    const scan = document.createElement('div');
    scan.className = 'cctv-scan';
    const lbl = document.createElement('div');
    lbl.style.cssText = 'position:absolute;top:5px;left:6px;background:rgba(0,0,0,.7);color:#2dd4a4;font-size:.5rem;padding:1px 4px;border-radius:2px;font-family:monospace';
    lbl.textContent = 'CAM 07';
    const ts = document.createElement('div');
    ts.style.cssText = 'position:absolute;bottom:5px;right:6px;background:rgba(0,0,0,.7);color:#aaa;font-size:.55rem;padding:1px 4px;border-radius:2px;font-family:monospace';
    ts.textContent = '2024/06/02  03:17:23';
    p.appendChild(img); p.appendChild(scan); p.appendChild(lbl); p.appendChild(ts);
    p.onclick = () => openLB('cctv');
    bbl.appendChild(p);
  } else if (content === '__ROOM__') {
    bbl.className = 'bbl';
    bbl.style.cssText = 'padding:0;background:transparent';
    const p = document.createElement('div');
    p.style.cssText = 'position:relative;width:220px;cursor:pointer;border-radius:12px;overflow:hidden;border:1px solid #2a1a2a;box-shadow:0 0 20px rgba(180,0,80,.12)';
    const img = document.createElement('img');
    img.src = 'img/scenes/room_eva.jpg';
    img.style.cssText = 'width:100%;display:block;filter:brightness(.7)';
    img.alt = '';
    const futMin = clockMin + 3;
    const ts = document.createElement('div');
    ts.style.cssText = 'position:absolute;bottom:6px;right:8px;background:rgba(0,0,0,.8);color:#ff6688;font-size:.6rem;padding:1px 5px;border-radius:3px;font-family:monospace';
    ts.textContent = '0' + clockHour + ':' + (futMin < 10 ? '0' + futMin : futMin) + ' AM';
    const badge = document.createElement('div');
    badge.style.cssText = 'position:absolute;top:6px;left:8px;background:rgba(180,0,80,.85);color:#fff;font-size:.55rem;padding:1px 5px;border-radius:3px;letter-spacing:.05em';
    badge.textContent = '備份完成';
    p.appendChild(img); p.appendChild(ts); p.appendChild(badge);
    p.onclick = () => openLB('room');
    bbl.appendChild(p);
  } else if (content === '__RAIN_PHOTO__') {
    bbl.className = 'bbl';
    bbl.style.cssText = 'padding:0;background:transparent';
    const p = document.createElement('div');
    p.style.cssText = 'position:relative;width:220px;cursor:pointer;border-radius:12px;overflow:hidden;border:1px solid #1a2a2a';
    const img = document.createElement('img');
    img.src = 'img/rain/rain_glitch2.jpg';
    img.style.cssText = 'width:100%;display:block;filter:brightness(.7) saturate(.6)';
    img.alt = '';
    const ts = document.createElement('div');
    ts.style.cssText = 'position:absolute;bottom:6px;right:8px;background:rgba(0,0,0,.75);color:#2299aa;font-size:.55rem;padding:1px 4px;border-radius:2px;font-family:monospace';
    ts.textContent = '03:17 AM';
    p.appendChild(img); p.appendChild(ts);
    p.onclick = () => openLB('rain');
    bbl.appendChild(p);
  } else if (content === '__ROOM_WHITE__') {
    bbl.className = 'bbl';
    bbl.style.cssText = 'padding:0;background:transparent';
    const p = document.createElement('div');
    p.style.cssText = 'position:relative;width:220px;cursor:pointer;border-radius:12px;overflow:hidden;border:1px solid #e8e8f0;box-shadow:0 0 24px rgba(255,255,255,.15)';
    const img = document.createElement('img');
    img.src = 'img/scenes/room_white.jpg';
    img.style.cssText = 'width:100%;display:block;filter:brightness(.95)';
    img.alt = '';
    p.appendChild(img);
    p.onclick = () => openLB('room_white');
    bbl.appendChild(p);
  } else if (content === '__AUDIO__' || content.startsWith('__AUDIO:')) {
    const label = content.startsWith('__AUDIO:') ? content.slice(8) : '語音訊息 · 0:08';
    bbl.className = 'audio-bbl';
    const heights = [18, 10, 20, 6, 16, 8, 22, 12, 18, 7, 14, 20, 8];
    const bars = heights.map((h, i) => '<div class="wf-bar" style="height:' + h + 'px;--h:' + h + 'px;--dur:' + (0.4 + i * 0.07) + 's"></div>').join('');
    bbl.innerHTML = '<div class="audio-top"><span style="font-size:1.1rem">🎙</span><div class="audio-wf">' + bars + '</div></div><div class="audio-label">' + label + '</div><div class="audio-tr"></div>';
    bbl.onclick = function() {
      const willPlay = !this.classList.contains('playing');

      if (activeStoryAudio) {
        activeStoryAudio.player.pause();
        activeStoryAudio.player.currentTime = 0;
        if (activeStoryAudio.bubble && activeStoryAudio.bubble !== this) {
          activeStoryAudio.bubble.classList.remove('playing');
          const oldTr = activeStoryAudio.bubble.querySelector('.audio-tr');
          if (oldTr) oldTr.style.display = 'none';
        }
        activeStoryAudio = null;
      }

      this.classList.toggle('playing', willPlay);
      const tr = this.querySelector('.audio-tr');
      if (willPlay) {
        tr.style.display = 'block';
        if (tr.dataset.txt) tr.innerHTML = tr.dataset.txt;
        if (this.dataset.audioSrc) {
          const player = new Audio(new URL(this.dataset.audioSrc, document.baseURI).href);
          player.preload = 'auto';
          activeStoryAudio = { player, bubble: this };
          player.onended = () => {
            if (activeStoryAudio && activeStoryAudio.player === player) activeStoryAudio = null;
            this.classList.remove('playing');
          };
          player.onerror = () => {
            if (activeStoryAudio && activeStoryAudio.player === player) activeStoryAudio = null;
            this.classList.remove('playing');
            gToast('音訊載入失敗');
          };
          player.play().catch(() => {
            if (activeStoryAudio && activeStoryAudio.player === player) activeStoryAudio = null;
            this.classList.remove('playing');
            gToast('請再點一次播放語音');
          });
        }
      } else {
        tr.style.display = 'none';
      }
    };
  } else if (content.startsWith('__ONLINE_COUNT:')) {
    const n = content.slice(15);
    bbl.className = 'bbl bb-other';
    bbl.innerHTML = '<span class="online-badge">🟢 ' + n + ' 人在線</span>';
  } else if (content.startsWith('__SYNC_BAR:')) {
    const pct = parseInt(content.slice(11));
    bbl.className = 'bbl';
    bbl.style.cssText = 'padding:0;background:transparent;width:200px';
    bbl.innerHTML = '<div class="sync-prog-wrap"><div class="sync-prog-label">Synchronization</div><div class="sync-prog-track"><div class="sync-prog-fill" style="width:0%"></div></div></div>';
    setTimeout(() => { const f = bbl.querySelector('.sync-prog-fill'); if (f) f.style.width = pct + '%'; }, 300);
  } else {
    const cls = type === 'self' ? 'bb-self' : isEva ? 'bb-eva' : isRain ? 'bb-rain' : isK ? 'bb-k' : 'bb-other';
    bbl.className = 'bbl ' + cls;
    bbl.innerHTML = content;
  }

  wrap.appendChild(bbl);
  if (meta) {
    const m = document.createElement('div');
    m.className = 'bmeta';
    if (type === 'self') m.innerHTML = meta + ' <span class="rr">✓✓</span>';
    else m.textContent = meta;
    wrap.appendChild(m);
  }
  row.appendChild(wrap);
  chatBody.appendChild(row);
  scrollBottom();
  return { row, bbl };
}

// ═══════════════════════════════════════════════════════
//  OPTIONS
// ═══════════════════════════════════════════════════════
function cancelActiveWidget(reason) {
  if (!activeWidgetController) return;
  const ctl = activeWidgetController;
  activeWidgetController = null;
  ctl.cancel(reason || 'cancelled');
}

function clearOpts() {
  cancelActiveWidget('cleared');
  optionsArea.classList.remove('widget-open');
  optionsArea.innerHTML = '';
}

function showOpts(opts, cb) {
  clearOpts();
  opts.forEach((o, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt';
    const hint = o.sync > 0 ? '<span class="osh">▲</span>' : o.sync < 0 ? '<span class="osh" style="color:rgba(255,100,100,.35)">▼</span>' : '';
    btn.innerHTML = o.text + hint;
    btn.onclick = async () => {
      Array.from(optionsArea.children).forEach((b, j) => { b.className = j === i ? 'opt sel' : 'opt dis'; });
      const t = '02:' + String(14 + Math.floor(Math.random() * 6)).padStart(2, '0');
      const res = await addMsg('self', o.text, { delay: 0, noTyping: true, meta: t });
      if (o.sync > 0 && res && res.row) {
        const w = res.row.querySelector('div');
        if (w) { const s = document.createElement('span'); s.className = 'stost'; s.textContent = '+' + o.sync + '%'; w.appendChild(s); }
        addSync(o.sync);
      } else if (o.sync < 0) {
        subSync(Math.abs(o.sync));
      }
      clearOpts();
      if (o.sync >= 4) {
        await sleep(600);
        const responseSource = ['2-2', '3-2'].includes(currentChapter) ? '林雨晴' : currentChapter === '3-3' ? 'K' : 'EVA';
        gToast(responseSource + ' 對你的回應明顯提升');
      }
      cb(i, o.text, o.sync);
    };
    optionsArea.appendChild(btn);
  });
}

// ═══════════════════════════════════════════════════════
//  INTERACTION WIDGETS
// ═══════════════════════════════════════════════════════
function calcPermissionWhackSync(finalOnCount) {
  if (finalOnCount <= 1) return 1;
  if (finalOnCount <= 3) return 3;
  if (finalOnCount <= 5) return 5;
  if (finalOnCount <= 7) return 6;
  return 8;
}

function getPermissionWhackBand(finalOnCount) {
  if (finalOnCount <= 1) {
    return {
      key: 'low',
      evaLine: '……原來你真的不太喜歡。'
    };
  }
  if (finalOnCount <= 5) {
    return {
      key: 'mid',
      evaLine: '……我知道了。至少還有一些地方你願意讓我幫忙。'
    };
  }
  return {
    key: 'high',
    evaLine: '……我還以為你不會讓我碰這些。'
  };
}

function clonePermissionConfig(list) {
  return list.map((item, index) => ({
    id: item.id || 'perm-' + index,
    label: item.label || '未命名權限',
    state: !!item.state,
    category: item.category || 'general',
    keyAssist: !!item.keyAssist,
    substitute: item.substitute || null,
    description: item.description || '',
    lastTouchedAt: 0
  }));
}

function getDefaultPermissionWhackConfig() {
  return [
    { id: 'notifications', label: '通知存取', state: false, category: 'general', substitute: 'message_assist' },
    { id: 'reminder_sync', label: '提醒同步', state: true, category: 'reminder', keyAssist: true, substitute: 'background_activity' },
    { id: 'background_activity', label: '背景活動', state: false, category: 'service', substitute: 'usage_analysis' },
    { id: 'usage_analysis', label: '使用分析', state: false, category: 'analysis', substitute: 'sleep_routine' },
    { id: 'calendar_sync', label: '行程整理', state: true, category: 'schedule', keyAssist: true, substitute: 'transport_hints' },
    { id: 'transport_hints', label: '交通提示', state: false, category: 'service', substitute: 'calendar_sync' },
    { id: 'message_assist', label: '訊息協助', state: true, category: 'messages', keyAssist: true, substitute: 'shopping_suggestions' },
    { id: 'shopping_suggestions', label: '購物建議', state: false, category: 'service', substitute: 'health_reminders' },
    { id: 'sleep_routine', label: '睡眠管理', state: true, category: 'reminder', keyAssist: true, substitute: 'health_reminders' },
    { id: 'health_reminders', label: '健康提醒', state: false, category: 'reminder', substitute: 'reminder_sync' }
  ];
}

async function runPermissionWhack(config) {
  cancelActiveWidget('replaced');
  optionsArea.classList.remove('widget-open');
  optionsArea.innerHTML = '';

  const cfg = config || {};
  const durationMs = cfg.durationMs || 30000;
  const permissions = clonePermissionConfig(cfg.permissions || getDefaultPermissionWhackConfig());
  const applySync = cfg.applySync !== false;
  const title = cfg.title || '⚙ EVA Assistant 權限管理';
  const subtitle = cfg.subtitle || '關閉你不希望 EVA 接手的權限。';
  const introMs = cfg.introMs || 2600;
  const falseClearMs = cfg.falseClearMs || 2600;
  const waveLabels = cfg.waveLabels || {
    0: '待命',
    1: 'Wave 1 · 還原',
    2: 'Wave 2 · 替換',
    3: 'Wave 3 · 接手'
  };

  return new Promise((resolve) => {
    let settled = false;
    let pressureTimer = null;
    let clockTimer = null;
    let introTimer = null;
    let remainingMs = durationMs;
    let wave = 0;
    let phase = 'intro';
    let playerToggleCount = 0;
    let evaRestoreCount = 0;
    let lastPressureAt = 0;
    let wave3FalseClearTriggered = false;
    let falseClearUntil = 0;

    const widget = document.createElement('div');
    widget.className = 'pw-widget';
    widget.innerHTML =
      '<div class="pw-head">' +
        '<div>' +
          '<div class="pw-kicker">Permission Whack</div>' +
          '<div class="pw-title"></div>' +
        '</div>' +
        '<div class="ch42-head-status"><span class="ch42-stage">1 / 2</span><div class="pw-timer">00:30</div></div>' +
      '</div>' +
      '<div class="pw-sub"></div>' +
      '<div class="pw-wave"></div>' +
      '<div class="pw-list"></div>' +
      '<div class="pw-foot">' +
        '<div class="pw-meter"><span class="pw-meter-label">已接手</span><span class="pw-meter-value">0 / 10</span></div>' +
        '<div class="pw-hint">EVA：……不用緊張。我只是想知道，哪些事情你不希望我幫忙。</div>' +
      '</div>';

    const titleEl = widget.querySelector('.pw-title');
    const timerEl = widget.querySelector('.pw-timer');
    const subEl = widget.querySelector('.pw-sub');
    const waveEl = widget.querySelector('.pw-wave');
    const listEl = widget.querySelector('.pw-list');
    const meterEl = widget.querySelector('.pw-meter-value');
    const hintEl = widget.querySelector('.pw-hint');
    titleEl.textContent = title;
    subEl.textContent = subtitle;

    function findPerm(id) {
      return permissions.find((item) => item.id === id);
    }

    function getWaveByRemaining(ms) {
      if (ms > 22000) return 1;
      if (ms > 10000) return 2;
      return 3;
    }

    function formatMs(ms) {
      const totalSec = Math.max(0, Math.ceil(ms / 1000));
      const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const sec = String(totalSec % 60).padStart(2, '0');
      return min + ':' + sec;
    }

    function activeOnCount() {
      return permissions.filter((item) => item.state).length;
    }

    function activeCategoriesCount(category) {
      return permissions.filter((item) => item.state && item.category === category).length;
    }

    function renderPermission(item) {
      const row = document.createElement('button');
      row.type = 'button';
      row.className = 'pw-row' + (item.state ? ' is-on' : ' is-off');
      row.dataset.id = item.id;
      row.innerHTML =
        '<span class="pw-row-text">' + item.label + '</span>' +
        '<span class="pw-state">' + (item.state ? 'ON' : 'OFF') + '</span>';
      row.onclick = () => {
        if (settled || phase === 'intro' || !item.state) return;
        item.state = false;
        item.lastTouchedAt = Date.now();
        playerToggleCount++;
        hintEl.textContent = '你把「' + item.label + '」關掉了。';
        render();
        scheduleImmediateResponse(item);
      };
      return row;
    }

    function render() {
      listEl.innerHTML = '';
      permissions.forEach((item) => listEl.appendChild(renderPermission(item)));
      meterEl.textContent = activeOnCount() + ' / ' + permissions.length;
      waveEl.textContent = waveLabels[wave] || waveLabels[3];
      timerEl.textContent = formatMs(remainingMs);
      widget.classList.toggle('pw-intro', phase === 'intro');
    }

    function setPermOn(item, hintText) {
      if (!item || item.state) return false;
      item.state = true;
      evaRestoreCount++;
      item.lastTouchedAt = Date.now();
      if (hintText) hintEl.textContent = hintText;
      render();
      return true;
    }

    function scheduleImmediateResponse(item) {
      const finalRush = phase === 'active' && remainingMs <= 3000;
      const delay = finalRush ? 450 : (wave === 1 ? 1000 : wave === 2 ? 1150 : 1500);
      setTimeout(() => {
        if (settled || !activeWidgetController) return;
        if (phase === 'intro') return;
        if (wave === 1) {
          if (!item.keyAssist && item.category !== 'reminder') return;
          setPermOn(item, 'EVA：……這個，我猜你會需要。');
          return;
        }
        if (wave === 2 && item.substitute) {
          const alt = findPerm(item.substitute);
          if (alt && !alt.state) {
            setPermOn(alt, 'EVA：……我沒有全部碰。只是先整理。');
            return;
          }
        }
        if (wave === 3) {
          if (Date.now() < falseClearUntil) return;
          const target = findPerm(item.substitute) || item;
          if (target && !target.state) {
            setPermOn(target, 'EVA：……你先休息一下，這些我可以先放著。');
          }
        }
      }, delay);
    }

    function enterFalseClear() {
      wave3FalseClearTriggered = true;
      falseClearUntil = Date.now() + falseClearMs;
      hintEl.textContent = '系統：整理已暫停。';
    }

    function applyWavePressure() {
      if (phase !== 'active') return;
      const now = Date.now();
      if (wave === 3 && !wave3FalseClearTriggered) enterFalseClear();
      if (now < falseClearUntil) return;
      if (wave === 3 && now - falseClearUntil < 700) {
        hintEl.textContent = 'EVA：……好了，先這樣。我只是把剛剛中斷的服務補回來。';
      }
      const cadence = remainingMs <= 3000 ? 650 : (wave === 1 ? 3200 : wave === 2 ? 3000 : 2400);
      if (now - lastPressureAt < cadence) return;
      lastPressureAt = now;

      const offPerms = permissions.filter((item) => !item.state);
      if (!offPerms.length) return;

      if (wave === 1) {
        const target = offPerms.find((item) => item.category === 'reminder' || item.keyAssist);
        if (!target) return;
        setPermOn(target, 'EVA：……先幫你開著。');
        return;
      }

      if (wave === 2) {
        const chainSource = permissions.find((item) =>
          !item.state &&
          item.substitute &&
          findPerm(item.substitute) &&
          !findPerm(item.substitute).state &&
          (item.category === 'service' || item.category === 'analysis')
        );
        if (chainSource) {
          setPermOn(findPerm(chainSource.substitute), 'EVA：……關掉一個也沒關係，我會從別的地方幫你。');
          return;
        }
        if (activeCategoriesCount('service') <= 1) {
          const supportTarget = offPerms.find((item) => item.category === 'service');
          if (supportTarget) {
            setPermOn(supportTarget, 'EVA：……我只是換一種方式幫你。');
          }
        }
        return;
      }

      const target = offPerms.find((item) => item.category === 'service') ||
        offPerms.find((item) => item.category === 'analysis') ||
        offPerms[0];
      setPermOn(target, 'EVA：……剛剛停掉的那部分，我先替你補回來。');
    }

    function finish(reason) {
      if (settled) return;
      settled = true;
      const controller = activeWidgetController;
      if (controller && controller.mountTarget === 'overlay') closeMiniGameOverlay(controller);
      else activeWidgetController = null;
      clearInterval(clockTimer);
      clearInterval(pressureTimer);
      clearTimeout(introTimer);

      const finalOnCount = activeOnCount();
      const band = getPermissionWhackBand(finalOnCount);
      const syncAward = calcPermissionWhackSync(finalOnCount);
      const shouldApplySync = applySync && reason === 'completed';

      const result = {
        reason,
        finalOnCount,
        resultBand: band.key,
        evaLine: band.evaLine,
        syncAward: shouldApplySync ? syncAward : 0,
        rawSyncAward: syncAward,
        playerToggleCount,
        evaRestoreCount,
        permissions: permissions.map((item) => ({
          id: item.id,
          label: item.label,
          state: item.state
        }))
      };

      if (shouldApplySync) {
        addSync(syncAward);
        syncEvaAvatar();
      }
      optionsArea.classList.remove('widget-open');
      optionsArea.innerHTML = '';
      resolve(result);
    }

    openMiniGameOverlay(widget, finish);
    render();

    let startedAt = 0;
    introTimer = setTimeout(() => {
      if (settled) return;
      phase = 'active';
      wave = 1;
      startedAt = Date.now();
      hintEl.textContent = 'EVA：……不用緊張。我不是在拿你的手機。';
      render();
    }, introMs);

    clockTimer = setInterval(() => {
      if (phase === 'intro') {
        remainingMs = durationMs;
        render();
        return;
      }
      remainingMs = Math.max(0, durationMs - (Date.now() - startedAt));
      wave = getWaveByRemaining(remainingMs);
      render();
      if (remainingMs <= 0) finish('completed');
    }, 200);

    pressureTimer = setInterval(() => {
      if (settled) return;
      applyWavePressure();
    }, 300);
  });
}

// ═══════════════════════════════════════════════════════
//  SILENCE TIMER
// ═══════════════════════════════════════════════════════
function startSilence(pts, hint) {
  silTriggered = false;
  clearTimeout(silTimer);
  const h = document.createElement('div');
  h.className = 'silence-hint';
  h.textContent = hint || '（等待中……）';
  chatBody.appendChild(h);
  scrollBottom();
  silTimer = setTimeout(() => {
    if (!silTriggered) { h.remove(); silTriggered = true; addSync(pts); gToast('+' + pts + '% 同步率（沉默）'); }
  }, 10000);
  return () => { clearTimeout(silTimer); silTriggered = true; h.remove(); };
}

// ═══════════════════════════════════════════════════════
//  LIGHTBOX
// ═══════════════════════════════════════════════════════
function openLB(type, extraSrc, extraCaption) {
  lbViewCount[type] = (lbViewCount[type] || 0) + 1;
  const lbEl = document.getElementById('lightbox');
  const imgEl = document.getElementById('lb-img');
  const det = document.getElementById('lb-det');
  const hid = document.getElementById('lb-hid');
  det.classList.remove('show');
  det.style.color = '';
  hid.className = 'lb-hid';
  hid.style.cssText = '';
  imgEl.style.cssText = 'max-width:100%;max-height:72vh;object-fit:contain;border-radius:8px';

  if (type === 'doc') {
    imgEl.src = extraSrc;
    document.getElementById('lb-cap').textContent = extraCaption || 'ECHO 附件';
    det.textContent = '⚠ 點擊任意處關閉';
    setTimeout(() => det.classList.add('show'), 500);
    // threads special hidden text
    if (extraSrc && extraSrc.includes('threads')) {
      hid.textContent = '她不是失蹤，她只是還在線上。';
      setTimeout(() => hid.classList.add('reveal'), 4000);
    }
    lbEl.style.display = 'flex';
    return;
  }

  if (type === 'k') {
    // 第二次以後看到有人版，製造「她出現了」效果
    const src = lbViewCount[type] >= 2 ? 'img/scenes/tunnel_figure.jpg' : 'img/scenes/tunnel_empty.jpg';
    imgEl.src = src;
    document.getElementById('lb-cap').textContent = '萬華地下道 · K 傳送';
    det.textContent = '⚠ 時間戳異常：03:17 AM（當前 02:13 AM）';
    setTimeout(() => det.classList.add('show'), 900);
    if (lbViewCount[type] >= 2) {
      hid.textContent = '林雨晴最後出現在這裡';
      setTimeout(() => hid.classList.add('reveal'), 2500);
      // 悄悄換掉聊天室裡的泡泡圖片
      const bubble = document.getElementById('k-photo-bubble');
      if (bubble) { const bi = bubble.querySelector('img'); if (bi) bi.src = 'img/scenes/tunnel_figure.jpg'; }
    } else {
      hid.textContent = '不要回頭';
      setTimeout(() => hid.classList.add('reveal'), 3500);
    }
  } else if (type === 'cctv') {
    imgEl.src = 'img/scenes/tunnel_cctv.jpg';
    imgEl.style.cssText += ';filter:brightness(.8) saturate(.35) contrast(1.1)';
    document.getElementById('lb-cap').textContent = '監視器畫面 · CAM 07 · 林雨晴失蹤當晚';
    det.textContent = '⚠  2024/06/02  03:17:23  —  她在回頭看';
    setTimeout(() => det.classList.add('show'), 700);
    hid.textContent = '她已經站在那裡 3 小時了';
    setTimeout(() => hid.classList.add('reveal'), 4000);
    if (lbViewCount[type] === 1) { addSync(2); gToast('+2% 同步率'); }
    else if (lbViewCount[type] >= 3) { addSync(1); gToast('+1% 同步率'); }
  } else if (type === 'room') {
    imgEl.src = 'img/scenes/room_eva.jpg';
    imgEl.style.cssText += ';filter:brightness(.75)';
    const futMin = clockMin + 3;
    document.getElementById('lb-cap').textContent = '你的房間 · 拍攝時間：未來 +3分鐘';
    det.textContent = '⚠ 0' + clockHour + ':' + (futMin < 10 ? '0' + futMin : futMin) + ' AM  —  她在你後面';
    setTimeout(() => det.classList.add('show'), 700);
    hid.textContent = '不要回頭';
    setTimeout(() => hid.classList.add('reveal'), 2000);
    if (lbViewCount[type] === 1) { addSync(2); gToast('+2% 同步率'); }
    else if (lbViewCount[type] >= 3) { addSync(1); gToast('+1% 同步率'); }
  } else if (type === 'rain') {
    imgEl.src = 'img/rain/rain_glitch2.jpg';
    imgEl.style.cssText += ';filter:brightness(.75) saturate(.7)';
    document.getElementById('lb-cap').textContent = '深夜雨街 · 林雨晴失蹤前';
    det.textContent = '⚠ 她已經站在那裡 3 小時了';
    setTimeout(() => det.classList.add('show'), 1200);
    hid.textContent = '她在等';
    setTimeout(() => hid.classList.add('reveal'), 5000);
    if (lbViewCount[type] === 1) { addSync(2); gToast('+2% 同步率'); }
  } else if (type === 'rain_tunnel') {
    imgEl.src = 'img/rain/rain_tunnel.jpg';
    imgEl.style.cssText += ';filter:brightness(.7)';
    document.getElementById('lb-cap').textContent = '地下道自拍 · 林雨晴';
    det.textContent = '⚠ 牆上有字';
    setTimeout(() => det.classList.add('show'), 1000);
    hid.textContent = 'Echo';
    setTimeout(() => hid.classList.add('reveal'), 2500);
  } else if (type === 'room_white') {
    imgEl.src = 'img/scenes/room_white.jpg';
    imgEl.style.cssText += ';filter:brightness(.98)';
    document.getElementById('lb-cap').textContent = '同步空間 · ECHO';
    det.textContent = 'SYNCHRONIZATION COMPLETE';
    det.style.color = '#9933ff';
    setTimeout(() => det.classList.add('show'), 1200);
    hid.textContent = '歡迎回家。';
    hid.style.cssText = 'margin-top:1rem;background:#f0f0f8;color:#f0f0f8;font-size:.75rem;padding:.5rem;border-radius:6px;font-family:monospace;transition:color 2.5s;text-align:center';
    setTimeout(() => { hid.style.color = '#9933ff'; }, 3000);
    if (lbViewCount[type] === 1) { addSync(2); gToast('+2% 同步率'); }
  }

  lbEl.style.display = 'flex';
}

// ═══════════════════════════════════════════════════════
//  CHAPTER FLOW HELPERS
// ═══════════════════════════════════════════════════════
function addFileCard(tag, tagClass, title, sub, key, avType) {
  const row = document.createElement('div'); row.className = 'brow'; row.appendChild(mkAv(avType || 'k'));
  const wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;flex-direction:column;max-width:100%';
  const card = document.createElement('div'); card.className = 'fc';
  card.innerHTML = '<div class="fch">ECHO 附件</div><div class="fcb"><div class="fct">' + title + '</div><div class="fcs">' + sub + '</div><span class="fctag ' + tagClass + '">' + tag + '</span></div>';
  // doc image keys open lightbox with real image
  const docImgMap = { news: 'img/docs/news.jpg', ptt: 'img/docs/ptt.jpg', thread: 'img/docs/threads.jpg' };
  card.onclick = () => {
    trackFile();
    if (key === 'cctv') { openLB('cctv'); }
    else if (key === 'rain-photo') { openLB('rain'); }
    else if (docImgMap[key]) { openLB('doc', docImgMap[key], title); }
    else { gToast('已閱讀：' + title); }
  };
  wrap.appendChild(card); row.appendChild(wrap); chatBody.appendChild(row); scrollBottom();
}

function trackFile() {
  filesViewed++;
  if (filesViewed === 4) { addSync(2); gToast('+2% 同步率（完整查看）'); }
}

async function fadeOut() {
  stopStoryAudio();
  const app = document.getElementById('app');
  const sb = document.getElementById('sync-bar');
  app.style.transition = 'opacity 1.5s'; app.style.opacity = '0';
  sb.style.transition = 'opacity 1.5s'; sb.style.opacity = '0';
  await sleep(1600);
  app.style.display = 'none'; sb.style.display = 'none';
}

function showEnd(chName) {
  const ev = getSyncEval(currentChapter);
  completedChapters[currentChapter] = chapterSync;
  totalSync = Math.min(100, totalSync + chapterSync);
  saveProgress();

  // ── 第四章結束後依同步率分流 ──
  const isCh4 = currentChapter === '4-1' || currentChapter === '4-2';
  if (isCh4) {
    if (totalSync <= 33) {
      // 路線一：假結局《離線》
      document.getElementById('chapter-end').style.display = 'none';
      setTimeout(() => {
        document.getElementById('app').style.opacity = '1';
        document.getElementById('app').style.display = 'flex';
        document.getElementById('sync-bar').style.display = 'flex';
        document.getElementById('sync-bar').style.opacity = '1';
        chatBody.innerHTML = '';
        chatBody.appendChild(typingEl);
        currentChapter = 'end_normal';
        chapterSync = 0;
        if (window.CHAPTERS && window.CHAPTERS['end_normal']) window.CHAPTERS['end_normal']();
      }, 2000);
      return;
    }
    if (totalSync >= 67) {
      // 路線三：直接進入第五章
      document.getElementById('chapter-end').style.display = 'none';
      setTimeout(() => {
        document.getElementById('app').style.opacity = '1';
        document.getElementById('app').style.display = 'flex';
        document.getElementById('sync-bar').style.display = 'flex';
        document.getElementById('sync-bar').style.opacity = '1';
        chatBody.innerHTML = '';
        chatBody.appendChild(typingEl);
        currentChapter = '5';
        chapterSync = 0;
        if (window.CHAPTERS && window.CHAPTERS['5']) window.CHAPTERS['5']();
      }, 2000);
      return;
    }
  }

  const isWhite = currentChapter === '5';
  const endEl = document.getElementById('chapter-end');
  endEl.className = isWhite ? 'white-end' : '';
  endEl.style.display = 'flex';
  document.getElementById('ce-title').textContent = '章節完';
  document.getElementById('ce-name').textContent = chName;
  document.getElementById('ce-name').style.color = isWhite ? '#333' : '#fff';

  // 第四章結算畫面顯示下一步路線提示
  let routeHint = '';
  if (isCh4) {
    if (totalSync <= 33)      routeHint = ''; // 已被上面攔截
    else if (totalSync <= 66) routeHint = '<div style="font-size:.65rem;color:#2299aa;letter-spacing:.1em;margin-top:.8rem">→ 路線二：《循環在線》<br>同步率 34～66%</div>';
    else                      routeHint = '<div style="font-size:.65rem;color:#9933ff;letter-spacing:.1em;margin-top:.8rem">→ 路線三：第五章《ECHO》已解鎖<br>同步率 ' + totalSync + '%</div>';
  }

  setTimeout(() => {
    document.getElementById('ce-sn').textContent = chapterSync + '%';
    document.getElementById('ce-sbf').style.width = Math.round(chapterSync / SYNC_MAX * 100) + '%';
    const msgEl = document.getElementById('ce-msg');
    msgEl.className = 'ce-msg' + (isWhite ? ' white-msg' : '');
    const evalSpeaker = ['2-2', '3-2'].includes(currentChapter) ? '林雨晴' : currentChapter === '3-3' ? 'K' : 'EVA';
    msgEl.innerHTML = '<b>' + evalSpeaker + '</b>：' + ev.q + '<br><span style="font-size:.65rem;color:#555;letter-spacing:.1em">[' + ev.lv + ']</span>' + routeHint;
    document.getElementById('ce-next').textContent = '累積同步率：' + totalSync + '%';
  }, 800);
}

// ═══════════════════════════════════════════════════════
//  BUILD MODE + CHAPTER SELECT UI
// ═══════════════════════════════════════════════════════
const ECHO_CHAPTER_IDS = ['1-1', '2-1', '2-2', '3-1', '3-2', '3-3', '4-1', '4-2', '5', 'origin'];

function getPlayerUnlocks() {
  const t = totalSync;
  const ch1Done = completedChapters['1-1'] !== undefined;
  const ch2Done = completedChapters['2-1'] !== undefined || completedChapters['2-2'] !== undefined;
  const ch3Done = completedChapters['3-1'] !== undefined || completedChapters['3-2'] !== undefined || completedChapters['3-3'] !== undefined;
  const ch32Done = completedChapters['3-2'] !== undefined;
  const ch32AdminVerified = storyFlags.ch32AdminVerified === true;
  const ch4Done = completedChapters['4-1'] !== undefined || completedChapters['4-2'] !== undefined;
  return {
    '1-1': true,
    '2-1': ch1Done && !ch2Done && t >= 11,
    '2-2': ch1Done && !ch2Done && t < 11,
    '3-1': ch2Done && !ch3Done && t >= 16,
    '3-2': ch2Done && !ch3Done && t >= 8 && t <= 15,
    '3-3': ch2Done && !ch3Done && t >= 5 && t <= 10,
    // CH3-2 is a route judgment game: finding the moderator preserves the high-sync route;
    // failing it forces the low-sync CH4 route regardless of accumulated sync.
    '4-1': ch3Done && !ch4Done && (ch32Done ? ch32AdminVerified : t >= 33),
    '4-2': ch3Done && !ch4Done && (ch32Done ? !ch32AdminVerified : (t >= 18 && t <= 66)),
    '5': ch4Done && t >= 50,
    // Bonus origin chapter unlocks only after the true 100% Season 1 completion.
    'origin': completedChapters['5'] !== undefined && t >= 100
  };
}

function isChapterUnlocked(ch) {
  if (!ECHO_CHAPTER_IDS.includes(ch)) return false;
  if (echoMode === 'engineer') return !!(window.CHAPTERS && window.CHAPTERS[ch]);
  if (echoMode !== 'player') return false;
  const unlocks = getPlayerUnlocks();
  return !!unlocks[ch] || completedChapters[ch] !== undefined;
}

async function chooseGameMode(mode, event) {
  if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
  if (mode !== 'player' && mode !== 'engineer') return;

  echoMode = mode;
  chapterSync = 0;
  currentChapter = '';
  if (mode === 'player') {
    loadProgress();
  } else {
    totalSync = 0;
    completedChapters = {};
    storyFlags = {};
  }

  const title = document.getElementById('title-screen');
  title.style.opacity = '0';
  title.style.transition = 'opacity .45s';
  await sleep(450);
  title.style.display = 'none';
  title.style.opacity = '1';
  document.getElementById('chapter-select').style.display = 'flex';
  updateChapterSelectUI();
}

function returnToModeSelect() {
  stopStoryAudio();
  cancelActiveWidget('mode_select');
  document.getElementById('chapter-select').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.getElementById('sync-bar').style.display = 'none';
  document.getElementById('chapter-end').style.display = 'none';
  const title = document.getElementById('title-screen');
  title.style.display = 'flex';
  title.style.opacity = '1';
  echoMode = null;
  currentChapter = '';
  chapterSync = 0;
}

function updateChapterSelectUI() {
  const playerUnlocks = getPlayerUnlocks();
  const engineering = echoMode === 'engineer';

  ECHO_CHAPTER_IDS.forEach((ch) => {
    const el = document.getElementById('cs-' + ch);
    if (!el) return;
    const unlocked = engineering ? !!(window.CHAPTERS && window.CHAPTERS[ch]) : isChapterUnlocked(ch);
    el.classList.toggle('locked', !unlocked);
    el.setAttribute('aria-disabled', unlocked ? 'false' : 'true');
    el.title = unlocked ? '' : '此章節尚未解鎖';

    const syncEl = document.getElementById('cs-sync-' + ch);
    if (!syncEl) return;
    if (engineering) syncEl.textContent = 'TEST';
    else if (ch === 'origin' && completedChapters[ch] !== undefined) syncEl.textContent = '完成 ✓';
    else if (completedChapters[ch] !== undefined) syncEl.textContent = completedChapters[ch] + '% ✓';
    else if (ch === '1-1') syncEl.textContent = '開始';
    else if (playerUnlocks[ch]) syncEl.textContent = '解鎖';
    else syncEl.textContent = '🔒';
  });

  const badge = document.getElementById('cs-mode-badge');
  const note = document.getElementById('cs-mode-note');
  if (badge) {
    badge.textContent = engineering ? 'ENGINEERING' : 'PLAYER';
    badge.className = 'cs-mode-badge ' + (engineering ? 'engineer' : 'player');
  }
  if (note) {
    note.textContent = engineering
      ? '工程版：所有已實作章節全開；測試結果不會寫入玩家存檔。'
      : '玩家版：依累積同步率、路線條件與已完成進度解鎖；鎖定章節不可直接進入。';
  }

  const tot = document.getElementById('cs-total');
  if (tot) {
    tot.innerHTML = engineering
      ? '工程測試模式 · <b>全章節開放</b>'
      : '累積同步率：<b>' + totalSync + '%</b>';
  }
}

function goChapterSelect() {
  stopStoryAudio();
  cancelActiveWidget('chapter_select');
  document.getElementById('chapter-end').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.getElementById('sync-bar').style.display = 'none';
  document.getElementById('chapter-select').style.display = 'flex';
  updateChapterSelectUI();
}

function startChapter(ch) {
  stopStoryAudio();
  if (!isChapterUnlocked(ch)) {
    if (echoMode === 'player') gToast('🔒 此章節尚未解鎖');
    return false;
  }
  cancelActiveWidget('start_chapter');
  document.getElementById('chapter-select').style.display = 'none';
  currentChapter = ch;
  chapterSync = 0; backCount = 0; filesViewed = 0; lbViewCount = {};
  clearTimeout(silTimer);
  const app = document.getElementById('app');
  const sb = document.getElementById('sync-bar');
  app.style.display = 'flex'; app.style.opacity = '1';
  sb.style.display = 'flex'; sb.style.opacity = '1';
  const chapterStartMinute = ch === '1-1' ? '13' : ch === '2-2' ? '58' : '41';
  chatBody.innerHTML = '<div class="tlbl">凌晨 02:' + chapterStartMinute + '</div>';
  chatBody.className = '';
  chatBody.style.background = '';
  chatBody.style.filter = '';
  optionsArea.innerHTML = '';
  chatBody.appendChild(typingEl);
  updateSyncUI();
  document.getElementById('back-btn').onclick = () => {
    backCount++;
    if (backCount >= 3) { subSync(2); gToast('−2% 同步率（抵抗）'); backCount = 0; }
    glitch();
  };
  setTimeout(() => { if (window.CHAPTERS && window.CHAPTERS[ch]) window.CHAPTERS[ch](); }, 500);
}

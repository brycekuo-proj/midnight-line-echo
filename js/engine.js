// ═══════════════════════════════════════════════════════
//  GLOBAL STATE
// ═══════════════════════════════════════════════════════
const SYNC_MAX = 20;
let totalSync = 0;
let chapterSync = 0;
let currentChapter = '';
let completedChapters = {};
let backCount = 0, filesViewed = 0, silTimer = null, silTriggered = false;
let lbViewCount = {};

function loadProgress() {
  try {
    const s = localStorage.getItem('echo_progress');
    if (s) { const d = JSON.parse(s); totalSync = d.t || 0; completedChapters = d.c || {}; }
  } catch(e) {}
}
function saveProgress() {
  try { localStorage.setItem('echo_progress', JSON.stringify({ t: totalSync, c: completedChapters })); } catch(e) {}
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
    '2-2': [[5,'林雨晴：「……你還是不相信我。」','強抵抗'],[10,'林雨晴：「你開始記起什麼了嗎？」','調查傾向'],[15,'林雨晴：「你的臉，我一直記得……」','高沉浸'],[18,'林雨晴：「你開始懷疑自己了。那就對了。」','高認知污染']],
    '3-1': [[5,'「你還在抗拒記憶……」','強抵抗'],[10,'「聊天室開始活過來了。」','調查傾向'],[15,'「你已經分不清哪些是自己說的了。」','高沉浸'],[20,'「我比你更了解你自己。」','高依附']],
    '3-2': [[5,'「你太快想離開了。」','低污染'],[10,'「你開始在乎聊天室了。」','調查沉浸'],[15,'「你快忘記怎麼離線了。」','高沉浸'],[20,'「歡迎留下來。」','在線同步']],
    '3-3': [[5,'K：「你還在嗎？」','低污染'],[10,'K：「第三個呼吸……你聽到了嗎？」','聲音沉浸'],[15,'K：「你快分不清耳機和現實了……」','高聽覺污染'],[20,'K：「它現在說的和你一模一樣。」','現實同步']],
    '4-1': [[5,'「你還在掙扎。」','低同步'],[10,'「你的記憶開始動搖了。」','認知污染'],[15,'「鏡子裡的那個……也越來越像你了。」','人格重疊'],[20,'「我們早就是同一個人了。」','高同步人格侵蝕']],
    '4-2': [[5,'「你想逃開聊天室。」','低同步'],[10,'「你開始覺得現實很吵了。」','在線污染'],[15,'「你的房間……我已經記住了。」','現實同步'],[20,'「找到你了。」','高同步在線']],
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

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
function scrollBottom() { chatBody.scrollTop = chatBody.scrollHeight; }

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
  const img = document.createElement('img');
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
  if (type === 'eva') {
    img.src = 'img/eva/eva_normal.jpg';
    img.id = 'av-img-eva-' + Date.now();
  } else if (type === 'rain') {
    img.src = 'img/rain/rain_normal.jpg';
  } else if (type === 'k') {
    img.src = 'img/k/k_normal.jpg';
    img.id = 'av-img-k-' + Date.now();
    const dot = document.createElement('div'); dot.className = 'odot od-unk'; d.appendChild(dot);
  } else if (type === 'unk') {
    d.textContent = '?';
    return d;
  }
  if (type !== 'unk') d.appendChild(img);
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
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;border-radius:50%';
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
      this.classList.toggle('playing');
      const tr = this.querySelector('.audio-tr');
      if (this.classList.contains('playing')) {
        tr.style.display = 'block';
        if (tr.dataset.txt) tr.innerHTML = tr.dataset.txt;
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
function clearOpts() { optionsArea.innerHTML = ''; }

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
      if (o.sync >= 4) { await sleep(600); gToast('EVA 對你的興趣明顯提升'); }
      cb(i, o.text, o.sync);
    };
    optionsArea.appendChild(btn);
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
function openLB(type) {
  lbViewCount[type] = (lbViewCount[type] || 0) + 1;
  const lbEl = document.getElementById('lightbox');
  const imgEl = document.getElementById('lb-img');
  const det = document.getElementById('lb-det');
  const hid = document.getElementById('lb-hid');
  det.classList.remove('show');
  hid.className = 'lb-hid';
  imgEl.style.cssText = 'max-width:100%;max-height:72vh;object-fit:contain;border-radius:8px';

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
  card.onclick = () => { trackFile(); if (key === 'cctv' || key === 'rain-photo') openLB(key === 'rain-photo' ? 'rain' : 'cctv'); else gToast('已閱讀：' + title); };
  wrap.appendChild(card); row.appendChild(wrap); chatBody.appendChild(row); scrollBottom();
}

function trackFile() {
  filesViewed++;
  if (filesViewed === 4) { addSync(2); gToast('+2% 同步率（完整查看）'); }
}

async function fadeOut() {
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
  const isWhite = currentChapter === '5';
  const endEl = document.getElementById('chapter-end');
  endEl.className = isWhite ? 'white-end' : '';
  endEl.style.display = 'flex';
  document.getElementById('ce-title').textContent = '章節完';
  document.getElementById('ce-name').textContent = chName;
  document.getElementById('ce-name').style.color = isWhite ? '#333' : '#fff';
  setTimeout(() => {
    document.getElementById('ce-sn').textContent = chapterSync + '%';
    document.getElementById('ce-sbf').style.width = Math.round(chapterSync / SYNC_MAX * 100) + '%';
    const msgEl = document.getElementById('ce-msg');
    msgEl.className = 'ce-msg' + (isWhite ? ' white-msg' : '');
    msgEl.innerHTML = '<b>EVA</b>：' + ev.q + '<br><span style="font-size:.65rem;color:#555;letter-spacing:.1em">[' + ev.lv + ']</span>';
    document.getElementById('ce-next').textContent = '累積同步率：' + totalSync + '%';
  }, 800);
}

// ═══════════════════════════════════════════════════════
//  CHAPTER SELECT UI
// ═══════════════════════════════════════════════════════
function updateChapterSelectUI() {
  const t = totalSync;
  const unlocks = {
    '2-1': t >= 11, '2-2': t < 11,
    '3-1': t >= 16, '3-2': t >= 8 && t <= 15, '3-3': t >= 5 && t <= 10,
    '4-1': t >= 33, '4-2': t >= 18 && t <= 66,
    '5': t >= 50
  };
  for (const [ch, unlocked] of Object.entries(unlocks)) {
    const el = document.getElementById('cs-' + ch);
    if (!el) continue;
    el.classList.toggle('locked', !(unlocked || completedChapters[ch] !== undefined));
    const syncEl = document.getElementById('cs-sync-' + ch);
    if (syncEl) {
      if (completedChapters[ch] !== undefined) syncEl.textContent = completedChapters[ch] + '% ✓';
      else if (unlocked) syncEl.textContent = '解鎖';
      else syncEl.textContent = '🔒';
    }
  }
  const s11 = document.getElementById('cs-sync-1-1');
  if (s11) s11.textContent = completedChapters['1-1'] !== undefined ? completedChapters['1-1'] + '% ✓' : '開始';
  const tot = document.getElementById('cs-total');
  if (tot) tot.innerHTML = '累積同步率：<b>' + totalSync + '%</b>';
}

function goChapterSelect() {
  document.getElementById('chapter-end').style.display = 'none';
  document.getElementById('app').style.display = 'none';
  document.getElementById('sync-bar').style.display = 'none';
  document.getElementById('chapter-select').style.display = 'flex';
  updateChapterSelectUI();
}

function startChapter(ch) {
  document.getElementById('chapter-select').style.display = 'none';
  currentChapter = ch;
  chapterSync = 0; backCount = 0; filesViewed = 0; lbViewCount = {};
  clearTimeout(silTimer);
  const app = document.getElementById('app');
  const sb = document.getElementById('sync-bar');
  app.style.display = 'flex'; app.style.opacity = '1';
  sb.style.display = 'flex'; sb.style.opacity = '1';
  chatBody.innerHTML = '<div class="tlbl">凌晨 02:' + (['1-1', '2-2'].includes(ch) ? '13' : '41') + '</div>';
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

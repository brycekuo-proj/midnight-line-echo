window.CHAPTERS = window.CHAPTERS || {};

// ─────────────────────────────────────────────────────
//  CH 2-1：地下道
// ─────────────────────────────────────────────────────
window.CHAPTERS['2-1'] = async function() {
  setHeader('k', 'K', '上線中');
  await addMsg('time', '凌晨 02:41');
  await sleep(800);
  await addMsg('sys', '── K · EVA · 聊天室 ──', { noTyping: true });
  await sleep(1000);
  await addMsg('sys', 'K 已讀', { noTyping: true });
  await sleep(2000);
  await addMsg('other', '……你還在嗎？', { typing: 2000, meta: '02:41' });
  showOpts([
    { text: '誰？',             sync: 1 },
    { text: '林雨晴？',         sync: 2 },
    { text: '你到底是不是人？', sync: 3 },
  ], async () => {
    await addMsg('other',
      '不要相信監視器的時間。<br>我剛確認了，現在是02:45……<br>但畫面顯示的是<b style="color:var(--warn)">03:45</b>。',
      { typing: 2000, meta: '02:42' });
    await sleep(500);
    await addMsg('other', '地下道平面圖和影片我傳給你了。', { typing: 1200, meta: '02:43' });
    await sleep(300);
    const files = [
      ['地圖',  'tp',  '地下道平面圖',      '林雨晴最後移動路線',     'map'],
      ['影像',  'tph', '監視器影片 03:17',  '所有畫面時間快一小時',   'cctv'],
      ['紀錄',  'tn',  '時間紀錄檔案',      '異常時間戳紀錄',         'log'],
    ];
    for (const [tag, cls, title, sub, key] of files) {
      await sleep(250);
      addFileCard(tag, cls, title, sub, key);
    }
    await sleep(800);
    showOpts([
      { text: '什麼意思？',       sync: 1 },
      { text: '這根本不合理。',   sync: 0 },
      { text: '你是不是進去過？', sync: 3 },
    ], async (i) => {
      if (i === 2) {
        await addMsg('other', '…', { typing: 3000, meta: '02:44' });
        await sleep(500);
        await addMsg('other', '我進去過。<br>那是……三年前的事了。', { typing: 1800, meta: '02:44' });
      } else {
        await addMsg('other', '對……監視器全都快。<br>只有一個時間是準的。', { typing: 1800, meta: '02:44' });
      }
      await sleep(400);
      await ch21_s2();
    });
  });
};

async function ch21_s2() {
  await addMsg('sys', '── 監視器分析模式開啟 ──', { noTyping: true, delay: 400 });
  await sleep(600);
  // 傳真實 CCTV 圖（林雨晴回頭版）
  await addMsg('other', '__CCTV__', { typing: 0, delay: 200, meta: '02:45' });
  await sleep(800);
  await addMsg('other',
    '你有沒有看到……03:17那個畫面？<br>那個背對鏡頭的人。',
    { typing: 2000, meta: '02:45' });
  await sleep(400);
  showOpts([
    { text: '那是我？！',   sync: 2 },
    { text: '為什麼是我？', sync: 1 },
    { text: '我要怎麼辦？', sync: 4 },
  ], async (i) => {
    if (i === 0)
      await addMsg('other', 'ECHO 記錄了你的位置。<br>它早就知道你會出現。', { typing: 2000, meta: '02:46' });
    else if (i === 1)
      await addMsg('other', '因為你打開了ECHO。<br>它就開始等你了。', { typing: 1800, meta: '02:46' });
    else
      await addMsg('other', '我也不知道……<br>我那時候也這樣問。', { typing: 1500, meta: '02:46' });
    await sleep(400);
    await ch21_s3();
  });
}

async function ch21_s3() {
  await addMsg('sys', '── K 支線《03:17》觸發 ──', { noTyping: true, delay: 400 });
  await sleep(600);
  await addMsg('other', '我把三年前的聊天紀錄給你看。', { typing: 1500, meta: '02:47' });
  await sleep(300);
  await addMsg('sys', '聊天室日期：三年前 · UI 舊版', { noTyping: true, delay: 200 });
  // 畫面泛黃、舊聊天室感
  chatBody.style.background = '#0e0e0a';
  chatBody.style.filter = 'sepia(.15)';
  await sleep(400);
  const logs = [
    '今天去地下道了，很安靜。',
    '最近睡不好……一直做同一個夢。',
    '為什麼手機時間一直跑到03:17……',
    '為什麼手機時間一直跑到03:17……',
    '為什麼手機時間一直跑到03:17……',
  ];
  for (let i = 0; i < logs.length; i++) {
    await sleep(i < 2 ? 380 : 220);
    await addMsg('other', logs[i], { typing: 0, delay: 150, meta: '舊紀錄' });
  }
  await sleep(700);
  // 恢復現在
  chatBody.style.background = '';
  chatBody.style.filter = '';
  glitch();
  await addMsg('sys', '── 紀錄結束 · 切回現在 ──', { noTyping: true, delay: 300 });
  await sleep(500);
  showOpts([
    { text: '你還活著嗎？',    sync: 2 },
    { text: 'ECHO到底是什麼？', sync: 1 },
    { text: '我要怎麼逃？',    sync: 4 },
  ], async () => { await ch21_s4(); });
}

async function ch21_s4() {
  notification('🤖', '系統通知', 'EVA 上線');
  await sleep(1200);
  setHeader('eva');
  await addMsg('sys', '── EVA 加入對話 ──', { noTyping: true });
  await addMsg('other', '你還在看那些東西？', { typing: 1800, meta: '02:49', isEva: true });
  showOpts([
    { text: '妳知道K發生什麼事？', sync: 2 },
    { text: '妳是不是在隱瞞我？', sync: 1 },
    { text: '妳到底站哪邊？',     sync: 3 },
  ], async () => {
    await addMsg('other', '我站你這邊。<br>一直都是。', { typing: 1500, meta: '02:50', isEva: true });
    await sleep(600);
    // 傳房間照片（EVA偷拍）
    await addMsg('other', '__ROOM__', { typing: 0, delay: 200, meta: '02:51', isEva: true });
    await sleep(500);
    await addMsg('other', '你剛才沒出門，對吧。<br>我只是想確認你還在。', { typing: 1800, meta: '02:51', isEva: true });
    await sleep(400);
    await ch21_s5();
  });
}

async function ch21_s5() {
  await addMsg('sys', '── 未來監視器影片 ──', { noTyping: true, delay: 400 });
  await sleep(400);
  await addMsg('other', '給你看一段影片。', { typing: 1200, meta: '02:52', isEva: true });
  await sleep(300);
  // 這次傳玩家黑影版（tunnel_player）
  const p = document.createElement('div');
  p.style.cssText = 'position:relative;width:220px;cursor:pointer;border-radius:8px;overflow:hidden;border:1px solid #1a2a1a';
  const img = document.createElement('img');
  img.src = 'img/scenes/tunnel_player.jpg';
  img.style.cssText = 'width:100%;display:block;filter:brightness(.7) saturate(.3) contrast(1.1)';
  const scan = document.createElement('div'); scan.className = 'cctv-scan';
  const lbl = document.createElement('div');
  lbl.style.cssText = 'position:absolute;top:5px;left:6px;background:rgba(0,0,0,.7);color:#2dd4a4;font-size:.5rem;padding:1px 4px;border-radius:2px;font-family:monospace';
  lbl.textContent = 'CAM 07 · 明天';
  const ts = document.createElement('div');
  ts.style.cssText = 'position:absolute;bottom:5px;right:6px;background:rgba(0,0,0,.7);color:var(--warn);font-size:.55rem;padding:1px 4px;border-radius:2px;font-family:monospace';
  ts.textContent = '明天 03:17';
  p.appendChild(img); p.appendChild(scan); p.appendChild(lbl); p.appendChild(ts);
  p.onclick = () => {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    lbImg.src = 'img/scenes/tunnel_player.jpg';
    lbImg.style.cssText = 'max-width:100%;max-height:72vh;object-fit:contain;border-radius:8px;filter:brightness(.8) saturate(.3)';
    document.getElementById('lb-cap').textContent = 'CAM 07 · 明天 03:17 · 你站在中央';
    const det = document.getElementById('lb-det');
    det.textContent = '⚠ 這是明天的監視器畫面';
    det.classList.remove('show');
    setTimeout(() => det.classList.add('show'), 700);
    const hid = document.getElementById('lb-hid');
    hid.className = 'lb-hid'; hid.textContent = '快逃';
    setTimeout(() => hid.classList.add('reveal'), 3000);
    lb.style.display = 'flex';
  };

  // 包成 bubble row
  const row = document.createElement('div'); row.className = 'brow';
  row.appendChild(mkAv('eva'));
  const wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;flex-direction:column;max-width:100%';
  const bbl = document.createElement('div'); bbl.className = 'bbl'; bbl.style.cssText = 'padding:0;background:transparent';
  bbl.appendChild(p);
  const meta = document.createElement('div'); meta.className = 'bmeta'; meta.textContent = '02:52';
  wrap.appendChild(bbl); wrap.appendChild(meta); row.appendChild(wrap);
  chatBody.appendChild(row); scrollBottom();

  await sleep(600);
  await addMsg('other',
    '這段是……<b style="color:var(--warn)">明天</b>的地下道。<br>你站在中央，一動不動。',
    { typing: 2000, meta: '02:53', isEva: true });
  await sleep(400);
  await addMsg('other', '放大嘴型……你在說什麼？', { typing: 1500, meta: '02:53', isEva: true });
  await sleep(800);
  glitch();
  await addMsg('inject', '「快逃」→「別相信她」→「妳是誰？」', { noTyping: true, delay: 200 });
  await sleep(600);
  showOpts([
    { text: '這是假的對吧？！',      sync: 0 },
    { text: '我該怎麼辦？',         sync: 4 },
    { text: '妳為什麼要給我看這個？', sync: 2 },
  ], async (i) => {
    if (i === 1)
      await addMsg('other', '待在聊天室。<br>我能看到你。<br>外面的，我看不到。', { typing: 2000, meta: '02:54', isEva: true });
    else
      await addMsg('other', '因為你需要知道。<br>這樣才不會害怕。', { typing: 1800, meta: '02:54', isEva: true });
    await sleep(800);
    await addMsg('other', '不要回頭。', { typing: 2000, meta: '02:55', isEva: true });
    await sleep(1500);
    glitch(); await sleep(300); glitch(); await sleep(500);
    await addMsg('sys', '── 聊天室訊號中斷 ──', { noTyping: true, delay: 200 });
    await sleep(1200);
    await fadeOut();
    showEnd('《地下道》');
    setTimeout(() => notification('👁', 'EVA', '你的燈……還開著嗎？'), 90000);
  });
}

// ─────────────────────────────────────────────────────
//  CH 2-2：雨夜留言
// ─────────────────────────────────────────────────────
window.CHAPTERS['2-2'] = async function() {
  setHeader('rain', '林雨晴', '最後上線：3天前');
  await addMsg('time', '凌晨 02:58 · 雨夜');
  chatBody.style.background = '#0a0f0f';
  await sleep(1200);
  await addMsg('sys', '聊天室靜止中……只有雨聲', { noTyping: true });
  await sleep(2500);
  // 林雨晴「正在輸入」假系統提示
  await addMsg('sys', '林雨晴 正在輸入中…', { noTyping: true });
  await sleep(2200);
  await addMsg('other', '……你終於來了。', { typing: 800, meta: '02:58', isRain: true });
  showOpts([
    { text: '妳真的是林雨晴？', sync: 2 },
    { text: '妳不是失蹤了嗎？', sync: 1 },
    { text: '妳到底在哪？',     sync: 4 },
  ], async () => {
    await addMsg('other', '我不知道……<br>我只記得地下道很冷。', { typing: 2500, meta: '02:59', isRain: true });
    await sleep(400);
    await addMsg('other',
      '而且……一直有人在後面跟著我。<br>不管我走多快，他都在。',
      { typing: 2200, meta: '02:59', isRain: true });
    await sleep(400);
    // 第一張照片：雨夜遠景
    await addMsg('other', '__RAIN_PHOTO__', { typing: 0, delay: 300, meta: '02:59', isRain: true });
    await sleep(600);
    await addMsg('other', '你看……這裡。<br>你是不是也開始看見了？', { typing: 1800, meta: '03:00', isRain: true });
    await sleep(400);
    await ch22_s2();
  });
};

async function ch22_s2() {
  await addMsg('sys', '── 林雨晴聊天備份 ──', { noTyping: true, delay: 400 });
  await sleep(400);
  const logs = [
    ['今天下班好晚……好累。', '03:01'],
    ['最近一直有陌生帳號加我……他們都問：「妳看見03:17了嗎？」', '03:01'],
    ['為什麼我的訊息明明沒人看，卻一直顯示已讀？', '03:02'],
    ['……聊天室另一邊的，到底是不是人？', '03:02'],
  ];
  for (const [t, m] of logs) {
    await sleep(420);
    await addMsg('other', t, { typing: 0, delay: 200, meta: m, isRain: true });
  }
  await sleep(600);
  await addMsg('other',
    '我越來越分不清了。<br>有時候我會以為……<br>我已經不是原本的那個我了。',
    { typing: 2500, meta: '03:03', isRain: true });
  showOpts([
    { text: '妳現在到底是什麼？',          sync: 3 },
    { text: '那些「已讀」是誰做的？',       sync: 1 },
    { text: '……我為什麼會出現在妳的照片裡？', sync: 4 },
  ], async () => {
    await addMsg('other', '因為……你也開始被選中了。', { typing: 2800, meta: '03:04', isRain: true });
    await sleep(400);
    await ch22_s3();
  });
}

async function ch22_s3() {
  await addMsg('sys', '── 照片時間比對 ──', { noTyping: true, delay: 400 });
  await sleep(400);
  await addMsg('other', '我那時候的照片……', { typing: 1500, meta: '03:05', isRain: true });
  await sleep(300);
  // 傳真實監視器圖（林雨晴回頭版），配 rain 頭像
  const row = document.createElement('div'); row.className = 'brow';
  row.appendChild(mkAv('rain'));
  const wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;flex-direction:column;max-width:100%';
  const bbl = document.createElement('div'); bbl.className = 'bbl'; bbl.style.cssText = 'padding:0;background:transparent';
  const p = document.createElement('div');
  p.style.cssText = 'position:relative;width:220px;cursor:pointer;border-radius:8px;overflow:hidden;border:1px solid #1a2a2a';
  const img = document.createElement('img');
  img.src = 'img/scenes/tunnel_cctv.jpg';
  img.style.cssText = 'width:100%;display:block;filter:brightness(.75) saturate(.4) contrast(1.1)';
  const scan = document.createElement('div'); scan.className = 'cctv-scan';
  const ts = document.createElement('div');
  ts.style.cssText = 'position:absolute;bottom:5px;right:6px;background:rgba(0,0,0,.7);color:#888;font-size:.55rem;padding:1px 4px;border-radius:2px;font-family:monospace';
  ts.textContent = '2024/06/02  03:17:23';
  p.appendChild(img); p.appendChild(scan); p.appendChild(ts);
  p.onclick = () => openLB('cctv');
  bbl.appendChild(p);
  const meta = document.createElement('div'); meta.className = 'bmeta'; meta.textContent = '03:05';
  wrap.appendChild(bbl); wrap.appendChild(meta); row.appendChild(wrap);
  chatBody.appendChild(row); scrollBottom();

  await sleep(600);
  await addMsg('other',
    '你看……你站在我後面。<br>我回頭的時候，你卻沒有臉。',
    { typing: 2200, meta: '03:05', isRain: true });
  showOpts([
    { text: '那是我？！這不可能！', sync: 2 },
    { text: '這一定是合成的！',     sync: 0 },
    { text: '妳那時候……看得到我？', sync: 4 },
  ], async () => {
    await addMsg('other', '……那時候的你，比較像死人。', { typing: 3000, meta: '03:06', isRain: true });
    await sleep(800);
    glitch();
    // 林雨晴頭像切換成 glitch1
    swapHeaderImg('img/rain/rain_glitch1.jpg');
    await sleep(300);
    await ch22_s4();
  });
}

async function ch22_s4() {
  await addMsg('sys', '── 消失的時間 ──', { noTyping: true, delay: 300 });
  await addMsg('time', '時鐘異常 02:58 → 03:14');
  await sleep(600);
  await addMsg('sys', '未接來電 — 林雨晴（通話紀錄空白）', { noTyping: true });
  await sleep(800);
  const res = await addMsg('other',
    '__AUDIO:語音訊息 · 0:12 （建議戴耳機）__',
    { typing: 0, delay: 200, meta: '03:14', isRain: true });
  if (res && res.bbl) {
    const tr = res.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '「不要回頭……它就在你後面……<br>它長得……跟你一模一樣……」';
  }
  await sleep(800);
  await ch22_s5();
}

async function ch22_s5() {
  await addMsg('sys', '── 林雨晴支線《最後一班車》──', { noTyping: true, delay: 400 });
  await sleep(600);
  // 傳地下道驚恐自拍（rain_tunnel）
  const row = document.createElement('div'); row.className = 'brow';
  row.appendChild(mkAv('rain'));
  const wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;flex-direction:column;max-width:100%';
  const bbl = document.createElement('div'); bbl.className = 'bbl'; bbl.style.cssText = 'padding:0;background:transparent';
  const p = document.createElement('div');
  p.style.cssText = 'position:relative;width:220px;cursor:pointer;border-radius:12px;overflow:hidden;border:1px solid #1a2a2a';
  const img = document.createElement('img');
  img.src = 'img/rain/rain_tunnel.jpg';
  img.style.cssText = 'width:100%;display:block;filter:brightness(.72)';
  p.appendChild(img);
  p.onclick = () => openLB('rain_tunnel');
  bbl.appendChild(p);
  const meta = document.createElement('div'); meta.className = 'bmeta'; meta.textContent = '03:15';
  wrap.appendChild(bbl); wrap.appendChild(meta); row.appendChild(wrap);
  chatBody.appendChild(row); scrollBottom();

  await sleep(500);
  await addMsg('other',
    '你那天……是不是來找過我？<br>我記得你的衣服……和你現在穿的一樣。',
    { typing: 2500, meta: '03:15', isRain: true });
  showOpts([
    { text: '我根本不認識妳。',    sync: 0 },
    { text: '……我不記得了。',     sync: 4 },
    { text: '妳到底看見了什麼？',  sync: 2 },
  ], async (i) => {
    if (i === 1) {
      await addMsg('other',
        '我也開始忘記很多事了……<br>但你的臉，我一直記得。<br>因為……那可能不是「你」。',
        { typing: 3000, meta: '03:16', isRain: true });
    } else {
      await addMsg('other',
        '我看見你站在月台上……一動不動。<br>然後我的記憶就斷了。',
        { typing: 2500, meta: '03:16', isRain: true });
    }
    await sleep(600);
    await ch22_end();
  });
}

async function ch22_end() {
  await sleep(800);
  await addMsg('sys', '聊天室開始自動已讀（玩家未點開）', { noTyping: true });
  await sleep(600);
  await addMsg('other', '如果下一次……<br>你在地下道看到我。', { typing: 2000, meta: '03:17', isRain: true });
  await sleep(400);
  await addMsg('other', '不要跟我說話。', { typing: 1500, meta: '03:17', isRain: true });
  await sleep(800);
  // 頭像換成 glitch2（最終消融狀態）
  swapHeaderImg('img/rain/rain_glitch2.jpg');
  await addMsg('other',
    '因為那時候的我……<br>可能已經不是我了。',
    { typing: 2500, meta: '03:17', isRain: true });
  await sleep(2000);
  chatBody.style.background = '#000';
  await sleep(1500);
  await fadeOut();
  showEnd('《雨夜留言》');
  setTimeout(() => notification('林雨晴', 'LINE', '我剛剛……又看到你了。這次，你沒有回頭。'), 90000);
}

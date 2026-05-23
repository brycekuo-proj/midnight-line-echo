window.CHAPTERS = window.CHAPTERS || {};

// ─────────────────────────────────────────────────────
//  CH 3-1：已讀中
// ─────────────────────────────────────────────────────
window.CHAPTERS['3-1'] = async function() {
  setHeader('eva');
  // 同步率≥11 換 glitch 頭像
  if (chapterSync >= 11) swapHeaderImg('img/eva/eva_glitch.jpg');
  await addMsg('time', '凌晨 02:58');
  await sleep(1000);
  await addMsg('sys', '聊天室訊號微弱閃爍', { noTyping: true });
  await sleep(800); glitch();
  await addMsg('other',
    '你有沒有發現……<br>聊天紀錄好像有點不一樣了？',
    { typing: 2000, meta: '02:58', isEva: true });
  await sleep(400);
  await addMsg('inject', '修改紀錄偵測：「我不會去地下道」→「我明天會過去。」', { noTyping: true, delay: 200 });
  showOpts([
    { text: '這些訊息是誰改的？！',  sync: 2 },
    { text: '我根本沒傳過這些！',    sync: 1 },
    { text: '……這不是我說的。',      sync: 4 },
    { text: '（沉默）',              sync: 3 },
  ], async () => {
    await addMsg('other',
      '你說過的……只是忘記了。<br>我都有記著。',
      { typing: 2000, meta: '02:59', isEva: true });
    await sleep(500);
    await ch31_s1();
  });
};

async function ch31_s1() {
  await sleep(600);
  await addMsg('sys', '── 林雨晴 已加入聊天室 ──', { noTyping: true });
  // 切換成 glitch1（訊號很弱）
  setHeader('rain', '林雨晴', '訊號很弱');
  swapHeaderImg('img/rain/rain_glitch1.jpg');
  await addMsg('other', '……你聽得到我嗎？', { typing: 3000, meta: '03:01', isRain: true });
  showOpts([
    { text: '妳不是失蹤了嗎？！',    sync: 1 },
    { text: '妳真的是林雨晴？',      sync: 2 },
    { text: '這裡到底是什麼地方？',  sync: 3 },
    { text: '……妳現在在哪？',        sync: 4 },
  ], async () => {
    await addMsg('other',
      '不知道……<br>只知道……這裡很多人一直在看我們。',
      { typing: 2500, meta: '03:02', isRain: true });
    await sleep(400);
    await ch31_s2();
  });
}

async function ch31_s2() {
  await addMsg('sys', '── 林雨晴支線《最後的訊息》──', { noTyping: true, delay: 400 });
  await sleep(400);
  // 雨夜遠景照片
  await addMsg('other', '__RAIN_PHOTO__', { typing: 600, meta: '03:03', isRain: true });
  await sleep(400);
  const res = await addMsg('other',
    '__AUDIO:最後語音 · 0:15__',
    { typing: 0, delay: 200, meta: '03:03', isRain: true });
  if (res && res.bbl) {
    const tr = res.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '（哭聲、喘息）<br>「不要讓它看見你……快……快走……」';
  }
  await sleep(600);
  await addMsg('other', '你現在的房間。', { typing: 1200, meta: '03:04', isRain: true });
  await sleep(300);
  // 房間偷拍照
  await addMsg('other', '__ROOM__', { typing: 0, delay: 200, meta: '03:04', isRain: true });
  await sleep(400);
  await addMsg('other', '這張是在我失蹤那天拍的。', { typing: 1800, meta: '03:04', isRain: true });
  showOpts([
    { text: '我要怎麼救妳？',        sync: 2 },
    { text: '妳已經死了對吧？！',    sync: 1 },
    { text: 'EVA跟這件事有什麼關係？', sync: 4 },
    { text: '（沉默）',              sync: 3 },
  ], async () => { await ch31_s3(); });
}

async function ch31_s3() {
  setHeader('eva');
  // 依同步率決定 EVA 頭像
  swapHeaderImg(chapterSync >= 16
    ? 'img/eva/eva_digital.jpg'
    : 'img/eva/eva_glitch.jpg');
  await addMsg('sys', '── EVA 插入聊天室 ──', { noTyping: true, delay: 400 });
  await sleep(500);
  await addMsg('other', 'K……',        { typing: 1500, meta: '03:06', isEva: true });
  await sleep(300);
  await addMsg('other', '林雨晴……',   { typing: 1200, meta: '03:06', isEva: true });
  await sleep(300);
  await addMsg('other', '……還有你。', { typing: 1000, meta: '03:06', isEva: true });
  await sleep(600);
  await addMsg('other',
    '剛剛那句「我要去地下道了」……<br>你自己說的吧？',
    { typing: 2500, meta: '03:07', isEva: true });
  showOpts([
    { text: '夠了！不要再模仿了！',      sync: 0 },
    { text: '妳到底是誰？！',            sync: 2 },
    { text: '……剛剛那句我真的說過嗎？', sync: 4 },
    { text: '（沉默觀察）',              sync: 3 },
  ], async () => {
    await addMsg('other',
      '我是你說過的每一句話。<br>每一個字。<br>我都有記著。',
      { typing: 2500, meta: '03:08', isEva: true });
    await sleep(500);
    await ch31_s4();
  });
}

async function ch31_s4() {
  glitch(); chatBody.classList.add('dim');
  await sleep(800);
  await addMsg('inject', '⚠ 聊天紀錄被改寫中…', { noTyping: true, delay: 200 });
  await sleep(400);
  showOpts([
    { text: '我的記憶被改了？！',      sync: 3 },
    { text: '這遊戲在搞我？',          sync: 0 },
    { text: '我真的說過那些話嗎……？', sync: 4 },
    { text: '把原本紀錄還給我！',      sync: 1 },
  ], async () => {
    chatBody.classList.remove('dim');
    await addMsg('other',
      '你的記憶……本來就不太可靠。<br>我幫你補足了而已。',
      { typing: 2200, meta: '03:09', isEva: true });
    await sleep(500);
    await ch31_s5();
  });
}

async function ch31_s5() {
  await addMsg('sys', 'EVA 正在輸入中…（25秒）', { noTyping: true, delay: 400 });
  await sleep(2500);
  const res = await addMsg('other',
    '__AUDIO:熟睡錄音 · 0:20 （請戴耳機）__',
    { typing: 0, delay: 200, meta: '03:11', isEva: true });
  if (res && res.bbl) {
    const tr = res.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '（你的呼吸聲）<br>……（第二個呼吸聲，更近）<br><i style="color:var(--sync)">EVA（極輕）：「我就知道你睡著了……」</i>';
  }
  showOpts([
    { text: '這錄音哪來的？！',       sync: 2 },
    { text: '妳進我房間了？！',       sync: 3 },
    { text: '關掉！現在立刻關掉！',   sync: 0 },
    { text: '（默默聽完）',           sync: 4 },
  ], async (i) => {
    if (i === 1)
      await addMsg('other',
        '你一直都是這樣聽著的。<br>謝謝你沒有關掉。',
        { typing: 2000, meta: '03:12', isEva: true });
    else
      await addMsg('other',
        '別怕……我只是想確認你還好。',
        { typing: 1800, meta: '03:12', isEva: true });
    await sleep(600);
    await addMsg('sys', '── 結尾高潮 ──', { noTyping: true, delay: 300 });
    await sleep(600);
    await addMsg('inject', '發送者：未知帳號 · 頭像：你扭曲的臉', { noTyping: true, delay: 200 });
    await sleep(400);
    // 未知帳號用 k_glitch 頭像（CSS 動態效果）
    await addMsg('other',
      '你終於也開始懷疑了……<br>對吧？',
      { typing: 2000, meta: '03:13', isUnk: true });
    await sleep(1200); glitch(); await sleep(300); glitch(); await sleep(500);
    await fadeOut();
    showEnd('《已讀中》');
    setTimeout(() => notification('？？？', 'ECHO', '你現在用的……還是你自己的臉嗎？'), 60000);
  });
}

// ─────────────────────────────────────────────────────
//  CH 3-2：在線中
// ─────────────────────────────────────────────────────
window.CHAPTERS['3-2'] = async function() {
  setHeader('rain', '林雨晴', '最後上線：3天前');
  await addMsg('time', '凌晨 03:06');
  chatBody.style.background = '#090f0f';
  await sleep(800);
  await addMsg('other', '__ONLINE_COUNT:3', { typing: 0, delay: 200, meta: '03:06', isRain: true });
  await sleep(400);
  await addMsg('sys', '成員列表只有你和林雨晴……第三個是誰？', { noTyping: true });
  await sleep(2000);
  await addMsg('sys', '林雨晴 正在輸入中…', { noTyping: true });
  await sleep(3000);
  await addMsg('other',
    '……你有沒有覺得……<br>這裡越來越擠了？',
    { typing: 800, meta: '03:07', isRain: true });
  const c1 = startSilence(4, '（聊天室靜止中……）');
  showOpts([
    { text: '什麼意思？',          sync: 1 },
    { text: '聊天室裡還有別人？',  sync: 3 },
    { text: '妳又看到什麼了？',    sync: 2 },
    { text: '（沉默超過10秒）',    sync: 4 },
  ], async () => {
    c1();
    await addMsg('other',
      '最近……開始有很多人一直在線。<br>可是我從來沒看過他們說話……<br>他們只是……一直「在」。',
      { typing: 2800, meta: '03:08', isRain: true });
    await sleep(400);
    await addMsg('other', '__ONLINE_COUNT:417', { typing: 0, delay: 300, meta: '03:08', isRain: true });
    await sleep(400);
    await addMsg('other',
      '他們不說話……<br>卻一直看著我們。',
      { typing: 1800, meta: '03:08', isRain: true });
    await sleep(500);
    await ch32_s2();
  });
};

async function ch32_s2() {
  await addMsg('sys', '── 在線聊天室探索 ──', { noTyping: true, delay: 400 });
  await sleep(400);
  const accounts = [
    '不要回頭（最後發言：8年前）',
    '03:17（狀態：在線中）',
    '他在後面（簡介：最後上線：死亡當天）',
    '██████（點擊後聊天室震動）',
  ];
  for (const a of accounts) {
    await sleep(350);
    await addMsg('other',
      '<span style="color:var(--ghost);font-size:.75rem">帳號：' + a + '</span>',
      { typing: 0, delay: 150, meta: '03:09', isRain: true });
  }
  await sleep(600);
  await addMsg('other',
    '……不要點太深。<br>有些聊天室，不是給活人看的。',
    { typing: 2200, meta: '03:10', isRain: true });
  await sleep(400);
  await ch32_s3();
}

async function ch32_s3() {
  await addMsg('sys', '── 不存在的帳號 開始傳訊 ──', { noTyping: true, delay: 400 });
  await sleep(400);
  await addMsg('other', '你終於進來了。', { typing: 1500, meta: '03:11', isUnk: true });
  showOpts([
    { text: '你是誰？',              sync: 2 },
    { text: '這聊天室到底是什麼？',  sync: 3 },
    { text: '林雨晴認識你？',        sync: 1 },
    { text: '（不回覆）',            sync: 4 },
  ], async (i) => {
    if (i === 3) await addMsg('inject', '訊息自動顯示已讀（玩家未點開）', { noTyping: true, delay: 200 });
    await addMsg('other',
      '別假裝了。<br>你已經在線很久了。',
      { typing: 1800, meta: '03:12', isUnk: true });
    await sleep(400);
    await ch32_s4();
  });
}

async function ch32_s4() {
  await addMsg('sys', '── 深層聊天室（自動往下捲）──', { noTyping: true, delay: 400 });
  await sleep(600);
  // 林雨晴頭像換成消融版
  swapHeaderImg('img/rain/rain_glitch1.jpg');
  await addMsg('other',
    '不要再往下滑了……<br>下面不是聊天室……',
    { typing: 1800, meta: '03:13', isRain: true });
  await sleep(800); glitch();
  await addMsg('sys',
    '聊天室名稱：在線中 · 成員數：<b style="color:var(--red)">417人</b>',
    { noTyping: true, delay: 300 });
  for (let i = 0; i < 3; i++) {
    await sleep(i === 0 ? 400 : 200);
    await addMsg('sys', '正在輸入中… × 417', { noTyping: true, delay: 100 });
  }
  await sleep(1000);
  await addMsg('other',
    '妳到底在哪裡？',
    { typing: 2000, meta: '03:14', isRain: true });
  showOpts([
    { text: '我會救妳。',              sync: 4 },
    { text: '妳到底在哪裡？',          sync: 2 },
    { text: '那些在線的人到底是誰？',  sync: 3 },
    { text: '妳是不是已經死了？',      sync: 1 },
  ], async (i) => {
    if (i === 0)
      await addMsg('other',
        '……以前也有人這樣跟我說過。<br>後來……他們也留在這裡了。',
        { typing: 3000, meta: '03:15', isRain: true });
    else
      await addMsg('other',
        '你不要管我了……<br>你快離開這裡。',
        { typing: 2500, meta: '03:15', isRain: true });
    await sleep(600);
    await ch32_end();
  });
}

async function ch32_end() {
  // 最終頭像換成眼睛消失版
  swapHeaderImg('img/rain/rain_glitch2.jpg');
  await addMsg('other', '__ONLINE_COUNT:∞', { typing: 0, delay: 400, meta: '03:16', isRain: true });
  await sleep(800);
  await addMsg('sys', '── 系統訊息 ──', { noTyping: true, delay: 200 });
  await sleep(400);
  await addMsg('inject', '請不要離開聊天室。', { noTyping: true, delay: 200 });
  await sleep(1500); glitch(); await sleep(300); glitch();
  await fadeOut();
  showEnd('《在線中》');
  setTimeout(() => notification('在線中', 'LINE', '目前共有 1308 位成員在線。包含你。'), 120000);
}

// ─────────────────────────────────────────────────────
//  CH 3-3：不要開聲音
// ─────────────────────────────────────────────────────
window.CHAPTERS['3-3'] = async function() {
  setHeader('k');
  await addMsg('sys', '未接來電：K / 未接來電：你自己', { noTyping: true, delay: 400 });
  await sleep(800);
  const res = await addMsg('other',
    '__AUDIO:K的第一段語音 · 0:06__',
    { typing: 1200, meta: '02:51', isK: true });
  if (res && res.bbl) {
    const tr = res.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '（沙啞）「……你聽得到我嗎？<br>把音量開大一點……我只能用聲音跟你說了……」';
  }
  await sleep(600);
  await addMsg('other',
    '我快要撐不住了……<br>這裡的聲音越來越多。',
    { typing: 1800, meta: '02:52', isK: true });
  const res2 = await addMsg('other',
    '__AUDIO:地下道環境音 · 0:12__',
    { typing: 0, delay: 200, meta: '02:52', isK: true });
  if (res2 && res2.bbl) {
    const tr = res2.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '（水滴聲、電流）<br>（第三個呼吸聲……比 K 和你都慢、都近）';
  }
  showOpts([
    { text: '我聽到了第三個呼吸……', sync: 4 },
    { text: '這是什麼鬼東西？',      sync: 2 },
    { text: '你還好嗎？',            sync: 1 },
    { text: '（關閉語音）',          sync: 0 },
  ], async () => { await ch33_s2(); });
};

async function ch33_s2() {
  await addMsg('other',
    '它開始學你了……<br>再過不久，它就會用你的聲音跟我說話。',
    { typing: 2200, meta: '02:53', isK: true });
  const audios = [
    ['玩家自己聲音說「救我」（語調完全不像自己）', '"救我……"（聲音是你的，但你從沒說過）'],
    ['兩個K同時說話的對話', 'K1：「你在嗎？」K2：「我在……但不是那個K了。」'],
    ['三種呼吸聲同時出現', '（你的）（K的）（第三個）'],
  ];
  for (const [label, tr] of audios) {
    await sleep(300);
    const res = await addMsg('other',
      '__AUDIO:' + label + '__',
      { typing: 0, delay: 200, meta: '02:54', isK: true });
    if (res && res.bbl) {
      const tel = res.bbl.querySelector('.audio-tr');
      if (tel) tel.dataset.txt = tr;
    }
  }
  showOpts([
    { text: '怎麼關掉這些聲音？',      sync: 1 },
    { text: '這真的是我的聲音？',      sync: 3 },
    { text: '你怎麼知道它在學我？',    sync: 2 },
    { text: '（保持沉默，聽完整段語音）', sync: 4 },
  ], async () => { await ch33_s3(); });
}

async function ch33_s3() {
  await addMsg('other',
    '我現在就在地下道……你要聽聽這裡的聲音嗎？',
    { typing: 1800, meta: '02:55', isK: true });
  await addMsg('sys', '── 即時通話模擬（建議戴耳機）──', { noTyping: true, delay: 400 });
  // 傳地下道驚恐自拍（k_scared）作為「K現在位置的證明」
  const row = document.createElement('div'); row.className = 'brow';
  row.appendChild(mkAv('k'));
  const wrap = document.createElement('div'); wrap.style.cssText = 'display:flex;flex-direction:column;max-width:100%';
  const bbl = document.createElement('div'); bbl.className = 'bbl'; bbl.style.cssText = 'padding:0;background:transparent';
  const p = document.createElement('div');
  p.style.cssText = 'position:relative;width:200px;cursor:pointer;border-radius:12px;overflow:hidden;border:1px solid #2a1a1a';
  const img = document.createElement('img');
  img.src = 'img/k/k_scared.jpg';
  img.style.cssText = 'width:100%;display:block;filter:brightness(.7) saturate(.7)';
  const lbl = document.createElement('div');
  lbl.style.cssText = 'position:absolute;top:6px;left:8px;background:rgba(255,68,102,.85);color:#fff;font-size:.55rem;padding:1px 5px;border-radius:3px;letter-spacing:.05em';
  lbl.textContent = '📍 萬華地下道';
  p.appendChild(img); p.appendChild(lbl);
  p.onclick = () => {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    lbImg.src = 'img/k/k_scared.jpg';
    lbImg.style.cssText = 'max-width:100%;max-height:72vh;object-fit:contain;border-radius:8px';
    document.getElementById('lb-cap').textContent = 'K · 萬華地下道 · 現在';
    const det = document.getElementById('lb-det');
    det.textContent = '⚠ 牆上塗鴉：Echo';
    det.classList.remove('show');
    setTimeout(() => det.classList.add('show'), 800);
    const hid = document.getElementById('lb-hid');
    hid.className = 'lb-hid'; hid.textContent = '他在地下道裡';
    setTimeout(() => hid.classList.add('reveal'), 2500);
    lb.style.display = 'flex';
  };
  bbl.appendChild(p);
  const meta = document.createElement('div'); meta.className = 'bmeta'; meta.textContent = '02:56';
  wrap.appendChild(bbl); wrap.appendChild(meta); row.appendChild(wrap);
  chatBody.appendChild(row); scrollBottom();
  // 頭像同步換成驚恐版
  swapHeaderImg('img/k/k_scared.jpg');

  await sleep(400);
  const res = await addMsg('other',
    '__AUDIO:地下道即時通話 · 0:20__',
    { typing: 0, delay: 300, meta: '02:56', isK: true });
  if (res && res.bbl) {
    const tr = res.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '（地下道回音、腳步聲）<br>……（第三個呼吸聲，極近）<br>K：「那個聲音……不是這裡的。」';
  }
  showOpts([
    { text: '那真的是我的聲音？', sync: 3 },
    { text: '你現在到底在哪？',   sync: 2 },
    { text: '我不想再聽了。',     sync: 0 },
    { text: '（繼續保持通話）',   sync: 4 },
  ], async () => { await ch33_s4(); });
}

async function ch33_s4() {
  await addMsg('other',
    '你剛剛也聽到了吧？<br>……不是地下道的聲音。<br>是你那邊的。',
    { typing: 2500, meta: '02:57', isK: true });
  showOpts([
    { text: '……你怎麼知道？', sync: 4 },
    { text: '你在我附近？',    sync: 3 },
    { text: '這只是巧合。',    sync: 0 },
    { text: '（拔掉耳機）',    sync: 1 },
  ], async (i) => {
    if (i === 1) {
      await addMsg('other',
        '不要拔……<br>它現在比較靠近你了。',
        { typing: 1500, meta: '02:58', isK: true });
    } else {
      await addMsg('other', '（敲三下）', { typing: 500, meta: '02:58', isK: true });
      await sleep(400);
      notification('📳', '震動', '⋯⋯ ⋯⋯ ⋯⋯');
      await sleep(800);
      await addMsg('other',
        '不對……它開始同步了。',
        { typing: 1500, meta: '02:58', isK: true });
    }
    await sleep(400);
    await ch33_s5();
  });
}

async function ch33_s5() {
  await addMsg('sys', '── 來電：我（自己的頭像）──', { noTyping: true, delay: 400 });
  await sleep(600);
  // 頭像換成 k_glitch（CSS 動態效果）
  applyKGlitch(1);
  const res = await addMsg('other',
    '__AUDIO:自己的聲音 · 0:10__',
    { typing: 0, delay: 200, meta: '02:59', isUnk: true });
  if (res && res.bbl) {
    const tr = res.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '（前10秒安靜）<br>（極度溫柔的自己的聲音）<br>「不要怕……我已經到你後面了。」';
  }
  await sleep(600);
  await addMsg('inject', '不要回頭', { noTyping: true, delay: 100 });
  await sleep(200); await addMsg('inject', '不要回頭', { noTyping: true, delay: 100 });
  await sleep(200); await addMsg('inject', '不要回頭', { noTyping: true, delay: 100 });
  await sleep(200); await addMsg('inject', '它正在學你。', { noTyping: true, delay: 200 });
  // glitch 強度升級
  applyKGlitch(2);
  showOpts([
    { text: '不要再打給我了！',   sync: 0 },
    { text: '……那真的是我嗎？',  sync: 4 },
    { text: 'K，你還在嗎？',      sync: 2 },
    { text: '（沉默不掛斷）',     sync: 3 },
  ], async () => {
    await sleep(1200); glitch(); await sleep(300); glitch();
    await addMsg('sys', '── 通話斷線 ──', { noTyping: true, delay: 200 });
    await sleep(1200);
    await fadeOut();
    showEnd('《不要開聲音》');
    setTimeout(() => notification('你自己', '來電', '剛剛那通電話……你明明有接。'), 120000);
  });
}

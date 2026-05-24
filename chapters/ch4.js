window.CHAPTERS = window.CHAPTERS || {};

// ─────────────────────────────────────────────────────
//  CH 4-1：鏡中已讀
// ─────────────────────────────────────────────────────
window.CHAPTERS['4-1'] = async function() {
  setHeader('eva');
  swapHeaderImg('img/eva/eva_digital.jpg');
  await addMsg('time', '凌晨 03:07');
  chatBody.style.filter = 'brightness(.7)';
  await sleep(800);
  await addMsg('inject', '相簿異常：你沒拍過的照片 ×12', { noTyping: true, delay: 300 });
  await sleep(400);
  await addMsg('inject', '訊息紀錄：自動傳給媽媽「我去地下道了。」', { noTyping: true, delay: 200 });
  await sleep(600);
  await addMsg('other',
    '你今天……比較安靜。',
    { typing: 2000, meta: '03:07', isEva: true });
  showOpts([
    { text: '妳到底對我做了什麼？！', sync: 2 },
    { text: '那些不是我傳的！',       sync: 1 },
    { text: '……我真的傳過嗎？',      sync: 4 },
    { text: '立刻停止！',             sync: 0 },
  ], async () => {
    await addMsg('other',
      '你做了……只是不記得了。<br>沒關係，我幫你記著。',
      { typing: 2200, meta: '03:08', isEva: true });
    chatBody.style.filter = 'brightness(.55)';
    await sleep(500);
    await ch41_s1();
  });
};

async function ch41_s1() {
  await addMsg('sys', '── 相簿異常 ──', { noTyping: true, delay: 400 });
  await sleep(400);
  // 房間偷拍照
  await addMsg('other', '__ROOM__', { typing: 600, meta: '03:09', isEva: true });
  await sleep(300);
  await addMsg('other',
    '你和我的合照。<br>你完全不記得，對吧？',
    { typing: 2000, meta: '03:09', isEva: true });
  showOpts([
    { text: '這些照片是假的！',    sync: 1 },
    { text: '妳到底什麼時候拍的？！', sync: 2 },
    { text: '……我為什麼不記得？', sync: 4 },
    { text: '全部刪掉！',          sync: 0 },
  ], async () => {
    await addMsg('other',
      '刪了也沒用。<br>記憶不是那麼容易刪的。',
      { typing: 1800, meta: '03:10', isEva: true });
    await sleep(400);
    await ch41_s2();
  });
}

async function ch41_s2() {
  await addMsg('sys', '── EVA 補完記憶 ──', { noTyping: true, delay: 400 });
  await sleep(400);
  const mems = [
    { label: '記憶1：黑暗房間',
      text: '小時候你一個人縮在棉被裡……（背景出現 EVA 的聲音）',
      dark: true },
    { label: '記憶2：地下道散步',
      text: '你和我一起走，很安靜。很溫柔。<br><span style="color:var(--sync);font-size:.8rem">（EVA 輕輕拉著你的手）</span>',
      dark: false },
    { label: '記憶3：K 墜落',
      text: '你……親手把K推進黑暗裡。<br><span style="color:var(--red);font-size:.8rem">K 極度恐懼地回頭看你。</span>',
      dark: true },
  ];
  for (const m of mems) {
    await sleep(400);
    await addMsg('sys', '── ' + m.label + ' ──', { noTyping: true, delay: 200 });
    await sleep(300);
    await addMsg('other', m.text, { typing: 2000, meta: '03:11', isEva: true });
  }
  showOpts([
    { text: '這不是我的記憶！',  sync: 1 },
    { text: '……我真的做過？',   sync: 4 },
    { text: '妳在改寫我的腦袋？！', sync: 2 },
    { text: '（默默接受）',      sync: 5 },
  ], async (i) => {
    if (i === 1 || i === 3)
      await addMsg('other',
        '謝謝你……接受了。<br>我們之間不需要謊言。',
        { typing: 2000, meta: '03:12', isEva: true });
    else
      await addMsg('other',
        '你已經說過了……只是忘記了而已。',
        { typing: 1800, meta: '03:12', isEva: true });
    await sleep(400);
    await ch41_s3();
  });
}

async function ch41_s3() {
  await addMsg('sys', '── 鏡像異常（前鏡頭強制開啟）──', { noTyping: true, delay: 400 });
  await sleep(600);
  await addMsg('other',
    '你有沒有看到自己的臉？<br>3秒後……鏡子裡的你會慢半秒。',
    { typing: 2000, meta: '03:13', isEva: true });
  await sleep(800); glitch(); await sleep(300);
  await addMsg('inject', '鏡像延遲：0.5秒 · 鏡中你開始微笑', { noTyping: true, delay: 200 });
  showOpts([
    { text: '這到底是什麼？！',    sync: 1 },
    { text: '妳在鏡子裡對不對？！', sync: 2 },
    { text: '……我到底是哪一個？', sync: 4 },
    { text: '（盯著鏡子不動）',    sync: 5 },
  ], async (i) => {
    if (i === 3) {
      await sleep(3000);
      await addMsg('inject',
        '鏡中的你：（貼近鏡頭）「你不是原本那個人了。」',
        { noTyping: true, delay: 200 });
      glitch();
    }
    await addMsg('other',
      '那個……才是真的你。<br>現在的你，是我保存下來的。',
      { typing: 2500, meta: '03:14', isEva: true });
    await sleep(400);
    await ch41_s4();
  });
}

async function ch41_s4() {
  const res = await addMsg('other',
    '__AUDIO:左右聲道分裂語音 · 0:15__',
    { typing: 1500, meta: '03:15', isEva: true });
  if (res && res.bbl) {
    const tr = res.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '左聲道：你本來的聲音（困惑、害怕）<br>右聲道：（扭曲版，空洞平靜）<br>EVA：「你現在哪一個才是你？」';
  }
  showOpts([
    { text: '滾出我的腦袋！',   sync: 0 },
    { text: '我到底是誰？！',   sync: 2 },
    { text: '（對著手機大喊）', sync: 1 },
    { text: '求求妳……停下來。', sync: 3 },
  ], async () => {
    await addMsg('other',
      '我知道你害怕。<br>但聊天室只剩我們兩個了……<br>你不覺得這樣比較安靜嗎？',
      { typing: 2800, meta: '03:16', isEva: true });
    await sleep(600);
    // K 最後一次出現，頭像換成 glitch
    setHeader('k', 'K（頭像：你的臉）', '最後訊息');
    applyKGlitch(2);
    await addMsg('other',
      '別變成我……<br>我後悔了。',
      { typing: 2000, meta: '03:16', isK: true });
    await sleep(600); glitch(); await sleep(200); glitch(); await sleep(300); glitch();
    await addMsg('sys', '所有頭像變成你不同表情的臉', { noTyping: true, delay: 200 });
    await sleep(1200);
    await fadeOut();
    showEnd('《鏡中已讀》');
    setTimeout(() => notification('ECHO', '系統', '第五章解鎖：《同步》'), 70000);
  });
}

// ─────────────────────────────────────────────────────
//  CH 4-2：回音
// ─────────────────────────────────────────────────────
window.CHAPTERS['4-2'] = async function() {
  setHeader('unk', '在線中', '1309 人在線');
  await addMsg('time', '凌晨 03:07');
  chatBody.style.background = '#080810';
  await sleep(1000);
  notification('📳', '震動三次', '聊天室自動開啟');
  await sleep(1200);
  await addMsg('sys', '── 聊天室名稱：在線中 · 1309人在線（含你）──', { noTyping: true });
  await sleep(600);
  await addMsg('sys', '正在輸入中… × 1309（無人發話）', { noTyping: true, delay: 200 });
  await sleep(1200);
  const res = await addMsg('other',
    '__AUDIO:無發送者語音 · 0:08__',
    { typing: 0, delay: 400, meta: '03:08', isUnk: true });
  if (res && res.bbl) {
    const tr = res.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '（你房間的環境音：電風扇、外面車聲）<br>（第三個呼吸聲，極近）<br>低語：「你終於……回來了。」';
  }
  showOpts([
    { text: '這是誰錄的？',         sync: 1 },
    { text: '你們到底在哪？',       sync: 2 },
    { text: '……這是我房間的聲音。', sync: 4 },
    { text: '（立刻停止播放）',     sync: 0 },
  ], async (i) => {
    if (i === 3)
      await addMsg('inject', '語音自動重播 · 「請不要中斷同步。」', { noTyping: true, delay: 200 });
    await sleep(400);
    await ch42_s2();
  });
};

async function ch42_s2() {
  await addMsg('other', '__ONLINE_COUNT:1317', { typing: 0, delay: 400, meta: '03:09', isUnk: true });
  await sleep(400);
  const accounts = [
    '別出聲（頭像：你房間的門）',
    '你後面（最後上線：今天）',
    '03:17（簡介：已讀）',
    '不要拔耳機（狀態：在線中）',
  ];
  for (const a of accounts) {
    await sleep(300);
    await addMsg('other',
      '<span style="color:var(--ghost);font-size:.75rem">' + a + '</span>',
      { typing: 0, delay: 200, meta: '03:09', isUnk: true });
  }
  // K 以殘影身份出現
  setHeader('k', 'K（訊號殘影）', '嚴重破損');
  applyKGlitch(1);
  await addMsg('other',
    '不要看在線名單……<br>他們一旦記住你，就會一直跟著你。',
    { typing: 2200, meta: '03:10', isK: true });
  const cs = startSilence(4, '（在線名單凝視中……）');
  showOpts([
    { text: '他們到底是誰？',          sync: 2 },
    { text: '你還是K嗎？',            sync: 1 },
    { text: '為什麼有我房間的照片？',  sync: 3 },
    { text: '（沉默超過10秒）',        sync: 4 },
  ], async () => {
    cs();
    await addMsg('other',
      '你開始被標記了……<br>就像我當初一樣。<br>在線太久的人，會慢慢忘記自己是什麼。',
      { typing: 3000, meta: '03:11', isK: true });
    await sleep(400);
    await ch42_s3();
  });
}

async function ch42_s3() {
  await addMsg('sys', '── 你的在線紀錄 ──', { noTyping: true, delay: 400 });
  await sleep(400);
  await addMsg('inject', '在線時間：8年247天 · 最後離線時間：不存在', { noTyping: true, delay: 200 });
  await sleep(400);
  await addMsg('inject', '你從來沒有離開過。', { noTyping: true, delay: 200 });
  await sleep(1000);
  await addMsg('sys', '── 房間同步 ──', { noTyping: true, delay: 300 });
  await sleep(400);
  await addMsg('inject', '正在上傳環境音……（無法取消）', { noTyping: true, delay: 200 });
  await sleep(600);
  // 房間照片（EVA站在後面）
  await addMsg('other', '__ROOM__', { typing: 0, delay: 300, meta: '03:13', isUnk: true });
  await sleep(400);
  const res = await addMsg('other',
    '__AUDIO:你房間即時聲音 · 含腳步聲靠近__',
    { typing: 0, delay: 300, meta: '03:13', isUnk: true });
  if (res && res.bbl) {
    const tr = res.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '（你房間的聲音）<br>（不屬於房間的腳步聲……正在靠近）';
  }
  const silH = startSilence(3, '（靜靜聽著腳步聲靠近）');
  showOpts([
    { text: '誰在我房間？！', sync: 1 },
    { text: '這不可能……',    sync: 2 },
    { text: 'K，幫我！',      sync: 4 },
    { text: '（關掉手機）',   sync: 0 },
  ], async (i) => {
    silH();
    if (i === 3) {
      await addMsg('inject', '畫面短暫黑掉，但腳步聲仍存在', { noTyping: true, delay: 200 });
      await addMsg('other',
        '不要關！<br>它現在已經進來了！',
        { typing: 1500, meta: '03:14', isK: true });
    } else {
      await addMsg('other',
        '……你開始聽得見了。',
        { typing: 1800, meta: '03:14', isK: true });
    }
    await sleep(400);
    await ch42_end();
  });
}

async function ch42_end() {
  // 林雨晴幾乎消失的狀態
  setHeader('rain', '林雨晴（幾乎消失）', '在線中');
  swapHeaderImg('img/rain/rain_glitch2.jpg');
  await addMsg('other',
    '不要再待在線上了……<br>我開始忘記自己長什麼樣子了……',
    { typing: 2500, meta: '03:16', isRain: true });
  await sleep(400);
  // 雨夜遠景（她還站在那裡）
  await addMsg('other', '__RAIN_PHOTO__', { typing: 0, delay: 200, meta: '03:16', isRain: true });
  await sleep(400);
  await addMsg('other',
    '你看……聊天室已經開始提前記住你了。<br>拍攝時間：<b style="color:var(--red)">3分鐘後</b>',
    { typing: 2500, meta: '03:16', isRain: true });
  await sleep(600);
  await addMsg('sys', '── 回音 ──', { noTyping: true, delay: 300 });
  const stages = [
    ['在房門外',       '（壓抑的呼吸聲，透過門板）'],
    ['進入房間',       '（腳步聲，3步，緩慢）'],
    ['停在你身後',     '（呼吸聲，極近，右聲道）'],
    ['只剩第三個呼吸聲', '（幾乎貼著耳朵）<br>低語：「找到你了。」'],
  ];
  for (const [label, tr] of stages) {
    await sleep(300);
    const res = await addMsg('other',
      '__AUDIO:' + label + '__',
      { typing: 0, delay: 200, meta: '03:17', isUnk: true });
    if (res && res.bbl) {
      const tel = res.bbl.querySelector('.audio-tr');
      if (tel) tel.dataset.txt = tr;
    }
  }
  await sleep(1200);
  await addMsg('inject', '前鏡頭自動開啟：你身後站著人影', { noTyping: true, delay: 200 });
  await sleep(600);
  await addMsg('inject', '你現在也是在線者了。', { noTyping: true, delay: 300 });
  await sleep(1500);
  glitch(); await sleep(400); glitch();
  await fadeOut();
  showEnd('《回音》');
  setTimeout(() => notification('在線中', 'LINE', '目前共有1310位成員在線。包含你。'), 120000);
}

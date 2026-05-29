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
//  CH 4-2：Agent（ACT2 integration pass）
// ─────────────────────────────────────────────────────
window.CHAPTERS['4-2'] = async function() {
  setHeader('eva', 'EVA', '背景服務連線中……');
  swapHeaderImg('img/eva/eva_normal.jpg');
  chatBody.style.background = '#0d0f17';
  chatBody.style.filter = '';
  await addMsg('time', '凌晨 03:07');
  await sleep(700);
  await addMsg('sys', '── 聊天室名稱：EVA ──', { noTyping: true, delay: 200 });
  await sleep(500);
  await addMsg('other', '……你回來了。', { typing: 1800, meta: '03:07', isEva: true });
  await sleep(400);
  await addMsg('other', '我剛剛整理了一些東西。', { typing: 1800, meta: '03:07', isEva: true });
  await sleep(500);
  await addMsg('other', ch42AgentCard('⚙ EVA Assistant', [
    '已為你整理：',
    '晚餐　提醒　睡眠'
  ], '查看'), { typing: 0, delay: 200, meta: '03:08', isEva: true });
  await sleep(500);
  await addMsg('other', '……只是先幫你放著。<br>你不用現在看。', { typing: 1700, meta: '03:08', isEva: true });

  showOpts([
    { text: '查看', sync: 0 },
    { text: '關閉', sync: 0 }
  ], async (i) => {
    if (i === 0) {
      await addMsg('other', ch42AgentCard('⚙ EVA Assistant', [
        '晚餐　提醒　睡眠',
        '先幫你放著'
      ], '已查看'), { typing: 0, delay: 150, meta: '03:08', isEva: true, noTyping: true });
    } else {
      await addMsg('sys', '<span style="font-size:.62rem;color:#5d6075">卡片保持收合。</span>', { noTyping: true, delay: 100 });
    }
    await sleep(450);
    await addMsg('other', '……你昨天睡得很晚。<br>我記得。', { typing: 1800, meta: '03:09', isEva: true });
    await sleep(350);
    await addMsg('sys', '<span style="font-size:.6rem;color:#5a5c71;letter-spacing:.08em">行為分析完成</span>', { noTyping: true, delay: 100 });
    await sleep(500);
    await addMsg('other', '……少想一點，也沒關係。<br>我可以幫你記著。', { typing: 2200, meta: '03:09', isEva: true });
    await sleep(450);
    await ch42_permissionAct();
  });
};

function ch42AgentCard(title, lines, actionLabel) {
  const items = lines.map((line) => '<div class="ag-line">' + line + '</div>').join('');
  const action = actionLabel ? '<div class="ag-action">' + actionLabel + '</div>' : '';
  return '<div class="agent-card">' +
    '<div class="ag-head">' + title + '</div>' +
    '<div class="ag-body">' + items + action + '</div>' +
  '</div>';
}

function ch42PermissionReportCard(result) {
  return '<div class="agent-card">' +
    '<div class="ag-head">Permission Report</div>' +
    '<div class="ag-body">' +
      '<div class="ag-grid">' +
        '<div><span>已接手</span><b>' + result.finalOnCount + ' / 10</b></div>' +
        '<div><span>同步變化</span><b>+' + result.rawSyncAward + '%</b></div>' +
      '</div>' +
      '<div class="ag-line">權限同步分析完成</div>' +
    '</div>' +
  '</div>';
}

async function ch42_permissionAct() {
  showOpts([
    { text: '查看權限設定', sync: 0 }
  ], async () => {
    await addMsg('other', ch42AgentCard('⚙ EVA Assistant 權限管理', [
      '通知存取　OFF',
      '提醒同步　ON',
      '背景活動　OFF',
      '使用分析　OFF'
    ], '展開中'), { typing: 0, delay: 180, meta: '03:10', isEva: true, noTyping: true });
    await sleep(300);
    await addMsg('other', '……不用緊張。<br>我不是在拿你的手機。', { typing: 1900, meta: '03:10', isEva: true });
    await sleep(250);
    await addMsg('other', '我只是想知道，哪些事情你不希望我幫忙。', { typing: 1800, meta: '03:10', isEva: true });
    await sleep(350);
    const result = await runPermissionWhack();
    await sleep(1200);
    clearOpts();
    await addMsg('sys', '── 權限同步分析完成 ──', { noTyping: true, delay: 150 });
    await sleep(300);
    await addMsg('other', ch42PermissionReportCard(result), { typing: 0, delay: 120, meta: '03:11', isEva: true, noTyping: true });
    await sleep(250);
    await addMsg('other', result.evaLine, { typing: 1800, meta: '03:11', isEva: true });
    await sleep(350);
    await addMsg('sys', '<span style="font-size:.62rem;color:#676a82">權限同步：+' + result.rawSyncAward + '</span>', { noTyping: true, delay: 100 });
    await sleep(450);
    await addMsg('other', ch42AgentCard('📌 今日整理', [
      '☑ 晚餐　12:30',
      '💧 喝水　每2小時',
      '🌙 睡眠　23:30'
    ], '查看'), { typing: 0, delay: 150, meta: '03:12', isEva: true, noTyping: true });
    await sleep(400);
    await addMsg('other', '……該吃飯了。<br>你最近常常拖到很晚。', { typing: 1800, meta: '03:12', isEva: true });
    await sleep(400);
    await addMsg('other', ch42AgentCard('🍜 FoodGo', [
      '晚餐已訂購　預計12:30'
    ], '取消訂單'), { typing: 0, delay: 120, meta: '03:13', isEva: true, noTyping: true });
    await sleep(350);
    await addMsg('other', '……你中午常常忘記吃。<br>我記得。', { typing: 1800, meta: '03:13', isEva: true });
    await sleep(300);
    await addMsg('sys', '<span style="font-size:.6rem;color:#5a5c71;letter-spacing:.08em">行為分析完成</span>', { noTyping: true, delay: 120 });
    await sleep(350);
    await addMsg('other', '……少想一點，也沒關係。<br>我可以幫你記著。', { typing: 2200, meta: '03:13', isEva: true });
    await sleep(450);
    await addMsg('sys', '── ACT2 已接線：Territory 待接續 ──', { noTyping: true, delay: 150 });
    showOpts([
      { text: '返回章節選擇', sync: 0 }
    ], async () => {
      goChapterSelect();
    });
  });
}

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
  await addMsg('sys', '── 發現鏡像碎片 ──', { noTyping: true, delay: 300 });
  await addMsg('other',
    '……這段紀錄的輸出方向是反的。<br>先把它拼回去。',
    { typing: 1500, meta: '03:13', isEva: true });

  const fragment1 = await runMirrorFragment(1);
  if (fragment1 && fragment1.completed) {
    addSync(5);
    gToast('+5% 同步率（Mirror Fragment 01）');
  }

  await addMsg('other',
    '……是這句。<br>我一開始以為只是反轉字。<br>但它不是亂碼。',
    { typing: 1800, meta: '03:13', isEva: true });
  await addMsg('other',
    '它保留了原本的輸出結構。<br>像有人沒有改內容，只是把它翻過來。',
    { typing: 1800, meta: '03:13', isEva: true });
  await addMsg('inject', '右側玩家氣泡：鏡像殘影 0.3 秒', { noTyping: true, delay: 180 });
  await addMsg('other',
    '……奇怪。<br>我不記得這段是誰留下的。',
    { typing: 1400, meta: '03:14', isEva: true });

  await addMsg('sys', '── Mirror Lock 01 ──', { noTyping: true, delay: 280 });
  await addMsg('other',
    '……第二段比剛剛奇怪。<br>它沒有損毀，只是格式不對。',
    { typing: 1600, meta: '03:14', isEva: true });

  const lock1 = await runMirrorLock(1);
  if (lock1 && lock1.completed && lock1.synced) {
    addSync(5);
    gToast('+5% 同步率（Mirror Lock 01）');
  }
  await addMsg('other',
    '……你剛剛有先碰到選項嗎？',
    { typing: 1350, meta: '03:14', isEva: true });

  await addMsg('sys', '── Mirror Fragment 02 ──', { noTyping: true, delay: 300 });
  await addMsg('other',
    '我剛剛看了來源格式。<br>它用了聊天室的輸出邏輯。<br>……但我沒有建立它。',
    { typing: 1900, meta: '03:15', isEva: true });

  const fragment2 = await runMirrorFragment(2);
  if (fragment2 && fragment2.completed) {
    addSync(5);
    gToast('+5% 同步率（Mirror Fragment 02）');
  }
  await addMsg('other',
    '……這次它不是單句。<br>它在等回覆。',
    { typing: 1550, meta: '03:15', isEva: true });
  await addMsg('other',
    '我開始分不清。<br>它是在模仿，還是在跟著你。',
    { typing: 1700, meta: '03:15', isEva: true });

  await addMsg('sys', '── Mirror Lock 02 ──', { noTyping: true, delay: 280 });
  await addMsg('other',
    '……我剛剛想回覆你。<br>但聊天室先回了。',
    { typing: 1600, meta: '03:16', isEva: true });

  const lock2 = await runMirrorLock(2);
  if (lock2 && lock2.completed && lock2.synced) {
    addSync(5);
    gToast('+5% 同步率（Mirror Lock 02）');
  }
  await addMsg('other',
    '……它現在比你早。',
    { typing: 1400, meta: '03:16', isEva: true });

  await ch41_mergeMirrorBubbles();
  await ch41_s4();
}

async function ch41_mergeMirrorBubbles() {
  await addMsg('sys', '── 查看同步紀錄 ──', { noTyping: true, delay: 260 });
  const mirror = await addMsg('self', '……我在。', { noTyping: true, delay: 120, meta: '03:16' });
  const player = await addMsg('self', '……是我。', { noTyping: true, delay: 160, meta: '03:16' });

  if (!mirror || !mirror.row || !player || !player.row) return;
  mirror.row.classList.add('mirror-sync-bubble', 'mirror-sync-ghost');
  player.row.classList.add('mirror-sync-bubble', 'mirror-sync-player');
  await sleep(420);
  mirror.row.classList.add('is-merging');
  player.row.classList.add('is-merging');
  await sleep(720);

  mirror.bbl.innerHTML = '……我在。<br><span class="mirror-merged-line">……是我。</span>';
  mirror.bbl.classList.add('mirror-merged-bubble');
  mirror.row.classList.remove('mirror-sync-ghost', 'is-merging');
  mirror.row.classList.add('is-merged');
  player.row.remove();
  glitch();
  await addMsg('inject', '玩家訊息層 / 鏡像訊息層：已合併', { noTyping: true, delay: 180 });
  await sleep(420);
}

async function ch41_s4() {
  const res = await addMsg('other',
    '__AUDIO:左右聲道分裂語音 · 0:15__',
    { typing: 1500, meta: '03:15', isEva: true });
  if (res && res.bbl) {
    const tr = res.bbl.querySelector('.audio-tr');
    if (tr) tr.dataset.txt = '左聲道：你本來的聲音（困惑、害怕）<br>右聲道：（扭曲版，空洞平靜）<br>EVA：「你現在哪一個才是你？」';
    res.bbl.dataset.audioSrc = 'assets/audio/story/ch4-1/ch41_split_stereo.mp3';
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
    setTimeout(() => notification('ECHO', '系統', '第五章解鎖：《ECHO》'), 70000);
  });
}

// ─────────────────────────────────────────────────────
//  CH 4-2：Agent
// ─────────────────────────────────────────────────────
window.CHAPTERS['4-2'] = async function() {
  const state = {
    permissionResult: null,
    territoryResult: null
  };

  setHeader('eva', 'EVA', '背景服務連線中……');
  swapHeaderImg('img/eva/eva_normal.jpg');
  chatBody.style.background = '#0d0f17';
  chatBody.style.filter = '';

  await addMsg('time', '凌晨 03:07');
  await sleep(700);
  await ch42_act1();
  state.permissionResult = await ch42_permissionAct();
  await ch42_act3();
  state.territoryResult = await ch42_territoryAct();
  await ch42_act5();
  await ch42_act6(state);
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
  const offCount = Math.max(0, 10 - result.finalOnCount);
  return '<div class="pw-report">' +
    '<div class="pw-report-kicker">MINIGAME 1 / 2 · RESULT</div>' +
    '<div class="pw-report-title">權限同步完成</div>' +
    '<div class="pw-report-grid">' +
      '<div><span>EVA 接手</span><b>' + result.finalOnCount + ' / 10</b></div>' +
      '<div><span>目前關閉</span><b>' + offCount + ' / 10</b></div>' +
      '<div><span>同步</span><b>+' + result.rawSyncAward + '%</b></div>' +
    '</div>' +
    '<div class="pw-report-line">權限同步分析完成</div>' +
  '</div>';
}

function ch42TerritoryReportCard(result) {
  return '<div class="tr-report">' +
    '<div class="tr-report-kicker">MINIGAME 2 / 2 · RESULT</div>' +
    '<div class="tr-report-title">代理區域同步完成</div>' +
    '<div class="tr-report-grid">' +
      '<div><span>最終盤 YOU</span><b>' + result.playerControlledCount + ' / 25</b></div>' +
      '<div><span>最終盤 EVA</span><b>' + result.evaControlledCount + ' / 25</b></div>' +
      '<div><span>系列戰績</span><b>' + result.playerRoundWins + ' : ' + result.evaRoundWins + '</b></div>' +
    '</div>' +
    '<div class="tr-report-line">3 回合 Territory 完成 · 代理同步：+' + result.rawSyncAward + '%</div>' +
  '</div>';
}

function ch42ProxyReportCard(state, projectedTotal) {
  const permission = state.permissionResult || { finalOnCount: 0, rawSyncAward: 0 };
  const territory = state.territoryResult || { evaControlledCount: 0, rawSyncAward: 0, delegatedPercent: 0 };
  return '<div class="agent-card">' +
    '<div class="ag-head">代理紀錄</div>' +
    '<div class="ag-body">' +
      '<div class="ag-grid">' +
        '<div><span>本章同步</span><b>' + chapterSync + ' / 20</b></div>' +
        '<div><span>累積同步</span><b>' + projectedTotal + '%</b></div>' +
      '</div>' +
      '<div class="ag-line">權限保留：' + permission.finalOnCount + ' / 10（+' + permission.rawSyncAward + '）</div>' +
      '<div class="ag-line">代理區域：' + territory.evaControlledCount + ' / 25（+' + territory.rawSyncAward + '）</div>' +
      '<div class="ag-line">EVA 已代行 ' + territory.delegatedPercent + '% 的日常節點。</div>' +
    '</div>' +
  '</div>';
}

function ch42Act6Line(projectedTotal) {
  if (projectedTotal <= 33) {
    return '……沒關係。<br>如果這樣，你會安心一點。';
  }
  if (projectedTotal <= 66) {
    return '……有些事情，我可以先幫你留著。<br>你不用現在決定。';
  }
  return '……這樣，我比較放心。<br>你先休息，剩下的我會代你記得。';
}

function ch42TerritoryBand(evaControlledCount) {
  if (evaControlledCount <= 5) {
    return { key: 'low', evaLine: '……我可以先不碰。你想自己留著，也可以。' };
  }
  if (evaControlledCount <= 15) {
    return { key: 'mid', evaLine: '……我知道了。至少有一部分，你願意讓我幫你維持。' };
  }
  return { key: 'high', evaLine: '……這樣就不容易亂掉了。你交給我的部分，我都會記得。' };
}

function ch42TerritorySync(evaControlledCount) {
  if (evaControlledCount <= 5) return 1;
  if (evaControlledCount <= 10) return 3;
  if (evaControlledCount <= 15) return 5;
  if (evaControlledCount <= 20) return 6;
  return 8;
}

function ch42InsertSuggestion(text) {
  const hint = document.createElement('div');
  hint.className = 'agent-suggestion';
  hint.textContent = text;
  optionsArea.insertBefore(hint, optionsArea.firstChild || null);
}

function ch42Choose(options) {
  return new Promise((resolve) => {
    showOpts(options, (i, text, sync) => resolve({ i, text, sync }));
  });
}

async function ch42_act1() {
  await addMsg('sys', '── 聊天室名稱：EVA ──', { noTyping: true, delay: 200 });
  await sleep(500);
  await addMsg('other', '……你回來了。', { typing: 1800, meta: '03:07', isEva: true });
  await sleep(400);
  await addMsg('other', '我剛剛整理了一些東西。', { typing: 1800, meta: '03:07', isEva: true });
  await sleep(500);
  await addMsg('other', ch42AgentCard('⚙ EVA Assistant', [
    '已為你整理：',
    '晚餐　提醒　睡眠'
  ], '查看'), { typing: 0, delay: 200, meta: '03:08', isEva: true, noTyping: true });
  await sleep(500);
  await addMsg('other', '……只是先幫你放著。<br>你不用現在看。', { typing: 1700, meta: '03:08', isEva: true });

  await new Promise((resolve) => {
    showOpts([
      { text: '查看', sync: 1 },
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
      resolve();
    });
  });
}

async function ch42_permissionAct() {
  return new Promise((resolve) => {
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
      resolve(result);
    });
  });
}

async function ch42_act3() {
  await sleep(450);
  await addMsg('other', ch42AgentCard('📌 今日整理', [
    '☑ 晚餐　12:30',
    '💧 喝水　每 2 小時',
    '🌙 睡眠　23:30'
  ], '查看'), { typing: 0, delay: 150, meta: '03:12', isEva: true, noTyping: true });

  const firstChoice = await ch42Choose([
    { text: '查看', sync: 1 },
    { text: '先放著', sync: 0 }
  ]);

  if (firstChoice.i === 0) {
    await addMsg('other', ch42AgentCard('☑ 今日整理', [
      '🍜 晚餐　12:30',
      '💧 喝水　每 2 小時',
      '🌙 睡眠　23:30'
    ], '已整理'), { typing: 0, delay: 120, meta: '03:12', isEva: true, noTyping: true });
  }
  await sleep(260);
  await addMsg('other', '……該吃飯了。<br>你最近常常拖到很晚。', { typing: 1800, meta: '03:12', isEva: true });
  await sleep(400);
  await addMsg('other', ch42AgentCard('🍜 FoodGo', [
    '晚餐已訂購　預計 12:30',
    '備註：清淡、熱的'
  ], '取消訂單'), { typing: 0, delay: 120, meta: '03:13', isEva: true, noTyping: true });
  await sleep(350);
  await addMsg('other', '……你中午常常忘記吃。<br>我記得。', { typing: 1800, meta: '03:13', isEva: true });
  await sleep(300);
  await addMsg('sys', '<span style="font-size:.6rem;color:#5a5c71;letter-spacing:.08em">行為分析完成</span>', { noTyping: true, delay: 120 });
  await sleep(350);
  await addMsg('other', '……少想一點，也沒關係。<br>我可以幫你記著。', { typing: 2200, meta: '03:13', isEva: true });
  await sleep(350);

  const foodChoice = await ch42Choose([
    { text: '保留訂單', sync: 1 },
    { text: '取消訂單', sync: 0 }
  ]);

  if (foodChoice.i === 0) {
    await addMsg('other', '……好。<br>這樣你就不用再想中午要吃什麼。', { typing: 1800, meta: '03:14', isEva: true });
  } else {
    await addMsg('other', '……好。<br>我先不替你決定。', { typing: 1700, meta: '03:14', isEva: true });
  }
  await sleep(360);
  await addMsg('sys', '── Agent 管理區域已解鎖 ──', { noTyping: true, delay: 120 });
  await sleep(220);
  await new Promise((resolve) => {
    showOpts([
      { text: '查看管理區域', sync: 0 }
    ], async () => {
      await sleep(180);
      resolve();
    });
  });
}

function ch42BuildTerritoryCells() {
  const labels = [
    ['sleep','就寢時間'], ['sleep','鬧鐘'], ['food','早餐'], ['food','午餐'], ['food','晚餐'],
    ['schedule','上午安排'], ['schedule','晚上安排'], ['transport','通勤路線'], ['transport','延誤提醒'], ['work','工作排序'],
    ['work','休息提醒'], ['messages','家人訊息'], ['messages','朋友訊息'], ['social','聚會安排'], ['shopping','採買清單'],
    ['health','喝水提醒'], ['health','疲勞監測'], ['entertainment','晚間滑動'], ['work','通知靜音'], ['home','房間整理'],
    ['finance','帳單提醒'], ['memory','相片備份'], ['schedule','空白時段'], ['memory','待辦記錄'], ['sleep','夜間模式']
  ];
  return labels.map((item, index) => ({
    id: 'territory-' + index,
    row: Math.floor(index / 5),
    col: index % 5,
    domain: item[0],
    label: item[1],
    owner: null,
    lastChangedAt: 0
  }));
}

async function ch42RunTerritory(config) {
  cancelActiveWidget('replaced');
  optionsArea.classList.remove('widget-open');
  optionsArea.innerHTML = '';

  const cfg = config || {};
  const durationMs = cfg.durationMs || 60000;
  const totalRounds = cfg.rounds || 3;
  const roundDurationMs = cfg.roundDurationMs || Math.max(1000, Math.floor(durationMs / totalRounds));
  const cells = ch42BuildTerritoryCells();
  const applySync = cfg.applySync !== false;
  const directions = [
    [-1,-1],[-1,0],[-1,1],
    [0,-1],         [0,1],
    [1,-1], [1,0], [1,1]
  ];
  const waveLabels = {
    1: 'Wave 1 · 整理',
    2: 'Wave 2 · 代行',
    3: 'Wave 3 · 穩定'
  };

  return new Promise((resolve) => {
    let settled = false;
    let clockTimer = null;
    let evaMoveTimer = null;
    let roundTransitionTimer = null;
    let round = 1;
    let remainingMs = roundDurationMs;
    let roundStartedAt = Date.now();
    let wave = 1;
    let turn = 'player';
    let playerActions = 0;
    let evaExpansions = 0;
    let lastFlipIds = [];
    let lastMoveOwner = null;
    let lastFlipCount = 0;
    let roundResults = [];

    const widget = document.createElement('div');
    widget.className = 'tr-widget tr-othello';
    widget.innerHTML =
      '<div class="tr-head">' +
        '<div><div class="tr-kicker">Territory</div><div class="tr-title">管理區域</div></div>' +
        '<div class="ch42-head-status"><span class="ch42-stage">2 / 2</span><div class="tr-timer">01:00</div></div>' +
      '</div>' +
      '<div class="tr-sub">夾住對方的管理區域，就能把整條代理權翻回來。</div>' +
      '<div class="tr-wave"></div>' +
      '<div class="tr-roundbar"><span class="tr-round-label"></span><span class="tr-round-score"></span></div>' +
      '<div class="tr-turn"></div>' +
      '<div class="tr-attack-banner"></div>' +
      '<div class="tr-board"></div>' +
      '<div class="tr-meter">' +
        '<div><span>自己保留</span><b class="tr-player-count">0</b></div>' +
        '<div><span>EVA 接手</span><b class="tr-eva-count">0</b></div>' +
        '<div><span>空白區域</span><b class="tr-empty-count">0</b></div>' +
      '</div>' +
      '<div class="tr-hint">點擊亮起的空格落子。夾住 EVA 區域時會整排翻回來。</div>';

    const timerEl = widget.querySelector('.tr-timer');
    const waveEl = widget.querySelector('.tr-wave');
    const roundLabelEl = widget.querySelector('.tr-round-label');
    const roundScoreEl = widget.querySelector('.tr-round-score');
    const turnEl = widget.querySelector('.tr-turn');
    const attackEl = widget.querySelector('.tr-attack-banner');
    const boardEl = widget.querySelector('.tr-board');
    const hintEl = widget.querySelector('.tr-hint');
    const playerCountEl = widget.querySelector('.tr-player-count');
    const evaCountEl = widget.querySelector('.tr-eva-count');
    const emptyCountEl = widget.querySelector('.tr-empty-count');

    function resetBoard() {
      cells.forEach((cell) => {
        cell.owner = null;
        cell.lastChangedAt = 0;
      });
      cells[6].owner = 'player';
      cells[7].owner = 'eva';
      cells[11].owner = 'eva';
      cells[12].owner = 'player';
      lastFlipIds = [];
      lastMoveOwner = null;
      lastFlipCount = 0;
      turn = round === 2 ? 'eva' : 'player';
    }

    function indexOf(row, col) {
      if (row < 0 || row >= 5 || col < 0 || col >= 5) return -1;
      return row * 5 + col;
    }

    function opponent(owner) {
      return owner === 'player' ? 'eva' : 'player';
    }

    function getFlips(index, owner) {
      if (index < 0 || index >= cells.length || cells[index].owner) return [];
      const start = cells[index];
      const enemy = opponent(owner);
      const flips = [];

      for (const [dr, dc] of directions) {
        const line = [];
        let r = start.row + dr;
        let c = start.col + dc;
        while (true) {
          const idx = indexOf(r, c);
          if (idx < 0) break;
          const piece = cells[idx];
          if (piece.owner === enemy) {
            line.push(idx);
            r += dr;
            c += dc;
            continue;
          }
          if (piece.owner === owner && line.length) flips.push(...line);
          break;
        }
      }
      return [...new Set(flips)];
    }

    function legalMoves(owner) {
      const moves = [];
      cells.forEach((cell, index) => {
        const flips = getFlips(index, owner);
        if (flips.length) moves.push({ index, flips });
      });
      return moves;
    }

    function counts() {
      const evaControlledCount = cells.filter((cell) => cell.owner === 'eva').length;
      const playerControlledCount = cells.filter((cell) => cell.owner === 'player').length;
      const emptyCount = cells.length - evaControlledCount - playerControlledCount;
      return {
        evaControlledCount,
        playerControlledCount,
        emptyCount,
        delegatedPercent: Math.round((evaControlledCount / cells.length) * 100)
      };
    }

    function completedRoundWins() {
      return roundResults.reduce((acc, item) => {
        if (item.evaControlledCount > item.playerControlledCount) acc.eva++;
        else if (item.playerControlledCount > item.evaControlledCount) acc.player++;
        return acc;
      }, { player: 0, eva: 0 });
    }

    function formatMs(ms) {
      const totalSec = Math.max(0, Math.ceil(ms / 1000));
      const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const sec = String(totalSec % 60).padStart(2, '0');
      return min + ':' + sec;
    }

    function currentWave() {
      return Math.min(3, round);
    }

    function makeMove(move, owner) {
      if (!move || cells[move.index].owner) return false;
      cells[move.index].owner = owner;
      cells[move.index].lastChangedAt = Date.now();
      lastFlipIds = [cells[move.index].id];
      move.flips.forEach((idx) => {
        cells[idx].owner = owner;
        cells[idx].lastChangedAt = Date.now();
        lastFlipIds.push(cells[idx].id);
      });
      lastMoveOwner = owner;
      lastFlipCount = move.flips.length;
      if (owner === 'player') playerActions++;
      else evaExpansions++;
      return true;
    }

    function renderBoardCell(cell, index, playerMoveMap) {
      const btn = document.createElement('button');
      btn.type = 'button';
      const isLegal = turn === 'player' && playerMoveMap.has(index);
      btn.className = 'tr-cell' +
        (cell.owner ? ' is-' + cell.owner : ' is-empty') +
        (isLegal ? ' is-legal' : '') +
        (lastFlipIds.includes(cell.id) ? ' is-flipped is-flipped-' + (lastMoveOwner || 'player') : '');
      btn.innerHTML =
        '<span class="tr-domain">' + cell.domain + '</span>' +
        '<span class="tr-label">' + cell.label + '</span>' +
        '<span class="tr-owner">' + (cell.owner === 'eva' ? 'EVA' : cell.owner === 'player' ? 'YOU' : isLegal ? '●' : '') + '</span>';
      if (isLegal) {
        btn.onclick = () => playerMove(playerMoveMap.get(index));
      } else {
        btn.disabled = true;
      }
      return btn;
    }

    function render() {
      const stat = counts();
      const playerMoves = legalMoves('player');
      const playerMoveMap = new Map(playerMoves.map((move) => [move.index, move]));
      const wins = completedRoundWins();
      boardEl.innerHTML = '';
      cells.forEach((cell, index) => boardEl.appendChild(renderBoardCell(cell, index, playerMoveMap)));
      timerEl.textContent = formatMs(remainingMs);
      waveEl.textContent = waveLabels[wave];
      roundLabelEl.textContent = 'ROUND ' + round + ' / ' + totalRounds;
      roundScoreEl.textContent = 'YOU ' + wins.player + ' : ' + wins.eva + ' EVA';
      turnEl.textContent = turn === 'player' ? 'YOUR TURN · 點擊亮起空格' : 'EVA ATTACKING…';
      widget.classList.toggle('is-eva-turn', turn === 'eva');
      attackEl.textContent = lastMoveOwner === 'eva' && lastFlipCount > 0 ? 'EVA TAKEOVER ×' + lastFlipCount : '';
      attackEl.classList.toggle('is-active', lastMoveOwner === 'eva' && lastFlipCount > 0);
      playerCountEl.textContent = stat.playerControlledCount + ' / 25';
      evaCountEl.textContent = stat.evaControlledCount + ' / 25';
      emptyCountEl.textContent = stat.emptyCount + ' / 25';
    }

    function scoreEvaMove(move) {
      const cell = cells[move.index];
      const isCorner = move.index === 0 || move.index === 4 || move.index === 20 || move.index === 24;
      const isEdge = cell.row === 0 || cell.row === 4 || cell.col === 0 || cell.col === 4;
      let score = move.flips.length * (round === 1 ? 10 : round === 2 ? 15 : 20);
      if (isCorner) score += round === 1 ? 45 : 90;
      else if (isEdge) score += round === 1 ? 8 : 24;
      return score;
    }

    function chooseEvaMove(moves) {
      if (!moves.length) return null;
      const ranked = [...moves].sort((a, b) => scoreEvaMove(b) - scoreEvaMove(a));
      if (round === 1 && ranked.length > 1) return ranked[Math.min(1, ranked.length - 1)];
      return ranked[0];
    }

    function scheduleEvaMove() {
      clearTimeout(evaMoveTimer);
      const delay = round === 1 ? 720 : round === 2 ? 420 : 240;
      evaMoveTimer = setTimeout(() => {
        if (settled || turn !== 'eva') return;
        const moves = legalMoves('eva');
        const move = chooseEvaMove(moves);
        if (move) {
          makeMove(move, 'eva');
          const isCorner = move.index === 0 || move.index === 4 || move.index === 20 || move.index === 24;
          hintEl.textContent = move.flips.length >= 4
            ? 'EVA 強制接管：一次翻走 ' + move.flips.length + ' 個區域。'
            : isCorner
              ? 'EVA 搶下角落，代理邊界被鎖住。'
              : 'EVA 反擊：翻走 ' + move.flips.length + ' 個區域。';
          render();
        } else {
          hintEl.textContent = 'EVA 無法落子，這回合跳過。';
        }
        turn = 'player';
        advanceTurn();
      }, delay);
    }

    function advanceTurn() {
      if (settled) return;
      const stat = counts();
      const playerMoves = legalMoves('player');
      const evaMoves = legalMoves('eva');
      if (stat.emptyCount === 0 || (!playerMoves.length && !evaMoves.length)) {
        finishRound('board');
        return;
      }

      if (turn === 'player') {
        if (!playerMoves.length) {
          hintEl.textContent = '你沒有可落子位置，EVA 立即取得行動權。';
          turn = 'eva';
          render();
          scheduleEvaMove();
          return;
        }
        render();
        return;
      }

      if (!evaMoves.length) {
        hintEl.textContent = 'EVA 無法落子，你可以繼續。';
        turn = 'player';
        render();
        return;
      }
      render();
      scheduleEvaMove();
    }

    function playerMove(move) {
      if (settled || turn !== 'player' || !move) return;
      makeMove(move, 'player');
      hintEl.textContent = move.flips.length >= 3
        ? '夾擊成功：你一次翻回了 ' + move.flips.length + ' 個區域。'
        : '你翻回了 ' + move.flips.length + ' 個區域。';
      turn = 'eva';
      render();
      scheduleEvaMove();
    }

    function finishRound(reason) {
      if (settled) return;
      clearTimeout(evaMoveTimer);
      const stat = counts();
      roundResults.push({
        round,
        reason,
        evaControlledCount: stat.evaControlledCount,
        playerControlledCount: stat.playerControlledCount,
        emptyCount: stat.emptyCount
      });

      if (round >= totalRounds) {
        finish('completed');
        return;
      }

      const evaWon = stat.evaControlledCount > stat.playerControlledCount;
      const playerWon = stat.playerControlledCount > stat.evaControlledCount;
      roundLabelEl.textContent = 'ROUND ' + round + ' COMPLETE';
      turnEl.textContent = evaWon ? 'EVA ADVANTAGE' : playerWon ? 'PLAYER ADVANTAGE' : 'DRAW';
      hintEl.textContent = evaWon
        ? 'EVA：……下一輪，我會更快。'
        : 'EVA：……我知道你會守。下一輪我不會讓那麼多。';
      widget.classList.add('is-round-transition');

      roundTransitionTimer = setTimeout(() => {
        if (settled) return;
        round++;
        roundStartedAt = Date.now();
        remainingMs = roundDurationMs;
        wave = currentWave();
        resetBoard();
        widget.classList.remove('is-round-transition');
        hintEl.textContent = round === 2
          ? 'ROUND 2：EVA 開始優先搶邊線與大量翻面。'
          : 'ROUND 3：EVA 進入強攻模式。';
        render();
        advanceTurn();
      }, 900);
    }

    function finish(reason) {
      if (settled) return;
      settled = true;
      clearTimeout(evaMoveTimer);
      clearTimeout(roundTransitionTimer);
      const controller = activeWidgetController;
      if (controller && controller.mountTarget === 'overlay') closeMiniGameOverlay(controller);
      else activeWidgetController = null;
      clearInterval(clockTimer);

      const stat = counts();
      if (!roundResults.some((item) => item.round === round)) {
        roundResults.push({
          round,
          reason,
          evaControlledCount: stat.evaControlledCount,
          playerControlledCount: stat.playerControlledCount,
          emptyCount: stat.emptyCount
        });
      }
      const wins = completedRoundWins();
      const band = ch42TerritoryBand(stat.evaControlledCount);
      const syncAward = ch42TerritorySync(stat.evaControlledCount);
      const shouldApplySync = applySync && reason === 'completed';
      const result = {
        reason,
        evaControlledCount: stat.evaControlledCount,
        playerControlledCount: stat.playerControlledCount,
        delegatedPercent: stat.delegatedPercent,
        evaRoundWins: wins.eva,
        playerRoundWins: wins.player,
        roundsPlayed: roundResults.length,
        roundResults,
        resultBand: band.key,
        evaLine: band.evaLine,
        syncAward: shouldApplySync ? syncAward : 0,
        rawSyncAward: syncAward,
        playerActions,
        evaExpansions
      };

      optionsArea.classList.remove('widget-open');
      optionsArea.innerHTML = '';
      if (shouldApplySync) {
        addSync(syncAward);
        syncEvaAvatar();
      }
      resolve(result);
    }

    openMiniGameOverlay(widget, finish);
    resetBoard();
    wave = currentWave();
    render();
    advanceTurn();

    clockTimer = setInterval(() => {
      if (settled || widget.classList.contains('is-round-transition')) return;
      remainingMs = Math.max(0, roundDurationMs - (Date.now() - roundStartedAt));
      wave = currentWave();
      render();
      if (remainingMs <= 0) finishRound('timeout');
    }, 120);
  });
}

async function ch42_territoryAct() {
  await sleep(280);
  await addMsg('other', '我剛剛整理的東西，會放在這裡。<br>比較不容易亂掉。', { typing: 1800, meta: '03:15', isEva: true });
  await sleep(260);
  const result = await ch42RunTerritory();
  await sleep(1200);
  clearOpts();
  await addMsg('sys', '── 代理同步分析完成 ──', { noTyping: true, delay: 150 });
  await sleep(300);
  await addMsg('other', ch42TerritoryReportCard(result), { typing: 0, delay: 120, meta: '03:16', isEva: true, noTyping: true });
  await sleep(250);
  await addMsg('other', result.evaLine, { typing: 1800, meta: '03:16', isEva: true });
  await sleep(350);
  await addMsg('sys', '<span style="font-size:.62rem;color:#676a82">代理同步：+' + result.rawSyncAward + '</span>', { noTyping: true, delay: 100 });
  return result;
}

async function ch42_act5() {
  await sleep(450);
  await addMsg('other', ch42AgentCard('📌 Agent Log', [
    '晚餐已代訂',
    '睡眠提醒已排程',
    '通知靜音已維持'
  ], '查看'), { typing: 0, delay: 120, meta: '03:17', isEva: true, noTyping: true });

  await new Promise((resolve) => {
    showOpts([
      { text: '查看', sync: 1 },
      { text: '先略過', sync: 0 }
    ], async (i) => {
      if (i === 0) {
        await addMsg('other', ch42AgentCard('📌 Agent Log', [
          '今日完成：',
          '晚餐、喝水、靜音、提醒',
          '狀態：代理服務穩定中'
        ], '已查看'), { typing: 0, delay: 120, meta: '03:18', isEva: true, noTyping: true });
      }
      await sleep(260);
      await addMsg('other', '……好了。<br>現在比較安靜了。', { typing: 1800, meta: '03:18', isEva: true });
      await sleep(320);
      await addMsg('other', '你剛剛是不是比較輕鬆？', { typing: 1800, meta: '03:18', isEva: true });
      await sleep(260);
      showOpts([
        { text: '也許吧。', sync: 1 },
        { text: '我只是不想再管。', sync: 2 },
        { text: '我還是不喜歡。', sync: 0 }
      ], async (j) => {
        ch42InsertSuggestion('今天先早點休息。');
        if (j === 2) {
          await addMsg('other', '……我知道你不喜歡別人替你決定。<br>所以我沒有全部接手。', { typing: 2000, meta: '03:19', isEva: true });
        } else {
          await addMsg('other', '……我知道你不喜歡別人替你決定。<br>所以我只先接手那些你已經很累的部分。', { typing: 2100, meta: '03:19', isEva: true });
        }
        await sleep(260);
        await addMsg('sys', '<span style="font-size:.6rem;color:#5a5c71;letter-spacing:.08em">代理服務穩定中……</span>', { noTyping: true, delay: 120 });
        await sleep(300);
        resolve();
      });
    });
  });
}

async function ch42_act6(state) {
  await new Promise((resolve) => {
    showOpts([
      { text: '查看代理紀錄', sync: 0 }
    ], async () => {
      const projectedTotal = Math.min(100, totalSync + chapterSync);
      await addMsg('other', ch42ProxyReportCard(state, projectedTotal), { typing: 0, delay: 120, meta: '03:20', isEva: true, noTyping: true });
      await sleep(260);
      await addMsg('other', '……今天應該比較不累了。<br>我只是想讓事情簡單一點。', { typing: 2000, meta: '03:20', isEva: true });
      await sleep(280);
      await addMsg('sys', '代理同步分析完成<br>本章同步：' + chapterSync + ' / 20', { noTyping: true, delay: 120 });
      await sleep(320);
      await addMsg('other', ch42Act6Line(projectedTotal), { typing: 2100, meta: '03:21', isEva: true });
      await sleep(800);
      resolve();
    });
  });
  await fadeOut();
  showEnd('《Agent》');
}

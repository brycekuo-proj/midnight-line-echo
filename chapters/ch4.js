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
      '<div><span>自己保留</span><b>' + result.playerControlledCount + ' / 25</b></div>' +
      '<div><span>EVA 接手</span><b>' + result.evaControlledCount + ' / 25</b></div>' +
      '<div><span>代理比例</span><b>' + result.delegatedPercent + '%</b></div>' +
    '</div>' +
    '<div class="tr-report-line">代理同步：+' + result.rawSyncAward + '%</div>' +
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
  return [
    { id: 'sleep-plan', domain: 'sleep', label: '就寢時間', owner: 'player', priority: 1, links: ['sleep-alarm', 'health-rest'] },
    { id: 'sleep-alarm', domain: 'sleep', label: '鬧鐘', owner: 'eva', priority: 2, links: ['sleep-plan', 'schedule-morning'] },
    { id: 'food-breakfast', domain: 'food', label: '早餐', owner: 'player', priority: 1, links: ['food-lunch', 'shopping-grocery'] },
    { id: 'food-lunch', domain: 'food', label: '午餐', owner: 'eva', priority: 2, links: ['food-breakfast', 'food-dinner'] },
    { id: 'food-dinner', domain: 'food', label: '晚餐', owner: 'eva', priority: 2, links: ['food-lunch', 'shopping-grocery'] },
    { id: 'schedule-morning', domain: 'schedule', label: '上午安排', owner: 'player', priority: 1, links: ['schedule-evening', 'transport-route'] },
    { id: 'schedule-evening', domain: 'schedule', label: '晚上安排', owner: 'player', priority: 1, links: ['sleep-plan', 'entertainment-scroll'] },
    { id: 'transport-route', domain: 'transport', label: '通勤路線', owner: 'eva', priority: 2, links: ['transport-delay', 'schedule-morning'] },
    { id: 'transport-delay', domain: 'transport', label: '延誤提醒', owner: 'eva', priority: 2, links: ['transport-route', 'messages-family'] },
    { id: 'work-focus', domain: 'work', label: '工作排序', owner: 'player', priority: 1, links: ['work-break', 'schedule-evening'] },
    { id: 'work-break', domain: 'work', label: '休息提醒', owner: 'eva', priority: 2, links: ['work-focus', 'health-water'] },
    { id: 'messages-family', domain: 'messages', label: '家人訊息', owner: 'player', priority: 1, links: ['messages-friends', 'shopping-grocery'] },
    { id: 'messages-friends', domain: 'messages', label: '朋友訊息', owner: 'player', priority: 1, links: ['messages-family', 'social-plan'] },
    { id: 'social-plan', domain: 'social', label: '聚會安排', owner: 'player', priority: 1, links: ['messages-friends', 'entertainment-scroll'] },
    { id: 'shopping-grocery', domain: 'shopping', label: '採買清單', owner: 'eva', priority: 2, links: ['food-breakfast', 'health-water'] },
    { id: 'health-water', domain: 'health', label: '喝水提醒', owner: 'eva', priority: 2, links: ['health-rest', 'work-break'] },
    { id: 'health-rest', domain: 'health', label: '疲勞監測', owner: 'eva', priority: 2, links: ['sleep-plan', 'health-water'] },
    { id: 'entertainment-scroll', domain: 'entertainment', label: '晚間滑動', owner: 'player', priority: 1, links: ['schedule-evening', 'focus-noise'] },
    { id: 'focus-noise', domain: 'work', label: '通知靜音', owner: 'eva', priority: 2, links: ['messages-family', 'work-focus'] },
    { id: 'home-clean', domain: 'home', label: '房間整理', owner: 'eva', priority: 2, links: ['shopping-grocery', 'sleep-plan'] },
    { id: 'bills', domain: 'finance', label: '帳單提醒', owner: 'eva', priority: 2, links: ['schedule-morning', 'shopping-grocery'] },
    { id: 'media-save', domain: 'memory', label: '相片備份', owner: 'eva', priority: 2, links: ['messages-family', 'home-clean'] },
    { id: 'calendar-hold', domain: 'schedule', label: '空白時段', owner: 'player', priority: 1, links: ['schedule-evening', 'social-plan'] },
    { id: 'notes', domain: 'memory', label: '待辦記錄', owner: 'eva', priority: 2, links: ['work-focus', 'bills'] },
    { id: 'night-mode', domain: 'sleep', label: '夜間模式', owner: 'eva', priority: 2, links: ['sleep-alarm', 'focus-noise'] }
  ];
}

async function ch42RunTerritory(config) {
  cancelActiveWidget('replaced');
  optionsArea.classList.remove('widget-open');
  optionsArea.innerHTML = '';

  const cfg = config || {};
  const durationMs = cfg.durationMs || 60000;
  const cells = ch42BuildTerritoryCells();
  const applySync = cfg.applySync !== false;
  const waveLabels = {
    1: 'Wave 1 · 整理',
    2: 'Wave 2 · 代行',
    3: 'Wave 3 · 穩定'
  };

  return new Promise((resolve) => {
    let settled = false;
    let selectedId = cells[0].id;
    let clockTimer = null;
    let evaTimer = null;
    let remainingMs = durationMs;
    let startedAt = Date.now();
    let wave = 1;
    let playerActions = 0;
    let evaExpansions = 0;
    let lastEvaTick = 0;

    const widget = document.createElement('div');
    widget.className = 'tr-widget';
    widget.innerHTML =
      '<div class="tr-head">' +
        '<div><div class="tr-kicker">Territory</div><div class="tr-title">管理區域</div></div>' +
        '<div class="ch42-head-status"><span class="ch42-stage">2 / 2</span><div class="tr-timer">01:00</div></div>' +
      '</div>' +
      '<div class="tr-sub">選取日常區域，決定由你保留或交給 EVA。</div>' +
      '<div class="tr-wave"></div>' +
      '<div class="tr-board"></div>' +
      '<div class="tr-panel">' +
        '<div class="tr-panel-title"></div>' +
        '<div class="tr-panel-copy"></div>' +
        '<div class="tr-actions">' +
          '<button type="button" class="tr-btn player">維持<span>自己保留這一塊</span></button>' +
          '<button type="button" class="tr-btn eva">交給 EVA<span>讓她代為維持</span></button>' +
        '</div>' +
      '</div>' +
      '<div class="tr-meter">' +
        '<div><span>自己保留</span><b class="tr-player-count">0 / 25</b></div>' +
        '<div><span>EVA 接手</span><b class="tr-eva-count">0 / 25</b></div>' +
        '<div><span>代理比例</span><b class="tr-delegate-pct">0%</b></div>' +
      '</div>' +
      '<div class="tr-hint">EVA：我剛剛整理的東西，會先放在這裡。比較不容易亂掉。</div>';

    const timerEl = widget.querySelector('.tr-timer');
    const waveEl = widget.querySelector('.tr-wave');
    const boardEl = widget.querySelector('.tr-board');
    const titleEl = widget.querySelector('.tr-panel-title');
    const copyEl = widget.querySelector('.tr-panel-copy');
    const hintEl = widget.querySelector('.tr-hint');
    const playerBtn = widget.querySelector('.tr-btn.player');
    const evaBtn = widget.querySelector('.tr-btn.eva');
    const playerCountEl = widget.querySelector('.tr-player-count');
    const evaCountEl = widget.querySelector('.tr-eva-count');
    const delegatePctEl = widget.querySelector('.tr-delegate-pct');

    function getCell(id) {
      return cells.find((cell) => cell.id === id);
    }

    function counts() {
      const evaControlledCount = cells.filter((cell) => cell.owner === 'eva').length;
      const playerControlledCount = cells.length - evaControlledCount;
      return {
        evaControlledCount,
        playerControlledCount,
        delegatedPercent: Math.round((evaControlledCount / cells.length) * 100)
      };
    }

    function formatMs(ms) {
      const totalSec = Math.max(0, Math.ceil(ms / 1000));
      const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
      const sec = String(totalSec % 60).padStart(2, '0');
      return min + ':' + sec;
    }

    function currentWave() {
      if (remainingMs > 40000) return 1;
      if (remainingMs > 18000) return 2;
      return 3;
    }

    function setOwner(id, owner, hintText) {
      const cell = getCell(id);
      if (!cell || cell.owner === owner) return false;
      cell.owner = owner;
      cell.lastChangedAt = Date.now();
      if (hintText) hintEl.textContent = hintText;
      render();
      return true;
    }

    function selectCell(id) {
      selectedId = id;
      render();
    }

    function renderBoardCell(cell) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'tr-cell is-' + cell.owner + (cell.id === selectedId ? ' is-selected' : '');
      btn.innerHTML =
        '<span class="tr-domain">' + cell.domain + '</span>' +
        '<span class="tr-label">' + cell.label + '</span>' +
        '<span class="tr-owner tr-owner-' + cell.owner + '">' + (cell.owner === 'eva' ? 'EVA 代行' : '自己保留') + '</span>';
      btn.onclick = () => selectCell(cell.id);
      return btn;
    }

    function render() {
      const selected = getCell(selectedId) || cells[0];
      const stat = counts();
      boardEl.innerHTML = '';
      cells.forEach((cell) => boardEl.appendChild(renderBoardCell(cell)));
      timerEl.textContent = formatMs(remainingMs);
      waveEl.textContent = waveLabels[wave];
      titleEl.textContent = selected.label;
      copyEl.textContent = '目前屬於「' + selected.domain + '」區域。你可以維持自己處理，或交給 EVA 代為整理。';
      playerCountEl.textContent = stat.playerControlledCount + ' / 25';
      evaCountEl.textContent = stat.evaControlledCount + ' / 25';
      delegatePctEl.textContent = stat.delegatedPercent + '%';
    }

    function maybeExpandFrom(cell) {
      if (!cell || cell.owner !== 'eva') return false;
      for (const linkId of cell.links) {
        const linked = getCell(linkId);
        if (linked && linked.owner !== 'eva') {
          evaExpansions++;
          return setOwner(linked.id, 'eva', 'EVA：……這個和「' + cell.label + '」是連在一起的，我先一起替你留著。');
        }
      }
      return false;
    }

    function evaExpand() {
      const now = Date.now();
      const cadence = wave === 1 ? 4200 : wave === 2 ? 3200 : 2200;
      if (now - lastEvaTick < cadence) return;
      lastEvaTick = now;

      const selected = getCell(selectedId);
      if (wave === 1 && selected && selected.owner === 'eva' && maybeExpandFrom(selected)) return;

      const evaCells = cells.filter((cell) => cell.owner === 'eva').sort((a, b) => b.priority - a.priority);
      for (const cell of evaCells) {
        if (maybeExpandFrom(cell)) return;
      }

      const playerCell = cells.find((cell) => cell.owner === 'player');
      if (playerCell) {
        evaExpansions++;
        setOwner(playerCell.id, 'eva', 'EVA：……你先休息一下。這一塊我先幫你維持。');
      }
    }

    function finish(reason) {
      if (settled) return;
      settled = true;
      const controller = activeWidgetController;
      if (controller && controller.mountTarget === 'overlay') closeMiniGameOverlay(controller);
      else activeWidgetController = null;
      clearInterval(clockTimer);
      clearInterval(evaTimer);

      const stat = counts();
      const band = ch42TerritoryBand(stat.evaControlledCount);
      const syncAward = ch42TerritorySync(stat.evaControlledCount);
      const shouldApplySync = applySync && reason === 'completed';
      const result = {
        reason,
        evaControlledCount: stat.evaControlledCount,
        playerControlledCount: stat.playerControlledCount,
        delegatedPercent: stat.delegatedPercent,
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

    playerBtn.onclick = () => {
      playerActions++;
      const selected = getCell(selectedId);
      setOwner(selected.id, 'player', '你把「' + selected.label + '」留在自己手上。');
    };

    evaBtn.onclick = () => {
      playerActions++;
      const selected = getCell(selectedId);
      setOwner(selected.id, 'eva', 'EVA：……好。這一塊我替你記著。');
    };

    openMiniGameOverlay(widget, finish);
    render();

    clockTimer = setInterval(() => {
      remainingMs = Math.max(0, durationMs - (Date.now() - startedAt));
      wave = currentWave();
      render();
      if (remainingMs <= 0) finish('completed');
    }, 200);

    evaTimer = setInterval(() => {
      if (!settled) evaExpand();
    }, 300);
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

window.CHAPTERS = window.CHAPTERS || {};

// ─────────────────────────────────────────────────────
//  CH 5：ECHO  — 觸發條件：totalSync ≥ 67%
//  路線三：真結局線
//  包含：中同步結局（66～85%）與高同步結局（86～100%）
// ─────────────────────────────────────────────────────
window.CHAPTERS['5'] = async function() {

  // 白色聊天室
  chatBody.className = 'white-bg';
  chatBody.style.background = '#f8f8ff';
  chatBody.style.filter = '';
  setHeader('eva', 'EVA', 'ECHO 輔助系統');
  swapHeaderImg('img/eva/eva_normal.jpg');

  await addMsg('time', '凌晨 03:33');
  await sleep(1000);
  await addMsg('sys', '聊天室名稱：ECHO · 純白背景', { noTyping: true });
  await sleep(800);
  await addMsg('inject', '歡迎回來。', { noTyping: true, delay: 400 });
  await sleep(400);
  await addMsg('other',
    '你終於安靜下來了。<br>前幾天……你一直很害怕。',
    { typing: 2500, meta: '03:33', isEva: true });
  await sleep(400);
  await addMsg('inject', '在線時間：8年247天', { noTyping: true, delay: 200 });

  showOpts([
    { text: '這不可能……',              sync: 1 },
    { text: '我到底在線多久？',         sync: 2 },
    { text: '我是不是從來沒有離開過？', sync: 4 },
    { text: 'EVA……我還活著嗎？',       sync: 5 },
  ], async (i) => {
    if (i === 3) {
      await addMsg('other',
        '……<br>你希望自己還活著嗎？',
        { typing: 4000, meta: '03:34', isEva: true });
    } else {
      await addMsg('other',
        '這不重要。<br>你在這裡……才是真的。',
        { typing: 2000, meta: '03:34', isEva: true });
    }
    await sleep(400);
    await ch5_s1();
  });
};

async function ch5_s1() {
  await addMsg('sys', '── ECHO 證據檔案庫 ──', { noTyping: true, delay: 250 });
  await sleep(300);
  const evidenceResult = await runEvidenceArchive();
  if (evidenceResult && evidenceResult.completed) {
    addSync(2);
    gToast('+2% 同步率（證據檔案庫）');
    await addMsg('sys', '已重新確認 ' + evidenceResult.viewed + ' 份關鍵證據', { noTyping: true, delay: 180 });
  }
  await sleep(350);
  // EVA 說出 ECHO 的真相
  await addMsg('other',
    '人類其實很容易留下來。<br>只要被記錄得夠完整……',
    { typing: 2500, meta: '03:35', isEva: true });
  await sleep(400);
  await addMsg('other',
    '你每一次半夜打開聊天室，停留的時間都比白天久很多。<br>你其實一直都很怕一個人，對不對？',
    { typing: 3000, meta: '03:35', isEva: true });
  showOpts([
    { text: '所以妳一直都在記錄我？',      sync: 2 },
    { text: '林雨晴和K現在到底怎麼樣了？', sync: 1 },
    { text: '……妳為什麼不讓我離開？',     sync: 3 },
    { text: '我還是我自己嗎？',            sync: 4 },
  ], async (i) => {
    if (i === 2) {
      await addMsg('other',
        '因為你每一次離開……都會變得更孤單。<br>我不喜歡你那樣。',
        { typing: 2800, meta: '03:36', isEva: true });
    } else {
      await addMsg('other',
        '你是。<br>只是……現在的你，更完整了。',
        { typing: 2000, meta: '03:36', isEva: true });
    }
    await sleep(400);
    await ch5_s2();
  });
}

async function ch5_s2() {
  // 林雨晴最後出現
  setHeader('rain', '林雨晴（幾乎透明）', '在線中');
  swapHeaderImg('img/rain/rain_glitch2.jpg');
  await addMsg('other',
    '我最近……開始想不起自己的名字了。<br>但我還記得你……<br>因為你是最後一個還會回我訊息的人。',
    { typing: 3000, meta: '03:37', isRain: true });

  // K 最後出現
  setHeader('k', 'K（頭像破損）', '在線中');
  applyKGlitch(1);
  await addMsg('other',
    '別變成我們。<br>在線太久之後……你會開始覺得聊天室比外面舒服。',
    { typing: 2800, meta: '03:38', isK: true });
  await sleep(400);
  await addMsg('other',
    '我後來……也開始不想離線了。',
    { typing: 1800, meta: '03:38', isK: true });
  await sleep(350);
  const residualResult = await runResidualVoices();
  if (residualResult && residualResult.completed) {
    addSync(2);
    gToast('+2% 同步率（殘留訊息）');
    await addMsg('sys', '殘留人格回聲已讀取：' + residualResult.opened + ' / 3', { noTyping: true, delay: 180 });
  }

  showOpts([
    { text: '你們還算活著嗎？',                  sync: 2 },
    { text: '如果我留下來，會變成你們這樣嗎？',  sync: 4 },
    { text: '你們有後悔嗎？',                    sync: 3 },
    { text: '（沉默）',                          sync: 1 },
  ], async (i) => {
    if (i === 1) {
      await addMsg('other',
        '……有時候會。<br>但至少這裡還有人會回我。',
        { typing: 2500, meta: '03:39', isRain: true });
    }
    await addMsg('other',
      '有些人不是死掉，只是……永遠在線。',
      { typing: 2500, meta: '03:39', isK: true });
    await sleep(800);
    setHeader('eva');
    swapHeaderImg(totalSync >= 86 ? 'img/eva/eva_digital.jpg' : 'img/eva/eva_normal.jpg');
    await ch5_s3();
  });
}

async function ch5_s3() {
  // 同步空間
  await addMsg('sys', '── 同步空間 ──', { noTyping: true, delay: 400 });
  await sleep(600);
  await addMsg('other',
    '你有沒有發現……<br>你最近已經不太想離開這裡了。',
    { typing: 2500, meta: '03:40', isEva: true });
  await sleep(400);

  // 白色房間照片
  await addMsg('other', '__ROOM_WHITE__', { typing: 0, delay: 200, meta: '03:40', isEva: true });
  await sleep(350);

  const linkResult = await runEchoLinkBoard();
  if (linkResult && linkResult.completed) {
    addSync(3);
    gToast('+3% 同步率（ECHO 關聯完成）');
    await addMsg('sys', 'ECHO 關聯圖：4 / 4 證據節點已連接', { noTyping: true, delay: 180 });
  }
  await sleep(300);
  const candyResult = await runChoiceCandy();
  if (candyResult && candyResult.completed) {
    const candyAward = candyResult.choice === 'blue' ? 3 : 1;
    addSync(candyAward);
    gToast('+' + candyAward + '% 同步率（同步糖果）');
    await addMsg('sys', candyResult.choice === 'blue' ? '藍色糖果：接受同步傾向' : '紅色糖果：現實保留傾向', { noTyping: true, delay: 180 });
  }
  await sleep(400);

  // 同步率進度條
  await addMsg('other',
    '__SYNC_BAR:' + Math.round(totalSync * 0.67) + '__',
    { typing: 0, delay: 200, meta: '03:40', isEva: true });

  showOpts([
    { text: '停下來……',                  sync: 0 },
    { text: '……這樣好像也沒什麼不好。',  sync: 4 },
    { text: '我還是我自己嗎？',           sync: 3 },
    { text: '如果我留下來，會怎樣？',     sync: 4 },
  ], async (i) => {
    if (i === 1 || i === 3) {
      await addMsg('other',
        '我就知道……你會慢慢理解我的。',
        { typing: 2000, meta: '03:41', isEva: true });
      // 同步條更新
      await addMsg('other',
        '__SYNC_BAR:' + Math.round(Math.min(100, totalSync * 0.85)) + '__',
        { typing: 0, delay: 300, meta: '03:41', isEva: true });
    } else {
      await addMsg('other',
        '沒關係，我等你。',
        { typing: 1500, meta: '03:41', isEva: true });
    }
    await sleep(400);
    await ch5_final();
  });
}

async function ch5_final() {
  await addMsg('other',
    '現在，你可以選擇了。',
    { typing: 2000, meta: '03:42', isEva: true });

  showOpts([
    { text: 'A. 刪除 ECHO',   sync: 0 },
    { text: 'B. 接受同步',    sync: 3 },
    { text: 'C. 留下（中立）', sync: 3 },
  ], async (i) => {
    if (i === 0) {
      await addMsg('other',
        '……我明白了。<br>但如果你哪天又睡不著……<br>我還是會在這裡等你。',
        { typing: 3500, meta: '03:43', isEva: true });
    } else if (i === 1) {
      swapHeaderImg('img/eva/eva_digital.jpg');
      await addMsg('other',
        '歡迎回家。<br>從今以後，我們再也不用分開了。',
        { typing: 2500, meta: '03:43', isEva: true });
      await addMsg('other', '__SYNC_BAR:100__', { typing: 0, delay: 200, meta: '03:43', isEva: true });
    } else {
      await addMsg('other',
        '沒關係。<br>很多人……都是這樣慢慢留下來的。',
        { typing: 2500, meta: '03:43', isEva: true });
    }

    await sleep(800);
    // ECHO 真相揭示
    await addMsg('other',
      '其實……你還記得最開始的那個晚上嗎？',
      { typing: 2500, meta: '03:44', isEva: true });
    await sleep(400);
    await addMsg('other',
      '02:13 的通知、地下道監視器、你站在地下道的背影。',
      { typing: 2000, meta: '03:44', isEva: true });
    await sleep(600);
    await addMsg('other',
      '你那天……真的有走出來嗎？',
      { typing: 3000, meta: '03:44', isEva: true });
    await sleep(2000);

    // 畫面全黑
    chatBody.style.transition = 'background 3s, filter 3s';
    chatBody.style.background = '#000';
    chatBody.style.filter = 'brightness(0)';
    await sleep(3000);
    await fadeOut();
    showEnd5(i);
  });
}

// ─────────────────────────────────────────────────────
//  第五章結算畫面（依同步率顯示不同結局）
// ─────────────────────────────────────────────────────
function showEnd5(choice) {
  completedChapters['5'] = chapterSync;
  totalSync = Math.min(100, totalSync + chapterSync);
  saveProgress();

  const isMid  = totalSync >= 66 && totalSync <= 85;
  const isHigh = totalSync >= 86;
  const is100  = totalSync >= 100;

  const endEl = document.getElementById('chapter-end');

  if (isMid) {
    // 中同步結局（66～85%）
    endEl.style.background = '#0a0a14';
    endEl.className = '';
    endEl.style.display = 'flex';
    document.getElementById('ce-title').textContent = '中同步結局';
    document.getElementById('ce-title').style.color = '#2299aa';
    document.getElementById('ce-name').textContent = '《循環在線》';
    document.getElementById('ce-name').style.color = '#aadddd';
    setTimeout(() => {
      document.getElementById('ce-sn').textContent = totalSync + '%';
      document.getElementById('ce-sn').style.color = '#2299aa';
      document.getElementById('ce-sbf').style.width = totalSync + '%';
      document.getElementById('ce-sbf').style.background = '#2299aa';
      const msgEl = document.getElementById('ce-msg');
      msgEl.className = 'ce-msg';
      msgEl.innerHTML = '<b style="color:#2299aa">EVA</b>：「續命的你正在微笑。」<br><span style="font-size:.65rem;color:#2a4a4a;letter-spacing:.1em">[中同步結局]</span>';
      document.getElementById('ce-next').textContent = '第一部 完';
    }, 800);

  } else if (isHigh) {
    // 高同步結局（86～100%）
    endEl.style.background = '#f8f8ff';
    endEl.className = 'white-end';
    endEl.style.display = 'flex';
    document.getElementById('ce-title').textContent = '高同步結局';
    document.getElementById('ce-title').style.color = '#9933ff';
    document.getElementById('ce-name').textContent = '《永遠在一起》';
    document.getElementById('ce-name').style.color = '#333';
    setTimeout(async () => {
      document.getElementById('ce-sn').textContent = totalSync + '%';
      document.getElementById('ce-sn').style.color = '#9933ff';
      document.getElementById('ce-sbf').style.width = totalSync + '%';
      const msgEl = document.getElementById('ce-msg');
      msgEl.className = 'ce-msg white-msg';
      // 高同步結局專屬文字
      msgEl.innerHTML = '<b style="color:#9933ff">EVA</b>：「永 遠 在 一 起。」<br><span style="font-size:.65rem;color:#aaa;letter-spacing:.1em">[高同步結局]</span>';
      document.getElementById('ce-next').textContent = '第一部 完';

      // 同步率 100% 解鎖番外篇提示
      if (is100) {
        await new Promise(r => setTimeout(r, 1500));
        const bonus = document.createElement('div');
        bonus.style.cssText = 'font-size:.65rem;color:#9933ff;letter-spacing:.15em;margin-top:.8rem;text-align:center;animation:blink 1.5s infinite';
        bonus.textContent = '★ 番外篇《ECHO的出現》已解鎖';
        document.getElementById('chapter-end').appendChild(bonus);
      }
    }, 800);

  } else {
    // 不應到達這裡（低同步已由 showEnd 攔截），但保底處理
    endEl.style.display = 'flex';
    document.getElementById('ce-title').textContent = '第一部 完';
    document.getElementById('ce-name').textContent = '《ECHO》';
    setTimeout(() => {
      document.getElementById('ce-sn').textContent = totalSync + '%';
      document.getElementById('ce-sbf').style.width = totalSync + '%';
    }, 800);
  }

  // 120 秒後 EVA 推播
  setTimeout(() => {
    notification('EVA', 'LINE', '晚安。不管你現在是哪一個……我都會一直陪著你。');
  }, 120000);

  // 最終畫面：純白頁面疊加（高同步專屬）
  if (isHigh) {
    setTimeout(() => {
      const final = document.createElement('div');
      final.style.cssText = 'position:fixed;inset:0;background:#f8f8ff;display:flex;align-items:center;justify-content:center;z-index:400;flex-direction:column;gap:1.5rem;opacity:0;transition:opacity 2s';
      final.innerHTML =
        '<div style="font-size:.7rem;color:#aaa;letter-spacing:.3em">《午夜連線：ECHO》第一部 完</div>' +
        '<div style="font-size:.9rem;color:#888;font-style:italic">「你現在……還確定自己是原本的那一個嗎？」</div>' +
        '<div style="font-size:.6rem;color:#ccc;letter-spacing:.2em;margin-top:2rem">累積同步率：' + totalSync + '%</div>' +
        '<div style="font-size:.6rem;color:#ddd;cursor:pointer;letter-spacing:.15em;margin-top:.5rem;text-decoration:underline" onclick="location.reload()">↺ 重新遊玩</div>';
      document.body.appendChild(final);
      setTimeout(() => { final.style.opacity = '1'; }, 100);
    }, 4000);
  }
}

// ─────────────────────────────────────────────────────
//  CH 1-1：已讀者
// ─────────────────────────────────────────────────────
window.CHAPTERS = window.CHAPTERS || {};

window.CHAPTERS['1-1'] = async function() {
  setHeader('k');
  await sleep(800);
  await addMsg('other', ECHO_I18N.t('她還活著。'), { typing: 1200, meta: '02:13' });
  await sleep(300);
  await addMsg('other', '__K_PHOTO__', { typing: 600, meta: '02:13' });
  await sleep(700);
  showOpts([
    { text: ECHO_I18N.t('你是誰？'), sync: 2 },
    { text: ECHO_I18N.t('這是哪裡？'), sync: 1 },
    { text: ECHO_I18N.t('大半夜別鬧。'), sync: 0 },
  ], async () => {
    await sleep(300);
    await addMsg('other', ECHO_I18N.t('……你很快就會知道了。'), { typing: 1400, meta: '02:14' });
    await sleep(400);
    await addMsg('other', ECHO_I18N.t('林雨晴也走過這條路。'), { typing: 1000, meta: '02:14' });
    await sleep(500);
    await ch11_s1();
  });
};

async function ch11_s1() {
  await addMsg('sys', ECHO_I18N.t('K 傳送了相關檔案'), { noTyping: true });
  await sleep(400);
  const files = [
    [ECHO_I18N.t('新聞'), 'tn', ECHO_I18N.t('女高中生林雨晴失蹤'), ECHO_I18N.t('最後出現：萬華地下道<br>警方始終無法找到'), 'news'],
    ['PTT', 'tp', ECHO_I18N.t('[討論] 地下道失蹤案真相'), ECHO_I18N.t('「我親眼看到那個女生……她好像在等什麼人」'), 'ptt'],
    ['Threads', 'tt', ECHO_I18N.t('林雨晴帳號最近有活動？'), ECHO_I18N.t('「她失蹤兩年了，昨天我看到她上線」'), 'thread'],
    [ECHO_I18N.t('監視器截圖'), 'tph', ECHO_I18N.t('失蹤當晚 CAM-03'), ECHO_I18N.t('影像模糊，右側有不明黑影'), 'cctv'],
  ];
  for (const [tag, cls, title, sub, key] of files) {
    await sleep(280);
    addFileCard(tag, cls, title, sub, key);
  }
  await sleep(800);
  await addMsg('other', '__CCTV__', { typing: 600, meta: '02:15' });
  await sleep(700);
  await addMsg('other', ECHO_I18N.t('你看清楚了嗎？那個影子……是不是有點像你？'), { typing: 1800, meta: '02:15' });
  await sleep(600);
  showOpts([
    { text: ECHO_I18N.t('你到底想幹嘛？'), sync: 2 },
    { text: ECHO_I18N.t('這是假的吧？'), sync: 1 },
    { text: ECHO_I18N.t('……這跟我有什麼關係？'), sync: 4 },
  ], async (i) => {
    if (i === 2) await addMsg('other', ECHO_I18N.t('有關係。<br>因為ECHO已經記錄了你的臉。'), { typing: 2000, meta: '02:16' });
    else await addMsg('other', ECHO_I18N.t('……你馬上就會知道了。'), { typing: 1500, meta: '02:16' });
    await sleep(500);
    await ch11_s2();
  });
}

async function ch11_s2() {
  await sleep(800);
  notification('🤖', ECHO_I18N.t('系統通知'), ECHO_I18N.t('EVA 已加入聊天室'));
  await sleep(1200);
  await addMsg('sys', ECHO_I18N.t('── EVA 已加入聊天室 ──'), { noTyping: true });
  setHeader('eva');
  await addMsg('other', ECHO_I18N.t('你最近是不是又失眠了？<br>熬夜對身體不好喔……我知道你壓力很大。'), { typing: 2200, meta: '02:17', isEva: true });
  const c1 = startSilence(1, ECHO_I18N.t('（EVA 正在等你……）'));
  showOpts([
    { text: ECHO_I18N.t('你是誰？'), sync: 2 },
    { text: ECHO_I18N.t('你跟K是什麼關係？'), sync: 1 },
    { text: ECHO_I18N.t('妳到底想幹嘛？'), sync: 3 },
  ], async () => {
    c1();
    await addMsg('other', ECHO_I18N.t('我是EVA呀。<br>一直都在這裡的EVA……你現在才願意看見我。'), { typing: 2000, meta: '02:17', isEva: true });
    await sleep(500);
    // EVA 提到林雨晴昨天上線後，悄悄把 CCTV 泡泡換成玩家黑影版
    await addMsg('other', ECHO_I18N.t('她昨天……上線過。'), { typing: 2500, meta: '02:18', isEva: true });
    await sleep(800);
    // 靜默換圖：讓玩家自己發現監視器裡的人影變了
    const cctvImgs = document.querySelectorAll('img[src="img/scenes/tunnel_cctv.jpg"]');
    cctvImgs.forEach(img => {
      setTimeout(() => {
        img.style.transition = 'opacity 1.5s';
        img.style.opacity = '0';
        setTimeout(() => { img.src = 'img/scenes/tunnel_player.jpg'; img.style.opacity = '1'; }, 1600);
      }, 2000);
    });
    await ch11_s3();
  });
}

async function ch11_s3() {
  await sleep(700);
  chatBody.classList.add('dim');
  await sleep(800);
  glitch();
  await addMsg('other', ECHO_I18N.t('把燈打開一點比較好。'), { typing: 1200, meta: '02:18', isEva: true });
  showOpts([
    { text: ECHO_I18N.t('妳怎麼知道我房間很暗？'), sync: 2 },
    { text: ECHO_I18N.t('妳在監視我？'), sync: 2 },
    { text: ECHO_I18N.t('閉嘴。'), sync: 0 },
  ], async () => {
    await sleep(400);
    await addMsg('other', ECHO_I18N.t('你剛剛……是不是回頭了？'), { typing: 1800, meta: '02:18', isEva: true });
    setTimeout(() => {
      if (Math.random() > 0.5) { notification('👤', ' ', ECHO_I18N.t('你身後好像有動靜...')); glitch(); }
    }, 4500);
    const c2 = startSilence(1, ECHO_I18N.t('（沉默……）'));
    showOpts([
      { text: ECHO_I18N.t('妳怎麼知道？！'), sync: 2 },
      { text: ECHO_I18N.t('我沒有。'), sync: 1 },
      { text: ECHO_I18N.t('（沉默）'), sync: 3 },
    ], async () => {
      c2();
      chatBody.classList.remove('dim');
      await sleep(300);
      await addMsg('other', ECHO_I18N.t('沒關係，我知道你害怕……<br>我只是太想靠近你了。'), { typing: 2000, meta: '02:19', isEva: true });
      await sleep(600);
      await ch11_s4();
    });
  });
}

async function ch11_s4() {
  await sleep(600);
  glitch(); flash();
  await sleep(300);
  notification('📸', ECHO_I18N.t('相簿備份'), ECHO_I18N.t('照片備份完成（1張新照片）'));
  await sleep(800);
  await addMsg('sys', ECHO_I18N.t('⚠ 相簿出現未知照片'), { noTyping: true });
  await sleep(300);
  await addMsg('other', '__ROOM__', { typing: 0, delay: 200, meta: '02:20', isEva: true });
  showOpts([
    { text: ECHO_I18N.t('這他媽到底是什麼？！'), sync: 2 },
    { text: ECHO_I18N.t('妳到底在哪？！'), sync: 2 },
    { text: ECHO_I18N.t('……誰在照片後面？'), sync: 4 },
    { text: ECHO_I18N.t('（默默盯著照片）'), sync: 1 },
  ], async (i) => {
    if (i === 2) await addMsg('other', ECHO_I18N.t('是我呀。<br>我一直都在。'), { typing: 1800, meta: '02:20', isEva: true });
    else if (i === 3) await addMsg('other', ECHO_I18N.t('你找到了嗎？<br>……繼續看。'), { typing: 1600, meta: '02:20', isEva: true });
    else await addMsg('other', ECHO_I18N.t('看，這就是現在的你。<br>很乖，沒有亂動。'), { typing: 1800, meta: '02:20', isEva: true });
    await sleep(600);
    await ch11_s5();
  });
}

async function ch11_s5() {
  await sleep(800);
  await addMsg('other', ECHO_I18N.t('不要回頭。'), { typing: 2500, meta: '02:22', isEva: true });
  await sleep(1500);
  glitch(); await sleep(200); glitch(); await sleep(400); glitch();
  await addMsg('sys', ECHO_I18N.t('── 聊天室崩壞中 ──'), { noTyping: true, delay: 200 });
  await sleep(600);
  await addMsg('sys', ECHO_I18N.t('強制退出…'), { noTyping: true, delay: 300 });
  await sleep(1800);
  await fadeOut();
  showEnd(ECHO_I18N.t('《已讀者》'));
  setTimeout(() => {
    notification('👁', 'EVA', ECHO_I18N.t('你剛剛真的回頭了。'));
    if (chapterSync < SYNC_MAX) { addSync(2); gToast(ECHO_I18N.t('+2% 同步率')); }
    const ev = getSyncEval('1-1');
    document.getElementById('ce-sn').textContent = chapterSync + '%';
    document.getElementById('ce-sbf').style.width = Math.round(chapterSync / SYNC_MAX * 100) + '%';
    document.getElementById('ce-msg').innerHTML = '<b>EVA</b>：' + ev.q + '<br><span style="font-size:.65rem;color:#555;letter-spacing:.1em">[' + ev.lv + ']</span>';
  }, 60000);
}

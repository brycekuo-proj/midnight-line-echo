window.CHAPTERS = window.CHAPTERS || {};

// ─────────────────────────────────────────────────────
//  假結局《離線》— 同步率 0～33%
//  第四章結束後，由 showEnd() 判斷觸發
// ─────────────────────────────────────────────────────
window.CHAPTERS['end_normal'] = async function() {

  // 重設畫面為「白天感」
  setHeader('unk', '系統通知', 'ECHO');
  chatBody.style.background = '';
  chatBody.style.filter = '';
  chatBody.innerHTML = '';
  chatBody.appendChild(typingEl);

  await addMsg('time', '隔天早上 09:41');
  await sleep(1000);
  await addMsg('sys', '── 手機重新開機 ──', { noTyping: true });
  await sleep(800);

  // 系統訊息：一切恢復正常
  await addMsg('sys', '所有異常聊天室已消失', { noTyping: true, delay: 300 });
  await sleep(400);
  await addMsg('sys', 'EVA · K · 林雨晴 — 查無此帳號', { noTyping: true, delay: 200 });
  await sleep(600);

  // 假正常：朋友的普通訊息
  await addMsg('other',
    '欸你昨晚去哪了？<br>一直找不到你',
    { typing: 1200, meta: '09:41' });
  await sleep(400);
  await addMsg('other',
    '你沒事吧？感覺臉色很差',
    { typing: 1000, meta: '09:42' });

  showOpts([
    { text: '沒事，昨晚睡不好。',      sync: 0 },
    { text: '我遇到很奇怪的事……',     sync: 0 },
    { text: '（不想說）',              sync: 0 },
  ], async () => {
    await addMsg('other',
      '多休息啦，最近壓力太大了吧',
      { typing: 1200, meta: '09:43' });
    await sleep(600);
    await end_n_s2();
  });
};

async function end_n_s2() {
  await sleep(800);
  await addMsg('sys', '── 一週後 ──', { noTyping: true });
  await sleep(600);
  await addMsg('time', '凌晨 02:17');
  chatBody.style.background = '#0e0e12';
  await sleep(800);

  // 細微異常開始
  await addMsg('sys', '手機收到陌生推播', { noTyping: true, delay: 300 });
  await sleep(500);

  // 推播通知
  notification('📱', '未知App', '你的同步率：0%');
  await sleep(1500);

  await addMsg('other',
    '你回來了。',
    { typing: 2000, meta: '02:17', isUnk: true });

  showOpts([
    { text: '你是誰？',          sync: 0 },
    { text: '我沒有回來。',      sync: 0 },
    { text: '（封鎖此帳號）',    sync: 0 },
  ], async () => {
    // 不管選什麼，都繼續
    await addMsg('sys', '訊息傳送失敗——對方已離線', { noTyping: true, delay: 400 });
    await sleep(800);
    await end_n_s3();
  });
}

async function end_n_s3() {
  await sleep(600);
  await addMsg('sys', '── 手機關機 ──', { noTyping: true });
  await sleep(1200);
  // 畫面漸暗
  chatBody.style.transition = 'background 2s';
  chatBody.style.background = '#000';
  await sleep(2000);

  // 最後一幕：路人場景（純文字描述）
  await addMsg('sys', '── 畫面切換：白天 · 捷運站出口 ──', { noTyping: true, delay: 300 });
  await sleep(600);

  // 描述性訊息，模擬旁白
  const scene = [
    '人群從捷運站湧出。',
    '每個人都低著頭。',
    '每個人都在看手機。',
    '每個人的臉……都被螢幕光照亮。',
  ];
  for (const s of scene) {
    await sleep(700);
    await addMsg('sys', s, { noTyping: true, delay: 100 });
  }

  await sleep(1200);
  // 最後一行注意到某件事
  await addMsg('sys', '你注意到一件事。', { noTyping: true, delay: 400 });
  await sleep(1000);
  await addMsg('sys', '他們的手機螢幕……', { noTyping: true, delay: 600 });
  await sleep(800);
  await addMsg('sys', '顯示的都是同一個聊天室。', { noTyping: true, delay: 400 });
  await sleep(1500);

  // 最終字幕
  glitch();
  await sleep(400);
  await addMsg('inject', '你以為只有你看過聊天室嗎？', { noTyping: true, delay: 200 });
  await sleep(2000);

  await fadeOut();
  showNormalEnd();
};

function showNormalEnd() {
  const endEl = document.getElementById('chapter-end');
  endEl.style.display = 'flex';
  endEl.className = ''; // 黑底

  document.getElementById('ce-title').textContent = '第一部 結束';
  document.getElementById('ce-title').style.color = '#555';
  document.getElementById('ce-name').textContent = '《離線》';
  document.getElementById('ce-name').style.color = '#888';
  document.getElementById('ce-sn').textContent = totalSync + '%';
  document.getElementById('ce-sbf').style.width = Math.round(totalSync / 100 * 100) + '%';

  // Normal End 專屬評語
  const msgEl = document.getElementById('ce-msg');
  msgEl.className = 'ce-msg';
  msgEl.innerHTML = '<b style="color:#666">系統</b>：你成功離開了聊天室。<br><span style="font-size:.65rem;color:#444;letter-spacing:.1em">但「離開」這件事本身……<br>也被記錄下來了。</span>';

  document.getElementById('ce-next').textContent = 'Normal End · 同步率 ' + totalSync + '%';
  document.getElementById('ce-next').style.color = '#333';

  // 60 秒後 EVA 最後一條訊息
  setTimeout(() => {
    notification('👁', 'EVA', '你以為你真的離開了嗎？');
  }, 60000);
}

window.CHAPTERS = window.CHAPTERS || {};

// ─────────────────────────────────────────────────────
//  偽結局《離線》— 低同步路線
//  Canon visual: 雨夜地面上的破裂手機，玩家背影離去。
// ─────────────────────────────────────────────────────
window.CHAPTERS['end_normal'] = async function() {
  clearOpts();
  stopStoryAudio();

  const app = document.getElementById('app');
  const syncBar = document.getElementById('sync-bar');
  if (app) app.style.visibility = 'hidden';
  if (syncBar) syncBar.style.visibility = 'hidden';

  const scene = document.createElement('section');
  scene.className = 'offline-ending-scene';
  scene.setAttribute('aria-label', ECHO_I18N.t('偽結局《離線》'));

  const image = document.createElement('img');
  image.className = 'offline-ending-image';
  image.src = 'img/scenes/ch41_offline_phone.webp';
  image.alt = ECHO_I18N.t('雨夜街道上，一支破裂的手機被留在地面，遠處的人正離開');

  const vignette = document.createElement('div');
  vignette.className = 'offline-ending-vignette';

  const copy = document.createElement('div');
  copy.className = 'offline-ending-copy';
  copy.setAttribute('aria-live', 'polite');

  scene.appendChild(image);
  scene.appendChild(vignette);
  scene.appendChild(copy);
  document.body.appendChild(scene);

  // Canon Marquee V5：先讓玩家接受「回到現實」，最後才翻面。
  const lines = [
    { html: ECHO_I18N.t('雨還在下'), hold: 1800 },
    { html: ECHO_I18N.t('路還是原本的路'), hold: 1800 },
    { html: ECHO_I18N.t('有些事情<br>沒有答案'), hold: 2100 },
    { html: ECHO_I18N.t('你把手機留在了那裡'), hold: 2200 },
    { html: ECHO_I18N.t('然後<br>繼續往前走'), hold: 2200 },
    { html: ECHO_I18N.t('沒有誰攔住你'), hold: 1900 },
    { html: ECHO_I18N.t('也沒有誰追上來'), hold: 2600 },
    { html: ECHO_I18N.t('你離開了'), hold: 2600 },
    { html: ECHO_I18N.t('至少<br>你是這麼以為的'), hold: 3200, className: 'is-turn' },
    { html: ECHO_I18N.t('只是偶爾<br>你還是會想起 03:17'), hold: 3000, className: 'is-small' }
  ];

  await sleep(900);
  for (const line of lines) {
    copy.className = 'offline-ending-copy' + (line.className ? ' ' + line.className : '');
    copy.innerHTML = line.html;
    void copy.offsetWidth;
    copy.classList.add('is-visible');
    await sleep(line.hold);
    copy.classList.remove('is-visible');
    await sleep(450);
  }

  scene.classList.add('is-black');
  await sleep(1300);
  scene.remove();
  showNormalEnd();
};

function showNormalEnd() {
  echoTelemetry('levelEnd', 'end_normal', { total_sync: totalSync });
  echoTelemetry('endingReached', 'normal_offline', { total_sync: totalSync });

  const app = document.getElementById('app');
  const syncBar = document.getElementById('sync-bar');
  if (app) app.style.visibility = '';
  if (syncBar) syncBar.style.visibility = '';

  const endEl = document.getElementById('chapter-end');
  endEl.style.display = 'flex';
  endEl.className = '';

  document.getElementById('ce-title').textContent = ECHO_I18N.t('第一部 結束');
  document.getElementById('ce-title').style.color = '#555';
  document.getElementById('ce-name').textContent = ECHO_I18N.t('《離線》');
  document.getElementById('ce-name').style.color = '#888';
  document.getElementById('ce-sn').textContent = totalSync + '%';
  document.getElementById('ce-sbf').style.width = Math.round(totalSync / 100 * 100) + '%';

  const msgEl = document.getElementById('ce-msg');
  msgEl.className = 'ce-msg';
  msgEl.innerHTML = ECHO_I18N.t('<b style="color:#666">Offline Ending</b><br><span style="font-size:.68rem;color:#555;letter-spacing:.1em">你離開了。<br>至少，你是這麼以為的。</span>');

  document.getElementById('ce-next').textContent = ECHO_I18N.t('Offline Ending · 同步率 ') + totalSync + '%';
  document.getElementById('ce-next').style.color = '#444';
}

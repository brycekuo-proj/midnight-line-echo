window.CHAPTERS = window.CHAPTERS || {};

// ─────────────────────────────────────────────────────
//  CH 2-1：地下道
// ─────────────────────────────────────────────────────
window.CHAPTERS['2-1'] = async function() {
  setHeader('k', 'K', '上線中');
  await addMsg('time', '02:41 AM');
  await sleep(900);
  chatBody.style.background = '#0c0d12';

  await addMsg('other', '我需要你幫我確認一件事。', { typing: 1800, meta: '02:41' });
  await sleep(650);
  await addMsg('other', '她最後到底去了哪裡。', { typing: 1800, meta: '02:41' });
  await sleep(3000);
  await addMsg('other', '我一個人查不太夠。<br>你願意幫我嗎？', { typing: 1800, meta: '02:42' });
  showOpts([
    { text: '你在說什麼？', sync: 1 },
    { text: '發生什麼事了？', sync: 2 },
    { text: '我可以幫忙。', sync: 3 },
  ], async () => {
    await ch21_caseSetup();
  });
};

async function ch21_caseSetup() {
  await sleep(600);
  await addMsg('sys', '【調查資料】', { noTyping: true, delay: 350 });
  await sleep(250);
  addFileCard('調查', 'tp', '林雨晴 · 失蹤案', '23歲，跨國公司高管。最後出現地點：萬華地下道。至今下落不明。', 'ch21-case');
  await sleep(900);
  await addMsg('other', '這是目前我掌握的所有資訊。<br>我想請你一起看地下道的監視器。', { typing: 2200, meta: '02:43' });
  await sleep(450);
  await addMsg('sys', '【地下道地圖】 已解鎖<br>調查線索 +1<br>同步率 +1', { noTyping: true, delay: 350 });
  addSync(1);
  await sleep(600);
  await ch21_investigation();
}

async function ch21_investigation() {
  const result = await runGraphicMapInvestigation();
  await sleep(650);
  if (result && result.graffitiFound) {
    await addMsg('other', '……我上次看的時候沒有這個。', { typing: 2200, meta: '02:47' });
  } else {
    await addMsg('other', '先看到這裡。<br>下一段時間紀錄比較奇怪。', { typing: 1700, meta: '02:47' });
  }
  await sleep(500);
  await ch21_timeConflict();
}

async function ch21_timeConflict() {
  await addMsg('sys', '[時間紀錄] 已解鎖', { noTyping: true, delay: 350 });
  await sleep(300);
  addFileCard('紀錄', 'tn', '時間紀錄', '02:57 進入地下道 / 03:17 畫面黑掉 / 02:16 訊號恢復', 'ch21-time');
  await sleep(650);
  await addMsg('sys', '02:57　林雨晴走進地下道<br>03:17　畫面完全黑掉<br>02:16　訊號恢復，地下道空無一人', { noTyping: true, delay: 450 });
  await sleep(5600);
  await addMsg('other', '……你有發現嗎？', { typing: 1600, meta: '02:48' });
  showOpts([
    { text: '什麼意思？', sync: 1 },
    { text: '這根本不合理。', sync: 2 },
    { text: '你是不是進去過？', sync: 4 },
  ], async () => {
    await sleep(550);
    await ch21_cctvClimax();
  });
}

async function ch21_cctvClimax() {
  await addMsg('sys', '請確認 03:17 監視器畫面', { noTyping: true, delay: 350 });
  await sleep(350);
  await addMsg('other', '__CCTV__', { typing: 0, delay: 200, meta: '02:49' });
  await sleep(800);
  await addMsg('sys', '地下道空蕩。角落出現極模糊人影。', { noTyping: true, delay: 350 });
  await sleep(500);
  await addCh21PlayerCctvCard();
  await sleep(700);
  await addMsg('sys', '放大結果：左肩微微下垂。站姿幾乎完全相同。', { noTyping: true, delay: 400 });
  await sleep(3600);
  await addMsg('other', '你……也看到了？', { typing: 1800, meta: '02:50' });
  showOpts([
    { text: '那是我？！', sync: 2 },
    { text: '為什麼是我？', sync: 1 },
    { text: '我要怎麼辦？', sync: 4 },
  ], async () => {
    await sleep(650);
    await ch21_evaIntervenes();
  });
}

async function ch21_evaIntervenes() {
  notification('EVA', '系統通知', 'EVA 已加入聊天室');
  await sleep(900);
  setHeader('eva', 'EVA', 'ECHO 輔助系統');
  await addMsg('sys', 'EVA 已加入聊天室', { noTyping: true, delay: 350 });
  await sleep(500);
  await addMsg('other', '你似乎對這段畫面有疑問。<br>需要我協助分析嗎？', { typing: 2200, meta: '02:52', isEva: true });
  await sleep(600);
  await addMsg('other', '……', { typing: 1200, meta: '02:52' });
  await sleep(550);
  await addMsg('other', '你停留在此畫面較久。<br>要我幫你比對人影輪廓嗎？', { typing: 2200, meta: '02:53', isEva: true });
  showOpts([
    { text: '妳怎麼知道？', sync: 2 },
    { text: '不用了。', sync: 0 },
    { text: '幫我分析。', sync: 3 },
  ], async () => {
    await sleep(650);
    await ch21_endingHook();
  });
}

async function ch21_endingHook() {
  setHeader('k', 'K', '上線中');
  await addMsg('sys', 'K 傳送了一張照片', { noTyping: true, delay: 350 });
  await sleep(300);
  await addMsg('other', '__K_PHOTO__', { typing: 0, delay: 200, meta: '02:55' });
  await sleep(700);
  await addMsg('other', '這張……不是我拍的。', { typing: 1800, meta: '02:55' });
  await sleep(1200);
  await addMsg('other', '它的時間……是三分鐘後。', { typing: 1900, meta: '02:56' });
  await sleep(3600);
  await addMsg('sys', '調查尚未結束<br>新線索已記錄', { noTyping: true, delay: 450 });
  await sleep(700);
  await addMsg('sys', '你願意繼續和 K 一起查下去嗎？', { noTyping: true, delay: 600 });
  await sleep(1000);
  await fadeOut();
  showEnd('《地下道》');
}

function runCh21MapInvestigation() {
  cancelActiveWidget('ch21_map');
  optionsArea.classList.add('widget-open');
  optionsArea.innerHTML = '';

  return new Promise((resolve) => {
    let normalAwarded = false;
    let graffitiStage = 0;
    let graffitiFound = false;
    let settled = false;
    const viewed = {};
    let hasViewedAnyPoint = false;
    const points = [
      { id: 'entrance', label: 'A入口', note: '入口動線正常。雨水積在階梯下方。' },
      { id: 'exit', label: 'B出口', note: '出口沒有異常通行紀錄。' },
      { id: 'camera', label: '監視器區域', note: '這裡應該拍得到最後畫面……但總覺得怪怪的。' },
      { id: 'blind', label: '死角區域', note: '這個位置監視器拍不到。' },
      { id: 'graffiti', label: '塗鴉牆', note: '普通塗鴉。再放大一點，牆面有一段模糊字樣。' },
    ];

    const widget = document.createElement('div');
    widget.style.cssText = 'background:linear-gradient(180deg,#10121a,#0b0c12);border:1px solid #293041;border-radius:14px;padding:.85rem;box-shadow:0 -10px 30px rgba(0,0,0,.25)';
    widget.innerHTML =
      '<div style="display:flex;justify-content:space-between;gap:.75rem;align-items:flex-start">' +
        '<div>' +
          '<div style="font-size:.58rem;color:var(--ghost);letter-spacing:.16em;text-transform:uppercase">Tunnel Map</div>' +
          '<div style="font-size:.9rem;color:var(--text);font-weight:600;margin-top:.2rem">萬華地下道</div>' +
        '</div>' +
        '<div style="font-size:.65rem;color:var(--green);font-family:monospace">02:46</div>' +
      '</div>' +
      '<div class="ch21-map-grid" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.45rem;margin-top:.8rem"></div>' +
      '<div class="ch21-map-note" style="min-height:3.1em;margin-top:.7rem;color:#8d92a8;font-size:.7rem;line-height:1.6;border-top:1px solid #222838;padding-top:.6rem">選擇調查點位。</div>' +
      '<button class="ch21-map-done" type="button" disabled style="margin-top:.7rem;width:100%;border:1px solid #252b3a;background:#111522;color:#555b6d;border-radius:10px;padding:.6rem .75rem;font-family:inherit;text-align:left">完成調查</button>';

    const grid = widget.querySelector('.ch21-map-grid');
    const note = widget.querySelector('.ch21-map-note');
    const done = widget.querySelector('.ch21-map-done');

    function updateDone() {
      if (!hasViewedAnyPoint) return;
      done.disabled = false;
      done.style.color = 'var(--text)';
      done.style.borderColor = '#35415a';
      done.textContent = '完成調查';
    }

    points.forEach((point) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = point.label;
      btn.style.cssText = 'border:1px solid #252b3a;background:#141722;color:var(--text);border-radius:10px;padding:.7rem;text-align:left;font-family:inherit;font-size:.76rem;line-height:1.35';
      btn.onclick = () => {
        if (settled) return;
        hasViewedAnyPoint = true;
        viewed[point.id] = true;
        btn.style.borderColor = point.id === 'graffiti' ? 'rgba(255,170,0,.55)' : 'rgba(45,212,164,.3)';

        if (point.id === 'graffiti') {
          graffitiStage++;
          if (graffitiStage >= 2 && !graffitiFound) {
            graffitiFound = true;
            note.innerHTML = '放大結果：牆上有模糊字樣「LYQ……」';
            addSync(3);
            gToast('+3% 同步率（塗鴉牆異常）');
          } else {
            note.textContent = point.note;
          }
          updateDone();
          return;
        }

        note.textContent = point.note;
        if (!normalAwarded) {
          normalAwarded = true;
          addSync(2);
          gToast('+2% 同步率（積極調查）');
        }
        updateDone();
      };
      grid.appendChild(btn);
    });

    done.onclick = () => {
      if (settled || done.disabled) return;
      settled = true;
      activeWidgetController = null;
      optionsArea.classList.remove('widget-open');
      optionsArea.innerHTML = '';
      resolve({ graffitiFound, viewed });
    };

    activeWidgetController = {
      cancel: () => {
        if (settled) return;
        settled = true;
        resolve({ graffitiFound, viewed, cancelled: true });
      }
    };

    optionsArea.appendChild(widget);
  });
}

async function addCh21PlayerCctvCard() {
  const row = document.createElement('div');
  row.className = 'brow';
  row.appendChild(mkAv('k'));
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:flex;flex-direction:column;max-width:100%';
  const bbl = document.createElement('div');
  bbl.className = 'bbl';
  bbl.style.cssText = 'padding:0;background:transparent';
  const p = document.createElement('div');
  p.style.cssText = 'position:relative;width:220px;cursor:pointer;border-radius:8px;overflow:hidden;border:1px solid #1a2a1a';
  const img = document.createElement('img');
  img.src = 'img/scenes/tunnel_player.jpg';
  img.alt = '';
  img.style.cssText = 'width:100%;display:block;filter:brightness(.62) saturate(.25) contrast(1.15)';
  const scan = document.createElement('div');
  scan.className = 'cctv-scan';
  const lbl = document.createElement('div');
  lbl.style.cssText = 'position:absolute;top:5px;left:6px;background:rgba(0,0,0,.7);color:#2dd4a4;font-size:.5rem;padding:1px 4px;border-radius:2px;font-family:monospace';
  lbl.textContent = 'CAM 07 · ZOOM';
  const ts = document.createElement('div');
  ts.style.cssText = 'position:absolute;bottom:5px;right:6px;background:rgba(0,0,0,.7);color:var(--warn);font-size:.55rem;padding:1px 4px;border-radius:2px;font-family:monospace';
  ts.textContent = '03:17';
  p.appendChild(img);
  p.appendChild(scan);
  p.appendChild(lbl);
  p.appendChild(ts);
  p.onclick = () => {
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lb-img');
    lbImg.src = 'img/scenes/tunnel_player.jpg';
    lbImg.style.cssText = 'max-width:100%;max-height:72vh;object-fit:contain;border-radius:8px;filter:brightness(.78) saturate(.3) contrast(1.08)';
    document.getElementById('lb-cap').textContent = 'CAM 07 · 03:17 · 模糊人影';
    const det = document.getElementById('lb-det');
    det.textContent = '左肩微微下垂。站姿幾乎完全相同。';
    det.classList.remove('show');
    setTimeout(() => det.classList.add('show'), 700);
    const hid = document.getElementById('lb-hid');
    hid.className = 'lb-hid';
    hid.textContent = '你也看到了？';
    setTimeout(() => hid.classList.add('reveal'), 2600);
    lb.style.display = 'flex';
  };
  bbl.appendChild(p);
  const meta = document.createElement('div');
  meta.className = 'bmeta';
  meta.textContent = '02:49';
  wrap.appendChild(bbl);
  wrap.appendChild(meta);
  row.appendChild(wrap);
  chatBody.appendChild(row);
  scrollBottom();
}

// ─────────────────────────────────────────────────────
//  CH 2-2：雨夜留言
//  Canon: docs/canon/season1/1-2-2(new)_260525_232926.txt
// ─────────────────────────────────────────────────────
window.CHAPTERS['2-2'] = async function() {
  setHeader('rain', '林雨晴', '最後上線：3天前');
  chatBody.style.background = '#0a0f12';
  await addMsg('time', '凌晨 02:58 · 雨夜');
  await sleep(700);
  await addMsg('other', '……你今天，也聽得到雨聲嗎？', { typing: 1400, meta: '02:58', isRain: true });
  await sleep(650);
  await addMsg('other', '我整理了一些東西……<br>你可以自己看。', { typing: 1800, meta: '02:59', isRain: true });

  showOpts([
    { text: '你是誰？', sync: 1 },
    { text: '這是什麼聊天室？', sync: 1 },
    { text: '……你還好嗎？', sync: 4 },
  ], async () => {
    await ch22_roomTrace();
  });
};

async function ch22_roomTrace() {
  await addMsg('sys', '【林雨晴房間紀錄】 已解鎖', { noTyping: true, delay: 350 });
  await sleep(450);
  await addMsg('other', '我整理東西的時候……<br>發現這兩張照片好像不太一樣。', { typing: 1800, meta: '03:01', isRain: true });
  await addMsg('sys', '請找出兩張照片中所有明顯不同處<br>點擊差異處進行標記', { noTyping: true, delay: 300 });

  const diffResult = await runSpotDifference();
  if (!diffResult || !diffResult.completed) return;

  addSync(3);
  gToast('+3% 同步率（完整調查房間紀錄）');
  await addMsg('sys', '差異確認完成', { noTyping: true, delay: 250 });
  await sleep(700);
  await addMsg('other', '……奇怪。<br>我不記得，房間那天是這樣。', { typing: 2000, meta: '03:07', isRain: true });
  await sleep(500);
  await addMsg('other', '好像……<br>有些東西不是我放的。', { typing: 1800, meta: '03:07', isRain: true });
  await ch22_empathy();
}

async function ch22_empathy() {
  await sleep(700);
  await addMsg('sys', '── 理解與共鳴 ──', { noTyping: true, delay: 250 });
  await addMsg('other', '我最討厭別人問我「最近好嗎」。<br>因為我總是不知道怎麼回答……', { typing: 2200, meta: '03:09', isRain: true });

  showOpts([
    { text: '我還好。', sync: 1 },
    { text: '我也不喜歡。', sync: 4 },
    { text: '繼續說吧。', sync: 3 },
  ], async () => {
    await addMsg('other', '你呢？你也討厭被這樣問嗎？', { typing: 1800, meta: '03:10', isRain: true });
    await sleep(600);
    await addMsg('sys', '✓✓ 已讀狀態異常：聊天室內出現未開啟的已讀紀錄', { noTyping: true, delay: 250 });
    await ch22_boundaryBlur();
  });
}

async function ch22_boundaryBlur() {
  await sleep(650);
  await addMsg('sys', '── 界線開始模糊 ──', { noTyping: true, delay: 250 });
  await addMsg('other', '我最後一天……其實在調查一個很大的案子。<br>我好像看到了不該看的東西……', { typing: 2400, meta: '03:12', isRain: true });
  await sleep(650);

  // Canon requires a fake player message in the later half of this act.
  await addMsg('self', '……我已經看見了。', { delay: 120, noTyping: true, meta: '03:13' });
  await sleep(300);
  await addMsg('sys', '⚠ 訊息來源異常：這則訊息不是由你送出', { noTyping: true, delay: 180 });
  glitch();
  await sleep(450);
  await addMsg('other', '你看……連你的訊息都開始變了。<br>你有沒有發現？', { typing: 1900, meta: '03:13', isRain: true });

  showOpts([
    { text: '我根本沒發過這句！', sync: 2 },
    { text: '這是怎麼回事？', sync: 3 },
    { text: '……妳繼續說。', sync: 4 },
  ], async () => {
    await ch22_climax();
  });
}

async function ch22_climax() {
  await sleep(650);
  await addMsg('sys', '── 地下道照片 ──', { noTyping: true, delay: 250 });
  await addMsg('other', '你那天……是不是來找過我？<br>我記得你的衣服……和你現在穿的一樣。', { typing: 2400, meta: '03:15', isRain: true });
  await sleep(450);
  await addMsg('other', '__CCTV__', { typing: 0, delay: 250, meta: '03:15', isRain: true });
  await sleep(650);
  await addMsg('other', '那時候的你……站在我後面。<br>我回頭的時候，你卻沒有臉。', { typing: 2300, meta: '03:16', isRain: true });
  await sleep(700);
  await addMsg('other', '我好怕……<br>我怕下一次站在我後面的你……<br>已經不是你了。', { typing: 2400, meta: '03:16', isRain: true });
  await ch22_end();
}

async function ch22_end() {
  await sleep(900);
  await addMsg('sys', '✓✓　✓✓　✓✓　✓✓　聊天室出現大量已讀標記', { noTyping: true, delay: 250 });
  await sleep(650);
  await addMsg('other', '如果下一次……<br>你在地下道看到我。', { typing: 1800, meta: '03:17', isRain: true });
  await sleep(450);
  await addMsg('other', '不要跟我說話。', { typing: 1500, meta: '03:17', isRain: true });
  await sleep(2200);
  swapHeaderImg('img/rain/rain_glitch2.jpg');
  await addMsg('other', '因為那時候的我……<br>可能已經不是我了。', { typing: 2200, meta: '03:17', isRain: true });
  await sleep(3200);
  chatBody.style.background = '#000';
  await sleep(1200);
  await fadeOut();
  showEnd('《雨夜留言》');
  setTimeout(() => notification('林雨晴', 'LINE', '我剛剛……又看到你了。這次，你沒有回頭。'), 90000);
}

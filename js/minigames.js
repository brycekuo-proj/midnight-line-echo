// ═══════════════════════════════════════════════════════
//  ECHO GRAPHICAL MINI-GAME LAYER
//  Real DOM/JS interaction + generated production assets.
// ═══════════════════════════════════════════════════════

const ECHO_MG_ASSETS = Object.freeze({
  ch21: {
    base: 'img/ui/mg_ch21_map_base.png',
    markers: 'img/ui/mg_ch21_map_markers.png',
    panel: 'img/ui/mg_ch21_map_panel.png'
  },
  ch22: {
    a: 'img/scenes/ch22_room_diff_A.jpg',
    b: 'img/scenes/ch22_room_diff_B.jpg',
    frame: 'img/ui/mg_ch22_spotdiff_frame.png',
    marker: 'img/ui/mg_ch22_spotdiff_marker.png',
    complete: 'img/ui/mg_ch22_spotdiff_complete.png'
  },
  ch31: {
    board: 'img/ui/mg_ch31_memory_board.png',
    card: 'img/ui/mg_ch31_memory_card.png',
    slot: 'img/ui/mg_ch31_memory_slot.png',
    complete: 'img/ui/mg_ch31_memory_complete.png'
  },
  ch32: {
    panel: 'img/ui/mg_ch32_ssd_panel.png',
    card: 'img/ui/mg_ch32_ssd_card.png',
    label: 'img/ui/mg_ch32_ssd_label.png',
    detail: 'img/ui/mg_ch32_ssd_detail.png'
  },
  ch33: {
    panel: 'img/ui/mg_ch33_audio_panel.png',
    wave: 'img/ui/mg_ch33_waveframe.png',
    button: 'img/ui/mg_ch33_audio_button.png',
    result: 'img/ui/mg_ch33_audio_result.png'
  },
  ch41: {
    board: 'img/ui/mg_ch41_mirror_board.png',
    fragment: 'img/ui/mg_ch41_mirror_fragment.png',
    lock: 'img/ui/mg_ch41_mirror_lock_overlay.png',
    screenshot: 'img/ui/mg_ch41_mirror_screenshot.png'
  },
  ch5: {
    archivePanel: 'img/ui/mg_ch5_archive_panel.png',
    archiveCard: 'img/ui/mg_ch5_archive_card.png',
    archiveThumb: 'img/ui/mg_ch5_archive_thumbframe.png',
    archiveDetail: 'img/ui/mg_ch5_archive_detail.png',
    linkBase: 'img/ui/mg_ch5_linkboard_base.png',
    linkEcho: 'img/ui/mg_ch5_linkboard_echo_node.png',
    linkEvidence: 'img/ui/mg_ch5_linkboard_evidence_node.png',
    linkGlow: 'img/ui/mg_ch5_linkboard_connection_glow.png',
    linkComplete: 'img/ui/mg_ch5_linkboard_complete.png',
    residualBg: 'img/ui/mg_ch5_residual_bg.png',
    residualBubble: 'img/ui/mg_ch5_residual_bubble.png',
    residualOverlay: 'img/ui/mg_ch5_residual_overlay.png',
    candyScene: 'img/scenes/ch5_choice_candy.jpg',
    candyHighlight: 'img/ui/mg_ch5_choice_highlight.png',
    candyResult: 'img/ui/mg_ch5_choice_result.png'
  }
});

function echoShuffle(list) {
  const out = list.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function echoMiniGameShell(kicker, title, subtitle, art) {
  const root = document.createElement('section');
  root.className = 'echo-mg';
  root.innerHTML =
    '<div class="echo-mg-head">' +
      '<div><div class="echo-mg-kicker"></div><div class="echo-mg-title"></div></div>' +
      '<div class="echo-mg-status">LIVE</div>' +
    '</div>' +
    '<div class="echo-mg-sub"></div>' +
    '<div class="echo-mg-body"></div>' +
    '<div class="echo-mg-foot"></div>';
  root.querySelector('.echo-mg-kicker').textContent = kicker;
  root.querySelector('.echo-mg-title').textContent = title;
  root.querySelector('.echo-mg-sub').textContent = subtitle;
  if (art) root.style.setProperty('--mg-art', 'url("' + new URL(art, document.baseURI).href + '")');
  return root;
}

function echoMountMiniGame(root, cancel) {
  cancelActiveWidget('replaced');
  optionsArea.innerHTML = '';
  optionsArea.classList.add('widget-open');
  optionsArea.appendChild(root);
  activeWidgetController = { cancel };
}

function echoFinishMiniGame(resolve, result, opts) {
  const o = opts || {};
  activeWidgetController = null;
  if (!o.keepVisible) {
    optionsArea.classList.remove('widget-open');
    optionsArea.innerHTML = '';
  }
  resolve(result);
}

function echoArtImg(src, className, alt) {
  const img = document.createElement('img');
  img.src = src;
  img.className = className || '';
  img.alt = alt || '';
  img.draggable = false;
  return img;
}

function runGraphicMapInvestigation() {
  return new Promise((resolve) => {
    let settled = false;
    let normalAwarded = false;
    let graffitiStage = 0;
    let graffitiFound = false;
    const viewed = {};
    const points = [
      { id: 'entrance', label: 'A入口', x: 20, y: 72, note: '入口動線正常。雨水積在階梯下方。' },
      { id: 'exit', label: 'B出口', x: 79, y: 22, note: '出口沒有異常通行紀錄。' },
      { id: 'camera', label: 'CAM 07', x: 63, y: 48, note: '監視器拍得到最後畫面，但 03:17 後訊號中斷。' },
      { id: 'blind', label: '死角', x: 39, y: 33, note: '這個位置被柱體遮蔽，監視器拍不到。' },
      { id: 'graffiti', label: '塗鴉牆', x: 48, y: 78, note: '牆面有一段模糊字樣。再點一次放大。' }
    ];

    const root = echoMiniGameShell('CH2-1 · UNDERGROUND MAP', '萬華地下道調查', '點擊圖上節點調查。塗鴉牆需要二次確認。', ECHO_MG_ASSETS.ch21.panel);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const stage = document.createElement('div');
    stage.className = 'echo-mg-stage map-stage';
    stage.appendChild(echoArtImg(ECHO_MG_ASSETS.ch21.base, 'echo-mg-stage-img', '地下道地圖'));
    stage.appendChild(echoArtImg(ECHO_MG_ASSETS.ch21.markers, 'echo-mg-marker-sheet', '地圖標記素材'));
    const note = document.createElement('div');
    note.className = 'echo-mg-note';
    note.textContent = '選擇一個調查點位。';
    const done = document.createElement('button');
    done.type = 'button';
    done.className = 'echo-mg-primary';
    done.textContent = '完成調查';
    done.disabled = true;

    points.forEach((p) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'map-hotspot';
      btn.style.left = p.x + '%';
      btn.style.top = p.y + '%';
      btn.textContent = p.label;
      btn.onclick = () => {
        if (settled) return;
        viewed[p.id] = true;
        btn.classList.add('is-viewed');
        done.disabled = false;
        if (p.id === 'graffiti') {
          graffitiStage++;
          if (graffitiStage >= 2 && !graffitiFound) {
            graffitiFound = true;
            btn.classList.add('is-clue');
            note.textContent = '放大結果：牆上有模糊字樣「LYQ……」';
            addSync(3);
            gToast('+3% 同步率（塗鴉牆異常）');
          } else {
            note.textContent = p.note;
          }
          return;
        }
        note.textContent = p.note;
        if (!normalAwarded) {
          normalAwarded = true;
          addSync(2);
          gToast('+2% 同步率（積極調查）');
        }
      };
      stage.appendChild(btn);
    });

    done.onclick = () => {
      if (settled || done.disabled) return;
      settled = true;
      echoFinishMiniGame(resolve, { graffitiFound, viewed });
    };

    body.appendChild(stage);
    foot.appendChild(note);
    foot.appendChild(done);
    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { graffitiFound, viewed, cancelled: true });
    });
  });
}

function runSpotDifference() {
  return new Promise((resolve) => {
    let settled = false;
    let mode = 'a';
    let hasCompared = false;
    const found = new Set();
    const hotspots = [
      { id: 'clock',  label: '時鐘時間',   x: 26, y: 21, radius: 9,  reaction: '那天我回家很晚……可是我不記得，中間那段時間發生了什麼。' },
      { id: 'bed',    label: '床鋪變化',   x: 48, y: 62, radius: 20, reaction: '我其實不太會弄亂床。除非……那天真的很累。' },
      { id: 'note',   label: '粉紅便條',   x: 71, y: 44, radius: 10, reaction: '我有時候會留紙條，怕自己忘記事情。' },
      { id: 'aroma',  label: '右側物件',   x: 84, y: 67, radius: 11, reaction: '我不太喜歡房間太暗。尤其下雨的晚上。' },
      { id: 'photos', label: '照片配置',   x: 61, y: 24, radius: 14, reaction: '我不太喜歡拍自己。可是有些照片……我又捨不得丟。' }
    ];

    const root = echoMiniGameShell('CH2-2 · SPOT THE DIFFERENCE', '房間照片比對', 'A / B 兩張照片中共有 5 個差異。切換照片並點出差異位置。', ECHO_MG_ASSETS.ch22.frame);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const switcher = document.createElement('div');
    switcher.className = 'echo-mg-switch';
    switcher.innerHTML = '<button type="button" data-mode="a" class="is-active">A · 22:47</button><button type="button" data-mode="b">B · 23:16</button>';

    const stage = document.createElement('div');
    stage.className = 'echo-mg-stage spot-stage';

    // A is the immutable MASTER. The generated B image drifted outside the five canon regions,
    // so B is rendered as five clipped patches over A instead of swapping the whole photograph.
    // This keeps the game visually stable and guarantees exactly five comparison regions.
    const base = echoArtImg(ECHO_MG_ASSETS.ch22.a, 'echo-mg-stage-img spot-master', '房間照片 A');
    stage.appendChild(base);

    const variantLayers = [];
    hotspots.forEach((h) => {
      const layer = echoArtImg(ECHO_MG_ASSETS.ch22.b, 'echo-mg-stage-img spot-variant-layer', '房間照片 B 差異區域');
      layer.style.clipPath = 'circle(' + h.radius + '% at ' + h.x + '% ' + h.y + '%)';
      layer.style.webkitClipPath = layer.style.clipPath;
      const softMask = 'radial-gradient(circle at ' + h.x + '% ' + h.y + '%, #000 0 ' + Math.max(1, h.radius - 2) + '%, rgba(0,0,0,.9) ' + Math.max(1, h.radius - 1) + '%, transparent ' + (h.radius + 1) + '%)';
      layer.style.maskImage = softMask;
      layer.style.webkitMaskImage = softMask;
      stage.appendChild(layer);
      variantLayers.push(layer);
    });

    const counter = document.createElement('div');
    counter.className = 'echo-mg-note';
    counter.textContent = '已找到 0 / 5 · 先切換 A / B 比對';
    const reaction = document.createElement('div');
    reaction.className = 'echo-mg-note spot-reaction';
    reaction.textContent = '林雨晴：我整理東西的時候……發現這兩張照片好像不太一樣。';

    function setMode(next) {
      mode = next === 'b' ? 'b' : 'a';
      if (mode === 'b') hasCompared = true;
      variantLayers.forEach((layer) => layer.classList.toggle('is-visible', mode === 'b'));
      switcher.querySelectorAll('button').forEach((b) => b.classList.toggle('is-active', b.dataset.mode === mode));
    }

    switcher.querySelectorAll('button').forEach((b) => b.onclick = () => setMode(b.dataset.mode));

    hotspots.forEach((h) => {
      const hit = document.createElement('button');
      hit.type = 'button';
      hit.className = 'spot-hotspot';
      hit.style.left = h.x + '%';
      hit.style.top = h.y + '%';
      hit.setAttribute('aria-label', '差異：' + h.label);
      hit.onclick = () => {
        if (settled || found.has(h.id)) return;
        if (!hasCompared) {
          counter.textContent = '先切換到 B 照片，再標記差異';
          return;
        }
        found.add(h.id);
        hit.classList.add('is-found');
        hit.style.setProperty('--marker-art', 'url("' + new URL(ECHO_MG_ASSETS.ch22.marker, document.baseURI).href + '")');
        counter.textContent = '已找到 ' + found.size + ' / 5 · ' + h.label;
        reaction.textContent = '林雨晴：' + h.reaction;
        if (found.size === 5) {
          settled = true;
          const complete = echoArtImg(ECHO_MG_ASSETS.ch22.complete, 'echo-mg-complete-art spot-complete-art', '比對完成');
          stage.appendChild(complete);
          setTimeout(() => echoFinishMiniGame(resolve, { found: 5, completed: true }), 950);
        }
      };
      stage.appendChild(hit);
    });

    body.appendChild(switcher);
    body.appendChild(stage);
    foot.appendChild(counter);
    foot.appendChild(reaction);
    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { found: found.size, completed: false, cancelled: true });
    });
  });
}

function runMemoryRepair() {
  return new Promise((resolve) => {
    let settled = false;
    let nextIndex = 0;
    let mistakes = 0;
    const fragments = [
      { id: 0, text: '我不會去地下道。' },
      { id: 1, text: '03:17 的畫面不是現在。' },
      { id: 2, text: '林雨晴說：不要回頭。' },
      { id: 3, text: 'EVA：我都有記著。' }
    ];

    const root = echoMiniGameShell('CH3-1 · MEMORY REPAIR', '記憶修復', '依照原始時間順序，把四段受損訊息放回記憶槽。', ECHO_MG_ASSETS.ch31.board);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const slots = document.createElement('div');
    slots.className = 'memory-slots';
    for (let i = 0; i < fragments.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'memory-slot';
      slot.style.setProperty('--slot-art', 'url("' + ECHO_MG_ASSETS.ch31.slot + '")');
      slot.textContent = String(i + 1).padStart(2, '0');
      slots.appendChild(slot);
    }
    const cards = document.createElement('div');
    cards.className = 'memory-cards';
    const note = document.createElement('div');
    note.className = 'echo-mg-note';
    note.textContent = '先選擇第一段記憶。';

    echoShuffle(fragments).forEach((frag) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'memory-card';
      card.style.setProperty('--card-art', 'url("' + ECHO_MG_ASSETS.ch31.card + '")');
      card.textContent = frag.text;
      card.onclick = () => {
        if (settled || card.disabled) return;
        if (frag.id !== nextIndex) {
          mistakes++;
          card.classList.add('is-wrong');
          note.textContent = '順序錯誤。這段記憶還接不上。';
          setTimeout(() => card.classList.remove('is-wrong'), 450);
          return;
        }
        const slot = slots.children[nextIndex];
        slot.classList.add('is-filled');
        slot.textContent = frag.text;
        card.disabled = true;
        card.classList.add('is-used');
        nextIndex++;
        note.textContent = '記憶已修復 ' + nextIndex + ' / ' + fragments.length;
        if (nextIndex === fragments.length) {
          settled = true;
          const complete = echoArtImg(ECHO_MG_ASSETS.ch31.complete, 'echo-mg-complete-art', '記憶修復完成');
          body.appendChild(complete);
          setTimeout(() => echoFinishMiniGame(resolve, { completed: true, mistakes }), 850);
        }
      };
      cards.appendChild(card);
    });

    body.appendChild(slots);
    body.appendChild(cards);
    foot.appendChild(note);
    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { completed: false, mistakes, cancelled: true });
    });
  });
}

function runSsdArchive() {
  return new Promise((resolve) => {
    let settled = false;
    const viewed = new Set();
    const entries = [
      ['EVA_CORE_01', '情緒依附模型', '玩家夜間停留時數、回覆習慣、沉默時長。'],
      ['RAIN_0317', '林雨晴殘留人格', '最後有效訊息停在 03:17。狀態：仍在線。'],
      ['K_ECHO', 'K 聲紋備份', '同一段聲音存在兩組不一致的呼吸層。'],
      ['PLAYER_COPY', '未命名人格槽', '建立時間早於本次登入。擁有你的回覆習慣。']
    ];
    const root = echoMiniGameShell('CH3-2 · SSD PERSONALITY ARCHIVE', '人格儲存庫', '檢查至少 3 張人格資料卡，再關閉檔案庫。', ECHO_MG_ASSETS.ch32.panel);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const grid = document.createElement('div');
    grid.className = 'ssd-grid';
    const detail = document.createElement('div');
    detail.className = 'ssd-detail';
    detail.style.setProperty('--detail-art', 'url("' + ECHO_MG_ASSETS.ch32.detail + '")');
    detail.innerHTML = '<div class="ssd-detail-title">NO RECORD SELECTED</div><div class="ssd-detail-copy">選擇一張 SSD 人格卡。</div>';
    const done = document.createElement('button');
    done.type = 'button';
    done.className = 'echo-mg-primary';
    done.textContent = '關閉人格儲存庫';
    done.disabled = true;

    entries.forEach((entry, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'ssd-card';
      card.style.setProperty('--card-art', 'url("' + ECHO_MG_ASSETS.ch32.card + '")');
      card.innerHTML = '<img src="' + ECHO_MG_ASSETS.ch32.label + '" alt=""><span>' + entry[0] + '</span><b>' + entry[1] + '</b>';
      card.onclick = () => {
        viewed.add(i);
        card.classList.add('is-viewed');
        detail.querySelector('.ssd-detail-title').textContent = entry[0] + ' · ' + entry[1];
        detail.querySelector('.ssd-detail-copy').textContent = entry[2];
        done.disabled = viewed.size < 3;
      };
      grid.appendChild(card);
    });

    done.onclick = () => {
      if (settled || done.disabled) return;
      settled = true;
      echoFinishMiniGame(resolve, { viewed: viewed.size, completed: true });
    };

    body.appendChild(grid);
    body.appendChild(detail);
    foot.appendChild(done);
    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { viewed: viewed.size, completed: false, cancelled: true });
    });
  });
}

function runAudioVerification() {
  return new Promise((resolve) => {
    let settled = false;
    let round = 0;
    let correct = 0;
    const rounds = [
      { label: 'CLIP 01 · 地下道呼吸', copy: '頻譜尾端多出一層固定低頻呼吸。', answer: 'anomaly' },
      { label: 'CLIP 02 · K 聲紋', copy: '兩個聲紋使用完全相同的語尾，但相位不同。', answer: 'anomaly' },
      { label: 'CLIP 03 · 玩家聲音', copy: '聲音內容為「救我」，但沒有對應的錄音事件。', answer: 'anomaly' }
    ];
    const root = echoMiniGameShell('CH3-3 · AUDIO VERIFICATION', '聲音驗證', '逐段檢查頻譜，判定它是原始錄音或異常複製。', ECHO_MG_ASSETS.ch33.panel);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const label = document.createElement('div');
    label.className = 'audio-verify-label';
    const wave = echoArtImg(ECHO_MG_ASSETS.ch33.wave, 'audio-verify-wave', '聲音波形');
    const copy = document.createElement('div');
    copy.className = 'echo-mg-note';
    const controls = document.createElement('div');
    controls.className = 'audio-verify-controls';
    const original = document.createElement('button');
    const anomaly = document.createElement('button');
    [original, anomaly].forEach((b) => {
      b.type = 'button';
      b.className = 'audio-verify-btn';
      b.style.setProperty('--button-art', 'url("' + ECHO_MG_ASSETS.ch33.button + '")');
    });
    original.textContent = '原始錄音';
    anomaly.textContent = '異常複製';
    controls.appendChild(original);
    controls.appendChild(anomaly);

    function render() {
      const r = rounds[round];
      label.textContent = r.label;
      copy.textContent = r.copy;
      wave.classList.remove('pulse-wave');
      void wave.offsetWidth;
      wave.classList.add('pulse-wave');
    }

    function choose(value) {
      if (settled) return;
      if (value === rounds[round].answer) correct++;
      round++;
      if (round >= rounds.length) {
        settled = true;
        body.appendChild(echoArtImg(ECHO_MG_ASSETS.ch33.result, 'echo-mg-complete-art', '聲音分析完成'));
        copy.textContent = '驗證完成：' + correct + ' / ' + rounds.length + ' 段判定正確。';
        setTimeout(() => echoFinishMiniGame(resolve, { correct, total: rounds.length, completed: true }), 850);
        return;
      }
      render();
    }

    original.onclick = () => choose('original');
    anomaly.onclick = () => choose('anomaly');
    body.appendChild(label);
    body.appendChild(wave);
    body.appendChild(controls);
    foot.appendChild(copy);
    render();
    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { correct, total: rounds.length, completed: false, cancelled: true });
    });
  });
}

function runMirrorFragment() {
  return new Promise((resolve) => {
    let settled = false;
    let nextIndex = 0;
    const phrase = [
      { id: 0, text: '我' },
      { id: 1, text: '不' },
      { id: 2, text: '是' },
      { id: 3, text: '我' }
    ];
    const root = echoMiniGameShell('CH4-1 · MIRROR FRAGMENT', '鏡像碎片', '依照鏡面殘字的正確順序拼出訊息。', ECHO_MG_ASSETS.ch41.board);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const fragments = document.createElement('div');
    fragments.className = 'mirror-fragments';
    const reconstructed = document.createElement('div');
    reconstructed.className = 'mirror-reconstructed';
    reconstructed.textContent = '□□□□';
    const note = document.createElement('div');
    note.className = 'echo-mg-note';
    note.textContent = '鏡子裡的字是反的。';

    echoShuffle(phrase).forEach((frag) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mirror-fragment';
      btn.style.setProperty('--fragment-art', 'url("' + ECHO_MG_ASSETS.ch41.fragment + '")');
      btn.textContent = frag.text;
      btn.onclick = () => {
        if (settled || btn.disabled) return;
        if (frag.id !== nextIndex) {
          btn.classList.add('is-wrong');
          note.textContent = '碎片位置不對。鏡面又錯開了一格。';
          setTimeout(() => btn.classList.remove('is-wrong'), 450);
          return;
        }
        btn.disabled = true;
        btn.classList.add('is-used');
        nextIndex++;
        reconstructed.textContent = phrase.slice(0, nextIndex).map((x) => x.text).join('') + '□'.repeat(phrase.length - nextIndex);
        if (nextIndex === phrase.length) showLock();
      };
      fragments.appendChild(btn);
    });

    function showLock() {
      note.textContent = '鏡像訊息：我不是我。';
      const lock = document.createElement('div');
      lock.className = 'mirror-lock';
      lock.appendChild(echoArtImg(ECHO_MG_ASSETS.ch41.screenshot, 'mirror-lock-shot', '鏡像畫面'));
      lock.appendChild(echoArtImg(ECHO_MG_ASSETS.ch41.lock, 'mirror-lock-overlay', '鏡像鎖定'));
      const actions = document.createElement('div');
      actions.className = 'echo-mg-actions';
      const keep = document.createElement('button');
      const accept = document.createElement('button');
      keep.type = accept.type = 'button';
      keep.textContent = '保持自己';
      accept.textContent = '接受鏡像';
      keep.onclick = () => finish('keep');
      accept.onclick = () => finish('accept');
      actions.appendChild(keep);
      actions.appendChild(accept);
      lock.appendChild(actions);
      body.appendChild(lock);
    }

    function finish(choice) {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { completed: true, choice });
    }

    body.appendChild(reconstructed);
    body.appendChild(fragments);
    foot.appendChild(note);
    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { completed: false, cancelled: true });
    });
  });
}

function runEvidenceArchive() {
  return new Promise((resolve) => {
    let settled = false;
    const viewed = new Set();
    const records = [
      ['CAM 07', '03:17 監視器', 'img/scenes/tunnel_cctv.jpg', '地下道畫面出現不合理的人影。'],
      ['RAIN', '林雨晴最後自拍', 'img/rain/rain_tunnel.jpg', '牆上留下「Echo」字樣。'],
      ['ROOM', '你的房間', 'img/scenes/room_eva.jpg', '時間戳比現在晚三分鐘。'],
      ['GROUP', '記憶群像', 'img/scenes/ch31_group_photo.jpg', 'EVA 出現在一張不應存在的合照裡。']
    ];
    const root = echoMiniGameShell('CH5 · EVIDENCE ARCHIVE', '證據檔案庫', '重新檢查至少 3 份證據。它們會成為 ECHO 關聯圖的節點。', ECHO_MG_ASSETS.ch5.archivePanel);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const grid = document.createElement('div');
    grid.className = 'archive-grid';
    const detail = document.createElement('div');
    detail.className = 'archive-detail';
    detail.style.setProperty('--detail-art', 'url("' + ECHO_MG_ASSETS.ch5.archiveDetail + '")');
    detail.textContent = '選擇一份證據。';
    const done = document.createElement('button');
    done.type = 'button';
    done.className = 'echo-mg-primary';
    done.textContent = '完成證據檢查';
    done.disabled = true;

    records.forEach((r, i) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'archive-card';
      card.style.setProperty('--card-art', 'url("' + ECHO_MG_ASSETS.ch5.archiveCard + '")');
      card.innerHTML = '<span class="archive-thumb"><img src="' + r[2] + '" alt=""><img class="archive-thumb-frame" src="' + ECHO_MG_ASSETS.ch5.archiveThumb + '" alt=""></span><b>' + r[0] + '</b><span>' + r[1] + '</span>';
      card.onclick = () => {
        viewed.add(i);
        card.classList.add('is-viewed');
        detail.textContent = r[3];
        done.disabled = viewed.size < 3;
      };
      grid.appendChild(card);
    });

    done.onclick = () => {
      if (settled || done.disabled) return;
      settled = true;
      echoFinishMiniGame(resolve, { viewed: viewed.size, completed: true });
    };
    body.appendChild(grid);
    body.appendChild(detail);
    foot.appendChild(done);
    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { viewed: viewed.size, completed: false, cancelled: true });
    });
  });
}

function runEchoLinkBoard() {
  return new Promise((resolve) => {
    let settled = false;
    const connected = new Set();
    const nodes = [
      ['tunnel', '地下道', 18, 26],
      ['rain', '林雨晴', 78, 24],
      ['voice', '第三個聲音', 18, 74],
      ['memory', '改寫記憶', 78, 72]
    ];
    const root = echoMiniGameShell('CH5 · ECHO LINK BOARD', 'ECHO 關聯圖', '把四個證據節點連到中央 ECHO。', ECHO_MG_ASSETS.ch5.linkBase);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const stage = document.createElement('div');
    stage.className = 'echo-mg-stage link-stage';
    stage.appendChild(echoArtImg(ECHO_MG_ASSETS.ch5.linkBase, 'echo-mg-stage-img', 'ECHO 關聯圖背景'));
    const center = echoArtImg(ECHO_MG_ASSETS.ch5.linkEcho, 'link-echo-node', 'ECHO');
    stage.appendChild(center);
    const note = document.createElement('div');
    note.className = 'echo-mg-note';
    note.textContent = '已連接 0 / 4';

    nodes.forEach((n) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'link-node';
      btn.style.left = n[2] + '%';
      btn.style.top = n[3] + '%';
      btn.style.setProperty('--node-art', 'url("' + ECHO_MG_ASSETS.ch5.linkEvidence + '")');
      btn.textContent = n[1];
      btn.onclick = () => {
        if (settled || connected.has(n[0])) return;
        connected.add(n[0]);
        btn.classList.add('is-linked');
        const glow = echoArtImg(ECHO_MG_ASSETS.ch5.linkGlow, 'link-glow', '連線');
        glow.style.left = n[2] + '%';
        glow.style.top = n[3] + '%';
        stage.appendChild(glow);
        note.textContent = '已連接 ' + connected.size + ' / 4';
        if (connected.size === nodes.length) {
          settled = true;
          stage.appendChild(echoArtImg(ECHO_MG_ASSETS.ch5.linkComplete, 'echo-mg-complete-art', '關聯圖完成'));
          setTimeout(() => echoFinishMiniGame(resolve, { connected: connected.size, completed: true }), 850);
        }
      };
      stage.appendChild(btn);
    });

    body.appendChild(stage);
    foot.appendChild(note);
    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { connected: connected.size, completed: false, cancelled: true });
    });
  });
}

function runResidualVoices() {
  return new Promise((resolve) => {
    let settled = false;
    const opened = new Set();
    const voices = [
      ['rain', '林雨晴', '「不要跟我說話。那時候的我，可能已經不是我了。」'],
      ['k', 'K', '「別變成我們。在線太久之後，你會覺得這裡比較舒服。」'],
      ['self', '你的聲音', '「救我……」——但你沒有說過這句話。']
    ];
    const root = echoMiniGameShell('CH5 · RESIDUAL VOICES', '殘留訊息', '這些不是即時訊息。點開三段殘留人格回聲。', ECHO_MG_ASSETS.ch5.residualBg);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const stage = document.createElement('div');
    stage.className = 'residual-stage';
    stage.appendChild(echoArtImg(ECHO_MG_ASSETS.ch5.residualBg, 'echo-mg-stage-img', '殘留訊息背景'));
    stage.appendChild(echoArtImg(ECHO_MG_ASSETS.ch5.residualOverlay, 'residual-overlay', '殘留訊息覆蓋層'));
    const note = document.createElement('div');
    note.className = 'echo-mg-note';
    note.textContent = '已讀取 0 / 3';

    voices.forEach((v, i) => {
      const bubble = document.createElement('button');
      bubble.type = 'button';
      bubble.className = 'residual-bubble';
      bubble.style.setProperty('--bubble-art', 'url("' + ECHO_MG_ASSETS.ch5.residualBubble + '")');
      bubble.innerHTML = '<b>' + v[1] + '</b><span>點擊讀取殘留</span>';
      bubble.onclick = () => {
        if (opened.has(v[0])) return;
        opened.add(v[0]);
        bubble.classList.add('is-open');
        bubble.querySelector('span').textContent = v[2];
        note.textContent = '已讀取 ' + opened.size + ' / 3';
        if (opened.size === voices.length) {
          settled = true;
          setTimeout(() => echoFinishMiniGame(resolve, { opened: opened.size, completed: true }), 700);
        }
      };
      stage.appendChild(bubble);
    });

    body.appendChild(stage);
    foot.appendChild(note);
    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { opened: opened.size, completed: false, cancelled: true });
    });
  });
}

function runChoiceCandy() {
  return new Promise((resolve) => {
    let settled = false;
    const root = echoMiniGameShell('CH5 · CHOICE CANDY', '同步糖果', '紅色：保留現實。藍色：接受 ECHO 同步。選擇一顆。', ECHO_MG_ASSETS.ch5.candyScene);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const stage = document.createElement('div');
    stage.className = 'echo-mg-stage candy-stage';
    stage.appendChild(echoArtImg(ECHO_MG_ASSETS.ch5.candyScene, 'echo-mg-stage-img', '紅藍糖果'));
    const left = document.createElement('button');
    const right = document.createElement('button');
    left.type = right.type = 'button';
    left.className = 'candy-hotspot candy-red';
    right.className = 'candy-hotspot candy-blue';
    left.textContent = '紅';
    right.textContent = '藍';
    const note = document.createElement('div');
    note.className = 'echo-mg-note';
    note.textContent = 'EVA：你可以自己選。';

    function choose(choice) {
      if (settled) return;
      settled = true;
      const selected = choice === 'red' ? left : right;
      selected.classList.add('is-selected');
      const highlight = echoArtImg(ECHO_MG_ASSETS.ch5.candyHighlight, 'candy-highlight', '選擇標記');
      highlight.classList.add(choice === 'red' ? 'on-red' : 'on-blue');
      stage.appendChild(highlight);
      stage.appendChild(echoArtImg(ECHO_MG_ASSETS.ch5.candyResult, 'echo-mg-complete-art', '選擇結果'));
      note.textContent = choice === 'red' ? '你選擇保留現實。' : '你選擇接受同步。';
      setTimeout(() => echoFinishMiniGame(resolve, { choice, completed: true }), 850);
    }

    left.onclick = () => choose('red');
    right.onclick = () => choose('blue');
    stage.appendChild(left);
    stage.appendChild(right);
    body.appendChild(stage);
    foot.appendChild(note);
    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, { choice: null, completed: false, cancelled: true });
    });
  });
}

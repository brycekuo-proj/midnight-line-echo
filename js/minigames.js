// ═══════════════════════════════════════════════════════
//  ECHO GRAPHICAL MINI-GAME LAYER
//  Real DOM/JS interaction + generated production assets.
// ═══════════════════════════════════════════════════════

const ECHO_MG_ASSETS = Object.freeze({
  ch21: {
    base: 'img/ui/mg_ch21_map_base.png?v=20260901-10',
    markers: 'img/ui/mg_ch21_map_markers.png?v=20260901-10',
    panel: 'img/ui/mg_ch21_map_panel.png?v=20260901-10',
    static: 'img/ui/mg_ch21_cctv_static.png?v=20260902-1',
    cctv: 'img/scenes/tunnel_cctv.jpg?v=20260902-1'
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
  openMiniGameOverlay(root, cancel);
}

function echoFinishMiniGame(resolve, result, opts) {
  const o = opts || {};
  const controller = activeWidgetController;
  if (!o.keepVisible && controller && controller.mountTarget === 'overlay') {
    closeMiniGameOverlay(controller);
  } else if (!o.keepVisible) {
    activeWidgetController = null;
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
      { id: 'entrance', label: 'A入口', x: 20, y: 72, thumb: 'static', note: '入口動線正常。雨水積在階梯下方。' },
      { id: 'exit', label: 'B出口', x: 79, y: 22, thumb: 'static', note: '出口沒有異常通行紀錄。' },
      { id: 'camera', label: 'CAM 07', x: 63, y: 48, thumb: 'cctv', note: '監視器拍得到最後畫面，但 03:17 後訊號中斷。' },
      { id: 'blind', label: '死角', x: 39, y: 33, thumb: 'static', note: '這個位置被柱體遮蔽，監視器拍不到。' },
      { id: 'graffiti', label: '塗鴉牆', x: 48, y: 78, thumb: 'static', note: '牆面有一段模糊字樣。再點一次放大。' }
    ];

    const root = echoMiniGameShell('CH2-1 · UNDERGROUND MAP', '萬華地下道調查', '點擊圖上節點調查。塗鴉牆需要二次確認。', ECHO_MG_ASSETS.ch21.panel);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const stage = document.createElement('div');
    stage.className = 'echo-mg-stage map-stage';
    stage.appendChild(echoArtImg(ECHO_MG_ASSETS.ch21.base, 'echo-mg-stage-img', '地下道地圖'));
    stage.appendChild(echoArtImg(ECHO_MG_ASSETS.ch21.markers, 'echo-mg-marker-sheet', '地圖標記素材'));

    const callout = document.createElement('div');
    callout.className = 'map-callout';
    callout.setAttribute('aria-live', 'polite');
    callout.innerHTML =
      '<div class="map-callout-thumb" aria-hidden="true"></div>' +
      '<div class="map-callout-body">' +
        '<div class="map-callout-title"></div>' +
        '<div class="map-callout-copy"></div>' +
      '</div>';
    stage.appendChild(callout);

    const calloutThumb = callout.querySelector('.map-callout-thumb');
    const calloutTitle = callout.querySelector('.map-callout-title');
    const calloutCopy = callout.querySelector('.map-callout-copy');
    const staticPreviewUrl = new URL(ECHO_MG_ASSETS.ch21.static, document.baseURI).href;
    const cctvPreviewUrl = new URL(ECHO_MG_ASSETS.ch21.cctv, document.baseURI).href;

    function showMapCallout(point, copyText, isAlert) {
      const left = Math.max(30, Math.min(70, point.x));
      const showBelow = point.y < 55;
      callout.classList.remove('above', 'below', 'is-alert');
      callout.classList.add(showBelow ? 'below' : 'above');
      if (isAlert) callout.classList.add('is-alert');
      callout.style.left = left + '%';
      callout.style.top = point.y + '%';
      calloutTitle.textContent = point.label;
      calloutCopy.textContent = copyText || point.note;
      const previewUrl = point.thumb === 'cctv' ? cctvPreviewUrl : staticPreviewUrl;
      calloutThumb.style.backgroundImage = 'url("' + previewUrl + '")';
      calloutThumb.style.backgroundSize = 'cover';
      calloutThumb.style.backgroundPosition = 'center';
      callout.classList.add('is-visible');
    }

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
            const clueText = '放大結果：牆上有模糊字樣「LYQ……」';
            graffitiFound = true;
            btn.classList.add('is-clue');
            note.textContent = clueText;
            showMapCallout(p, clueText, true);
            addSync(3);
            gToast('+3% 同步率（塗鴉牆異常）');
          } else {
            note.textContent = p.note;
            showMapCallout(p, p.note, false);
          }
          return;
        }
        note.textContent = p.note;
        showMapCallout(p, p.note, false);
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
    const found = new Set();
    const hitButtons = new Map();
    // Positions measured from the approved 1536×1024 A/B pair.
    // A and B are already geometrically aligned, so both panels share the same coordinates.
    const hotspots = [
      { id: 'photos', label: '照片配置',   x: 58.6, y: 26.3, hitW: 74, hitH: 54, reaction: '我不太喜歡拍自己。可是有些照片……我又捨不得丟。' },
      { id: 'clock',  label: '時鐘時間',   x: 68.5, y: 54.7, hitW: 28, hitH: 22, reaction: '那天我回家很晚……可是我不記得，中間那段時間發生了什麼。' },
      { id: 'note',   label: '粉紅便條',   x: 80.5, y: 57.5, hitW: 26, hitH: 24, reaction: '我有時候會留紙條，怕自己忘記事情。' },
      { id: 'aroma',  label: '右側物件',   x: 88.7, y: 58.6, hitW: 26, hitH: 52, reaction: '我不太喜歡房間太暗。尤其下雨的晚上。' },
      { id: 'teddy',  label: '小熊消失',   x: 45.2, y: 60.5, hitW: 46, hitH: 44, reaction: '那隻熊我一直放在床上。它不應該突然不見。' },
      { id: 'bed',    label: '床單／毯子變化', x: 24.6, y: 78.6, hitW: 86, hitH: 58, reaction: '我其實不太會弄亂床。除非……那天真的很累。' }
    ];
    const totalDifferences = hotspots.length;

    const root = echoMiniGameShell('CH2-2 · SPOT THE DIFFERENCE', '房間照片比對', '上下兩張照片有多處不同。請把所有明顯差異都圈出來。', ECHO_MG_ASSETS.ch22.frame);
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const pair = document.createElement('div');
    pair.className = 'spot-pair';

    const counter = document.createElement('div');
    counter.className = 'echo-mg-note';
    counter.textContent = '已找到 0 / ' + totalDifferences + ' · 上下比對後直接點擊差異';
    const reaction = document.createElement('div');
    reaction.className = 'echo-mg-note spot-reaction';
    reaction.textContent = '林雨晴：我整理東西的時候……發現這兩張照片好像不太一樣。';

    function markFound(h) {
      if (settled || found.has(h.id)) return;
      found.add(h.id);
      const markerUrl = 'url("' + new URL(ECHO_MG_ASSETS.ch22.marker, document.baseURI).href + '")';
      (hitButtons.get(h.id) || []).forEach((hit) => {
        hit.classList.add('is-found');
        hit.style.setProperty('--marker-art', markerUrl);
      });
      counter.textContent = '已找到 ' + found.size + ' / ' + totalDifferences + ' · ' + h.label;
      reaction.textContent = '林雨晴：' + h.reaction;

      if (found.size === totalDifferences) {
        settled = true;
        const lowerStage = pair.querySelector('.spot-panel-b .spot-stage');
        const complete = echoArtImg(ECHO_MG_ASSETS.ch22.complete, 'echo-mg-complete-art spot-complete-art', '比對完成');
        if (lowerStage) lowerStage.appendChild(complete);
        setTimeout(() => echoFinishMiniGame(resolve, { found: totalDifferences, completed: true }), 950);
      }
    }

    function makePanel(kind, label) {
      const panel = document.createElement('div');
      panel.className = 'spot-panel spot-panel-' + kind;

      const title = document.createElement('div');
      title.className = 'spot-photo-label';
      title.textContent = label;

      const stage = document.createElement('div');
      stage.className = 'echo-mg-stage spot-stage';
      const src = kind === 'b' ? ECHO_MG_ASSETS.ch22.b : ECHO_MG_ASSETS.ch22.a;
      stage.appendChild(echoArtImg(src, 'echo-mg-stage-img spot-master', '房間照片 ' + kind.toUpperCase()));

      hotspots.forEach((h) => {
        const hit = document.createElement('button');
        hit.type = 'button';
        hit.className = 'spot-hotspot';
        hit.style.left = h.x + '%';
        hit.style.top = h.y + '%';
        hit.style.setProperty('--spot-w', h.hitW + 'px');
        hit.style.setProperty('--spot-h', h.hitH + 'px');
        hit.setAttribute('aria-label', kind.toUpperCase() + ' 圖差異：' + h.label);
        hit.onclick = () => markFound(h);
        stage.appendChild(hit);
        if (!hitButtons.has(h.id)) hitButtons.set(h.id, []);
        hitButtons.get(h.id).push(hit);
      });

      panel.appendChild(title);
      panel.appendChild(stage);
      return panel;
    }

    pair.appendChild(makePanel('a', 'A · 22:47'));
    pair.appendChild(makePanel('b', 'B · 23:16'));
    body.appendChild(pair);
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
    let attempts = 0;
    let suppressClick = false;
    let dragState = null;
    let activeDropTarget = null;

    // 3-1 locked mechanic: 7 memory positions + 2 decoy fragments.
    // A = correct fragment in the correct position; B = correct fragment in a wrong position.
    const targetIds = [0, 1, 2, 3, 4, 5, 6];
    const fragments = [
      { id: 0, text: 'K：Oracle 裡到底發生什麼？' },
      { id: 1, text: '林雨晴：那不是普通專案。' },
      { id: 2, text: 'K：妳說的那個代號……' },
      { id: 3, text: '林雨晴：你不要直接打名字。' },
      { id: 4, text: 'K：妳之前說過。它和陪伴系統有關。' },
      { id: 5, text: '林雨晴：……因為它本來就不該公開。' },
      { id: 6, text: 'K：那為什麼還要繼續？' },
      { id: 7, text: 'K：我不是第一次看到妳去那裡。' },
      { id: 8, text: '林雨晴：那你為什麼還聯絡他？' }
    ];

    const root = echoMiniGameShell('CH3-1 · MEMORY REPAIR', '記憶修復', '', ECHO_MG_ASSETS.ch31.board);
    const subtitle = root.querySelector('.echo-mg-sub');
    if (subtitle) subtitle.remove();
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');

    const layout = document.createElement('div');
    layout.className = 'memory-repair-layout';
    const slots = document.createElement('div');
    slots.className = 'memory-slots';
    const cards = document.createElement('div');
    cards.className = 'memory-cards';
    const slotElements = [];

    for (let i = 0; i < targetIds.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'memory-slot';
      slot.dataset.index = String(i);
      slot.style.setProperty('--slot-art', 'url("' + ECHO_MG_ASSETS.ch31.slot + '")');
      const index = document.createElement('span');
      index.className = 'memory-slot-index';
      index.textContent = String(i + 1).padStart(2, '0');
      slot.appendChild(index);
      slots.appendChild(slot);
      slotElements.push(slot);
    }

    const score = root.querySelector('.echo-mg-status');
    score.className = 'echo-mg-status memory-score';
    score.setAttribute('aria-live', 'polite');
    score.textContent = '0A0B';
    const submit = document.createElement('button');
    submit.type = 'button';
    submit.className = 'echo-mg-primary memory-submit';
    submit.textContent = '判定';
    submit.disabled = true;

    function getSlotCard(slot) {
      return slot.querySelector('.memory-card');
    }

    function updateFilledState() {
      slotElements.forEach((slot) => slot.classList.toggle('is-filled', !!getSlotCard(slot)));
      submit.disabled = slotElements.some((slot) => !getSlotCard(slot));
    }

    function clearDropTarget() {
      if (activeDropTarget) activeDropTarget.classList.remove('is-drop-target');
      activeDropTarget = null;
    }

    function setDropTarget(target) {
      clearDropTarget();
      if (!target) return;
      activeDropTarget = target;
      activeDropTarget.classList.add('is-drop-target');
    }

    function placeCard(card, slot) {
      if (!card || !slot || settled) return;
      const sourceSlot = card.closest('.memory-slot');
      if (sourceSlot === slot) return;
      const occupying = getSlotCard(slot);

      if (occupying) {
        if (sourceSlot) {
          sourceSlot.appendChild(occupying);
          occupying.classList.add('is-placed');
        } else {
          cards.appendChild(occupying);
          occupying.classList.remove('is-placed');
        }
      }

      slot.appendChild(card);
      card.classList.add('is-placed');
      updateFilledState();
    }

    function returnCard(card) {
      if (!card || settled) return;
      cards.appendChild(card);
      card.classList.remove('is-placed');
      updateFilledState();
    }

    function positionGhost(ghost, x, y) {
      ghost.style.left = x + 'px';
      ghost.style.top = y + 'px';
    }

    function startPointerDrag(event, card) {
      if (settled || event.button > 0) return;
      dragState = {
        card,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        dragging: false,
        ghost: null
      };
      if (card.setPointerCapture) card.setPointerCapture(event.pointerId);
    }

    function movePointerDrag(event) {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      if (!dragState.dragging && Math.hypot(dx, dy) < 7) return;

      if (!dragState.dragging) {
        dragState.dragging = true;
        dragState.card.classList.add('is-drag-source');
        dragState.ghost = dragState.card.cloneNode(true);
        dragState.ghost.classList.add('memory-drag-ghost');
        dragState.ghost.removeAttribute('id');
        document.body.appendChild(dragState.ghost);
      }

      event.preventDefault();
      positionGhost(dragState.ghost, event.clientX, event.clientY);
      const hit = document.elementFromPoint(event.clientX, event.clientY);
      const slot = hit && hit.closest ? hit.closest('.memory-slot') : null;
      const pool = hit && hit.closest ? hit.closest('.memory-cards') : null;
      setDropTarget(slot || pool);
    }

    function finishPointerDrag(event) {
      if (!dragState || dragState.pointerId !== event.pointerId) return;
      const state = dragState;
      if (state.dragging) {
        suppressClick = true;
        const hit = document.elementFromPoint(event.clientX, event.clientY);
        const slot = hit && hit.closest ? hit.closest('.memory-slot') : null;
        const pool = hit && hit.closest ? hit.closest('.memory-cards') : null;
        if (slot) placeCard(state.card, slot);
        else if (pool) returnCard(state.card);
        setTimeout(() => { suppressClick = false; }, 0);
      }
      clearDropTarget();
      state.card.classList.remove('is-drag-source');
      if (state.ghost) state.ghost.remove();
      if (state.card.releasePointerCapture) {
        try { state.card.releasePointerCapture(event.pointerId); } catch (_) {}
      }
      dragState = null;
    }

    function createCard(frag) {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'memory-card';
      card.dataset.memoryId = String(frag.id);
      card.style.setProperty('--card-art', 'url("' + ECHO_MG_ASSETS.ch31.card + '")');
      card.textContent = frag.text;
      card.addEventListener('pointerdown', (event) => startPointerDrag(event, card));
      card.addEventListener('pointermove', movePointerDrag);
      card.addEventListener('pointerup', finishPointerDrag);
      card.addEventListener('pointercancel', finishPointerDrag);
      card.onclick = () => {
        if (settled || suppressClick) return;
        const sourceSlot = card.closest('.memory-slot');
        if (sourceSlot) {
          returnCard(card);
          return;
        }
        const emptySlot = slotElements.find((slot) => !getSlotCard(slot));
        if (emptySlot) placeCard(card, emptySlot);
      };
      return card;
    }

    echoShuffle(fragments).forEach((frag) => cards.appendChild(createCard(frag)));

    submit.onclick = () => {
      if (settled || submit.disabled) return;
      const guess = slotElements.map((slot) => Number(getSlotCard(slot).dataset.memoryId));
      let a = 0;
      let b = 0;
      guess.forEach((id, index) => {
        if (id === targetIds[index]) a++;
        else if (targetIds.includes(id)) b++;
      });

      attempts++;
      const resultText = a + 'A' + b + 'B';
      score.textContent = resultText;

      if (a === targetIds.length) {
        settled = true;
        submit.disabled = true;
        root.querySelectorAll('.memory-card').forEach((card) => {
          card.disabled = true;
          card.classList.remove('is-drag-source');
        });
        const complete = echoArtImg(ECHO_MG_ASSETS.ch31.complete, 'echo-mg-complete-art', '記憶修復完成');
        body.appendChild(complete);
        setTimeout(() => echoFinishMiniGame(resolve, {
          completed: true,
          mistakes: Math.max(0, attempts - 1),
          attempts,
          a,
          b
        }), 850);
      }
    };

    layout.appendChild(slots);
    layout.appendChild(cards);
    body.appendChild(layout);
    foot.appendChild(submit);
    updateFilledState();

    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      if (dragState && dragState.ghost) dragState.ghost.remove();
      clearDropTarget();
      echoFinishMiniGame(resolve, {
        completed: false,
        mistakes: Math.max(0, attempts),
        attempts,
        cancelled: true
      });
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

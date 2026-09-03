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

function runOnlineModeratorGame() {
  return new Promise((resolve) => {
    let settled = false;
    let round = 1;
    let phase = 'discussion';
    let selectedId = null;
    let transitionLocked = false;
    const suspicion = new Map();
    const offlineRound = new Map();
    const moderatorId = 'silentroom';
    const logoutOrder = ['lastseen404', 'echo_guest'];

    // One hidden moderator, four normal online users, one anomalous online user.
    // The anomalous user is a deliberate red herring: strange does not mean moderator.
    const players = [
      {
        id: 'unknown17',
        name: 'Unknown_17',
        meta: '在線 127 天',
        statements: [
          'Sleep_Mode 昨天還在線。他最近一直假裝沒看見我。',
          '他說三年前沒見過我，可是我昨天還看到他。有人改過在線紀錄。',
          '管理者不一定還在線。別只看現在亮著的名字。'
        ]
      },
      {
        id: 'sleepmode',
        name: 'Sleep_Mode',
        meta: '在線 4 年',
        statements: [
          '我三年前就沒看過 Unknown_17。這裡有人很喜歡替別人記憶。',
          '在線太久不代表有權限。有些人只是被留下。',
          '我只能看見 ONLINE。我看不到誰真的完成離線。'
        ]
      },
      {
        id: 'lastseen404',
        name: 'LastSeen_404',
        meta: '最後離線 404 天前',
        statements: [
          '聊天室有時候會忘記人離開……或是假裝忘記。',
          '（已離線）',
          '（已離線）'
        ]
      },
      {
        id: 'silentroom',
        name: 'SilentRoom',
        meta: '在線未知',
        statements: [
          '有人還沒完成同步。',
          '離線不代表離開。名單只會把 ACTIVE 拿掉。',
          '現在應該只有三個 ACTIVE。還有一個……只是被保留。'
        ]
      },
      {
        id: 'echo_guest',
        name: 'EchoGuest',
        meta: '在線 18 分鐘',
        statements: [
          '我只是被邀進來的。進來之前，名單就有這些名字。',
          '剛才有人離線後，我的在線數少了一個。就這樣。',
          '（已離線）'
        ]
      },
      {
        id: '0317',
        name: '03:17',
        meta: '狀態：在線中',
        statements: [
          '我沒有登入時間。你們有嗎？',
          '剛才離線的人還在看這裡。我看得到已讀。',
          '我不知道管理者是誰。但我知道「離線」有時候只是把名字變灰。'
        ]
      }
    ];

    const root = echoMiniGameShell('CH3-2 · ONLINE GAME', '在線局', '', ECHO_MG_ASSETS.ch32.panel);
    root.classList.add('online-werewolf-game');
    const subtitle = root.querySelector('.echo-mg-sub');
    if (subtitle) subtitle.remove();
    const status = root.querySelector('.echo-mg-status');
    status.classList.add('online-game-status');
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');

    const phaseBar = document.createElement('div');
    phaseBar.className = 'online-phase-bar';
    const phaseLabel = document.createElement('span');
    phaseLabel.className = 'online-phase-label';
    const systemLine = document.createElement('span');
    systemLine.className = 'online-system-line';
    phaseBar.appendChild(phaseLabel);
    phaseBar.appendChild(systemLine);

    const roster = document.createElement('div');
    roster.className = 'online-roster';
    const detail = document.createElement('div');
    detail.className = 'online-testimony-detail';
    detail.setAttribute('aria-live', 'polite');
    const action = document.createElement('button');
    action.type = 'button';
    action.className = 'echo-mg-primary online-main-action';

    function onlineCount() {
      return players.length - offlineRound.size;
    }

    function latestStatement(player) {
      const wentOffline = offlineRound.get(player.id);
      if (wentOffline && round > wentOffline) return '（已離線，沒有新的證詞。）';
      return player.statements[Math.max(0, Math.min(player.statements.length - 1, round - 1))];
    }

    function suspicionText(id) {
      const level = suspicion.get(id) || 0;
      if (level === 1) return '?';
      if (level === 2) return 'ADMIN?';
      return '○';
    }

    function cycleSuspicion(id, button) {
      if (phase !== 'discussion' || settled) return;
      const next = ((suspicion.get(id) || 0) + 1) % 3;
      suspicion.set(id, next);
      button.textContent = suspicionText(id);
      button.classList.toggle('is-suspect', next > 0);
      button.classList.toggle('is-admin-suspect', next === 2);
    }

    function showDetail(player) {
      const off = offlineRound.has(player.id);
      detail.innerHTML = '';
      const title = document.createElement('b');
      title.textContent = player.name + (off ? ' · OFFLINE' : ' · ONLINE');
      const copy = document.createElement('span');
      copy.textContent = latestStatement(player);
      detail.appendChild(title);
      detail.appendChild(copy);
    }

    function makeDiscussionCard(player) {
      const card = document.createElement('article');
      card.className = 'online-player-card';
      card.style.setProperty('--card-art', 'url("' + ECHO_MG_ASSETS.ch32.card + '")');
      if (offlineRound.has(player.id)) card.classList.add('is-offline');
      if ((suspicion.get(player.id) || 0) > 0) card.classList.add('is-suspected');

      const top = document.createElement('div');
      top.className = 'online-player-top';
      const identity = document.createElement('button');
      identity.type = 'button';
      identity.className = 'online-player-main';
      identity.innerHTML = '<b></b><span></span>';
      identity.querySelector('b').textContent = player.name;
      identity.querySelector('span').textContent = offlineRound.has(player.id) ? 'OFFLINE' : player.meta;
      identity.onclick = () => showDetail(player);

      const mark = document.createElement('button');
      mark.type = 'button';
      mark.className = 'online-suspicion-mark';
      mark.textContent = suspicionText(player.id);
      if ((suspicion.get(player.id) || 0) > 0) mark.classList.add('is-suspect');
      if ((suspicion.get(player.id) || 0) === 2) mark.classList.add('is-admin-suspect');
      mark.setAttribute('aria-label', '標記 ' + player.name + ' 的懷疑程度');
      mark.onclick = () => cycleSuspicion(player.id, mark);

      const testimony = document.createElement('button');
      testimony.type = 'button';
      testimony.className = 'online-testimony';
      testimony.textContent = latestStatement(player);
      testimony.onclick = () => showDetail(player);

      top.appendChild(identity);
      top.appendChild(mark);
      card.appendChild(top);
      card.appendChild(testimony);
      return card;
    }

    function renderDiscussion(message) {
      phase = 'discussion';
      transitionLocked = false;
      selectedId = null;
      status.textContent = 'ONLINE ' + onlineCount() + ' · R' + round + '/3';
      phaseLabel.textContent = 'ROUND ' + round + ' · 討論';
      systemLine.textContent = message || '在線證詞已更新';
      roster.innerHTML = '';
      players.forEach((player) => roster.appendChild(makeDiscussionCard(player)));
      showDetail(players.find((player) => !offlineRound.has(player.id)) || players[0]);
      action.disabled = false;
      action.textContent = round < 3 ? '結束討論' : '進入最終投票';
    }

    function triggerLogout() {
      if (transitionLocked || settled || round >= 3) return;
      transitionLocked = true;
      action.disabled = true;
      const id = logoutOrder[round - 1];
      const player = players.find((item) => item.id === id);
      offlineRound.set(id, round);
      status.textContent = 'ONLINE ' + onlineCount() + ' · R' + round + '/3';
      phaseLabel.textContent = 'ROUND ' + round + ' · 離線';
      systemLine.textContent = player.name + ' 已離線';
      detail.innerHTML = '<b>SYSTEM</b><span>' + player.name + ' 已離線。這裡的淘汰只會把名字變灰。</span>';
      roster.querySelectorAll('.online-player-card').forEach((card, index) => {
        if (players[index].id === id) card.classList.add('is-offline', 'is-just-offline');
      });
      setTimeout(() => {
        if (settled) return;
        round++;
        const nextMessage = round === 2
          ? '證詞更新 · 有人聲稱離線者仍在已讀'
          : '管理權限異常 · 最後一次討論';
        renderDiscussion(nextMessage);
      }, 950);
    }

    function renderVote() {
      phase = 'vote';
      transitionLocked = false;
      selectedId = null;
      status.textContent = 'FINAL VOTE';
      phaseLabel.textContent = 'ROUND 3 · 指認';
      systemLine.textContent = '管理權限持有者只可指認一次';
      detail.innerHTML = '<b>管理權限</b><span>所有曾在線的人都仍是候選。離線者不會從最終名單排除。</span>';
      roster.innerHTML = '';

      players.forEach((player) => {
        const candidate = document.createElement('button');
        candidate.type = 'button';
        candidate.className = 'online-vote-card';
        candidate.dataset.playerId = player.id;
        if (offlineRound.has(player.id)) candidate.classList.add('is-offline');
        candidate.innerHTML = '<b></b><span></span><small></small>';
        candidate.querySelector('b').textContent = player.name;
        candidate.querySelector('span').textContent = offlineRound.has(player.id) ? 'OFFLINE' : 'ONLINE';
        candidate.querySelector('small').textContent = '你的標記：' + suspicionText(player.id);
        candidate.onclick = () => {
          if (settled) return;
          selectedId = player.id;
          roster.querySelectorAll('.online-vote-card').forEach((node) => node.classList.toggle('is-selected', node.dataset.playerId === selectedId));
          detail.innerHTML = '<b>指認：' + player.name + '</b><span>' + player.statements[2] + '</span>';
          action.disabled = false;
        };
        roster.appendChild(candidate);
      });

      action.textContent = '確認指認';
      action.disabled = true;
    }

    function finishVote() {
      if (settled || !selectedId) return;
      settled = true;
      action.disabled = true;
      roster.querySelectorAll('button').forEach((button) => { button.disabled = true; });
      const success = selectedId === moderatorId;
      const selected = players.find((player) => player.id === selectedId);
      root.classList.add(success ? 'is-victory' : 'is-defeat');
      status.textContent = success ? 'VERIFIED' : 'UNVERIFIED';
      phaseLabel.textContent = success ? '管理權限已驗證' : '在線辨識已結束';
      systemLine.textContent = success ? 'ADMIN LOG ACCESS GRANTED' : '管理權限未確認';
      detail.innerHTML = success
        ? '<b>SilentRoom · MODERATOR</b><span>管理紀錄已解鎖。</span>'
        : '<b>' + selected.name + '</b><span>管理權限驗證失敗。正確身分不會公開。</span>';
      setTimeout(() => echoFinishMiniGame(resolve, {
        completed: true,
        success,
        selectedId,
        selectedName: selected.name,
        offline: Array.from(offlineRound.keys()),
        moderatorVerified: success
      }), 1050);
    }

    action.onclick = () => {
      if (phase === 'vote') {
        finishVote();
        return;
      }
      if (round < 3) {
        triggerLogout();
        return;
      }
      renderVote();
    };

    body.appendChild(phaseBar);
    body.appendChild(roster);
    body.appendChild(detail);
    foot.appendChild(action);
    renderDiscussion('在線者 6 · 身分未知');

    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      echoFinishMiniGame(resolve, {
        completed: false,
        success: false,
        selectedId,
        moderatorVerified: false,
        cancelled: true
      });
    });
  });
}

// Compatibility alias for older chapter snapshots. CH3-2 now uses the full online hidden-role game.
function runSsdArchive() {
  return runOnlineModeratorGame();
}

function runAudioVerification() {
  return new Promise((resolve) => {
    let settled = false;
    let round = 0;
    let correct = 0;
    let mistakes = 0;
    let roundHadMistake = false;
    let transitionLocked = false;
    let activeAudio = null;

    const sound = (name) => 'audio/ch3-3/' + name + '.wav';
    const rounds = [
      { clips: [sound('dog'), sound('dog'), sound('cat')], answer: 2 },
      { clips: [sound('cow'), sound('goat'), sound('cow')], answer: 1 },
      { clips: [sound('bird'), sound('bird'), sound('chicken')], answer: 2 },
      { clips: [sound('cat'), sound('dog'), sound('cat')], answer: 1 },
      { clips: [sound('goat'), sound('chicken'), sound('chicken')], answer: 0 }
    ];

    const root = echoMiniGameShell('CH3-3 · AUDIO VERIFICATION', '聲音驗證', '找出三段聲音中不同的一段。', ECHO_MG_ASSETS.ch33.panel);
    root.classList.add('audio-animal-game');
    const status = root.querySelector('.echo-mg-status');
    const body = root.querySelector('.echo-mg-body');
    const foot = root.querySelector('.echo-mg-foot');
    const label = document.createElement('div');
    label.className = 'audio-verify-label';
    const controls = document.createElement('div');
    controls.className = 'audio-verify-controls';
    const copy = document.createElement('div');
    copy.className = 'echo-mg-note audio-verify-note';
    copy.setAttribute('aria-live', 'polite');

    function stopAudio() {
      if (!activeAudio) return;
      activeAudio.pause();
      activeAudio.currentTime = 0;
      activeAudio = null;
      controls.querySelectorAll('.audio-choice').forEach((choice) => choice.classList.remove('is-playing'));
    }

    function playClip(index, choice) {
      if (settled || transitionLocked) return;
      stopAudio();
      const clip = rounds[round].clips[index];
      const player = new Audio(new URL(clip, document.baseURI).href);
      player.preload = 'auto';
      activeAudio = player;
      choice.classList.add('is-playing');
      player.onended = () => {
        if (activeAudio === player) activeAudio = null;
        choice.classList.remove('is-playing');
      };
      player.onerror = () => {
        if (activeAudio === player) activeAudio = null;
        choice.classList.remove('is-playing');
        copy.textContent = '音訊載入失敗，請重新播放。';
      };
      player.play().catch(() => {
        if (activeAudio === player) activeAudio = null;
        choice.classList.remove('is-playing');
        copy.textContent = '請再點一次播放按鈕。';
      });
    }

    function makeChoice(index) {
      const letters = ['A', 'B', 'C'];
      const choice = document.createElement('div');
      choice.className = 'audio-choice';
      choice.style.setProperty('--button-art', 'url("' + ECHO_MG_ASSETS.ch33.button + '")');

      const wave = echoArtImg(ECHO_MG_ASSETS.ch33.wave, 'audio-choice-wave', '聲音波形 ' + letters[index]);
      const play = document.createElement('button');
      play.type = 'button';
      play.className = 'audio-choice-play';
      play.setAttribute('aria-label', '播放聲音 ' + letters[index]);
      play.innerHTML = '<span class="audio-choice-letter">' + letters[index] + '</span><span class="audio-choice-icon">▶</span>';
      play.onclick = () => playClip(index, choice);

      const select = document.createElement('button');
      select.type = 'button';
      select.className = 'audio-choice-select';
      select.textContent = '選 ' + letters[index];
      select.onclick = () => choose(index, choice);

      choice.appendChild(wave);
      choice.appendChild(play);
      choice.appendChild(select);
      return choice;
    }

    function setControlsDisabled(disabled) {
      controls.querySelectorAll('button').forEach((button) => { button.disabled = disabled; });
    }

    function finish() {
      settled = true;
      transitionLocked = true;
      stopAudio();
      setControlsDisabled(true);
      body.appendChild(echoArtImg(ECHO_MG_ASSETS.ch33.result, 'echo-mg-complete-art audio-verify-result', '聲音驗證完成'));
      status.textContent = '5 / 5';
      label.textContent = 'VERIFIED';
      copy.textContent = mistakes === 0 ? '5 關驗證完成。' : '5 關驗證完成 · 錯誤 ' + mistakes + ' 次。';
      setTimeout(() => echoFinishMiniGame(resolve, {
        correct,
        total: rounds.length,
        mistakes,
        completed: true
      }), 850);
    }

    function choose(index, choice) {
      if (settled || transitionLocked) return;
      stopAudio();
      if (index !== rounds[round].answer) {
        mistakes++;
        roundHadMistake = true;
        choice.classList.add('is-wrong');
        copy.textContent = '不一致。再聽一次。';
        setTimeout(() => choice.classList.remove('is-wrong'), 480);
        return;
      }

      if (!roundHadMistake) correct++;
      choice.classList.add('is-correct');
      copy.textContent = '驗證成功。';
      transitionLocked = true;
      setControlsDisabled(true);

      setTimeout(() => {
        if (settled) return;
        round++;
        roundHadMistake = false;
        transitionLocked = false;
        if (round >= rounds.length) {
          finish();
          return;
        }
        render();
      }, 520);
    }

    function render() {
      stopAudio();
      controls.innerHTML = '';
      status.textContent = (round + 1) + ' / ' + rounds.length;
      label.textContent = 'ROUND ' + String(round + 1).padStart(2, '0');
      copy.textContent = 'A / B / C';
      for (let i = 0; i < 3; i++) controls.appendChild(makeChoice(i));
    }

    body.appendChild(label);
    body.appendChild(controls);
    foot.appendChild(copy);
    render();

    echoMountMiniGame(root, () => {
      if (settled) return;
      settled = true;
      stopAudio();
      echoFinishMiniGame(resolve, {
        correct,
        total: rounds.length,
        mistakes,
        completed: false,
        cancelled: true
      });
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

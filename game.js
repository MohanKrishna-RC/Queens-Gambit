(() => {
  'use strict';
  const E = window.ChessEngine;

  const NAMES = { p: 'Pawn', n: 'Knight', b: 'Bishop', r: 'Rook', q: 'Queen', k: 'King' };

  // Standard chess piece artwork (Colin M.L. Burnett / cburnett set)
  // via Wikimedia Commons - CC BY-SA 3.0, embedded as inline SVG.
  const PIECE_SVGS = {
    w: {
      k: '<g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linejoin="miter" d="M22.5 11.63V6M20 8h5"/><path fill="#fff" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="#fff" d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"/><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g>',
      q: '<g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0m16.5-4.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0M16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0M33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0"/><path stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14z"/><path stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0"/></g>',
      r: '<g fill="#fff" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="butt" d="M9 39h27v-3H9zm3-3v-4h21v4zm-1-22V9h4v2h5V9h5v2h5V9h4v5"/><path d="m34 14-3 3H14l-3-3"/><path stroke-linecap="butt" stroke-linejoin="miter" d="M31 17v12.5H14V17"/><path d="m31 29.5 1.5 2.5h-20l1.5-2.5"/><path fill="none" stroke-linejoin="miter" d="M11 14h23"/></g>',
      b: '<g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.94 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g>',
      n: '<g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#fff" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="#fff" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/><path fill="#000" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.433-9.75a.5 1.5 30 1 1-.866-.5.5 1.5 30 1 1 .866.5"/></g>',
      p: '<path fill="#fff" stroke="#000" stroke-linecap="round" stroke-width="1.5" d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"/>',
    },
    b: {
      k: '<g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linejoin="miter" d="M22.5 11.6V6"/><path fill="#000" stroke-linecap="butt" stroke-linejoin="miter" d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"/><path fill="#000" d="M11.5 37a22.3 22.3 0 0 0 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10z"/><path stroke-linejoin="miter" d="M20 8h5"/><path stroke="#ececec" d="M32 29.5s8.5-4 6-9.7C34.1 14 25 18 22.5 24.6v2.1-2.1C20 18 9.9 14 7 19.9c-2.5 5.6 4.8 9 4.8 9"/><path stroke="#ececec" d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0"/></g>',
      q: '<g fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g stroke="none"><circle cx="6" cy="12" r="2.75"/><circle cx="14" cy="9" r="2.75"/><circle cx="22.5" cy="8" r="2.75"/><circle cx="31" cy="9" r="2.75"/><circle cx="39" cy="12" r="2.75"/></g><path stroke-linecap="butt" d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5z"/><path stroke-linecap="butt" d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"/><path fill="none" stroke-linecap="butt" d="M11 38.5a35 35 1 0 0 23 0"/><path fill="none" stroke="#ececec" d="M11 29a35 35 1 0 1 23 0m-21.5 2.5h20m-21 3a35 35 1 0 0 22 0m-23 3a35 35 1 0 0 24 0"/></g>',
      r: '<g fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path stroke-linecap="butt" d="M9 39h27v-3H9zm3.5-7 1.5-2.5h17l1.5 2.5zm-.5 4v-4h21v4z"/><path stroke-linecap="butt" stroke-linejoin="miter" d="M14 29.5v-13h17v13z"/><path stroke-linecap="butt" d="M14 16.5 11 14h23l-3 2.5zM11 14V9h4v2h5V9h5v2h5V9h4v5z"/><path fill="none" stroke="#ececec" stroke-linejoin="miter" stroke-width="1" d="M12 35.5h21m-20-4h19m-18-2h17m-17-13h17M11 14h23"/></g>',
      b: '<g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><g fill="#000" stroke-linecap="butt"><path d="M9 36c3.4-1 10.1.4 13.5-2 3.4 2.4 10.1 1 13.5 2 0 0 1.6.5 3 2-.7 1-1.6 1-3 .5-3.4-1-10.1.5-13.5-1-3.4 1.5-10.1 0-13.5 1-1.4.5-2.3.5-3-.5 1.4-2 3-2 3-2z"/><path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/><path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/></g><path stroke="#ececec" stroke-linejoin="miter" d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"/></g>',
      n: '<g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path fill="#000" d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/><path fill="#000" d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.04-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-1-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-2 2.5-3c1 0 1 3 1 3"/><path fill="#ececec" stroke="#ececec" d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0m5.43-9.75a.5 1.5 30 1 1-.86-.5.5 1.5 30 1 1 .86.5"/><path fill="#ececec" stroke="none" d="m24.55 10.4-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34s-5.79-6.64-9.19-7.16z"/></g>',
      p: '<path stroke="#000" stroke-linecap="round" stroke-width="1.5" d="M22.5 9a4 4 0 0 0-3.22 6.38 6.48 6.48 0 0 0-.87 10.65c-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47a6.46 6.46 0 0 0-.87-10.65A4.01 4.01 0 0 0 22.5 9z"/>',
    }
  };

  function pieceNode(t, c, cls) {
    const span = document.createElement('span');
    span.className = 'piece ' + c + (cls ? ' ' + cls : '');
    if (NAMES[t]) span.title = NAMES[t];
    span.innerHTML = '<svg viewBox="0 0 45 45" aria-hidden="true">' + PIECE_SVGS[c][t] + '</svg>';
    return span;
  }

  const SAVE_KEY = 'chess-game-v1';

  const els = {
    board: document.getElementById('board'),
    arrows: document.getElementById('arrows'),
    boardWrap: document.getElementById('board-wrap'),
    status: document.getElementById('status'),
    turnDot: document.getElementById('turn-dot'),
    moveList: document.getElementById('move-list'),
    capturedW: document.getElementById('captured-white'),
    capturedB: document.getElementById('captured-black'),
    clockW: document.getElementById('clock-w'),
    clockB: document.getElementById('clock-b'),
    clockWChip: document.getElementById('clock-w-chip'),
    clockBChip: document.getElementById('clock-b-chip'),
    clockSel: document.getElementById('clock-sel'),
    themeSel: document.getElementById('theme-sel'),
    btnNew: document.getElementById('btn-new'),
    btnUndo: document.getElementById('btn-undo'),
    btnFlip: document.getElementById('btn-flip'),
    avatarW: document.getElementById('avatar-w'),
    avatarB: document.getElementById('avatar-b'),
    tagW: document.getElementById('tag-w'),
    tagB: document.getElementById('tag-b'),
    btnSound: document.getElementById('btn-sound'),
    btnHint: document.getElementById('btn-hint'),
    btnPgn: document.getElementById('btn-pgn'),
    btnResign: document.getElementById('btn-resign'),
    btnDraw: document.getElementById('btn-draw'),
    modeSel: document.getElementById('mode-sel'),
    levelSel: document.getElementById('level-sel'),
    levelWrap: document.getElementById('level-wrap'),
    levelField: document.querySelector('#level-wrap').closest('.field-row'),
    promo: document.getElementById('promo-overlay'),
    gameOver: document.getElementById('gameover-overlay'),
    gameOverIcon: document.getElementById('gameover-icon'),
    gameOverText: document.getElementById('gameover-text'),
    gameOverSub: document.getElementById('gameover-sub'),
  };

  let state = E.newState();
  let history = [];        // { snapshot, move, san, captured }
  let repKeys = [];        // position keys for threefold detection
  let selected = null;     // [r, c]
  let legalCache = [];     // legal moves for selected piece
  let lastMove = null;     // move object of last played move
  let flipped = false;
  let pendingPromo = null; // move awaiting promotion choice
  let result = null;       // gameResult when game over
  let thinking = false;
  let soundOn = true;
  let audioCtx = null;
  function getAudio() {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { audioCtx = null; }
    }
    return audioCtx;
  }
  function tone(freq, dur, type, gain, delay) {
    if (!soundOn) return;
    const ctx = getAudio();
    if (!ctx) return;
    const t0 = ctx.currentTime + (delay || 0);
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type || 'sine';
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(gain || 0.12, t0 + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  function playSound(name) {
    switch (name) {
      case 'move': tone(700, 0.07, 'square', 0.08); break;
      case 'capture': tone(220, 0.12, 'triangle', 0.14); tone(140, 0.16, 'sine', 0.1, 0.05); break;
      case 'check': tone(880, 0.1, 'sine', 0.12); tone(1100, 0.12, 'sine', 0.1, 0.08); break;
      case 'castle': tone(600, 0.06, 'square', 0.07); tone(900, 0.07, 'square', 0.07, 0.07); break;
      case 'promote': tone(523, 0.1, 'sine', 0.12); tone(659, 0.1, 'sine', 0.12, 0.1); tone(784, 0.14, 'sine', 0.14, 0.2); break;
      case 'mate': tone(392, 0.18, 'sine', 0.16); tone(330, 0.18, 'sine', 0.14, 0.16); tone(262, 0.24, 'sine', 0.16, 0.32); break;
      case 'illegal': tone(180, 0.12, 'sawtooth', 0.1); break;
      case 'notify': tone(660, 0.08, 'sine', 0.1); break;
    }
  }

  // ---------- clocks ----------
  let timeCtrl = null;     // null = unlimited, else { base: min, inc: s }
  let clocks = { w: null, b: null };
  let tickHandle = null;
  let lastStamp = 0;

  function parseTimeCtrl(v) {
    if (!v || v === 'none') return null;
    const [b, i] = v.split('+').map(Number);
    return { base: b * 60 * 1000, inc: i * 1000 };
  }

  function startClock() {
    stopClock();
    if (!timeCtrl) return;
    lastStamp = performance.now();
    tickHandle = setInterval(tick, 100);
  }

  function stopClock() {
    if (tickHandle) { clearInterval(tickHandle); tickHandle = null; }
  }

  function tick() {
    if (!timeCtrl) return;
    const now = performance.now();
    const delta = now - lastStamp;
    lastStamp = now;
    if (result) { renderClocks(); return; }
    clocks[state.turn] -= delta;
    if (clocks[state.turn] <= 0) {
      clocks[state.turn] = 0;
      result = { over: true, kind: 'timeout', winner: state.turn === 'w' ? 'b' : 'w' };
      render();
      showGameOver();
      return;
    }
    renderClocks();
  }

  // Remaining time with elapsed time since the last stamp factored in.
  function currentClocks() {
    if (!timeCtrl) return { w: null, b: null };
    const delta = result ? 0 : performance.now() - lastStamp;
    const c = { w: clocks.w, b: clocks.b };
    if (!result) c[state.turn] -= delta;
    return { w: Math.max(0, c.w), b: Math.max(0, c.b) };
  }

  function fmtClock(ms) {
    if (ms == null) return '--:--';
    if (ms < 20000) return (Math.floor(Math.max(0, ms) / 100) / 10).toFixed(1);
    const s = Math.ceil(ms / 1000);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function renderClocks() {
    if (!timeCtrl) {
      els.clockW.textContent = '--:--';
      els.clockB.textContent = '--:--';
      els.clockWChip.className = 'clock-chip off';
      els.clockBChip.className = 'clock-chip off';
      return;
    }
    const cur = currentClocks();
    els.clockW.textContent = fmtClock(cur.w);
    els.clockB.textContent = fmtClock(cur.b);
    const low = (ms) => (ms != null && ms < 10000 ? ' low' : '');
    els.clockWChip.className = 'clock-chip' +
      (!result && state.turn === 'w' ? ' active' : '') + low(cur.w);
    els.clockBChip.className = 'clock-chip' +
      (!result && state.turn === 'b' ? ' active' : '') + low(cur.b);
  }

  // ---------- theme ----------
  function applyTheme(name) {
    document.body.className = 'theme-' + name;
  }

  // ---------- persistence ----------
  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({
        state, history, repKeys, lastMove, result,
        flipped, mode: els.modeSel.value, level: els.levelSel.value,
        timeSel: els.clockSel.value, clocks: currentClocks(),
        theme: els.themeSel.value,
        sound: soundOn,
      }));
    } catch (e) { /* storage unavailable */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const s = JSON.parse(raw);
      if (!s || !s.state || !s.state.board) return false;
      state = s.state;
      history = s.history || [];
      repKeys = s.repKeys || [];
      lastMove = s.lastMove || null;
      result = s.result || null;
      flipped = !!s.flipped;
      els.modeSel.value = s.mode || 'ai';
      els.levelSel.value = s.level || 'normal';
      els.clockSel.value = s.timeSel || 'none';
      lastClockSel = els.clockSel.value;
      els.themeSel.value = s.theme || 'brown';
      soundOn = s.sound !== false;
      if (els.btnSound) { els.btnSound.textContent = 'Sound: ' + (soundOn ? 'On' : 'Off'); els.btnSound.setAttribute('aria-pressed', String(soundOn)); }
      timeCtrl = parseTimeCtrl(els.clockSel.value);
      clocks = timeCtrl && s.clocks ? { w: s.clocks.w, b: s.clocks.b } : { w: null, b: null };
      if (timeCtrl && (clocks.w == null || clocks.b == null)) {
        clocks = { w: timeCtrl.base, b: timeCtrl.base };
      }
      applyTheme(s.theme || 'brown');
      if (!result) result = E.gameResult(state, repKeys);
      return true;
    } catch (e) {
      return false;
    }
  }

  // ---------- helpers ----------
  function aiEnabled() {
    return els.modeSel.value === 'ai';
  }

  const rowOrder = () => (flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]);
  const colOrder = () => (flipped ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7]);

  function gameOverKindText(winner, kind) {
    if (!winner) {
      // draws
      switch (kind) {
        case 'stalemate': return 'Draw by stalemate';
        case 'fifty-move': return 'Draw by the fifty-move rule';
        case 'threefold': return 'Draw by threefold repetition';
        case 'insufficient-material': return 'Draw by insufficient material';
        case 'draw-agreed': return 'Draw by agreement';
        default: return 'Draw';
      }
    }
    const w = winner === 'w' ? 'White' : 'Black';
    switch (kind) {
      case 'checkmate': return `${w} wins by checkmate`;
      case 'stalemate': return 'Draw by stalemate';
      case 'fifty-move': return 'Draw by the fifty-move rule';
      case 'threefold': return 'Draw by threefold repetition';
      case 'insufficient-material': return 'Draw by insufficient material';
      case 'timeout': return `${w} wins on time`;
      case 'resign': return `${w} wins by resignation`;
      case 'draw-agreed': return 'Draw by agreement';
      default: return 'Game over';
    }
  }

  // ---------- rendering ----------
  function render() {
    renderBoard();
    drawArrow();
    renderSidebar();
    renderClocks();
  }

  function drawArrow() {
    const svg = els.arrows;
    svg.textContent = '';
    if (!lastMove) return;
    const map = ([r, c]) => [flipped ? 7 - r : r, flipped ? 7 - c : c];
    const [r1, c1] = map(lastMove.from);
    const [r2, c2] = map(lastMove.to);
    const x1 = c1 + 0.5, y1 = r1 + 0.5, x2 = c2 + 0.5, y2 = r2 + 0.5;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len === 0) return;
    const ux = dx / len, uy = dy / len;
    const headLen = 0.34, headHalf = 0.17;
    const bx = x2 - headLen * ux, by = y2 - headLen * uy;   // arrowhead base
    const px = -uy, py = ux;

    const NS = 'http://www.w3.org/2000/svg';
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', bx + ux * 0.05); line.setAttribute('y2', by + uy * 0.05);
    line.setAttribute('stroke', 'rgba(129, 182, 76, 0.7)');
    line.setAttribute('stroke-width', '0.15');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);

    const tip = document.createElementNS(NS, 'polygon');
    tip.setAttribute('points',
      `${x2},${y2} ${bx + headHalf * px},${by + headHalf * py} ${bx - headHalf * px},${by - headHalf * py}`);
    tip.setAttribute('fill', 'rgba(129, 182, 76, 0.7)');
    svg.appendChild(tip);
  }

  function renderBoard() {
    els.board.textContent = '';
    els.board.setAttribute('role', 'grid');
    els.board.setAttribute('aria-label', 'Chess board');
    for (const r of rowOrder()) {
      for (const c of colOrder()) {
        const sq = document.createElement('div');
        sq.className = 'square ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
        sq.dataset.r = r; sq.dataset.c = c;
        sq.setAttribute('role', 'gridcell');
        const f = E.FILES[c] + (8 - r);
        const p = state.board[r][c];
        sq.setAttribute('aria-label', f + (p ? ', ' + (p.c === 'w' ? 'White' : 'Black') + ' ' + NAMES[p.t] : ''));

        if (lastMove &&
            ((lastMove.from[0] === r && lastMove.from[1] === c) ||
             (lastMove.to[0] === r && lastMove.to[1] === c))) {
          sq.classList.add('last');
        }
        if (selected && selected[0] === r && selected[1] === c) sq.classList.add('sel');
        const m = legalCache.find((mv) => mv.to[0] === r && mv.to[1] === c);
        if (m) {
          sq.classList.add(state.board[r][c] ? 'capture' : 'move');
        }

        if (r === (flipped ? 0 : 7)) {
          const f = document.createElement('span');
          f.className = 'coord file';
          f.textContent = E.FILES[c];
          sq.appendChild(f);
        }
        if (c === (flipped ? 7 : 0)) {
          const rk = document.createElement('span');
          rk.className = 'coord rank';
          rk.textContent = String(8 - r);
          sq.appendChild(rk);
        }

        if (p) {
          sq.appendChild(pieceNode(p.t, p.c));
        }
        els.board.appendChild(sq);
      }
    }
    // check highlight
    if (E.inCheck(state, state.turn) && !result) {
      const k = E.findKing(state, state.turn);
      if (k) {
        const sq = els.board.querySelector(`[data-r="${k[0]}"][data-c="${k[1]}"]`);
        if (sq) sq.classList.add('check');
      }
    }
  }

  function renderSidebar() {
    els.turnDot.className = 'dot ' + state.turn;
    els.turnDot.title = state.turn === 'w' ? 'White to move' : 'Black to move';

    let txt;
    if (result) {
      txt = gameOverKindText(result.winner, result.kind);
    } else {
      txt = (state.turn === 'w' ? 'White to move' : 'Black to move');
      if (aiEnabled()) txt += ' (computer)';
      if (E.inCheck(state, state.turn)) txt = 'Check! ' + txt.toLowerCase().replace(/^\w/, (ch) => ch.toUpperCase());
    }
    els.status.textContent = txt;
    els.btnUndo.disabled = history.length === 0 && !result;

    // move list (clickable replay)
    const activeIdx = viewIndex === null ? history.length - 1 : viewIndex;
    els.moveList.textContent = '';
    for (let i = 0; i < history.length; i += 2) {
      const row = document.createElement('div');
      row.className = 'move-row';
      const n = document.createElement('span'); n.className = 'num'; n.textContent = (i / 2 + 1) + '.';
      row.appendChild(n);
      const wm = mkMoveSan(history[i]?.san ?? '', i);
      row.appendChild(wm);
      if (history[i + 1]) row.appendChild(mkMoveSan(history[i + 1].san, i + 1));
      els.moveList.appendChild(row);
    }
    markActive(activeIdx);

    // captured pieces
    renderCaptured();
    els.levelWrap.style.display = aiEnabled() ? '' : 'none';
    els.levelField.style.gridTemplateColumns = aiEnabled() ? '1fr 1fr' : '1fr';
  }

  function mkMoveSan(san, idx) {
    const s = document.createElement('span');
    if (san) {
      s.className = 'mv';
      s.textContent = san;
      s.dataset.idx = idx;
    } else {
      s.className = 'ghost-mv';
      s.textContent = String.fromCharCode(8226);
    }
    return s;
  }

  function markActive(idx) {
    const cur = els.moveList.querySelector('.mv.active');
    if (cur) cur.classList.remove('active');
    if (idx == null || idx < 0) {
      els.moveList.scrollTop = els.moveList.scrollHeight;
      return;
    }
    const el = els.moveList.querySelector('.mv[data-idx="' + idx + '"]');
    if (el) {
      el.classList.add('active');
      el.scrollIntoView({ block: 'nearest' });
    }
    // viewing first move: keep list at top? scroll nearest handles
  }

  function renderCaptured() {
    const capW = []; // pieces captured BY white (black pieces)
    const capB = [];
    for (const h of history) {
      if (h.captured) (h.captured.by === 'w' ? capW : capB).push(h.captured);
    }
    els.capturedW.textContent = '';
    els.capturedB.textContent = '';
    for (const p of capW) els.capturedW.appendChild(pieceNode(p.t, p.c));
    for (const p of capB) els.capturedB.appendChild(pieceNode(p.t, p.c));
  }

  // ---------- game flow ----------
  function newGame() {
    state = E.newState();
    history = [];
    viewIndex = null;
    repKeys = [E.positionKey(state)];
    result = null;
    selected = null; legalCache = []; lastMove = null; pendingPromo = null;
    timeCtrl = parseTimeCtrl(els.clockSel.value);
    clocks = timeCtrl ? { w: timeCtrl.base, b: timeCtrl.base } : { w: null, b: null };
    els.promo.classList.add('hidden');
    if (els.gameOver.open) els.gameOver.close();
    save();
    render();
    startClock();
    maybeAiTurn();
    renderClocks();
  }

  function recordRepKey() {
    repKeys.push(E.positionKey(state));
  }

  function playMove(m) {
    if (result) return false;
    const prev = state;
    const legal = E.legalMovesFor(prev, m.from[0], m.from[1]);
    const legalMove = legal.find((x) => x.to[0] === m.to[0] && x.to[1] === m.to[1] &&
      (x.promo || null) === (m.promo || null) &&
      JSON.stringify(x.flags) === JSON.stringify(m.flags));
    if (!legalMove) return false;

    const capturedObj = prev.board[m.to[0]][m.to[1]]
      ? Object.assign({}, prev.board[m.to[0]][m.to[1]], { by: prev.turn })
      : (m.flags.ep ? Object.assign({}, prev.board[m.from[0]][m.to[1]], { by: prev.turn }) : null);

    const after = E.applyMove(prev, legalMove);
    const notation = E.san(prev, legalMove, legal, after);

    history.push({ snapshot: prev, move: legalMove, san: notation, captured: capturedObj });
    state = after;
    lastMove = legalMove;
    selected = null; legalCache = [];
    viewIndex = null;
    result = E.gameResult(state, repKeys);
    recordRepKey();
    const _wasCapture = !!capturedObj;
    const _wasCastle = legalMove.flags && (legalMove.flags.K || legalMove.flags.Q || legalMove.flags.k || legalMove.flags.q);
    const _wasPromo = !!legalMove.promo;
    if (_wasPromo) playSound('promote');
    else if (result && result.kind === 'checkmate') playSound('mate');
    else if (E.inCheck(state, state.turn)) playSound('check');
    else if (_wasCastle) playSound('castle');
    else if (_wasCapture) playSound('capture');
    else playSound('move');
    if (timeCtrl) {
      // Fischer increment for the side that just moved
      clocks[prev.turn] += timeCtrl.inc;
    }
    save();
    render();
    renderClocks();

    if (result) {
      setTimeout(() => showGameOver(), 250);
    } else {
      maybeAiTurn();
    }
    return true;
  }

  function maybeAiTurn() {
    if (!aiEnabled() || result) return;
    if (state.turn === 'b') {
      thinking = true;
      els.status.textContent = 'Computer thinking...';
      els.status.classList.add('thinking');
      setTimeout(() => {
        try {
          const m = E.bestMove(state, els.levelSel.value);
          if (m) playMove(m);
        } finally {
          thinking = false;
          els.status.classList.remove('thinking');
        }
      }, 220);
    }
  }

  function undo() {
    if (thinking) return;
    let pops = 1;
    if (aiEnabled() && history.length >= 2 && history[history.length - 1].snapshot.turn === 'b') pops = 2;
    if (history.length === 0) {
      // Undo out of game-over banner only (e.g. stalemate check already popped) - no-op
      return;
    }
    const popCount = Math.min(pops, history.length);    for (let i = 0; i < popCount; i++) {
      const h = history.pop();
      state = h.snapshot;
      repKeys.pop();
    }
    result = null;
    if (els.gameOver.open) els.gameOver.close();
    lastMove = history.length ? history[history.length - 1].move : null;
    selected = null; legalCache = [];
    save();
    render();
    maybeAiTurn();
  }

  const GO_ICONS = {
    crown: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 46 L14 20 L23 31 L32 14 L41 31 L50 20 L54 46 Z" fill="#f7c948" stroke="#b98d1e" stroke-width="2.5" stroke-linejoin="round"/><circle cx="14" cy="16" r="3.4" fill="#f7c948"/><circle cx="32" cy="10" r="3.4" fill="#f7c948"/><circle cx="50" cy="16" r="3.4" fill="#f7c948"/></svg>',
    flag: '<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17 8v50" stroke="currentColor" stroke-width="4.5" stroke-linecap="round"/><path d="M17 12 h30 l-8 9 8 9 h-30 Z" fill="currentColor" opacity="0.9"/></svg>',
    half: null,
  };

  function goIconSpec(winner, kind) {
    if (!winner) {
      return { cls: 'draw', html: '<div class="go-half">½</div>' };
    }
    if (kind === 'timeout') {
      return { cls: 'win' + (winner === 'b' ? ' black' : ''), html: '<span class="go-timeout-flag">' + GO_ICONS.flag + '</span>' };
    }
    return { cls: 'win' + (winner === 'b' ? ' black' : ''), html: GO_ICONS.crown };
  }

  const GO_SUBS = {
    checkmate: 'by checkmate',
    timeout: 'on time',
    stalemate: 'by stalemate',
    'fifty-move': 'by the fifty-move rule',
    threefold: 'by threefold repetition',
    'insufficient-material': 'by insufficient material',
    'resign': 'by resignation',
    'draw-agreed': 'by agreement',
  };

  function showGameOver() {
    const r = result;
    if (!r) return;
    const spec = goIconSpec(r.winner, r.kind);
    els.gameOverIcon.className = 'go-icon ' + spec.cls;
    els.gameOverIcon.innerHTML = spec.html;
    els.gameOverText.textContent = r.winner ? (r.winner === 'w' ? 'White wins' : 'Black wins') : 'Draw';
    els.gameOverSub.textContent = GO_SUBS[r.kind] || '';
    els.gameOver.classList.remove('hidden');
    els.gameOver.showModal();
    if (r.kind === 'checkmate' || r.kind === 'resign') playSound('mate');
    else if (r.kind === 'timeout') playSound('mate');
    else playSound('notify');
  }

  // ---------- interaction ----------
  function squareClick(r, c) {
    if (viewIndex !== null) { goToMove(null); return; }
    if (result || thinking || pendingPromo) return;
    if (aiEnabled() && state.turn === 'b') return;

    const target = state.board[r][c];
    if (selected) {
      const mv = legalCache.find((m) => m.to[0] === r && m.to[1] === c);
      if (mv) {
        if (mv.promoNeeded) {
          pendingPromo = { from: mv.from, to: mv.to };
          showPromoDialog();
          return;
        }
        playMove(mv);
        return;
      }
    }
    if (target && target.c === state.turn) {
      selected = [r, c];
      legalCache = E.legalMovesFor(state, r, c);
    } else {
      selected = null; legalCache = [];
    }
    render();
  }

  function showPromoDialog() {
    const row = els.promo.querySelector('.promo-row');
    row.textContent = '';
    for (const t of ['q', 'r', 'b', 'n']) {
      const b = document.createElement('button');
      b.className = 'promo-btn ' + state.turn;
      b.title = NAMES[t];
      b.appendChild(pieceNode(t, state.turn));
      b.addEventListener('click', () => {
        const p = pendingPromo;
        pendingPromo = null;
        els.promo.classList.add('hidden');
        playMove({ from: p.from, to: p.to, flags: {}, promo: t, promoNeeded: true });
      });
      row.appendChild(b);
    }
    els.promo.classList.remove('hidden');
  }

  // ---------- events ----------
  els.board.addEventListener('click', (e) => {
    const sq = e.target.closest('.square');
    if (!sq) return;
    squareClick(Number(sq.dataset.r), Number(sq.dataset.c));
  });

  els.btnNew.addEventListener('click', () => {
    if (history.length && !result && !window.confirm('Start a new game? The current game will be lost.')) return;
    newGame();
  });
  els.btnUndo.addEventListener('click', undo);
  els.btnFlip.addEventListener('click', () => { flipped = !flipped; save(); render(); });
  els.modeSel.addEventListener('change', () => {
    if (history.length && !result && !window.confirm('Changing mode starts a new game. Continue?')) {
      els.modeSel.value = els.modeSel.value === 'ai' ? 'pvp' : 'ai';
      return;
    }
    renderPlayerMeta();
    newGame();
  });
  let lastClockSel = els.clockSel.value;  els.clockSel.addEventListener('change', () => {
    if ((history.length || result) && !window.confirm('Changing the time control starts a new game. Continue?')) {
      els.clockSel.value = lastClockSel;
      return;
    }
    lastClockSel = els.clockSel.value;
    newGame();
  });
  els.themeSel.addEventListener('change', () => {
    applyTheme(els.themeSel.value);
    save();
  });

  function syncSoundBtn() {
    if (els.btnSound) {
      els.btnSound.textContent = 'Sound: ' + (soundOn ? 'On' : 'Off');
      els.btnSound.setAttribute('aria-pressed', String(soundOn));
    }
  }
  if (els.btnSound) els.btnSound.addEventListener('click', () => {
    soundOn = !soundOn;
    syncSoundBtn();
    save();
    if (soundOn) { const c = getAudio(); if (c && c.state === 'suspended') c.resume(); playSound('notify'); }
  });
  syncSoundBtn();

  // Hint: highlight best move
  if (els.btnHint) els.btnHint.addEventListener('click', () => {
    if (result || thinking) return;
    if (aiEnabled() && state.turn === 'b') return;
    const m = E.bestMove(state, 'hard');
    if (!m) return;
    lastMove = null;
    // temporarily show arrow by reusing lastMove mechanism? Use a dedicated hint overlay instead.
    const svg = els.arrows;
    // clear and draw hint arrow in amber
    svg.textContent = '';
    const map = ([r, c]) => [flipped ? 7 - r : r, flipped ? 7 - c : c];
    const [r1, c1] = map(m.from);
    const [r2, c2] = map(m.to);
    const x1 = c1 + 0.5, y1 = r1 + 0.5, x2 = c2 + 0.5, y2 = r2 + 0.5;
    const dx = x2 - x1, dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const ux = dx / len, uy = dy / len;
    const headLen = 0.34, headHalf = 0.17;
    const bx = x2 - headLen * ux, by = y2 - headLen * uy;
    const px = -uy, py = ux;
    const NS = 'http://www.w3.org/2000/svg';
    const line = document.createElementNS(NS, 'line');
    line.setAttribute('x1', x1); line.setAttribute('y1', y1);
    line.setAttribute('x2', bx + ux * 0.05); line.setAttribute('y2', by + uy * 0.05);
    line.setAttribute('stroke', 'rgba(247, 201, 72, 0.85)');
    line.setAttribute('stroke-width', '0.18');
    line.setAttribute('stroke-linecap', 'round');
    svg.appendChild(line);
    const tip = document.createElementNS(NS, 'polygon');
    tip.setAttribute('points', `${x2},${y2} ${bx + headHalf * px},${by + headHalf * py} ${bx - headHalf * px},${by - headHalf * py}`);
    tip.setAttribute('fill', 'rgba(247, 201, 72, 0.85)');
    svg.appendChild(tip);
    // restore real last-move arrow after 2.5s
    setTimeout(() => { drawArrow(); }, 2500);
    playSound('notify');
  });

  // PGN copy
  if (els.btnPgn) els.btnPgn.addEventListener('click', async () => {
    const pgn = buildPGN();
    try { await navigator.clipboard.writeText(pgn); playSound('notify'); }
    catch (e) { window.prompt('Copy PGN:', pgn); }
  });

  function buildPGN() {
    const lines = [];
    lines.push('[Event "Chess Game"]');
    lines.push('[Site "Browser"]');
    lines.push('[Date "' + new Date().toISOString().slice(0,10).replace(/-/g,'.') + '"]');
    lines.push('[White "White"]');
    lines.push('[Black "Black"]');
    lines.push('[Result "' + (result ? (result.kind === 'draw' ? '1/2-1/2' : (result.winner === 'w' ? '1-0' : '0-1')) : '*') + '"]');
    lines.push('');
    let row = '';
    for (let i = 0; i < history.length; i++) {
      if (i % 2 === 0) row += (i/2 + 1) + '. ';
      row += history[i].san + ' ';
      if (i % 2 === 1) { lines.push(row.trim()); row = ''; }
    }
    if (row.trim()) lines.push(row.trim());
    return lines.join('\n');
  }

  // Resign
  if (els.btnResign) els.btnResign.addEventListener('click', () => {
    if (result) return;
    const side = state.turn === 'w' ? 'White' : 'Black';
    if (!window.confirm(side + ' resigns?')) return;
    result = { over: true, kind: 'resign', winner: state.turn === 'w' ? 'b' : 'w' };
    save(); render(); showGameOver(); playSound('mate');
  });
  // Offer draw
  if (els.btnDraw) els.btnDraw.addEventListener('click', () => {
    if (result) return;
    if (!window.confirm('Offer a draw?')) return;
    result = { over: true, kind: 'draw-agreed', winner: null };
    save(); render(); showGameOver(); playSound('notify');
  });

  // Hover previews: ghost piece on legal targets, move dots for own pieces
  els.board.addEventListener('mouseover', (e) => {
    const sq = e.target.closest('.square');
    if (!sq || result || thinking || pendingPromo) return;
    if (aiEnabled() && state.turn === 'b') return;
    const r = Number(sq.dataset.r), c = Number(sq.dataset.c);

    if (selected) {
      if (!legalCache.some((m) => m.to[0] === r && m.to[1] === c)) return;
      const p = state.board[selected[0]][selected[1]];
      if (p) {
        sq.appendChild(pieceNode(p.t, p.c, 'ghost'));
      }
      return;
    }

    const hovered = state.board[r][c];
    if (hovered && hovered.c === state.turn && !sq.querySelector('.move, .capture')) {
      sq.classList.add('hover-sel');
      for (const m of E.legalMovesFor(state, r, c)) {
        const t = els.board.querySelector(`[data-r="${m.to[0]}"][data-c="${m.to[1]}"]`);
        if (t) {
          t.classList.add(state.board[m.to[0]][m.to[1]] ? 'capture' : 'move');
          t.dataset.hoverMark = m.to[0] + '-' + m.to[1];
        }
      }
    }
  });

  els.board.addEventListener('mouseout', (e) => {
    const sq = e.target.closest('.square');
    if (!sq || !els.board.contains(e.relatedTarget)) {
      els.board.querySelectorAll('.ghost').forEach((el) => el.remove());
      els.board.querySelectorAll('[data-hover-mark]').forEach((el) => {
        el.classList.remove('move', 'capture', 'hover-sel');
        delete el.dataset.hoverMark;
      });
      return;
    }
    const insideFrom = sq.dataset.hoverMark !== undefined;
    els.board.querySelectorAll('.ghost').forEach((el) => el.remove());
    if (insideFrom) {
      els.board.querySelectorAll('[data-hover-mark]').forEach((el) => {
        el.classList.remove('move', 'capture', 'hover-sel');
        delete el.dataset.hoverMark;
      });
    }
  });

  // ---------- keyboard shortcuts + move replay ----------
  let viewIndex = null; // null = live (latest); else index into history (0-based move)
  function goToMove(idx) {
    if (idx === null) { viewIndex = null; render(); return; }
    viewIndex = Math.max(-1, Math.min(history.length - 1, idx));
    renderView();
  }
  function renderView() {
    // render board from a historical snapshot
    const base = viewIndex === null ? (history.length ? history[history.length-1] : null) : (viewIndex >= 0 ? history[viewIndex] : null);
    // We'll reuse renderBoard but with a temporary state. Simpler: rebuild state by replaying.
    // For performance, replay from start up to viewIndex.
    let st = E.newState();
    let rk = [E.positionKey(st)];
    let lm = null;
    const end = viewIndex === null ? history.length : viewIndex + 1;
    for (let i = 0; i < end; i++) {
      const m = history[i].move;
      const legal = E.legalMovesFor(st, m.from[0], m.from[1]);
      const lm2 = legal.find(x => x.to[0]===m.to[0] && x.to[1]===m.to[1] && (x.promo||null)===(m.promo||null));
      if (!lm2) break;
      st = E.applyMove(st, lm2);
      rk.push(E.positionKey(st));
      lm = lm2;
    }
    // temporarily swap
    const savedState = state, savedLast = lastMove, savedResult = result;
    state = st; lastMove = lm; result = null;
    renderBoard(); drawArrow(); renderSidebar(); renderClocks();
    state = savedState; lastMove = savedLast; result = savedResult;
    // show viewing banner in status
    if (viewIndex !== null) {
      els.status.textContent = viewIndex < 0
        ? 'Viewing start position'
        : 'Move ' + (viewIndex + 1) + ' of ' + history.length;
    }
  }

  document.addEventListener('keydown', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); const cur = viewIndex === null ? history.length - 1 : viewIndex; goToMove(cur - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); if (viewIndex === null) return; goToMove(viewIndex + 1 >= history.length - 1 ? null : viewIndex + 1); }
    else if (e.key === 'Home') { e.preventDefault(); goToMove(-1); }
    else if (e.key === 'End') { e.preventDefault(); goToMove(null); }
    else if (e.key === 'Escape') { e.preventDefault(); goToMove(null); }
    else if (e.key === 'f' || e.key === 'F') { els.btnFlip.click(); }
    else if (e.key === 'n' || e.key === 'N') { els.btnNew.click(); }
    else if (e.key === 'u' || e.key === 'U') { els.btnUndo.click(); }
    else if (e.key === 'h' || e.key === 'H') { if (els.btnHint) els.btnHint.click(); }
    else if (e.key === 'c' || e.key === 'C') { if (els.btnPgn) els.btnPgn.click(); }
  });

  // ---------- init ----------
  els.moveList.addEventListener('click', (e) => {
    const mv = e.target.closest('.mv');
    if (!mv || mv.dataset.idx === undefined) return;
    goToMove(Number(mv.dataset.idx));
  });

  // player avatars + tags
  function renderPlayerMeta() {
    if (els.avatarW) {
      els.avatarW.textContent = '';
      els.avatarW.appendChild(pieceNode('k', 'w'));
    }
    if (els.avatarB) {
      els.avatarB.textContent = '';
      els.avatarB.appendChild(pieceNode('k', 'b'));
    }
    const oppIsComputer = aiEnabled();
    if (els.tagW) els.tagW.textContent = oppIsComputer ? 'you' : 'player';
    if (els.tagB) els.tagB.textContent = oppIsComputer ? 'computer' : 'player';
  }
  renderPlayerMeta();

  els.promo.querySelector('.promo-close').addEventListener('click', () => {
    pendingPromo = null;
    els.promo.classList.add('hidden');
  });
  els.gameOver.querySelector('.gameover-close').addEventListener('click', () => {
    if (els.gameOver.open) els.gameOver.close();
  });
  els.gameOver.addEventListener('close', () => {
    els.gameOver.classList.add('hidden');
  });
  els.gameOver.querySelector('#gameover-new').addEventListener('click', newGame);

  if (!load()) {
    repKeys = [E.positionKey(state)];
    applyTheme(els.themeSel.value);
    newGame();
  } else {
    repKeys = repKeys.length ? repKeys : [E.positionKey(state)];
    render();
    startClock();
    maybeAiTurn();
    if (result) setTimeout(() => showGameOver(), 250);
  }
})();

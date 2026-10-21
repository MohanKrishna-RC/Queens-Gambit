// Pure chess rules engine. No DOM code. Also loadable in Node for testing.
(function (global) {
  'use strict';

  const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const RANKS = [8, 7, 6, 5, 4, 3, 2, 1]; // rank for board row 0..7

  function initialBoard() {
    const b = [
      [{ t: 'r', c: 'b' }, { t: 'n', c: 'b' }, { t: 'b', c: 'b' }, { t: 'q', c: 'b' }, { t: 'k', c: 'b' }, { t: 'b', c: 'b' }, { t: 'n', c: 'b' }, { t: 'r', c: 'b' }],
      new Array(8).fill(null),
      new Array(8).fill(null),
      new Array(8).fill(null),
      new Array(8).fill(null),
      new Array(8).fill(null),
      new Array(8).fill(null),
      new Array(8).fill(null),
    ];
    for (let c = 0; c < 8; c++) {
      b[1][c] = { t: 'p', c: 'b' };
      b[6][c] = { t: 'p', c: 'w' };
    }
    b[7] = [
      { t: 'r', c: 'w' }, { t: 'n', c: 'w' }, { t: 'b', c: 'w' }, { t: 'q', c: 'w' }, { t: 'k', c: 'w' }, { t: 'b', c: 'w' }, { t: 'n', c: 'w' }, { t: 'r', c: 'w' },
    ];
    for (let r = 2; r < 6; r++) b[r] = new Array(8).fill(null);
    return b;
  }

  function newState() {
    return {
      board: initialBoard(),
      turn: 'w',
      castling: { K: true, Q: true, k: true, q: true },
      ep: null,
      halfmove: 0,
      fullmove: 1,
    };
  }

  function inside(r, c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
  }

  function squareName(r, c) {
    return FILES[c] + RANKS[r];
  }

  function findKing(state, color) {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = state.board[r][c];
        if (p && p.t === 'k' && p.c === color) return [r, c];
      }
    }
    return null;
  }

  // Is square (r,c) attacked by color `by`?
  function attacked(state, r, c, by) {
    const b = state.board;
    // Pawns
    const pd = by === 'w' ? 1 : -1; // attacking pawn sits at r+pd
    for (const dc of [-1, 1]) {
      const pr = r + pd, pc = c + dc;
      if (inside(pr, pc)) {
        const p = b[pr][pc];
        if (p && p.t === 'p' && p.c === by) return true;
      }
    }
    // Knights
    for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
      const rr = r + dr, cc = c + dc;
      if (inside(rr, cc)) {
        const p = b[rr][cc];
        if (p && p.t === 'n' && p.c === by) return true;
      }
    }
    // King
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const rr = r + dr, cc = c + dc;
        if (inside(rr, cc)) {
          const p = b[rr][cc];
          if (p && p.t === 'k' && p.c === by) return true;
        }
      }
    }
    // Sliders
    const rays = [
      [[-1, 0], [1, 0], [0, -1], [0, 1], 'rq'],
      [[-1, -1], [-1, 1], [1, -1], [1, 1], 'bq'],
    ];
    for (const set of rays) {
      const kinds = set[4];
      for (let i = 0; i < 4; i++) {
        const [dr, dc] = set[i];
        let rr = r + dr, cc = c + dc;
        while (inside(rr, cc)) {
          const p = b[rr][cc];
          if (p) {
            if (p.c === by && (p.t === kinds[0] || p.t === kinds[1])) return true;
            break;
          }
          rr += dr; cc += dc;
        }
      }
    }
    return false;
  }

  function inCheck(state, color) {
    const k = findKing(state, color);
    return k ? attacked(state, k[0], k[1], color === 'w' ? 'b' : 'w') : false;
  }

  // Pseudo-legal moves for the piece at (r,c). Returns moves as
  // { from:[r,c], to:[r,c], flags:{ep,castle:'k'|'q',double}, promo:null|'q', promoNeeded:bool }
  function pseudoMoves(state, r, c) {
    const p = state.board[r][c];
    if (!p) return [];
    const moves = [];
    const me = p.c, opp = me === 'w' ? 'b' : 'w';
    const b = state.board;

    const pushMove = (tr, tc, extra) => {
      const m = Object.assign({ from: [r, c], to: [tr, tc], flags: {}, promo: null, promoNeeded: false }, extra || {});
      moves.push(m);
    };

    if (p.t === 'p') {
      const dir = me === 'w' ? -1 : 1;
      const startRow = me === 'w' ? 6 : 1;
      const lastRow = me === 'w' ? 0 : 7;
      const r1 = r + dir;
      if (inside(r1, c) && !b[r1][c]) {
        if (r1 === lastRow) pushMove(r1, c, { promo: 'q', promoNeeded: true });
        else pushMove(r1, c);
        const r2 = r + 2 * dir;
        if (r === startRow && !b[r2][c]) pushMove(r2, c, { flags: { double: true } });
      }
      for (const dc of [-1, 1]) {
        const tc = c + dc;
        if (!inside(r1, tc)) continue;
        const target = b[r1][tc];
        if (target && target.c === opp) {
          if (r1 === lastRow) pushMove(r1, tc, { promo: 'q', promoNeeded: true });
          else pushMove(r1, tc);
        } else if (!target && state.ep && state.ep[0] === r1 && state.ep[1] === tc) {
          pushMove(r1, tc, { flags: { ep: true } });
        }
      }
      return moves;
    }

    if (p.t === 'n') {
      for (const [dr, dc] of [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]) {
        const rr = r + dr, cc = c + dc;
        if (!inside(rr, cc)) continue;
        const t = b[rr][cc];
        if (!t || t.c === opp) pushMove(rr, cc);
      }
      return moves;
    }

    if (p.t === 'k') {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const rr = r + dr, cc = c + dc;
          if (!inside(rr, cc)) continue;
          const t = b[rr][cc];
          if (!t || t.c === opp) pushMove(rr, cc);
        }
      }
      // Castling
      const home = me === 'w' ? 7 : 0;
      if (r === home && c === 4 && !attacked(state, r, c, opp)) {
        const kSide = me === 'w' ? 'K' : 'k';
        const qSide = me === 'w' ? 'Q' : 'q';
        const rkR = b[home];
        if (state.castling[kSide] && !rkR[5] && !rkR[6] && rkR[7] && rkR[7].t === 'r' && rkR[7].c === me &&
            !attacked(state, home, 5, opp) && !attacked(state, home, 6, opp)) {
          pushMove(home, 6, { flags: { castle: 'k' } });
        }
        if (state.castling[qSide] && !rkR[1] && !rkR[2] && !rkR[3] && rkR[0] && rkR[0].t === 'r' && rkR[0].c === me &&
            !attacked(state, home, 3, opp) && !attacked(state, home, 2, opp)) {
          pushMove(home, 2, { flags: { castle: 'q' } });
        }
      }
      return moves;
    }

    const dirs = p.t === 'r' ? [[-1, 0], [1, 0], [0, -1], [0, 1]]
      : p.t === 'b' ? [[-1, -1], [-1, 1], [1, -1], [1, 1]]
      : [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];
    for (const [dr, dc] of dirs) {
      let rr = r + dr, cc = c + dc;
      while (inside(rr, cc)) {
        const t = b[rr][cc];
        if (!t) pushMove(rr, cc);
        else {
          if (t.c === opp) pushMove(rr, cc);
          break;
        }
        rr += dr; cc += dc;
      }
    }
    return moves;
  }

  // Apply a pseudo-legal move, returning a new state.
  function applyMove(state, m) {
    const ns = cloneState(state);
    const b = ns.board;
    const [fr, fc] = m.from;
    const [tr, tc] = m.to;
    const piece = b[fr][fc];
    const me = piece.c;
    const opp = me === 'w' ? 'b' : 'w';

    b[fr][fc] = null;

    if (m.flags.ep) {
      b[fr][tc] = null; // captured pawn sits beside its destination square
    }

    b[tr][tc] = { t: m.promo || piece.t, c: me };

    if (m.flags.castle) {
      const home = me === 'w' ? 7 : 0;
      if (m.flags.castle === 'k') {
        b[home][5] = b[home][7];
        b[home][7] = null;
      } else {
        b[home][3] = b[home][0];
        b[home][0] = null;
      }
    }

    // Castling rights
    if (piece.t === 'k') {
      if (me === 'w') { ns.castling.K = false; ns.castling.Q = false; }
      else { ns.castling.k = false; ns.castling.q = false; }
    }
    const clearRook = (rOwner, file, side) => {
      const p = b[rOwner][file];
      if (p && p.t === 'r') {
        if (side === 'w') {
          if (file === 7) ns.castling.K = false;
          if (file === 0) ns.castling.Q = false;
        } else {
          if (file === 7) ns.castling.k = false;
          if (file === 0) ns.castling.q = false;
        }
      }
    };
    clearRook(fr, fc, me);
    // If a rook was captured on its home square, opponent loses that right
    const oppHome = me === 'w' ? 0 : 7;
    if (tr === oppHome) {
      if (tc === 7 || tc === 0) clearRook(oppHome, tc, opp);
    }

    // En passant target
    ns.ep = m.flags.double ? [(fr + tr) / 2, fc] : null;

    // Clocks (pawn move or capture resets the 50-move counter)
    const wasCapture = m.flags.ep || !!state.board[tr][tc];
    if (piece.t === 'p' || wasCapture) ns.halfmove = 0;

    if (me === 'b') ns.fullmove += 1;
    ns.turn = opp;
    return ns;
  }

  function cloneState(state) {
    const board = state.board.map((row) => row.map((p) => (p ? { t: p.t, c: p.c } : null)));
    return {
      board,
      turn: state.turn,
      castling: { K: state.castling.K, Q: state.castling.Q, k: state.castling.k, q: state.castling.q },
      ep: state.ep ? [state.ep[0], state.ep[1]] : null,
      halfmove: state.halfmove,
      fullmove: state.fullmove,
    };
  }

  // Whether applying move m leaves the mover's own king safe.
  function moveIsSafe(state, m, mover) {
    const ns = applyMove(state, m);
    return !inCheck(ns, mover);
  }

  function legalMovesFor(state, r, c) {
    const p = state.board[r][c];
    if (!p || p.c !== state.turn) return [];
    return pseudoMoves(state, r, c).filter((m) => moveIsSafe(state, m, p.c));
  }

  function allLegalMoves(state) {
    const out = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = state.board[r][c];
        if (p && p.c === state.turn) out.push(...legalMovesFor(state, r, c));
      }
    }
    return out;
  }

  function insufficientMaterial(board) {
    const minors = [];
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (!p || p.t === 'k') continue;
        if (p.t === 'p' || p.t === 'r' || p.t === 'q') return false;
        minors.push({ t: p.t, sqColor: (r + c) % 2 });
      }
    }
    if (minors.length === 0) return true; // K vs K
    if (minors.length === 1) return true; // K+minor vs K
    if (minors.every((m) => m.t === 'b') && minors.every((m) => m.sqColor === minors[0].sqColor)) return true;
    return false;
  }

  // Result: null (game continues) or { over:true, kind, winner }
  function gameResult(state, repKeys) {
    const moves = allLegalMoves(state);
    if (moves.length === 0) {
      if (inCheck(state, state.turn)) {
        return { over: true, kind: 'checkmate', winner: state.turn === 'w' ? 'b' : 'w' };
      }
      return { over: true, kind: 'stalemate', winner: null };
    }
    if (state.halfmove >= 100) return { over: true, kind: 'fifty-move', winner: null };
    if (insufficientMaterial(state.board)) return { over: true, kind: 'insufficient-material', winner: null };
    if (repKeys) {
      const key = positionKey(state);
      let count = 0;
      for (const k of repKeys) if (k === key) count++;
      if (count >= 3) return { over: true, kind: 'threefold', winner: null };
    }
    return null;
  }

  function positionKey(state) {
    const rows = state.board.map((row) => row.map((p) => (p ? p.c + p.t : '-')).join(''));
    return rows.join('|') + '|' + state.turn + '|' +
      (state.castling.K ? 'K' : '') + (state.castling.Q ? 'Q' : '') +
      (state.castling.k ? 'k' : '') + (state.castling.q ? 'q' : '') +
      '|' + (state.ep ? squareName(state.ep[0], state.ep[1]) : '-');
  }

  // SAN notation for a pseudo-legal move given the state it is played from.
  // legalMovesIn: all legal moves in this position (for disambiguation).
  // afterState: state after the move (for check/mate suffix).
  function san(state, m, legalMovesIn, afterState) {
    const p = state.board[m.from[0]][m.from[1]];
    if (!p) return '';
    if (m.flags.castle) {
      return (m.flags.castle === 'k' ? 'O-O' : 'O-O-O') + suffix(afterState);
    }
    const isCapture = !!(state.board[m.to[0]][m.to[1]] || m.flags.ep);
    let out = '';
    if (p.t === 'p') {
      if (isCapture) out += FILES[m.from[1]] + 'x';
      out += squareName(m.to[0], m.to[1]);
      if (m.promo) out += '=' + m.promo.toUpperCase();
    } else {
      out += p.t.toUpperCase();
      const others = legalMovesIn.filter((o) =>
        !(o.from[0] === m.from[0] && o.from[1] === m.from[1]) &&
        p.t === state.board[o.from[0]][o.from[1]]?.t &&
        state.board[o.from[0]][o.from[1]]?.c === p.c &&
        o.to[0] === m.to[0] && o.to[1] === m.to[1]);
      if (others.length) {
        const sameFile = others.some((o) => o.from[1] === m.from[1]);
        const sameRank = others.some((o) => o.from[0] === m.from[0]);
        if (!sameFile) out += FILES[m.from[1]];
        else if (!sameRank) out += String(RANKS[m.from[0]]);
        else out += squareName(m.from[0], m.from[1]);
      }
      if (isCapture) out += 'x';
      out += squareName(m.to[0], m.to[1]);
    }
    return out + suffix(afterState);

    function suffix(st) {
      if (!st) return '';
      const oppInCheck = inCheck(st, st.turn);
      const oppHasMoves = allLegalMoves(st).length > 0;
      if (oppInCheck) return oppHasMoves ? '+' : '#';
      return '';
    }
  }

  const PIECE_VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
  const CENTER_BONUS = 8; // small centralization incentive
  function evaluate(state) {
    // From white's perspective, in centipawns.
    let score = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = state.board[r][c];
        if (!p) continue;
        let v = PIECE_VALUES[p.t];
        const cd = Math.max(Math.abs(r - 3.5), Math.abs(c - 3.5));
        v -= (cd - 1) * CENTER_BONUS;
        if (p.t === 'p') v += p.c === 'w' ? (6 - r) * 3 : (r - 1) * 3;
        score += p.c === 'w' ? v : -v;
      }
    }
    return score;
  }

  function negamax(state, depth, alpha, beta) {
    const moves = allLegalMoves(state);
    if (moves.length === 0) {
      if (inCheck(state, state.turn)) return -100000 - depth; // prefer faster mates
      return 0;
    }
    if (state.halfmove >= 100 || insufficientMaterial(state.board)) return 0;
    if (depth === 0) {
      const e = evaluate(state);
      return state.turn === 'w' ? e : -e;
    }
    moves.sort((a, b) => captureScore(b, state) - captureScore(a, state));
    let best = -Infinity;
    for (const m of moves) {
      const score = -negamax(applyMove(state, m), depth - 1, -beta, -alpha);
      if (score > best) best = score;
      if (best > alpha) alpha = best;
      if (alpha >= beta) break;
    }
    return best;
  }

  function captureScore(m, state) {
    const target = state.board[m.to[0]][m.to[1]];
    let s = 0;
    if (target) s += PIECE_VALUES[target.t];
    if (m.flags.ep) s += PIECE_VALUES.p;
    if (m.promo) s += PIECE_VALUES.q / 2;
    return s;
  }

  // Choose a move for the side to move. level: 'easy' | 'normal' | 'hard'
  function bestMove(state, level) {
    const moves = allLegalMoves(state);
    if (moves.length === 0) return null;
    if (level === 'easy') {
      // Weighted random: captures are slightly more attractive
      const weights = moves.map((m) => 1 + captureScore(m, state) / 150);
      let roll = Math.random() * weights.reduce((a, w) => a + w, 0);
      for (let i = 0; i < moves.length; i++) {
        roll -= weights[i];
        if (roll <= 0) return moves[i];
      }
      return moves[moves.length - 1];
    }
    const depth = level === 'hard' ? 3 : 2;
    let best = null, bestScore = -Infinity;
    const ordered = moves.slice().sort((a, b) => captureScore(b, state) - captureScore(a, state));
    for (const m of ordered) {
      const score = -negamax(applyMove(state, m), depth - 1, -Infinity, Infinity);
      // tiny randomness to avoid identical games
      const jitter = Math.random() * 4;
      if (score + jitter > bestScore) {
        bestScore = score + jitter;
        best = m;
      }
    }
    return best;
  }

  const api = {
    newState, cloneState, applyMove, legalMovesFor, allLegalMoves,
    inCheck, attacked, findKing, gameResult, positionKey, san,
    evaluate, bestMove, insufficientMaterial,
    squareName, FILES,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else global.ChessEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);

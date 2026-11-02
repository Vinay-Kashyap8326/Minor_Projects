(() => {
  'use strict';

  /* ================= Constants ================= */

  const WHITE = 'w';
  const BLACK = 'b';
  const FILES = 'abcdefgh';
  const BACK_RANK = ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'];
  const PROMO_PIECES = ['q', 'r', 'b', 'n'];
  const ICON = {
    p: 'fa-chess-pawn', n: 'fa-chess-knight', b: 'fa-chess-bishop',
    r: 'fa-chess-rook', q: 'fa-chess-queen', k: 'fa-chess-king'
  };
  const NAME = { p: 'Pawn', n: 'Knight', b: 'Bishop', r: 'Rook', q: 'Queen', k: 'King' };
  const KNIGHT_STEPS = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
  const KING_STEPS = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
  const ROOK_DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const BISHOP_DIRS = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
  // Rook home squares -> castling right they control
  const ROOK_HOME = { 56: 'wQ', 63: 'wK', 0: 'bQ', 7: 'bK' };

  /* ================= Board helpers ================= */
  // Square index: 0 = a8 ... 63 = h1. Row 0 is rank 8, row 7 is rank 1.

  const rowOf = (i) => i >> 3;
  const colOf = (i) => i & 7;
  const idx = (r, c) => r * 8 + c;
  const inside = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const squareName = (i) => FILES[colOf(i)] + (8 - rowOf(i));
  const opp = (color) => (color === WHITE ? BLACK : WHITE);

  function kingSquare(board, color) {
    for (let i = 0; i < 64; i++) {
      const p = board[i];
      if (p && p.t === 'k' && p.c === color) return i;
    }
    return -1;
  }

  // Is square `sq` attacked by any piece of color `by`?
  function isAttacked(board, sq, by) {
    const r = rowOf(sq);
    const c = colOf(sq);

    // Pawns: a white pawn attacks upward, so it sits one row below the target
    const pr = by === WHITE ? r + 1 : r - 1;
    for (const dc of [-1, 1]) {
      if (inside(pr, c + dc)) {
        const p = board[idx(pr, c + dc)];
        if (p && p.c === by && p.t === 'p') return true;
      }
    }

    for (const [dr, dc] of KNIGHT_STEPS) {
      if (inside(r + dr, c + dc)) {
        const p = board[idx(r + dr, c + dc)];
        if (p && p.c === by && p.t === 'n') return true;
      }
    }

    for (const [dr, dc] of KING_STEPS) {
      if (inside(r + dr, c + dc)) {
        const p = board[idx(r + dr, c + dc)];
        if (p && p.c === by && p.t === 'k') return true;
      }
    }

    const sliders = [
      [ROOK_DIRS, 'rq'],
      [BISHOP_DIRS, 'bq']
    ];
    for (const [dirs, types] of sliders) {
      for (const [dr, dc] of dirs) {
        let rr = r + dr;
        let cc = c + dc;
        while (inside(rr, cc)) {
          const p = board[idx(rr, cc)];
          if (p) {
            if (p.c === by && types.includes(p.t)) return true;
            break;
          }
          rr += dr;
          cc += dc;
        }
      }
    }
    return false;
  }

  function inCheck(state, color) {
    const k = kingSquare(state.board, color);
    return k >= 0 && isAttacked(state.board, k, opp(color));
  }

  /* ================= State ================= */

  function initialState() {
    const board = new Array(64).fill(null);
    for (let c = 0; c < 8; c++) {
      board[idx(0, c)] = { t: BACK_RANK[c], c: BLACK };
      board[idx(1, c)] = { t: 'p', c: BLACK };
      board[idx(6, c)] = { t: 'p', c: WHITE };
      board[idx(7, c)] = { t: BACK_RANK[c], c: WHITE };
    }
    return {
      board,
      turn: WHITE,
      castling: { wK: true, wQ: true, bK: true, bQ: true },
      ep: -1,          // square a pawn just passed over (en passant target), or -1
      halfmove: 0,     // for the 50-move rule
      fullmove: 1
    };
  }

  function cloneState(s) {
    return {
      board: s.board.slice(),
      turn: s.turn,
      castling: { ...s.castling },
      ep: s.ep,
      halfmove: s.halfmove,
      fullmove: s.fullmove
    };
  }

  /* ================= Move generation ================= */

  function addCastling(s, from, moves) {
    const me = s.turn;
    const row = me === WHITE ? 7 : 0;
    if (from !== idx(row, 4)) return;

    const b = s.board;
    const enemy = opp(me);
    if (isAttacked(b, from, enemy)) return; // cannot castle out of check

    const k = me === WHITE ? 'w' : 'b';
    const ownRook = (sq) => {
      const p = b[sq];
      return p && p.t === 'r' && p.c === me;
    };

    // King side: f and g empty, f and g not attacked
    if (
      s.castling[k + 'K'] &&
      ownRook(idx(row, 7)) &&
      !b[idx(row, 5)] && !b[idx(row, 6)] &&
      !isAttacked(b, idx(row, 5), enemy) &&
      !isAttacked(b, idx(row, 6), enemy)
    ) {
      moves.push({ from, to: idx(row, 6), castle: 'K' });
    }

    // Queen side: b, c, d empty; c and d not attacked
    if (
      s.castling[k + 'Q'] &&
      ownRook(idx(row, 0)) &&
      !b[idx(row, 1)] && !b[idx(row, 2)] && !b[idx(row, 3)] &&
      !isAttacked(b, idx(row, 3), enemy) &&
      !isAttacked(b, idx(row, 2), enemy)
    ) {
      moves.push({ from, to: idx(row, 2), castle: 'Q' });
    }
  }

  // All moves for the side to move, ignoring whether they leave own king in check
  function pseudoMoves(s) {
    const moves = [];
    const me = s.turn;
    const board = s.board;

    for (let from = 0; from < 64; from++) {
      const p = board[from];
      if (!p || p.c !== me) continue;

      const r = rowOf(from);
      const c = colOf(from);

      if (p.t === 'p') {
        const dir = me === WHITE ? -1 : 1;
        const startRow = me === WHITE ? 6 : 1;
        const promoRow = me === WHITE ? 0 : 7;

        const pushPawn = (to) => {
          if (rowOf(to) === promoRow) {
            for (const t of PROMO_PIECES) moves.push({ from, to, promo: t });
          } else {
            moves.push({ from, to });
          }
        };

        const r1 = r + dir;
        if (inside(r1, c) && !board[idx(r1, c)]) {
          pushPawn(idx(r1, c));
          const r2 = r + 2 * dir;
          if (r === startRow && !board[idx(r2, c)]) {
            moves.push({ from, to: idx(r2, c) });
          }
        }

        for (const dc of [-1, 1]) {
          const cc = c + dc;
          if (!inside(r1, cc)) continue;
          const to = idx(r1, cc);
          const target = board[to];
          if ((target && target.c !== me) || to === s.ep) {
            pushPawn(to);
          }
        }
      } else if (p.t === 'n' || p.t === 'k') {
        const steps = p.t === 'n' ? KNIGHT_STEPS : KING_STEPS;
        for (const [dr, dc] of steps) {
          const rr = r + dr;
          const cc = c + dc;
          if (!inside(rr, cc)) continue;
          const to = idx(rr, cc);
          const t = board[to];
          if (!t || t.c !== me) moves.push({ from, to });
        }
        if (p.t === 'k') addCastling(s, from, moves);
      } else {
        const dirs = p.t === 'r'
          ? ROOK_DIRS
          : p.t === 'b'
            ? BISHOP_DIRS
            : [...ROOK_DIRS, ...BISHOP_DIRS];
        for (const [dr, dc] of dirs) {
          let rr = r + dr;
          let cc = c + dc;
          while (inside(rr, cc)) {
            const to = idx(rr, cc);
            const t = board[to];
            if (!t) {
              moves.push({ from, to });
            } else {
              if (t.c !== me) moves.push({ from, to });
              break;
            }
            rr += dr;
            cc += dc;
          }
        }
      }
    }
    return moves;
  }

  // Apply a move and return the new state (does not mutate the input)
  function applyMove(s, m) {
    const n = cloneState(s);
    const b = n.board;
    const piece = b[m.from];
    const me = piece.c;
    const r0 = rowOf(m.from);
    const c0 = colOf(m.from);
    const r1 = rowOf(m.to);
    const c1 = colOf(m.to);
    const captured = b[m.to];
    let isCapture = !!captured;

    // En passant: pawn moves diagonally to an empty square -> remove the passed pawn
    if (piece.t === 'p' && m.to === s.ep && !captured && c0 !== c1) {
      b[idx(r0, c1)] = null;
      isCapture = true;
    }

    // Castling: move the rook too
    if (m.castle) {
      if (m.castle === 'K') {
        b[idx(r0, 5)] = b[idx(r0, 7)];
        b[idx(r0, 7)] = null;
      } else {
        b[idx(r0, 3)] = b[idx(r0, 0)];
        b[idx(r0, 0)] = null;
      }
    }

    b[m.to] = m.promo ? { t: m.promo, c: me } : piece;
    b[m.from] = null;

    // Castling rights
    if (piece.t === 'k') {
      n.castling[me + 'K'] = false;
      n.castling[me + 'Q'] = false;
    }
    for (const sq of [m.from, m.to]) {
      const right = ROOK_HOME[sq];
      if (right) n.castling[right] = false;
    }

    // En passant target after a double pawn push
    n.ep = (piece.t === 'p' && Math.abs(r1 - r0) === 2) ? idx((r0 + r1) / 2, c0) : -1;

    n.halfmove = (piece.t === 'p' || isCapture) ? 0 : s.halfmove + 1;
    if (me === BLACK) n.fullmove = s.fullmove + 1;
    n.turn = opp(me);
    return n;
  }

  function legalMoves(s) {
    return pseudoMoves(s).filter((m) => {
      const next = applyMove(s, m);
      return !inCheck(next, s.turn);
    });
  }

  /* ================= Notation ================= */

  function toSAN(s, m, legal) {
    if (m.castle) return m.castle === 'K' ? 'O-O' : 'O-O-O';

    const piece = s.board[m.from];
    const dest = squareName(m.to);
    const capture = !!s.board[m.to] || (piece.t === 'p' && m.to === s.ep);

    if (piece.t === 'p') {
      let san = capture ? FILES[colOf(m.from)] + 'x' + dest : dest;
      if (m.promo) san += '=' + m.promo.toUpperCase();
      return san;
    }

    // Disambiguation when two same pieces can reach the same square
    let dis = '';
    const others = legal.filter((o) =>
      o.to === m.to && o.from !== m.from && !o.castle && s.board[o.from].t === piece.t
    );
    if (others.length) {
      const sameFile = others.some((o) => colOf(o.from) === colOf(m.from));
      const sameRank = others.some((o) => rowOf(o.from) === rowOf(m.from));
      if (!sameFile) dis = FILES[colOf(m.from)];
      else if (!sameRank) dis = String(8 - rowOf(m.from));
      else dis = squareName(m.from);
    }

    return piece.t.toUpperCase() + dis + (capture ? 'x' : '') + dest;
  }

  /* ================= Draw detection helpers ================= */

  function hasLegalEp(s, legal) {
    return s.ep >= 0 && legal.some((m) => {
      const p = s.board[m.from];
      return m.to === s.ep && p && p.t === 'p';
    });
  }

  // Position key used for threefold repetition
  function posKey(s, legal) {
    const board = s.board.map((p) => (p ? p.c + p.t : '--')).join('');
    const castle = (s.castling.wK ? 'K' : '') + (s.castling.wQ ? 'Q' : '') +
                   (s.castling.bK ? 'k' : '') + (s.castling.bQ ? 'q' : '');
    const ep = hasLegalEp(s, legal) ? String(s.ep) : '-';
    return board + '|' + s.turn + '|' + castle + '|' + ep;
  }

  // Dead positions: only kings, or king + one minor, or only same-colored bishops
  function insufficientMaterial(board) {
    const minors = [];
    for (let i = 0; i < 64; i++) {
      const p = board[i];
      if (!p || p.t === 'k') continue;
      if (p.t === 'p' || p.t === 'r' || p.t === 'q') return false;
      minors.push({ t: p.t, color: (rowOf(i) + colOf(i)) % 2 });
    }
    if (minors.length <= 1) return true;
    if (minors.every((m) => m.t === 'b') && minors.every((m) => m.color === minors[0].color)) {
      return true;
    }
    return false;
  }

  /* ================= Game ================= */

  const game = {
    state: initialState(),
    past: [],          // { state, last, key, san } for every move played
    last: null,        // { from, to } of the last move
    selected: -1,
    legal: [],
    check: false,
    key: '',
    result: null,      // { mate: true, winner } | { draw: 'reason' } | null
    pendingPromo: false,
    flipped: false
  };

  function updateResult() {
    const s = game.state;
    game.legal = legalMoves(s);
    game.check = inCheck(s, s.turn);
    game.key = posKey(s, game.legal);
    game.result = null;

    if (game.legal.length === 0) {
      game.result = game.check
        ? { mate: true, winner: opp(s.turn) }
        : { draw: 'Stalemate' };
    } else if (s.halfmove >= 100) {
      game.result = { draw: '50-move rule' };
    } else if (insufficientMaterial(s.board)) {
      game.result = { draw: 'Insufficient material' };
    } else if (game.past.filter((e) => e.key === game.key).length >= 2) {
      game.result = { draw: 'Threefold repetition' };
    }
  }

  function makeMove(m) {
    const s = game.state;
    const san = toSAN(s, m, game.legal);
    const next = applyMove(s, m);

    const entry = { state: s, last: game.last, key: game.key, san: '' };
    game.past.push(entry);

    game.state = next;
    game.last = { from: m.from, to: m.to };
    game.selected = -1;
    updateResult();

    entry.san = san + (game.check ? (game.legal.length ? '+' : '#') : '');
    render();
  }

  function undo() {
    if (!game.past.length || game.pendingPromo) return;
    const e = game.past.pop();
    game.state = e.state;
    game.last = e.last;
    game.selected = -1;
    updateResult();
    render();
  }

  function resetGame() {
    hidePromotion();
    game.state = initialState();
    game.past = [];
    game.last = null;
    game.selected = -1;
    updateResult();
    render();
  }

  /* ================= DOM ================= */

  const boardEl = document.getElementById('board');
  const promoOverlay = document.getElementById('promoOverlay');
  const promoChoices = document.getElementById('promoChoices');
  const statusText = document.getElementById('statusText');
  const turnDot = document.getElementById('turnDot');
  const movesEl = document.getElementById('moves');
  const undoBtn = document.getElementById('undoBtn');
  const flipBtn = document.getElementById('flipBtn');
  const newBtn = document.getElementById('newBtn');

  const squares = new Array(64);
  const pieceEls = new Array(64);

  for (let i = 0; i < 64; i++) {
    const r = rowOf(i);
    const c = colOf(i);

    const sq = document.createElement('div');
    sq.className = 'square ' + ((r + c) % 2 === 0 ? 'light' : 'dark');
    sq.dataset.sq = String(i);

    if (c === 0) {
      const rank = document.createElement('span');
      rank.className = 'coord rank';
      rank.textContent = String(8 - r);
      sq.appendChild(rank);
    }
    if (r === 7) {
      const file = document.createElement('span');
      file.className = 'coord file';
      file.textContent = FILES[c];
      sq.appendChild(file);
    }

    const pc = document.createElement('i');
    pc.className = 'piece';
    sq.appendChild(pc);

    boardEl.appendChild(sq);
    squares[i] = sq;
    pieceEls[i] = pc;
  }

  function applyFlip() {
    for (let i = 0; i < 64; i++) {
      squares[i].style.order = String(game.flipped ? 63 - i : i);
    }
  }

  function renderStatus() {
    const s = game.state;
    const r = game.result;
    let text;
    let cls = '';

    if (r && r.mate) {
      text = 'Checkmate! ' + (r.winner === WHITE ? 'White' : 'Black') + ' wins';
      cls = 'over';
    } else if (r && r.draw) {
      text = 'Draw · ' + r.draw;
      cls = 'over';
    } else {
      text = (s.turn === WHITE ? 'White' : 'Black') + ' to move';
      if (game.check) {
        text += ' · Check!';
        cls = 'alert';
      }
    }

    statusText.textContent = text;
    statusText.className = cls;
    turnDot.className = 'dot ' + (s.turn === WHITE ? 'white' : 'black');
    undoBtn.disabled = game.past.length === 0;
  }

  function renderMoves() {
    movesEl.textContent = '';

    if (!game.past.length) {
      const empty = document.createElement('div');
      empty.className = 'moveEmpty';
      empty.textContent = 'No moves yet';
      movesEl.appendChild(empty);
      return;
    }

    const sans = game.past.map((e) => e.san);
    for (let i = 0; i < sans.length; i += 2) {
      const row = document.createElement('div');
      row.className = 'moveRow';

      const num = document.createElement('span');
      num.className = 'moveNum';
      num.textContent = (i / 2 + 1) + '.';

      const white = document.createElement('span');
      white.textContent = sans[i];

      const black = document.createElement('span');
      black.textContent = sans[i + 1] || '';

      row.append(num, white, black);
      movesEl.appendChild(row);
    }
    movesEl.scrollTop = movesEl.scrollHeight;
  }

  function render() {
    const s = game.state;

    // Destination squares for the selected piece
    const targets = new Map();
    if (game.selected >= 0) {
      for (const m of game.legal) {
        if (m.from !== game.selected) continue;
        const isCap = !!s.board[m.to] || (s.board[m.from].t === 'p' && m.to === s.ep);
        targets.set(m.to, isCap);
      }
    }

    const kingSq = game.check ? kingSquare(s.board, s.turn) : -1;

    for (let i = 0; i < 64; i++) {
      const el = squares[i];
      const p = s.board[i];
      const t = targets.get(i);

      el.classList.toggle('selected', i === game.selected);
      el.classList.toggle('last', !!game.last && (i === game.last.from || i === game.last.to));
      el.classList.toggle('check', i === kingSq);
      el.classList.toggle('target', t === false);
      el.classList.toggle('capture', t === true);

      pieceEls[i].className = p
        ? 'piece fa-solid ' + ICON[p.t] + ' ' + (p.c === WHITE ? 'white' : 'black')
        : 'piece';
    }

    renderStatus();
    renderMoves();
  }

  /* ================= Promotion ================= */

  function showPromotion(moves) {
    game.pendingPromo = true;
    const color = game.state.turn;
    promoChoices.textContent = '';

    for (const m of moves) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'promoBtn';
      btn.setAttribute('aria-label', 'Promote to ' + NAME[m.promo]);

      const icon = document.createElement('i');
      icon.className = 'piece fa-solid ' + ICON[m.promo] + ' ' + (color === WHITE ? 'white' : 'black');
      btn.appendChild(icon);

      btn.addEventListener('click', () => {
        hidePromotion();
        makeMove(m);
      });
      promoChoices.appendChild(btn);
    }
    promoOverlay.classList.remove('hidden');
  }

  function hidePromotion() {
    game.pendingPromo = false;
    promoOverlay.classList.add('hidden');
  }

  promoOverlay.addEventListener('click', (e) => {
    if (e.target === promoOverlay) {
      hidePromotion();
      game.selected = -1;
      render();
    }
  });

  /* ================= Input ================= */

  boardEl.addEventListener('click', (e) => {
    if (game.pendingPromo || game.result) return;

    const sqEl = e.target.closest('.square');
    if (!sqEl) return;
    const i = Number(sqEl.dataset.sq);

    // Try to move the selected piece to the clicked square
    if (game.selected >= 0) {
      const moves = game.legal.filter((m) => m.from === game.selected && m.to === i);
      if (moves.length) {
        if (moves[0].promo) {
          showPromotion(moves);
        } else {
          makeMove(moves[0]);
        }
        return;
      }
    }

    // Otherwise select / deselect
    const p = game.state.board[i];
    if (i === game.selected) {
      game.selected = -1;
    } else if (p && p.c === game.state.turn) {
      game.selected = i;
    } else {
      game.selected = -1;
    }
    render();
  });

  undoBtn.addEventListener('click', undo);
  newBtn.addEventListener('click', resetGame);
  flipBtn.addEventListener('click', () => {
    game.flipped = !game.flipped;
    applyFlip();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (game.pendingPromo) hidePromotion();
      game.selected = -1;
      render();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      undo();
    }
  });

  /* ================= Start ================= */

  applyFlip();
  updateResult();
  render();
})();
(() => {
  'use strict';
  const MAX_DIGITS = 15;
  const MAX_HISTORY = 30;
  const OPERATORS = ['+', '–', '×', '÷'];
  const calcBox = document.getElementById('calculatorBox');
  const inputArea = document.getElementById('inputArea');
  const buttons = document.querySelectorAll('#buttons button');
  const clockLink = document.querySelector('#headerArea > a');
  const otherLinks = document.querySelectorAll('#rightPart a');

  inputArea.innerHTML = '<div id="expression"></div><div id="result"></div>';
  const exprEl = document.getElementById('expression');
  const resultEl = document.getElementById('result');

  const state = {
    expr: '', // what is being typed, in display symbols (+ – × ÷ %)
    lastExpr: '', // shown small above the result after pressing =
    justEvaluated: false,
    error: false,
    history: []
  };

  /* ---------- Helpers ---------- */

  const lastChar = () => state.expr.slice(-1);
  const isOperator = (c) => OPERATORS.includes(c);
  const currentNumber = () => state.expr.split(/[+–×÷()%]/).pop();
  const countOf = (ch) => state.expr.split(ch).length - 1;

  function render() {
    exprEl.textContent = state.lastExpr ? state.lastExpr + ' =': '';
    resultEl.textContent = state.error ? 'Error': (state.expr || '0');
    exprEl.scrollLeft = exprEl.scrollWidth;
    resultEl.scrollLeft = resultEl.scrollWidth;
  }

  function clearAll() {
    state.expr = '';
    state.lastExpr = '';
    state.justEvaluated = false;
    state.error = false;
    render();
  }

  // Called before any input that starts a new edit
  function prepareInput() {
    if (state.justEvaluated) {
      state.justEvaluated = false;
      state.lastExpr = '';
    }
  }

  /* ---------- Input handlers ---------- */

  function inputDigit(d) {
    if (state.justEvaluated) state.expr = '';
    prepareInput();

    const seg = currentNumber();
    if (seg.replace('.', '').length >= MAX_DIGITS) return;

    const last = lastChar();
    if (last === ')' || last === '%') {
      state.expr += '×'; // e.g. (2+3)5 -> (2+3)×5
    } else if (seg === '0') {
      state.expr = state.expr.slice(0, -1); // avoid leading zeros like 05
    }
    state.expr += d;
    render();
  }

  function inputDecimal() {
    if (state.justEvaluated) state.expr = '';
    prepareInput();

    if (currentNumber().includes('.')) return;

    const last = lastChar();
    if (last === ')' || last === '%') state.expr += '×0.';
    else if (last === '' || last === '(' || isOperator(last)) state.expr += '0.';
    else state.expr += '.';
    render();
  }

  function inputOperator(op) {
    prepareInput();
    let expr = state.expr;
    const last = lastChar();

    if (expr === '') {
      if (op !== '–') return; // only minus can start an expression
      expr = '–';
    } else if (last === '(') {
      if (op !== '–') return;
      expr += op;
    } else if (isOperator(last)) {
      if (op === '–' && last !== '–') {
        expr += op; // allows 5×–3
      } else if (op !== '–') {
        expr = expr.replace(/[+–×÷]+$/, ''); // replace trailing operator(s)
        if (expr === '' || expr.endsWith('(')) return;
        expr += op;
      } else {
        return; // already has a minus sign
      }
    } else {
      expr += op;
    }

    state.expr = expr;
    render();
  }

  function inputPercent() {
    prepareInput();
    const last = lastChar();
    if (last === '' || last === '(' || last === '.' || last === '%' || isOperator(last)) return;
    state.expr += '%';
    render();
  }

  function inputBracket() {
    prepareInput();
    const last = lastChar();
    const open = countOf('(');
    const close = countOf(')');

    if (open > close && /[\d)%.]/.test(last)) {
      state.expr += ')';
    } else {
      if (/[\d)%.]/.test(last)) state.expr += '×'; // implicit multiplication
      state.expr += '(';
    }
    render();
  }

  function inputDelete() {
    if (state.justEvaluated) {
      clearAll();
      return;
    }
    state.expr = state.expr.slice(0, -1);
    render();
  }

  function inputEqual() {
    if (state.justEvaluated || state.expr === '') return;

    // Remove dangling operators / open brackets, then close any open brackets
    let display = state.expr.replace(/[+–×÷(.]+$/, '');
    if (display === '') return;

    const missing = countOf('(') - countOf(')');
    display += ')'.repeat(Math.max(0, missing));

    try {
      const value = evaluate(display);
      const text = formatNumber(value);

      state.history.unshift({
        expression: display, result: text
      });
      state.history = state.history.slice(0, MAX_HISTORY);

      state.lastExpr = display;
      state.expr = text;
      state.justEvaluated = true;
      state.error = false;
    } catch (err) {
      state.lastExpr = display;
      state.expr = '';
      state.error = true;
    }
    render();
  }

  function press(key) {
    if (state.error && key !== 'CLEAR') clearAll();

    switch (key) {
      case 'CLEAR': clearAll(); break;
      case 'DELETE': inputDelete(); break;
      case 'BRACKET': inputBracket(); break;
      case 'EQUAL': inputEqual(); break;
      case '%': inputPercent(); break;
      case '.': inputDecimal(); break;
      case '+':
      case '–':
      case '×':
      case '÷': inputOperator(key); break;
      default:
        if (/^\d$/.test(key)) inputDigit(key);
      }
    }

    /* ---------- Evaluation (safe parser, no eval) ---------- */

    function evaluate(displayExpr) {
      const src = displayExpr
      .replace(/÷/g, '/')
      .replace(/×/g, '*')
      .replace(/–/g, '-');

      const tokens = src.match(/\d+\.?\d*|\.\d+|[()+\-*\/%]/g) || [];
      if (tokens.join('') !== src) throw new Error('Invalid expression');

      let pos = 0;
      const peek = () => tokens[pos];
      const next = () => tokens[pos++];

      function parseExpression() {
        let value = parseTerm();
        while (peek() === '+' || peek() === '-') {
          const op = next();
          const right = parseTerm();
          value = op === '+' ? value + right: value - right;
        }
        return value;
      }

      function parseTerm() {
        let value = parseUnary();
        while (peek() === '*' || peek() === '/') {
          const op = next();
          const right = parseUnary();
          if (op === '/') {
            if (right === 0) throw new Error('Cannot divide by zero');
            value = value / right;
          } else {
            value = value * right;
          }
        }
        return value;
      }

      function parseUnary() {
        if (peek() === '-') {
          next(); return -parseUnary();
        }
        if (peek() === '+') {
          next(); return parseUnary();
        }
        return parsePostfix();
      }

      function parsePostfix() {
        let value = parsePrimary();
        while (peek() === '%') {
          next();
          value = value / 100;
        }
        return value;
      }

      function parsePrimary() {
        const tok = next();
        if (tok === '(') {
          const value = parseExpression();
          if (next() !== ')') throw new Error('Missing )');
          return value;
        }
        if (tok === undefined || !/^(\d|\.\d)/.test(tok)) throw new Error('Syntax error');
        return parseFloat(tok);
      }

      const result = parseExpression();
      if (pos !== tokens.length) throw new Error('Syntax error');
      return result;
    }

    function formatNumber(value) {
      if (!Number.isFinite(value) || Math.abs(value) >= 1e15) {
        throw new Error('Overflow');
      }
      const fixed = value.toFixed(10).replace(/\.?0+$/, '');
      const text = fixed === '-0' ? '0': fixed;
      return text.replace('-', '–'); // keep display symbol consistent
    }

    /* ---------- Buttons & keyboard ---------- */

    function keyFromButton(btn) {
      if (btn.classList.contains('Clear')) return 'CLEAR';
      if (btn.classList.contains('delete')) return 'DELETE';
      if (btn.classList.contains('bracket')) return 'BRACKET';
      if (btn.classList.contains('equal')) return 'EQUAL';
      return btn.textContent.trim();
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => press(keyFromButton(btn)));
    });

    const KEY_MAP = {
      '+': '+',
      '-': '–',
      '*': '×',
      '/': '÷',
      '%': '%',
      '.': '.',
      ',': '.',
      '(': 'BRACKET',
      ')': 'BRACKET',
      Enter: 'EQUAL',
      '=': 'EQUAL',
      Backspace: 'DELETE',
      Escape: 'CLEAR',
      Delete: 'CLEAR'
    };
    for (let i = 0; i <= 9; i++) KEY_MAP[String(i)] = String(i);

    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const key = KEY_MAP[e.key];
      if (!key) return;
      e.preventDefault();
      press(key);
    });

    /* ---------- History panel ---------- */

    const historyPanel = document.createElement('div');
    historyPanel.id = 'historyPanel';
    calcBox.appendChild(historyPanel);

    function renderHistory() {
      historyPanel.textContent = '';

      const header = document.createElement('div');
      header.id = 'historyHeader';

      const title = document.createElement('span');
      title.textContent = 'History';

      const clearBtn = document.createElement('button');
      clearBtn.id = 'clearHistory';
      clearBtn.textContent = 'Clear';
      clearBtn.addEventListener('click',
        () => {
          state.history = [];
          renderHistory();
        });

      header.append(title,
        clearBtn);
      historyPanel.appendChild(header);

      if (state.history.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'historyEmpty';
        empty.textContent = 'No history yet';
        historyPanel.appendChild(empty);
        return;
      }

      state.history.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'historyItem';

        const exprLine = document.createElement('div');
        exprLine.className = 'historyExpr';
        exprLine.textContent = item.expression + ' =';

        const resLine = document.createElement('div');
        resLine.className = 'historyResult';
        resLine.textContent = item.result;

        row.append(exprLine, resLine);
        row.addEventListener('click', () => {
          state.expr = item.result;
          state.lastExpr = item.expression;
          state.justEvaluated = true;
          state.error = false;
          toggleHistory(false);
          render();
        });
        historyPanel.appendChild(row);
      });
    }

    function toggleHistory(force) {
      const open = typeof force === 'boolean'
      ? force: !historyPanel.classList.contains('open');
      historyPanel.classList.toggle('open', open);
      if (open) renderHistory();
    }

    clockLink.addEventListener('click', (e) => {
      e.preventDefault();
      toggleHistory();
    });

    // Units and square-root icons are placeholders for now
    otherLinks.forEach((link) => {
      link.addEventListener('click', (e) => e.preventDefault());
    });

    render();
  })();
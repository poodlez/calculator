// Math operations
function add(a, b) { return a + b; }
function subtract(a, b) { return a - b; }
function multiply(a, b) { return a * b; }
function divide(a, b) { return b === 0 ? 'Nope' : a / b; }

function operate(operator, a, b) {
  switch (operator) {
    case '+': return add(a, b);
    case '-': return subtract(a, b);
    case '*': return multiply(a, b);
    case '/': return divide(a, b);
    default: return null;
  }
}

// State
let first = null;
let operator = null;
let second = null;
let displayValue = '0';
let lastResult = null;

const display = document.getElementById('display');
const dotBtn = document.querySelector('[data-dot]');

function updateDisplay(value = displayValue) {
  display.textContent = value;
}

function clearAll() {
  first = null; operator = null; second = null; lastResult = null; displayValue = '0';
  updateDisplay();
  syncDotDisabled();
}

function inputDigit(d) {
  if (displayValue === '0' || (operator && second === null)) {
    displayValue = String(d);
  } else {
    displayValue += String(d);
  }
  if (operator) {
    second = parseFloat(displayValue);
  }
  updateDisplay();
  syncDotDisabled();
}

function inputDot() {
  // If starting a new second operand, begin with 0.
  if (operator && second === null) {
    displayValue = '0.';
    second = parseFloat(displayValue);
    updateDisplay();
    syncDotDisabled();
    return;
  }
  if (!displayValue.includes('.')) {
    displayValue += '.';
    if (operator) second = parseFloat(displayValue);
    updateDisplay();
    syncDotDisabled();
  }
}

function chooseOperator(op) {
  if (typeof displayValue === 'string') first = parseFloat(displayValue);
  if (operator && second !== null) {
    // compute intermediate result
    const result = operate(operator, first, second);
    displayValue = formatResult(result);
    first = (result === 'Nope') ? null : result;
    second = null;
    updateDisplay(displayValue);
  }
  operator = op;
  // mark that next digit starts new second operand
  second = null;
  // Enable dot for new operand entry regardless of current display's dot
  syncDotDisabled();
}

function equals() {
  if (operator === null) return;
  if (second === null) second = parseFloat(displayValue);
  const result = operate(operator, first, second);
  displayValue = formatResult(result);
  lastResult = result;
  first = (result === 'Nope') ? null : result;
  operator = null;
  second = null;
  updateDisplay(displayValue);
}

function backspace() {
  if (operator && second !== null) {
    displayValue = displayValue.slice(0, -1) || '0';
    second = parseFloat(displayValue);
  } else if (!operator) {
    displayValue = displayValue.slice(0, -1) || '0';
    first = parseFloat(displayValue);
  }
  updateDisplay();
  syncDotDisabled();
}

function formatResult(val) {
  if (val === 'Nope') return 'Nope';
  const rounded = Math.round(val * 1000) / 1000;
  return String(rounded);
}

// Event wiring
const keys = document.querySelector('.keys');
keys.addEventListener('click', (e) => {
  const btn = e.target.closest('button');
  if (!btn) return;

  if (btn.classList.contains('btn-digit')) {
    inputDigit(btn.dataset.digit);
  } else if (btn.classList.contains('btn-dot')) {
    inputDot();
  } else if (btn.classList.contains('btn-operator')) {
    chooseOperator(btn.dataset.operator);
  } else if (btn.classList.contains('btn-equals')) {
    equals();
  } else if (btn.dataset.action === 'clear') {
    clearAll();
  } else if (btn.dataset.action === 'backspace') {
    backspace();
  }
});

// Keyboard support
window.addEventListener('keydown', (e) => {
  if (/^[0-9]$/.test(e.key)) inputDigit(e.key);
  if (e.key === '.') inputDot();
  if ('+-*/'.includes(e.key)) chooseOperator(e.key);
  if (e.key === 'Enter' || e.key === '=') equals();
  if (e.key === 'Backspace') backspace();
  if (e.key.toLowerCase() === 'c') clearAll();
});

clearAll();

function syncDotDisabled() {
  if (!dotBtn) return;
  // If starting a new operand (operator chosen, awaiting second), allow dot
  if (operator && second === null) {
    dotBtn.disabled = false;
    return;
  }
  dotBtn.disabled = String(displayValue).includes('.');
}

/**
 * Spendly – script.js
 * Phase 2: LocalStorage + Delete + Chart.js Pie Chart
 */

/* ══════════════════════════════════════════
   FLYING MONEY NOTES
══════════════════════════════════════════ */
const canvas = document.getElementById('money-canvas');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const SYMBOLS = ['₹', '$', '💵', '💴', '💶', '💷', '🪙'];

function createNote() {
  return {
    x:           Math.random() * canvas.width,
    y:           Math.random() * canvas.height + canvas.height,
    size:        14 + Math.random() * 22,
    speed:       0.4 + Math.random() * 0.9,
    drift:       (Math.random() - 0.5) * 0.6,
    rotate:      Math.random() * Math.PI * 2,
    rotateSpeed: (Math.random() - 0.5) * 0.03,
    symbol:      SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    opacity:     0.12 + Math.random() * 0.22,
    wobble:      Math.random() * Math.PI * 2,
  };
}

const notes = Array.from({ length: 38 }, () => {
  const n = createNote();
  n.y = Math.random() * canvas.height;
  return n;
});

function drawNote(note) {
  ctx.save();
  ctx.translate(note.x, note.y);
  ctx.rotate(note.rotate);
  ctx.globalAlpha    = note.opacity;
  ctx.font           = `${note.size}px 'Courier Prime', monospace`;
  ctx.fillStyle      = '#4ade80';
  ctx.textAlign      = 'center';
  ctx.textBaseline   = 'middle';
  ctx.fillText(note.symbol, 0, 0);
  ctx.restore();
}

function tickNotes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const note of notes) {
    note.wobble  += 0.018;
    note.x       += note.drift + Math.sin(note.wobble) * 0.5;
    note.y       -= note.speed;
    note.rotate  += note.rotateSpeed;
    if (note.y < -note.size * 2) {
      note.y       = canvas.height + note.size;
      note.x       = Math.random() * canvas.width;
      note.speed   = 0.4 + Math.random() * 0.9;
      note.drift   = (Math.random() - 0.5) * 0.6;
      note.opacity = 0.12 + Math.random() * 0.22;
      note.symbol  = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
    }
    drawNote(note);
  }
  requestAnimationFrame(tickNotes);
}
tickNotes();


/* ══════════════════════════════════════════
   STATE & LOCALSTORAGE
══════════════════════════════════════════ */
const LS_SALARY   = 'spendly_salary';
const LS_EXPENSES = 'spendly_expenses';

let totalSalary = 0;
let expenses    = [];

function saveToStorage() {
  localStorage.setItem(LS_SALARY,   JSON.stringify(totalSalary));
  localStorage.setItem(LS_EXPENSES, JSON.stringify(expenses));
}

function loadFromStorage() {
  const savedSalary   = localStorage.getItem(LS_SALARY);
  const savedExpenses = localStorage.getItem(LS_EXPENSES);
  if (savedSalary)   totalSalary = JSON.parse(savedSalary);
  if (savedExpenses) expenses    = JSON.parse(savedExpenses);
}


/* ══════════════════════════════════════════
   DOM REFS
══════════════════════════════════════════ */
const salaryInput     = document.getElementById('salary-input');
const setSalaryBtn    = document.getElementById('set-salary-btn');
const salaryError     = document.getElementById('salary-error');

const expenseName     = document.getElementById('expense-name');
const expenseAmount   = document.getElementById('expense-amount');
const addExpenseBtn   = document.getElementById('add-expense-btn');
const expenseError    = document.getElementById('expense-error');

const displaySalary    = document.getElementById('display-salary');
const displaySpent     = document.getElementById('display-spent');
const displayRemaining = document.getElementById('display-remaining');
const progressFill     = document.getElementById('progress-fill');
const progressLabel    = document.getElementById('progress-label');

const expenseList = document.getElementById('expense-list');
const emptyState  = document.getElementById('empty-state');
const chartEmpty  = document.getElementById('chart-empty');


/* ══════════════════════════════════════════
   CHART.JS PIE CHART
══════════════════════════════════════════ */
const pieCtx = document.getElementById('pie-chart').getContext('2d');

const pieChart = new Chart(pieCtx, {
  type: 'doughnut',
  data: {
    labels: ['Remaining', 'Spent'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#22c55e', '#f87171'],
      borderColor:     ['#16a34a', '#dc2626'],
      borderWidth: 2,
      hoverOffset: 8,
    }]
  },
  options: {
    responsive: true,
    cutout: '60%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#bbf7d0',
          font: { family: "'Fredoka', sans-serif", size: 13 },
          padding: 16,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const val = context.parsed;
            return ' ₹ ' + val.toLocaleString('en-IN');
          }
        }
      }
    }
  }
});

function updateChart() {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining  = Math.max(totalSalary - totalSpent, 0);

  if (totalSalary === 0) {
    chartEmpty.style.display = 'block';
    document.getElementById('pie-chart').style.display = 'none';
    return;
  }

  chartEmpty.style.display = 'none';
  document.getElementById('pie-chart').style.display = 'block';

  pieChart.data.datasets[0].data = [remaining, totalSpent];
  pieChart.update();
}


/* ══════════════════════════════════════════
   HELPERS
══════════════════════════════════════════ */
function formatRupee(val) {
  return '₹ ' + val.toLocaleString('en-IN');
}

function showError(el, msg) {
  el.textContent = msg;
  el.classList.add('error-msg--visible');
  setTimeout(() => {
    el.textContent = '';
    el.classList.remove('error-msg--visible');
  }, 3000);
}

function clearError(el) {
  el.textContent = '';
  el.classList.remove('error-msg--visible');
}


/* ══════════════════════════════════════════
   VALIDATION
══════════════════════════════════════════ */
function validateSalary() {
  const raw = salaryInput.value.trim();
  if (raw === '') { showError(salaryError, '⚠️ Salary can\'t be empty.'); return null; }
  const val = parseFloat(raw);
  if (isNaN(val) || val < 0) { showError(salaryError, '⚠️ Enter a valid positive number.'); return null; }
  return val;
}

function validateExpense() {
  const name   = expenseName.value.trim();
  const rawAmt = expenseAmount.value.trim();
  if (name === '')   { showError(expenseError, '⚠️ Give your expense a name.'); return null; }
  if (rawAmt === '') { showError(expenseError, '⚠️ Amount can\'t be empty.'); return null; }
  const amount = parseFloat(rawAmt);
  if (isNaN(amount) || amount < 0) { showError(expenseError, '⚠️ Amount must be a positive number.'); return null; }
  if (amount === 0)  { showError(expenseError, '⚠️ Amount should be greater than zero.'); return null; }
  return { name, amount };
}


/* ══════════════════════════════════════════
   RENDER
══════════════════════════════════════════ */
function renderSummary() {
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining  = totalSalary - totalSpent;
  const spentPct   = totalSalary > 0 ? Math.min((totalSpent / totalSalary) * 100, 100) : 0;

  displaySalary.textContent    = formatRupee(totalSalary);
  displaySpent.textContent     = formatRupee(totalSpent);
  displayRemaining.textContent = formatRupee(remaining);

  progressFill.style.width  = spentPct.toFixed(1) + '%';
  progressLabel.textContent = spentPct.toFixed(0) + '% spent';

  progressFill.classList.toggle('progress-bar__fill--danger', spentPct >= 90);

  updateChart();
}

function renderExpenseItem(name, amount, index) {
  if (emptyState) emptyState.style.display = 'none';

  const li = document.createElement('li');
  li.classList.add('expense-item');
  li.dataset.index = index;

  const nameSpan = document.createElement('span');
  nameSpan.classList.add('expense-item__name');
  nameSpan.textContent = name;

  const amtSpan = document.createElement('span');
  amtSpan.classList.add('expense-item__amount');
  amtSpan.textContent = formatRupee(amount);

  const delBtn = document.createElement('button');
  delBtn.classList.add('expense-item__delete');
  delBtn.innerHTML    = '🗑️';
  delBtn.title        = 'Delete expense';
  delBtn.setAttribute('aria-label', `Delete ${name}`);

  delBtn.addEventListener('click', function () {
    deleteExpense(index);
  });

  li.appendChild(nameSpan);
  li.appendChild(amtSpan);
  li.appendChild(delBtn);
  expenseList.appendChild(li);
  expenseList.scrollTop = expenseList.scrollHeight;
}

/* Full re-render of the list (used after delete) */
function renderAllExpenses() {
  expenseList.innerHTML = '';

  if (expenses.length === 0) {
    const li = document.createElement('li');
    li.classList.add('expense-list__empty');
    li.id = 'empty-state';
    li.innerHTML = '<span class="empty-icon">🧾</span><span>No expenses yet — add one!</span>';
    expenseList.appendChild(li);
    return;
  }

  expenses.forEach((exp, i) => renderExpenseItem(exp.name, exp.amount, i));
}


/* ══════════════════════════════════════════
   DELETE
══════════════════════════════════════════ */
function deleteExpense(index) {
  expenses.splice(index, 1);
  saveToStorage();
  renderAllExpenses();
  renderSummary();
}


/* ══════════════════════════════════════════
   EVENTS
══════════════════════════════════════════ */
setSalaryBtn.addEventListener('click', function () {
  clearError(salaryError);
  const val = validateSalary();
  if (val === null) return;
  totalSalary       = val;
  salaryInput.value = '';
  saveToStorage();
  renderSummary();
});

addExpenseBtn.addEventListener('click', function () {
  clearError(expenseError);
  if (totalSalary === 0) { showError(expenseError, '⚠️ Set your salary first!'); return; }
  const result = validateExpense();
  if (result === null) return;
  expenses.push(result);
  saveToStorage();
  renderExpenseItem(result.name, result.amount, expenses.length - 1);
  renderSummary();
  expenseName.value   = '';
  expenseAmount.value = '';
  expenseName.focus();
});

salaryInput.addEventListener('keydown',   e => { if (e.key === 'Enter') setSalaryBtn.click(); });
expenseAmount.addEventListener('keydown', e => { if (e.key === 'Enter') addExpenseBtn.click(); });


/* ══════════════════════════════════════════
   INIT — load from localStorage on page load
══════════════════════════════════════════ */
function init() {
  loadFromStorage();

  // hide chart until salary is set
  document.getElementById('pie-chart').style.display = 'none';

  if (totalSalary > 0) {
    renderSummary();
    renderAllExpenses();
  }
}

init();

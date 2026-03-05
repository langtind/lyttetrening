/* ═══════════════════════════════════════════
   MODULE: DATO (Dates)
   ═══════════════════════════════════════════ */
const MONTHS = ['januar','februar','mars','april','mai','juni','juli','august','september','oktober','november','desember'];
const ORD_MONTHS = ['i første','i andre','i tredje','i fjerde','i femte','i sjette','i sjuende','i åttende','i niende','i tiende','i ellevte','i tolvte'];

function initDato() {
  const dagGrid = document.getElementById('dato-dag-grid');
  const mndGrid = document.getElementById('dato-mnd-grid');
  const ordGrid = document.getElementById('dato-ord-grid');
  if (dagGrid.children.length > 0) return;
  S.mode.dato = 'lytte';

  for (let i = 1; i <= 31; i++) {
    const cell = document.createElement('div');
    cell.className = 'dato-cell';
    cell.textContent = i + '.';
    cell.dataset.dag = i;
    cell.addEventListener('click', () => datoDagClick(i));
    dagGrid.appendChild(cell);
  }

  MONTHS.forEach((m, idx) => {
    const cell = document.createElement('div');
    cell.className = 'dato-month-cell';
    cell.textContent = m.charAt(0).toUpperCase() + m.slice(1);
    cell.dataset.mnd = idx;
    cell.addEventListener('click', () => datoMndClick(idx));
    mndGrid.appendChild(cell);
  });

  ORD_MONTHS.forEach((label, idx) => {
    const cell = document.createElement('div');
    cell.className = 'dato-month-cell';
    cell.textContent = label;
    cell.dataset.ord = idx;
    cell.addEventListener('click', () => datoOrdClick(idx));
    ordGrid.appendChild(cell);
  });
}

function datoDagClick(dag) {
  if ((S.mode.dato || 'lytte') === 'lytte') {
    playAudio(`audio/ordenstall/${S.voice}/${dag}.mp3`, 'dato');
    document.querySelectorAll('#dato-dag-grid .dato-cell.selected').forEach(c => c.classList.remove('selected'));
    const cells = document.querySelectorAll('#dato-dag-grid .dato-cell');
    cells[dag - 1].classList.add('selected');
  } else {
    datoGuess('dag', dag);
  }
}

function datoMndClick(idx) {
  if ((S.mode.dato || 'lytte') === 'lytte') {
    playAudio(`audio/dato/${S.voice}/${MONTHS[idx]}.mp3`, 'dato');
    document.querySelectorAll('#dato-mnd-grid .dato-month-cell.selected').forEach(c => c.classList.remove('selected'));
    const cells = document.querySelectorAll('#dato-mnd-grid .dato-month-cell');
    cells[idx].classList.add('selected');
  } else {
    datoGuess('mnd', idx);
  }
}

function datoOrdClick(idx) {
  if ((S.mode.dato || 'lytte') === 'lytte') {
    playAudio(`audio/dato/${S.voice}/i${idx + 1}.mp3`, 'dato');
    document.querySelectorAll('#dato-ord-grid .dato-month-cell.selected').forEach(c => c.classList.remove('selected'));
    const cells = document.querySelectorAll('#dato-ord-grid .dato-month-cell');
    cells[idx].classList.add('selected');
  }
}

let datoSelection = { dag: null, mnd: null };

function datoStart() {
  const ex = exercises.dato;
  if (!ex || ex.current === -1) {
    // Generate random date+month combos
    const combos = [];
    for (let d = 1; d <= 31; d++) {
      for (let m = 0; m < 12; m++) {
        // Skip invalid dates (31st of months with 30 or fewer days, etc.)
        if (d > 28 && m === 1) continue; // feb
        if (d > 30 && [3,5,8,10].includes(m)) continue; // 30-day months
        combos.push({ dag: d, mnd: m });
      }
    }
    const items = shuffle(combos);
    initExercise('dato', items, 20);
  }
  datoNext();
}

function datoNext() {
  const ex = exercises.dato;
  if (ex.answered >= ex.total) { showResult('dato'); resetExercise('dato'); return; }

  document.querySelectorAll('#dato-dag-grid .dato-cell, #dato-mnd-grid .dato-month-cell, #dato-ord-grid .dato-month-cell').forEach(c =>
    c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));

  const combo = ex.items[ex.answered];
  ex.current = combo;
  ex.currentAnswer = combo;
  datoSelection = { dag: null, mnd: null };
  renderProgress('dato');

  const btn = document.getElementById('start-btn-dato');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-dato').disabled = false;
  document.getElementById('fasit-btn-dato').disabled = false;

  // Play ordinal number then month
  playAudio(`audio/ordenstall/${S.voice}/${combo.dag}.mp3`, 'dato', () => {
    setTimeout(() => {
      playAudio(`audio/dato/${S.voice}/${MONTHS[combo.mnd]}.mp3`, 'dato');
    }, 300);
  });
}

function datoRepeat() {
  const ex = exercises.dato;
  if (!ex || !ex.currentAnswer) return;
  const combo = ex.currentAnswer;
  playAudio(`audio/ordenstall/${S.voice}/${combo.dag}.mp3`, 'dato', () => {
    setTimeout(() => {
      playAudio(`audio/dato/${S.voice}/${MONTHS[combo.mnd]}.mp3`, 'dato');
    }, 300);
  });
}

function datoFasit() {
  const ex = exercises.dato;
  if (!ex || !ex.currentAnswer) return;
  const dagCells = document.querySelectorAll('#dato-dag-grid .dato-cell');
  const mndCells = document.querySelectorAll('#dato-mnd-grid .dato-month-cell');
  dagCells[ex.currentAnswer.dag - 1].classList.add('highlighted');
  mndCells[ex.currentAnswer.mnd].classList.add('highlighted');
}

function datoGuess(type, val) {
  const ex = exercises.dato;
  if (!ex || !ex.currentAnswer) return;

  if (type === 'dag') {
    datoSelection.dag = val;
    document.querySelectorAll('#dato-dag-grid .dato-cell').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('#dato-dag-grid .dato-cell')[val - 1].classList.add('selected');
  } else {
    datoSelection.mnd = val;
    document.querySelectorAll('#dato-mnd-grid .dato-month-cell').forEach(c => c.classList.remove('selected'));
    document.querySelectorAll('#dato-mnd-grid .dato-month-cell')[val].classList.add('selected');
  }

  // Both selected? Evaluate
  if (datoSelection.dag !== null && datoSelection.mnd !== null) {
    const dagCorrect = datoSelection.dag === ex.currentAnswer.dag;
    const mndCorrect = datoSelection.mnd === ex.currentAnswer.mnd;
    const isCorrect = dagCorrect && mndCorrect;

    const dagCells = document.querySelectorAll('#dato-dag-grid .dato-cell');
    const mndCells = document.querySelectorAll('#dato-mnd-grid .dato-month-cell');

    dagCells[datoSelection.dag - 1].classList.remove('selected');
    dagCells[datoSelection.dag - 1].classList.add(dagCorrect ? 'correct-cell' : 'wrong-cell');
    mndCells[datoSelection.mnd].classList.remove('selected');
    mndCells[datoSelection.mnd].classList.add(mndCorrect ? 'correct-cell' : 'wrong-cell');

    if (!dagCorrect) dagCells[ex.currentAnswer.dag - 1].classList.add('highlighted');
    if (!mndCorrect) mndCells[ex.currentAnswer.mnd].classList.add('highlighted');

    if (isCorrect) ex.correct++;
    ex.history.push(isCorrect);
    ex.answered++;
    ex.currentAnswer = null;
    renderProgress('dato');

    setTimeout(() => datoNext(), 1200);
  }
}

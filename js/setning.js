/* ═══════════════════════════════════════════
   MODULE: SETNING (Sentences)
   ═══════════════════════════════════════════ */
let setningCurrentGroup = 'M';
let setningNum = 1; // 1, 2, or 3

function initSetning() {
  S.mode.setning = 'lytte';
  renderOrdTabs('setning-tabs', Object.keys(ORD_DATA), setningCurrentGroup, (g) => { setningCurrentGroup = g; renderSetningGrid(); });
  renderSetningGrid();
}

function renderSetningGrid() {
  const grid = document.getElementById('setning-grid');
  const data = ORD_DATA[setningCurrentGroup];
  grid.innerHTML = '';
  data.display.forEach((word, i) => {
    const cell = document.createElement('div');
    cell.className = 'word-cell';
    cell.textContent = word;
    cell.addEventListener('click', () => setningCellClick(i));
    grid.appendChild(cell);
  });
  setningNum = Math.ceil(Math.random() * 3);
  resetExercise('setning');
}

function setningCellClick(idx) {
  const data = ORD_DATA[setningCurrentGroup];
  setningNum = Math.ceil(Math.random() * 3);
  if ((S.mode.setning || 'lytte') === 'lytte') {
    playAudio(`audio/ord/${S.voice}/${data.audio[idx]}${setningNum}.mp3`, 'setning');
    highlightWordCell('setning-grid', idx);
  } else {
    setningGuess(idx);
  }
}

function setningStart() {
  const data = ORD_DATA[setningCurrentGroup];
  const ex = exercises.setning;
  if (!ex || ex.current === -1) {
    initExercise('setning', shuffle(Array.from({length: data.display.length}, (_, i) => i)), Math.min(12, data.display.length));
  }
  setningNext();
}

function setningNext() {
  const ex = exercises.setning;
  if (ex.answered >= ex.total) { showResult('setning'); resetExercise('setning'); return; }
  document.querySelectorAll('#setning-grid .word-cell').forEach(c => c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));
  ex.current = ex.items[ex.answered];
  ex.currentAnswer = ex.current;
  setningNum = Math.ceil(Math.random() * 3);
  renderProgress('setning');
  const btn = document.getElementById('start-btn-setning');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-setning').disabled = false;
  document.getElementById('fasit-btn-setning').disabled = false;
  const data = ORD_DATA[setningCurrentGroup];
  playAudio(`audio/ord/${S.voice}/${data.audio[ex.current]}${setningNum}.mp3`, 'setning');
}

function setningRepeat() {
  const ex = exercises.setning;
  if (ex?.currentAnswer !== null) {
    const data = ORD_DATA[setningCurrentGroup];
    playAudio(`audio/ord/${S.voice}/${data.audio[ex.currentAnswer]}${setningNum}.mp3`, 'setning');
  }
}

function setningFasit() {
  const ex = exercises.setning;
  if (!ex || ex.currentAnswer === null) return;
  document.querySelectorAll('#setning-grid .word-cell')[ex.currentAnswer]?.classList.add('highlighted');
}

function setningGuess(idx) {
  const ex = exercises.setning;
  if (!ex || ex.currentAnswer === null) return;
  const cells = document.querySelectorAll('#setning-grid .word-cell');
  const isCorrect = idx === ex.currentAnswer;
  cells[idx]?.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect) cells[ex.currentAnswer]?.classList.add('highlighted');
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('setning');
  setTimeout(() => setningNext(), 1200);
}

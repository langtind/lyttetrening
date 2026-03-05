/* ═══════════════════════════════════════════
   MODULE: TALL (Numbers)
   ═══════════════════════════════════════════ */
function initTall() {
  const grid = document.getElementById('number-grid');
  if (grid.children.length > 0) return;
  S.mode.tall = 'lytte';
  for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.className = 'num-cell';
    cell.textContent = i;
    cell.dataset.num = i;
    cell.addEventListener('click', () => tallCellClick(i));
    grid.appendChild(cell);
  }
}

function tallCellClick(num) {
  const mode = S.mode.tall || 'lytte';
  if (mode === 'lytte') {
    playAudio(`audio/tall/${S.voice}/${num}.mp3`, 'tall');
    highlightCell('number-grid', num);
  } else {
    tallGuess(num);
  }
}

function tallStart() {
  const ex = exercises.tall;
  if (!ex || ex.current === -1) {
    const indices = shuffle(Array.from({length: 100}, (_, i) => i));
    initExercise('tall', indices, 20);
  }
  tallNext();
}

function tallNext() {
  const ex = exercises.tall;
  if (ex.answered >= ex.total) { showResult('tall'); resetExercise('tall'); return; }

  // Clear previous highlights
  document.querySelectorAll('#number-grid .num-cell').forEach(c => c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));

  ex.current = ex.items[ex.answered];
  ex.currentAnswer = ex.current;
  renderProgress('tall');

  const btn = document.getElementById('start-btn-tall');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-tall').disabled = false;
  document.getElementById('fasit-btn-tall').disabled = false;

  playAudio(`audio/tall/${S.voice}/${ex.current}.mp3`, 'tall');
}

function tallRepeat() {
  const ex = exercises.tall;
  if (ex && ex.currentAnswer !== null) playAudio(`audio/tall/${S.voice}/${ex.currentAnswer}.mp3`, 'tall');
}

function tallFasit() {
  const ex = exercises.tall;
  if (!ex || ex.currentAnswer === null) return;
  const cells = document.querySelectorAll('#number-grid .num-cell');
  cells[ex.currentAnswer].classList.add('highlighted');
}

function tallGuess(num) {
  const ex = exercises.tall;
  if (!ex || ex.currentAnswer === null) return;
  const cells = document.querySelectorAll('#number-grid .num-cell');
  const isCorrect = num === ex.currentAnswer;
  cells[num].classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect) cells[ex.currentAnswer].classList.add('highlighted');
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('tall');

  setTimeout(() => tallNext(), 1200);
}

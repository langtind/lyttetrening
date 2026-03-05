/* ═══════════════════════════════════════════
   MODULE: ORD (Words)
   ═══════════════════════════════════════════ */
const ORD_DATA = {
  M: { display: ["mat","musikk","medisin","melk","mamma","marsipan","mygg","møte","matpakke","mel","middag","maleri"], audio: ["mat","musikk","medisin","melk","mamma","marsipan","mygg","mote","matpakke","mel","middag","maleri"] },
  K: { display: ["katt","kake","kakao","knapp","kaffe","kalender","kald","klokke","kamera","kopp","komfyr","kamerat"], audio: ["katt","kake","kakao","knapp","kaffe","kalender","kald","klokke","kamera","kopp","komfyr","kamerat"] },
  T: { display: ["tog","TV","telefon","takk","trafikk","tannbørste","tre","trimme","terrasse","tur","tannkrem","teater"], audio: ["tog","tv","telefon","takk","trafikk","tannborste","tre","trimme","terrasse","tur","tannkrem","teater"] },
  S: { display: ["sol","smile","syltetøy","sko","skole","sitteplass","sur","spise","spagetti","snø","sulten","sydentur"], audio: ["sol","smile","syltetoy","sko","skole","sitteplass","sur","spise","spagetti","sno","sulten","sydentur"] },
  L: { display: ["lys","lærer","leppestift","lat","lue","lørdagskveld","laks","lampe","lyspære","lønn","limstift","lammelår"], audio: ["lys","laerer","leppestift","lat","lue","lordagskveld","laks","lampe","lyspaere","lonn","limstift","lammelar"] },
  Mix: { display: ["jobb","butikk","brødskive","buss","avis","fotballkamp","bil","PC","fjernkontroll","sport","gave","bakgrunnstøy"], audio: ["jobb","butikk","brodskive","buss","avis","fotballkamp","bil","pc","fjernkontroll","sport","gave","bakgrunnsstoy"] },
};

let ordCurrentGroup = 'M';

function initOrd() {
  S.mode.ord = 'lytte';
  renderOrdTabs('ord-tabs', Object.keys(ORD_DATA), ordCurrentGroup, (g) => { ordCurrentGroup = g; renderOrdGrid(); });
  renderOrdGrid();
}

function renderOrdTabs(containerId, groups, active, onClick) {
  const c = document.getElementById(containerId);
  c.innerHTML = '';
  groups.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'tab-btn' + (g === active ? ' active' : '');
    btn.textContent = g;
    btn.addEventListener('click', () => {
      c.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      onClick(g);
    });
    c.appendChild(btn);
  });
}

function renderOrdGrid() {
  const grid = document.getElementById('ord-grid');
  const data = ORD_DATA[ordCurrentGroup];
  grid.innerHTML = '';
  data.display.forEach((word, i) => {
    const cell = document.createElement('div');
    cell.className = 'word-cell';
    cell.textContent = word;
    cell.addEventListener('click', () => ordCellClick(i));
    grid.appendChild(cell);
  });
  resetExercise('ord');
}

function ordCellClick(idx) {
  const data = ORD_DATA[ordCurrentGroup];
  if ((S.mode.ord || 'lytte') === 'lytte') {
    playAudio(`audio/ord/${S.voice}/${data.audio[idx]}.mp3`, 'ord');
    highlightWordCell('ord-grid', idx);
  } else {
    ordGuess(idx);
  }
}

function ordStart() {
  const data = ORD_DATA[ordCurrentGroup];
  const ex = exercises.ord;
  if (!ex || ex.current === -1) {
    initExercise('ord', shuffle(Array.from({length: data.display.length}, (_, i) => i)), Math.min(12, data.display.length));
  }
  ordNext();
}

function ordNext() {
  const ex = exercises.ord;
  if (ex.answered >= ex.total) { showResult('ord'); resetExercise('ord'); return; }
  document.querySelectorAll('#ord-grid .word-cell').forEach(c => c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));
  ex.current = ex.items[ex.answered];
  ex.currentAnswer = ex.current;
  renderProgress('ord');
  const btn = document.getElementById('start-btn-ord');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-ord').disabled = false;
  document.getElementById('fasit-btn-ord').disabled = false;
  const data = ORD_DATA[ordCurrentGroup];
  playAudio(`audio/ord/${S.voice}/${data.audio[ex.current]}.mp3`, 'ord');
}

function ordRepeat() {
  const ex = exercises.ord;
  if (ex?.currentAnswer !== null) {
    const data = ORD_DATA[ordCurrentGroup];
    playAudio(`audio/ord/${S.voice}/${data.audio[ex.currentAnswer]}.mp3`, 'ord');
  }
}

function ordFasit() {
  const ex = exercises.ord;
  if (!ex || ex.currentAnswer === null) return;
  document.querySelectorAll('#ord-grid .word-cell')[ex.currentAnswer]?.classList.add('highlighted');
}

function ordGuess(idx) {
  const ex = exercises.ord;
  if (!ex || ex.currentAnswer === null) return;
  const cells = document.querySelectorAll('#ord-grid .word-cell');
  const isCorrect = idx === ex.currentAnswer;
  cells[idx]?.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect) cells[ex.currentAnswer]?.classList.add('highlighted');
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('ord');
  setTimeout(() => ordNext(), 1200);
}

/* ═══════════════════════════════════════════
   MODULE: MILJOLYDER (Environmental sounds)
   ═══════════════════════════════════════════ */
const MILJO_DATA = {
  groups: [
    { name: "Dyrelyder", emoji: "\uD83D\uDC3E", sounds: [
      { file: "katt", name: "Katt" }, { file: "hund1", name: "Liten hund" }, { file: "ku", name: "Ku" },
      { file: "hund2", name: "Stor hund" }, { file: "and", name: "And" }, { file: "geit", name: "Geit" },
      { file: "sau", name: "Sau" }, { file: "hest", name: "Hest" }, { file: "gris", name: "Gris" },
    ]},
    { name: "Menneskelyder", emoji: "\uD83E\uDDD1", sounds: [
      { file: "applaus", name: "Applaus" }, { file: "prat", name: "Prat" }, { file: "fottrinn", name: "Fottrinn" },
      { file: "barn_nyser", name: "Barn nyser" }, { file: "trapp", name: "Gå i trapp" }, { file: "vaske_hender", name: "Vaske hender" },
      { file: "door", name: "Banking på dør" }, { file: "dame_kremt", name: "Dame kremter" },
      { file: "mann_snork", name: "Mann snorker" }, { file: "mann_nys", name: "Mann nyser" },
      { file: "dame_ler", name: "Dame ler" }, { file: "mann_ler", name: "Mann ler" },
      { file: "mann_host", name: "Mann hoster" }, { file: "dame_host", name: "Dame hoster" },
    ]},
    { name: "Husholdning", emoji: "\uD83C\uDFE0", sounds: [
      { file: "klippe_papir", name: "Klippe papir" }, { file: "rive_papir", name: "Rive papir" },
      { file: "bla", name: "Bla i bok" }, { file: "fyrstikk", name: "Fyrstikk" },
      { file: "koke_vann", name: "Koke vann" }, { file: "tappe_vann", name: "Tappe vann" },
      { file: "toalett", name: "Toalett" }, { file: "vanndraaper", name: "Vanndråper" },
      { file: "mynt", name: "Mynt" }, { file: "stovsuger", name: "Støvsuger" },
      { file: "sag", name: "Sag" }, { file: "mikser", name: "Mikser" },
      { file: "symaskin", name: "Symaskin" }, { file: "oppvask", name: "Oppvask" },
      { file: "drill", name: "Drill" }, { file: "motorsag", name: "Motorsag" },
      { file: "glidelaas", name: "Glidelås" }, { file: "hamring", name: "Hamring" },
    ]},
    { name: "Varsling & trafikk", emoji: "\uD83D\uDE97", sounds: [
      { file: "roykvarsler", name: "Røykvarsler" }, { file: "printer", name: "Printer" },
      { file: "garasjedoor", name: "Garasjedør" }, { file: "heis", name: "Heis" },
      { file: "trommer", name: "Trommer" }, { file: "brannbil", name: "Brannbil" },
      { file: "sirene1", name: "Sirene 1" }, { file: "sirene2", name: "Sirene 2" },
      { file: "sirene3", name: "Sirene 3" }, { file: "starte_bil", name: "Starte bil" },
      { file: "motorsykkel", name: "Motorsykkel" }, { file: "kjore_bil", name: "Kjøre bil" },
      { file: "baat", name: "Båt" }, { file: "tog", name: "Tog" }, { file: "tute_bil", name: "Tute bil" },
    ]},
  ]
};

function initMiljo() {
  S.mode.miljolyder = 'lytte';
  renderMiljoGrid();
}

function renderMiljoGrid() {
  const container = document.getElementById('miljolyder-content');
  container.innerHTML = '';
  let globalIdx = 0;

  MILJO_DATA.groups.forEach(group => {
    const section = document.createElement('div');
    section.className = 'sound-group';
    section.innerHTML = `<div class="sound-group-title">${group.emoji} ${group.name}</div>`;
    const grid = document.createElement('div');
    grid.className = 'sound-grid';

    group.sounds.forEach(sound => {
      const cell = document.createElement('div');
      cell.className = 'sound-cell';
      cell.dataset.file = sound.file;
      cell.dataset.idx = globalIdx;
      cell.innerHTML = `<span class="sound-name">${sound.name}</span>`;
      cell.addEventListener('click', () => miljoCellClick(sound.file, cell));
      grid.appendChild(cell);
      globalIdx++;
    });

    section.appendChild(grid);
    container.appendChild(section);
  });
}

function miljoCellClick(file, cell) {
  if ((S.mode.miljolyder || 'lytte') === 'lytte') {
    document.querySelectorAll('#miljolyder-content .sound-cell').forEach(c => c.classList.remove('selected'));
    cell.classList.add('selected');
    playAudio(`audio/miljolyder/${file}.mp3`, 'miljolyder');
  } else {
    miljoGuess(file);
  }
}

// Build flat list for exercise
function getMiljoFlatList() {
  const list = [];
  MILJO_DATA.groups.forEach(g => g.sounds.forEach(s => list.push(s)));
  return list;
}

function miljoStart() {
  const list = getMiljoFlatList();
  const ex = exercises.miljolyder;
  if (!ex || ex.current === -1) {
    initExercise('miljolyder', shuffle(Array.from({length: list.length}, (_, i) => i)), 20);
  }
  miljoNext();
}

function miljoNext() {
  const ex = exercises.miljolyder;
  if (ex.answered >= ex.total) {
    showResult('miljolyder');
    resetExercise('miljolyder');
    document.getElementById('miljolyder-quiz').innerHTML = '';
    return;
  }
  const list = getMiljoFlatList();
  ex.current = ex.items[ex.answered];
  ex.currentAnswer = list[ex.current].file;
  renderProgress('miljolyder');

  const btn = document.getElementById('start-btn-miljolyder');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-miljolyder').disabled = false;
  document.getElementById('fasit-btn-miljolyder').disabled = false;

  // Build quiz: correct answer + 9 random distractors = 10 options
  const correctIdx = ex.current;
  const distractors = [];
  const allIndices = Array.from({length: list.length}, (_, i) => i).filter(i => i !== correctIdx);
  const shuffledDistractors = shuffle(allIndices);
  for (let i = 0; i < 9 && i < shuffledDistractors.length; i++) {
    distractors.push(shuffledDistractors[i]);
  }
  const options = shuffle([correctIdx, ...distractors]);

  const quiz = document.getElementById('miljolyder-quiz');
  quiz.innerHTML = '';
  options.forEach(idx => {
    const sound = list[idx];
    const card = document.createElement('div');
    card.className = 'miljo-quiz-card';
    card.textContent = sound.name;
    card.dataset.file = sound.file;
    card.addEventListener('click', () => miljoGuess(sound.file));
    quiz.appendChild(card);
  });

  playAudio(`audio/miljolyder/${ex.currentAnswer}.mp3`, 'miljolyder');
}

function miljoRepeat() {
  const ex = exercises.miljolyder;
  if (ex?.currentAnswer) playAudio(`audio/miljolyder/${ex.currentAnswer}.mp3`, 'miljolyder');
}

function miljoFasit() {
  const ex = exercises.miljolyder;
  if (!ex || !ex.currentAnswer) return;
  const card = document.querySelector(`#miljolyder-quiz .miljo-quiz-card[data-file="${ex.currentAnswer}"]`);
  if (card) card.classList.add('highlighted');
}

function miljoGuess(file) {
  const ex = exercises.miljolyder;
  if (!ex || !ex.currentAnswer) return;
  const isCorrect = file === ex.currentAnswer;
  const clickedCard = document.querySelector(`#miljolyder-quiz .miljo-quiz-card[data-file="${file}"]`);
  if (clickedCard) clickedCard.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');
  if (!isCorrect) {
    const correctCard = document.querySelector(`#miljolyder-quiz .miljo-quiz-card[data-file="${ex.currentAnswer}"]`);
    if (correctCard) correctCard.classList.add('highlighted');
  }
  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('miljolyder');
  setTimeout(() => miljoNext(), 1200);
}

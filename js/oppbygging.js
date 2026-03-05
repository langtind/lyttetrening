/* ═══════════════════════════════════════════
   MODULE: OPPBYGGING (Sentence building)
   ═══════════════════════════════════════════ */
const OPPBYGGING_DATA = {
  'Del 1': [
    { word: 'Ferie', audio: 'ferie', sentences: [
      'Vi reiser på ferie.',
      'Vi reiser på ferie til sommeren.',
      'Vi reiser på ferie til sommeren sammen med venner.',
      'Vi reiser på ferie til sommeren sammen med venner til utlandet.',
      'Vi reiser på ferie til sommeren sammen med venner til utlandet og gleder oss.',
      'Vi reiser på ferie til sommeren sammen med venner til utlandet og gleder oss til nye opplevelser.'
    ]},
    { word: 'Penger', audio: 'penger', sentences: [
      'Penger i banken.',
      'Penger i banken er lurt.',
      'Penger i banken er lurt når du skal handle.',
      'Penger i banken er lurt når du skal handle nye klær.',
      'Penger i banken er lurt når du skal handle nye klær til festen.',
      'Penger i banken er lurt når du skal handle nye klær til festen i morgen.'
    ]},
    { word: 'Kom inn', audio: 'kominn', sentences: [
      'Kom inn snart!',
      'Kom inn snart er du snill!',
      'Kom inn snart er du snill, det er sent!',
      'Kom inn snart er du snill, det er sent, barne-tv begynner!',
      'Kom inn snart er du snill, det er sent, barne-tv begynner om en liten stund!',
      'Kom inn snart er du snill, det er sent, barne-tv begynner om en liten stund, hvis du vil se et.'
    ]},
    { word: 'Bok', audio: 'bok', sentences: [
      'Les denne boken!',
      'Les denne boken, den er god!',
      'Les denne boken, den er god, den får deg til å tenke!',
      'Les denne boken, den er god, den får deg til å tenke på lørdagskos.',
      'Les denne boken, den er god, den får deg til å tenke på lørdagskos selv om det er hverdag.',
      'Les denne boken, den er god, den får deg til å tenke på lørdagskos selv om det er hverdag, jeg liker forfatteren.'
    ]},
    { word: 'Teater', audio: 'teater', sentences: [
      'Jeg skal på teater.',
      'Jeg skal på teater i morgen.',
      'Jeg skal på teater i morgen med min søster.',
      'Jeg skal på teater i morgen med min søster og hennes datter.',
      'Jeg skal på teater i morgen med min søster og hennes datter, og min datter.',
      'Jeg skal på teater i morgen med min søster og hennes datter, og min datter for å se Per Gynt.'
    ]},
    { word: 'Regn', audio: 'regn', sentences: [
      'Det regner.',
      'Det regner i dag.',
      'Det regner mye i dag.',
      'Det regner mye i dag, og vi må ha på regntøy.',
      'Det regner mye i dag, og vi må ha på regntøy og støvler.',
      'Det regner mye i dag, og vi må ha på regntøy og støvler for at vi ikke skal bli våte.'
    ]},
  ],
  'Del 2': [
    { word: 'Leker', audio: 'leker', sentences: [
      'Gutten leker.',
      'Gutten leker med bil.',
      'Gutten leker med bil i barnehagen.',
      'Gutten leker med bil i barnehagen hver dag.',
      'Gutten leker med bil i barnehagen hver dag når han får velge selv.',
      'Når gutten får velge selv, leker han med bil i barnehagen hver dag.'
    ]},
    { word: 'Kino', audio: 'kino', sentences: [
      'Vi skal på kino.',
      'Vi skal på kino i kveld.',
      'Vi skal på kino i morgen kveld.',
      'Vi skal på kino i morgen kveld og se en ny film.',
      'Vi skal på kino i morgen kveld og se en spennende film.',
      'Vi skal på kino i morgen kveld og se en spennende film som jeg har sett før.'
    ]},
    { word: 'Middag', audio: 'middag', sentences: [
      'Vi skal spise middag.',
      'Vi skal spise middag klokken fire.',
      'Vi skal spise fisk til middag klokken fire.',
      'Vi skal spise middag sammen klokken fire på restaurant.',
      'Vi skal spise middag hjemme klokken fire, og vi blir åtte til bords.',
      'Vi skal spise middag hjemme klokken fire, og vi blir åtte til bords hvis alle kommer.'
    ]},
    { word: 'Avtale', audio: 'avtale', sentences: [
      'Jeg har en avtale.',
      'Jeg har ordnet med en avtale.',
      'Jeg har ordnet med en ny avtale.',
      'Jeg har ordnet med en ny avtale til neste onsdag.',
      'Jeg har ordnet med en ny avtale til deg neste onsdag.',
      'Jeg har ordnet med en ny avtale til deg neste onsdag klokka 15.'
    ]},
    { word: 'Tur', audio: 'tur', sentences: [
      'Ut på tur.',
      'Å gå ut på tur.',
      'Jeg liker å gå ut på tur.',
      'Jeg liker å gå ut på tur i all slags vær.',
      'Jeg liker å gå ut på tur i all slags vær sammen med en venninne.',
      'Jeg liker å gå ut på tur i all slags vær sammen med en venninne, spesielt i helgene.'
    ]},
    { word: 'Varmt', audio: 'varmt', sentences: [
      'Det er varmt.',
      'I dag er det varmt vær.',
      'I dag er det passende varmt vær.',
      'I dag synes jeg det er passende varmt vær.',
      'I dag synes jeg det er passende varmt vær til å ta en dukkert i sjøen.',
      'I dag synes jeg det er passende varmt vær til å ta en dukkert i sjøen ved campingplassen.'
    ]},
  ],
};

let oppbyggingGroup = 'Del 1';
let oppbyggingCurrentCombo = null;

function initOppbygging() {
  S.mode.oppbygging = 'lytte';
  renderOrdTabs('oppbygging-tabs', Object.keys(OPPBYGGING_DATA), oppbyggingGroup, (g) => { oppbyggingGroup = g; renderOppbyggingSentences(); });
  renderOppbyggingSentences();
}

function renderOppbyggingSentences() {
  const container = document.getElementById('oppbygging-sentences');
  const words = OPPBYGGING_DATA[oppbyggingGroup];
  container.innerHTML = '';

  words.forEach((item, wordIdx) => {
    const group = document.createElement('div');
    group.className = 'oppbygging-word-group';

    const label = document.createElement('div');
    label.className = 'oppbygging-word-label';
    label.textContent = item.word;
    group.appendChild(label);

    item.sentences.forEach((sentence, levelIdx) => {
      const row = document.createElement('div');
      row.className = 'oppbygging-sentence';
      row.dataset.word = wordIdx;
      row.dataset.level = levelIdx;
      row.innerHTML = `<div class="oppbygging-level">${levelIdx + 1}</div><div class="oppbygging-text">${sentence}</div>`;
      row.addEventListener('click', () => oppbyggingSentenceClick(wordIdx, levelIdx));
      group.appendChild(row);
    });

    container.appendChild(group);
  });
  resetExercise('oppbygging');
}

function oppbyggingSentenceClick(wordIdx, levelIdx) {
  if ((S.mode.oppbygging || 'lytte') === 'lytte') {
    const words = OPPBYGGING_DATA[oppbyggingGroup];
    playAudio(`audio/oppbygging/${S.voice}/${words[wordIdx].audio}${levelIdx + 1}.mp3`, 'oppbygging');
    document.querySelectorAll('#oppbygging-sentences .oppbygging-sentence.selected').forEach(c => c.classList.remove('selected'));
    const el = document.querySelector(`#oppbygging-sentences .oppbygging-sentence[data-word="${wordIdx}"][data-level="${levelIdx}"]`);
    if (el) el.classList.add('selected');
  } else {
    oppbyggingGuess(wordIdx, levelIdx);
  }
}

function oppbyggingStart() {
  const ex = exercises.oppbygging;
  if (!ex || ex.current === -1) {
    // Generate all word+level combos
    const words = OPPBYGGING_DATA[oppbyggingGroup];
    const combos = [];
    words.forEach((_, wi) => {
      for (let li = 0; li < 6; li++) combos.push({ word: wi, level: li });
    });
    initExercise('oppbygging', shuffle(combos), 20);
  }
  oppbyggingNext();
}

function oppbyggingNext() {
  const ex = exercises.oppbygging;
  if (ex.answered >= ex.total) { showResult('oppbygging'); resetExercise('oppbygging'); oppbyggingCurrentCombo = null; return; }

  document.querySelectorAll('#oppbygging-sentences .oppbygging-sentence').forEach(c =>
    c.classList.remove('selected','correct-cell','wrong-cell','highlighted'));

  const combo = ex.items[ex.answered];
  ex.current = combo;
  ex.currentAnswer = combo;
  oppbyggingCurrentCombo = combo;
  renderProgress('oppbygging');

  const btn = document.getElementById('start-btn-oppbygging');
  btn.innerHTML = '<span class="material-icons-round">skip_next</span>Neste';
  btn.classList.remove('pulsing');
  document.getElementById('repeat-btn-oppbygging').disabled = false;
  document.getElementById('fasit-btn-oppbygging').disabled = false;

  const words = OPPBYGGING_DATA[oppbyggingGroup];
  playAudio(`audio/oppbygging/${S.voice}/${words[combo.word].audio}${combo.level + 1}.mp3`, 'oppbygging');
}

function oppbyggingRepeat() {
  if (!oppbyggingCurrentCombo) return;
  const words = OPPBYGGING_DATA[oppbyggingGroup];
  const c = oppbyggingCurrentCombo;
  playAudio(`audio/oppbygging/${S.voice}/${words[c.word].audio}${c.level + 1}.mp3`, 'oppbygging');
}

function oppbyggingFasit() {
  const ex = exercises.oppbygging;
  if (!ex || !ex.currentAnswer) return;
  const c = ex.currentAnswer;
  const el = document.querySelector(`#oppbygging-sentences .oppbygging-sentence[data-word="${c.word}"][data-level="${c.level}"]`);
  if (el) { el.classList.add('highlighted'); el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
}

function oppbyggingGuess(wordIdx, levelIdx) {
  const ex = exercises.oppbygging;
  if (!ex || !ex.currentAnswer) return;

  const isCorrect = wordIdx === ex.currentAnswer.word && levelIdx === ex.currentAnswer.level;
  const clicked = document.querySelector(`#oppbygging-sentences .oppbygging-sentence[data-word="${wordIdx}"][data-level="${levelIdx}"]`);
  if (clicked) clicked.classList.add(isCorrect ? 'correct-cell' : 'wrong-cell');

  if (!isCorrect) {
    const correct = document.querySelector(`#oppbygging-sentences .oppbygging-sentence[data-word="${ex.currentAnswer.word}"][data-level="${ex.currentAnswer.level}"]`);
    if (correct) { correct.classList.add('highlighted'); correct.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
  }

  if (isCorrect) ex.correct++;
  ex.history.push(isCorrect);
  ex.answered++;
  ex.currentAnswer = null;
  renderProgress('oppbygging');
  setTimeout(() => oppbyggingNext(), 1200);
}

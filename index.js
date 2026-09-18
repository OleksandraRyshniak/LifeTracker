// Sõnastik, mida kasutatakse mõlemas suunas (eesti->vene ja vene->eesti)
let vocabulary = [
    { word: "tere", translation: "привет" },
    { word: "aitäh", translation: "спасибо" },
    { word: "palun", translation: "пожалуйста" },
    { word: "raamat", translation: "книга" },
    { word: "maja", translation: "дом" },
    { word: "vesi", translation: "вода" },
    { word: "sõber", translation: "друг" },
    { word: "kool", translation: "школа" }
];

// Iga suuna jaoks hoiame eraldi olekut (praegune sõna, õigete/kõigi vastuste arv)
let stateEtRu = { current: null, correct: 0, total: 0 };
let stateRuEt = { current: null, correct: 0, total: 0 };

// DOM-elementide viited koondatakse objektidesse, et vältida koodi kordamist
const elEtRu = {
    box: document.getElementById('wordBoxEtRu'),
    input: document.getElementById('answerEtRu'),
    result: document.getElementById('resultEtRu'),
    score: document.getElementById('scoreEtRu')
};
const elRuEt = {
    box: document.getElementById('wordBoxRuEt'),
    input: document.getElementById('answerRuEt'),
    result: document.getElementById('resultRuEt'),
    score: document.getElementById('scoreRuEt')
};

// Universaalne funktsioon juhusliku sõna genereerimiseks ühes kahest suunast.
// direction = 'etRu' (näidatakse eesti sõna, oodatakse vene tõlget)
// direction = 'ruEt' (näidatakse vene sõna, oodatakse eesti tõlget)
function getRandomWord(direction) {
    const randomIndex = Math.floor(Math.random() * vocabulary.length);
    const pair = vocabulary[randomIndex];
    const state = direction === 'etRu' ? stateEtRu : stateRuEt;
    const el = direction === 'etRu' ? elEtRu : elRuEt;

    state.current = pair;
    // Kuvatav sõna sõltub suunast: etRu näitab eesti sõna, ruEt näitab vene sõna
    el.box.textContent = direction === 'etRu' ? pair.word : pair.translation;

    el.input.value = '';
    el.result.textContent = '';
    el.result.className = 'result';
}

// Vastuse kontroll: võrdleb kasutaja sisestust õige vastusega vastavas suunas
function checkAnswer(direction) {
    const state = direction === 'etRu' ? stateEtRu : stateRuEt;
    const el = direction === 'etRu' ? elEtRu : elRuEt;
    if (!state.current) return;

    const userAnswer = el.input.value.trim().toLowerCase();
    // Õige vastus sõltub suunast: etRu ootab vene sõna, ruEt ootab eesti sõna
    const correctAnswer = (direction === 'etRu' ? state.current.translation : state.current.word).toLowerCase();
    state.total++;

    if (userAnswer === correctAnswer) {
        state.correct++;
        el.result.textContent = '✓ Õige!';
        el.result.className = 'result good';
    } else {
        el.result.textContent = `✕ Vale. Õige vastus: ${direction === 'etRu' ? state.current.translation : state.current.word}`;
        el.result.className = 'result bad';
    }

    el.score.textContent = `Skoor: ${state.correct} / ${state.total}`;
}

// Genereerib lühikese kinnituskoodi, mida näidatakse kasutajale pärast uue sõna lisamist
function generateConfirmationCode() {
    // Juhuslik 4-kohaline number, mis toimib visuaalse kinnitusena
    return Math.floor(1000 + Math.random() * 9000);
}

// Sündmuste sidumine nuppudega mõlemas veerus
document.getElementById('refreshBtnEtRu').onclick = () => getRandomWord('etRu');
document.getElementById('checkBtnEtRu').onclick = () => checkAnswer('etRu');
document.getElementById('refreshBtnRuEt').onclick = () => getRandomWord('ruEt');
document.getElementById('checkBtnRuEt').onclick = () => checkAnswer('ruEt');

// Enter-klahv käivitab vastuse kontrolli mõlemas sisestusväljas
elEtRu.input.addEventListener('keydown', event => {
    if (event.key === 'Enter') checkAnswer('etRu');
});
elRuEt.input.addEventListener('keydown', event => {
    if (event.key === 'Enter') checkAnswer('ruEt');
});

// Uue sõna lisamine ühisesse sõnastikku (mõjutab mõlemat veergu)
document.getElementById('addBtn').onclick = () => {
    const wordField = document.getElementById('newWord');
    const translationField = document.getElementById('newTranslation');
    const addResult = document.getElementById('addResult');

    const newWord = wordField.value.trim();
    const newTranslation = translationField.value.trim();

    // Tühjade väljade kontroll, et vältida vigaste kirjete lisamist massiivi
    if (!newWord || !newTranslation) {
        addResult.textContent = 'Täida mõlemad väljad!';
        addResult.className = 'result bad';
        return;
    }

    vocabulary.push({ word: newWord, translation: newTranslation });

    // Kuvame kasutajale kinnituse koos genereeritud kinnituskoodiga
    const code = generateConfirmationCode();
    addResult.textContent = `Lisatud: "${newWord}" → "${newTranslation}" (kinnituskood: ${code})`;
    addResult.className = 'result good';

    wordField.value = '';
    translationField.value = '';
};

// Käivitame mõlemad veerud kohe lehe laadimisel
getRandomWord('etRu');
getRandomWord('ruEt');
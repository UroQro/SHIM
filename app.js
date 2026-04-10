
const questions = [
    { q: "¿Cómo califica su confianza en poder lograr y mantener una erección?", opts: ["Muy baja", "Baja", "Moderada", "Alta", "Muy alta"], pts: },
    { q: "Cuando tuvo erecciones con estimulación sexual, ¿con qué frecuencia fueron lo suficientemente firmes para la penetración?", opts: ["Casi nunca", "Pocas veces", "A veces", "Muchas veces", "Casi siempre"], pts: },
    { q: "Durante el coito, ¿con qué frecuencia pudo mantener su erección después de haber penetrado a su pareja?", opts: ["Casi nunca", "Pocas veces", "A veces", "Muchas veces", "Casi siempre"], pts: },
    { q: "Durante el coito, ¿qué tan difícil fue mantener su erección hasta terminar el acto sexual?", opts: ["Extremadamente difícil", "Muy difícil", "Difícil", "Poco difícil", "Nada difícil"], pts: },
    { q: "Cuando intentó el coito, ¿con qué frecuencia fue satisfactorio para usted?", opts: ["Casi nunca", "Pocas veces", "A veces", "Muchas veces", "Casi siempre"], pts: }
];

let currentIdx = 0;
let totalScore = 0;
let userData = {};

// Esta función se asegura de que el botón funcione apenas se cargue el DOM
window.onload = function() {
    const btnStart = document.getElementById('btn-start');
    
    btnStart.addEventListener('click', function() {
        userData.name = document.getElementById('name').value;
        userData.age = document.getElementById('age').value;
        userData.state = document.getElementById('state').value;

        if(!userData.name || !userData.age || !userData.state) {
            alert("Por favor, llena todos los campos.");
            return;
        }

        document.getElementById('screen-register').style.display = 'none';
        document.getElementById('screen-quiz').style.display = 'block';
        renderQuestion();
    });
};

function renderQuestion() {
    const q = questions[currentIdx];
    document.getElementById('question-text').innerText = q.q;
    document.getElementById('progress').style.width = ((currentIdx + 1) / 5 * 100) + '%';
    
    const container = document.getElementById('options-container');
    container.innerHTML = '';
    
    q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = "opt-btn";
        btn.innerText = opt;
        btn.onclick = function() { handleAnswer(q.pts[i]); };
        container.appendChild(btn);
    });
}

function handleAnswer(pts) {
    totalScore += pts;
    currentIdx++;
    if(currentIdx < questions.length) {
        renderQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    let diag = "";
    if(totalScore <= 7) diag = "Disfunción Grave";
    else if(totalScore <= 11) diag = "Disfunción Moderada";
    else if(totalScore <= 16) diag = "Disfunción Leve a Moderada";
    else if(totalScore <= 21) diag = "Disfunción Leve";
    else diag = "Sin Disfunción Eréctil";

    document.getElementById('screen-quiz').style.display = 'none';
    document.getElementById('screen-results').style.display = 'block';
    document.getElementById('result-score').innerText = totalScore;
    document.getElementById('result-diagnosis').innerText = diag;

    // Guardar en Firebase usando la función expuesta
    if(window.saveToFirebase) {
        window.saveToFirebase({
            ...userData,
            score: totalScore,
            diagnosis: diag
        });
    }

    document.getElementById('btn-email-send').onclick = function() {
        const subject = `Resultado SHIM: ${userData.name}`;
        const body = `Nombre: ${userData.name}%0AEdad: ${userData.age}%0AEstado: ${userData.state}%0APuntaje SHIM: ${totalScore}%0ADiagnóstico: ${diag}`;
        window.location.href = `mailto:cuestionarios@uroandres.com?subject=${subject}&body=${body}`;
    };
}

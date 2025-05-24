const startBtn = document.getElementById("start-btn");
const quizBox = document.getElementById("quiz-box");

startBtn.addEventListener("click", () => {
  startBtn.style.display = "none";
  quizBox.style.display = "block";
  startQuiz();
});


let questions = [];
let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 60;

async function startQuiz() {
  const res = await fetch("/start-quiz");
  questions = await res.json();
  currentQuestion = 0;
  score = 0;
  document.getElementById("result").textContent = "";
  document.getElementById("next-btn").style.display = "none";
  showQuestion();
}

function showQuestion() {
  clearInterval(timer);
  timeLeft = 60;
  updateTimer();
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timer);
      showTimeoutResult();
    }
  }, 1000);

  if (currentQuestion >= questions.length) {
    document.getElementById("question").textContent = `🎉 Quiz Complete! Your Score: ${score} / ${questions.length}`;
    document.getElementById("options").innerHTML = "";
    document.getElementById("result").textContent = "";
    document.getElementById("next-btn").style.display = "none";
    document.getElementById("timer").textContent = "";
    return;
  }

  const q = questions[currentQuestion];
  document.getElementById("question").textContent = `Q${currentQuestion + 1}: ${q.description}`;
  document.getElementById("options").innerHTML = "";
  document.getElementById("result").textContent = "";
  document.getElementById("next-btn").style.display = "none";

  q.options.forEach(option => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.onclick = () => checkAnswer(option, q.answer);
    document.getElementById("options").appendChild(btn);
  });
}

function checkAnswer(selected, correct) {
  clearInterval(timer);
  const result = document.getElementById("result");

  if (selected === correct) {
    score++;
    result.innerHTML = "✅ Correct!";
    result.style.color = "green";
  } else {
    result.innerHTML = `❌ Incorrect! <br>✅ Correct Answer: <strong>${correct}</strong>`;
    result.style.color = "red";
  }

  disableOptions();
  document.getElementById("next-btn").style.display = "inline-block";
}

function showTimeoutResult() {
  const q = questions[currentQuestion];
  const result = document.getElementById("result");

  result.innerHTML = `⏰ Time's up!<br>✅ Correct Answer: <strong>${q.answer}</strong>`;
  result.style.color = "orange";

  disableOptions();
  document.getElementById("next-btn").style.display = "inline-block";
}

function disableOptions() {
  document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);
}

function nextQuestion() {
  currentQuestion++;
  showQuestion();
}

function updateTimer() {
  document.getElementById("timer").textContent = `⏱️ Time Left: ${timeLeft}s`;
}

document.getElementById("next-btn").addEventListener("click", nextQuestion);

window.onload = startQuiz;

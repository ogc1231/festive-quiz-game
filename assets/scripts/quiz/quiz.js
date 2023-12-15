import {
  getCurrentQuestion,
  initializeQuiz,
  questions,
  goToNextQuestion,
} from "./useQuiz.js";
import {
  updateUserPoints,
  quizState,
  updateUserBet,
  updateQuestionIndex,
  updateGameState,
} from "./quizState.js";

let timer;
let timeLeft = 12; // todo: make this dynamic based on difficulty setting

function startTimer() {
  clearTimeout(timer);
  resetProgressBar();
  timeLeft = 12;
  const progressBar = document.querySelector("#timerProgress");
  progressBar.classList.add("progress-bar-animate");
  timer = setTimeout(() => {
    handleTimeOut();
  }, 20000);
}

function handleTimeOut() {
  handleAnswer(false, true);
}

function resetProgressBar() {
  const progressBar = document.querySelector("#timerProgress");
  progressBar.classList.remove("progress-bar-animate");
  void progressBar.offsetWidth; // force reflow/repaint
  progressBar.style.width = "100%";
}

function handleAnswer(isCorrect, isTimeout = false) {
  const betAmount = quizState.userBet;
  clearInterval(timer);
  resetProgressBar();
  let multiplier = 1;
  if (timeLeft > 9)
    multiplier = 2; // todo: make this dynamic based of diffculty setting , 80%, 65 % etc
  else if (timeLeft > 5) multiplier = 1.5;

  const pointsAwarded = isCorrect ? betAmount * multiplier : -betAmount;
  updateUserPoints(pointsAwarded);
  if (isTimeout) {
    alert("You ran out of time");
  } else {
    alert(isCorrect ? "Correct!" : "Incorrect!");
  }
  const answerButtons = document.querySelectorAll("#answers button");
  answerButtons.forEach((button) => {
    button.disabled = true;
  });
  const betInput = document.querySelector("#betInput");
  betInput.disabled = true;
  updateBetInputConstraints();
  renderNextQuestionButton();

  betInput.value = 0;
  updateUserBet(0);

  if (quizState.points <= 0) {
    updateGameState("completed");
    displayGameOverMessage();
    return;
  }
}

function renderNextQuestionButton() {
  const quizContainer = document.querySelector("#quizContainer");
  const nextButton = document.createElement("button");
  nextButton.id = "nextButton";
  const isLastQuestion =
    quizState.currentQuestionIndex === questions.length - 1;
  nextButton.textContent = isLastQuestion ? "Finish" : "Next Question";
  nextButton.className = "btn btn-primary my-3";
  nextButton.style.display = "block";
  nextButton.style.margin = "0 auto";

  nextButton.addEventListener("click", () => {
    if (isLastQuestion) {
      finishQuiz();
    } else {
      goToNextQuestion();
      updateQuestionIndex();
      updateQuestion();
    }
    nextButton.style.display = "none";
  });

  const nextButtonContainer = document.querySelector("#nextButtonContainer");

  nextButtonContainer.appendChild(nextButton);
}

function finishQuiz() {
  updateGameState("completed");
  onComplete();
}

function onComplete() {
  const quizContainer = document.querySelector("#quiz");
  quizContainer.innerHTML = `<h2>Finished!</h2>`;
}

function updateQuestion() {
  const currentQuestion = getCurrentQuestion();
  const questionElement = document.querySelector("#question");
  questionElement.textContent = currentQuestion.question;

  const existingAnswers = document.querySelector("#answers");
  if (existingAnswers) {
    existingAnswers.remove();
  }

  const answersContainer = document.createElement("div");
  answersContainer.id = "answers";
  answersContainer.className = "row";

  let answers = [];
  if (currentQuestion.type === "boolean") {
    answers = ["True", "False"];
  } else if (currentQuestion.type === "multiple") {
    answers = [
      currentQuestion.correctAnswer,
      ...currentQuestion.incorrectAnswers,
    ];
    answers.sort(() => Math.random() - 0.5);
  }

  answers.forEach((answer) => {
    const answerCol = document.createElement("div");
    answerCol.className = "col-md-6 mb-3";

    const answerButton = document.createElement("button");
    answerButton.className = "btn btn-info w-100";
    answerButton.textContent = answer;
    answerButton.onclick =
      currentQuestion.type === "multiple"
        ? () => handleAnswer(answer === currentQuestion.correctAnswer)
        : () =>
            handleAnswer(
              answer.toLowerCase() ===
                currentQuestion.correctAnswer.toString().toLowerCase()
            );
    answerCol.appendChild(answerButton);
    answersContainer.appendChild(answerCol);
  });

  const quizContainer = document.querySelector("#quizContainer");
  quizContainer.appendChild(answersContainer);
  const betInput = document.querySelector("#betInput");
  const betValueDisplay = document.querySelector("#betValueDisplay");
  betInput.disabled = false;
  betInput.value = 0;
  betValueDisplay.textContent = "0";
  resetProgressBar();
  startTimer();
}

function updateBetInputConstraints() {
  const betInput = document.querySelector("#betInput");
  const betValueDisplay = document.querySelector("#betValueDisplay");
  const totalPointsDisplay = document.querySelector("#totalPointsDisplay");

  betInput.max = quizState.points;
  betInput.value = 0;
  betValueDisplay.textContent = "0";
  totalPointsDisplay.textContent = quizState.points;
}

// initial ui
document.querySelector("#quiz").innerHTML = `

  <div id="quizContainer" class="container">
    <h1 id="question" class="my-3">Loading...</h1>
  </div>
  <div class="my-3 col-md-4" >
    <div class="mb-2">
        <strong>Total Points: </strong><span id="totalPointsDisplay"></span>
    </div>
    <div class="mb-2">
</div>
<label for="betInput" class="form-label">Place Your Bet:</label>
<input type="range" id="betInput" class="form-range" min="0" max="100" step="1" value="0">

<span id="betValueDisplay">0</span>
</div>
<div id="nextButtonContainer"></div>
`;

function displayGameOverMessage() {
  const quizContainer = document.querySelector("#quiz");
  quizContainer.innerHTML = `<h2>You Died!</h2>`;
}

initializeQuiz()
  .then(() => {
    updateQuestion();
    updateBetInputConstraints();
  })
  .catch((error) => {
    console.error("Error:", error);
    document.querySelector("#question").textContent = "Error loading questions";
  });

document.addEventListener("DOMContentLoaded", () => {
  const betInput = document.querySelector("#betInput");
  const betValueDisplay = document.querySelector("#betValueDisplay");

  betInput.addEventListener("input", () => {
    let betValue = parseInt(betInput.value) || 0;

    if (betValue > quizState.points) {
      betValue = quizState.points;
    } else if (betValue < 0) {
      betValue = 0;
    }

    betInput.value = betValue;
    betValueDisplay.textContent = betValue; // Update display
    updateUserBet(betValue);
  });
});

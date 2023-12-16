import {
  getCurrentQuestion,
  initializeQuiz,
  questions,
  goToNextQuestion,
  resetProgressBar,
} from "./utils.js";
import {
  updateUserPoints,
  quizState,
  updateUserBet,
  updateQuestionIndex,
  updateGameState,
} from "./quizState.js";

// initial ui
const initialHtml = `<div id="quizContainer" class="container animate__animated animate__fadeIn">
    <h1 id="question" class="my-3">Loading...</h1>
  </div>
  <div class="my-3 col-md-4" id="betContainer" >
    <div class="mb-2">
        <strong>Total Points: </strong><span id="totalPointsDisplay"></span>
    </div>
    <div class="mb-2">
</div>
<label for="betInput" class="form-label">Place Your Bet:</label>
<input type="range" id="betInput" class="form-range" min="0" max="100" step="1" value="0">

<span id="betValueDisplay">0</span>
</div>
`;

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
  updateUserPoints(-10); // todo 10 for easy, 15 for medium or 20 for difficult etc
  handleAnswer(false, true);
}

function handleAnswer(isCorrect, isTimeout = false) {
  const betAmount = quizState.userBet;
  clearInterval(timer);
  resetProgressBar();
  let multiplier = 1;
  if (timeLeft > 9)
    multiplier = 2; // todo: make this dynamic based on difficulty setting
  else if (timeLeft > 5) multiplier = 1.5;

  const pointsAwarded = isCorrect ? betAmount * multiplier : -betAmount;
  updateUserPoints(pointsAwarded);

  const answerButtons = document.querySelectorAll("#answers button");
  answerButtons.forEach((button) => {
    button.disabled = true;
  });
  const betInput = document.querySelector("#betInput");
  const betContainer = document.querySelector("#betContainer");
  betInput.disabled = true;
  betContainer.style.display = "none";
  updateBetInputConstraints();

  betInput.value = 0;
  updateUserBet(0);

  if (quizState.points <= 0) {
    updateGameState("completed");
    displayGameOverMessage();
    return;
  }

  displayAnswer(isCorrect, isTimeout);
}

function displayAnswer(isCorrect, isTimeout) {
  const quizContainer = document.getElementById("quizContainer");
  const currentQuestion = getCurrentQuestion();
  let answerFeedback = isTimeout
    ? "Time Out"
    : isCorrect
    ? "Correct!"
    : "Incorrect!";
  let correctAnswerText = isCorrect
    ? ""
    : `<p>Correct Answer: ${currentQuestion.correctAnswer}</p>`;
  const triviaText = `<p>Interesting Fact: ${currentQuestion.trivia}</p>`;

  quizContainer.innerHTML = `
    <div class="row answer-screen animate__animated animate__fadeIn">
      <div class="col-md-6">
        <img src="${currentQuestion.imageUrl}" alt="Question Image" class="img-fluid">
      </div>
      <div class="col-md-6 d-flex flex-column justify-content-center align-items-center">
        <p class="text-center">${answerFeedback}</p>
        ${correctAnswerText}
        ${triviaText}
        <div id="nextButtonContainer"></div>
      </div>
    </div>
  `;
  renderNextQuestionButton();
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
  const html = `
    <div class="container animate__animated animate__fadeIn">
      <div class="row">
        <div class="col-md-6">
          <img src="assets/images/12Days.png" alt="Quiz Rules" class="img-fluid">
        </div>
        <div class="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <p class="text-center">Congratulations on completing the quiz!</p>
          <div>
          <a id="playAgainButton" href="quiz.html" class="btn btn-primary my-3">Play Again</a>
          <a id="homeButton" href="index.html" class="btn btn-primary my-3">Back to Homepage</a>
        </div>
        </div>
      </div>
    </div>
  `;
  quizContainer.innerHTML = html;
}

function updateQuestion() {
  const currentQuestion = getCurrentQuestion();

  // Update the question text
  const questionContainer = document.getElementById("quizContainer");
  if (!questionContainer) {
    console.error("Question container not found");
    return;
  }

  questionContainer.innerHTML = `
    <h1 id="question" class="my-3">${currentQuestion.question}</h1>
    <div id="answers" class="row"></div>
  `;

  const answersContainer = document.getElementById("answers");

  let answers =
    currentQuestion.type === "boolean"
      ? ["True", "False"]
      : [
          currentQuestion.correctAnswer,
          ...currentQuestion.incorrectAnswers,
        ].sort(() => 0.5 - Math.random());

  answers.forEach((answer) => {
    const answerCol = document.createElement("div");
    answerCol.className = "col-md-6 mb-3";
    const answerButton = document.createElement("button");
    answerButton.className = "btn btn-info w-100";
    answerButton.textContent = answer;
    if (currentQuestion.type === "boolean") {
      answerButton.onclick = () =>
        handleAnswer(
          answer.toLowerCase() ===
            currentQuestion.correctAnswer.toString().toLowerCase()
        );
    } else {
      answerButton.onclick = () =>
        handleAnswer(answer === currentQuestion.correctAnswer);
    }
    answerCol.appendChild(answerButton);
    answersContainer.appendChild(answerCol);
  });

  const betInput = document.querySelector("#betInput");
  const betContainer = document.querySelector("#betContainer");
  betInput.disabled = false;
  betContainer.style.display = "initial";

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

document.querySelector("#quiz").innerHTML = initialHtml;

function displayGameOverMessage() {
  const quizContainer = document.querySelector("#quiz");
  const html = `
    <div class="container animate__animated animate__fadeIn">
      <div class="row">
        <div class="col-md-6">
          <img src="assets/images/crash.png" alt="Quiz Rules" class="img-fluid">
        </div>
        <div class="col-md-6 d-flex flex-column justify-content-center">
          <p class="text-center">Game Over</p>
          <div>
          <a id="startButton" href="quiz.html" class="btn btn-primary my-3">Play Again</a>
          <a href="index.html" class="btn btn-primary my-3">Back to Home</a>
</div>
        </div>
      </div>
    </div>
  `;
  quizContainer.innerHTML = html;
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

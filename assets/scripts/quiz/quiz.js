import {
  getCurrentQuestion,
  initializeQuiz,
  questions,
  goToNextQuestion,
  resetProgressBar,
  getTimerValue,
  getTimeOutPenalty,
  calcTimeOutPenalty,
  getDifficultyLevel,
  addHighScoreToLeaderboard,
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
let timeLeft = getTimerValue();

console.log(timeLeft);

function startTimer() {
  clearTimeout(timer);
  resetProgressBar();
  timeLeft = getTimerValue();
  const progressBar = document.querySelector("#timerProgress");

  requestAnimationFrame(() => {
    progressBar.classList.add("progress-bar-animate");
    progressBar.style.animation = `countdown ${
      timeLeft / 1000
    }s linear forwards`;
  });

  timer = setTimeout(() => {
    handleTimeOut();
  }, timeLeft);
}

function handleTimeOut() {
  const penalty = calcTimeOutPenalty(
    getDifficultyLevel(),
    quizState.currentQuestionIndex
  );
  updateUserPoints(penalty);
  handleAnswer(false, true);
}

function handleAnswer(isCorrect, isTimeout = false) {
  const betAmount = quizState.userBet;
  clearInterval(timer);
  resetProgressBar();

  const difficulty = getDifficultyLevel();
  let multiplier = 1;

  if (difficulty === "easy") {
    if (timeLeft > 10000) multiplier = 1.5; // More than 10 seconds
  } else if (difficulty === "medium") {
    if (timeLeft > 9000) multiplier = 1.8; // More than 9 seconds
    else if (timeLeft > 5000) multiplier = 1.5; // More than 5 seconds
  } else if (difficulty === "hard") {
    if (timeLeft > 6000) multiplier = 2; // More than 6 seconds
    else if (timeLeft > 4000) multiplier = 1.5; // More than 4 seconds
  }

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
  nextButton.className = "next-finish-button btn btn-success my-3";
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

const twelveDaysOfChristmas = [
  "On the first day of Christmas, my true love sent to me: A Partridge in a Pear Tree.",
  "On the second day of Christmas, my true love sent to me: Two Turtle Doves and a Partridge in a Pear Tree.",
  "On the third day of Christmas, my true love sent to me: Three French Hens, Two Turtle Doves, and a Partridge in a Pear Tree.",
  "On the fourth day of Christmas, my true love sent to me: Four Calling Birds, Three French Hens, Two Turtle Doves, and a Partridge in a Pear Tree.",
  "On the fifth day of Christmas, my true love sent to me: Five Golden Rings, Four Calling Birds, Three French Hens, Two Turtle Doves, and a Partridge in a Pear Tree.",
  "On the sixth day of Christmas, my true love sent to me: Six Geese a Laying, Five Golden Rings, Four Calling Birds, Three French Hens, Two Turtle Doves, and a Partridge in a Pear Tree.",
  "On the seventh day of Christmas, my true love sent to me: Seven Swans a Swimming, Six Geese a Laying, Five Golden Rings, Four Calling Birds, Three French Hens, Two Turtle Doves, and a Partridge in a Pear Tree.",
  "On the eighth day of Christmas, my true love sent to me: Eight Maids a Milking, Seven Swans a Swimming, Six Geese a Laying, Five Golden Rings, Four Calling Birds, Three French Hens, Two Turtle Doves, and a Partridge in a Pear Tree.",
  "On the ninth day of Christmas, my true love sent to me: Nine ladies dancing, Eight Maids a Milking, Seven Swans a Swimming, Six Geese a Laying, Five Golden Rings, Four Calling Birds, Three French Hens, Two Turtle Doves, and a Partridge in a Pear Tree.",
  "On the tenth day of Christmas, my true love sent to me: Ten lords a-leaping, Nine ladies dancing, Eight Maids a Milking, Seven Swans a Swimming, Six Geese a Laying, Five Golden Rings, Four Calling Birds, Three French Hens, Two Turtle Doves, and a Partridge in a Pear Tree.",
  "On the eleventh day of Christmas, my true love sent to me: Eleven pipers piping, Ten lords a-leaping, Nine ladies dancing, Eight Maids a Milking, Seven Swans a Swimming, Six Geese a Laying, Five Golden Rings, Four Calling Birds, Three French Hens, Two Turtle Doves, and a Partridge in a Pear Tree.",
  "On the twelfth day of Christmas, my true love sent to me: 12 Drummers Drumming, 11 Pipers Piping, 10 Lords a Leaping, 9 Ladies Dancing, 8 Maids a Milking, 7 Swans a Swimming, 6 Geese a Laying, 5 Golden Rings, 4 Calling Birds, 3 French Hens, 2 Turtle Doves, and a Partridge in a Pear Tree.",
];

async function onComplete() {
  const quizContainer = document.querySelector("#quiz");
  const html = `
    <div class="container animate__animated animate__fadeIn">
      <div class="row mx-auto border border-danger border-3 rounded-4">
        <div class="col-md-6">
          <img src="../../assets/images/12Days.png" alt="Quiz Rules" class="img-fluid">
        </div>
        <div class="col-md-6 d-flex flex-column justify-content-center align-items-center">
          <div">
            <h2 class="h2">Congratulations!</h2>
            <h2 class="h4">Score: ${quizState.points}</h2>
            <div id="verseContainer" class="animate__animated text-center content-fixed-height h4 d-flex justify-content-center align-items-center"></div>
            <div class="button-group">
              <a id="playAgainButton" href="/quiz" class="btn btn-success my-3">Play Again</a>
              <a id="homeButton" href="/home" class="btn btn-danger my-3">Back to Homepage</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  quizContainer.innerHTML = html;

  displayVerses();

  const userScore = quizState.points; // Assuming this is the user's score
  let leaderboardData;
  try {
    const response = await fetch(
      "https://trivia-api-fe683df325a4.herokuapp.com/leaderboard"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    leaderboardData = data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }

  if (leaderboardData && leaderboardData.length > 0) {
    const lowestLeaderboardScore =
      leaderboardData[leaderboardData.length - 1].score;
    if (userScore > lowestLeaderboardScore) {
      const userName = prompt(
        "You made it to the leaderboard! Enter your name:"
      );
      if (userName) {
        addHighScoreToLeaderboard(userName, quizState.points)
          .then((response) => {
            console.log("Added to leaderboard:", response);
          })
          .catch((error) => {
            console.error("Error adding to leaderboard:", error);
          });
      }
    }
  }
}

function displayVerses() {
  const verseContainer = document.getElementById("verseContainer");
  let currentVerse = 0;

  const displayNextVerse = () => {
    verseContainer.textContent = twelveDaysOfChristmas[currentVerse];
    currentVerse = (currentVerse + 1) % twelveDaysOfChristmas.length;
  };

  displayNextVerse();

  const updateVerse = () => {
    verseContainer.classList.remove("animate__fadeIn");
    verseContainer.classList.add("animate__fadeOut");

    setTimeout(() => {
      displayNextVerse();
      verseContainer.classList.remove("animate__fadeOut");
      verseContainer.classList.add("animate__fadeIn");
    }, 1000);
  };

  setInterval(updateVerse, 8000);
}

function updateQuestion() {
  const currentQuestion = getCurrentQuestion();

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
    answerButton.className = "btn btn-success w-100";
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
      <div class="row mx-auto border border-danger border-3 rounded-4">
        <div class="col-md-6">
          <img src="../../assets/images/crash.png" alt="Quiz Rules" class="img-fluid">
        </div>
        <div class="col-md-6 d-flex flex-column justify-content-center">
          <h3 class="text-center h2 fw-bold ">Game Over!</h3>
          <div>
          <a id="startButton" href="/quiz" class="btn btn-success my-3">Play Again</a>
          <a href="/home" class="btn btn-danger my-3">Back to Home</a>
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

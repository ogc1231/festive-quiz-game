export let questions = [];
let currentQuestionIndex = 0;
let difficultyLevel;
let questionType;
let startingPoints;
let timerValue;
let timeOutPenalty;

const storedData = localStorage.getItem("formData");

console.log(storedData);
if (storedData) {
  try {
    const formData = JSON.parse(storedData);
    console.log(formData);
    difficultyLevel = formData.difficultyLevel;
    questionType = formData.questionType;
    startingPoints = calcStartingPoints(difficultyLevel);
    timerValue = calcTimer(difficultyLevel);
    timeOutPenalty = calcTimeOutPenalty(difficultyLevel);
  } catch (error) {
    console.error("Error parsing formData from localStorage:", error);
  }
} else {
  difficultyLevel = "medium";
  questionType = "mixed";
  startingPoints = calcStartingPoints(difficultyLevel);
  timerValue = calcTimer(difficultyLevel);
  timeOutPenalty = calcTimeOutPenalty(difficultyLevel);
}

export function getCurrentQuestion() {
  return questions[currentQuestionIndex];
}

export function goToNextQuestion() {
  currentQuestionIndex++;
}

export function getQuestions() {
  return questions;
}

export function getDifficultyLevel() {
  return difficultyLevel;
}

export function getQuestionType() {
  return questionType;
}

export function getStartingPoints() {
  return startingPoints;
}

export function getTimerValue() {
  return timerValue;
}

export function getTimeOutPenalty() {
  return timeOutPenalty;
}

function calcStartingPoints(difficulty) {
  switch (difficulty) {
    case "easy":
      console.log("should set to 200");
      return 200;
    case "medium":
      return 100;
    case "hard":
      return 50;
    default:
      return 100;
  }
}

function calcTimer(difficulty) {
  switch (difficulty) {
    case "easy":
      return 15000;
    case "medium":
      return 12000;
    case "hard":
      return 8000;
    default:
      return 12000;
  }
}

export function calcTimeOutPenalty(difficulty, index) {
  switch (difficulty) {
    case "easy":
      return -(5 * (index + 1));
    case "medium":
      return -(10 * (index + 1));
    case "hard":
      return -(15 * (index + 1));
    default:
      return -(10 * (index + 1));
  }
}

async function fetchTriviaQuestions() {
  const queryParams = questionType === 'mixed' ? { amount: 12 } : {amount: 12, type: questionType};
  const queryString = Object.keys(queryParams)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
    )
    .join("&");

  const response = await fetch(
    `https://trivia-api-fe683df325a4.herokuapp.com/trivia?${queryString}`
  );
  const data = await response.json();

  if (data) {
    questions = data.map((q, index) => {
      return {
        question: q.question,
        type: q.type,
        correctAnswer: q.correct_answer,
        incorrectAnswers: q.incorrect_answers || [],
        trivia: q.interesting_fact,
        imageUrl: `./assets/images/day${index + 1}.png`,
      };
    });
  } else {
    throw new Error("No data received");
  }
}

export async function initializeQuiz() {
  await fetchTriviaQuestions();
}

export function resetProgressBar() {
  const progressBar = document.querySelector("#timerProgress");
  if (progressBar) {
    progressBar.classList.remove("progress-bar-animate");
    progressBar.style.animation = "none"; // Reset animation
    progressBar.offsetHeight; // Trigger reflow
    progressBar.style.width = "100%";
  }
}

export async function addHighScoreToLeaderboard(username, score) {
  console.log(username, score);
  console.log(typeof username);
  console.log(typeof score);
  try {
    const response = await fetch(
      "https://trivia-api-fe683df325a4.herokuapp.com/leaderboard",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, score: score }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error adding high score:", error);
  }
}

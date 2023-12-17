import { getSettings } from '.utils.js';


export let questions = [];
let currentQuestionIndex = 0;

export function getCurrentQuestion() {
  return questions[currentQuestionIndex];
}

export function goToNextQuestion() {
  currentQuestionIndex++;
}

export function getQuestions() {
  return questions;
}

async function fetchTriviaQuestions() {
    const defaultParams = { amount: 12 };
    const { difficulty, questionType } = getSettings();

    const queryParams = { difficulty, type: questionType }; // Construct query parameters

    const combinedParams = { ...defaultParams, ...queryParams }; // Merge default and user-defined params

    const queryString = new URLSearchParams(combinedParams).toString(); // Construct query string

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
                imageUrl: `assets/images/day${index + 1}.png`,
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
    void progressBar.offsetWidth; // force reflow/repaint
    progressBar.style.width = "100%";
  }
}



export function getSettings() {
    const difficultyLevel = localStorage.getItem('difficulty');
    const questionType = localStorage.getItem('questionType');

    return { difficultyLevel, questionType };
}

import { getCurrentQuestion, goToNextQuestion, initializeQuiz } from './useQuiz.js';

function handleAnswerClick(isCorrect) {
    if (isCorrect) {
      alert('Correct!');
    } else {
      alert('Incorrect!');
    }
  }

  function updateQuestion() {
    const currentQuestion = getCurrentQuestion();
    const questionElement = document.querySelector("#question");
    questionElement.textContent = currentQuestion.question;

    const existingAnswers = document.querySelector('#answers');
    if (existingAnswers) {
        existingAnswers.remove();
    }

    const answersContainer = document.createElement('div');
    answersContainer.id = 'answers';

    let answers = [];
    if (currentQuestion.type === 'boolean') {
        answers = ['True', 'False'];
    } else if (currentQuestion.type === 'multiple') {
        answers = [currentQuestion.correctAnswer, ...currentQuestion.incorrectAnswers];
        answers.sort(() => Math.random() - 0.5);
    }

    answers.forEach(answer => {
        const answerButton = document.createElement('button');
        answerButton.textContent = answer;
        answerButton.onclick = currentQuestion.type === 'multiple' 
            ? () => handleAnswerClick(answer === currentQuestion.correctAnswer) 
            : () => handleAnswerClick(answer.toLowerCase() === currentQuestion.correctAnswer.toString().toLowerCase());
        answersContainer.appendChild(answerButton);
    });

    const quizContainer = document.querySelector("#quizContainer");
    quizContainer.appendChild(answersContainer);
}


function setupNextQuestionButton() {
    const nextButton = document.querySelector("#nextButton");
    nextButton.addEventListener("click", () => {
        goToNextQuestion();
        updateQuestion();
    });
}

// Set up the initial UI
document.querySelector("#quiz").innerHTML = `
  <div id="quizContainer">
    <h1 id="question">Loading...</h1>
  </div>
  <button id="nextButton">Next Question</button>
`;

initializeQuiz().then(() => {
    updateQuestion();
    setupNextQuestionButton();
}).catch(error => {
    console.error('Error:', error);
    document.querySelector("#question").textContent = "Error loading questions";
});

import { getCurrentQuestion, initializeQuiz, questions,  goToNextQuestion} from './useQuiz.js';
import { updateUserPoints, quizState, updateUserBet, updateQuestionIndex, updateGameState  } from './quizState.js'

function handleAnswer(isCorrect) {
    const betAmount = quizState.userBet;
    if (isCorrect) {
        updateUserPoints(betAmount);
        alert('Correct!');
    } else {
        updateUserPoints(-betAmount);
        alert('Incorrect!');
    }
    const answerButtons = document.querySelectorAll('#answers button');
    answerButtons.forEach(button => {
        button.disabled = true;
    });
    updateBetInputConstraints();
    renderNextQuestionButton();

    betInput.value = 0;
    updateUserBet(0);

    if (quizState.points <= 0) {
        updateGameState('completed');
        displayGameOverMessage();
        return;
    }
}

function renderNextQuestionButton() {
    const quizContainer = document.querySelector("#quizContainer");
    const nextButton = document.createElement('button');
    nextButton.id = 'nextButton';
    const isLastQuestion = quizState.currentQuestionIndex === questions.length;
    nextButton.textContent = isLastQuestion ? 'Finish' : 'Next Question';
    nextButton.className = 'btn btn-primary my-3';
    nextButton.style.display = 'block';
    nextButton.style.margin = '0 auto';

    nextButton.addEventListener("click", () => {
        if (isLastQuestion) {
            finishQuiz();
        } else {
            goToNextQuestion();
            updateQuestionIndex();
            updateQuestion();
        }
        nextButton.style.display = 'none';
    });

    const nextButtonContainer = document.querySelector("#nextButtonContainer");

    nextButtonContainer.appendChild(nextButton);
}

function finishQuiz() {
    updateGameState('completed');
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

    const existingAnswers = document.querySelector('#answers');
    if (existingAnswers) {
        existingAnswers.remove();
    }

    const answersContainer = document.createElement('div');
    answersContainer.id = 'answers';
    answersContainer.className = 'row';

    let answers = [];
    if (currentQuestion.type === 'boolean') {
        answers = ['True', 'False'];
    } else if (currentQuestion.type === 'multiple') {
        answers = [currentQuestion.correctAnswer, ...currentQuestion.incorrectAnswers];
        answers.sort(() => Math.random() - 0.5);
    }

    answers.forEach(answer => {
        const answerCol = document.createElement('div');
        answerCol.className = 'col-md-6 mb-3';

        const answerButton = document.createElement('button');
        answerButton.className = 'btn btn-info w-100';
        answerButton.textContent = answer;
        answerButton.onclick = currentQuestion.type === 'multiple' 
            ? () => handleAnswer(answer === currentQuestion.correctAnswer) 
            : () => handleAnswer(answer.toLowerCase() === currentQuestion.correctAnswer.toString().toLowerCase());
            answerCol.appendChild(answerButton);
            answersContainer.appendChild(answerCol);
    });

    const quizContainer = document.querySelector("#quizContainer");
    quizContainer.appendChild(answersContainer);
}

function updateBetInputConstraints() {
    const betInput = document.querySelector('#betInput');
    const totalPointsDisplay = document.querySelector('#totalPointsDisplay');

    betInput.max = quizState.points;
    totalPointsDisplay.textContent = quizState.points;
}

// initial ui
document.querySelector("#quiz").innerHTML = `
  <div id="quizContainer" class="container">
    <h1 id="question" class="my-3">Loading...</h1>
  </div>
  <div class="my-3 col-md-6" >
    <div class="mb-2">
        <strong>Total Points: </strong><span id="totalPointsDisplay"></span>
    </div>
    <label for="betInput" class="form-label">Place Your Bet:</label>
    <input type="number" id="betInput" class="form-control" placeholder="Enter bet amount" min="0">
</div>
<div id="nextButtonContainer"></div>
`;

function displayGameOverMessage() {
    const quizContainer = document.querySelector("#quiz");
    quizContainer.innerHTML = `<h2>You Died!</h2>`;
}

initializeQuiz().then(() => {
    updateQuestion();
    updateBetInputConstraints()
}).catch(error => {
    console.error('Error:', error);
    document.querySelector("#question").textContent = "Error loading questions";
});


document.addEventListener('DOMContentLoaded', () => {
    const betInput = document.querySelector('#betInput');
    
    betInput.addEventListener('input', () => {
        let betValue = parseInt(betInput.value) || 0;
        
        if (betValue > quizState.points) {
            betValue = quizState.points;
        } else if (betValue < 0) {
            betValue = 0;
        }

        betInput.value = betValue;
        updateUserBet(betValue);
    });
});
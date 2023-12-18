import { getStartingPoints } from "./utils.js";

export const quizState = {
  points: getStartingPoints(),
  currentQuestionIndex: 0,
  userBet: 0,
  gameState: "started",
};

export function updateUserPoints(points) {
  quizState.points += points;
}

export function updateUserBet(bet) {
  quizState.userBet = bet;
}

export function updateQuestionIndex() {
  console.log(quizState.currentQuestionIndex);
  quizState.currentQuestionIndex++;
  console.log(quizState.currentQuestionIndex);
}

export function updateGameState(state) {
  quizState.gameState = state;
}

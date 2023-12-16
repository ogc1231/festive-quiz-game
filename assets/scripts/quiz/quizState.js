export const quizState = {
  points: 100,
  currentQuestionIndex: 0,
  userBet: 0,
  gameState: "started", // Possible values: 'notStarted', 'ongoing', 'completed' ?
};

export function updateUserPoints(points) {
  quizState.points += points;
}

export function updateUserBet(bet) {
  quizState.userBet = bet;
}

export function updateQuestionIndex() {
  quizState.currentQuestionIndex++;
}

export function updateGameState(state) {
  quizState.gameState = state;
}

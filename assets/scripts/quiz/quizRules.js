function setQuizParameters() {
  let points = 100;
  let time = 12;

  const storedData = localStorage.getItem("formData");
  if (storedData) {
    try {
      const formData = JSON.parse(storedData);
      const difficultyLevel = formData.difficultyLevel;

      switch (difficultyLevel) {
        case "easy":
          points = 200;
          time = 15;
          break;
        case "hard":
          points = 50;
          time = 8;
          break;
      }
    } catch (error) {
      console.error("Error parsing formData from localStorage:", error);
    }
  }

  document.getElementById("points").textContent = points;
  document.getElementById("time").textContent = time;
}

document.addEventListener("DOMContentLoaded", setQuizParameters);

// Save settings to localstorage
document
  .getElementById("settings-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    localStorage.clear();

    let difficultyLevel = document.querySelector(
      'input[name="inlineRadioOptions"]:checked'
    ).value;
    let questionType = document.querySelector(
      'input[name="inlineRadioOptions2"]:checked'
    ).value;
    const formData = {
      difficultyLevel: difficultyLevel,
      questionType: questionType,
    };

    saveFormData(formData);
  });

function saveFormData(formData) {
  const storedFormData = JSON.parse(localStorage.getItem("formData")) || [];

  storedFormData.push(formData);

  localStorage.setItem("formData", JSON.stringify(storedFormData));
}

// Clear localstorage
const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", function () {
  localStorage.clear();
});

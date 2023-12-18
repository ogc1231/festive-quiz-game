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
  localStorage.clear();
  localStorage.setItem("formData", JSON.stringify(formData));
  alert('settings updated');
}

// Clear localstorage
const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", function () {
  localStorage.clear();
  alert('settings updated');

});

// Save state of settings
document.addEventListener('DOMContentLoaded', function() {

  localStorage.getItem('formData')

  const formData1 = JSON.parse(localStorage.getItem('formData'));
  const formData2 = JSON.parse(localStorage.getItem('formData'));

  if (formData1.difficultyLevel) {
  document.querySelector(`input[name="inlineRadioOptions"][value="${formData1.difficultyLevel}"]`).checked = true;
  }

  if (formData2.questionType) {
  document.querySelector(`input[name="inlineRadioOptions2"][value="${formData2.questionType}"]`).checked = true;
  }
});
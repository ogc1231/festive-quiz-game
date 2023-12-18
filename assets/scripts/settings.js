<<<<<<< HEAD
// Save settings to local storage
const saveBtn = document.getElementById("save-set-btn");
=======
// Save settings to localstorage
document
  .getElementById("settings-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    localStorage.clear();
>>>>>>> 64b53ae154d93bc544bae81b7d5010fc76cb94c2

saveBtn.addEventListener("click", function () {
  let difficultyLevel = document.querySelector('input[name="inlineRadioOptions"]:checked').value;
  let questionType = document.querySelector('input[name="inlineRadioOptions2"]:checked').value;
  const formData = {
    difficultyLevel: difficultyLevel,
    questionType: questionType,
  };

  saveFormData(formData);
  showNotification(); // Show notification after saving
});

function saveFormData(formData) {
  localStorage.clear();
  localStorage.setItem("formData", JSON.stringify(formData));
  alert('settings updated');
}

// Function to show notification (alert in this case)
function showNotification() {
  alert("Settings have been saved!"); // You can customize this notification
}

// Clear local storage
const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", function () {
  localStorage.clear();
  alert('settings updated');

});

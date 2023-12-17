// Save settings to local storage
const saveBtn = document.getElementById("save-set-btn");

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
  const storedFormData = JSON.parse(localStorage.getItem("formData")) || [];

  storedFormData.push(formData);

  localStorage.setItem("formData", JSON.stringify(storedFormData));
}

// Function to show notification (alert in this case)
function showNotification() {
  alert("Settings have been saved!"); // You can customize this notification
}

// Clear local storage
const resetBtn = document.getElementById("reset-btn");

resetBtn.addEventListener("click", function () {
  localStorage.clear();
});

document.getElementById('settings-form').addEventListener('submit', function(event) {
    event.preventDefault();

    let difficultyLevel = document.querySelector('input[name="inlineRadioOptions"]:checked').value
    let questionType = document.querySelector('input[name="inlineRadioOptions2"]:checked').value
    let numberOfQuestions = document.querySelector('#number-of-questions').value

    const formData = {
        difficultyLevel: difficultyLevel,
        questionType: questionType,
        numberOfQuestions: numberOfQuestions
    };

    saveFormData(formData);
});

function saveFormData(formData) {
    const storedFormData = JSON.parse(localStorage.getItem('formData')) || [];

    storedFormData.push(formData);

    localStorage.setItem('formData', JSON.stringify(storedFormData));
}
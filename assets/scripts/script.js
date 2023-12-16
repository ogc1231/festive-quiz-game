// window.onload = function() {

//   if (localStorage) {

 
//     document.getElementById('settings-form').addEventListener('submit', function() {
  
//       let difficultyLevel = document.getElementById('difficulty-level').value
//       let questionType = document.getElementById('question-type').value
//       let numberOfQuestions = document.getElementById('number-of-questions').value

 
//       localStorage.setItem('is_difficultyLevel', difficultyLevel)
//       localStorage.setItem('is_questionType', questionType)
//       localStorage.setItem('is_numberOfQuestions', numberOfQuestions)
//     });

//   }

// }

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
/* jshint esversion: 11 */

const queryParams = {
    type: 'multiple',
    difficulty: 'easy',
    amount: 12
  };
  
  const queryString = Object.keys(queryParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
    .join('&');
  
  fetch(`https://trivia-api-jsmx.onrender.com/trivia?${queryString}`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
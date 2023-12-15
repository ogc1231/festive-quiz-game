/* jshint esversion: 11 */

const queryParams = {
    // takes type: multiple || boolean - omit for both
    type: 'multiple',
    // omit for any difficulty - easy || medium || difficult
    difficulty: 'easy',
    // omit for default which is 10
    amount: 12
  };
  
  const queryString = Object.keys(queryParams)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`)
    .join('&');
  
  fetch(`https://trivia-api-jsmx.onrender.com/trivia?${queryString}`)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
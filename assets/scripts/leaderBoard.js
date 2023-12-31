export async function fetchLeaderboard() {
  try {
    const response = await fetch(
      "https://holiday-trivia.onrender.com/leaderboard"
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }
}

async function displayLeaderboard() {
  let tableBody = document.getElementById("leaderboardTableBody");
  let htmlContent = "";
  const data = await fetchLeaderboard();

  if (data && data.length > 0) {
    data.forEach((score, index) => {
      htmlContent += `<tr>
                          <th scope="row">${index + 1}</th>
                          <td>${score.username}</td>
                          <td>${score.score}</td>
                        </tr>`;
    });
  } else {
    htmlContent = '<tr><td colspan="3">No data available</td></tr>';
  }

  tableBody.innerHTML = htmlContent;
}

displayLeaderboard();

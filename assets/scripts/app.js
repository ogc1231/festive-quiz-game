/* jshint esversion: 11 */

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

document.addEventListener("DOMContentLoaded", () => {
  // Function to open a modal
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.classList.add("body-fixed");
  };

  // Function to close a modal
  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.style.display = "none";
    document.body.style.paddingRight = `0px`;
    document.body.classList.remove("body-fixed");
  };

  // Event listeners for each team member's figure
  document.querySelectorAll(".effect-team").forEach((figure, index) => {
    figure.addEventListener("click", () => {
      const modalId =
        figure
          .querySelector("figcaption h2")
          .innerText.toLowerCase()
          .replace(/\s+/g, "") + "Modal";
      openModal(modalId);
    });
  });

  // Event listeners for closing modals
  document.querySelectorAll(".modal .close").forEach((closeBtn) => {
    closeBtn.addEventListener("click", () => {
      closeModal(closeBtn.closest(".modal").id);
    });
  });

  // Close modal if click outside of it
  window.addEventListener("click", (event) => {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (event.target == modal) {
        closeModal(modal.id);
      }
    });
  });
});

// Arrow-up
window.addEventListener("scroll", () => {
  const topLink = document.querySelector(".top-link");
  const icon = topLink.querySelector(".fa-gift");
  const scrollHeight = window.pageYOffset;

  if (scrollHeight > 300) {
    topLink.classList.add("show-link");
  } else {
    topLink.classList.remove("show-link");
  }
  // Remove 'fa-beat' class on hover
  topLink.addEventListener("mouseenter", () => {
    icon.classList.remove("fa-beat");
    icon.classList.add("fa-arrow-up");
  });
});

let trivia = [];

async function fetchTrivia() {
  const queryParams = { amount: 50 };
  const queryString = Object.keys(queryParams)
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}`
    )
    .join("&");

  try {
    const response = await fetch(
      `https://trivia-api-fe683df325a4.herokuapp.com/trivia?${queryString}`
    );
    const data = await response.json();

    if (data) {
      trivia = data.map((q) => ({ trivia: q.interesting_fact }));
      startTriviaUpdates();
    } else {
      throw new Error("No data received");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

let currentTriviaIndex = 0;

function updateTrivia() {
  const triviaElement = document.getElementById("trivia");
  if (!triviaElement || currentTriviaIndex >= trivia.length) return;

  triviaElement.classList.remove("animate__fadeIn");
  triviaElement.classList.add("animate__fadeOut");

  setTimeout(() => {
    const content = `<p style="font-family: var(--font-christmas);" class="p-3 mb-2 text-dark shadow-sm fs-3">${trivia[currentTriviaIndex].trivia}</p>`;
    triviaElement.innerHTML = content;
    currentTriviaIndex = (currentTriviaIndex + 1) % trivia.length;

    triviaElement.classList.remove("animate__fadeOut");
    triviaElement.classList.add("animate__fadeIn");
  }, 1000);
}

function startTriviaUpdates() {
  updateTrivia();
  setInterval(updateTrivia, 8000);
}

fetchTrivia();

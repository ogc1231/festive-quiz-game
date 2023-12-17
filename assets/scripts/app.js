/* jshint esversion: 11 */

// Modal
document.addEventListener('DOMContentLoaded', () => {
  // Function to open a modal
  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.style.display = 'block';
  };

  // Function to close a modal
  const closeModal = (modalId) => {
    const modal = document.getElementById(modalId);
    modal.style.display = 'none';
  };

  // Event listeners for each team member's figure
  document.querySelectorAll('.effect-team').forEach((figure, index) => {
    figure.addEventListener('click', () => {
      const modalId = figure.querySelector('figcaption h2').innerText.toLowerCase().replace(/\s+/g, '') + 'Modal';
      openModal(modalId);
    });
  });

  // Event listeners for closing modals
  document.querySelectorAll('.modal .close').forEach((closeBtn) => {
    closeBtn.addEventListener('click', () => {
      closeBtn.closest('.modal').style.display = 'none';
    });
  });

  // Close modal if click outside of it
  window.addEventListener('click', (event) => {
    document.querySelectorAll('.modal').forEach((modal) => {
      if (event.target == modal) {
        modal.style.display = 'none';
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


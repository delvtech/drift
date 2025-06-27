// Create a star field effect similar to the game
export function initStarField() {
  const starField = document.createElement("div");
  const pageWidth = document.body.scrollWidth;
  starField.className = "star-field";
  document.body.appendChild(starField);

  // Create initial stars
  for (let i = 0; i < 150; i++) {
    createStar(Math.random() * pageWidth);
  }

  // Create new stars at a regular interval
  setInterval(createStar, 400);

  function createStar(offset = 0) {
    const star = document.createElement("div");
    star.className = "star";

    // Random position
    star.style.top = `${Math.random() * 100}%`;
    star.style.right = `${offset - 2}px`;

    // Random size (1-2px)
    const size = 1 + Math.random();
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;

    // Animation duration (6-8 seconds)
    const speed = 0.2 + Math.random() * 0.2;
    const duration = 8 / speed;
    star.style.animation = `moveStar ${duration}s linear`;

    // Random opacity (0.3-0.8)
    star.style.opacity = `${0.3 + Math.random() * 0.5}`;

    starField.appendChild(star);

    // Remove star after animation
    star.addEventListener("animationend", () => {
      star.remove();
    });
  }
}

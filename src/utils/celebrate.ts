import confetti from "canvas-confetti";

export function celebrateGoalCompleted() {
  const duration = 1500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      origin: { x: 0 },
      colors: ["#818CF8", "#34D399", "#F59E0B"],
    });
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      origin: { x: 1 },
      colors: ["#818CF8", "#34D399", "#F59E0B"],
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}

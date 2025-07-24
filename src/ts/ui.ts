// ui.ts
// Работа с DOM

// Наша задача присвоить класс active
// правильному card элементу

export default function activeCard(systemCard: string): void {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    if (card.classList.contains(systemCard)) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
}

// main.ts

import isValidCardNumber from "./validator";
import { detectCardSystem } from "./cardDetector";
import activeCard from "./ui";

document.querySelector("#submitform")?.addEventListener("click", () => {
  const input = document.querySelector(
    "#credit-card-number",
  ) as HTMLInputElement;
  const value = input.value.trim();

  // Удаляем предыдущие сообщения об ошибках
  const existingError = document.querySelector(".error-message");
  if (existingError) {
    existingError.remove();
  }

  const valid = isValidCardNumber(value);
  const cardSystem = detectCardSystem(value);

  if (valid) {
    activeCard(cardSystem);
    input.style.borderColor = "green";
  } else {
    input.style.borderColor = "red";
    const activeClass = document.querySelector(
      ".card.active",
    ) as HTMLSpanElement;
    if (activeClass) activeClass.classList.remove("active");
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("error-message");
    errorDiv.textContent = "Введен неверный номер карты, валидацию не прошел.";
    input.insertAdjacentElement("afterend", errorDiv);
  }

  console.log(valid);
  console.log(cardSystem);
});

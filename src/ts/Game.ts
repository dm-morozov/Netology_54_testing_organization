// Game.ts

import goblinImg from "../img/goblin.png";

export default class Game {
  private readonly size: number;
  private lastIndex: number | null = null;
  private goblinVisionTimerId: number | null = null;

  private score: number = 0;
  private misses: number = 0;

  constructor(size: number = 4) {
    console.log("Game initialized");
    if (size <= 3) size = 4;
    if (size > 10) size = 10;
    this.size = size;
  }

  public start(): void {
    this.renderField();
    this.goblin();
    this.score = 0;
    this.misses = 0;

    this.goblinVisionTimerId = window.setInterval(() => {
      const findGoblin = document.querySelector(".goblin");
      if (findGoblin) this.misses++;
      this.goblin();
      const missesNumber = document.querySelector(".misses__number");
      if (missesNumber) {
        missesNumber.textContent = String(this.misses);
      }
      if (this.misses >= 5) {
        this.stop();
        alert("Конец игры. Набранные баллы: " + this.score);
        this.start();
      }
    }, 1000);

    const missesNumber = document.querySelector(".misses__number");
    if (missesNumber) {
      missesNumber.textContent = String(this.misses);
    }
    const scopeNumber = document.querySelector(".scope__number");
    if (scopeNumber) {
      scopeNumber.textContent = String(this.score);
    }
    this.punchTheGoblin();
  }

  public stop(): void {
    clearInterval(this.goblinVisionTimerId!);
  }

  private renderField(): void {
    const container = document.querySelector("#game-container");
    container?.classList.add("game-container");

    if (container) container.innerHTML = "";
    // console.log(container);
    let num: number = 1;
    for (let row = 0; row <= this.size - 1; row++) {
      const rowEl = document.createElement("div");
      rowEl.classList.add("row");

      for (let col = 0; col <= this.size - 1; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.classList.add("num-" + num++);
        rowEl.appendChild(cell);
      }

      container?.appendChild(rowEl);
    }

    const btnStop = document.createElement("input");
    btnStop.type = "button";
    btnStop.value = "Стоп";
    btnStop.classList.add("btn", "btn-stop");
    btnStop.addEventListener("click", () => {
      if (btnStop.value === "Стоп") {
        this.stop();
        btnStop.value = "Старт";
      } else {
        this.start();
        btnStop.value = "Стоп";
      }
    });
    container?.appendChild(btnStop);
  }

  private goblin(): void {
    const findGoblin = document.querySelector(".goblin");
    if (findGoblin) {
      findGoblin.removeAttribute("style");
      findGoblin.classList.remove("goblin");
    }
    let randomIndex: number;
    do {
      randomIndex = Math.floor(Math.random() * this.size * this.size) + 1;
    } while (randomIndex === this.lastIndex);

    this.lastIndex = randomIndex;
    const attackCell = document.querySelector(".num-" + randomIndex);
    attackCell?.classList.add("goblin");
    attackCell?.setAttribute(
      "style",
      `background: url(${goblinImg}) center/cover no-repeat`,
    );
    // console.log(attackCell);
  }

  private punchTheGoblin(): void {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        if (cell.classList.contains("goblin")) {
          this.score++;
          cell.classList.remove("goblin");
          cell.removeAttribute("style");
          const scopeNumber = document.querySelector(".scope__number");
          if (scopeNumber) {
            scopeNumber.textContent = String(this.score);
          }
        } else {
          this.misses++;
          if (this.misses >= 5) {
            this.stop();
            alert("Конец игры. Набранные баллы: " + this.score);
            this.start();
          }
          const missesNumber = document.querySelector(".misses__number");
          if (missesNumber) {
            missesNumber.textContent = String(this.misses);
          }
        }
      });
    });
  }
}

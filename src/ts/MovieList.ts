// Movie.ts

import { Movie } from "./interface";

export default class MovieList {
  private movieData: Array<Movie>;
  private container: HTMLElement | null;
  private sortAscending: boolean = true;
  // Массив для сортировки
  private sortCycle: Array<{ key: keyof Movie; direction: "asc" | "desc" }> =
    [];
  private sortIndex: number = 0; // текущая позиция в sortCycle

  constructor(movieData: Array<Movie>) {
    this.movieData = movieData;
    console.log(this.movieData);

    // Хочу предположительно собрать массив ключ + направление,
    // чтобы потом зацикленно по нему сортировать наш массив с фильмами

    // Тут просто массив ключей ["id", "title", "imdb", "year"]
    const keys: Array<keyof Movie> = Object.keys(this.movieData[0]) as Array<
      keyof Movie
    >;
    // Собираем массив ключей и направлений сортировки - sortCycle
    for (const key of keys) {
      this.sortCycle.push({ key, direction: "asc" });
      this.sortCycle.push({ key, direction: "desc" });
    }
    console.log(this.sortCycle);

    const container = document.querySelector(
      "#table-movie-sorted",
    ) as HTMLElement | null;
    this.container = container;

    setInterval(() => {
      this.sortData();
      this.renderTable();
    }, 2000);
  }

  private sortData(): void {
    const { key, direction } = this.sortCycle[this.sortIndex];

    this.movieData.sort((a, b) => {
      // Подготовим данные для сортировки методом sort
      const aValue = a[key]; // a.id
      const bValue = b[key]; // b.id

      // Так как сортировка для чисел и для строк происходит по разному,
      // нам нужно создать условие

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      // В противном случае это строка и нужно добавить метод localeCompare
      return direction === "asc"
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

    // Теперь нужно добавить логику для изменения индекса сортировки
    this.sortIndex = (this.sortIndex + 1) % this.sortCycle.length;
  }

  public renderTable(): void {
    if (this.container) {
      // Обязательно очищаем контейнер
      this.container.innerHTML = "";

      // Создаем таблицу, заголовки и тело
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");

      table.classList.add("movie-table");
      if (this.movieData.length === 0) return;
      const headerTitle = Object.keys(this.movieData[0]) as Array<keyof Movie>; // ['id', 'title', 'imdb', 'year']
      // console.log(headerTitle);

      // Заголовок
      const headerRow = document.createElement("tr");
      headerTitle.forEach((title) => {
        const headerCell = document.createElement("th");
        headerCell.setAttribute("scope", "col");
        headerCell.textContent = title.toUpperCase();

        // Тут еще добавляем стрелочки
        // в зависимости от сортировки ключа в sortCycle и sortIndex

        // Обнаружена проблема, задержка на одну итерацию из-за sortData()
        // нужно получить предыдущее значение sortIndex
        const prevSortIndex =
          (this.sortIndex - 1 + this.sortCycle.length) % this.sortCycle.length;
        const currentSort = this.sortCycle[prevSortIndex];
        if (currentSort.key === title) {
          const arrow = document.createElement("span");
          arrow.textContent = currentSort.direction === "asc" ? " ▲" : " ▼";
          headerCell.appendChild(arrow);
        }

        headerRow.appendChild(headerCell);
      });
      thead.appendChild(headerRow);
      for (const item of this.movieData) {
        // console.log(item);
        const descriptionRow = document.createElement("tr");
        for (const key of headerTitle) {
          // console.log(item[key as keyof Movie]);
          const cell = document.createElement("td");

          // От нас требуют некоторого оформления
          // для выводимых данных. Применим их в зависимости от ключа

          if (key === "imdb") {
            cell.textContent = `imdb: ${Number(item[key]).toFixed(2)}`;
          } else if (key === "year") {
            cell.textContent = `(${item[key]})`;
          } else if (key === "id") {
            cell.textContent = `#${item[key]}`;
          } else {
            cell.textContent = String(item[key]);
          }

          // cell.textContent = String(item[key as keyof Movie]);
          descriptionRow.appendChild(cell);
          descriptionRow.dataset[key] = String(item[key as keyof Movie]);
        }
        tbody.appendChild(descriptionRow);
      }
      table.appendChild(thead);
      table.appendChild(tbody);
      this.container.appendChild(table);
    }
  }
}

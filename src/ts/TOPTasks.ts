import { ITask } from "./interface";

export default class Tasks {
  private tasksData: Array<ITask> = [];
  private input: HTMLInputElement | null;
  private pinnedTasksContainer: HTMLElement | null;
  private allTasksContainer: HTMLElement | null;

  constructor() {
    this.input = document.querySelector("#description__top-tasks");
    this.pinnedTasksContainer = document.querySelector(
      ".pinned-tasks__top-tasks",
    );
    this.allTasksContainer = document.querySelector(".all-tasks__top-tasks");

    this.loadFromStorage();

    this.input?.addEventListener("input", () => this.render());
    this.input?.addEventListener("keypress", (event: KeyboardEvent) => {
      if (event.key === "Enter") this.addTask();
    });

    this.render();
  }

  private loadFromStorage() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      this.tasksData = JSON.parse(saved);
    } else {
      this.tasksData = [];
    }
  }

  private saveToStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasksData));
  }

  addTask() {
    const title = this.input?.value.trim();
    if (!title) {
      // Показать ошибку под инпутом (без alert и console)
      this.showError("Введите название задачи");
      return;
    }

    this.clearError();

    const newTask: ITask = {
      id: Date.now(),
      title,
      pinned: false,
    };

    this.tasksData.push(newTask);
    this.saveToStorage();
    this.input!.value = "";
    this.render();
  }

  render() {
    if (!this.pinnedTasksContainer || !this.allTasksContainer) return;

    this.pinnedTasksContainer.innerHTML = "";
    this.allTasksContainer.innerHTML = "";

    const filter = this.input?.value.trim().toLowerCase() || "";

    const pinnedTasks = this.tasksData.filter((task) => task.pinned);
    const unpinnedTasks = this.tasksData.filter((task) => !task.pinned);

    // Pinned
    if (pinnedTasks.length === 0) {
      this.pinnedTasksContainer.textContent = "No pinned tasks";
    } else {
      pinnedTasks.forEach((task) => {
        const taskEl = this.createTaskElement(task);
        this.pinnedTasksContainer?.appendChild(taskEl);
      });
    }

    // All Tasks (фильтрация)
    const filteredTasks = filter
      ? unpinnedTasks.filter((task) =>
          task.title.toLowerCase().startsWith(filter),
        )
      : unpinnedTasks;

    if (filteredTasks.length === 0) {
      this.allTasksContainer.textContent = "No tasks found";
    } else {
      filteredTasks.forEach((task) => {
        const taskEl = this.createTaskElement(task);
        this.allTasksContainer?.appendChild(taskEl);
      });
    }
  }

  private createTaskElement(task: ITask): HTMLElement {
    const container = document.createElement("div");
    container.classList.add("task");

    const title = document.createElement("span");
    title.textContent = task.title;

    // Создаём контейнер для кнопок
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("task-buttons");

    // Кнопка Pin / Unpin
    const togglePin = document.createElement("button");
    togglePin.innerHTML = task.pinned ? "📌" : "📍";
    togglePin.title = task.pinned ? "Unpin" : "Pin";
    togglePin.addEventListener("click", () => {
      task.pinned = !task.pinned;
      this.saveToStorage();
      this.render();
    });

    // Кнопка Delete
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "❌";
    deleteBtn.title = "Удалить задачу";
    deleteBtn.addEventListener("click", () => {
      this.deleteTask(task.id);
    });

    // Добавляем кнопки в контейнер
    buttonsContainer.appendChild(togglePin);
    buttonsContainer.appendChild(deleteBtn);

    // Добавляем элементы в главный блок
    container.appendChild(title);
    container.appendChild(buttonsContainer);

    return container;
  }

  private deleteTask(id: number) {
    this.tasksData = this.tasksData.filter((task) => task.id !== id);
    this.saveToStorage();
    this.render();
  }

  private showError(message: string) {
    let errorEl = document.querySelector(".task-error") as HTMLDivElement;
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.className = "task-error";
      this.input?.after(errorEl);
    }
    errorEl.textContent = message;
    errorEl.style.color = "red";
    errorEl.style.fontSize = "14px";
    errorEl.style.marginTop = "5px";
  }

  private clearError() {
    const errorEl = document.querySelector(".task-error");
    if (errorEl) errorEl.remove();
  }
}

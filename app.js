const STORAGE_KEY = "focusboard-tasks";
const THEME_KEY = "focusboard-theme";

const state = {
  tasks: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
  filter: "all",
};

const elements = {
  form: document.querySelector("#task-form"),
  input: document.querySelector("#task-input"),
  priority: document.querySelector("#priority-input"),
  list: document.querySelector("#task-list"),
  empty: document.querySelector("#empty-state"),
  allCount: document.querySelector("#all-count"),
  remaining: document.querySelector("#remaining-label"),
  ring: document.querySelector("#progress-ring"),
  progressValue: document.querySelector("#progress-value"),
  progressTitle: document.querySelector("#progress-title"),
  progressCopy: document.querySelector("#progress-copy"),
  theme: document.querySelector("#theme-toggle"),
};

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.tasks));
}

function visibleTasks() {
  if (state.filter === "active") return state.tasks.filter((task) => !task.done);
  if (state.filter === "done") return state.tasks.filter((task) => task.done);
  return state.tasks;
}

function render() {
  const tasks = visibleTasks();
  elements.list.replaceChildren(...tasks.map(taskElement));
  elements.empty.classList.toggle("hidden", tasks.length > 0);
  elements.allCount.textContent = state.tasks.length;

  const done = state.tasks.filter((task) => task.done).length;
  const remaining = state.tasks.length - done;
  const percent = state.tasks.length ? Math.round((done / state.tasks.length) * 100) : 0;
  elements.remaining.textContent = `${remaining} task${remaining === 1 ? "" : "s"} remaining`;
  elements.progressValue.textContent = `${percent}%`;
  elements.ring.style.setProperty("--progress", `${percent * 3.6}deg`);
  elements.progressTitle.textContent = percent === 100 && state.tasks.length ? "Nicely done" : percent > 0 ? "Good momentum" : "Fresh start";
  elements.progressCopy.textContent = state.tasks.length ? `${done} of ${state.tasks.length} completed` : "Add your first task";
}

function taskElement(task) {
  const item = document.createElement("li");
  item.className = `task${task.done ? " done" : ""}`;

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "check";
  checkbox.checked = task.done;
  checkbox.setAttribute("aria-label", `Mark ${task.title} as ${task.done ? "active" : "done"}`);
  checkbox.addEventListener("change", () => updateTask(task.id, { done: checkbox.checked }));

  const title = document.createElement("span");
  title.className = "task-title";
  title.textContent = task.title;

  const priority = document.createElement("span");
  priority.className = `priority ${task.priority}`;
  priority.textContent = task.priority;

  const remove = document.createElement("button");
  remove.className = "delete";
  remove.textContent = "×";
  remove.setAttribute("aria-label", `Delete ${task.title}`);
  remove.addEventListener("click", () => deleteTask(task.id));

  item.append(checkbox, title, priority, remove);
  return item;
}

function updateTask(id, changes) {
  state.tasks = state.tasks.map((task) => task.id === id ? { ...task, ...changes } : task);
  save();
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter((task) => task.id !== id);
  save();
  render();
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = elements.input.value.trim();
  if (!title) return;
  state.tasks.unshift({ id: crypto.randomUUID(), title, priority: elements.priority.value, done: false });
  save();
  elements.form.reset();
  elements.input.focus();
  render();
});

document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => {
  state.filter = tab.dataset.filter;
  document.querySelectorAll(".tab").forEach((candidate) => candidate.classList.toggle("active", candidate === tab));
  render();
}));

document.querySelector("#clear-done").addEventListener("click", () => {
  state.tasks = state.tasks.filter((task) => !task.done);
  save();
  render();
});

elements.theme.addEventListener("click", () => {
  const isDark = document.documentElement.classList.toggle("dark");
  elements.theme.textContent = isDark ? "☀" : "☾";
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
const dark = localStorage.getItem(THEME_KEY) === "dark" || (!localStorage.getItem(THEME_KEY) && prefersDark);
document.documentElement.classList.toggle("dark", dark);
elements.theme.textContent = dark ? "☀" : "☾";
document.querySelector("#date-label").textContent = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js"));
}

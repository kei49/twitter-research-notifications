import { LocalStorage } from "node-localstorage";

import { taskIds, TaskId } from "../config";

export default class TaskLocalStorage {
  localStorage;
  taskId: TaskId;

  constructor(taskId: TaskId) {
    this.localStorage = new LocalStorage("./data/localStorage");
    this.taskId = taskId;
  }

  get(id: string): string | undefined {
    const data = this.localStorage.getItem(this.taskId + id);
    return data ? data : undefined;
  }

  set(id: string, data: string) {
    this.localStorage.setItem(this.taskId + id, data);
  }

  remove(id: string) {
    this.localStorage.removeItem(id);
  }
}

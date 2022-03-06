import { LocalStorage } from "node-localstorage";

import { taskIds, TaskId } from "../config";

export default class TaskLocalStorage {
  localStorage;
  taskId: TaskId;

  constructor(taskId: TaskId) {
    this.localStorage = new LocalStorage("./data/localStorage");
    this.taskId = taskId;
  }

  get(id: string) {
    return this.localStorage.getItem(this.taskId + id);
  }

  set(id: string, data: string) {
    this.localStorage.setItem(this.taskId + id, data);
  }

}

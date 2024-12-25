import { getTasks, addTask } from "./task.js";

const tasks = getTasks();

console.log(tasks);

addTask("昼寝をする");

console.log(getTasks());

import { v4 as uuidv4 } from "uuid";

const taskStatus = Object.freeze({
    PENDING: "pending",
    ACTIVE: "active",
    COMPLETED: "completed",
});

const allTasks = [
    { id: uuidv4(), title: "牛乳を買う", status: taskStatus.PENDING },
    { id: uuidv4(), title: "大福を食べる", status: taskStatus.ACTIVE },
    { id: uuidv4(), title: "猫を洗う", status: taskStatus.COMPLETED },
];

// 完了以外のタスクを取得する
export function getTasks() {
    const notCompleteTasks = allTasks.filter(
        (task) => task.status !== taskStatus.COMPLETED
    );
    return notCompleteTasks;
}

// 全てのタスクを取得する
export function getAllTasks() {
    return allTasks;
}

// タスクを追加する
export function addTask(newTaskTitle) {
    const newTask = {
        id: uuidv4(),
        title: newTaskTitle,
        status: taskStatus.PENDING,
    };
    allTasks.push(newTask);
    return newTask;
}

// タスクのステータスを更新する
export function updateTaskStatus(targetTaskId, newStatus) {
    const targetTask = allTasks.find((task) => task.id === targetTaskId);
    if (!targetTask) {
        return null;
    }
    targetTask.status = newStatus;
    return targetTask;
}

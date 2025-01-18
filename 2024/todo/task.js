const uuid = () => crypto.randomUUID();

const taskStatus = Object.freeze({
    PENDING: "pending",
    ACTIVE: "active",
    COMPLETED: "completed",
});

const allTasks = [
    { id: uuid(), title: "牛乳を買う", status: taskStatus.PENDING },
    { id: uuid(), title: "大福を食べる", status: taskStatus.ACTIVE },
    { id: uuid(), title: "猫を洗う", status: taskStatus.COMPLETED },
];

// 完了以外のタスクを取得する
function getTasks() {
    const notCompleteTasks = allTasks.filter(
        (task) => task.status !== taskStatus.COMPLETED
    );
    return notCompleteTasks;
}

// 全てのタスクを取得する
function getAllTasks() {
    return allTasks;
}

// タスクを追加する
function addTask(newTaskTitle) {
    const newTask = {
        id: uuid(),
        title: newTaskTitle,
        status: taskStatus.PENDING,
    };
    allTasks.push(newTask);
    return newTask;
}

// タスクのステータスを更新する
function updateTaskStatus(targetTaskId, newStatus) {
    const targetTask = allTasks.find((task) => task.id === targetTaskId);
    if (!targetTask) {
        return null;
    }
    targetTask.status = newStatus;
    return targetTask;
}

// 使用例
console.log(getTasks());

addTask("昼寝をする");
console.log(getTasks());

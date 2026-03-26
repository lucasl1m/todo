import { useLocalStorage } from "usehooks-ts";
import { type Task, TASK_STATE, TASKS_KEY } from "../models/task";

export default function useTasks() {
  const [tasks] = useLocalStorage<Task[]>(TASKS_KEY, []);

  return {
    tasks,
    createdTasksCount: tasks.filter((task) => task.state === TASK_STATE.CREATED)
      .length,
    concludedTasksCount: tasks.filter((task) => task.concluded).length,
  };
}

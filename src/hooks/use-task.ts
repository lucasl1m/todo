import { useLocalStorage } from "usehooks-ts";
import { type Task, TASK_STATE, TASKS_KEY } from "../models/task";

export default function useTask() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(TASKS_KEY, []);

  function prepareTask() {
    setTasks([
      ...tasks,
      {
        id: Math.random().toString(36).substring(2, 9),
        title: "",
        state: TASK_STATE.CREATING,
      },
    ]);
  }

  function updateTask(id: string, payload: { title: Task["title"] }) {
    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, state: TASK_STATE.CREATED, ...payload }
          : task,
      ),
    );
  }

  function updateTaskStatus(id: string, concluded: Task["concluded"]) {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, concluded } : task)),
    );
  }

  function deleteTask(id: string) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  return {
    tasks,
    prepareTask,
    updateTask,
    updateTaskStatus,
    deleteTask,
  };
}

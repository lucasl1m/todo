import Plus from "../../assets/icons/plus.svg?react";
import useTasks from "../../hooks/use-tasks";
import useTask from "../../hooks/use-task";
import Button from "../button";
import TaskItem from "./task-item";
import { TASK_STATE } from "../../models/task";

export default function TaskList() {
  const { tasks } = useTasks();
  const { prepareTask } = useTask();

  function handleCreateTask() {
    prepareTask();
  }

  return (
    <>
      <section>
        <Button
          icon={Plus}
          className="w-full"
          disabled={tasks.some((t) => t.state === TASK_STATE.CREATING)}
          onClick={handleCreateTask}
        >
          Nova tarefa
        </Button>
      </section>
      <section className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </section>
    </>
  );
}

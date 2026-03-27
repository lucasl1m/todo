import Plus from "../../assets/icons/plus.svg?react";
import Button from "../button";
import TaskItem from "./task-item";
import { TASK_STATE } from "../../models/task";
import Skeleton from "../skeleton";
import { useTasksContext } from "../../contexts/tasks-context";

export default function TaskList() {
  const { tasks, isLoading, prepareTask } = useTasksContext();

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
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-16 w-full rounded-lg" />
            ))
          : tasks.map((task) => <TaskItem key={task.id} task={task} />)}
      </section>
    </>
  );
}

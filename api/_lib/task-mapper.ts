import type { Task as PrismaTask } from "@prisma/client";
import { TASK_STATE, type Task } from "../../src/models/task";

export function mapTask(task: PrismaTask): Task {
  return {
    id: task.id,
    title: task.title,
    concluded: task.concluded,
    state: TASK_STATE.CREATED,
  };
}

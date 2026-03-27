import { type Task, TASK_STATE } from "../models/task";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Erro ao processar requisicao");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

function withCreatedState(task: Omit<Task, "state">): Task {
  return {
    ...task,
    state: TASK_STATE.CREATED,
  };
}

export async function listTasks() {
  const tasks = await request<Omit<Task, "state">[]>("/tasks", {
    method: "GET",
  });

  return tasks.map(withCreatedState);
}

export async function createTask(payload: { title: string }) {
  const task = await request<Omit<Task, "state">>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return withCreatedState(task);
}

export async function updateTaskById(id: string, payload: Partial<Pick<Task, "title" | "concluded">>) {
  const task = await request<Omit<Task, "state">>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return withCreatedState(task);
}

export async function deleteTaskById(id: string) {
  await request<void>(`/tasks/${id}`, {
    method: "DELETE",
  });
}

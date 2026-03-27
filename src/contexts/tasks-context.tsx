import React from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { type Task, TASK_STATE } from "../models/task";
import {
  createTask,
  deleteTaskById,
  listTasks,
  updateTaskById,
} from "../services/tasks-api";

interface TasksContextValue {
  tasks: Task[];
  isLoading: boolean;
  isTaskUpdating: (id: string) => boolean;
  prepareTask: () => void;
  updateTask: (id: string, payload: { title: Task["title"] }) => Promise<void>;
  updateTaskStatus: (id: string, concluded: Task["concluded"]) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  createdTasksCount: number;
  concludedTasksCount: number;
}

const TasksContext = React.createContext<TasksContextValue | null>(null);
const TASKS_QUERY_KEY = ["tasks"];

interface PendingDelete {
  task: Task;
  index: number;
  timeoutId: ReturnType<typeof setTimeout>;
}

function randomId() {
  return Math.random().toString(36).substring(2, 9);
}

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [draftTasks, setDraftTasks] = React.useState<Task[]>([]);
  const [updatingTaskIds, setUpdatingTaskIds] = React.useState<Set<string>>(new Set());
  const [pendingDeleteTaskIds, setPendingDeleteTaskIds] = React.useState<Set<string>>(new Set());
  const pendingDeletesRef = React.useRef<Map<string, PendingDelete>>(new Map());

  const tasksQuery = useQuery({
    queryKey: TASKS_QUERY_KEY,
    queryFn: listTasks,
    retry: 1,
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Pick<Task, "title" | "concluded">> }) =>
      updateTaskById(id, payload),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTaskById,
  });

  const notifyRequestError = React.useCallback((fallbackMessage: string, error: unknown) => {
    const message =
      error instanceof Error && error.message.trim().length > 0
        ? error.message
        : fallbackMessage;

    toast.error(message, { position: "top-right" });
  }, []);

  const startUpdatingTask = React.useCallback((id: string) => {
    setUpdatingTaskIds((current) => new Set(current).add(id));
  }, []);

  const finishUpdatingTask = React.useCallback((id: string) => {
    setUpdatingTaskIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }, []);

  const isTaskUpdating = React.useCallback(
    (id: string) => updatingTaskIds.has(id),
    [updatingTaskIds],
  );

  const serverTasks = React.useMemo(() => tasksQuery.data ?? [], [tasksQuery.data]);
  const visibleServerTasks = React.useMemo(
    () => serverTasks.filter((task) => !pendingDeleteTaskIds.has(task.id)),
    [pendingDeleteTaskIds, serverTasks],
  );
  const tasks = React.useMemo(
    () => [...draftTasks, ...visibleServerTasks],
    [draftTasks, visibleServerTasks],
  );

  const restoreDeletedTask = React.useCallback((task: Task, index: number) => {
    setPendingDeleteTaskIds((current) => {
      const next = new Set(current);
      next.delete(task.id);
      return next;
    });

    queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (currentTasks = []) => {
      if (currentTasks.some((currentTask) => currentTask.id === task.id)) {
        return currentTasks;
      }

      const next = [...currentTasks];
      const safeIndex = Math.max(0, Math.min(index, next.length));
      next.splice(safeIndex, 0, task);
      return next;
    });
  }, [queryClient]);

  const undoDeleteTask = React.useCallback(
    (id: string) => {
      const pending = pendingDeletesRef.current.get(id);

      if (!pending) {
        return;
      }

      clearTimeout(pending.timeoutId);
      pendingDeletesRef.current.delete(id);
      restoreDeletedTask(pending.task, pending.index);
      toast.success("Remocao desfeita", { position: "bottom-right" });
    },
    [restoreDeletedTask],
  );

  React.useEffect(() => {
    const pendingDeletes = pendingDeletesRef.current;

    return () => {
      pendingDeletes.forEach((pendingDelete) => {
        clearTimeout(pendingDelete.timeoutId);
      });
    };
  }, []);

  React.useEffect(() => {
    if (tasksQuery.error) {
      console.error("Failed to load tasks", tasksQuery.error);
      notifyRequestError("Nao foi possivel carregar tarefas", tasksQuery.error);
    }
  }, [notifyRequestError, tasksQuery.error]);

  const prepareTask = React.useCallback(() => {
    setDraftTasks((currentTasks) => [
      ...currentTasks,
      {
        id: randomId(),
        title: "",
        concluded: false,
        state: TASK_STATE.CREATING,
      },
    ]);
  }, []);

  const updateTask = React.useCallback(
    async (id: string, payload: { title: Task["title"] }) => {
      const target = tasks.find((task) => task.id === id);

      if (!target) {
        return;
      }

      startUpdatingTask(id);

      try {
        if (target.state === TASK_STATE.CREATING) {
          const createdTask = await createTaskMutation.mutateAsync({ title: payload.title });
          setDraftTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
          queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (currentTasks = []) =>
            [createdTask, ...currentTasks],
          );
          toast.success("Tarefa criada com sucesso", { position: "top-right" });
          return;
        }

        const updatedTask = await updateTaskMutation.mutateAsync({
          id,
          payload: { title: payload.title },
        });
        queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (currentTasks = []) =>
          currentTasks.map((task) => (task.id === id ? updatedTask : task)),
        );
        toast.success("Tarefa atualizada com sucesso", { position: "top-right" });
      } catch (error) {
        console.error("Failed to update task", error);
        notifyRequestError("Nao foi possivel atualizar a tarefa", error);
      } finally {
        finishUpdatingTask(id);
      }
    },
    [
      createTaskMutation,
      finishUpdatingTask,
      notifyRequestError,
      queryClient,
      startUpdatingTask,
      tasks,
      updateTaskMutation,
    ],
  );

  const updateTaskStatus = React.useCallback(
    async (id: string, concluded: Task["concluded"]) => {
      startUpdatingTask(id);

      try {
        const updatedTask = await updateTaskMutation.mutateAsync({
          id,
          payload: { concluded },
        });
        queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (currentTasks = []) =>
          currentTasks.map((task) => (task.id === id ? updatedTask : task)),
        );
      } catch (error) {
        console.error("Failed to update task status", error);
        notifyRequestError("Nao foi possivel atualizar o status da tarefa", error);
      } finally {
        finishUpdatingTask(id);
      }
    },
    [finishUpdatingTask, notifyRequestError, queryClient, startUpdatingTask, updateTaskMutation],
  );

  const deleteTask = React.useCallback(
    async (id: string) => {
      const target = tasks.find((task) => task.id === id);

      if (!target) {
        return;
      }

      if (target.state === TASK_STATE.CREATING) {
        setDraftTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
        return;
      }

      const deletedTaskIndex = serverTasks.findIndex((task) => task.id === id);
      setPendingDeleteTaskIds((current) => new Set(current).add(id));

      const timeoutId = setTimeout(async () => {
        try {
          await deleteTaskMutation.mutateAsync(id);
          queryClient.setQueryData<Task[]>(TASKS_QUERY_KEY, (currentTasks = []) =>
            currentTasks.filter((task) => task.id !== id),
          );
        } catch (error) {
          console.error("Failed to delete task", error);
          const pending = pendingDeletesRef.current.get(id);

          if (pending) {
            restoreDeletedTask(pending.task, pending.index);
          }

          notifyRequestError("Nao foi possivel remover a tarefa", error);
        } finally {
          pendingDeletesRef.current.delete(id);
        }
      }, 5000);

      pendingDeletesRef.current.set(id, {
        task: target,
        index: deletedTaskIndex,
        timeoutId,
      });

      toast("Tarefa removida", {
        id: `delete-${id}`,
        position: "bottom-right",
        duration: 5000,
        action: {
          label: "Desfazer",
          onClick: () => {
            undoDeleteTask(id);
          },
        },
      });
    },
    [deleteTaskMutation, notifyRequestError, queryClient, restoreDeletedTask, serverTasks, tasks, undoDeleteTask],
  );

  const createdTasksCount = React.useMemo(
    () => tasks.filter((task) => task.state === TASK_STATE.CREATED).length,
    [tasks],
  );

  const concludedTasksCount = React.useMemo(
    () => tasks.filter((task) => task.concluded).length,
    [tasks],
  );

  const value = React.useMemo<TasksContextValue>(
    () => ({
      tasks,
      isLoading: tasksQuery.isLoading,
      isTaskUpdating,
      prepareTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
      createdTasksCount,
      concludedTasksCount,
    }),
    [
      tasks,
      tasksQuery.isLoading,
      isTaskUpdating,
      prepareTask,
      updateTask,
      updateTaskStatus,
      deleteTask,
      createdTasksCount,
      concludedTasksCount,
    ],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}

export function useTasksContext() {
  const context = React.useContext(TasksContext);

  if (!context) {
    throw new Error("useTasksContext must be used inside TasksProvider");
  }

  return context;
}

import React from "react";

import ButtonIcon from "../button-icon";
import Card from "../card";
import Checkbox from "../checkbox";
import Text from "../text";

import Trash from "../../assets/icons/trash.svg?react";
import Pencil from "../../assets/icons/pencil.svg?react";
import X from "../../assets/icons/x.svg?react";
import Check from "../../assets/icons/check.svg?react";
import InputText from "../input";
import { TASK_STATE, type Task } from "../../models/task";
import { cx } from "class-variance-authority";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useTask from "../../hooks/use-task";

interface TaskItemProps {
  task: Task;
}

export default function TaskItem({ task }: TaskItemProps) {
  const { updateTask, updateTaskStatus, deleteTask } = useTask();

  const [isEditing, setIsEditing] = React.useState(
    task.state === TASK_STATE.CREATING,
  );

  const schema = z.object({
    title: z.string().min(1, "O título é obrigatório"),
  });

  type FormValues = z.infer<typeof schema>;

  const { setValue, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: task.title,
    },
  });

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleExitEditMode = () => {
    if (task.state === TASK_STATE.CREATING) {
      deleteTask(task.id);
    }

    setIsEditing(false);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue("title", event.target.value);
  };

  const handleChangedTaskStatus = () => {
    updateTaskStatus(task.id, !task.concluded);
  };

  const handleSaveTask = (data: FormValues) => {
    updateTask(task.id, { title: data.title });
    setIsEditing(false);
  };

  return (
    <Card size="md" className="flex items-center gap-4">
      {!isEditing ? (
        <>
          <Checkbox
            value={task?.concluded?.toString()}
            checked={task.concluded}
            onChange={handleChangedTaskStatus}
          />
          <Text className={cx("flex-1", task.concluded && "line-through")}>
            {task.title}
          </Text>
          <div className="flex gap-1">
            <ButtonIcon
              icon={Trash}
              variant="tertiary"
              onClick={() => deleteTask(task.id)}
            />
            <ButtonIcon
              icon={Pencil}
              variant="tertiary"
              onClick={handleEditClick}
            />
          </div>
        </>
      ) : (
        <form
          onSubmit={handleSubmit(handleSaveTask)}
          className="flex items-center gap-4 w-full"
        >
          <InputText
            defaultValue={task.title}
            className="flex-1"
            required
            autoFocus
            onChange={handleTextChange}
          />
          <div className="flex gap-1">
            <ButtonIcon
              type="button"
              icon={X}
              variant="secondary"
              onClick={handleExitEditMode}
            />
            <ButtonIcon type="submit" icon={Check} variant="primary" />
          </div>
        </form>
      )}
    </Card>
  );
}

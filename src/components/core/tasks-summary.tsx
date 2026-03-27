import Badge from "../badge";
import Skeleton from "../skeleton";
import Text from "../text";
import { useTasksContext } from "../../contexts/tasks-context";

export default function TasksSummary() {
  const { createdTasksCount, concludedTasksCount, isLoading } =
    useTasksContext();

  return (
    <>
      <div className="flex items-center gap-2">
        <Text variant="body-sm-bold" className="!text-gray-300">
          Tarefas criadas
        </Text>
        {isLoading ? (
          <Skeleton rounded="full" className="h-6 w-10" />
        ) : (
          <Badge variant="secondary">{createdTasksCount}</Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Text variant="body-sm-bold" className="!text-gray-300">
          Concluídas
        </Text>
        {isLoading ? (
          <Skeleton rounded="full" className="h-6 w-14" />
        ) : (
          <Badge variant="primary">
            {concludedTasksCount} de {createdTasksCount}
          </Badge>
        )}
      </div>
    </>
  );
}

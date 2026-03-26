import Container from "../components/container";
import TaskList from "../components/core/task-list";
import TasksSummary from "../components/core/tasks-summary";

export default function HomePage() {
  return (
    <Container as="article" className="space-y-3">
      <header className="flex items-center justify-between">
        <TasksSummary />
      </header>

      <TaskList />
    </Container>
  );
}

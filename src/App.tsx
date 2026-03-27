import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import PageComponents from "./pages/components";
import Layout from "./pages/layout";
import HomePage from "./pages/home";
import { TasksProvider } from "./contexts/tasks-context";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TasksProvider>
        <Toaster richColors position="top-right" closeButton />
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="/components" element={<PageComponents />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TasksProvider>
    </QueryClientProvider>
  );
}

export default App;

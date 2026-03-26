import { BrowserRouter, Route, Routes } from "react-router";
import PageComponents from "./pages/components";
import Layout from "./pages/layout";
import HomePage from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/components" element={<PageComponents />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

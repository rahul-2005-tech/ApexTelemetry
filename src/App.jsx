import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/layout/AppShell.jsx";
import { navigationItems } from "./app/navigation.js";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {navigationItems.map(({ path, element: Page }) => (
          <Route key={path} path={path} element={<Page />} />
        ))}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

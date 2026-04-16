import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div className="flex min-h-screen bg-surface-container-low">
      <Sidebar />
      <main className="flex-1 ml-68">
        <Outlet />
      </main>
    </div>
  );
}

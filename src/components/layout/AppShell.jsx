import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSidebarState } from "../../hooks/useSidebarState.js";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function AppShell() {
  const { collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile } =
    useSidebarState();

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen, closeMobile]);

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onToggleCollapsed={toggleCollapsed}
        onCloseMobile={closeMobile}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar onOpenMobile={openMobile} mobileOpen={mobileOpen} />
        <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

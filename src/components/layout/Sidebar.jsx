import { NavLink } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen, X } from "lucide-react";
import { navigationItems } from "../../app/navigation.js";
import Logo from "./Logo.jsx";

/**
 * Below `lg` the sidebar is an off-canvas drawer (`mobileOpen`).
 * From `lg` up it is sticky and can collapse to an icon rail (`collapsed`).
 */
export default function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapsed,
  onCloseMobile,
}) {
  // Labels stay visible in the mobile drawer; only the desktop rail hides them.
  const hideOnRail = collapsed ? "lg:hidden" : "";

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        id="app-sidebar"
        aria-label="Primary"
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:shrink-0 lg:translate-x-0 lg:transition-[width] ${
          collapsed ? "lg:w-[4.75rem]" : "lg:w-64"
        } ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`flex h-16 items-center justify-between border-b border-line px-4 ${
            collapsed ? "lg:justify-center" : ""
          }`}
        >
          <Logo showText={!collapsed || mobileOpen} />
          <button
            type="button"
            onClick={onCloseMobile}
            aria-label="Close navigation"
            className="rounded-md p-1.5 text-ink-muted hover:bg-surface-2 hover:text-ink lg:hidden"
          >
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {navigationItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              onClick={onCloseMobile}
              title={collapsed ? label : undefined}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  collapsed ? "lg:justify-center lg:px-0" : ""
                } ${
                  isActive
                    ? "bg-accent/10 text-ink"
                    : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute top-2 bottom-2 left-0 w-0.5 rounded-full bg-accent"
                    />
                  )}
                  <Icon
                    aria-hidden="true"
                    className={`size-5 shrink-0 ${isActive ? "text-accent" : ""}`}
                  />
                  <span className={`whitespace-nowrap ${hideOnRail}`}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-line p-3">
          <p
            className={`px-2 pb-3 text-[11px] leading-relaxed text-ink-dim ${hideOnRail}`}
          >
            Historical analysis only. No live timing.
          </p>
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-expanded={!collapsed}
            aria-controls="app-sidebar"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={`hidden w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-muted transition-colors hover:bg-surface-2 hover:text-ink lg:flex ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen aria-hidden="true" className="size-5" />
            ) : (
              <PanelLeftClose aria-hidden="true" className="size-5" />
            )}
            <span className={hideOnRail}>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
}

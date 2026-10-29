import { useCallback, useState } from "react";

const STORAGE_KEY = "apextelemetry.sidebar.collapsed";

function readStoredCollapsed() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * - `collapsed`: desktop icon-only mode, persisted in localStorage.
 * - `mobileOpen`: off-canvas drawer below the `lg` breakpoint, not persisted.
 */
export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(readStoredCollapsed);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((current) => {
      const next = !current;
      try {
        localStorage.setItem(STORAGE_KEY, String(next));
      } catch {
        // Storage may be unavailable (private mode); the preference just won't persist.
      }
      return next;
    });
  }, []);

  const openMobile = useCallback(() => setMobileOpen(true), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return { collapsed, toggleCollapsed, mobileOpen, openMobile, closeMobile };
}

import { History, Menu } from "lucide-react";
import Badge from "../ui/Badge.jsx";
import Logo from "./Logo.jsx";

export default function Topbar({ onOpenMobile, mobileOpen }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-line bg-base/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
          aria-controls="app-sidebar"
          className="rounded-md p-2 text-ink-muted hover:bg-surface-2 hover:text-ink lg:hidden"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
        <div className="lg:hidden">
          <Logo />
        </div>
      </div>

      <Badge tone="neutral" title="ApexTelemetry analyses past races only.">
        <History aria-hidden="true" className="size-3.5" />
        <span className="hidden sm:inline">Historical data · Not live timing</span>
        <span className="sm:hidden">Historical</span>
      </Badge>
    </header>
  );
}

import { AlertTriangle, RotateCw } from "lucide-react";
import EmptyState from "./EmptyState.jsx";

/** Error message with a retry button. Never shows substitute data. */
export default function ErrorState({
  title = "Couldn't load race data",
  message,
  onRetry,
}) {
  return (
    <div role="alert">
      <EmptyState icon={AlertTriangle} title={title} description={message}>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            <RotateCw aria-hidden="true" className="size-4" />
            Retry
          </button>
        )}
      </EmptyState>
    </div>
  );
}

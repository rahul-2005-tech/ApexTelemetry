export default function EmptyState({ icon: Icon, title, description, children }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {Icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-xl border border-line-strong bg-surface-2 text-accent">
          <Icon aria-hidden="true" className="size-6" />
        </div>
      )}
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {description && (
        <p className="mt-2 max-w-md text-sm text-ink-muted">{description}</p>
      )}
      {children}
    </div>
  );
}

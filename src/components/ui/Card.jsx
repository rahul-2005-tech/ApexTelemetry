export default function Card({ as: Tag = "section", className = "", children, ...rest }) {
  return (
    <Tag className={`rounded-xl border border-line bg-surface ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

export function CardHeader({ title, description, action }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-wide text-ink uppercase">
          {title}
        </h2>
        {description && <p className="mt-1 text-xs text-ink-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

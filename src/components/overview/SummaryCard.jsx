import Card from "../ui/Card.jsx";
import Skeleton from "../ui/Skeleton.jsx";

export function SummaryCard({ icon: Icon, label, value, detail, color }) {
  return (
    <Card className="relative overflow-hidden p-5">
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-1"
        style={{ backgroundColor: color ?? "var(--color-accent)" }}
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-medium tracking-wider text-ink-dim uppercase">
          {label}
        </p>
        <Icon aria-hidden="true" className="size-4 text-ink-dim" />
      </div>
      <p className="mt-3 truncate text-xl font-semibold tracking-tight text-ink tabular sm:text-2xl">
        {value}
      </p>
      <p className="mt-1 truncate text-sm text-ink-muted">{detail}</p>
    </Card>
  );
}

export function SummaryCardSkeleton() {
  return (
    <Card className="p-5">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-4 h-7 w-36" />
      <Skeleton className="mt-3 h-4 w-28" />
    </Card>
  );
}

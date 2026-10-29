import { Hourglass } from "lucide-react";
import PageHeader from "../components/layout/PageHeader.jsx";
import Badge from "../components/ui/Badge.jsx";
import Card from "../components/ui/Card.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

/** Shared layout for sections that are planned but not built yet. */
export default function PlaceholderPage({ eyebrow, title, description, planned, icon }) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Card>
        <EmptyState
          icon={icon ?? Hourglass}
          title="Coming in a later phase"
          description="This section needs the historical data backend, which is not built yet."
        >
          <ul className="mt-6 space-y-2 text-sm text-ink-muted">
            {planned.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <Badge tone="accent" className="mt-6">
            Planned
          </Badge>
        </EmptyState>
      </Card>
    </>
  );
}

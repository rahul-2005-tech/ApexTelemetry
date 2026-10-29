import { BadgeCheck, FlaskConical } from "lucide-react";
import Badge from "./Badge.jsx";

/**
 * Always render this next to any data view so users can tell sample data
 * from verified historical results.
 */
export default function DataSourceBadge({ source, provider }) {
  if (source === "verified") {
    return (
      <Badge
        tone="positive"
        title={`Historical results from ${provider ?? "the data provider"}. They can differ from the official classification after post-race penalties.`}
      >
        <BadgeCheck aria-hidden="true" className="size-3.5" />
        Verified historical data
      </Badge>
    );
  }
  return (
    <Badge
      tone="demo"
      title="Sample data with fabricated statistics. Not official results."
    >
      <FlaskConical aria-hidden="true" className="size-3.5" />
      Demo data
    </Badge>
  );
}

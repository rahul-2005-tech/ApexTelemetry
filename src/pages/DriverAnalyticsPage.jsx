import { Users } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage.jsx";

export default function DriverAnalyticsPage() {
  return (
    <PlaceholderPage
      eyebrow="Driver Analytics"
      title="Driver performance"
      description="Season-long form, qualifying pace and race consistency for each driver."
      icon={Users}
      planned={[
        "Season points progression",
        "Qualifying vs. race pace",
        "Head-to-head teammate comparison",
      ]}
    />
  );
}

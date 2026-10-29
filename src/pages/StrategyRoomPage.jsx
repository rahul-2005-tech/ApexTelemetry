import { Wrench } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage.jsx";

export default function StrategyRoomPage() {
  return (
    <PlaceholderPage
      eyebrow="Strategy Room"
      title="Pit-stop strategy"
      description="Review tyre compounds, stint lengths and pit windows from completed races."
      icon={Wrench}
      planned={[
        "Stint timelines by tyre compound",
        "Pit-stop duration and undercut analysis",
        "Lap-time degradation per stint",
      ]}
    />
  );
}

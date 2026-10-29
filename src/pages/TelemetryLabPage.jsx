import { Gauge } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage.jsx";

export default function TelemetryLabPage() {
  return (
    <PlaceholderPage
      eyebrow="Telemetry Lab"
      title="Historical telemetry"
      description="Compare speed, throttle, brake and gear traces from past sessions."
      icon={Gauge}
      planned={[
        "Lap-by-lap speed and throttle traces",
        "Driver-vs-driver lap comparison",
        "Sourced from archived FastF1 sessions, not live timing",
      ]}
    />
  );
}

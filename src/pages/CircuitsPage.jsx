import { MapPin } from "lucide-react";
import PlaceholderPage from "./PlaceholderPage.jsx";

export default function CircuitsPage() {
  return (
    <PlaceholderPage
      eyebrow="Circuits"
      title="Circuit explorer"
      description="Track layouts, lap records and historical results by venue."
      icon={MapPin}
      planned={[
        "Track maps with corner and sector data",
        "Past winners and pole sitters per circuit",
        "Overtaking and pit-loss characteristics",
      ]}
    />
  );
}

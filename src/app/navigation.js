import { Gauge, LayoutDashboard, MapPin, Users, Wrench } from "lucide-react";
import OverviewPage from "../pages/OverviewPage.jsx";
import TelemetryLabPage from "../pages/TelemetryLabPage.jsx";
import StrategyRoomPage from "../pages/StrategyRoomPage.jsx";
import DriverAnalyticsPage from "../pages/DriverAnalyticsPage.jsx";
import CircuitsPage from "../pages/CircuitsPage.jsx";

/**
 * Single source of truth for the sidebar and the route table.
 * Adding a page is a one-line change here.
 */
export const navigationItems = [
  { path: "/", label: "Overview", icon: LayoutDashboard, element: OverviewPage },
  { path: "/telemetry", label: "Telemetry Lab", icon: Gauge, element: TelemetryLabPage },
  { path: "/strategy", label: "Strategy Room", icon: Wrench, element: StrategyRoomPage },
  {
    path: "/drivers",
    label: "Driver Analytics",
    icon: Users,
    element: DriverAnalyticsPage,
  },
  { path: "/circuits", label: "Circuits", icon: MapPin, element: CircuitsPage },
];

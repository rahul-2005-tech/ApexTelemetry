import { Flag, Timer, Trophy, Zap } from "lucide-react";
import { formatLapTime } from "../../lib/format.js";
import { getTeamColor } from "../../lib/teamColors.js";
import { SummaryCard, SummaryCardSkeleton } from "./SummaryCard.jsx";

const NOT_AVAILABLE = "Not available";

export default function SummaryCardGrid({ results, isLoading }) {
  if (isLoading || !results) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <SummaryCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const winner = results.find((row) => row.position === 1 && row.classified);
  // Grid position 1 (the front-row starter), which can differ from the
  // qualifying pole sitter when penalties were applied.
  const gridLeader = results.find((row) => row.grid === 1);
  const fastest = results.find((row) => row.fastestLap);
  const classifiedCount = results.filter((row) => row.classified).length;
  const retirements = results.length - classifiedCount;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        icon={Trophy}
        label="Winner"
        value={winner?.name ?? NOT_AVAILABLE}
        detail={winner ? [winner.team, winner.time].filter(Boolean).join(" · ") : "—"}
        color={winner ? getTeamColor(winner.team) : undefined}
      />
      <SummaryCard
        icon={Timer}
        label="Started from pole"
        value={gridLeader?.name ?? NOT_AVAILABLE}
        detail={
          gridLeader
            ? `${gridLeader.team ?? "—"} · ${
                gridLeader.classified
                  ? `finished P${gridLeader.position}`
                  : "did not finish"
              }`
            : "No driver listed on grid P1"
        }
        color={gridLeader ? getTeamColor(gridLeader.team) : undefined}
      />
      <SummaryCard
        icon={Zap}
        label="Fastest lap"
        value={fastest?.bestLap != null ? formatLapTime(fastest.bestLap) : NOT_AVAILABLE}
        detail={fastest ? `${fastest.name} · ${fastest.team ?? "—"}` : "Not recorded"}
        color={fastest ? getTeamColor(fastest.team) : undefined}
      />
      <SummaryCard
        icon={Flag}
        label="Classified"
        value={`${classifiedCount} / ${results.length}`}
        detail={`${retirements} not classified`}
      />
    </div>
  );
}

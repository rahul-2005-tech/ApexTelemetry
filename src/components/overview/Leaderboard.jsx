import { ArrowDown, ArrowUp, Minus, Zap } from "lucide-react";
import { getTeamColor } from "../../lib/teamColors.js";
import Skeleton from "../ui/Skeleton.jsx";

const resultText = (row) => (row.classified ? row.time : row.status) ?? "—";

function GridDelta({ grid, position, classified }) {
  // A missing grid (pit-lane start or not provided) can't be compared; show "—".
  if (!classified || grid == null || position == null) {
    return <span className="text-ink-dim">—</span>;
  }
  const delta = grid - position;
  if (delta === 0) {
    return (
      <span className="inline-flex items-center gap-1 text-ink-dim">
        <Minus aria-hidden="true" className="size-3" />
        <span className="sr-only">No change</span>0
      </span>
    );
  }
  const gained = delta > 0;
  const Icon = gained ? ArrowUp : ArrowDown;
  return (
    <span
      className={`inline-flex items-center gap-0.5 ${gained ? "text-positive" : "text-negative"}`}
    >
      <Icon aria-hidden="true" className="size-3" />
      <span className="sr-only">{gained ? "Gained" : "Lost"}</span>
      {Math.abs(delta)}
    </span>
  );
}

function FastestLapMark({ show }) {
  if (!show) return null;
  return (
    <Zap
      aria-label="Fastest lap"
      role="img"
      className="size-3.5 shrink-0 fill-current text-[#c084fc]"
    />
  );
}

function DriverCell({ row }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        aria-hidden="true"
        className="h-8 w-1 shrink-0 rounded-full"
        style={{ backgroundColor: getTeamColor(row.team) }}
      />
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 truncate font-medium text-ink">
          <span className="truncate">{row.name}</span>
          <FastestLapMark show={row.fastestLap} />
        </p>
        <p className="truncate text-xs text-ink-dim">
          {[row.code, row.number != null ? `#${row.number}` : null]
            .filter(Boolean)
            .join(" · ") || "—"}
        </p>
      </div>
    </div>
  );
}

const timeClass = (row) => (row.classified ? "text-ink" : "text-negative");

function LeaderboardTable({ results }) {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[720px] text-sm">
        <caption className="sr-only">Race classification</caption>
        <thead>
          <tr className="border-b border-line text-left text-[11px] tracking-wider text-ink-dim uppercase">
            <th scope="col" className="w-14 py-3 pl-5 font-medium">
              Pos
            </th>
            <th scope="col" className="py-3 font-medium">
              Driver
            </th>
            <th scope="col" className="py-3 font-medium">
              Team
            </th>
            <th scope="col" className="py-3 text-right font-medium">
              Grid
            </th>
            <th scope="col" className="py-3 text-right font-medium">
              +/−
            </th>
            <th scope="col" className="py-3 text-right font-medium">
              Time / Gap
            </th>
            <th scope="col" className="py-3 text-right font-medium">
              Pits
            </th>
            <th scope="col" className="py-3 pr-5 text-right font-medium">
              Pts
            </th>
          </tr>
        </thead>
        <tbody>
          {results.map((row) => (
            <tr
              key={row.driverId}
              className="border-b border-line/60 transition-colors last:border-0 hover:bg-surface-2"
            >
              <td className="py-3 pl-5 font-mono text-ink-muted tabular">
                {row.classified ? (row.position ?? "—") : "—"}
              </td>
              <td className="py-3 pr-4">
                <DriverCell row={row} />
              </td>
              <td className="py-3 pr-4 text-ink-muted">{row.team ?? "—"}</td>
              <td className="py-3 text-right font-mono text-ink-muted tabular">
                {row.grid ?? "Pit"}
              </td>
              <td className="py-3 text-right font-mono tabular">
                <GridDelta
                  grid={row.grid}
                  position={row.position}
                  classified={row.classified}
                />
              </td>
              <td className={`py-3 text-right font-mono tabular ${timeClass(row)}`}>
                {resultText(row)}
              </td>
              <td className="py-3 text-right font-mono text-ink-muted tabular">
                {row.pitStops ?? "—"}
              </td>
              <td className="py-3 pr-5 text-right font-mono font-semibold text-ink tabular">
                {row.points ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LeaderboardCards({ results }) {
  return (
    <ol className="divide-y divide-line/60 md:hidden">
      {results.map((row) => (
        <li key={row.driverId} className="flex items-center gap-3 px-4 py-3">
          <span className="w-6 shrink-0 text-center font-mono text-sm text-ink-muted tabular">
            {row.classified ? (row.position ?? "—") : "—"}
          </span>
          <div className="min-w-0 flex-1">
            <DriverCell row={row} />
            <p className={`mt-1.5 pl-4 font-mono text-xs tabular ${timeClass(row)}`}>
              {resultText(row)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-sm font-semibold text-ink tabular">
              {row.points ?? "—"}
              <span className="ml-0.5 text-[10px] font-normal text-ink-dim"> pts</span>
            </p>
            <p className="mt-1 font-mono text-xs text-ink-muted tabular">
              {row.grid != null ? `P${row.grid}` : "Pit"}{" "}
              <span className="text-ink-dim">→</span>{" "}
              <GridDelta
                grid={row.grid}
                position={row.position}
                classified={row.classified}
              />
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-2 p-5">
      {Array.from({ length: 10 }, (_, index) => (
        <Skeleton key={index} className="h-11 w-full" />
      ))}
    </div>
  );
}

export default function Leaderboard({ results }) {
  return (
    <>
      <LeaderboardTable results={results} />
      <LeaderboardCards results={results} />
    </>
  );
}

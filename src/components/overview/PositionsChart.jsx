import { getTeamColor } from "../../lib/teamColors.js";
import PlotlyChart from "../charts/PlotlyChart.jsx";

/** Positions gained (+) or lost (−) between the grid and the chequered flag. */
export default function PositionsChart({ results }) {
  // Pit-lane starters and rows without a grid/position can't be compared.
  const rows = results.filter(
    (row) => row.classified && row.grid != null && row.position != null,
  );

  const data = [
    {
      type: "bar",
      x: rows.map((row) => row.code ?? row.name),
      y: rows.map((row) => row.grid - row.position),
      marker: { color: rows.map((row) => getTeamColor(row.team)) },
      customdata: rows.map((row) => [row.name, row.team, row.grid, row.position]),
      hovertemplate:
        "<b>%{customdata[0]}</b><br>%{customdata[1]}<br>" +
        "Grid P%{customdata[2]} → P%{customdata[3]}<br>" +
        "Change: %{y:+d}<extra></extra>",
    },
  ];

  return (
    <PlotlyChart
      data={data}
      ariaLabel="Bar chart of positions gained or lost per classified driver"
      layout={{
        yaxis: { title: { text: "Positions gained" }, zeroline: true },
        xaxis: {
          tickangle: -45,
          categoryorder: "array",
          categoryarray: rows.map((r) => r.code ?? r.name),
        },
        bargap: 0.3,
      }}
    />
  );
}

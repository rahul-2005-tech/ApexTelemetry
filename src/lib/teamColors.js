// Approximate livery colors used for visual identification only.
const TEAM_COLORS = {
  "Red Bull Racing": "#3671c6",
  Mercedes: "#27f4d2",
  Ferrari: "#e8002d",
  McLaren: "#ff8000",
  "Aston Martin": "#229971",
  Alpine: "#ff87bc",
  Williams: "#64c4ff",
  RB: "#6692ff",
  AlphaTauri: "#5e8faa",
  "Kick Sauber": "#52e252",
  "Alfa Romeo": "#c92d4b",
  "Haas F1 Team": "#b6babd",
  // Constructor names as published by Jolpica-F1.
  "Red Bull": "#3671c6",
  Sauber: "#52e252",
  "RB F1 Team": "#6692ff",
  "Racing Bulls": "#6692ff",
  "Alpine F1 Team": "#ff87bc",
  "Toro Rosso": "#5e8faa",
  Renault: "#ffd800",
  "Racing Point": "#f596c8",
  "Force India": "#f596c8",
  Audi: "#bb0a30",
  Cadillac: "#a8a9ad",
};

const FALLBACK_COLOR = "#71717a";

export function getTeamColor(team) {
  return TEAM_COLORS[team] ?? FALLBACK_COLOR;
}

import { demoRaceDefinitions } from "./races.js";
import { demoRosters } from "./rosters.js";
import { buildResults } from "./buildResults.js";

export const demoSeasons = Object.keys(demoRaceDefinitions)
  .map(Number)
  .sort((a, b) => b - a);

const toRaceId = (season, round) => `${season}-${String(round).padStart(2, "0")}`;

/** @type {import("../../types").Race[]} */
const allRaces = demoSeasons.flatMap((season) =>
  demoRaceDefinitions[season].map((definition) => ({
    id: toRaceId(season, definition.round),
    season,
    round: definition.round,
    name: definition.name,
    circuit: definition.circuit,
    country: definition.country,
    date: definition.date,
    laps: definition.laps,
  })),
);

export function getDemoRaces(season) {
  return allRaces.filter((race) => race.season === season);
}

export function getDemoResults(raceId) {
  const race = allRaces.find((item) => item.id === raceId);
  if (!race) return null;
  const definition = demoRaceDefinitions[race.season].find(
    (item) => item.round === race.round,
  );
  return buildResults(raceId, definition, demoRosters[race.season]);
}

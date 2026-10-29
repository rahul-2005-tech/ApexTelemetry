import { demoSeasons, getDemoRaces, getDemoResults } from "../data/demo/index.js";

const SIMULATED_LATENCY_MS = 180;

const respond = (data) =>
  new Promise((resolve) => {
    setTimeout(() => resolve({ data, source: "demo" }), SIMULATED_LATENCY_MS);
  });

/** Serves bundled sample data. Every response is tagged `source: "demo"`. */
export const demoProvider = {
  getSeasons: () => respond(demoSeasons),

  getRaces: (season) => respond(getDemoRaces(season)),

  getRaceResults: (raceId) => {
    const results = getDemoResults(raceId);
    if (!results) return Promise.reject(new Error(`Unknown race "${raceId}".`));
    return respond(results);
  },
};

import { apiGet } from "./apiClient.js";

/**
 * Talks to the FastAPI backend (see /backend). Every endpoint returns
 * `{ source: "verified", data, meta: { provider, warnings } }`.
 *
 *   GET /seasons                 -> number[]
 *   GET /seasons/{year}/races    -> Race[]            (completed races only)
 *   GET /races/{raceId}/results  -> DriverResult[]    (nullable fields stay null)
 */
export const apiProvider = {
  getSeasons: (options) => apiGet("/seasons", options),

  getRaces: (season, options) => apiGet(`/seasons/${season}/races`, options),

  getRaceResults: (raceId, options) =>
    apiGet(`/races/${encodeURIComponent(raceId)}/results`, options),
};

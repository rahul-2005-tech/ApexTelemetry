import { apiProvider } from "./apiProvider.js";
import { demoProvider } from "./demoProvider.js";

const providers = { demo: demoProvider, api: apiProvider };

// Defaults to the real backend. Demo data is opt-in (VITE_DATA_SOURCE=demo) and
// is never used as a fallback when the API fails.
const dataSource = import.meta.env.VITE_DATA_SOURCE ?? "api";
const provider = providers[dataSource];

if (!provider) {
  throw new Error(`Unknown VITE_DATA_SOURCE "${dataSource}". Expected "demo" or "api".`);
}

/**
 * The only data-access surface the UI may use. Each method resolves to
 * `{ data, source, meta? }` where `source` is "demo" or "verified".
 */
export const f1Service = {
  /** @returns {Promise<import("../types").ServiceResponse<number[]>>} */
  getSeasons: (options) => provider.getSeasons(options),

  /** @returns {Promise<import("../types").ServiceResponse<import("../types").Race[]>>} */
  getRaces: (season, options) => provider.getRaces(season, options),

  /** @returns {Promise<import("../types").ServiceResponse<import("../types").DriverResult[]>>} */
  getRaceResults: (raceId, options) => provider.getRaceResults(raceId, options),
};

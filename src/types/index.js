/**
 * Shared data contracts, documented as JSDoc typedefs.
 * The future FastAPI backend should mirror these as Pydantic models.
 */

/**
 * Where a payload came from. UI components use this to label data honestly.
 * - "demo": bundled sample data with fabricated statistics.
 * - "verified": historical results served by the backend from FastF1.
 * @typedef {"demo" | "verified"} DataSource
 */

/**
 * @template T
 * @typedef {Object} ServiceResponse
 * @property {T} data
 * @property {DataSource} source
 */

/**
 * @typedef {Object} Race
 * @property {string} id            Unique id, e.g. "2024-01".
 * @property {number} season
 * @property {number} round
 * @property {string} name          e.g. "Bahrain Grand Prix".
 * @property {string} circuit
 * @property {string} country
 * @property {string} date          ISO date (YYYY-MM-DD).
 * @property {number} laps
 */

/**
 * @typedef {Object} DriverResult
 * @property {number} position
 * @property {string} code          Three-letter code, e.g. "VER".
 * @property {string} name
 * @property {number} number
 * @property {string} team
 * @property {number} grid
 * @property {string} time          Race time, gap, or lap deficit.
 * @property {number} points
 * @property {string} status        "Finished", "+1 Lap", or a retirement reason.
 * @property {number} pitStops
 * @property {boolean} classified
 * @property {boolean} fastestLap
 * @property {number | null} bestLap  Best lap in seconds.
 */

export {};

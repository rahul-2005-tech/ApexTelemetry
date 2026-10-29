import { formatGap, formatRaceTime } from "../../lib/format.js";

const POINTS_BY_POSITION = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];
const LAPPED_FINISHERS = 3;

/** Small deterministic PRNG so demo values are stable between reloads. */
function createRandom(seedText) {
  let seed = 0;
  for (const char of seedText) seed = (Math.imul(seed, 31) + char.charCodeAt(0)) >>> 0;
  return () => {
    seed = (seed + 0x6d2b79f5) >>> 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const splitCodes = (codes) => codes.trim().split(/\s+/);

function assertValidDefinition(id, drivers, grid, order, retired) {
  const expected = Object.keys(drivers).sort().join(" ");
  if (grid.slice().sort().join(" ") !== expected) {
    throw new Error(`Demo race ${id}: grid does not match the season roster.`);
  }
  if (order.slice().sort().join(" ") !== expected) {
    throw new Error(`Demo race ${id}: order does not match the season roster.`);
  }
  const retiredCodes = Object.keys(retired);
  const tail = order.slice(order.length - retiredCodes.length);
  if (!retiredCodes.every((code) => tail.includes(code))) {
    throw new Error(`Demo race ${id}: retired drivers must be listed last in order.`);
  }
}

/**
 * Expands a compact race definition into full result rows.
 * All numbers are fabricated sample values, never official results.
 *
 * @returns {import("../../types").DriverResult[]}
 */
export function buildResults(raceId, definition, drivers) {
  const grid = splitCodes(definition.grid);
  const order = splitCodes(definition.order);
  const retired = definition.retired ?? {};
  assertValidDefinition(raceId, drivers, grid, order, retired);

  const random = createRandom(raceId);
  const winnerSeconds = definition.laps * definition.baseLap * (1.03 + random() * 0.03);
  const finisherCount = order.length - Object.keys(retired).length;

  let gap = 0;
  return order.map((code, index) => {
    const driver = drivers[code];
    const position = index + 1;
    const classified = !(code in retired);
    const hasFastestLap = code === definition.fastestLap;

    let time;
    let status;
    if (!classified) {
      time = "DNF";
      status = retired[code];
    } else if (position === 1) {
      time = formatRaceTime(winnerSeconds);
      status = "Finished";
    } else if (position > finisherCount - LAPPED_FINISHERS) {
      time = "+1 Lap";
      status = "+1 Lap";
    } else {
      gap += 1.5 + random() * 9;
      time = formatGap(gap);
      status = "Finished";
    }

    const basePoints = classified ? (POINTS_BY_POSITION[index] ?? 0) : 0;
    const fastestLapBonus = hasFastestLap && classified && position <= 10 ? 1 : 0;

    return {
      driverId: code,
      position,
      code,
      name: driver.name,
      number: driver.number,
      team: driver.team,
      grid: grid.indexOf(code) + 1,
      time,
      points: basePoints + fastestLapBonus,
      status,
      pitStops: classified ? 1 + Math.floor(random() * 3) : Math.floor(random() * 2),
      classified,
      fastestLap: hasFastestLap,
      bestLap: hasFastestLap
        ? definition.baseLap
        : definition.baseLap + 0.4 + random() * 2.6,
    };
  });
}

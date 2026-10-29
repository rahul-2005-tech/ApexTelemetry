/** Formats seconds as m:ss.mmm (e.g. 92.345 -> "1:32.345"). */
export function formatLapTime(totalSeconds) {
  if (totalSeconds == null || Number.isNaN(totalSeconds)) return "—";
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds - minutes * 60;
  return `${minutes}:${seconds.toFixed(3).padStart(6, "0")}`;
}

/** Formats seconds as h:mm:ss.mmm for total race time. */
export function formatRaceTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const rest = totalSeconds - hours * 3600;
  const minutes = Math.floor(rest / 60);
  const seconds = rest - minutes * 60;
  return `${hours}:${String(minutes).padStart(2, "0")}:${seconds.toFixed(3).padStart(6, "0")}`;
}

/** Formats a gap to the winner, e.g. "+5.743s". */
export function formatGap(seconds) {
  return `+${seconds.toFixed(3)}s`;
}

export function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

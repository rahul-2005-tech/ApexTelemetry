# Demo data

Everything in this folder is **sample data for UI development**.

- Driver, team, circuit and Grand Prix names are real.
- Race calendars (names, circuits, dates, lap counts) are included for realism.
- **Finishing orders, grid positions, gaps, points, pit stops, fastest laps and
  retirements are fabricated.** They must not be quoted as, or compared against,
  official Formula 1 results.
- The UI labels every view built from this data with a "Demo data" badge, and
  every service response carries `source: "demo"`.

Verified historical results will come from the FastAPI backend (backed by
FastF1) in a later phase and will be served with `source: "verified"`.
Nothing under `src/data/verified/` is populated yet.

## Files

| File              | Purpose                                                                      |
| ----------------- | ---------------------------------------------------------------------------- |
| `rosters.js`      | Driver and team line-ups per season                                          |
| `races.js`        | Calendar plus fabricated grid/finish definitions                             |
| `buildResults.js` | Deterministic generator that expands a race definition into full result rows |
| `index.js`        | Public surface consumed by `services/demoProvider.js`                        |

# ApexTelemetry

A dark, motorsport-inspired dashboard for exploring **historical** Formula 1 race
results. It does not provide live timing or real-time telemetry.

> **Disclaimer.** ApexTelemetry is an independent, unofficial fan project. It is
> not affiliated with, endorsed by, or sponsored by Formula 1, the FIA, F1 TV, or
> any related organization. F1, FORMULA ONE, FORMULA 1, FIA FORMULA ONE WORLD
> CHAMPIONSHIP, GRAND PRIX and related marks are trademarks of Formula One
> Licensing B.V. or their respective owners. This project claims no ownership of
> any third-party data, branding, telemetry or trademarks. Use of the Jolpica-F1 API
> is subject to its [Terms of Use](https://github.com/jolpica/jolpica-f1/blob/main/TERMS.md).
>
> **F1TV credentials stay on your machine.** This repository contains no
> credentials, and you must never commit, share or publish yours.

**Intended use: personal, local use** for learning and analysis. Publishing the
source code on GitHub does not make a running instance of the app private, and the
project is not designed or hardened to be hosted publicly. Keep any F1TV
credentials on your own machine (see [Optional: telemetry
authentication](#optional-telemetry-authentication)).

| Part     | Location   | Stack                                   |
| -------- | ---------- | --------------------------------------- |
| Frontend | repo root  | React, Vite, Tailwind CSS v4, Plotly.js |
| Backend  | `backend/` | Python, FastAPI, FastF1                 |

## Current status

What has been checked, using the commands in [Tests and checks](#tests-and-checks).
These results are from the last full run, before the project folder was moved, and
have not been re-run since. Re-run them on your machine to confirm:

| Check                                              | Status                                      |
| -------------------------------------------------- | ------------------------------------------- |
| Frontend `npm run lint`                            | Passed on last run                          |
| Frontend `npm run build`                           | Passed on last run                          |
| Backend `pytest` (32 tests, offline, upstream mocked) | Passed on last run                       |
| API calls through the Vite dev proxy (`/api/...`)  | Returned real results for 2024 Bahrain GP on last run |
| **Browser end-to-end verification of the UI**      | **Not yet confirmed**                       |
| Telemetry endpoint with a real F1TV login          | **Not tested** (only unit-tested without)   |

There are no automated frontend tests, and no browser-automation tests.

## Features

- **Overview page:** season and Grand Prix selectors, summary cards (winner, grid
  leader, fastest lap, classified count), a driver leaderboard, and a grid-vs-finish
  chart.
- **Collapsible sidebar** and responsive layout.
- **Telemetry Lab, Strategy Room, Driver Analytics, Circuits:** placeholder pages
  only. No functionality is implemented yet.
- **Data-source honesty:** a green "Verified historical data" badge for data from
  the backend, an amber "Demo data" badge for bundled samples. Missing values show
  `—` or "Not available" and are never estimated.
- **Errors:** if the backend fails, the Overview shows an error with a **Retry**
  button. It never silently falls back to demo data.
- **Demo mode:** optional bundled sample data. Names are real, but finishing orders,
  times and points are **fabricated** (see `src/data/demo/README.md`).

## Data sources and access requirements

Tested with FastF1 3.9.0:

| Feature                                 | Source                              | F1TV login needed?                |
| --------------------------------------- | ----------------------------------- | --------------------------------- |
| Seasons, race schedule                  | Jolpica-F1                          | No                                |
| Race results (positions, points, times) | Jolpica-F1                          | No                                |
| Pit-stop counts, fastest laps           | Jolpica-F1                          | No                                |
| Lap timing and car telemetry            | Formula 1 timing API, via FastF1    | Yes (F1TV Access/Pro/Premium)     |

Without a login, FastF1 loads timing sessions with no data. The backend therefore
answers telemetry requests with `401 auth_required` instead of empty or invented
values. The Overview page needs no subscription.

- Results come from Jolpica-F1, a community-run service, and may differ from the
  official FIA classification (for example after late penalties).
- The season selector covers 2018 to the current year by default.
- The first request for a race downloads data; later requests use the local cache.

## Setup on Windows 11

Commands are for **PowerShell**. Replace `<project-dir>` with the folder you cloned
into.

### Prerequisites

| Tool    | Version                                        | Check             |
| ------- | ---------------------------------------------- | ----------------- |
| Git     | any recent version                             | `git --version`   |
| Node.js | `^20.19.0` or `>=22.12.0` (required by Vite 8) | `node --version`  |
| Python  | 3.11 was used in development; see FastF1's docs for its minimum | `python --version` |

Install them from <https://git-scm.com>, <https://nodejs.org> and
<https://www.python.org/downloads/>.

### 1. Clone

```powershell
git clone <repository-url> <project-dir>
cd <project-dir>
```

If you keep the project in a OneDrive folder, sync can slow `node_modules` and the
Python environment. A folder outside OneDrive (for example `C:\dev`) is smoother.

### 2. Backend

Create the virtual environment outside the repository so it is never committed:

```powershell
python -m venv "$env:USERPROFILE\.venvs\apextelemetry"
& "$env:USERPROFILE\.venvs\apextelemetry\Scripts\python.exe" -m pip install -r backend\requirements-dev.txt
```

Use `backend\requirements.txt` instead if you do not want the test tools.

You can run the venv's `python.exe` directly, as shown here, with no activation. To
activate it instead, run `& "$env:USERPROFILE\.venvs\apextelemetry\Scripts\Activate.ps1"`
(PowerShell may require `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` first),
then use `python` in place of the long path below.

Start the API from the `backend` folder on port **8001**:

```powershell
cd backend
& "$env:USERPROFILE\.venvs\apextelemetry\Scripts\python.exe" -m uvicorn app.main:app --port 8001
```

Check <http://localhost:8001/api/health>. Interactive API docs are at
<http://localhost:8001/docs>.

A `backend\.env` file is **optional**. Create it only to change backend settings or
to add F1TV credentials. Run this from `<project-dir>` (the repository root), not
from `backend`:

```powershell
Copy-Item backend\.env.example backend\.env
```

### 3. Frontend

In a second terminal, from `<project-dir>`:

```powershell
npm install
npm run dev
```

Vite prints the URL (by default <http://localhost:5173>). To choose a port, use
`npm run dev -- --port 3000`.

A root `.env` file is **optional**. The defaults work with the backend on port 8001.
Create it only to change them:

```powershell
Copy-Item .env.example .env
```

Restart `npm run dev` after editing `.env`.

## Configuration

### Frontend (`.env` in the repo root)

| Variable            | Default                  | Purpose                                                                 |
| ------------------- | ------------------------ | ----------------------------------------------------------------------- |
| `VITE_DATA_SOURCE`  | `api`                    | `api` reads from the backend. `demo` uses bundled sample data.          |
| `VITE_API_BASE_URL` | `/api`                   | Base URL the browser calls. `/api` goes through the Vite dev proxy.     |
| `VITE_PROXY_TARGET` | `http://localhost:8001`  | Where the Vite dev server forwards `/api`. Read by `vite.config.js`.    |

If the backend runs on another port, set `VITE_PROXY_TARGET` (for example
`http://localhost:9000`). `VITE_` variables are embedded in the frontend bundle, so
never put secrets in them. The proxy only applies to `npm run dev`; a production
build served elsewhere needs `VITE_API_BASE_URL` to point at the backend directly,
and the backend's CORS settings to allow that origin.

### Backend (`backend/.env`)

| Variable                  | Default                                     | Purpose                                              |
| ------------------------- | ------------------------------------------- | ---------------------------------------------------- |
| `APEX_CACHE_DIR`          | `%LOCALAPPDATA%\ApexTelemetry\fastf1-cache` | FastF1 cache location                                |
| `APEX_MIN_SEASON`         | `2018`                                      | First season served                                  |
| `APEX_MAX_SEASON`         | current year                                | Last season served                                   |
| `APEX_CORS_EXTRA_ORIGINS` | empty                                       | Extra allowed origins, comma-separated               |
| `F1_USERNAME`, `F1_PASSWORD` | unset                                    | Optional, telemetry only (see below)                 |

Any `http://localhost:<port>` origin is already allowed by CORS.

## Verifying real data is shown

1. Start the backend and the frontend, then open the URL Vite printed.
2. The badge beside the race title should be green, **Verified historical data**,
   with no amber "Demo data" note.
3. Select **2024, R1 Bahrain Grand Prix**. The API returned Max Verstappen first in
   1:31:44.742, Sergio Pérez second (+22.457) and Carlos Sainz third (+25.110), with
   the fastest lap of 1:32.608 for Verstappen. Compare against
   <https://www.formula1.com/en/results>.
4. Open <http://localhost:8001/api/races/2024-01/results> and look for
   `"source": "verified"`.
5. Stop the backend and reload. You should see "Can't reach the ApexTelemetry
   backend" with a Retry button, and no sample data.

Steps 1, 2 and 5 describe expected browser behaviour that has **not** been confirmed
in a browser yet.

## Tests and checks

```powershell
# Backend (from <project-dir>\backend)
& "$env:USERPROFILE\.venvs\apextelemetry\Scripts\python.exe" -m pytest

# Frontend (from <project-dir>)
npm run lint
npm run build
```

The backend tests run offline with the upstream data provider mocked. They cover
data mapping, missing fields, and API error handling.

## Optional: telemetry authentication

Only the endpoint `GET /api/races/{id}/telemetry/fastest-lap?driver=VER` needs an
F1TV Access, Pro or Premium subscription. The UI does not use it yet.

- Keep credentials **local**. Put `F1_USERNAME` and `F1_PASSWORD` in the git-ignored
  `backend\.env`, or sign in once from the backend environment with
  `python -m fastf1 auth f1tv --authenticate`.
- **Never commit `.env` files, tokens or credentials**, and never paste them into
  issues, pull requests or chat. Only `.env.example` files, which contain no values,
  belong in the repository.
- FastF1 is unofficial. Use your own account, for personal analysis only, and check
  the terms of your F1TV subscription.

## API

| Endpoint                                                | Description                      |
| ------------------------------------------------------- | -------------------------------- |
| `GET /api/health`                                       | Status and cache path (no network) |
| `GET /api/seasons`                                      | Supported seasons, newest first  |
| `GET /api/seasons/{year}/races`                         | Completed races of a season      |
| `GET /api/races/{year}-{round}/results`                 | Race classification              |
| `GET /api/races/{id}/telemetry/fastest-lap?driver=VER`  | Needs F1TV login (401 otherwise) |

Success responses: `{ "source": "verified", "data": ..., "meta": { "provider", "warnings" } }`.
Errors: `{ "error": { "code", "message" } }` with codes `not_found`,
`results_not_available`, `invalid_request` (422), `auth_required` (401),
`rate_limited` (429), `upstream_unavailable` (502), `upstream_timeout` (504).

## Project structure

```
backend/
  app/          main, config, cache, errors, schemas, routers/, services/
  tests/        mapping, API, and telemetry tests
  requirements.txt, requirements-dev.txt, .env.example
src/
  app/          navigation config (drives the sidebar and routes)
  components/   layout/, ui/, charts/, overview/
  pages/        one per sidebar entry (only Overview is built)
  services/     f1Service -> apiProvider | demoProvider
  data/demo/    fabricated sample data;  data/verified/ is intentionally empty
  hooks/, lib/, types/
public/, index.html, vite.config.js, .env.example
```

Components call hooks, hooks call `f1Service`, and `f1Service` selects the API or demo
provider from `VITE_DATA_SOURCE`.

## Issues and contributing

This is a personal learning project, so response times may vary.

- **Report a problem** by opening a GitHub issue with the steps to reproduce, your
  Windows, Node and Python versions, and any error text. Remove credentials and
  personal paths first.
- **Contribute** by forking, creating a branch, and opening a pull request. Run
  `npm run lint`, `npm run build` and the backend `pytest` before submitting, and
  keep changes focused.

## Acknowledgements

- [FastF1](https://github.com/theOehrly/Fast-F1) ([docs](https://docs.fastf1.dev)) by
  Philipp Schäfer, used to access schedules, results, and (with an F1TV login)
  timing data. FastF1 is MIT-licensed.
- [Jolpica-F1](https://github.com/jolpica/jolpica-f1) (Apache-2.0), the
  community-maintained, Ergast-compatible API that supplies schedule and results
  data. See its [Terms of Use](https://github.com/jolpica/jolpica-f1/blob/main/TERMS.md).
- Built with [React](https://react.dev), [Vite](https://vite.dev),
  [Tailwind CSS](https://tailwindcss.com), [Plotly.js](https://plotly.com/javascript/),
  [FastAPI](https://fastapi.tiangolo.com) and [Lucide](https://lucide.dev).

## License

No license has been chosen for this repository yet. Until one is added, all rights
are reserved by the author, and others have no automatic right to reuse the code.
Third-party data and trademarks remain the property of their respective owners.

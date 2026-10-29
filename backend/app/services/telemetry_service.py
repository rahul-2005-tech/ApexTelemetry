"""Fastest-lap telemetry for one driver in one historical race.

Verified behaviour (FastF1 3.9.0, tested without credentials): timing and car
telemetry downloads need an F1TV login. Without one, FastF1 prompts on the
console and then loads a session with *no* data. This service therefore checks
authentication first and never calls FastF1 when it cannot sign in, so the
server cannot hang on a prompt and never returns empty data as if it were real.
"""

from __future__ import annotations

import math
import os
from typing import Any

import fastf1
from fastf1.exceptions import DataNotLoadedError, F1AuthError, NoLapDataError
from fastf1.internals.f1account import get_token, token_manager

from app.config import get_settings
from app.errors import ApiError
from app.schemas import FastestLapTelemetry, TelemetryPoint
from app.services import upstream
from app.services.mapping import parse_race_id
from app.services.schedule_service import ensure_season_supported

AUTH_HELP = (
    "Telemetry needs an F1TV Access/Pro/Premium login. Add F1_USERNAME and "
    "F1_PASSWORD to backend/.env, or run `python -m fastf1 auth f1tv --authenticate` "
    "in the backend virtualenv, then retry. Race results do not need a login."
)


def ensure_authenticated() -> None:
    """Raises ApiError(401, auth_required) unless a valid token can be obtained."""
    stored = token_manager.get_stored()
    if stored is not None and stored.is_valid():
        return

    settings = get_settings()
    if not settings.telemetry_credentials_configured:
        raise ApiError(401, "auth_required", AUTH_HELP)

    # FastF1 reads credentials from the environment (never logged or returned).
    os.environ["F1_USERNAME"] = settings.f1_username or ""
    os.environ["F1_PASSWORD"] = settings.f1_password or ""
    try:
        get_token()
    except F1AuthError as exc:
        raise ApiError(
            401, "auth_required", f"F1 account sign-in failed: {exc}. {AUTH_HELP}"
        ) from exc


def _num(value: Any) -> float | None:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return None
    return None if math.isnan(number) else number


def map_telemetry_rows(rows: list[dict[str, Any]]) -> list[TelemetryPoint]:
    """Missing or NaN channels become None, never zero."""
    points = []
    for row in rows:
        gear = _num(row.get("nGear"))
        brake = row.get("Brake")
        points.append(
            TelemetryPoint(
                distance=_num(row.get("Distance")),
                speed=_num(row.get("Speed")),
                throttle=_num(row.get("Throttle")),
                brake=None if brake is None or (isinstance(brake, float) and math.isnan(brake)) else bool(brake),
                gear=None if gear is None else int(gear),
                rpm=_num(row.get("RPM")),
            )
        )
    return points


def get_fastest_lap_telemetry(race_id: str, driver: str) -> FastestLapTelemetry:
    parsed = parse_race_id(race_id)
    if parsed is None:
        raise ApiError(422, "invalid_request", "Race id must look like '2024-01'.")
    season, round_number = parsed
    ensure_season_supported(season)
    ensure_authenticated()

    def load() -> FastestLapTelemetry:
        with upstream._lock:  # noqa: SLF001 - share the provider throttle
            session = fastf1.get_session(season, round_number, "R")
            session.load(laps=True, telemetry=True, weather=False, messages=False)
            laps = session.laps.pick_drivers(driver.upper())
            if laps.empty:
                raise ApiError(404, "not_found", f"No laps found for driver {driver.upper()}.")
            lap = laps.pick_fastest()
            if lap is None or lap.empty:
                raise ApiError(404, "not_found", "No timed fastest lap for this driver.")
            car = lap.get_car_data().add_distance()
            lap_time = lap["LapTime"]
            return FastestLapTelemetry(
                driver=driver.upper(),
                lap_number=int(lap["LapNumber"]) if _num(lap["LapNumber"]) is not None else None,
                lap_time=None if lap_time is None or str(lap_time) == "NaT" else round(lap_time.total_seconds(), 3),
                points=map_telemetry_rows(car.to_dict("records")),
            )

    try:
        return upstream.translate_errors(load)
    except (DataNotLoadedError, NoLapDataError, KeyError) as exc:
        raise ApiError(
            502,
            "telemetry_unavailable",
            "Timing or telemetry data could not be loaded for this session. "
            "It may not be published yet, or your F1TV login may lack access.",
        ) from exc

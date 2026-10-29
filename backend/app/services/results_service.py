"""Race classification for one historical Grand Prix."""

from __future__ import annotations

from app.errors import ApiError
from app.schemas import DriverResult
from app.services import upstream
from app.services.mapping import map_results, parse_race_id
from app.services.schedule_service import ensure_season_supported


def get_race_results(race_id: str) -> tuple[list[DriverResult], list[str]]:
    parsed = parse_race_id(race_id)
    if parsed is None:
        raise ApiError(422, "invalid_request", "Race id must look like '2024-01'.")
    season, round_number = parsed
    ensure_season_supported(season)

    raw_race = upstream.fetch_race_results(season, round_number)
    if not raw_race or not raw_race.get("Results"):
        raise ApiError(
            404,
            "results_not_available",
            f"No race results are available for {race_id}. "
            "The race may not have taken place yet, or the provider has not published them.",
        )

    pit_stops = upstream.fetch_pit_stops(season, round_number)
    return map_results(raw_race, pit_stops)

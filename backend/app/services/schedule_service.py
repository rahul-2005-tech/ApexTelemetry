"""Seasons and completed-race listings."""

from __future__ import annotations

from datetime import date

from app.config import get_settings
from app.errors import ApiError
from app.schemas import Race
from app.services import upstream
from app.services.mapping import map_race


def list_seasons() -> list[int]:
    """Newest first. Bounded by APEX_MIN_SEASON / APEX_MAX_SEASON."""
    settings = get_settings()
    return list(range(settings.max_season, settings.min_season - 1, -1))


def ensure_season_supported(season: int) -> None:
    settings = get_settings()
    if not settings.min_season <= season <= settings.max_season:
        raise ApiError(
            404,
            "not_found",
            f"Season {season} is outside the supported range "
            f"{settings.min_season}-{settings.max_season}.",
        )


def list_completed_races(season: int, today: date | None = None) -> list[Race]:
    """Races whose scheduled date has passed. Future races are never listed."""
    ensure_season_supported(season)
    today = today or date.today()
    races: list[Race] = []
    for raw in upstream.fetch_schedule(season):
        race = map_race(raw)
        if race is not None and date.fromisoformat(race.date) <= today:
            races.append(race)
    return sorted(races, key=lambda r: r.round)

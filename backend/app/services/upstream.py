"""Thin wrapper around FastF1's Jolpica-F1 client with error translation."""

from __future__ import annotations

import logging
import threading
from collections.abc import Callable
from typing import Any, TypeVar

import requests
from fastf1.ergast import Ergast
from fastf1.exceptions import (
    ErgastError,
    ErgastInvalidRequestError,
    F1AuthError,
    RateLimitExceededError,
)

from app.errors import ApiError

logger = logging.getLogger("apextelemetry")

T = TypeVar("T")

# FastF1 already throttles and caches HTTP requests. Serialising calls keeps
# concurrent browser requests from tripping Jolpica's rate limit.
_lock = threading.Lock()


def translate_errors(fn: Callable[[], T]) -> T:
    """Runs an upstream call, converting library errors into ApiError."""
    try:
        return fn()
    except ApiError:
        raise
    except requests.Timeout as exc:
        logger.warning("Upstream timeout: %s", exc)
        raise ApiError(504, "upstream_timeout", "The data provider timed out.") from exc
    except requests.ConnectionError as exc:
        logger.warning("Upstream connection error: %s", exc)
        raise ApiError(
            502,
            "upstream_unavailable",
            "Could not reach the data provider. Check your internet connection and retry.",
        ) from exc
    except RateLimitExceededError as exc:
        raise ApiError(
            429, "rate_limited", "The data provider rate limit was hit. Wait and retry."
        ) from exc
    except F1AuthError as exc:
        raise ApiError(401, "auth_required", f"F1 account sign-in failed: {exc}") from exc
    except (ErgastInvalidRequestError, ErgastError, requests.RequestException) as exc:
        logger.warning("Upstream error: %s", exc)
        raise ApiError(
            502, "upstream_error", "The data provider returned an error for this request."
        ) from exc


def _raw(fn: Callable[[Ergast], Any]) -> Any:
    def call() -> Any:
        with _lock:
            return fn(Ergast(result_type="raw", auto_cast=False))

    return translate_errors(call)


def fetch_schedule(season: int) -> list[dict[str, Any]]:
    return list(_raw(lambda e: e.get_race_schedule(season=season, limit=100)))


def fetch_race_results(season: int, round_number: int) -> dict[str, Any] | None:
    races = _raw(lambda e: e.get_race_results(season=season, round=round_number, limit=100))
    return dict(races[0]) if races else None


def fetch_pit_stops(season: int, round_number: int) -> list[dict[str, Any]] | None:
    """Pit stops are optional enrichment: failure yields None, not an error."""
    try:
        races = _raw(
            lambda e: e.get_pit_stops(season=season, round=round_number, limit=1000)
        )
    except ApiError as exc:
        logger.warning("Pit-stop lookup failed for %s R%s: %s", season, round_number, exc.code)
        return None
    if not races:
        return None
    return list(races[0].get("PitStops") or [])

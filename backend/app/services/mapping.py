"""Pure functions mapping raw Jolpica-F1 (Ergast-format) JSON to API models.

Rules:
- Never estimate, default or invent a value. If upstream omits a field, the
  result field is None.
- No network access here, so everything is unit-testable.
"""

from __future__ import annotations

import re
from collections import Counter
from typing import Any

from app.schemas import DriverResult, Race


def to_int(value: Any) -> int | None:
    try:
        return int(str(value).strip())
    except (TypeError, ValueError):
        return None


def to_float(value: Any) -> float | None:
    try:
        return float(str(value).strip())
    except (TypeError, ValueError):
        return None


_LAPPED_STATUS = re.compile(r"^(Lapped|\+\d+ Laps?)$")
_LAP_TIME = re.compile(r"^(?:(\d+):)?(\d+(?:\.\d+)?)$")


def parse_lap_time(text: Any) -> float | None:
    """'1:32.608' -> 92.608. Returns None for anything unparseable."""
    match = _LAP_TIME.match(str(text).strip()) if text is not None else None
    if not match:
        return None
    minutes = int(match.group(1)) if match.group(1) else 0
    return round(minutes * 60 + float(match.group(2)), 3)


def race_id(season: int, round_number: int) -> str:
    return f"{season}-{round_number:02d}"


def parse_race_id(value: str) -> tuple[int, int] | None:
    match = re.fullmatch(r"(\d{4})-(\d{1,2})", value)
    return (int(match.group(1)), int(match.group(2))) if match else None


def map_race(raw: dict[str, Any]) -> Race | None:
    """Maps one entry of the Jolpica race schedule. Returns None if unusable."""
    season = to_int(raw.get("season"))
    round_number = to_int(raw.get("round"))
    date = raw.get("date")
    name = raw.get("raceName")
    if season is None or round_number is None or not date or not name:
        return None
    circuit = raw.get("Circuit") or {}
    location = circuit.get("Location") or {}
    return Race(
        id=race_id(season, round_number),
        season=season,
        round=round_number,
        name=name,
        circuit=circuit.get("circuitName"),
        country=location.get("country"),
        date=str(date),
        laps=None,  # not part of the schedule; filled from results when known
    )


def _pit_stop_counts(pit_stops: list[dict[str, Any]] | None) -> Counter | None:
    """None means 'no pit-stop data', which is different from 'zero stops'."""
    if not pit_stops:
        return None
    return Counter(p.get("driverId") for p in pit_stops if p.get("driverId"))


def map_results(
    raw_race: dict[str, Any], pit_stops: list[dict[str, Any]] | None = None
) -> tuple[list[DriverResult], list[str]]:
    """Maps one race (with its `Results` list) to rows plus data warnings."""
    warnings: list[str] = []
    raw_rows = raw_race.get("Results") or []
    counts = _pit_stop_counts(pit_stops)
    if raw_rows and counts is None:
        warnings.append("Pit-stop data was not available for this race.")

    rows: list[DriverResult] = []
    missing_fastest = 0
    for raw in raw_rows:
        driver = raw.get("Driver") or {}
        driver_id = driver.get("driverId")
        if not driver_id:
            continue  # cannot identify the row, so skip rather than guess

        full_name = " ".join(
            part for part in (driver.get("givenName"), driver.get("familyName")) if part
        )
        position_text = str(raw.get("positionText", "")).strip()
        # Digits = classified. R/D/E/W/F/N = retired, disqualified, etc.
        classified = position_text.isdigit()
        status = raw.get("status")

        time = (raw.get("Time") or {}).get("time")
        if classified and status and _LAPPED_STATUS.match(status):
            # Upstream `Time` for lapped cars is not a gap to the winner, so show
            # the status ("Lapped", "+1 Lap") instead of a misleading number.
            time = status
        elif time is None and classified and status:
            time = status

        fastest = raw.get("FastestLap") or {}
        best_lap = parse_lap_time((fastest.get("Time") or {}).get("time"))
        if not fastest:
            missing_fastest += 1

        rows.append(
            DriverResult(
                driver_id=driver_id,
                position=to_int(raw.get("position")),
                code=driver.get("code"),
                name=full_name or driver_id,
                number=to_int(raw.get("number")) or to_int(driver.get("permanentNumber")),
                team=(raw.get("Constructor") or {}).get("name"),
                grid=to_int(raw.get("grid")) or None,  # 0 = pit-lane start
                time=time,
                points=to_float(raw.get("points")),
                status=status,
                laps=to_int(raw.get("laps")),
                pit_stops=None if counts is None else counts.get(driver_id, 0),
                classified=classified,
                fastest_lap=str(fastest.get("rank", "")).strip() == "1",
                best_lap=best_lap,
            )
        )

    if rows and missing_fastest == len(rows):
        warnings.append("Fastest-lap data was not available for this race.")
    rows.sort(key=lambda r: (r.position is None, r.position or 0))
    return rows, warnings

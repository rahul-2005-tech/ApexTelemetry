"""Response models. JSON uses camelCase to match src/types/index.js in the frontend.

Fields that the upstream source may not provide are nullable. The backend never
estimates or fills in a missing value.
"""

from typing import Generic, Literal, TypeVar

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

T = TypeVar("T")

PROVIDER = "Jolpica-F1 via FastF1"


class CamelModel(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)


class Meta(CamelModel):
    provider: str = PROVIDER
    # Human-readable notes about data that was unavailable for this response.
    warnings: list[str] = []


class Envelope(CamelModel, Generic[T]):
    source: Literal["verified"] = "verified"
    data: T
    meta: Meta = Meta()


class Race(CamelModel):
    id: str
    season: int
    round: int
    name: str
    circuit: str | None
    country: str | None
    date: str
    laps: int | None = None


class DriverResult(CamelModel):
    driver_id: str
    position: int | None
    code: str | None
    name: str
    number: int | None
    team: str | None
    grid: int | None  # None = pit-lane start or not provided
    time: str | None
    points: float | None
    status: str | None
    laps: int | None
    pit_stops: int | None
    classified: bool
    fastest_lap: bool
    best_lap: float | None  # seconds


class TelemetryPoint(CamelModel):
    distance: float | None
    speed: float | None
    throttle: float | None
    brake: bool | None
    gear: int | None
    rpm: float | None


class FastestLapTelemetry(CamelModel):
    driver: str
    lap_number: int | None
    lap_time: float | None
    points: list[TelemetryPoint]

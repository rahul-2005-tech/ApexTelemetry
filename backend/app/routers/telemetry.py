from fastapi import APIRouter, Query

from app.schemas import Envelope, FastestLapTelemetry
from app.services import telemetry_service

router = APIRouter(tags=["telemetry"])


@router.get(
    "/races/{race_id}/telemetry/fastest-lap",
    response_model=Envelope[FastestLapTelemetry],
    response_model_by_alias=True,
)
def get_fastest_lap_telemetry(
    race_id: str, driver: str = Query(pattern=r"^[A-Za-z]{3}$")
) -> Envelope[FastestLapTelemetry]:
    """Requires an F1TV login. Returns 401 `auth_required` otherwise."""
    data = telemetry_service.get_fastest_lap_telemetry(race_id, driver)
    return Envelope(data=data)

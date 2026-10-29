from fastapi import APIRouter

from app.schemas import DriverResult, Envelope, Meta
from app.services import results_service

router = APIRouter(tags=["results"])


@router.get(
    "/races/{race_id}/results",
    response_model=Envelope[list[DriverResult]],
    response_model_by_alias=True,
)
def get_results(race_id: str) -> Envelope[list[DriverResult]]:
    rows, warnings = results_service.get_race_results(race_id)
    return Envelope(data=rows, meta=Meta(warnings=warnings))

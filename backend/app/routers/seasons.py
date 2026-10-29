from fastapi import APIRouter

from app.schemas import Envelope, Race
from app.services import schedule_service

router = APIRouter(tags=["seasons"])


@router.get("/seasons", response_model=Envelope[list[int]], response_model_by_alias=True)
def get_seasons() -> Envelope[list[int]]:
    return Envelope(data=schedule_service.list_seasons())


@router.get(
    "/seasons/{season}/races",
    response_model=Envelope[list[Race]],
    response_model_by_alias=True,
)
def get_races(season: int) -> Envelope[list[Race]]:
    return Envelope(data=schedule_service.list_completed_races(season))

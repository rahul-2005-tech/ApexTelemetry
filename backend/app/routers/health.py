from fastapi import APIRouter

import fastf1

from app.config import get_settings

router = APIRouter(tags=["health"])


@router.get("/health")
def health() -> dict:
    """Never touches the network, so it works offline."""
    settings = get_settings()
    return {
        "status": "ok",
        "fastf1Version": fastf1.__version__,
        "cacheDir": str(settings.cache_dir),
        "seasonRange": [settings.min_season, settings.max_season],
        "telemetryCredentialsConfigured": settings.telemetry_credentials_configured,
    }

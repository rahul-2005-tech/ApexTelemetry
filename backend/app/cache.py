"""Persistent FastF1 cache setup."""

import logging

import fastf1

from app.config import Settings

logger = logging.getLogger("apextelemetry")


def configure_cache(settings: Settings) -> None:
    settings.cache_dir.mkdir(parents=True, exist_ok=True)
    fastf1.Cache.configure(cache_dir=str(settings.cache_dir))
    if "onedrive" in str(settings.cache_dir).lower():
        logger.warning(
            "FastF1 cache is inside OneDrive (%s). Sync can slow or lock it; "
            "set APEX_CACHE_DIR to a folder outside OneDrive.",
            settings.cache_dir,
        )
    logger.info("FastF1 cache: %s", settings.cache_dir)

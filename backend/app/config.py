"""Application settings, read from environment variables or backend/.env."""

import os
from datetime import date
from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent


def _default_cache_dir() -> Path:
    """Keep the cache outside OneDrive: %LOCALAPPDATA%\\ApexTelemetry\\fastf1-cache."""
    base = os.environ.get("LOCALAPPDATA")
    root = Path(base) if base else Path.home() / ".cache"
    return root / "ApexTelemetry" / "fastf1-cache"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=BACKEND_DIR / ".env",
        env_file_encoding="utf-8",
        env_prefix="APEX_",
        extra="ignore",
        populate_by_name=True,
    )

    cache_dir: Path = Field(default_factory=_default_cache_dir)

    # Season range served by the API. Timing data and telemetry exist from 2018;
    # Jolpica-F1 results go back further, so min_season can be lowered later.
    min_season: int = 2018
    max_season: int = Field(default_factory=lambda: date.today().year)

    # Any localhost port is allowed by default. Add extra origins comma-separated.
    cors_extra_origins: str = ""

    # Optional F1TV credentials. Only the telemetry endpoint can use them.
    # They are read from backend/.env (git-ignored) and never returned by the API.
    f1_username: str | None = Field(default=None, validation_alias="F1_USERNAME")
    f1_password: str | None = Field(default=None, validation_alias="F1_PASSWORD")

    @property
    def extra_origins(self) -> list[str]:
        return [o.strip() for o in self.cors_extra_origins.split(",") if o.strip()]

    @property
    def telemetry_credentials_configured(self) -> bool:
        return bool(self.f1_username and self.f1_password)


@lru_cache
def get_settings() -> Settings:
    return Settings()

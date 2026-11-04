"""Checks that matter for the Vercel serverless deployment (no network)."""

import importlib

from app.config import get_settings

EXPECTED_PATHS = {
    "/api/health",
    "/api/seasons",
    "/api/seasons/{season}/races",
    "/api/races/{race_id}/results",
    "/api/races/{race_id}/telemetry/fastest-lap",
}


def test_entry_point_exposes_the_existing_app():
    index = importlib.import_module("index")
    main = importlib.import_module("app.main")
    assert index.app is main.app


def test_entry_point_keeps_all_api_routes():
    index = importlib.import_module("index")
    assert set(index.app.openapi()["paths"]) == EXPECTED_PATHS


def test_startup_uses_writable_temp_cache_on_vercel(monkeypatch, tmp_path, client):
    """Simulates Vercel: no APEX_CACHE_DIR, no LOCALAPPDATA, unwritable home."""
    monkeypatch.delenv("APEX_CACHE_DIR", raising=False)
    monkeypatch.delenv("LOCALAPPDATA", raising=False)
    monkeypatch.setenv("VERCEL", "1")
    monkeypatch.setenv("HOME", str(tmp_path / "missing" / "readonly-home"))
    monkeypatch.setenv("USERPROFILE", str(tmp_path / "missing" / "readonly-home"))
    monkeypatch.setattr("tempfile.tempdir", str(tmp_path / "tmp"))
    (tmp_path / "tmp").mkdir()
    get_settings.cache_clear()

    from fastapi.testclient import TestClient

    from app.main import create_app

    with TestClient(create_app()) as vercel_client:  # runs lifespan startup
        body = vercel_client.get("/api/health").json()

    assert body["cacheDir"].startswith(str(tmp_path / "tmp"))
    assert (tmp_path / "tmp" / "ApexTelemetry" / "fastf1-cache").is_dir()
    assert not (tmp_path / "missing").exists()


def test_health_does_not_expose_credentials(client):
    body = client.get("/api/health").json()
    assert body["telemetryCredentialsConfigured"] is False
    assert "password" not in str(body).lower()

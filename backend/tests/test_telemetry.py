import math

import fastf1

from app.services import telemetry_service as ts


def test_without_credentials_or_token_returns_auth_required_and_never_calls_fastf1(
    client, monkeypatch
):
    monkeypatch.setattr(ts.token_manager, "get_stored", lambda: None)

    def must_not_be_called(*_a, **_k):
        raise AssertionError("FastF1 must not be called without authentication")

    monkeypatch.setattr(fastf1, "get_session", must_not_be_called)
    response = client.get("/api/races/2024-01/telemetry/fastest-lap?driver=VER")
    assert response.status_code == 401
    error = response.json()["error"]
    assert error["code"] == "auth_required"
    assert "F1TV" in error["message"]


def test_failed_sign_in_is_reported_as_auth_required(client, monkeypatch):
    from fastf1.exceptions import F1AuthError

    monkeypatch.setattr(ts.token_manager, "get_stored", lambda: None)
    monkeypatch.setenv("F1_USERNAME", "someone@example.com")
    monkeypatch.setenv("F1_PASSWORD", "secret-value")
    from app.config import get_settings

    get_settings.cache_clear()

    def fail():
        raise F1AuthError("bad password")

    monkeypatch.setattr(ts, "get_token", fail)
    response = client.get("/api/races/2024-01/telemetry/fastest-lap?driver=VER")
    assert response.status_code == 401
    assert response.json()["error"]["code"] == "auth_required"
    assert "secret-value" not in response.text


def test_driver_code_is_validated(client):
    response = client.get("/api/races/2024-01/telemetry/fastest-lap?driver=12")
    assert response.status_code == 422


def test_map_telemetry_rows_keeps_missing_values_as_none():
    points = ts.map_telemetry_rows(
        [
            {"Distance": 0.0, "Speed": 300.0, "Throttle": 100.0, "Brake": False, "nGear": 8, "RPM": 11000},
            {"Distance": 5.0, "Speed": math.nan, "Throttle": math.nan, "Brake": math.nan, "nGear": math.nan},
        ]
    )
    assert points[0].gear == 8 and points[0].brake is False
    assert points[1].speed is None
    assert points[1].throttle is None
    assert points[1].brake is None
    assert points[1].gear is None
    assert points[1].rpm is None

from datetime import date

import requests

from app.services import upstream
from tests.conftest import SAMPLE_RACE

PIT = [{"driverId": "max_verstappen"}]


def test_health_works_offline(client):
    body = client.get("/api/health").json()
    assert body["status"] == "ok"
    assert body["seasonRange"] == [2018, 2026]
    assert body["telemetryCredentialsConfigured"] is False
    assert "password" not in str(body).lower()


def test_seasons_newest_first_and_verified_envelope(client):
    body = client.get("/api/seasons").json()
    assert body["source"] == "verified"
    assert body["data"][0] == 2026 and body["data"][-1] == 2018
    assert "provider" in body["meta"]


def test_races_lists_only_past_races(client, monkeypatch):
    future = {**SAMPLE_RACE, "round": "2", "raceName": "Future GP", "date": "2999-01-01"}
    monkeypatch.setattr(upstream, "fetch_schedule", lambda season: [future, SAMPLE_RACE])
    body = client.get("/api/seasons/2024/races").json()
    assert [r["name"] for r in body["data"]] == ["Bahrain Grand Prix"]
    assert body["data"][0]["id"] == "2024-01"
    assert date.fromisoformat(body["data"][0]["date"]) < date.today()


def test_season_outside_range_is_404(client):
    response = client.get("/api/seasons/1999/races")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "not_found"


def test_results_success_uses_camel_case(client, monkeypatch):
    monkeypatch.setattr(upstream, "fetch_race_results", lambda s, r: SAMPLE_RACE)
    monkeypatch.setattr(upstream, "fetch_pit_stops", lambda s, r: PIT)
    body = client.get("/api/races/2024-01/results").json()
    assert body["source"] == "verified"
    first = body["data"][0]
    assert first["bestLap"] == 92.608 and first["fastestLap"] is True
    assert first["pitStops"] == 1
    assert "best_lap" not in first


def test_results_report_missing_pit_stop_data_as_warning(client, monkeypatch):
    monkeypatch.setattr(upstream, "fetch_race_results", lambda s, r: SAMPLE_RACE)
    monkeypatch.setattr(upstream, "fetch_pit_stops", lambda s, r: None)
    body = client.get("/api/races/2024-01/results").json()
    assert body["data"][0]["pitStops"] is None
    assert body["meta"]["warnings"]


def test_results_not_available_is_404(client, monkeypatch):
    monkeypatch.setattr(upstream, "fetch_race_results", lambda s, r: None)
    response = client.get("/api/races/2024-01/results")
    assert response.status_code == 404
    assert response.json()["error"]["code"] == "results_not_available"


def test_bad_race_id_is_422(client):
    response = client.get("/api/races/not-an-id/results")
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "invalid_request"


def test_non_integer_season_is_422(client):
    response = client.get("/api/seasons/abc/races")
    assert response.status_code == 422
    assert response.json()["error"]["code"] == "invalid_request"


class _Boom:
    def __init__(self, exc):
        self.exc = exc

    def __call__(self, *_):
        raise self.exc


def test_network_failure_is_502(client, monkeypatch):
    monkeypatch.setattr(
        upstream, "_raw", lambda fn: upstream.translate_errors(_Boom(requests.ConnectionError("down")))
    )
    response = client.get("/api/seasons/2024/races")
    assert response.status_code == 502
    assert response.json()["error"]["code"] == "upstream_unavailable"


def test_timeout_is_504(client, monkeypatch):
    monkeypatch.setattr(
        upstream, "_raw", lambda fn: upstream.translate_errors(_Boom(requests.Timeout("slow")))
    )
    response = client.get("/api/races/2024-01/results")
    assert response.status_code == 504
    assert response.json()["error"]["code"] == "upstream_timeout"


def test_pit_stop_failure_does_not_fail_results(client, monkeypatch):
    monkeypatch.setattr(upstream, "fetch_race_results", lambda s, r: SAMPLE_RACE)

    def failing_raw(fn):
        return upstream.translate_errors(_Boom(requests.ConnectionError("down")))

    monkeypatch.setattr(upstream, "_raw", failing_raw)
    body = client.get("/api/races/2024-01/results").json()
    assert body["data"][0]["pitStops"] is None
    assert body["meta"]["warnings"]


def test_unexpected_error_is_500_json(client, monkeypatch):
    monkeypatch.setattr(upstream, "fetch_race_results", _Boom(RuntimeError("bug")))
    response = client.get("/api/races/2024-01/results")
    assert response.status_code == 500
    assert response.json()["error"]["code"] == "internal_error"
    assert "bug" not in response.text  # internals are not leaked

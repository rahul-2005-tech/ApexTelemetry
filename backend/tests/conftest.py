import sys
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.config import get_settings  # noqa: E402
from app.main import create_app  # noqa: E402


@pytest.fixture(autouse=True)
def _pin_settings(monkeypatch, tmp_path):
    monkeypatch.setenv("APEX_CACHE_DIR", str(tmp_path / "cache"))
    monkeypatch.setenv("APEX_MIN_SEASON", "2018")
    monkeypatch.setenv("APEX_MAX_SEASON", "2026")
    monkeypatch.delenv("F1_USERNAME", raising=False)
    monkeypatch.delenv("F1_PASSWORD", raising=False)
    get_settings.cache_clear()
    yield
    get_settings.cache_clear()


@pytest.fixture
def client():
    return TestClient(create_app(), raise_server_exceptions=False)


def raw_row(**overrides):
    row = {
        "number": "1",
        "position": "1",
        "positionText": "1",
        "points": "25",
        "Driver": {
            "driverId": "max_verstappen",
            "permanentNumber": "3",
            "code": "VER",
            "givenName": "Max",
            "familyName": "Verstappen",
        },
        "Constructor": {"constructorId": "red_bull", "name": "Red Bull"},
        "grid": "1",
        "laps": "57",
        "status": "Finished",
        "Time": {"millis": "5504742", "time": "1:31:44.742"},
        "FastestLap": {"rank": "1", "lap": "39", "Time": {"time": "1:32.608"}},
    }
    row.update(overrides)
    return row


SAMPLE_RACE = {
    "season": "2024",
    "round": "1",
    "raceName": "Bahrain Grand Prix",
    "date": "2024-03-02",
    "Circuit": {
        "circuitName": "Bahrain International Circuit",
        "Location": {"country": "Bahrain", "locality": "Sakhir"},
    },
    "Results": [
        raw_row(),
        raw_row(
            number="11",
            position="2",
            positionText="2",
            points="18",
            grid="5",
            Time={"millis": "5527199", "time": "+22.457"},
            FastestLap={"rank": "4", "lap": "40", "Time": {"time": "1:34.364"}},
            Driver={"driverId": "perez", "code": "PER", "givenName": "Sergio", "familyName": "Pérez"},
        ),
        raw_row(
            number="77",
            position="19",
            positionText="19",
            points="0",
            grid="16",
            status="Lapped",
            Time=None,
            FastestLap=None,
            Driver={"driverId": "bottas", "code": "BOT", "givenName": "Valtteri", "familyName": "Bottas"},
        ),
        raw_row(
            number="31",
            position="20",
            positionText="R",
            points="0",
            grid="0",
            status="Engine",
            Time=None,
            FastestLap=None,
            Driver={"driverId": "ocon", "code": "OCO", "givenName": "Esteban", "familyName": "Ocon"},
        ),
    ],
}

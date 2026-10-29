import copy

from app.services.mapping import (
    map_race,
    map_results,
    parse_lap_time,
    parse_race_id,
    race_id,
)
from tests.conftest import SAMPLE_RACE, raw_row

PIT_STOPS = [
    {"driverId": "max_verstappen", "stop": "1"},
    {"driverId": "max_verstappen", "stop": "2"},
    {"driverId": "perez", "stop": "1"},
]


def test_parse_lap_time():
    assert parse_lap_time("1:32.608") == 92.608
    assert parse_lap_time("59.9") == 59.9
    assert parse_lap_time(None) is None
    assert parse_lap_time("garbage") is None


def test_race_id_round_trip():
    assert race_id(2024, 3) == "2024-03"
    assert parse_race_id("2024-03") == (2024, 3)
    assert parse_race_id("nonsense") is None


def test_map_race():
    race = map_race(SAMPLE_RACE)
    assert race.id == "2024-01"
    assert race.name == "Bahrain Grand Prix"
    assert race.country == "Bahrain"
    assert race.laps is None  # not in the schedule, so never guessed


def test_map_race_missing_required_fields_returns_none():
    assert map_race({"season": "2024", "round": "1"}) is None


def test_map_race_tolerates_missing_circuit():
    race = map_race({**SAMPLE_RACE, "Circuit": None})
    assert race.circuit is None and race.country is None


def test_map_results_basic_fields():
    rows, warnings = map_results(SAMPLE_RACE, PIT_STOPS)
    assert warnings == []
    winner = rows[0]
    assert winner.name == "Max Verstappen"
    assert winner.code == "VER"
    assert winner.number == 1  # race number, not permanentNumber
    assert winner.time == "1:31:44.742"
    assert winner.points == 25.0
    assert winner.best_lap == 92.608
    assert winner.fastest_lap is True
    assert winner.pit_stops == 2
    assert winner.classified is True


def test_only_rank_one_is_fastest_lap():
    rows, _ = map_results(SAMPLE_RACE, PIT_STOPS)
    assert [r.fastest_lap for r in rows] == [True, False, False, False]
    assert rows[1].best_lap == 94.364


def test_lapped_driver_is_classified_and_uses_status_as_time():
    rows, _ = map_results(SAMPLE_RACE, PIT_STOPS)
    bottas = next(r for r in rows if r.code == "BOT")
    assert bottas.classified is True
    assert bottas.time == "Lapped"
    assert bottas.best_lap is None  # missing upstream -> null, not invented


def test_lapped_driver_ignores_misleading_upstream_time():
    race = copy.deepcopy(SAMPLE_RACE)
    race["Results"][2]["Time"] = {"millis": "1", "time": "+6.759"}
    rows, _ = map_results(race, PIT_STOPS)
    assert next(r for r in rows if r.code == "BOT").time == "Lapped"


def test_retirement_is_not_classified_and_has_no_time():
    rows, _ = map_results(SAMPLE_RACE, PIT_STOPS)
    ocon = next(r for r in rows if r.code == "OCO")
    assert ocon.classified is False
    assert ocon.time is None
    assert ocon.status == "Engine"
    assert ocon.grid is None  # grid 0 = pit-lane start


def test_pit_stops_zero_vs_unknown():
    with_data, _ = map_results(SAMPLE_RACE, PIT_STOPS)
    assert next(r for r in with_data if r.code == "BOT").pit_stops == 0

    without, warnings = map_results(SAMPLE_RACE, None)
    assert all(r.pit_stops is None for r in without)
    assert any("Pit-stop" in w for w in warnings)

    empty, _ = map_results(SAMPLE_RACE, [])
    assert all(r.pit_stops is None for r in empty)


def test_missing_fastest_lap_data_adds_warning():
    race = copy.deepcopy(SAMPLE_RACE)
    for row in race["Results"]:
        row["FastestLap"] = None
    rows, warnings = map_results(race, PIT_STOPS)
    assert not any(r.fastest_lap for r in rows)
    assert any("Fastest-lap" in w for w in warnings)


def test_missing_optional_driver_fields():
    race = {
        "Results": [
            raw_row(
                Driver={"driverId": "old_timer", "givenName": "Old", "familyName": "Timer"},
                Constructor=None,
                points=None,
                number=None,
            )
        ]
    }
    (row,), _ = map_results(race, PIT_STOPS)
    assert row.code is None
    assert row.team is None
    assert row.points is None
    assert row.number is None


def test_rows_without_driver_id_are_skipped_not_guessed():
    race = {"Results": [raw_row(Driver={"givenName": "No", "familyName": "Id"}), raw_row()]}
    rows, _ = map_results(race, PIT_STOPS)
    assert len(rows) == 1


def test_empty_results():
    rows, _ = map_results({"Results": []}, None)
    assert rows == []

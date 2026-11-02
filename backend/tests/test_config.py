from pathlib import Path

from app.config import Settings, _default_cache_dir


def test_vercel_default_cache_is_in_temp_dir(monkeypatch):
    monkeypatch.setenv("VERCEL", "1")
    monkeypatch.setenv("LOCALAPPDATA", "C:/should/not/be/used")
    monkeypatch.delenv("APEX_CACHE_DIR", raising=False)
    path = _default_cache_dir()
    assert path.parts[-2:] == ("ApexTelemetry", "fastf1-cache")
    assert "should" not in path.parts


def test_non_vercel_default_uses_localappdata(monkeypatch, tmp_path):
    monkeypatch.delenv("VERCEL", raising=False)
    monkeypatch.setenv("LOCALAPPDATA", str(tmp_path))
    assert _default_cache_dir() == tmp_path / "ApexTelemetry" / "fastf1-cache"


def test_explicit_cache_dir_overrides_vercel_default(monkeypatch, tmp_path):
    monkeypatch.setenv("VERCEL", "1")
    monkeypatch.setenv("APEX_CACHE_DIR", str(tmp_path / "custom"))
    assert Settings().cache_dir == Path(tmp_path / "custom")

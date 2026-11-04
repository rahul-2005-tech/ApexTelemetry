"""Vercel entry point. Exposes the existing FastAPI app unchanged."""

from app.main import app

__all__ = ["app"]

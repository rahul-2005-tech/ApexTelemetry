import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.cache import configure_cache
from app.config import get_settings
from app.errors import register_error_handlers
from app.routers import health, results, seasons, telemetry

logging.basicConfig(level=logging.INFO)


@asynccontextmanager
async def lifespan(_: FastAPI):
    configure_cache(get_settings())
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title="ApexTelemetry API", version="0.1.0", lifespan=lifespan)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.extra_origins,
        allow_origin_regex=r"^http://(localhost|127\.0\.0\.1)(:\d+)?$",
        allow_methods=["GET"],
        allow_headers=["*"],
    )
    register_error_handlers(app)

    for router_module in (health, seasons, results, telemetry):
        app.include_router(router_module.router, prefix="/api")
    return app


app = create_app()

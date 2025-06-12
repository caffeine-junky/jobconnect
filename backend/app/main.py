import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
from contextlib import asynccontextmanager
from app.database import AsyncDatabase
from app.core import settings
from app.api.v1 import v1_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    os.system("cls")
    logger.info("Starting app")
    app.state.db = AsyncDatabase(
        host=settings.DATABASE_HOST,
        database=settings.DATABASE_NAME,
        username=settings.DATABASE_USER,
        password=settings.DATABASE_PASSWORD,
        port=settings.DATABASE_PORT,
    )

    await app.state.db.connect()
    await app.state.db.initialize()

    yield

    await app.state.db.disconnect()


app: FastAPI = FastAPI(
    title="JobConnect API",
    version="0.5.5",
    lifespan=lifespan,
    docs_url=f"{settings.API_V1_STR}/docs",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(v1_router, prefix="/api/v1")


@app.get("/")
async def index() -> dict[str, str | None]:
    return {
        "title": app.title,
        "version": app.version,
        "docs": app.docs_url,
        "openapi": app.openapi_url,
        "redoc": app.redoc_url,
        "mode": "development" if settings.DEBUG else "production",
    }

from loguru import logger
from typing import Optional, Any
from asyncpg import Record, Pool, create_pool  # type: ignore
from fastapi import HTTPException
from pathlib import Path


class AsyncDatabase:
    def __init__(
        self, host: str, database: str, username: str, password: str, port: int = 5432
    ) -> None:
        self._host = host
        self._database = database
        self._username = username
        self._password = password
        self._port = port
        self._connection_pool: Optional[Pool] = None

    async def connect(self) -> None:
        """Connect to the database."""
        try:
            self._connection_pool = await create_pool(
                host=self._host,
                database=self._database,
                user=self._username,
                password=self._password,
                port=self._port,
            )
            logger.success(f"Connected to the {self._database} database.")
        except Exception as e:
            logger.error(f"Failed to connect to database: {e}")

    async def disconnect(self) -> None:
        """Disconnect from the database"""
        if self._connection_pool is None:
            return
        await self._connection_pool.close()
        self._connection_pool = None
        logger.success(f"Disconnected from the {self._database} database.")

    async def initialize(self) -> None:
        """"""
        try:
            sql: str = (Path(__file__).parent / "jobconnectdb.sql").read_text()
            await self.execute(sql)
            logger.success("Database tables created")
        except Exception as e:
            logger.error(f"Failed to create database tables: {e}")

    async def execute(self, query: str, *values: Any) -> str:
        """Execute a query on the database."""
        if self._connection_pool is None:
            raise HTTPException(status_code=500, detail="Database is not connected.")
        async with self._connection_pool.acquire() as connection:  # type: ignore
            async with connection.transaction():  # type: ignore
                return await connection.execute(query, *values)  # type: ignore

    async def fetchone(self, query: str, *values: Any) -> Optional[Record]:
        """Fetch one record from the database."""
        if self._connection_pool is None:
            raise HTTPException(status_code=500, detail="Database is not connected.")
        try:
            async with self._connection_pool.acquire() as connection:  # type: ignore
                async with connection.transaction():  # type: ignore
                    return await connection.fetchrow(query, *values)  # type: ignore
        except Exception as e:
            logger.error(f"Failed to fetch record from database: {e}")
            return None

    async def fetchall(self, query: str, *values: Any) -> list[Record]:
        """Fetch all records from the database."""
        if self._connection_pool is None:
            raise HTTPException(status_code=500, detail="Database is not connected.")
        async with self._connection_pool.acquire() as connection:  # type: ignore
            async with connection.transaction():  # type: ignore
                return await connection.fetch(query, *values)  # type: ignore

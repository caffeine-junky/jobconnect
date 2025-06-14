from uuid import UUID
from asyncpg import Record  # type: ignore
from typing import Any, Dict, List, Tuple, Optional
from app.database import AsyncDatabase
from app.models import ServiceInDB


class ServiceRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db

    def record_to_service(self, record: Record) -> ServiceInDB:
        """Convert a database record to a ServiceInDB object."""
        return ServiceInDB(
            name=record["name"],
            description=record["description"],
            id=record["id"],
            created_at=record["created_at"],
        )

    async def exists(self, service_name: str) -> bool:
        """Check if a service exists in the database"""
        query: str = "SELECT * FROM service WHERE LOWER(name) = $1"
        service: Optional[Record] = await self.db.fetchone(query, service_name.lower())
        return service is not None

    async def create(self, data: Dict[str, Any]) -> Optional[ServiceInDB]:
        """Create a new service"""
        query: str = """
        INSERT INTO service (name, description)
        VALUES ($1, $2)
        RETURNING *
        """
        values: Tuple[Any, ...] = tuple(data.values())
        service_record: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            self.record_to_service(service_record)
            if service_record is not None
            else None
        )

    async def readone(self, service_id: UUID) -> Optional[ServiceInDB]:
        """Read one service from the database"""
        query: str = "SELECT * FROM service WHERE id = $1"
        service_record: Optional[Record] = await self.db.fetchone(query, service_id)
        return (
            self.record_to_service(service_record)
            if service_record is not None
            else None
        )

    async def readall(self, skip: int = 0, limit: int = 100) -> List[ServiceInDB]:
        """Read all services from the database"""
        query: str = """
        SELECT * FROM service
        OFFSET $1
        LIMIT $2
        """
        service_records: List[Record] = await self.db.fetchall(query, skip, limit)
        return [
            self.record_to_service(service_record) for service_record in service_records
        ]

    async def update(
        self, service_id: UUID, data: Dict[str, Any]
    ) -> Optional[ServiceInDB]:
        """Update an existing service"""
        updates: List[str] = [
            f"{key} = ${i}" for i, key in enumerate(data.keys(), start=2)
        ]
        query: str = f"""
        UPDATE service SET {", ".join(updates)}
        WHERE id = $1
        RETURNING *
        """
        values: Tuple[Any, ...] = (service_id, *data.values())
        updated_service: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            self.record_to_service(updated_service)
            if updated_service is not None
            else None
        )

    async def delete(self, service_id: UUID) -> bool:
        """Delete an existing service"""
        query: str = "DELETE FROM service WHERE id = $1"
        result: str = await self.db.execute(query, service_id)
        return "0" not in result

    async def readone_by_name(self, service_name: str) -> Optional[ServiceInDB]:
        """Read one service from the database by name"""
        query: str = (
            "SELECT * FROM service WHERE LOWER(name) LIKE LOWER('%' || $1 || '%')"
        )
        service_record: Optional[Record] = await self.db.fetchone(
            query, service_name.lower()
        )
        return (
            self.record_to_service(service_record)
            if service_record is not None
            else None
        )

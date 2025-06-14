from uuid import UUID
from asyncpg import Record  # type: ignore
from typing import Dict, Any, Optional, List, Tuple
from app.models import TechnicianServiceInDB
from app.database import AsyncDatabase


class TechnicianServiceRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db

    def record_to_technician_service(self, record: Record) -> TechnicianServiceInDB:
        """"""
        return TechnicianServiceInDB(
            id=record["id"],
            technician_id=record["technician_id"],
            service_id=record["service_id"],
            experience_years=record["experience_years"],
            price=record["price"],
        )

    async def technician_has_service(
        self, technician_id: UUID, service_id: UUID
    ) -> bool:
        """"""
        query: str = "SELECT * FROM technician_service WHERE technician_id = $1 AND service_id = $2"
        record: Optional[Record] = await self.db.fetchone(
            query, technician_id, service_id
        )
        return record is not None

    async def create(self, data: Dict[str, Any]) -> Optional[TechnicianServiceInDB]:
        """"""
        query: str = """
        INSERT INTO technician_service (technician_id, service_id, experience_years, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        """
        values: Tuple[Any, ...] = tuple(data.values())
        technician_service_record: Optional[Record] = await self.db.fetchone(
            query, *values
        )
        return (
            self.record_to_technician_service(technician_service_record)
            if technician_service_record is not None
            else None
        )

    async def readone(
        self, technician_service_id: UUID
    ) -> Optional[TechnicianServiceInDB]:
        """"""
        query: str = "SELECT * FROM technician_service WHERE id = $1"
        technician_service_record: Optional[Record] = await self.db.fetchone(
            query, technician_service_id
        )
        return (
            self.record_to_technician_service(technician_service_record)
            if technician_service_record is not None
            else None
        )

    async def readall(
        self,
        technician_id: Optional[UUID] = None,
        service_id: Optional[UUID] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianServiceInDB]:
        """"""
        filters: List[str] = []
        params: List[Any] = []

        if technician_id is not None:
            filters.append(f"technician_id = ${len(filters) + 1}")
            params.append(technician_id)
        if service_id is not None:
            filters.append(f"service_id = ${len(filters) + 1}")
            params.append(service_id)
        if min_price is not None:
            filters.append(f"price >= ${len(filters) + 1}")
            params.append(min_price)
        if max_price is not None:
            filters.append(f"price <= ${len(filters) + 1}")
            params.append(max_price)

        query: str = f"""
        SELECT * FROM technician_service
        {"WHERE " + " AND ".join(filters) if filters else ""}
        ORDER BY price
        OFFSET ${len(params) + 1}
        LIMIT ${len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        records: List[Record] = await self.db.fetchall(query, *values)
        return [self.record_to_technician_service(record) for record in records]

    async def update(
        self, technician_service_id: UUID, data: Dict[str, Any]
    ) -> Optional[TechnicianServiceInDB]:
        """"""
        params: List[str] = [
            f"{key} = ${i}" for i, key in enumerate(data.keys(), start=2)
        ]
        query: str = f"""
        UPDATE technician_service
        SET {", ".join(params)}
        WHERE id = $1
        RETURNING *
        """
        values: Tuple[Any, ...] = (technician_service_id, *data.values())
        technician_service_record: Optional[Record] = await self.db.fetchone(
            query, *values
        )
        return (
            self.record_to_technician_service(technician_service_record)
            if technician_service_record is not None
            else None
        )

    async def delete(self, technician_service_id: UUID) -> bool:
        """"""
        query: str = "DELETE FROM technician_service WHERE id = $1"
        result: str = await self.db.execute(query, technician_service_id)
        return "0" not in result

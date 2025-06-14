from uuid import UUID
from typing import Dict, Any, Optional, List, Tuple
from asyncpg import Record  # type: ignore
from app.database import AsyncDatabase
from app.models import TechnicianAvailabilityInDB
from app.models.base import TimeSlotDay


class TechnicianAvailabilityRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db

    def record_to_technician_availability(
        self, record: Record
    ) -> TechnicianAvailabilityInDB:
        return TechnicianAvailabilityInDB(
            id=UUID(record["id"]),
            technician_id=UUID(record["technician_id"]),
            timeslot=TimeSlotDay(
                day=record["day"],
                start_time=record["start_time"],
                end_time=record["end_time"],
            ),
            active=record["active"]
        )

    async def timeslot_exists(self, technician_id: UUID, timeslot: TimeSlotDay) -> bool:
        query: str = """
        SELECT * FROM technician_availability
        WHERE day = $1
        AND start_time = $2
        AND end_time = $3
        AND technician_id = $4
        """
        values: Tuple[Any, ...] = (
            timeslot.day,
            timeslot.start_time,
            timeslot.end_time,
            technician_id,
        )
        records: List[Record] = await self.db.fetchall(query, *values)
        return len(records) > 0

    async def create(
        self, data: Dict[str, Any]
    ) -> Optional[TechnicianAvailabilityInDB]:
        query: str = """
        INSERT INTO technician_availability (technician_id, day, start_time, end_time)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        """
        values: Tuple[Any, ...] = tuple(data.values())
        technician_availability_record: Optional[Record] = await self.db.fetchone(
            query, *values
        )
        return (
            self.record_to_technician_availability(technician_availability_record)
            if technician_availability_record is not None
            else None
        )

    async def readone(
        self, technician_availability_id: UUID
    ) -> Optional[TechnicianAvailabilityInDB]:
        query: str = "SELECT * FROM technician_availability WHERE id = $1"
        technician_availability_record: Optional[Record] = await self.db.fetchone(
            query, technician_availability_id
        )
        return (
            self.record_to_technician_availability(technician_availability_record)
            if technician_availability_record is not None
            else None
        )

    async def readall(
        self,
        day: Optional[int] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianAvailabilityInDB]:
        """"""
        filters: List[str] = []
        params: List[Any] = []
        if day is not None:
            filters.append(f"day = ${len(filters) + 1}")
            params.append(day)
        if start_time is not None:
            filters.append(f"start_time = ${len(filters) + 1}")
            params.append(start_time)
        if end_time is not None:
            filters.append(f"end_time = ${len(filters) + 1}")
            params.append(end_time)

        query: str = f"""
        SELECT * FROM technician_availability
        {"WHERE " + " AND ".join(filters) if filters else ""}
        OFFSET ${len(params) + 1}
        LIMIT ${len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        technician_availability_records: List[Record] = await self.db.fetchall(
            query, *values
        )
        return [
            self.record_to_technician_availability(technician_availability_record)
            for technician_availability_record in technician_availability_records
        ]

    async def delete(self, technician_availability_id: UUID) -> bool:
        query: str = "DELETE FROM technician_availability WHERE id = $1"
        result: str = await self.db.execute(query, technician_availability_id)
        return "0" not in result

    async def update(
        self, data: Dict[str, Any]
    ) -> Optional[TechnicianAvailabilityInDB]:
        query: str = """
        UPDATE technician_availability
        SET day = $2, start_time = $3, end_time = $4
        WHERE id = $1
        RETURNING *
        """
        values: Tuple[Any, ...] = tuple(data.values())
        technician_availability_record: Optional[Record] = await self.db.fetchone(
            query, *values
        )
        return (
            self.record_to_technician_availability(technician_availability_record)
            if technician_availability_record is not None
            else None
        )

    async def readall_by_technician_id(
        self,
        technician_id: UUID,
        day: Optional[int] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianAvailabilityInDB]:
        """"""
        filters: List[str] = []
        params: List[Any] = [technician_id]
        filters.append(f"technician_id = ${len(filters) + 1}")
        if day is not None:
            filters.append(f"day = ${len(filters) + 1}")
            params.append(day)
        if start_time is not None:
            filters.append(f"start_time = ${len(filters) + 1}")
            params.append(start_time)
        if end_time is not None:
            filters.append(f"end_time = ${len(filters) + 1}")
            params.append(end_time)

        query: str = f"""
        SELECT * FROM technician_availability
        {"WHERE" + " AND ".join(filters) if filters else ""}
        OFFSET ${len(params) + 1}
        LIMIT ${len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        technician_availability_records: List[Record] = await self.db.fetchall(
            query, *values
        )
        return [
            self.record_to_technician_availability(technician_availability_record)
            for technician_availability_record in technician_availability_records
        ]

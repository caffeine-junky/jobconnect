from uuid import UUID
from typing import Optional, List, Tuple, Dict, Any
from asyncpg import Record  # type: ignore
from app.database import AsyncDatabase
from datetime import date
from app.models import BookingInDB
from app.models.enums import BookingStatus
from app.models.base import Location, TimeSlot

RETURN_QUERY = """
id,
client_id,
technician_id,
service_name,
description,
booking_date,
start_time,
end_time,
location_name,
ST_X(location::geometry) AS longitude,
ST_Y(location::geometry) AS latitude,
status,
created_at
"""


class BookingRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db

    def record_to_booking(self, record: Record) -> BookingInDB:
        """Convert a record to a BookingInDB object"""
        return BookingInDB(
            client_id=record["client_id"],
            technician_id=record["technician_id"],
            service_name=record["service_name"],
            description=record["description"],
            timeslot=TimeSlot(
                slot_date=record["booking_date"],
                start_time=record["start_time"],
                end_time=record["end_time"],
            ),
            location=Location(
                location_name=record["location_name"],
                longitude=record["longitude"],
                latitude=record["latitude"],
            ),
            id=record["id"],
            status=record["status"],
            created_at=record["created_at"],
        )

    async def collides(self, technician_id: UUID, timeslot: TimeSlot) -> bool:
        """
        Returns true if the technician has a booking within the timeslot
        """
        query: str = """
        SELECT * FROM booking
        WHERE technician_id = $1
        AND booking_date = $2
        AND start_time < $3
        AND end_time > $4
        """
        values: Tuple[Any, ...] = (technician_id, *timeslot.model_dump().values())
        records: List[Record] = await self.db.fetchall(query, *values)
        return len(records) > 0

    async def create(self, data: Dict[str, Any]) -> Optional[BookingInDB]:
        """Create a new booking in the database."""
        query: str = f"""
        INSERT INTO booking (client_id, technician_id, service_name, description, booking_date, start_time, end_time, location_name, location)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING {RETURN_QUERY}
        """
        values: Tuple[Any, ...] = tuple(data.values())
        booking_record: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            self.record_to_booking(booking_record)
            if booking_record is not None
            else None
        )

    async def readone(self, booking_id: UUID) -> Optional[BookingInDB]:
        """"""
        query: str = f"""
        SELECT {RETURN_QUERY}
        FROM booking
        WHERE id = $1
        """
        booking_record: Optional[Record] = await self.db.fetchone(query, booking_id)
        return (
            self.record_to_booking(booking_record)
            if booking_record is not None
            else None
        )

    async def readall(
        self,
        client_id: Optional[UUID] = None,
        technician_id: Optional[UUID] = None,
        status: Optional[BookingStatus] = None,
        booking_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[BookingInDB]:
        """Read all bookings from the database"""
        filters: List[str] = []
        params: List[Any] = []
        if client_id is not None:
            filters.append(f"client_id = {len(filters) + 1}")
            params.append(client_id)
        if technician_id is not None:
            filters.append(f"technician_id = {len(filters) + 1}")
            params.append(technician_id)
        if status is not None:
            filters.append(f"status = {len(filters) + 1}")
            params.append(status)
        if booking_date is not None:
            filters.append(f"booking_date = {len(filters) + 1}")
            params.append(booking_date)

        query: str = f"""
        SELECT {RETURN_QUERY} FROM booking
        {F"WHERE {" AND ".join(filters)}" if filters else ""}
        OFFSET ${len(params) + 1}
        LIMIT ${len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        booking_records: List[Record] = await self.db.fetchall(query, *values)
        return [
            self.record_to_booking(booking_record) for booking_record in booking_records
        ]

    async def update(
        self, booking_id: UUID, data: Dict[str, Any]
    ) -> Optional[BookingInDB]:
        """Update an existing booking"""
        updates: List[str] = [
            f"{key} = ${i}" for i, key in enumerate(data.keys(), start=2)
        ]
        query: str = f"""
        UPDATE booking SET {", ".join(updates)}
        WHERE id = $1
        RETURNING {RETURN_QUERY}
        """
        values: Tuple[Any, ...] = (booking_id, *data.values())
        updated_booking: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            self.record_to_booking(updated_booking)
            if updated_booking is not None
            else None
        )

    async def delete(self, admin_id: UUID) -> bool:
        """Delete an existing booking"""
        query: str = "DELETE FROM booking WHERE id = $1"
        result: str = await self.db.execute(query, admin_id)
        return "0" not in result

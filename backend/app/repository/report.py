from asyncpg import Record # type: ignore
from typing import Optional
from app.database import AsyncDatabase
from app.models import TechnicianInDB
from app.models.enums import BookingStatus

from .technician import (
    RETURN_QUERY as TECHNICIAN_RETURN_QUERY,
    record_to_technician
    )


class ReportRepository:

    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db
    
    async def read_most_booked_technician(self) -> Optional[TechnicianInDB]:
        """"""
        query: str = f"""
        SELECT {TECHNICIAN_RETURN_QUERY}
        FROM technician t
        WHERE t.id IN (
            SELECT technician_id
            FROM booking
            GROUP BY technician_id
            ORDER BY COUNT(*) DESC
            LIMIT 1
        )
        """
        technician_record: Optional[Record] = await self.db.fetchone(query)
        return (
            record_to_technician(technician_record)
            if technician_record is not None
            else None
        )
    
    async def read_most_earning_technician(self) -> Optional[TechnicianInDB]:
        """"""
        query: str = f"""
        SELECT {TECHNICIAN_RETURN_QUERY}
        FROM technician t
        WHERE t.id IN (
            SELECT technician_id
            FROM payment
            GROUP BY technician_id
            ORDER BY SUM(amount) DESC
            LIMIT 1
        )
        """
        technician_record: Optional[Record] = await self.db.fetchone(query)
        return (
            record_to_technician(technician_record)
            if technician_record is not None
            else None
        )

    async def read_most_favorite_technician(self) -> Optional[TechnicianInDB]:
        """"""
        query: str = f"""
        SELECT {TECHNICIAN_RETURN_QUERY}
        FROM technician t
        WHERE t.id IN (
            SELECT technician_id
            FROM favorite_technician
            GROUP BY technician_id
            ORDER BY COUNT(*) DESC
            LIMIT 1
        )
        """
        technician_record: Optional[Record] = await self.db.fetchone(query)
        return (
            record_to_technician(technician_record)
            if technician_record is not None
            else None
        )
    
    async def read_most_booked_service(self) -> Optional[str]:
        """"""
        query: str = f"""
        SELECT s.name As service_name
        FROM service s
        WHERE s.id IN (
            SELECT service_id
            FROM booking
            GROUP BY service_id
            ORDER BY COUNT(*) DESC
            LIMIT 1
        )
        """
        record: Optional[Record] = await self.db.fetchone(query)
        return record["service_name"] if record is not None else None
    
    async def read_number_of_users(
        self,
        include_admin: bool = True,
        include_technician: bool = True,
        include_client: bool = True,
        ) -> int:
        """"""
        if not any((include_admin, include_technician, include_client)):
            return 0
        total: int = 0
        if include_admin:
            total += await self.db.count("SELECT COUNT(*) AS count FROM admin")
        if include_technician:
            total += await self.db.count("SELECT COUNT(*) AS count FROM technician")
        if include_client:
            total += await self.db.count("SELECT COUNT(*) AS count FROM client")
        return total
    
    async def read_number_of_bookings(self, status: Optional[BookingStatus] = None) -> int:
        """"""
        if status is None:
            return await self.db.count("SELECT COUNT(*) AS count FROM booking")
        return await self.db.count("SELECT COUNT(*) AS count FROM booking WHERE status = $1", status)

from uuid import UUID
from asyncpg import Record # type: ignore
from typing import Optional
from app.database import AsyncDatabase
from app.models import TechnicianInDB, TechnicianReport
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
    
    async def read_technician_report(self, technician_id: UUID) -> Optional[TechnicianReport]:
        """"""
        query: str = """
        WITH booking_stats AS (
            SELECT 
                COUNT(*) as total_bookings,
                COUNT(*) FILTER (WHERE status IN ('REQUESTED', 'ACCEPTED', 'IN_PROGRESS')) as active_bookings,
                COUNT(*) FILTER (WHERE status = 'REJECTED') as rejected_bookings,
                COUNT(*) FILTER (WHERE status = 'ACCEPTED') as accepted_bookings
            FROM booking 
            WHERE technician_id = $1
        ),
        payment_stats AS (
            SELECT 
                COUNT(*) as total_payments,
                COALESCE(SUM(amount), 0) as total_revenue
            FROM payment 
            WHERE technician_id = $1 AND status = 'COMPLETED'
        ),
        distance_stats AS (
            SELECT 
                COALESCE(MIN(ST_Distance(t.location, b.location) / 1000.0), 0) as shortest_distance_km,
                COALESCE(MAX(ST_Distance(t.location, b.location) / 1000.0), 0) as longest_distance_km,
                COALESCE(SUM(ST_Distance(t.location, b.location) / 1000.0), 0) as total_distance_km
            FROM booking b
            JOIN technician t ON t.id = $1
            WHERE b.technician_id = $1 AND b.status = 'COMPLETED'
        ),
        review_stats AS (
            SELECT 
                COALESCE(AVG(rating)::FLOAT, 0) as rating,
                COUNT(*) as num_reviews
            FROM review 
            WHERE technician_id = $1
        ),
        client_stats AS (
            SELECT 
                COUNT(DISTINCT client_id) FILTER (WHERE booking_count > 1) as num_repeating_clients
            FROM (
                SELECT client_id, COUNT(*) as booking_count
                FROM booking 
                WHERE technician_id = $1
                GROUP BY client_id
            ) client_bookings
        ),
        service_stats AS (
            SELECT 
                COUNT(*) as num_services_offered,
                COALESCE(
                    (SELECT service_name 
                    FROM booking 
                    WHERE technician_id = $1 
                    GROUP BY service_name 
                    ORDER BY COUNT(*) DESC 
                    LIMIT 1), 
                    ''
                ) as most_booked_service_name,
                COALESCE(
                    (SELECT service_name 
                    FROM booking 
                    WHERE technician_id = $1 
                    GROUP BY service_name 
                    ORDER BY COUNT(*) ASC 
                    LIMIT 1), 
                    ''
                ) as least_booked_service_name
            FROM technician_service 
            WHERE technician_id = $1
        )
        SELECT 
            bs.active_bookings,
            bs.total_bookings,
            bs.rejected_bookings,
            bs.accepted_bookings,
            ps.total_payments,
            ps.total_revenue,
            ds.shortest_distance_km,
            ds.longest_distance_km,
            ds.total_distance_km,
            rs.rating,
            rs.num_reviews,
            cs.num_repeating_clients,
            ss.num_services_offered,
            ss.most_booked_service_name,
            ss.least_booked_service_name
        FROM booking_stats bs
        CROSS JOIN payment_stats ps
        CROSS JOIN distance_stats ds
        CROSS JOIN review_stats rs
        CROSS JOIN client_stats cs
        CROSS JOIN service_stats ss
        """
        record: Optional[Record] = await self.db.fetchone(query, technician_id)
        return TechnicianReport(**record) if record is not None else None

from uuid import UUID
from typing import Optional, List, Tuple, Dict, Any
from asyncpg import Record  # type: ignore
from app.database import AsyncDatabase
from app.models import TechnicianInDB
from app.models.base import Location, PhoneNumber

RETURN_QUERY: str = """
    id,
    fullname,
    email,
    phone,
    hashed_password,
    location_name,
    ST_X(location::geometry) AS longitude,
    ST_Y(location::geometry) AS latitude,
    (SELECT AVG(rating) FROM review WHERE technician_id = id) AS rating,
    (SELECT name FROM service WHERE id IN (SELECT service_id FROM technician_service WHERE technician_id = id)) AS services,
    is_available,
    (SELECT COUNT(*) > 0 FROM verified_technician WHERE technician_id = id) AS is_verified,
    is_active,
    created_at
"""


def record_to_technician(record: Record) -> TechnicianInDB:
    """Convert a database record to a TechnicianInDB object"""
    return TechnicianInDB(
        fullname=record["fullname"],
        email=record["email"],
        phone=PhoneNumber(record["phone"]),
        id=record["id"],
        hashed_password=record["hashed_password"],
        location=Location(
            location_name=record["location_name"],
            latitude=record["latitude"],
            longitude=record["longitude"],
        ),
        rating=record["rating"] if record["rating"] else 0.0,
        services=record["services"] if record["services"] else [],
        is_available=record["is_available"],
        is_verified=record["is_verified"],
        is_active=record["is_active"],
        created_at=record["created_at"]
    )


class TechnicianRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db

    async def exists(self, email: str, phone: str) -> Tuple[bool, str]:
        """Check if a technician with the given email or phone exists in the database."""
        query: str = "SELECT * FROM technician WHERE email = $1"
        technician: Optional[Record] = await self.db.fetchone(query, email)

        if technician is not None:
            return True, "Technician with email already exists"

        query = "SELECT * FROM technician WHERE phone = $1"
        technician = await self.db.fetchone(query, phone)

        if technician is not None:
            return True, "Technician with phone already exists"

        return False, "Technician does not exist"

    async def create(self, data: Dict[str, Any]) -> Optional[TechnicianInDB]:
        """Create a new technician in the database"""
        location_point: str = (
            f"POINT({data['location']['longitude']} {data['location']['latitude']})"
        )
        query: str = f"""
        INSERT INTO technician (fullname, email, phone, hashed_password, location_name, location)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING {RETURN_QUERY}
        """
        values: Tuple[Any, ...] = (
            data["fullname"],
            data["email"],
            data["phone"],
            data["hashed_password"],
            data["location"]["location_name"],
            location_point,
        )
        technician_record: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            record_to_technician(technician_record)
            if technician_record is not None
            else None
        )

    async def readone(self, technician_id: UUID) -> Optional[TechnicianInDB]:
        """Read one technician from the database"""
        query: str = f"""
        SELECT {RETURN_QUERY}
        FROM technician
        WHERE id = $1
        """
        technician_record: Optional[Record] = await self.db.fetchone(
            query, technician_id
        )
        return (
            record_to_technician(technician_record)
            if technician_record is not None
            else None
        )

    async def readall(
        self,
        active: Optional[bool] = None,
        is_available: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianInDB]:
        """Read all technicians from the database"""
        filters: List[str] = []
        params: List[Any] = []
        if active is not None:
            filters.append(f"is_active = ${len(filters) + 1}")
            params.append(active)
        if is_available is not None:
            filters.append(f"is_available = ${len(filters) + 1}")
            params.append(is_available)

        query: str = f"""
        SELECT {RETURN_QUERY}
        FROM technician
        {"WHERE " + " AND ".join(filters) if filters else ""}
        OFFSET ${len(params) + 1}
        LIMIT ${len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        technician_records: List[Record] = await self.db.fetchall(query, *values)
        return [
            record_to_technician(technician_record)
            for technician_record in technician_records
        ]

    async def update(
        self, technician_id: UUID, data: Dict[str, Any]
    ) -> Optional[TechnicianInDB]:
        """Update an existing technician"""
        updates: List[str] = [
            f"{key} = ${i}" for i, key in enumerate(data.keys(), start=2)
        ]
        query: str = f"""
        UPDATE technician SET {", ".join(updates)}
        WHERE id = $1
        RETURNING {RETURN_QUERY}
        """
        values: Tuple[Any, ...] = (technician_id, *data.values())
        updated_technician: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            record_to_technician(updated_technician)
            if updated_technician is not None
            else None
        )

    async def delete(self, technician_id: UUID) -> bool:
        """Delete an existing technician"""
        query: str = "DELETE FROM technician WHERE id = $1"
        result: str = await self.db.execute(query, technician_id)
        return "0" not in result

    async def readone_by_email(self, email: str) -> Optional[TechnicianInDB]:
        """Read one technician from the database using their email"""
        query: str = f"SELECT {RETURN_QUERY} FROM technician WHERE email = $1"
        technician_record: Optional[Record] = await self.db.fetchone(query, email)
        return (
            record_to_technician(technician_record)
            if technician_record is not None
            else None
        )

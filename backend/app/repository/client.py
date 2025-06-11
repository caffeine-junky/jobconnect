from uuid import UUID
from typing import Optional, List, Tuple, Dict, Any
from asyncpg import Record  # type: ignore
from app.database import AsyncDatabase
from app.models import ClientInDB
from app.models.base import Location, PhoneNumber

RETURN_QUERY: str = """
    id,
    fullname,
    email,
    phone,
    hashed_password,
    location_name,
    ST_X(location) AS longitude,
    ST_Y(location) AS latitude,
    is_active,
    created_at
"""


class ClientRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db

    def record_to_client(self, record: Record) -> ClientInDB:
        """Convert a database record to a ClientInDB object"""
        return ClientInDB(
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
            is_active=record["is_active"],
            created_at=record["created_at"],
        )

    async def exists(self, email: str, phone: str) -> Tuple[bool, str]:
        """Check if a client with the given email or phone exists in the database."""
        query: str = "SELECT * FROM client WHERE email = $1"
        client: Optional[Record] = await self.db.fetchone(query, email)

        if client is not None:
            return True, "Client with email already exists"

        query = "SELECT * FROM client WHERE phone = $1"
        admin = await self.db.fetchone(query, phone)

        if admin is not None:
            return True, "Client with phone already exists"

        return False, "Client does not exist"

    async def create(self, data: Dict[str, Any]) -> Optional[ClientInDB]:
        """Create a new client in the database"""
        location_point: str = (
            f"POINT({data['location']['longitude']} {data['location']['latitude']})"
        )
        query: str = f"""
        INSERT INTO client (fullname, email, phone, hashed_password, location_name, location)
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
        client_record: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            self.record_to_client(client_record) if client_record is not None else None
        )

    async def readone(self, client_id: UUID) -> Optional[ClientInDB]:
        """Read one client from the database"""
        query: str = f"""
        SELECT {RETURN_QUERY}
        FROM client
        WHERE id = $1
        """
        client_record: Optional[Record] = await self.db.fetchone(query, client_id)
        return (
            self.record_to_client(client_record) if client_record is not None else None
        )

    async def readall(
        self,
        active: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[ClientInDB]:
        """Read all clients from the database"""
        filters: List[str] = []
        params: List[Any] = []
        if active is not None:
            filters.append(f"WHERE is_active = ${len(filters) + 1}")
            params.append(active)

        query: str = f"""
        SELECT {RETURN_QUERY}
        FROM client
        {f"WHERE {" AND ".join(filters)}" if filters else ""}
        OFFSET {len(params) + 1}
        LIMIT {len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        client_records: List[Record] = await self.db.fetchall(query, *values)
        return [
            self.record_to_client(client_record) for client_record in client_records
        ]

    async def update(
        self, client_id: UUID, data: Dict[str, Any]
    ) -> Optional[ClientInDB]:
        """Update an existing client"""
        updates: List[str] = [
            f"{key} = ${i}" for i, key in enumerate(data.keys(), start=2)
        ]
        query: str = f"""
        UPDATE client SET {", ".join(updates)}
        WHERE id = $1
        RETURNING {RETURN_QUERY}
        """
        values: Tuple[Any, ...] = (client_id, *data.values())
        updated_client: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            self.record_to_client(updated_client)
            if updated_client is not None
            else None
        )

    async def delete(self, client_id: UUID) -> bool:
        """Delete an existing client"""
        query: str = "DELETE FROM client WHERE id = $1"
        result: str = await self.db.execute(query, client_id)
        return "0" not in result

    async def readone_by_email(self, email: str) -> Optional[ClientInDB]:
        """Read one client from the database using their email"""
        query: str = f"SELECT {RETURN_QUERY} FROM client WHERE email = $1"
        client_record: Optional[Record] = await self.db.fetchone(query, email)
        return (
            self.record_to_client(client_record) if client_record is not None else None
        )

    async def add_favorite_technician(
        self, client_id: UUID, technician_id: UUID
    ) -> bool:
        """Add a favorite technician to a client"""
        query: str = (
            "INSERT INTO favorite_technician (client_id, technician_id) VALUES ($1, $2)"
        )
        result: str = await self.db.execute(query, client_id, technician_id)
        return "0" not in result

    async def remove_favorite_technician(
        self, client_id: UUID, technician_id: UUID
    ) -> bool:
        """Remove a favorite technician from a client"""
        query: str = "DELETE FROM favorite_technician WHERE client_id = $1 AND technician_id = $2"
        result: str = await self.db.execute(query, client_id, technician_id)
        return "0" not in result

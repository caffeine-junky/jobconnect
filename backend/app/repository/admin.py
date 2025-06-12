from uuid import UUID
from typing import Optional, List, Tuple, Dict, Any
from asyncpg import Record  # type: ignore
from app.database import AsyncDatabase
from app.models import AdminInDB
from app.models.enums import AdminRole


class AdminRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db

    def record_to_admin(self, record: Record) -> AdminInDB:
        """Convert a database record to an AdminInDB object."""
        return AdminInDB(
            fullname=record["fullname"],
            email=record["email"],
            phone=record["phone"],
            role=AdminRole(record["role"]),
            id=record["id"],
            hashed_password=record["hashed_password"],
            is_active=record["is_active"],
            created_at=record["created_at"],
        )

    async def exists(self, email: str, phone: str) -> Tuple[bool, str]:
        """Check if an admin with the given email or phone exists in the database."""
        query: str = "SELECT * FROM admin WHERE email = $1"
        admin: Optional[Record] = await self.db.fetchone(query, email)

        if admin is not None:
            return True, "Admin with email already exists"

        query = "SELECT * FROM admin WHERE phone = $1"
        admin = await self.db.fetchone(query, phone)

        if admin is not None:
            return True, "Admin with phone already exists"

        return False, "Admin does not exist"

    async def create(self, data: Dict[str, Any]) -> Optional[AdminInDB]:
        """Create a new admin in the database."""
        query: str = """
        INSERT INTO admin (fullname, email, phone, role, hashed_password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
        """
        values: Tuple[Any, ...] = (
            data["fullname"],
            data["email"],
            data["phone"],
            data["role"],
            data["hashed_password"],
        )
        admin_record: Optional[Record] = await self.db.fetchone(query, *values)
        return self.record_to_admin(admin_record) if admin_record is not None else None

    async def readone(self, admin_id: UUID) -> Optional[AdminInDB]:
        """Read one admin from the database."""
        query: str = "SELECT * FROM admin WHERE id = $1"
        admin_record: Optional[Record] = await self.db.fetchone(query, admin_id)
        return self.record_to_admin(admin_record) if admin_record is not None else None

    async def readall(
        self,
        active: Optional[bool] = None,
        role: Optional[AdminRole] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[AdminInDB]:
        """"""
        filters: List[str] = []
        params: List[Any] = []
        if active is not None:
            filters.append(f"is_active = ${len(filters) + 1}")
            params.append(active)
        if role is not None:
            filters.append(f"role = ${len(filters) + 1}")
            params.append(role)

        query: str = f"""
        SELECT * FROM admin
        {"WHERE " + " AND ".join(filters) if filters else ""}
        OFFSET ${len(params) + 1}
        LIMIT ${len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        admin_records: List[Record] = await self.db.fetchall(query, *values)
        return [self.record_to_admin(admin_record) for admin_record in admin_records]

    async def update(self, admin_id: UUID, data: Dict[str, Any]) -> Optional[AdminInDB]:
        """Update an existing admin"""
        updates: List[str] = [
            f"{key} = ${i}" for i, key in enumerate(data.keys(), start=2)
        ]
        query: str = f"""
        UPDATE admin SET {", ".join(updates)}
        WHERE id = $1
        RETURNING *
        """
        values: Tuple[Any, ...] = (admin_id, *data.values())
        updated_admin: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            self.record_to_admin(updated_admin) if updated_admin is not None else None
        )

    async def delete(self, admin_id: UUID) -> bool:
        """Delete an existing admin"""
        query: str = "DELETE FROM admin WHERE id = $1"
        result: str = await self.db.execute(query, admin_id)
        return (
            "0" not in result
        )  # Since the result will be DELETED 0 if the admin was not deleted

    async def readone_by_email(self, email: str) -> Optional[AdminInDB]:
        """Read one admin from the database using their email"""
        query: str = "SELECT * FROM admin WHERE email = $1"
        admin_record: Optional[Record] = await self.db.fetchone(query, email)
        return self.record_to_admin(admin_record) if admin_record is not None else None

    async def verify_technician(self, admin_id: UUID, technician_id: UUID) -> bool:
        """Verify a technician"""
        record: Optional[Record] = await self.db.fetchone(
            """
            SELECT COUNT(*) > 0 AS exists FROM verified_technician
            WHERE admin_id = $1 AND technician_id = $2
            """,
            admin_id,
            technician_id,
        )
        exists = record["exists"] if record else False
        if exists:
            return False

        query: str = (
            "INSERT INTO verified_technician (admin_id, technician_id) VALUES ($1, $2)"
        )
        await self.db.execute(query, admin_id, technician_id)
        return True

    async def set_user_active_status(
        self, user_id: UUID, user: str, status: bool
    ) -> bool:
        """Set the active status of a user"""
        query: str = f"UPDATE {user} SET is_active = $1 WHERE id = $2"
        await self.db.execute(query, status, user_id)
        return True

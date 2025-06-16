from uuid import UUID
from asyncpg import Record  # type: ignore
from typing import Optional, List, Tuple, Dict, Any, Callable
# from datetime import datetime
from app.database import AsyncDatabase
from app.models import PaymentInDB
from app.models.enums import PaymentStatus


class PaymentRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db

    def record_to_payment(self, record: Record) -> PaymentInDB:
        """Convert a database record to a PaymentInDB object."""
        return PaymentInDB(
            id=record["id"],
            booking_id=record["booking_id"],
            client_id=record["client_id"],
            technician_id=record["technician_id"],
            amount=record["amount"],
            status=record["status"],
            created_at=record["created_at"],
            updated_at=record["updated_at"],
        )

    async def exists(self, booking_id: UUID) -> bool:
        """"""
        query: str = "SELECT COUNT(*) AS count AS n FROM payment WHERE booking_id = $1"
        record: Optional[Record] = await self.db.fetchone(query, booking_id)
        return record["count"] > 0 if record is not None else False

    async def create(self, data: Dict[str, Any]) -> Optional[PaymentInDB]:
        """"""
        query: str = """
        INSERT INTO payment (client_id, technician_id, booking_id, price)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        """
        values: Tuple[Any, ...] = (
            data["client_id"],
            data["technician_id"],
            data["booking_id"],
            data["amount"],
        )
        record: Optional[Record] = await self.db.fetchone(query, *values)
        return self.record_to_payment(record) if record is not None else None

    async def readone(self, payment_id: UUID) -> Optional[PaymentInDB]:
        """"""
        query: str = "SELECT * FROM payment WHERE id = $1"
        record: Optional[Record] = await self.db.fetchone(query, payment_id)
        return self.record_to_payment(record) if record is not None else None

    async def readall_payments(
        self,
        client_id: Optional[UUID] = None,
        technician_id: Optional[UUID] = None,
        min_amount: Optional[float] = None,
        max_amount: Optional[float] = None,
        status: Optional[PaymentStatus] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[PaymentInDB]:
        """"""
        filters: List[str] = []
        params: List[Any] = []
        n: Callable[[int], int] = lambda x: len(filters) + x

        if client_id is not None:
            filters.append(f"client_id = ${n(1)}")
            params.append(client_id)
        if technician_id is not None:
            filters.append(f"technician_id = ${n(1)}")
            params.append(technician_id)
        if min_amount is not None:
            filters.append(f"amount >= ${n(1)}")
            params.append(min_amount)
        if max_amount is not None:
            filters.append(f"amount <= ${n(1)}")
            params.append(max_amount)
        if status is not None:
            filters.append(f"status = ${n(1)}")
            params.append(status)

        query: str = f"""
        SELECT * FROM payment
        {f"WHERE {" AND ".join(filters)}" if filters else ""}
        ORDER BY amount ASC
        OFFSET ${n(1)} LIMIT ${n(2)}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        records: List[Record] = await self.db.fetchall(query, *values)
        return [self.record_to_payment(r) for r in records]

    async def update(
        self, payment_id: UUID, data: Dict[str, Any]
    ) -> Optional[PaymentInDB]:
        """"""
        params: List[str] = [
            f"{key} = ${i}" for i, key in enumerate(data.keys(), start=2)
        ]
        query: str = f"""
        UPDATE payment SET updated_at = NOW(), {", ".join(params)}
        WHERE id = $1
        RETURNING *
        """
        values: Tuple[Any, ...] = tuple(data.values())
        record: Optional[Record] = await self.db.fetchone(query, *values)
        return self.record_to_payment(record) if record is not None else None

    async def delete(self, payment_id: UUID) -> bool:
        """"""
        query: str = "DELETE FROM payment WHERE id = $1"
        result: str = await self.db.execute(query, payment_id)
        return "0" not in result

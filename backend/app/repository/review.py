from uuid import UUID
from asyncpg import Record  # type: ignore
from typing import Any, Dict, List, Tuple, Optional
from app.database import AsyncDatabase
from app.models import ReviewInDB

RETURN_QUERY: str = """
id,
booking_id,
technician_id,
rating,
comment,
(SELECT fullname FROM client c WHERE c.id = client_id) AS client_name,
(SELECT service_name FROM booking b WHERE b.id = booking_id) AS service_name
"""


class ReviewRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db

    def record_to_review(self, record: Record) -> ReviewInDB:
        """Converts a database record to a ReviewInDB object"""
        return ReviewInDB(
            id=record["id"],
            booking_id=record["booking_id"],
            client_id=record["client_id"],
            technician_id=record["technician_id"],
            rating=record["rating"],
            comment=record["comment"],
            client_name=record["client_name"],
            service_name=record["service_name"],
            created_at=record["rating"],
        )

    async def exists(self, booking_id: UUID) -> bool:
        """"""
        query: str = "SELECT COUNT(*) > 0 AS c FROM review WHERE booking_id = $1"
        result = await self.db.fetchone(query, booking_id)
        if result is not None:
            return result["c"] > 0
        return False

    async def create(self, data: Dict[str, Any]) -> Optional[ReviewInDB]:
        """Create a new review"""
        query: str = """
        INSERT INTO review (booking_id, rating, comment)
        VALUES ($1, $2, $3)
        RETURNING *
        """
        values: Tuple[Any, ...] = tuple(data.values())
        review_record: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            self.record_to_review(review_record) if review_record is not None else None
        )

    async def readone(self, review_id: UUID) -> Optional[ReviewInDB]:
        """Read one review from the database"""
        query: str = "SELECT * FROM review WHERE id = $1"
        review_record: Optional[Record] = await self.db.fetchone(query, review_id)
        return (
            self.record_to_review(review_record) if review_record is not None else None
        )

    async def readall(
        self,
        client_id: Optional[UUID],
        technician_id: Optional[UUID],
        min_rating: Optional[int] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[ReviewInDB]:
        """Read all reviews from the database"""
        filters: List[str] = []
        params: List[Any] = []
        if client_id is not None:
            filters.append(f"client_id = ${len(filters) + 1}")
            params.append(client_id)
        if technician_id is not None:
            filters.append(f"technician_id = ${len(filters) + 1}")
            params.append(technician_id)
        if min_rating is not None:
            filters.append(f"rating >= ${len(filters) + 1}")
            params.append(min_rating)

        query: str = f"""
        SELECT * FROM review
        {"WHERE " + " AND ".join(filters) if filters else ""}
        OFFSET {len(params) + 1}
        LIMIT {len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        review_records: List[Record] = await self.db.fetchall(query, *values)
        return [
            self.record_to_review(review_record) for review_record in review_records
        ]

    async def update(
        self, review_id: UUID, data: Dict[str, Any]
    ) -> Optional[ReviewInDB]:
        """Update an existing review"""
        updates: List[str] = [
            f"{key} = ${i}" for i, key in enumerate(data.keys(), start=2)
        ]
        query: str = f"""
        UPDATE review SET {", ".join(updates)}
        WHERE id = $1
        RETURNING *
        """
        values: Tuple[Any, ...] = (review_id, *data.values())
        updated_review: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            self.record_to_review(updated_review)
            if updated_review is not None
            else None
        )

    async def delete(self, review_id: UUID) -> bool:
        """"""
        query: str = "DELETE FROM review WHERE id = $1"
        result: str = await self.db.execute(query, review_id)
        return "0" not in result

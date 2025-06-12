from uuid import UUID
from typing import Optional, List, Tuple, Dict, Any
from asyncpg import Record  # type: ignore
from app.database import AsyncDatabase
from app.models import NotificationInDB

RETURN_QUERY: str = """
id,
client_id,
technician_id,
title,
message,
is_read,
created_at
"""


class NotificationRepository:
    def __init__(self, db: AsyncDatabase):
        self.db = db
    
    def record_to_notification(self, record: Record) -> NotificationInDB:
        return NotificationInDB(
            id=record["id"],
            client_id=record["client_id"],
            technician_id=record["technician_id"],
            title=record["title"],
            message=record["message"],
            is_read=record["is_read"],
            created_at=record["created_at"],
        )
    
    async def create(self, data: Dict[str, Any]) -> Optional[NotificationInDB]:
        """Create a new notification"""
        query: str = """
        INSERT INTO notification (client_id, technician_id, title, message)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        """
        values: Tuple[Any, ...] = tuple(data.values())
        notification_record: Optional[Record] = await self.db.fetchone(query, *values)
        return (
            self.record_to_notification(notification_record) if notification_record is not None else None
        )
    
    async def readone(self, notification_id: UUID) -> Optional[NotificationInDB]:
        """Read one notification from the database"""
        query: str = "SELECT * FROM notification WHERE id = $1"
        notification_record: Optional[Record] = await self.db.fetchone(query, notification_id)
        return self.record_to_notification(notification_record) if notification_record is not None else None
    
    async def readall(self, read: Optional[bool] = None, skip: int = 0, limit: int = 100) -> List[NotificationInDB]:
        """Read all notifications from the database"""
        filters: List[str] = []
        params: List[Any] = []
        if read is not None:
            filters.append(f"is_read = ${len(filters) + 1}")
            params.append(read)

        query: str = f"""
        SELECT {RETURN_QUERY}
        FROM notification
        {"WHERE " + " AND ".join(filters) if filters else ""}
        OFFSET {len(params) + 1}
        LIMIT {len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        notification_records: List[Record] = await self.db.fetchall(query, *values)
        return [
            self.record_to_notification(notification_record) for notification_record in notification_records
        ]
    
    async def delete(self, notification_id: UUID) -> bool:
        """"""
        result: str = await self.db.execute("DELETE FROM notification WHERE id = $1", notification_id)
        return "0" not in result
    
    async def readall_by_client_id(
        self,
        client_id: UUID,
        read: Optional[bool] = None,
        skip: int = 0, limit: int = 100
        ) -> List[NotificationInDB]:
        """Read all notifications from the database"""
        filters: List[str] = []
        params: List[Any] = []
        filters.append(f"client_id = ${len(filters) + 1}")
        params.append(client_id)
        if read is not None:
            filters.append(f"is_read = ${len(filters) + 1}")
            params.append(read)

        query: str = f"""
        SELECT {RETURN_QUERY}
        FROM notification
        {"WHERE " + " AND ".join(filters) if filters else ""}
        OFFSET {len(params) + 1}
        LIMIT {len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        notification_records: List[Record] = await self.db.fetchall(query, *values)
        return [
            self.record_to_notification(notification_record) for notification_record in notification_records
        ]
    
    async def readall_by_technician_id(
        self,
        technician_id: UUID,
        read: Optional[bool] = None,
        skip: int = 0, limit: int = 100
        ) -> List[NotificationInDB]:
        """Read all notifications from the database"""
        filters: List[str] = []
        params: List[Any] = []
        filters.append(f"technician_id = ${len(filters) + 1}")
        params.append(technician_id)
        if read is not None:
            filters.append(f"is_read = ${len(filters) + 1}")
            params.append(read)

        query: str = f"""
        SELECT {RETURN_QUERY}
        FROM notification
        {"WHERE " + " AND ".join(filters) if filters else ""}
        OFFSET {len(params) + 1}
        LIMIT {len(params) + 2}
        """
        values: Tuple[Any, ...] = (*params, skip, limit)
        notification_records: List[Record] = await self.db.fetchall(query, *values)
        return [
            self.record_to_notification(notification_record) for notification_record in notification_records
        ]

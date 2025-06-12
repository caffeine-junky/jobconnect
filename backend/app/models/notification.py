from uuid import UUID
from pydantic import BaseModel
from datetime import datetime
from typing import Dict, Any, Optional


class BaseNotification(BaseModel):
    client_id: Optional[UUID]
    technician_id: Optional[UUID]
    title: str
    message: str


class NotificationInDB(BaseNotification):
    id: UUID
    is_read: bool
    created_at: datetime


class NotificationCreate(BaseNotification):

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "client_id": None,
                "title": "Booking Request",
                "message": "You have a new booking request about plumbing from Tumelo Modise in Soshanguve Block L",
            }
        }


class NotificationResponse(NotificationInDB):

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426655440000",
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "client_id": None,
                "title": "Booking Request",
                "message": "You have a new booking request about plumbing from Tumelo Modise in Soshanguve Block L",
                "is_read": False,
                "created_at": "2025-06-01T00:00:00",
            }
        }

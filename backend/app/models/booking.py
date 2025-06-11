from uuid import UUID
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime

from .base import TimeSlot, Location
from .enums import BookingStatus


class BaseBooking(BaseModel):
    client_id: UUID
    technician_id: UUID
    service_name: str
    description: str
    timeslot: TimeSlot
    location: Location


class BookingInDB(BaseBooking):
    id: UUID
    status: BookingStatus
    created_at: datetime


class BookingCreate(BaseBooking):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "client_id": "123e4567-e89b-12d3-a456-426655440000",
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "service_name": "plumbing",
                "description": "I need to fix a leaky tap",
                "timeslot": {
                    "slot_date": "2025-06-01",
                    "start_time": "10:00:00",
                    "end_time": "11:00:00",
                },
                "location": {
                    "location_name": "Soshanguve Block L",
                    "latitude": -26.243,
                    "longitude": 28.05,
                },
            }
        }


class BookingUpdate(BaseModel):
    status: Optional[BookingStatus] = None
    description: Optional[str] = None

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "status": BookingStatus.ACCEPTED,
                "description": "I need to fix a leaky tap",
            }
        }


class BookingResponse(BaseBooking):
    id: UUID
    status: BookingStatus
    created_at: datetime

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426655440000",
                "client_id": "123e4567-e89b-12d3-a456-426655440000",
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "service_name": "plumbing",
                "description": "I need to fix a leaky tap",
                "timeslot": {
                    "slot_date": "2025-06-01",
                    "start_time": "10:00:00",
                    "end_time": "11:00:00",
                },
                "location": {
                    "location_name": "Soshanguve Block L",
                    "latitude": -26.243,
                    "longitude": 28.05,
                },
                "status": BookingStatus.IN_PROGRESS,
                "created_at": "2025-06-01T00:00:00",
            }
        }

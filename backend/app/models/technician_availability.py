from uuid import UUID
from typing import Dict, Any, Optional
from pydantic import BaseModel

from .base import TimeSlotDay


class BaseTechnicianAvailability(BaseModel):
    technician_id: UUID
    timeslot: TimeSlotDay


class TechnicianAvailabilityInDB(BaseTechnicianAvailability):
    id: UUID
    active: bool


class TechnicianAvailabilityCreate(BaseTechnicianAvailability):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "timeslot": {
                    "day": 1,
                    "start_time": "10:00:00",
                    "end_time": "12:00:00",
                }
            }
        }


class TechnicianAvailabilityUpdate(BaseModel):
    timeslot: TimeSlotDay

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "timeslot": {
                    "day": 2,
                    "start_time": "10:00:00",
                    "end_time": "12:00:00",
                    "active": False
                },
            }
        }


class TechnicianAvailabilityResponse(TechnicianAvailabilityInDB):
    json_schema_extra: Dict[str, Any] = {
        "example": {
            "id": "123e4567-e89b-12d3-a456-426655440000",
            "technician_id": "123e4567-e89b-12d3-a456-426655440000",
            "timeslot": {
                "day": 3,
                "start_time": "10:00:00",
                "end_time": "12:00:00",
            },
            "active": True
        }
    }

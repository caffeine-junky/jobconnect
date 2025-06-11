from uuid import UUID
from typing import Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime


class ReviewInDB(BaseModel):
    id: UUID
    booking_id: UUID
    client_id: UUID
    technician_id: UUID
    rating: int
    comment: Optional[str]
    client_name: str
    service_name: str
    created_at: datetime


class ReviewCreate(BaseModel):
    booking_id: UUID
    client_id: UUID
    technician_id: UUID
    rating: int
    comment: Optional[str]

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "booking_id": "123e4567-e89b-12d3-a456-426655440000",
                "client_id": "123e4567-e89b-12d3-a456-426655440000",
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "rating": 5,
                "comment": "Great service!",
            }
        }


class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "rating": 5,
                "comment": "Great service!",
            }
        }


class ReviewResponse(BaseModel):
    id: UUID
    booking_id: UUID
    client_id: UUID
    technician_id: UUID
    rating: int
    comment: Optional[str]
    client_name: str
    service_name: str
    created_at: datetime

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426655440000",
                "booking_id": "123e4567-e89b-12d3-a456-426655440000",
                "client_id": "123e4567-e89b-12d3-a456-426655440000",
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "rating": 5,
                "comment": "Great service!",
                "client_name": "Tumelo Modise",
                "service_name": "plumbing",
                "created_at": "2025-06-01T00:00:00",
            }
        }

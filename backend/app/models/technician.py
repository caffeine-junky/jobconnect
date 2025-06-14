from uuid import UUID
from typing import Optional, Annotated, List, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

from .base import PhoneNumber, Location


class BaseTechnician(BaseModel):
    fullname: str
    email: EmailStr
    phone: Annotated[str, PhoneNumber]


class TechnicianInDB(BaseTechnician):
    id: UUID
    hashed_password: str
    location: Location
    rating: float
    services: List[str]
    is_available: bool
    is_verified: bool
    is_active: bool
    created_at: datetime


class TechnicianCreate(BaseTechnician):
    password: str = Field(min_length=3)
    location: Location

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "fullname": "Thabo Mabena",
                "email": "thabo12@gmail.com",
                "phone": "+27716916588",
                "password": "123",
                "location": {
                    "location_name": "Soshanguve Block L",
                    "latitude": -26.243,
                    "longitude": 28.05,
                },
            }
        }


class TechnicianUpdate(BaseModel):
    fullname: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[Annotated[str, PhoneNumber]] = None
    location: Optional[Location] = None
    services: Optional[List[str]] = None

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "fullname": "Thabo Mabena",
                "email": "thabo12@gmail.com",
                "phone": "+27716916588",
                "location": {
                    "location_name": "Soshanguve Block L",
                    "latitude": -26.243,
                    "longitude": 28.05,
                },
                "services": ["plumbing", "electrical"],
            }
        }


class TechnicianResponse(BaseTechnician):
    id: UUID
    location: Location
    rating: float
    services: List[str]
    is_available: bool
    is_verified: bool
    is_active: bool
    created_at: datetime

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "fullname": "Thabo Mabena",
                "email": "thabo12@gmail.com",
                "phone": "+27716916588",
                "location": {
                    "location_name": "Soshanguve Block L",
                    "latitude": -26.243,
                    "longitude": 28.05,
                },
                "rating": 4.2,
                "services": ["plumbing", "electrical"],
                "is_available": True,
                "is_verified": True,
                "is_active": True,
                "created_at": "2025-06-01T00:00:00",
            }
        }

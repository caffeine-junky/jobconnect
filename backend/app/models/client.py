from uuid import UUID
from typing import Optional, Annotated, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

from .base import PhoneNumber, Location


class BaseClient(BaseModel):
    fullname: str
    email: EmailStr
    phone: Annotated[str, PhoneNumber]


class ClientInDB(BaseClient):
    id: UUID
    hashed_password: str
    location: Location
    is_active: bool
    created_at: datetime


class ClientCreate(BaseClient):
    password: str = Field(min_length=3)
    location: Location

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "fullname": "Sbusiso Mathebula",
                "email": "sbusiso10@gmail.com",
                "phone": "+27727859876",
                "password": "123",
                "location": {
                    "location_name": "Soshanguve Block L",
                    "latitude": -26.243,
                    "longitude": 28.05,
                },
            }
        }


class ClientUpdate(BaseModel):
    fullname: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[Annotated[str, PhoneNumber]] = None
    location: Optional[Location] = None

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "fullname": "Sbusiso Mathebula",
                "email": "sbusiso10@gmail.com",
                "phone": "+27727859876",
                "location": {
                    "location_name": "Soshanguve Block L",
                    "latitude": -26.243,
                    "longitude": 28.05,
                },
            }
        }


class ClientResponse(BaseClient):
    id: UUID
    location: Location
    is_active: bool
    created_at: datetime

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "fullname": "Sbusiso Mathebula",
                "email": "sbusiso10@gmail.com",
                "phone": "+27727859876",
                "location": {
                    "location_name": "Soshanguve Block L",
                    "latitude": -26.243,
                    "longitude": 28.05,
                },
                "is_active": True,
                "created_at": "2025-06-01T00:00:00",
            }
        }

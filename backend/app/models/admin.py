from uuid import UUID
from typing import Optional, Annotated, Dict, Any
from pydantic import BaseModel, EmailStr, Field
from datetime import datetime

from .base import PhoneNumber
from .enums import AdminRole


class BaseAdmin(BaseModel):
    fullname: str
    email: EmailStr
    phone: Annotated[str, PhoneNumber]
    role: AdminRole


class AdminInDB(BaseAdmin):
    id: UUID
    hashed_password: str
    is_active: bool
    created_at: datetime


class AdminCreate(BaseAdmin):
    password: str = Field(min_length=3)

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "fullname": "Moses Kubeka",
                "email": "moses@jobconnect.com",
                "phone": "+27727859876",
                "password": "123",
                "role": AdminRole.SUPER_ADMIN,
            }
        }


class AdminUpdate(BaseModel):
    fullname: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[Annotated[str, PhoneNumber]] = None

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "fullname": "Moses Kubeka",
                "email": "moses@jobconnect.com",
                "phone": "+27727859876",
            }
        }


class AdminResponse(BaseAdmin):
    id: UUID
    is_active: bool
    created_at: datetime

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "fullname": "Moses Kubeka",
                "email": "moses@jobconnect.com",
                "phone": "+27727859876",
                "role": AdminRole.SUPER_ADMIN,
                "is_active": True,
                "created_at": "2025-06-01T00:00:00",
            }
        }

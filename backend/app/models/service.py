from uuid import UUID
from typing import Dict, Any
from pydantic import BaseModel
from datetime import datetime


class BaseService(BaseModel):
    name: str
    description: str


class ServiceInDB(BaseService):
    id: UUID
    created_at: datetime


class ServiceCreate(BaseService):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "name": "plumbing",
                "description": "",
            }
        }


class ServiceUpdate(BaseModel):
    description: str

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "description": "",
            }
        }


class ServiceResponse(ServiceInDB):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426655440000",
                "name": "plumbing",
                "description": "",
                "created_at": "2025-06-01T00:00:00",
            }
        }

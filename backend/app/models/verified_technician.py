from uuid import UUID
from typing import Dict, Any
from pydantic import BaseModel
from datetime import datetime


class BaseVerifiedTechnician(BaseModel):
    technician_id: UUID
    admin_id: UUID


class VerifiedTechnicianInDB(BaseVerifiedTechnician):
    created_at: datetime


class VerifiedTechnicianCreate(BaseVerifiedTechnician):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "admin_id": "123e4567-e89b-12d3-a456-426655440000",
            }
        }


class VerifiedTechnicianResponse(VerifiedTechnicianInDB):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "admin_id": "123e4567-e89b-12d3-a456-426655440000",
                "created_at": "2025-06-01T00:00:00",
            }
        }

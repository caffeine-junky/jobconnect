from uuid import UUID
from pydantic import BaseModel
from typing import Dict, Any
from pydantic import BaseModel


class BaseTechnicianService(BaseModel):
    technician_id: UUID
    service_id: UUID


class TechnicianServiceInDB(BaseTechnicianService): ...


class TechnicianServiceCreate(BaseTechnicianService):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "service_id": "123e4567-e89b-12d3-a456-426655440000",
            }
        }


class TechnicianServiceResponse(BaseTechnicianService):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "service_id": "123e4567-e89b-12d3-a456-426655440000",
            }
        }

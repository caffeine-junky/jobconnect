from uuid import UUID
from pydantic import BaseModel
from typing import Dict, Any
from pydantic import BaseModel, Field


class BaseTechnicianService(BaseModel):
    technician_id: UUID
    service_id: UUID
    experience_years: int
    price: float = Field(gt=0)


class TechnicianServiceInDB(BaseTechnicianService): ...


class TechnicianServiceCreate(BaseTechnicianService):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "service_id": "123e4567-e89b-12d3-a456-426655440000",
                "experience_years": 2,
                "price": 150.00
            }
        }


class TechnicianServiceUpdate(BaseModel):
    experience_years: int


class TechnicianServiceResponse(BaseTechnicianService):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "service_id": "123e4567-e89b-12d3-a456-426655440000",
                "experience_years": 2,
                "price": 150.00
            }
        }

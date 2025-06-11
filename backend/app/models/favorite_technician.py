from uuid import UUID
from pydantic import BaseModel
from typing import Dict, Any
from pydantic import BaseModel


class BaseFavoriteTechnician(BaseModel):
    technician_id: UUID
    client_id: UUID


class FavoriteTechnicianInDB(BaseFavoriteTechnician): ...


class FavoriteTechnicianCreate(BaseFavoriteTechnician):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "client_id": "123e4567-e89b-12d3-a456-426655440000",
            }
        }


class FavoriteTechnicianResponse(BaseFavoriteTechnician):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "client_id": "123e4567-e89b-12d3-a456-426655440000",
            }
        }

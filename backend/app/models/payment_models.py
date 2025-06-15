from uuid import UUID
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

from .enums import PaymentStatus


class BasePayment(BaseModel):
    booking_id: UUID
    client_id: UUID
    technician_id: UUID
    amount: float = Field(gt=0)


class PaymentInDB(BasePayment):
    id: UUID
    status: PaymentStatus
    created_at: datetime
    updated_at: datetime


class PaymentCreate(BasePayment):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "booking_id": "123e4567-e89b-12d3-a456-426655440000",
                "client_id": "123e4567-e89b-12d3-a456-426655440000",
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "amount": 100.00,
            }
        }


class PaymentUpdate(BaseModel):
    amount: Optional[float] = Field(gt=0)
    status: Optional[PaymentStatus]

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {"status": PaymentStatus.EZCROW}
        }


class PaymentResponse(PaymentInDB):
    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426655440000",
                "booking_id": "123e4567-e89b-12d3-a456-426655440000",
                "client_id": "123e4567-e89b-12d3-a456-426655440000",
                "technician_id": "123e4567-e89b-12d3-a456-426655440000",
                "amount": 100.00,
                "status": PaymentStatus.EZCROW,
                "created_at": "2025-06-01T00:00:00",
                "updated_at": "2025-06-01T00:00:00",
            }
        }

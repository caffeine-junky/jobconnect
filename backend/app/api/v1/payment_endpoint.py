from uuid import UUID
from typing import Optional, List
from fastapi import APIRouter, Depends
from app.models import PaymentCreate, PaymentUpdate, PaymentResponse
from app.models.enums import PaymentStatus
from app.services import PaymentService
from app.dependencies import get_payment_service, payment_service_dependency

router: APIRouter = APIRouter(prefix="/payment", tags=["Payment"])


@router.post("/", response_model=PaymentResponse, status_code=201)
async def create_payment(
    data: PaymentCreate, service: payment_service_dependency
) -> PaymentResponse:
    """"""
    return await service.create_payment(data)


@router.get("/{payment_id}", response_model=PaymentResponse, status_code=200)
async def readone_payment(
    payment_id: UUID, service: payment_service_dependency
) -> PaymentResponse:
    """"""
    return await service.readone_payment(payment_id)


@router.get("/", response_model=List[PaymentResponse], status_code=200)
async def readall_payments(
    client_id: Optional[UUID] = None,
    technician_id: Optional[UUID] = None,
    min_amount: Optional[float] = None,
    max_amount: Optional[float] = None,
    status: Optional[PaymentStatus] = None,
    skip: int = 0,
    limit: int = 100,
    service: PaymentService = Depends(get_payment_service)
) -> List[PaymentResponse]:
    """"""
    return await service.readall_payments(
        client_id,
        technician_id,
        min_amount,
        max_amount,
        status,
        skip,
        limit
    )

@router.put("/{payment_id}", response_model=PaymentResponse, status_code=200)
async def update_payment(
    payment_id: UUID,
    data: PaymentUpdate,
    service: payment_service_dependency
) -> PaymentResponse:
    """"""
    return await service.update_payment(payment_id, data)


@router.delete("/{payment_id}", response_model=bool, status_code=200)
async def delete_payment(
    payment_id: UUID,
    service: payment_service_dependency
) -> bool:
    """"""
    return await service.delete_payment(payment_id)

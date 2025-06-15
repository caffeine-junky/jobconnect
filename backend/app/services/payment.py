from uuid import UUID
from typing import Any, Dict, Optional, List
from app.models import PaymentInDB, PaymentCreate, PaymentResponse, PaymentUpdate
from app.models.enums import PaymentStatus
from app.repository import PaymentRepository
from app.utils.exceptions import (
    NotFoundException,
    ConflictException,
    InternalServerException,
)


class PaymentService:
    def __init__(self, repo: PaymentRepository) -> None:
        self.repo = repo

    def payment_in_db_to_response(self, payment: PaymentInDB) -> PaymentResponse:
        """"""
        return PaymentResponse(**payment.model_dump())

    async def create_payment(self, data: PaymentCreate) -> PaymentResponse:
        """"""
        if await self.repo.exists(data.booking_id):
            raise ConflictException("Payment already exists")
        payment: Optional[PaymentInDB] = await self.repo.create(data.model_dump())
        if payment is None:
            raise InternalServerException("Error creating payment")
        return self.payment_in_db_to_response(payment)

    async def readone_payment(self, payment_id: UUID) -> PaymentResponse:
        """"""
        payment: Optional[PaymentInDB] = await self.repo.readone(payment_id)
        if payment is None:
            raise NotFoundException("Payment not found")
        return self.payment_in_db_to_response(payment)

    async def readall_payments(
        self,
        client_id: Optional[UUID] = None,
        technician_id: Optional[UUID] = None,
        min_amount: Optional[float] = None,
        max_amount: Optional[float] = None,
        status: Optional[PaymentStatus] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[PaymentResponse]:
        """"""
        payments: List[PaymentInDB] = await self.repo.readall_payments(
            client_id, technician_id, min_amount, max_amount, status, skip, limit
        )
        return [self.payment_in_db_to_response(p) for p in payments]

    async def update_payment(
        self, payment_id: UUID, data: PaymentUpdate
    ) -> PaymentResponse:
        """"""
        payment: Optional[PaymentInDB] = await self.repo.readone(payment_id)
        if payment is None:
            raise NotFoundException("Payment not found")
        update_data: Dict[str, Any] = data.model_dump(exclude_unset=True)
        if len(update_data) == 0:
            return self.payment_in_db_to_response(payment)
        payment = await self.repo.update(payment_id, update_data)
        if payment is None:
            raise InternalServerException("Failed to update payment")
        return self.payment_in_db_to_response(payment)

    async def delete_payment(self, payment_id: UUID) -> bool:
        """"""
        return await self.repo.delete(payment_id)

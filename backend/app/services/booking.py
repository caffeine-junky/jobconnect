from uuid import UUID
from typing import Optional, List
from datetime import date
from app.models import BookingInDB, BookingCreate, BookingUpdate, BookingResponse
from app.models.enums import BookingStatus
from app.repository import BookingRepository
from app.utils.exceptions import (
    NotFoundException,
    ConflictException,
    InternalServerException,
)


def booking_in_db_to_response(booking: BookingInDB) -> BookingResponse:
    """Convert a BookingInDB object to a BookingResponse object"""
    return BookingResponse(**booking.model_dump())


class BookingService:
    def __init__(self, repo: BookingRepository) -> None:
        self.repo = repo

    async def create_booking(self, data: BookingCreate) -> BookingResponse:
        """"""
        if await self.repo.collides(data.technician_id, data.timeslot):
            raise ConflictException(
                f"Technician already has a booking at {str(data.timeslot)}, try a different time."
            )
        booking: Optional[BookingInDB] = await self.repo.create(data.model_dump())
        if booking is None:
            raise InternalServerException("Error creating booking")
        return booking_in_db_to_response(booking)

    async def readone_booking(self, booking_id: UUID) -> BookingResponse:
        """"""
        booking: Optional[BookingInDB] = await self.repo.readone(booking_id)
        if booking is None:
            raise NotFoundException("Booking not found")
        return booking_in_db_to_response(booking)

    async def readall_bookings(
        self,
        client_id: Optional[UUID] = None,
        technician_id: Optional[UUID] = None,
        status: Optional[BookingStatus] = None,
        booking_date: Optional[date] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[BookingResponse]:
        """"""
        bookings: List[BookingInDB] = await self.repo.readall(
            client_id,
            technician_id,
            status,
            booking_date,
            skip,
            limit,
        )
        return [booking_in_db_to_response(booking) for booking in bookings]

    async def update_booking(
        self, booking_id: UUID, data: BookingUpdate
    ) -> BookingResponse:
        """"""
        booking: Optional[BookingInDB] = await self.repo.readone(booking_id)
        if booking is None:
            raise NotFoundException("Booking not found")
        booking: Optional[BookingInDB] = await self.repo.update(
            booking_id, data.model_dump()
        )
        if booking is None:
            raise InternalServerException("Error updating booking")
        return booking_in_db_to_response(booking)

    async def delete_booking(self, admin_id: UUID) -> bool:
        """"""
        return await self.repo.delete(admin_id)

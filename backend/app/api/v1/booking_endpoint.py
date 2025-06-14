from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends
from datetime import date
from app.models import BookingCreate, BookingResponse, BookingUpdate
from app.models.enums import BookingStatus
from app.dependencies import get_booking_service, booking_service_dependency
from app.services import BookingService

router: APIRouter = APIRouter(prefix="/booking", tags=["Booking"])


@router.post("/", response_model=BookingResponse, status_code=201)
async def create_booking(
    data: BookingCreate,
    service: booking_service_dependency
) -> BookingResponse:
    """"""
    return await service.create_booking(data)


@router.get("/{booking_id}", response_model=BookingResponse, status_code=200)
async def readone_booking(booking_id: UUID, service: booking_service_dependency) -> BookingResponse:
    """"""
    return await service.readone_booking(booking_id)


@router.get("/", response_model=List[BookingResponse], status_code=200)
async def readall_bookings(
    client_id: Optional[UUID] = None,
    technician_id: Optional[UUID] = None,
    status: Optional[BookingStatus] = None,
    booking_date: Optional[date] = None,
    skip: int = 0,
    limit: int = 100,
    service: BookingService = Depends(get_booking_service)
) -> List[BookingResponse]:
    """"""
    return await service.readall_bookings(
        client_id,
        technician_id,
        status,
        booking_date,
        skip,
        limit
    )


@router.put("/{booking_id}", response_model=BookingResponse, status_code=200)
async def update_booking(
    booking_id: UUID,
    data: BookingUpdate,
    service: booking_service_dependency
) -> BookingResponse:
    """"""
    return await service.update_booking(booking_id, data)


@router.delete("/{booking_id}", response_model=bool, status_code=200)
async def delete_booking(
    booking_id: UUID,
    service: booking_service_dependency
) -> bool:
    """"""
    return await service.delete_booking(booking_id)

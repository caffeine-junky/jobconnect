from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends
from app.models import (
    TechnicianAvailabilityCreate,
    TechnicianAvailabilityResponse,
    TechnicianAvailabilityUpdate,
)
from app.services import TechnicianAvailablityService
from app.dependencies import (
    technician_availability_service_dependency,
    get_technician_availability_service,
)

router: APIRouter = APIRouter(
    prefix="/technician_availability", tags=["Technician Availability"]
)


@router.post("/", response_model=TechnicianAvailabilityResponse, status_code=201)
async def create_technician_availability(
    data: TechnicianAvailabilityCreate,
    technician_availability_service: technician_availability_service_dependency,
) -> TechnicianAvailabilityResponse:
    return await technician_availability_service.create_technician_availability(data)


@router.get(
    "/{technician_availability_id}",
    response_model=TechnicianAvailabilityResponse,
    status_code=200,
)
async def readone_technician_availability(
    technician_availability_id: UUID,
    technician_availability_service: technician_availability_service_dependency,
) -> TechnicianAvailabilityResponse:
    return await technician_availability_service.readone_technician_availability(
        technician_availability_id
    )


@router.get("/", response_model=List[TechnicianAvailabilityResponse], status_code=200)
async def readall_technician_availabilities(
    day: Optional[int] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    technician_availability_service: TechnicianAvailablityService = Depends(
        get_technician_availability_service
    ),
) -> List[TechnicianAvailabilityResponse]:
    return await technician_availability_service.readall_technician_availabilities(
        day, start_time, end_time, skip, limit
    )


@router.get(
    "/technician/{technician_id}",
    response_model=List[TechnicianAvailabilityResponse],
    status_code=200,
)
async def readall_technician_availabilities_by_technician_id(
    technician_id: UUID,
    day: Optional[int] = None,
    start_time: Optional[str] = None,
    end_time: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    technician_availability_service: TechnicianAvailablityService = Depends(
        get_technician_availability_service
    ),
) -> List[TechnicianAvailabilityResponse]:
    return await technician_availability_service.readall_technician_availabilities_by_technician_id(
        technician_id, day, start_time, end_time, skip, limit
    )


@router.put(
    "/{technician_availability_id}",
    response_model=TechnicianAvailabilityResponse,
    status_code=200,
)
async def update_technician_availability(
    technician_availability_id: UUID,
    technician_id: UUID,
    data: TechnicianAvailabilityUpdate,
    technician_availability_service: TechnicianAvailablityService = Depends(
        get_technician_availability_service
    ),
) -> TechnicianAvailabilityResponse:
    return await technician_availability_service.update_technician_availability(
        technician_availability_id, technician_id, data
    )


@router.delete("/{technician_availability_id}", response_model=bool, status_code=200)
async def delete_technician_availability(
    technician_availability_id: UUID,
    technician_availability_service: TechnicianAvailablityService = Depends(
        get_technician_availability_service
    ),
) -> bool:
    return await technician_availability_service.delete_technician_availability(
        technician_availability_id
    )

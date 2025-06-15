from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends
from app.models import (
    TechnicianServiceCreate,
    TechnicianServiceResponse,
    TechnicianServiceUpdate,
)
from app.dependencies import (
    technician_service_service_dependency,
    get_technician_service_service,
)
from app.services import TechnicianServiceService

router: APIRouter = APIRouter(prefix="/technician_service", tags=["Technician Service"])


@router.post("/", response_model=TechnicianServiceResponse, status_code=201)
async def create_technician_service(
    data: TechnicianServiceCreate,
    service: technician_service_service_dependency,
) -> TechnicianServiceResponse:
    return await service.create_technician_service(data)


@router.get("/", response_model=List[TechnicianServiceResponse], status_code=200)
async def readall_technician_services(
    technician_id: Optional[UUID] = None,
    service_id: Optional[UUID] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    skip: int = 0,
    limit: int = 100,
    service: TechnicianServiceService = Depends(get_technician_service_service),
) -> List[TechnicianServiceResponse]:
    return await service.readall_technician_services(
        technician_id, service_id, min_price, max_price, skip, limit
    )


@router.get(
    "/{technician_service_id}",
    response_model=TechnicianServiceResponse,
    status_code=200,
)
async def readone_technician_service(
    technician_service_id: UUID,
    service: TechnicianServiceService = Depends(get_technician_service_service),
) -> TechnicianServiceResponse:
    return await service.readone_technician_service(technician_service_id)


@router.put(
    "/{technician_service_id}",
    response_model=TechnicianServiceResponse,
    status_code=200,
)
async def update_technician_service(
    technician_service_id: UUID,
    data: TechnicianServiceUpdate,
    service: TechnicianServiceService = Depends(get_technician_service_service),
) -> TechnicianServiceResponse:
    return await service.update_technician_service(technician_service_id, data)


@router.delete("/{technician_service_id}", response_model=bool, status_code=200)
async def delete_technician_service(
    technician_service_id: UUID,
    service: TechnicianServiceService = Depends(get_technician_service_service),
) -> bool:
    return await service.delete_technician_service(technician_service_id)

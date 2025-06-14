from uuid import UUID
from fastapi import APIRouter, Depends
from typing import List, Optional
from app.models import TechnicianCreate, TechnicianUpdate, TechnicianResponse
from app.services import TechnicianService
from app.dependencies import get_technician_service, technician_service_dependency

router: APIRouter = APIRouter(prefix="/technician", tags=["Technician"])


@router.post("/", response_model=TechnicianResponse, status_code=201)
async def create_technician(
    data: TechnicianCreate, service: technician_service_dependency
) -> TechnicianResponse:
    """Create a new technician"""
    return await service.create_technician(data)


@router.get("/{technician_id}", response_model=TechnicianResponse, status_code=200)
async def readone_technician(
    technician_id: UUID, service: technician_service_dependency
) -> TechnicianResponse:
    """Read one technician"""
    return await service.readone_technician(technician_id)


@router.get("/", response_model=List[TechnicianResponse], status_code=200)
async def readall_technicians(
    active: Optional[bool] = None,
    is_available: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    service: TechnicianService = Depends(get_technician_service),
) -> List[TechnicianResponse]:
    """Read all technicians"""
    return await service.readall_technicians(active, is_available, skip, limit)


@router.put("/{technician_id}", response_model=TechnicianResponse, status_code=200)
async def update_technician(
    technician_id: UUID, data: TechnicianUpdate, service: technician_service_dependency
) -> TechnicianResponse:
    """Update a technician"""
    return await service.update_technician(technician_id, data)


@router.delete("/{technician_id}", status_code=200)
async def delete_technician(technician_id: UUID, service: technician_service_dependency) -> bool:
    """Delete a technician"""
    return await service.delete_technician(technician_id)

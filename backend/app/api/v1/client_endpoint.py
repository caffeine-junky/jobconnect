from uuid import UUID
from fastapi import APIRouter, Depends
from typing import List, Optional
from app.models import ClientCreate, ClientUpdate, ClientResponse
from app.services import ClientService
from app.dependencies import get_client_service, client_service_dependency

router: APIRouter = APIRouter(prefix="/client", tags=["Client"])


@router.post("/", response_model=ClientResponse, status_code=201)
async def create_client(
    data: ClientCreate, service: client_service_dependency
) -> ClientResponse:
    """Create a new client"""
    return await service.create_client(data)


@router.get("/{client_id}", response_model=ClientResponse, status_code=200)
async def readone_client(
    client_id: UUID, service: client_service_dependency
) -> ClientResponse:
    """Read one client"""
    return await service.readone_client(client_id)


@router.get("/", response_model=List[ClientResponse], status_code=200)
async def readall_clients(
    active: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    service: ClientService = Depends(get_client_service),
) -> List[ClientResponse]:
    """Read all clients"""
    return await service.readall_clients(active, skip, limit)


@router.put("/{client_id}", response_model=ClientResponse, status_code=200)
async def update_client(
    client_id: UUID, data: ClientUpdate, service: client_service_dependency
) -> ClientResponse:
    """Update a client"""
    return await service.update_client(client_id, data)


@router.delete("/{client_id}", status_code=200)
async def delete_client(client_id: UUID, service: client_service_dependency) -> bool:
    """Delete a client"""
    return await service.delete_client(client_id)


@router.post("/technician/{client_id}/{technician_id}", status_code=200)
async def add_favorite_technician(
    client_id: UUID, technician_id: UUID, service: client_service_dependency
) -> bool:
    """Add a favorite technician to a client"""
    return await service.add_favorite_technician(client_id, technician_id)


@router.delete("/technician/{client_id}/{technician_id}", status_code=200)
async def remove_favorite_technician(
    client_id: UUID, technician_id: UUID, service: client_service_dependency
) -> bool:
    """Remove a favorite technician from a client"""
    return await service.remove_favorite_technician(client_id, technician_id)

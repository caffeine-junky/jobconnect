from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends
from app.models import ServiceCreate, ServiceResponse, ServiceUpdate
from app.dependencies import service_service_dependency, get_service_service
from app.services import ServiceService

router: APIRouter = APIRouter(prefix="/service", tags=["Service"])


@router.post("/", response_model=ServiceResponse, status_code=201)
async def create_service(
    data: ServiceCreate, service: service_service_dependency
) -> ServiceResponse:
    """"""
    return await service.create_service(data)


@router.get("/{service_id}", response_model=ServiceResponse, status_code=200)
async def readone_service(
    service_id: UUID, service: service_service_dependency
) -> ServiceResponse:
    """"""
    return await service.readone_service(service_id)


@router.get("/", response_model=List[ServiceResponse], status_code=200)
async def readall_services(
    skip: int = 0,
    limit: int = 100,
    service: ServiceService = Depends(get_service_service),
) -> List[ServiceResponse]:
    """"""
    return await service.readall_services(skip, limit)


@router.put("/", response_model=ServiceResponse, status_code=200)
async def update_service(
    service_id: UUID, data: ServiceUpdate, service: service_service_dependency
) -> ServiceResponse:
    """"""
    return await service.update_service(service_id, data)


@router.delete("/{service_id}", response_model=bool, status_code=200)
async def delete_service(service_id: UUID, service: service_service_dependency) -> bool:
    """"""
    return await service.delete_service(service_id)


@router.get("/lookup/{name}", response_model=ServiceResponse, status_code=200)
async def readone_service_by_name(
    name: str, service: service_service_dependency
) -> ServiceResponse:
    """"""
    return await service.readone_service_by_name(name.lower())

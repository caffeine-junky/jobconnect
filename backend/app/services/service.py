from uuid import UUID
from typing import Optional, List
from app.models import ServiceInDB, ServiceCreate, ServiceUpdate, ServiceResponse
from app.repository import ServiceRepository
from app.utils.exceptions import (
    NotFoundException,
    InternalServerException,
    ConfictException,
)


def service_in_db_to_response(service: ServiceInDB) -> ServiceResponse:
    """"""
    return ServiceResponse(**service.model_dump())


class ServiceService:
    def __init__(self, repo: ServiceRepository) -> None:
        self.repo = repo

    async def create_service(self, data: ServiceCreate) -> ServiceResponse:
        """"""
        if await self.repo.exists(data.name):
            raise ConfictException(f"{data.name} service already exists")
        service: Optional[ServiceInDB] = await self.repo.create(data.model_dump())
        if service is None:
            raise InternalServerException("Error creating service")
        return service_in_db_to_response(service)

    async def readone_service(self, service_id: UUID) -> ServiceResponse:
        """"""
        service: Optional[ServiceInDB] = await self.repo.readone(service_id)
        if service is None:
            raise NotFoundException("Service not found")
        return service_in_db_to_response(service)

    async def readall_services(
        self, skip: int = 0, limit: int = 100
    ) -> List[ServiceResponse]:
        """"""
        services: List[ServiceInDB] = await self.repo.readall(skip, limit)
        return [service_in_db_to_response(service) for service in services]

    async def update_service(
        self, service_id: UUID, data: ServiceUpdate
    ) -> ServiceResponse:
        """"""
        service: Optional[ServiceInDB] = await self.repo.readone(service_id)
        if service is None:
            raise NotFoundException("Service not found")
        service: Optional[ServiceInDB] = await self.repo.update(
            service_id, data.model_dump()
        )
        if service is None:
            raise InternalServerException("Error updating service")
        return service_in_db_to_response(service)

    async def delete_service(self, service_id: UUID) -> bool:
        """"""
        return await self.repo.delete(service_id)

    async def readone_service_by_name(self, service_name: str) -> ServiceResponse:
        """"""
        service: Optional[ServiceInDB] = await self.repo.readone_by_name(service_name)
        if service is None:
            raise NotFoundException(f"Service {service_name} not found")
        return service_in_db_to_response(service)

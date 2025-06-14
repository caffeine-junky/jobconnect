from uuid import UUID
from typing import Any, Dict, Optional, List
from app.models import (
    TechnicianServiceInDB,
    TechnicianServiceCreate,
    TechnicianServiceResponse,
    TechnicianServiceUpdate,
)
from app.repository import TechnicianServiceRepository
from app.utils.exceptions import (
    NotFoundException,
    ConfictException,
    InternalServerException,
)


class TechnicianServiceService:
    def __init__(self, repo: TechnicianServiceRepository) -> None:
        self.repo = repo

    def technician_service_in_db_to_response(
        self, ts: TechnicianServiceInDB
    ) -> TechnicianServiceResponse:
        """"""
        return TechnicianServiceResponse(**ts.model_dump())

    async def create_technician_service(
        self, data: TechnicianServiceCreate
    ) -> TechnicianServiceResponse:
        """"""
        if await self.repo.technician_has_service(data.technician_id, data.service_id):
            raise ConfictException("Technician already has this service")
        technician_service: Optional[TechnicianServiceInDB] = await self.repo.create(
            data.model_dump()
        )
        if technician_service is None:
            raise InternalServerException("Error creating technician service")
        return self.technician_service_in_db_to_response(technician_service)

    async def readone_technician_service(
        self, technician_service_id: UUID
    ) -> TechnicianServiceResponse:
        """"""
        technician_service: Optional[TechnicianServiceInDB] = await self.repo.readone(
            technician_service_id
        )
        if technician_service is None:
            raise NotFoundException("Technician service not found")
        return self.technician_service_in_db_to_response(technician_service)

    async def readall_technician_services(
        self,
        technician_id: Optional[UUID] = None,
        service_id: Optional[UUID] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianServiceResponse]:
        """"""
        technician_services: List[TechnicianServiceInDB] = await self.repo.readall(
            technician_id, service_id, min_price, max_price, skip, limit
        )
        return [
            self.technician_service_in_db_to_response(ts) for ts in technician_services
        ]

    async def update_technician_service(
        self, technician_service_id: UUID, data: TechnicianServiceUpdate
    ) -> TechnicianServiceResponse:
        """"""
        ts: Optional[TechnicianServiceInDB] = await self.repo.readone(
            technician_service_id
        )
        if ts is None:
            raise NotFoundException("Technician service not found")
        update_data: Dict[str, Any] = data.model_dump(exclude_unset=True)
        if len(update_data) == 0:
            return self.technician_service_in_db_to_response(ts)
        technician_service: Optional[TechnicianServiceInDB] = await self.repo.update(
            technician_service_id, update_data
        )
        if technician_service is None:
            raise NotFoundException("Technician service not found")
        return self.technician_service_in_db_to_response(technician_service)

    async def delete_technician_service(self, technician_service_id: UUID) -> bool:
        """"""
        return await self.repo.delete(technician_service_id)

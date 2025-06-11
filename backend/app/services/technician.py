from uuid import UUID
from typing import Any, Dict, List, Optional
from app.models import (
    TechnicianInDB,
    TechnicianCreate,
    TechnicianResponse,
    TechnicianUpdate,
)
from app.repository import TechnicianRepository
from app.utils.security import SecurityUtils
from app.utils.exceptions import (
    NotFoundException,
    ConfictException,
    InternalServerException,
)


def technician_in_db_to_response(technician: TechnicianInDB) -> TechnicianResponse:
    """Convert a TechnicianInDB object to a TechnicianResponse object"""
    return TechnicianResponse(**technician.model_dump(exclude={"hashed_password"}))


class TechnicianService:
    def __init__(self, repo: TechnicianRepository) -> None:
        self.repo = repo

    async def create_technician(self, data: TechnicianCreate) -> TechnicianResponse:
        """"""
        exists, message = await self.repo.exists(data.email, data.phone)
        if exists:
            raise ConfictException(message)
        hashed_password: str = SecurityUtils.hash_password(data.password)
        technician: Optional[TechnicianInDB] = await self.repo.create(
            {
                "hashed_password": hashed_password,
                **data.model_dump(exclude={"password"}),
            }
        )
        if technician is None:
            raise InternalServerException("Error creating technician")
        return technician_in_db_to_response(technician)

    async def readone_technician(self, technician_id: UUID) -> TechnicianResponse:
        """"""
        technician: Optional[TechnicianInDB] = await self.repo.readone(technician_id)
        if technician is None:
            raise NotFoundException(f"Technician with id '{technician_id}' not found")
        return technician_in_db_to_response(technician)

    async def readall_technicians(
        self,
        active: Optional[bool] = None,
        is_available: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianResponse]:
        """"""
        technicians: List[TechnicianInDB] = await self.repo.readall(
            active, is_available, skip, limit
        )
        return [technician_in_db_to_response(technician) for technician in technicians]

    async def update_technician(
        self, technician_id: UUID, data: TechnicianUpdate
    ) -> TechnicianResponse:
        """"""
        technician: Optional[TechnicianInDB] = await self.repo.readone(technician_id)
        if technician is None:
            raise NotFoundException(f"Technician with id '{technician_id}' not found")

        update_data: Dict[str, Any] = data.model_dump(exclude_unset=True)
        if len(update_data) == 0:
            return technician_in_db_to_response(technician)

        if "password" in update_data:
            hashed_password: str = SecurityUtils.hash_password(
                update_data.pop("password")
            )
            update_data["hashed_password"] = hashed_password

        technician: Optional[TechnicianInDB] = await self.repo.update(
            technician_id, update_data
        )
        if technician is None:
            raise InternalServerException("Error updating technician")
        return technician_in_db_to_response(technician)

    async def delete_technician(self, technician_id: UUID) -> bool:
        """"""
        return await self.repo.delete(technician_id)

    async def authenticate(
        self, email: str, password: str
    ) -> Optional[TechnicianResponse]:
        """"""
        technician: Optional[TechnicianInDB] = await self.repo.readone_by_email(email)
        if technician is None:
            return None
        if not SecurityUtils.verify_password(password, technician.hashed_password):
            return None
        return technician_in_db_to_response(technician)

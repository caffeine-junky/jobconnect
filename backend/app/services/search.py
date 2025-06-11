from uuid import UUID
from typing import Optional, List
from app.models import TechnicianInDB, TechnicianResponse
from app.models.base import Location
from app.repository import SearchRepository
from app.utils.exceptions import NotImplementedException

from .technician import technician_in_db_to_response


class SearchService:
    def __init__(self, repo: SearchRepository) -> None:
        self.repo = repo

    async def search_nearby_technicians(
        self,
        client_id: UUID,
        radius_km: float,
        service_names: Optional[List[str]] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianResponse]:
        """"""
        technicians: List[TechnicianInDB] = await self.repo.search_nearby_technicians(
            client_id, abs(radius_km), service_names, skip, limit
        )
        return [technician_in_db_to_response(technician) for technician in technicians]

    async def search_technicians_by_description(
        self,
        client_id: UUID,
        problem_description: str,
        radius_km: float,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianResponse]:
        """"""
        technicians: List[
            TechnicianInDB
        ] = await self.repo.search_technicians_by_description(
            client_id, problem_description, abs(radius_km), skip, limit
        )
        return [technician_in_db_to_response(technician) for technician in technicians]

    async def search_external_technicians(
        self, location: Location, radius_km: float
    ) -> None:
        """"""
        raise NotImplementedException("External search not implemented yet")

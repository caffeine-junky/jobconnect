from uuid import UUID
from typing import List
from fastapi import APIRouter, Depends
from app.models import TechnicianResponse
from app.dependencies import get_search_service
from app.services import SearchService

router: APIRouter = APIRouter(prefix="/search", tags=["Search"])


@router.get(
    "/nearby/{client_id}/", response_model=List[TechnicianResponse], status_code=200
)
async def search_nearby_technicians(
    client_id: UUID,
    radius_km: float = 10,
    skip: int = 0,
    limit: int = 100,
    service: SearchService = Depends(get_search_service),
) -> List[TechnicianResponse]:
    """"""
    return await service.search_nearby_technicians(
        client_id, radius_km, [], skip, limit
    )


@router.get(
    "/description/{client_id}", response_model=List[TechnicianResponse], status_code=200
)
async def search_technicians_by_description(
    client_id: UUID,
    radius_km: float,
    problem_description: str,
    skip: int = 0,
    limit: int = 100,
    service: SearchService = Depends(get_search_service),
) -> List[TechnicianResponse]:
    """"""
    return await service.search_technicians_by_description(
        client_id, problem_description, radius_km, skip, limit
    )

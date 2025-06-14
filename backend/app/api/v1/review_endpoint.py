from uuid import UUID
from typing import Optional, List
from fastapi import APIRouter, Depends
from app.models import ReviewCreate, ReviewResponse, ReviewUpdate
from app.dependencies import review_service_dependency, get_review_service
from app.services import ReviewService

router: APIRouter = APIRouter(prefix="/review", tags=["Review"])


@router.post("/", response_model=ReviewResponse, status_code=201)
async def create_review(
    data: ReviewCreate, service: review_service_dependency
) -> ReviewResponse:
    """"""
    return await service.create_review(data)


@router.get("/{review_id}", response_model=ReviewResponse, status_code=200)
async def readone_review(
    review_id: UUID, service: review_service_dependency
) -> ReviewResponse:
    """"""
    return await service.readone_review(review_id)


@router.get("/", response_model=List[ReviewResponse], status_code=200)
async def readall_review(
    client_id: Optional[UUID] = None,
    technician_id: Optional[UUID] = None,
    min_rating: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    service: ReviewService = Depends(get_review_service),
) -> List[ReviewResponse]:
    """"""
    return await service.readall_reviews(
        client_id, technician_id, min_rating, skip, limit
    )


@router.put("/{review_id}", response_model=ReviewResponse, status_code=200)
async def update_review(
    review_id: UUID, data: ReviewUpdate, service: review_service_dependency
) -> ReviewResponse:
    """"""
    return await service.update_review(review_id, data)


@router.delete("/{review_id}", response_model=bool, status_code=200)
async def delete_review(review_id: UUID, service: review_service_dependency) -> bool:
    """"""
    return await service.delete_review(review_id)

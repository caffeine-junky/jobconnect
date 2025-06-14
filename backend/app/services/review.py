from uuid import UUID
from typing import Optional, List
from app.models import ReviewInDB, ReviewCreate, ReviewUpdate, ReviewResponse
from app.repository import ReviewRepository
from app.utils.exceptions import (
    NotFoundException,
    InternalServerException,
    ConfictException,
)


def review_in_db_to_response(review: ReviewInDB) -> ReviewResponse:
    """"""
    return ReviewResponse(**review.model_dump())


class ReviewService:
    def __init__(self, repo: ReviewRepository) -> None:
        self.repo = repo

    async def create_review(self, data: ReviewCreate) -> ReviewResponse:
        """"""
        if await self.repo.exists(data.booking_id):
            raise ConfictException("You have already reviewed this booking")
        review: Optional[ReviewInDB] = await self.repo.create(data.model_dump())
        if review is None:
            raise InternalServerException("Error creating review")
        return review_in_db_to_response(review)

    async def readone_review(self, review_id: UUID) -> ReviewResponse:
        """"""
        review: Optional[ReviewInDB] = await self.repo.readone(review_id)
        if review is None:
            raise NotFoundException("Review not found")
        return review_in_db_to_response(review)

    async def readall_reviews(
        self,
        client_id: Optional[UUID] = None,
        technician_id: Optional[UUID] = None,
        min_rating: Optional[int] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[ReviewResponse]:
        """"""
        reviews: List[ReviewInDB] = await self.repo.readall(
            client_id, technician_id, min_rating, skip, limit
        )
        return [review_in_db_to_response(review) for review in reviews]

    async def update_review(self, review_id: UUID, data: ReviewUpdate) -> ReviewResponse:
        """"""
        review: Optional[ReviewInDB] = await self.repo.readone(review_id)
        if review is None:
            raise NotFoundException("Review not found")
        review: Optional[ReviewInDB] = await self.repo.update(
            review_id, data.model_dump()
        )
        if review is None:
            raise InternalServerException("Error updating review")
        return review_in_db_to_response(review)

    async def delete_review(self, review_id: UUID) -> bool:
        """"""
        return await self.repo.delete(review_id)

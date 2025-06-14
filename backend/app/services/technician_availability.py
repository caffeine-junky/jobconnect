from uuid import UUID
from typing import Optional, List
from app.models import (
    TechnicianAvailabilityInDB,
    TechnicianAvailabilityCreate,
    TechnicianAvailabilityUpdate,
    TechnicianAvailabilityResponse,
)
from app.repository import TechnicianAvailabilityRepository
from app.utils.exceptions import (
    NotFoundException,
    InternalServerException,
    ConfictException,
)


class TechnicianAvailablityService:
    def __init__(self, repo: TechnicianAvailabilityRepository) -> None:
        self.repo = repo

    def technician_availability_in_db_to_response(
        self, technician_availability: TechnicianAvailabilityInDB
    ) -> TechnicianAvailabilityResponse:
        return TechnicianAvailabilityResponse(**technician_availability.model_dump())

    async def create_technician_availability(
        self, data: TechnicianAvailabilityCreate
    ) -> TechnicianAvailabilityResponse:
        if await self.repo.timeslot_exists(data.technician_id, data.timeslot):
            raise ConfictException(
                f"Technician already has a booking at {str(data.timeslot)}, try a different time."
            )
        technician_availability: Optional[
            TechnicianAvailabilityInDB
        ] = await self.repo.create(data.model_dump())
        if technician_availability is None:
            raise InternalServerException("Error creating technician availability")
        return self.technician_availability_in_db_to_response(technician_availability)

    async def readone_technician_availability(
        self, technician_availability_id: UUID
    ) -> TechnicianAvailabilityResponse:
        technician_availability: Optional[
            TechnicianAvailabilityInDB
        ] = await self.repo.readone(technician_availability_id)
        if technician_availability is None:
            raise NotFoundException("Technician availability not found")
        return self.technician_availability_in_db_to_response(technician_availability)

    async def readall_technician_availabilities(
        self,
        day: Optional[int] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianAvailabilityResponse]:
        technician_availabilities: List[
            TechnicianAvailabilityInDB
        ] = await self.repo.readall(day, start_time, end_time, skip, limit)
        return [
            self.technician_availability_in_db_to_response(technician_availability)
            for technician_availability in technician_availabilities
        ]

    async def readall_technician_availabilities_by_technician_id(
        self,
        technician_id: UUID,
        day: Optional[int] = None,
        start_time: Optional[str] = None,
        end_time: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianAvailabilityResponse]:
        technician_availabilities: List[
            TechnicianAvailabilityInDB
        ] = await self.repo.readall_by_technician_id(
            technician_id, day, start_time, end_time, skip, limit
        )
        return [
            self.technician_availability_in_db_to_response(technician_availability)
            for technician_availability in technician_availabilities
        ]

    async def update_technician_availability(
        self,
        technician_availability_id: UUID,
        technician_id: UUID,
        data: TechnicianAvailabilityUpdate,
    ) -> TechnicianAvailabilityResponse:
        if data.timeslot is not None and await self.repo.timeslot_exists(
            technician_id, data.timeslot
        ):
            raise ConfictException(f"You already have a timeslot at that time and day")
        ta: Optional[TechnicianAvailabilityInDB] = await self.repo.readone(
            technician_availability_id
        )
        if ta is None:
            raise NotFoundException("Technician availability not found")
        updated_ta: Optional[TechnicianAvailabilityInDB] = await self.repo.update(
            data.model_dump()
        )
        if updated_ta is None:
            raise InternalServerException("Error updating technician availability")
        return self.technician_availability_in_db_to_response(updated_ta)

    async def delete_technician_availability(
        self, technician_availability_id: UUID
    ) -> bool:
        return await self.repo.delete(technician_availability_id)

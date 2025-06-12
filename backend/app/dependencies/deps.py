from fastapi import Depends, Request
from typing import Annotated
from app.database import AsyncDatabase
from app.repository import (
    AdminRepository,
    ClientRepository,
    TechnicianRepository,
    BookingRepository,
    ReviewRepository,
    ServiceRepository,
    SearchRepository,
    NotificationRepository,
    TechnicianAvailabilityRepository,
)
from app.services import (
    AdminService,
    ClientService,
    TechnicianService,
    BookingService,
    ReviewService,
    ServiceService,
    SearchService,
    AuthService,
    NotificationService,
    TechnicianAvailablityService,
)


async def get_db(request: Request) -> AsyncDatabase:
    return request.app.state.db


async def get_admin_repository(db: AsyncDatabase = Depends(get_db)) -> AdminRepository:
    return AdminRepository(db)


async def get_admin_service(
    repo: AdminRepository = Depends(get_admin_repository),
) -> AdminService:
    return AdminService(repo)


async def get_client_repository(
    db: AsyncDatabase = Depends(get_db),
) -> ClientRepository:
    return ClientRepository(db)


async def get_client_service(
    repo: ClientRepository = Depends(get_client_repository),
) -> ClientService:
    return ClientService(repo)


async def get_technician_repository(
    db: AsyncDatabase = Depends(get_db),
) -> TechnicianRepository:
    return TechnicianRepository(db)


async def get_technician_service(
    repo: TechnicianRepository = Depends(get_technician_repository),
) -> TechnicianService:
    return TechnicianService(repo)


async def get_booking_repository(
    db: AsyncDatabase = Depends(get_db),
) -> BookingRepository:
    return BookingRepository(db)


async def get_booking_service(
    repo: BookingRepository = Depends(get_booking_repository),
) -> BookingService:
    return BookingService(repo)


async def get_review_repository(
    db: AsyncDatabase = Depends(get_db),
) -> ReviewRepository:
    return ReviewRepository(db)


async def get_review_service(
    repo: ReviewRepository = Depends(get_review_repository),
) -> ReviewService:
    return ReviewService(repo)


async def get_service_repository(
    db: AsyncDatabase = Depends(get_db),
) -> ServiceRepository:
    return ServiceRepository(db)


async def get_service_service(
    repo: ServiceRepository = Depends(get_service_repository),
) -> ServiceService:
    return ServiceService(repo)


async def get_search_repository(
    db: AsyncDatabase = Depends(get_db),
) -> SearchRepository:
    return SearchRepository(db)


async def get_search_service(
    repo: SearchRepository = Depends(get_search_repository),
) -> SearchService:
    return SearchService(repo)


async def get_auth_service(
    admin_service: AdminService = Depends(get_admin_service),
    client_service: ClientService = Depends(get_client_service),
    technician_service: TechnicianService = Depends(get_technician_service),
) -> AuthService:
    return AuthService((admin_service, client_service, technician_service))


async def get_notification_repository(
    db: AsyncDatabase = Depends(get_db),
) -> NotificationRepository:
    return NotificationRepository(db)


async def get_notification_service(
    repo: NotificationRepository = Depends(get_notification_repository),
) -> NotificationService:
    return NotificationService(repo)


async def get_technician_availability_repository(
    db: AsyncDatabase = Depends(get_db),
) -> TechnicianAvailabilityRepository:
    return TechnicianAvailabilityRepository(db)


async def get_technician_availability_service(
    repo: TechnicianAvailabilityRepository = Depends(
        get_technician_availability_repository
    ),
) -> TechnicianAvailablityService:
    return TechnicianAvailablityService(repo)


db_dependency = Annotated[AsyncDatabase, Depends(get_db)]

admin_repository_dependency = Annotated[AdminRepository, Depends(get_admin_repository)]
admin_service_dependency = Annotated[AdminService, Depends(get_admin_service)]

client_repository_dependency = Annotated[
    ClientRepository, Depends(get_client_repository)
]
client_service_dependency = Annotated[ClientService, Depends(get_client_service)]

technician_repository_dependency = Annotated[
    TechnicianRepository, Depends(get_technician_repository)
]
technician_service_dependency = Annotated[
    TechnicianService, Depends(get_technician_service)
]

booking_repository_dependency = Annotated[
    BookingRepository, Depends(get_booking_repository)
]
booking_service_dependency = Annotated[BookingService, Depends(get_booking_service)]

review_repository_dependency = Annotated[
    ReviewRepository, Depends(get_review_repository)
]
review_service_dependency = Annotated[ReviewService, Depends(get_review_service)]

service_repository_dependency = Annotated[
    ServiceRepository, Depends(get_service_repository)
]
service_service_dependency = Annotated[ServiceService, Depends(get_service_service)]

search_repository_dependency = Annotated[
    SearchRepository, Depends(get_search_repository)
]
search_service_dependency = Annotated[SearchService, Depends(get_search_service)]

auth_service_dependency = Annotated[AuthService, Depends(get_auth_service)]


notification_repository_dependency = Annotated[
    NotificationRepository, Depends(get_notification_repository)
]

notification_service_dependency = Annotated[
    NotificationService, Depends(get_notification_service)
]

technician_availability_repository_dependency = Annotated[
    TechnicianAvailabilityRepository, Depends(get_technician_availability_repository)
]

technician_availability_service_dependency = Annotated[
    TechnicianAvailablityService, Depends(get_technician_availability_service)
]

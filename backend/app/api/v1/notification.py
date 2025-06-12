from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends
from app.models import NotificationCreate, NotificationResponse
from app.services import NotificationService
from app.dependencies import get_notification_service, notification_service_dependency

router: APIRouter = APIRouter(prefix="/notification", tags=["Notification"])


@router.post("/", response_model=NotificationResponse, status_code=201)
async def create_notification(
    data: NotificationCreate,
    notification_service: notification_service_dependency
) -> NotificationResponse:
    return await notification_service.create_notification(data)


@router.get("/{notification_id}", response_model=NotificationResponse, status_code=200)
async def read_notification(
    notification_id: UUID,
    notification_service: notification_service_dependency
) -> NotificationResponse:
    return await notification_service.read_notification(notification_id)


@router.get("/", response_model=List[NotificationResponse], status_code=200)
async def readall_notifications(
    read: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    notification_service: NotificationService = Depends(get_notification_service)
) -> List[NotificationResponse]:
    return await notification_service.readall_notifications(read, skip, limit)


@router.get("/", response_model=List[NotificationResponse], status_code=200)
async def readall_notifications_by_client(
    client_id: UUID,
    read: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    notification_service: NotificationService = Depends(get_notification_service)
) -> List[NotificationResponse]:
    return await notification_service.readall_notifications_by_client_id(client_id, read, skip, limit)

@router.get("/", response_model=List[NotificationResponse], status_code=200)
async def readall_notifications_by_technician(
    technician_id: UUID,
    read: Optional[bool] = None,
    skip: int = 0,
    limit: int = 100,
    notification_service: NotificationService = Depends(get_notification_service)
) -> List[NotificationResponse]:
    return await notification_service.readall_notifications_by_techniian_id(technician_id, read, skip, limit)

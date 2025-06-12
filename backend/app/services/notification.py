from uuid import UUID
from typing import Optional, List
from app.models import NotificationInDB, NotificationResponse, NotificationCreate
from app.repository import NotificationRepository
from app.utils.exceptions import NotFoundException, InternalServerException


class NotificationService:
    def __init__(self, repo: NotificationRepository) -> None:
        self.repo = repo

    def notification_in_db_to_response(
        self, notification: NotificationInDB
    ) -> NotificationResponse:
        """Converts a notification in the database to a reponse object"""
        return NotificationResponse(**notification.model_dump())

    async def create_notification(
        self, data: NotificationCreate
    ) -> NotificationResponse:
        """"""
        notification: Optional[NotificationInDB] = await self.repo.create(
            data.model_dump()
        )
        if notification is None:
            raise InternalServerException("Error creating notification")
        return self.notification_in_db_to_response(notification)

    async def read_notification(self, notification_id: UUID) -> NotificationResponse:
        """"""
        notification: Optional[NotificationInDB] = await self.repo.readone(
            notification_id
        )
        if notification is None:
            raise NotFoundException("Notification not found")
        return self.notification_in_db_to_response(notification)

    async def readall_notifications(
        self, read: Optional[bool] = None, skip: int = 0, limit: int = 100
    ) -> List[NotificationResponse]:
        """"""
        notifications: List[NotificationInDB] = await self.repo.readall(
            read, skip, limit
        )
        return [
            self.notification_in_db_to_response(notification)
            for notification in notifications
        ]

    async def delete_notification(self, notification_id: UUID) -> bool:
        """"""
        return await self.repo.delete(notification_id)

    async def readall_notifications_by_client_id(
        self,
        client_id: UUID,
        read: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[NotificationResponse]:
        """"""
        notifications: List[NotificationInDB] = await self.repo.readall_by_client_id(
            client_id, read, skip, limit
        )
        return [
            self.notification_in_db_to_response(notification)
            for notification in notifications
        ]

    async def readall_notifications_by_techniian_id(
        self,
        technician_id: UUID,
        read: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[NotificationResponse]:
        """"""
        notifications: List[
            NotificationInDB
        ] = await self.repo.readall_by_technician_id(technician_id, read, skip, limit)
        return [
            self.notification_in_db_to_response(notification)
            for notification in notifications
        ]

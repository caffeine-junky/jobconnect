from uuid import UUID
from typing import List, Optional, Dict, Any
from app.models import AdminInDB, AdminCreate, AdminUpdate, AdminResponse
from app.models.enums import AdminRole, UserRole
from app.repository import AdminRepository
from app.utils.security import SecurityUtils
from app.utils.exceptions import (
    NotFoundException,
    ConflictException,
    InternalServerException,
    UnauthorizedException,
)


def admin_in_db_to_response(admin: AdminInDB) -> AdminResponse:
    """Convert a AdminInDB object to AdminResponse object"""
    return AdminResponse(**admin.model_dump(exclude={"hashed_password"}))


class AdminService:
    def __init__(self, repo: AdminRepository) -> None:
        self.repo = repo

    async def create_admin(self, data: AdminCreate) -> AdminResponse:
        exists, message = await self.repo.exists(data.email, data.phone)
        if exists:
            raise ConflictException(message)
        hashed_password: str = SecurityUtils.hash_password(data.password)
        admin: Optional[AdminInDB] = await self.repo.create(
            {
                "hashed_password": hashed_password,
                **data.model_dump(exclude={"password"}),
            }
        )
        if admin is None:
            raise InternalServerException("Error creating admin")

        return admin_in_db_to_response(admin)

    async def readone_admin(self, admin_id: UUID) -> AdminResponse:
        """Read one admin from the database, if no admin is found NotFoundException will be raised"""
        admin: Optional[AdminInDB] = await self.repo.readone(admin_id)
        if admin is None:
            raise NotFoundException(f"Admin with id '{admin_id}' not found")
        return admin_in_db_to_response(admin)

    async def readall_admins(
        self,
        active: Optional[bool] = None,
        role: Optional[AdminRole] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[AdminResponse]:
        """Read all admins from the database"""
        admins: List[AdminInDB] = await self.repo.readall(active, role, skip, limit)
        return [admin_in_db_to_response(admin) for admin in admins]

    async def update_admin(self, admin_id: UUID, data: AdminUpdate) -> AdminResponse:
        """Update an existing admin"""
        admin: Optional[AdminInDB] = await self.repo.readone(admin_id)
        if admin is None:
            raise NotFoundException(f"Admin with id '{admin_id}' not found")
        update_data: Dict[str, Any] = data.model_dump(
            exclude_unset=True, exclude_none=True
        )
        if len(update_data) == 0:
            return admin_in_db_to_response(admin)

        if "password" in update_data:
            hashed_password: str = SecurityUtils.hash_password(
                update_data.pop("password")
            )
            update_data["hashed_password"] = hashed_password

        admin = await self.repo.update(admin_id, update_data)

        if admin is None:
            raise InternalServerException("Failed to update admin")

        return admin_in_db_to_response(admin)

    async def delete_admin(self, admin_id: UUID) -> bool:
        """Delete an existing admin"""
        return await self.repo.delete(admin_id)

    async def readone_admin_by_email(self, email: str) -> AdminResponse:
        admin: Optional[AdminInDB] = await self.repo.readone_by_email(email)
        if admin is None:
            raise NotFoundException(f"Admin with email '{email}' not found")
        return admin_in_db_to_response(admin)

    async def verify_technician(self, admin_id: UUID, technician_id: UUID) -> bool:
        """Verify a technician"""
        admin: Optional[AdminInDB] = await self.repo.readone(admin_id)
        if admin is None:
            raise NotFoundException(f"Admin with id '{admin_id}' not found")
        if admin.role not in [AdminRole.SUPER_ADMIN, AdminRole.SUPPORT_ADMIN]:
            raise UnauthorizedException(
                f"Only super admin or support admin can verify technicians"
            )

        return await self.repo.verify_technician(admin_id, technician_id)

    async def set_user_active_status(
        self, admin_id: UUID, user_id: UUID, role: UserRole, status: bool
    ) -> bool:
        """Set the active status of a user"""
        admin: Optional[AdminInDB] = await self.repo.readone(admin_id)
        if admin is None:
            raise NotFoundException(f"Admin with id '{admin_id}' not found")
        if admin.role not in [AdminRole.SUPER_ADMIN, AdminRole.SUPPORT_ADMIN]:
            raise UnauthorizedException(
                f"Only super admin or support admin can set user active status"
            )
        if role == UserRole.ADMIN and admin.role != AdminRole.SUPER_ADMIN:
            raise UnauthorizedException(f"Only super admin can set admin active status")

        return await self.repo.set_user_active_status(
            user_id, role.value.lower(), status
        )

    async def authenticate(self, email: str, password: str) -> Optional[AdminResponse]:
        """Authenticate an admin"""
        admin: Optional[AdminInDB] = await self.repo.readone_by_email(email)
        if admin is None:
            return None
        if not SecurityUtils.verify_password(password, admin.hashed_password):
            return None
        return admin_in_db_to_response(admin)

from uuid import UUID
from typing import List, Optional
from pydantic import EmailStr
from fastapi import APIRouter, Depends
from app.models import AdminCreate, AdminResponse, AdminUpdate
from app.models.enums import UserRole, AdminRole
from app.dependencies import admin_service_dependency
from app.dependencies.deps import get_admin_service
from app.services import AdminService

router: APIRouter = APIRouter(prefix="/admin", tags=["Admin"])


@router.post("/", response_model=AdminResponse, status_code=201)
async def create_admin(
    data: AdminCreate,
    service: admin_service_dependency
    ) -> AdminResponse:
    """"""
    return await service.create_admin(data)


@router.get("/{admin_id}", response_model=AdminResponse, status_code=200)
async def readone_admin(
    admin_id: UUID,
    service: admin_service_dependency
    ) -> AdminResponse:
    """"""
    return await service.readone_admin(admin_id)


@router.get("/", response_model=List[AdminResponse], status_code=200)
async def readall_admin(
    active: Optional[bool] = None,
    role: Optional[AdminRole] = None,
    skip: int = 0,
    limit: int = 100,
    service: AdminService = Depends(get_admin_service)
    ) -> List[AdminResponse]:
    """"""
    return await service.readall_admins(active, role, skip, limit)


@router.put("/{admin_id}", response_model=AdminResponse, status_code=200)
async def update_admin(
    admin_id: UUID,
    data: AdminUpdate,
    service: admin_service_dependency
    ) -> AdminResponse:
    """"""
    return await service.update_admin(admin_id, data)


@router.delete("/{admin_id}", status_code=200)
async def delete_admin(
    admin_id: UUID,
    service: admin_service_dependency
    ) -> bool:
    """"""
    return await service.delete_admin(admin_id)


@router.get("/lookup/email/{email}", response_model=AdminResponse, status_code=200)
async def readone_admin_by_email(
    email: EmailStr,
    service: admin_service_dependency
) -> AdminResponse:
    """"""
    return await service.readone_admin_by_email(email)


@router.post("/{admin_id}/verify/{technician_id}", status_code=200)
async def verify_technician(
    admin_id: UUID,
    technician_id: UUID,
    service: admin_service_dependency
    ) -> bool:
    """"""
    return await service.verify_technician(admin_id, technician_id)


@router.post("/{admin_id}/set/{user_id}/{role}/{status}", status_code=200)
async def set_user_active_status(
    admin_id: UUID,
    user_id: UUID,
    role: UserRole,
    status: bool,
    service: admin_service_dependency
    ) -> bool:
    """"""
    return await service.set_user_active_status(admin_id, user_id, role, status)

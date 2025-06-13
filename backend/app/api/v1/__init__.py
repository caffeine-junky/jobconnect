from fastapi import APIRouter
from .auth_endpoint import router as auth_router
from .admin import router as admin_router
from .notification import router as notification_router
from .technician_availability import router as technician_availability_router

v1_router: APIRouter = APIRouter()

v1_router.include_router(auth_router)
v1_router.include_router(admin_router)
v1_router.include_router(notification_router)
v1_router.include_router(technician_availability_router)

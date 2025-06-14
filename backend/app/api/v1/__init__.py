from fastapi import APIRouter
from .auth_endpoint import router as auth_router
from .admin_endpoint import router as admin_router
from .client_endpoint import router as client_router
from .technician_endpoint import router as technician_router
from .notification_endpoint import router as notification_router
from .technician_availability_endpoint import router as technician_availability_router

v1_router: APIRouter = APIRouter()

v1_router.include_router(auth_router)
v1_router.include_router(admin_router)
v1_router.include_router(client_router)
v1_router.include_router(technician_router)
v1_router.include_router(notification_router)
v1_router.include_router(technician_availability_router)

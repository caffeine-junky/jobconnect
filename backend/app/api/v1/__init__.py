from fastapi import APIRouter
from .admin import router as admin_router
from .notification import router as notification_router

v1_router: APIRouter = APIRouter()

v1_router.include_router(admin_router)
v1_router.include_router(notification_router)

from fastapi import APIRouter
from .auth_endpoint import router as auth_router
from .admin_endpoint import router as admin_router
from .client_endpoint import router as client_router
from .technician_endpoint import router as technician_router
from .booking_endpoint import router as booking_router
from .payment_endpoint import router as payment_router
from .review_endpoint import router as review_router
from .notification_endpoint import router as notification_router
from .technician_availability_endpoint import router as technician_availability_router
from .service_endpoint import router as service_router
from .search_endpoint import router as search_router
from .technician_service_endpoint import router as technician_service_router
from .report import router as report_router

v1_router: APIRouter = APIRouter()

v1_router.include_router(auth_router)
v1_router.include_router(admin_router)
v1_router.include_router(client_router)
v1_router.include_router(technician_router)
v1_router.include_router(booking_router)
v1_router.include_router(payment_router)
v1_router.include_router(review_router)
v1_router.include_router(notification_router)
v1_router.include_router(technician_availability_router)
v1_router.include_router(technician_service_router)
v1_router.include_router(service_router)
v1_router.include_router(search_router)
v1_router.include_router(report_router)

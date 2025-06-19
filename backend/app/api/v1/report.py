from uuid import UUID
from fastapi import APIRouter
from app.models import TechnicianReport
from app.dependencies import report_service_dependency

router: APIRouter = APIRouter(prefix="/report", tags=["Report"])


@router.get("/technician/{technician_id}", response_model=TechnicianReport, status_code=200)
async def read_technician_report(
    technician_id: UUID,
    service: report_service_dependency
) -> TechnicianReport:
    """"""
    return await service.read_technician_report(technician_id)

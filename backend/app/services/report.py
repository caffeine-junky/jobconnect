from uuid import UUID
from app.models import TechnicianReport
from app.repository import ReportRepository
from app.utils.exceptions import NotFoundException


class ReportService:
    
    def __init__(self, repo: ReportRepository) -> None:
        self.repo = repo
        
    async def read_technician_report(self, technician_id: UUID) -> TechnicianReport:
        """"""
        report: TechnicianReport | None = await self.repo.read_technician_report(technician_id)
        if report is None:
            raise NotFoundException(message="Report for technician not found")
        return report

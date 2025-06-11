from uuid import UUID
from typing import Optional, Union, Tuple, Dict
from datetime import timedelta

from app.models import (
    Token,
    TokenData,
    AdminResponse,
    ClientResponse,
    TechnicianResponse,
)
from app.models.enums import UserRole
from app.utils.security import SecurityUtils
from app.utils.exceptions import UnauthorizedException
from app.core import settings

from .admin import AdminService
from .client import ClientService
from .technician import TechnicianService

User = Union[AdminResponse, ClientResponse, TechnicianResponse]


class AuthService:
    def __init__(
        self, services: Tuple[AdminService, ClientService, TechnicianService]
    ) -> None:
        self._admin_service: AdminService = services[0]
        self._client_service: ClientService = services[1]
        self._technician_service: TechnicianService = services[2]

        self._services: Dict[
            UserRole, Union[AdminService, ClientService, TechnicianService]
        ] = {
            UserRole.ADMIN: self._admin_service,
            UserRole.CLIENT: self._client_service,
            UserRole.TECHNICIAN: self._technician_service,
        }

    async def authenticate(self, email: str, password: str, role: UserRole) -> str:
        """
        Authenticate user based on role and credentials, then return a JWT token.
        """
        service: Optional[Union[AdminService, ClientService, TechnicianService]] = (
            self._services.get(role)
        )
        if not service:
            raise UnauthorizedException("Invalid role")

        user: Optional[User] = await service.authenticate(email, password)  # type: ignore[attr-defined]
        if user is None:
            raise UnauthorizedException("Invalid credentials")

        token_data: TokenData = TokenData(email=user.email, user_id=user.id, role=role)
        return SecurityUtils.create_access_token(
            token_data, timedelta(minutes=settings.TOKEN_EXPIRE_MINUTES)
        )

    async def get_current_user(self, token: str) -> User:
        """
        Decode token and retrieve the current user from the appropriate service.
        """
        token_data: Token = SecurityUtils.decode_token(token)
        role: UserRole = token_data.user_role
        user_id: UUID = token_data.user_id

        service: Optional[Union[AdminService, ClientService, TechnicianService]] = (
            self._services.get(role)
        )
        if not service:
            raise UnauthorizedException("Invalid token role")

        match role:
            case UserRole.ADMIN:
                return await service.readone_admin(user_id)  # type: ignore[attr-defined]
            case UserRole.CLIENT:
                return await service.readone_client(user_id)  # type: ignore[attr-defined]
            case UserRole.TECHNICIAN:
                return await service.readone_technician(user_id)  # type: ignore[attr-defined]

        raise UnauthorizedException("Invalid token")

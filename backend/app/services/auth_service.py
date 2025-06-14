from uuid import UUID
from typing import Optional, Union, Tuple, Dict
from datetime import timedelta
from jose import JWTError

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

    async def authenticate(self, email: str, password: str, role: UserRole) -> Token:
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
        access_token: str = SecurityUtils.create_access_token(
            data=token_data,
            expires_delta=timedelta(minutes=settings.TOKEN_EXPIRE_MINUTES),
        )
        return Token(access_token=access_token, token_type="bearer")

    async def get_current_user(self, token: str) -> Dict[str, Union[User, UserRole]]:
        """
        Decode token and retrieve the current user from the appropriate service.
        """
        try:
            payload: TokenData = SecurityUtils.decode_token(token)
            email: Optional[str] = payload.email
            user_id: Optional[UUID] = payload.user_id
            role: Optional[UserRole] = payload.role

            if (email is None) or (user_id is None) or (role is None):
                raise UnauthorizedException("Could not validate credentials")
        except JWTError:
            raise UnauthorizedException("Could not validate credentials")

        service: Optional[Union[AdminService, ClientService, TechnicianService]] = (
            self._services.get(role)
        )
        if not service:
            raise UnauthorizedException("Invalid token role")

        response: Dict[str, Union[User, UserRole]] = {"role": role}

        match role:
            case UserRole.ADMIN:
                response["user"] = await service.readone_admin(user_id)  # type: ignore[attr-defined]
            case UserRole.CLIENT:
                response["user"] = await service.readone_client(user_id)  # type: ignore[attr-defined]
            case UserRole.TECHNICIAN:
                response["user"] = await service.readone_technician(user_id)  # type: ignore[attr-defined]

        if response.get("user") is None:
            raise UnauthorizedException("Invalid token")

        return response

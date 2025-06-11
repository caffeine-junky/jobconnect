from uuid import UUID
from pydantic import BaseModel, EmailStr
from typing import Dict, Any, Optional

from .enums import UserRole


class Token(BaseModel):
    """
    Schema for access token response.
    """

    access_token: str
    token_type: str
    user_id: UUID
    user_role: UserRole

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "user_id": "123e4567-e89b-12d3-a456-426614174000",
                "user_type": UserRole.CLIENT,
            }
        }


class TokenData(BaseModel):
    """
    Schema for decoded token data.
    """

    email: Optional[EmailStr] = None
    user_id: Optional[UUID] = None
    role: Optional[UserRole] = None


class LoginRequest(BaseModel):
    """
    Schema for login request.
    """

    email: EmailStr
    password: str
    user_role: UserRole

    class Config:
        json_schema_extra: Dict[str, Any] = {
            "example": {
                "email": "moses@jobconnect.com",
                "password": "123",
                "user_type": UserRole.ADMIN,
            }
        }

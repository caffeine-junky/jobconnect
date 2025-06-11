from typing import ClassVar, Dict, Any
from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer

from app.core import settings
from app.models import Token, TokenData


class SecurityUtils:
    PWD_CONTEXT: ClassVar[CryptContext] = CryptContext(
        schemes=["bcrypt"], deprecated="auto"
    )
    OUTH_2_SCHEME: ClassVar[OAuth2PasswordBearer] = OAuth2PasswordBearer(
        tokenUrl=f"{settings.API_V1_STR}/auth/login"
    )

    @classmethod
    def hash_password(cls, password: str) -> str:
        """Hash the password using the bcrypt algorithm"""
        return cls.PWD_CONTEXT.hash(password)

    @classmethod
    def verify_password(cls, password: str, hashed_password: str) -> bool:
        """Verify if the password is correct"""
        return cls.PWD_CONTEXT.verify(password, hashed_password)

    @classmethod
    def create_access_token(cls, data: TokenData, expires_delta: timedelta) -> str:
        """Create a JWT access token"""
        to_encode: Dict[str, Any] = data.model_dump().copy()
        expire: datetime = datetime.now(timezone.utc) + expires_delta
        to_encode.update({"exp": expire})
        return jwt.encode(
            to_encode, settings.JWT_SECRET_TOKEN, algorithm=settings.ALGORITHM
        )

    @classmethod
    def decode_token(cls, token: str) -> Token:
        """Decode a JWT token"""
        return Token(
            access_token=token,
            **jwt.decode(
                token, settings.JWT_SECRET_TOKEN, algorithms=[settings.ALGORITHM]
            ),
        )

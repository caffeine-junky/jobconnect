from fastapi import APIRouter, Header, Depends, HTTPException
from typing import Union, Dict
from app.models import (
    Token,
    LoginRequest,
    AdminResponse,
    ClientResponse,
    TechnicianResponse,
)
from app.models.enums import UserRole
from app.dependencies import auth_service_dependency, get_auth_service
from app.services import AuthService

router: APIRouter = APIRouter(prefix="/auth", tags=["Authentication"])
User = Union[AdminResponse, ClientResponse, TechnicianResponse]


@router.post("/login", response_model=Token, status_code=200)
async def login(form: LoginRequest, service: auth_service_dependency):
    """"""
    return await service.authenticate(form.email, form.password, form.user_role)


@router.get(
    "/me", 
    response_model=Dict[str, Union[User, UserRole]], 
    status_code=200
)
async def get_current_user(
    authorization: str = Header(..., alias="Authorization"),
    service: AuthService = Depends(get_auth_service)
) -> Dict[str, Union[User, UserRole]]:
    """"""
    # Extract token from "Bearer <token>" format
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    
    token = authorization[7:]  # Remove "Bearer " prefix
    return await service.get_current_user(token)

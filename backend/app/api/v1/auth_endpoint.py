from fastapi import APIRouter
from typing import Union, Dict
from app.models import (
    Token,
    LoginRequest,
    AdminResponse,
    ClientResponse,
    TechnicianResponse,
)
from app.models.enums import UserRole
from app.dependencies import auth_service_dependency

router: APIRouter = APIRouter(prefix="/auth", tags=["Authentication"])
User = Union[AdminResponse, ClientResponse, TechnicianResponse]


@router.post("/login", response_model=Token, status_code=200)
async def login(form: LoginRequest, service: auth_service_dependency):
    """"""
    return await service.authenticate(form.email, form.password, form.user_role)


@router.get(
    "/me/{token}", response_model=Dict[str, Union[User, UserRole]], status_code=200
)
async def get_current_user(token: str, service: auth_service_dependency):
    """"""
    return await service.get_current_user(token)

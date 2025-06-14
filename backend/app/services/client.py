from uuid import UUID
from typing import Any, Dict, List, Optional
from app.models import ClientInDB, ClientCreate, ClientResponse, ClientUpdate
from app.repository import ClientRepository
from app.utils.security import SecurityUtils
from app.utils.exceptions import (
    NotFoundException,
    ConfictException,
    InternalServerException,
)


def client_in_db_to_response(client: ClientInDB) -> ClientResponse:
    """Convert a ClientInDB object to a ClientResponse object"""
    return ClientResponse(**client.model_dump(exclude={"hashed_password"}))


class ClientService:
    def __init__(self, repo: ClientRepository) -> None:
        self.repo = repo

    async def create_client(self, data: ClientCreate) -> ClientResponse:
        """"""
        exists, message = await self.repo.exists(data.email, data.phone)
        if exists:
            raise ConfictException(message)
        hashed_password: str = SecurityUtils.hash_password(data.password)
        client: Optional[ClientInDB] = await self.repo.create(
            {
                "hashed_password": hashed_password,
                **data.model_dump(exclude={"password"}),
            }
        )
        if client is None:
            raise InternalServerException("Error creating client")
        return client_in_db_to_response(client)

    async def readone_client(self, client_id: UUID) -> ClientResponse:
        """"""
        client: Optional[ClientInDB] = await self.repo.readone(client_id)
        if client is None:
            raise NotFoundException(f"Client with id '{client_id}' not found")
        return client_in_db_to_response(client)

    async def readall_clients(
        self,
        active: Optional[bool] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[ClientResponse]:
        """"""
        clients: List[ClientInDB] = await self.repo.readall(active, skip, limit)
        return [client_in_db_to_response(client) for client in clients]

    async def update_client(
        self, client_id: UUID, data: ClientUpdate
    ) -> ClientResponse:
        """"""
        client: Optional[ClientInDB] = await self.repo.readone(client_id)
        if client is None:
            raise NotFoundException(f"Client with id '{client_id}' not found")

        update_data: Dict[str, Any] = data.model_dump(exclude_unset=True)
        if len(update_data) == 0:
            return client_in_db_to_response(client)

        if "password" in update_data:
            hashed_password: str = SecurityUtils.hash_password(
                update_data.pop("password")
            )
            update_data["hashed_password"] = hashed_password
        if "location" in update_data:
            location_point: str = (
                f"POINT({update_data['location']['longitude']} "
                f"{update_data['location']['latitude']})"
            )
            update_data["location_name"] = update_data["location"]["location_name"]
            update_data["location"] = location_point
            update_data.pop("location")

        client: Optional[ClientInDB] = await self.repo.update(client_id, update_data)
        if client is None:
            raise InternalServerException("Error updating client")
        return client_in_db_to_response(client)

    async def delete_client(self, client_id: UUID) -> bool:
        """"""
        return await self.repo.delete(client_id)

    async def add_favorite_technician(
        self, client_id: UUID, technician_id: UUID
    ) -> bool:
        """"""
        return await self.repo.add_favorite_technician(client_id, technician_id)

    async def remove_favorite_technician(
        self, client_id: UUID, technician_id: UUID
    ) -> bool:
        """"""
        return await self.repo.remove_favorite_technician(client_id, technician_id)

    async def authenticate(self, email: str, password: str) -> Optional[ClientResponse]:
        """"""
        client: Optional[ClientInDB] = await self.repo.readone_by_email(email)
        if client is None:
            return None
        if not SecurityUtils.verify_password(password, client.hashed_password):
            return None
        return client_in_db_to_response(client)

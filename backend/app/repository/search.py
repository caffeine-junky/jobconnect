from uuid import UUID
from asyncpg import Record  # type: ignore
from typing import List, Optional, Any
from app.database import AsyncDatabase
from app.models import TechnicianInDB

from .technician import record_to_technician
from loguru import logger


class SearchRepository:
    def __init__(self, db: AsyncDatabase) -> None:
        self.db = db

    async def search_nearby_technicians(
        self,
        client_id: UUID,
        radius_km: float,
        service_names: Optional[List[str]] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianInDB]:
        """
        Search for technicians within a given radius (in km) of a client's location.
        Optionally filter by one or more service names.

        Returns:
            List of TechnicianInDB objects
        """
        # Prepare base query
        query = f"""
            SELECT
                t.id,
                t.fullname,
                t.email,
                t.phone,
                t.hashed_password,
                t.location_name,
                ST_X(t.location::geometry) AS longitude,
                ST_Y(t.location::geometry) AS latitude,
                (
                    SELECT AVG(r.rating)
                    FROM review r
                    WHERE r.technician_id = t.id
                ) AS rating,
                ARRAY(
                    SELECT s.name
                    FROM technician_service ts
                    JOIN service s ON s.id = ts.service_id
                    WHERE ts.technician_id = t.id
                ) AS services,
                t.is_available,
                (
                    SELECT COUNT(*) > 0
                    FROM verified_technician vt
                    WHERE vt.technician_id = t.id
                ) AS is_verified,
                t.is_active,
                t.created_at,
                ST_Distance(
                    t.location,
                    (SELECT c.location FROM client c WHERE c.id = $1)
                ) AS distance_meters
            FROM technician t
            WHERE
                ST_Distance(
                    t.location,
                    (SELECT c.location FROM client c WHERE c.id = $1)
                ) / 1000 <= $2
                AND t.is_active = TRUE
        """

        # Parameters for the query
        params: List[Any] = [client_id, radius_km]

        # Add optional service filter
        if service_names:
            query += """
                AND t.id IN (
                    SELECT ts.technician_id
                    FROM technician_service ts
                    JOIN service s ON ts.service_id = s.id
                    WHERE s.name = ANY($3::text[])
                )
            """
            params.append(service_names)

        # Add ordering and pagination
        offset_param_index = len(params) + 1
        limit_param_index = len(params) + 2

        query += f"""
            ORDER BY distance_meters ASC
            OFFSET ${offset_param_index}
            LIMIT ${limit_param_index}
        """
        params.extend([skip, limit])

        # Execute query
        technician_records: List[Record] = await self.db.fetchall(query, *params)
        [
            logger.debug(
                f"""
            name: {r["fullname"]}, latitude: {r["latitude"]}, longitude: {r["longitude"]}
            is {r["distance_meters"] / 1000} KM away
            """
            )
            for r in technician_records
        ]
        return [record_to_technician(record) for record in technician_records]

    async def search_technicians_by_description(
        self,
        client_id: UUID,
        problem_description: str,
        radius_km: float,
        skip: int = 0,
        limit: int = 100,
    ) -> List[TechnicianInDB]:
        """
        Search technicians whose services match the given problem description using full-text search
        on an indexed tsvector column. Results are filtered by proximity to the client's location
        and ranked by relevance and distance.
        """

        # Base SELECT clause for technician data
        select_clause = """
            t.id,
            t.fullname,
            t.email,
            t.phone,
            t.hashed_password,
            t.location_name,
            ST_X(t.location::geometry) AS longitude,
            ST_Y(t.location::geometry) AS latitude,
            (SELECT AVG(r.rating) FROM review r WHERE r.technician_id = t.id) AS rating,
            ARRAY(
                SELECT s.name
                FROM technician_service ts
                JOIN service s ON s.id = ts.service_id
                WHERE ts.technician_id = t.id
            ) AS services,
            t.is_available,
            (SELECT COUNT(*) > 0 FROM verified_technician vt WHERE vt.technician_id = t.id) AS is_verified,
            t.is_active,
            t.created_at,
            ST_Distance(t.location::geometry, c.location::geometry) AS distance_meters
        """

        # SQL query using the indexed search_vector and distance filtering
        query = f"""
            SELECT {select_clause}
            FROM technician t
            JOIN client c ON c.id = $1
            WHERE ST_Distance(
                    t.location,
                    c.location
                ) / 1000 <= $2
            AND EXISTS (
                SELECT 1
                FROM technician_service ts
                JOIN service s ON ts.service_id = s.id
                WHERE ts.technician_id = t.id
                AND s.search_vector @@ plainto_tsquery('english', $3)
            )
            ORDER BY (
                SELECT MAX(ts_rank(s.search_vector, plainto_tsquery('english', $3)))
                FROM technician_service ts
                JOIN service s ON ts.service_id = s.id
                WHERE ts.technician_id = t.id
                AND s.search_vector @@ plainto_tsquery('english', $3)
            ) DESC,
            distance_meters ASC
            OFFSET $4 LIMIT $5
        """

        # Parameters for the query
        params: List[Any] = [
            client_id,  # $1
            radius_km,  # $2
            problem_description.strip(),  # $3
            skip,  # $4
            limit,  # $5
        ]

        # Execute the query and map results
        technician_records: List[Record] = await self.db.fetchall(query, *params)
        return [record_to_technician(record) for record in technician_records]

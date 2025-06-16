import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { TechnicianResponse } from "@/lib/types/technician";

const URL = `${BASE_API_URL}/search/nearby`;

export async function searchNearbyTechnicians(
    client_id: string,
    radius_km: number,
    skip: number = 0,
    limit: number = 100
): Promise<TechnicianResponse[]> {
    const params: { [key: string]:| number } = {
        skip: skip,
        limit: limit
    }
    const response = await axios.get(`${URL}/${client_id}/${radius_km}`, { params });
    return response.data;
}

export async function searchTechniciansByDescription(
    client_id: string,
    radius_km: number,
    problem_description: string,
    skip: number = 0,
    limit: number = 100
): Promise<TechnicianResponse[]> {
    const params: { [key: string]:| number } = {
        skip: skip,
        limit: limit
    }
    const response = await axios.get(`${URL}/${client_id}/${radius_km}/${problem_description}`, { params });
    return response.data;
}

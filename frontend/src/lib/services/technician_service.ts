import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { TechnicianServiceCreate, TechnicianServiceResponse, TechnicianServiceUpdate } from "@/lib/types/technician_service";

const URL = `${BASE_API_URL}/technician_service`;

export async function createTechnicianService(data: TechnicianServiceCreate): Promise<TechnicianServiceResponse> {
    const response = await axios.post(URL, data);
    return response.data;
}

export async function readoneTechnicianService(technicianServiceID: string): Promise<TechnicianServiceResponse> {
    const response = await axios.get(`${URL}/${technicianServiceID}`);
    return response.data;
}

export async function readallTechnicianServices(
    technicianID?: string,
    serviceID?: string,
    minPrice?: number,
    maxPrice?: number,
    skip: number = 0,
    limit: number = 100
) {
    const params: {[key: string]: string | number} = {};
    if (technicianID !== undefined) {
        params.technician_id = technicianID;
    }
    if (serviceID !== undefined) {
        params.service_id = serviceID;
    }
    if (minPrice !== undefined) {
        params.min_price = minPrice;
    }
    if (maxPrice !== undefined) {
        params.max_price = maxPrice;
    }

    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(URL, { params });
    return response.data;
}

export async function updateTechnicianService(
    technicianServiceID: string,
    data: TechnicianServiceUpdate
): Promise<TechnicianServiceResponse> {
    const response = await axios.put(`${URL}/${technicianServiceID}`, data);
    return response.data;
}

export async function deleteTechnicianService(
    technicianServiceID: string,
): Promise<boolean> {
    const response = await axios.delete(`${URL}/${technicianServiceID}`);
    return response.data;
}

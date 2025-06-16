import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { TechnicianCreate, TechnicianUpdate, TechnicianResponse } from "@/lib/types/technician";

const URL = `${BASE_API_URL}/technician`;

export async function createTechnician(data: TechnicianCreate): Promise<TechnicianResponse> {
    const response = await axios.post(`${URL}/`, data);
    return response.data;
}

export async function readoneTechnician(technician_id: string): Promise<TechnicianResponse> {
    const response = await axios.get(`${URL}/${technician_id}`);
    return response.data;
}

export async function readallTechnicians(
    active?: boolean,
    skip: number = 0,
    limit: number = 100
): Promise<TechnicianResponse[]> {
    const params: { [key: string]: boolean | number } = {};

    if (active !== undefined) {
        params.active = active;
    }
    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(URL, { params });
    return response.data;
}

export async function updateTechnician(technician_id: string, data: TechnicianUpdate): Promise<TechnicianResponse> {
    const response = await axios.put(`${URL}/${technician_id}`, data);
    return response.data;
}


export async function deleteTechnician(technician_id: string): Promise<boolean> {
    const response = await axios.delete(`${URL}/${technician_id}`);
    return response.data;
}

export async function readoneTechnicianByEmail(email: string): Promise<TechnicianResponse> {
    const response = await axios.get(`${URL}/lookup/email/${email}`);
    return response.data;
}

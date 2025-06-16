import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type {
    TechnicianAvailabilityCreate,
    TechnicianAvailabilityUpdate,
    TechnicianAvailabilityResponse,
} from "@/lib/types/technician_availability";

const URL = `${BASE_API_URL}/technician_availability`;

export async function createTechnicianAvailability(data: TechnicianAvailabilityCreate): Promise<TechnicianAvailabilityResponse> {
    const response = await axios.post(URL, data);
    return response.data;
}

export async function readoneTechnicianAvailability(technician_availability_id: string): Promise<TechnicianAvailabilityResponse> {
    const response = await axios.get(`${URL}/${technician_availability_id}`);
    return response.data;
}

export async function readallTechnicianAvailabilities(
    day?: number,
    start_time?: string,
    end_time?: string,
    skip: number = 0,
    limit: number = 100,
): Promise<TechnicianAvailabilityResponse[]> {
    const params: { [key: string]: string | number } = {};

    if (day !== undefined) {
        params.day = day;
    }
    if (start_time !== undefined) {
        params.start_time = start_time;
    }
    if (end_time !== undefined) {
        params.end_time = end_time;
    }

    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(URL, { params });
    return response.data;
}

export async function readallTechnicianAvailabilitiesByTechnician(
    technicianID: string,
    day?: number,
    startTime?: string,
    endTime?: string,
    skip: number = 0,
    limit: number = 100,
): Promise<TechnicianAvailabilityResponse[]> {
    const params: { [key: string]: string | number } = {};

    if (day !== undefined) {
        params.day = day;
    }
    if (startTime !== undefined) {
        params.start_time = startTime;
    }
    if (endTime !== undefined) {
        params.end_time = endTime;
    }

    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(`${URL}/${technicianID}`, { params });
    return response.data;
}

export async function deleteTechnicianAvailability(technician_availability_id: string): Promise<TechnicianAvailabilityResponse> {
    const response = await axios.delete(`${URL}/${technician_availability_id}`);
    return response.data;
}

export async function updateTechnicianAvailability(technician_availability_id: string, data: TechnicianAvailabilityUpdate): Promise<TechnicianAvailabilityResponse> {
    const response = await axios.put(`${URL}/${technician_availability_id}`, data);
    return response.data;
}

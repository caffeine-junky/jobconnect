import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { ServiceCreate, ServiceResponse, ServiceUpdate } from "../types/service";

const URL = `${BASE_API_URL}/service`;

export async function createService(data: ServiceCreate): Promise<ServiceResponse> {
    const response = await axios.post(URL, data);
    return response.data;
}

export async function readoneService(serviceID: string): Promise<ServiceResponse> {
    const response = await axios.get(`${URL}/${serviceID}`);
    return response.data;
}

export async function readallServices(
    skip: number = 0,
    limit: number = 100
): Promise<ServiceResponse[]> {
    const params = {skip: skip, limit: limit};
    const response = await axios.get(URL, {params});
    return response.data;
}

export async function updateService(
    serviceID: string,
    data: ServiceUpdate
): Promise<ServiceResponse> {
    const response = await axios.put(`${URL}/${serviceID}`, data);
    return response.data;
}

export async function deleteService(serviceID: string): Promise<boolean> {
    const response = await axios.delete(`${URL}/${serviceID}`);
    return response.data;
}

export async function readoneServiceByName(serviceName: string): Promise<ServiceResponse> {
    const response = await axios.get(`${URL}/lookup/${serviceName}`);
    return response.data;
}

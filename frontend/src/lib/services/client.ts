import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { ClientCreate, ClientUpdate, ClientResponse } from "@/lib/types/client";

const URL = `${BASE_API_URL}/client`;

export async function createClient(data: ClientCreate): Promise<ClientResponse> {
    const response = await axios.post(`${URL}/`, data);
    return response.data;
}

export async function readoneClient(client_id: string): Promise<ClientResponse> {
    const response = await axios.get(`${URL}/${client_id}`);
    return response.data;
}

export async function readallClients(
    active?: boolean,
    skip: number = 0,
    limit: number = 100
): Promise<ClientResponse[]> {
    const params: { [key: string]: boolean | number } = {};

    if (active !== undefined) {
        params.active = active;
    }
    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(URL, { params });
    return response.data;
}

export async function updateClient(client_id: string, data: ClientUpdate): Promise<ClientResponse> {
    const response = await axios.put(`${URL}/${client_id}`, data);
    return response.data;
}


export async function deleteClient(client_id: string): Promise<boolean> {
    const response = await axios.delete(`${URL}/${client_id}`);
    return response.data;
}

export async function readoneClientByEmail(email: string): Promise<ClientResponse> {
    const response = await axios.get(`${URL}/lookup/email/${email}`);
    return response.data;
}

export async function addFavoriteTechnician(
    client_id: string,
    technician_id: string
): Promise<boolean> {
    const response = await axios.post(`${URL}/technician/${client_id}/${technician_id}/`);
    return response.data;
}

export async function removeFavoriteTechnician(
    client_id: string,
    technician_id: string
): Promise<boolean> {
    const response = await axios.delete(`${URL}/technician/${client_id}/${technician_id}`);
    return response.data;
}

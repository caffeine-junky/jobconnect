import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { AdminCreate, AdminUpdate, AdminResponse } from "@/lib/types/admin";
import type { AdminRole, UserRole } from "@/lib/types/enums";

const URL = `${BASE_API_URL}/admin`;

export async function createAdmin(data: AdminCreate): Promise<AdminResponse> {
	const response = await axios.post(`${URL}/`, data);
    return response.data;
}

export async function readoneAdmin(adminID: string): Promise<AdminResponse> {
    const response = await axios.get(`${URL}/${adminID}`);
    return response.data;
}

export async function readallAdmins(
    role?: AdminRole,
    active?: boolean,
    skip: number = 0,
    limit: number = 100,
): Promise<AdminResponse[]> {
    const params: { [key: string]: string | number | boolean } = {};

    if (role !== undefined) {
        params.role = role;
    }
    if (active !== undefined) {
        params.active = active;
    }

    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(URL, { params });
    return response.data;
}

export async function updateAdmin(adminID: string, data: AdminUpdate): Promise<AdminResponse> {
    const response = await axios.put(`${URL}/${adminID}`, data);
    return response.data;
}


export async function deleteAdmin(adminID: string): Promise<boolean> {
    const response = await axios.delete(`${URL}/${adminID}`);
    return response.data;
}

export async function readoneAdminByEmail(email: string): Promise<AdminResponse> {
    const response = await axios.get(`${URL}/lookup/email/${email}`);
    return response.data;
}

export async function verifyTechnician(adminID: string, technicianID: string): Promise<boolean> {
    const response = await axios.post(`${URL}/${adminID}/verify/${technicianID}`);
    return response.data;
}

export async function setUserActiveStatus(
    admin_id: string,
    user_id: string,
    role: UserRole,
    status: boolean
): Promise<boolean> {
    const response = await axios.post(`${URL}/${admin_id}/${user_id}/${role}/${status}`);
    return response.data;
}

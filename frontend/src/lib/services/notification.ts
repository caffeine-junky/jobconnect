import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { NotificationCreate, NotificationResponse } from "@/lib/types/notification";

const URL = `${BASE_API_URL}/notification`;

export async function createNotification(data: NotificationCreate): Promise<NotificationResponse> {
    const response = await axios.post(`${URL}/`, data);
    return response.data;
}

export async function readoneNotification(notification_id: string): Promise<NotificationResponse> {
    const response = await axios.get(`${URL}/${notification_id}`);
    return response.data;
}

export async function deleteNotification(notification_id: string): Promise<boolean> {
    const response = await axios.delete(`${URL}/${notification_id}`);
    return response.data;
}

export async function readallNotifications(
    read?: boolean,
    skip: number = 0,
    limit: number = 100
): Promise<NotificationResponse[]> {
    const params: { [key: string]: boolean | number } = {};

    if (read !== undefined) {
        params.read = read;
    }
    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(URL, { params });
    return response.data;
}

export async function readallNotificationsByClient(
    client_id: string,
    read?: boolean,
    skip: number = 0,
    limit: number = 100
): Promise<NotificationResponse[]> {
    const params: { [key: string]: string | boolean | number } = {};

    params.client_id = client_id;
    if (read !== undefined) {
        params.read = read;
    }
    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(`${URL}/client/${client_id}`, { params });
    return response.data;
}

export async function readallNotificationsByTechnician(
    technician_id: string,
    read?: boolean,
    skip: number = 0,
    limit: number = 100
): Promise<NotificationResponse[]> {
    const params: { [key: string]: string | boolean | number } = {};

    params.technician_id = technician_id;
    if (read !== undefined) {
        params.read = read;
    }
    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(`${URL}/technician/${technician_id}`, { params });
    return response.data;
}

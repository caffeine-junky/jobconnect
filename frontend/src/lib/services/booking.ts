import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { BookingStatus } from "@/lib/types/enums";
import type { BookingCreate, BookingUpdate, BookingResponse } from "@/lib/types/booking";

const URL = `${BASE_API_URL}/booking`;

export async function createBooking(data: BookingCreate): Promise<BookingResponse> {
    const response = await axios.post(`${URL}/`, data);
    return response.data;
}

export async function readoneBooking(booking_id: string): Promise<BookingResponse> {
    const response = await axios.get(`${URL}/${booking_id}`);
    return response.data;
}

export async function readallBookings(
    client_id?: string,
    technician_id?: string,
    status?: BookingStatus,
    booking_date?: Date,
    skip: number = 0,
    limit: number = 100
): Promise<BookingResponse[]> {
    const params: { [key: string]: string | number | BookingStatus | Date } = {};

    if (client_id !== undefined) {
        params.client_id = client_id;
    }
    if (technician_id !== undefined) {
        params.technician_id = technician_id;
    }
    if (status !== undefined) {
        params.status = status;
    }
    if (booking_date !== undefined) {
        params.booking_date = booking_date;
    }
    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(URL, { params });
    return response.data;
}

export async function updateBooking(booking_id: string, data: BookingUpdate): Promise<BookingResponse> {
    const response = await axios.put(`${URL}/${booking_id}`, data);
    return response.data;
}

export async function deleteBooking(booking_id: string): Promise<boolean> {
    const response = await axios.delete(`${URL}/${booking_id}`);
    return response.data;
}

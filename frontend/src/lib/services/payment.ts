import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { PaymentStatus } from "@/lib/types/enums";
import type { PaymentCreate, PaymentUpdate, PaymentResponse } from "@/lib/types/payment";

const URL = `${BASE_API_URL}/payment`;

export async function createPayment(data: PaymentCreate): Promise<PaymentResponse> {
    const response = await axios.post(`${URL}/`, data);
    return response.data;
}

export async function updatePayment(payment_id: string, data: PaymentUpdate): Promise<PaymentResponse> {
    const response = await axios.put(`${URL}/${payment_id}`, data);
    return response.data;
}

export async function readonePayment(payment_id: string): Promise<PaymentResponse> {
    const response = await axios.get(`${URL}/${payment_id}`);
    return response.data;
}

export async function readallPayments(
    client_id?: string,
    technician_id?: string,
    min_amount?: number,
    max_amount?: number,
    status?: PaymentStatus,
    skip: number = 0,
    limit: number = 100
): Promise<PaymentResponse[]> {
    const params: { [key: string]: string | number } = {};

    if (client_id !== undefined) {
        params.client_id = client_id;
    }
    if (technician_id !== undefined) {
        params.technician_id = technician_id;
    }
    if (min_amount !== undefined) {
        params.min_amount = min_amount;
    }
    if (max_amount !== undefined) {
        params.max_amount = max_amount;
    }
    if (status !== undefined) {
        params.status = status;
    }
    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(URL, { params });
    return response.data;
}

export async function deletePayment(payment_id: string): Promise<PaymentResponse> {
    const response = await axios.delete(`${URL}/${payment_id}`);
    return response.data;
}

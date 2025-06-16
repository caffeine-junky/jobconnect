import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { ReviewCreate, ReviewUpdate, ReviewResponse } from "@/lib/types/review";

const URL = `${BASE_API_URL}/review`;

export async function createReview(data: ReviewCreate): Promise<ReviewResponse> {
    const response = await axios.post(`${URL}/`, data);
    return response.data;
}

export async function readoneReview(review_id: string): Promise<ReviewResponse> {
    const response = await axios.get(`${URL}/${review_id}`);
    return response.data;
}

export async function readallReviews(
    client_id?: string,
    technician_id?: string,
    min_rating?: number,
    skip: number = 0,
    limit: number = 100
): Promise<ReviewResponse[]> {
    const params: { [key: string]: string | number } = {};

    if (client_id !== undefined) {
        params.client_id = client_id;
    }
    if (technician_id !== undefined) {
        params.technician_id = technician_id;
    }
    if (min_rating !== undefined) {
        params.min_rating = min_rating;
    }
    params.skip = skip;
    params.limit = limit;

    const response = await axios.get(URL, { params });
    return response.data;
}

export async function updateReview(review_id: string, data: ReviewUpdate): Promise<ReviewResponse> {
    const response = await axios.put(`${URL}/${review_id}`, data);
    return response.data;
}

export async function deleteReview(review_id: string): Promise<boolean> {
    const response = await axios.delete(`${URL}/${review_id}`);
    return response.data;
}

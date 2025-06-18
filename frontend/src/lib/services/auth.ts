import axios from "axios";
import { BASE_API_URL } from "@/lib/constants";
import type { Token, TokenData, LoginRequest } from "@/lib/types/auth";
import type { AdminResponse } from "../types/admin";
import type { ClientResponse } from "../types/client";
import type { TechnicianResponse } from "../types/technician";
import type { UserRole } from "../types/enums";

const URL = `${BASE_API_URL}/auth`

export async function login(form: LoginRequest): Promise<Token> {
    const response = await axios.post(`${URL}/login`, form);
    return response.data;
}

export async function get_current_user(token: string): Promise<{
    user: AdminResponse | ClientResponse | TechnicianResponse,
    user_role: UserRole
}> {
    const response = await axios.get(`${URL}/me`, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
}

export function saveToken(token: string): void {
    localStorage.setItem("token", token);
}

export function logout(): void {
    localStorage.removeItem("token");
}

export function getToken(): string | null {
    return localStorage.getItem("token");
}

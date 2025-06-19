import axios from "axios";
import { BASE_API_URL } from "../constants";
import type { TechnicianReport } from "../types/report";

const URL = `${BASE_API_URL}/report`

export async function readTechnicianReport(technicianID: string): Promise<TechnicianReport> {
    const response = await axios.get(`${URL}/technician/${technicianID}`);
    return response.data;
}

import { z } from "zod";

const BaseVerifiedTechnicianSchema = z.object({
    client_id: z.string().uuid(),
    technician_id: z.string().uuid(),
});

export const VerifiedTechnicianCreateSchema = BaseVerifiedTechnicianSchema.extend({});

export const VerifiedTechnicianResponseSchema = BaseVerifiedTechnicianSchema.extend({
    created_at: z.string().datetime(),
});

export type VerifiedTechnicianCreate = z.infer<typeof VerifiedTechnicianCreateSchema>;
export type VerifiedTechnicianResponse = z.infer<typeof VerifiedTechnicianResponseSchema>;

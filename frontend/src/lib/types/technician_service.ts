import { z } from "zod";

const BaseTechnicianServiceSchema = z.object({
    technician_id: z.string().uuid(),
    service_id: z.string().uuid(),
    experience_years: z.number().min(0),
    price: z.number().gt(0)
});

export const TechnicianServiceCreateSchema = BaseTechnicianServiceSchema.extend({});

export const TechnicianServiceUpdateSchema = z.object({
    experience_years: z.number().min(0).optional(),
    price: z.number().gt(0).optional()
});

export const TechnicianServiceResponseSchema = BaseTechnicianServiceSchema.extend({
    id: z.string().uuid(),
});

export type TechnicianServiceCreate = z.infer<typeof TechnicianServiceCreateSchema>;
export type TechnicianServiceUpdate = z.infer<typeof TechnicianServiceUpdateSchema>;
export type TechnicianServiceResponse = z.infer<typeof TechnicianServiceResponseSchema>;

import { z } from "zod";

const BaseServiceSchema = z.object({
    name: z.string(),
    description: z.string(),
})

export const ServiceCreateSchema = BaseServiceSchema.extend({})

export const ServiceUpdateSchema = z.object({
    name: z.string().optional(),
    description: z.string().optional(),
})

export const ServiceResponseSchema = BaseServiceSchema.extend({
    id: z.string().uuid(),
    created_at: z.string().datetime(),
})

export type ServiceCreate = z.infer<typeof ServiceCreateSchema>;
export type ServiceUpdate = z.infer<typeof ServiceUpdateSchema>;
export type ServiceResponse = z.infer<typeof ServiceResponseSchema>;

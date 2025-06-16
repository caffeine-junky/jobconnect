import { z } from "zod";
import { PhoneSchema } from "./base/phone";
import { LocationSchema } from "./base/location";

const BaseTechnician = z.object({
    fullname: z.string(),
    email: z.string().email(),
    phone: PhoneSchema
});

export const TechnicianCreateSchema = BaseTechnician.extend({
    password: z.string().min(3),
    location: LocationSchema
});

export const TechnicianUpdateSchema = z.object({
    fullname: z.string().optional(),
    email: z.string().email().optional(),
    phone: PhoneSchema.optional(),
    location: LocationSchema.optional(),
    password: z.string().min(3).optional(),
});

export const TechnicianResponseSchema = BaseTechnician.extend({
    id: z.string().uuid(),
    location: LocationSchema,
    rating: z.number(),
    services: z.array(z.string()),
    is_available: z.boolean(),
    is_verified: z.boolean(),
    is_active: z.boolean(),
    created_at: z.string().datetime(),
});

export type TechnicianCreate = z.infer<typeof TechnicianCreateSchema>;
export type TechnicianUpdate = z.infer<typeof TechnicianUpdateSchema>;
export type TechnicianResponse = z.infer<typeof TechnicianResponseSchema>;

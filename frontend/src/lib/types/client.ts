import { z } from "zod";
import { PhoneSchema } from "./base/phone";
import { LocationSchema } from "./base/location";

const BaseClient = z.object({
    fullname: z.string(),
    email: z.string().email(),
    phone: PhoneSchema
});

export const ClientCreateSchema = BaseClient.extend({
    password: z.string().min(3),
    location: LocationSchema
});

export const ClientUpdateSchema = z.object({
    fullname: z.string().optional(),
    email: z.string().email().optional(),
    phone: PhoneSchema.optional(),
    location: LocationSchema.optional(),
    password: z.string().min(3).optional(),
});

export const ClientResponseSchema = BaseClient.extend({
    id: z.string().uuid(),
    location: LocationSchema,
    is_active: z.boolean(),
    created_at: z.string().datetime(),
});

export type ClientCreate = z.infer<typeof ClientCreateSchema>;
export type ClientUpdate = z.infer<typeof ClientUpdateSchema>;
export type ClientResponse = z.infer<typeof ClientResponseSchema>;

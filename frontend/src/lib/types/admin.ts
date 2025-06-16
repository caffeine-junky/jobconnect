import { z } from "zod";
import { AdminRoleSchema } from "./enums";
import { PhoneSchema } from "./base/phone";


const BaseAdmin = z.object({
    fullname: z.string(),
    email: z.string().email(),
    phone: PhoneSchema,
    role: AdminRoleSchema,
});

export const AdminCreateSchema = BaseAdmin.extend({
    password: z.string().min(3),
});

export const AdminUpdateSchema = z.object({
    fullname: z.string().optional(),
    email: z.string().email().optional(),
    phone: PhoneSchema.optional(),
});

export const AdminResponseSchema = BaseAdmin.extend({
    id: z.string().uuid(),
    is_active: z.boolean(),
    created_at: z.string().datetime(),
});

export type AdminCreate = z.infer<typeof AdminCreateSchema>;
export type AdminUpdate = z.infer<typeof AdminUpdateSchema>;
export type AdminResponse = z.infer<typeof AdminResponseSchema>;

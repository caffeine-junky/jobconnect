import { z } from "zod";
import { AdminRole } from "./enums"; // Assuming AdminRole is an enum or similar Zod enum

const SA_PHONE_REGEX = /^0\d{9}$/;
const PASSWORD_MIN_LENGTH = 3;
const PASSWORD_MAX_LENGTH = 64;

const emailSchema = z.string().trim().email("Invalid email address");

const phoneSchema = z.string().trim().regex(SA_PHONE_REGEX, "Invalid South African phone number format (e.g., 0721234567)");

const passwordCreateSchema = z.string()
    .min(PASSWORD_MIN_LENGTH, `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`)
    .max(PASSWORD_MAX_LENGTH, `Password must be at most ${PASSWORD_MAX_LENGTH} characters long`)
    .trim();

export const AdminCreateSchema = z.object({
    fullname: z.string().min(2, "Full name must be at least 2 characters long").trim(),
    email: emailSchema,
    phone: phoneSchema,
    role: AdminRole, // Assuming AdminRole is a TypeScript enum
    password: passwordCreateSchema,
});

export const AdminUpdateSchema = z.object({
    fullname: z.string().min(2, "Full name must be at least 2 characters long").trim().optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    password: passwordCreateSchema.optional(), // Can use the same password validation for updates
});

export const AdminResponseSchema = z.object({
    id: z.string().uuid("Invalid admin ID format"), // Assuming 'id' is a UUID
    fullname: z.string(),
    email: emailSchema,
    phone: phoneSchema,
    role: AdminRole,
    is_active: z.boolean(),
    created_at: z.string().datetime("Invalid datetime format"), // Zod's datetime validates ISO 8601 strings
    updated_at: z.string().datetime("Invalid datetime format").optional(), // Often useful to include update timestamp
});

export type AdminCreate = z.infer<typeof AdminCreateSchema>;
export type AdminUpdate = z.infer<typeof AdminUpdateSchema>;
export type AdminResponse = z.infer<typeof AdminResponseSchema>;

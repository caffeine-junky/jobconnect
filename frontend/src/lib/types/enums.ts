import { z } from "zod";

export const UserRoleSchema = z.enum(["ADMIN", "CLIENT", "TECHNICIAN"]);

export const AdminRoleSchema = z.enum(["SUPER_ADMIN", "SUPPORT_ADMIN", "CONTENT_ADMIN"]);

export const BookingStatusSchema = z.enum([
    "REQUESTED",
    "ACCEPTED",
    "REJECTED",
    "IN_PROGRESS",
    "CANCELLED",
    "COMPLETED",
])

export const PaymentStatusSchema = z.enum(["PENDING", "EZCROW", "COMPLETED", "RETURNED"]);

export type UserRole = z.infer<typeof UserRoleSchema>;
export type AdminRole = z.infer<typeof AdminRoleSchema>;
export type BookingStatus = z.infer<typeof BookingStatusSchema>;
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

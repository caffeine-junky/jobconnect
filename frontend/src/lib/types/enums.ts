import { z } from "zod";

export const UserRole = z.enum(["ADMIN", "CLIENT", "TECHNICIAN"]);
export type UserRoleType = z.infer<typeof UserRole>;

export const AdminRole = z.enum(["SUPER_ADMIN", "SUPPORT_ADMIN", "CONTENT_ADMIN"]);
export type AdminRoleType = z.infer<typeof AdminRole>;

export const BookingStatus = z.enum([
    "REQUESTED",
    "ACCEPTED",
    "REJECTED",
    "IN_PROGRESS",
    "CANCELLED",
    "COMPLETED",
])
export type BookingStatusType = z.infer<typeof BookingStatus>;

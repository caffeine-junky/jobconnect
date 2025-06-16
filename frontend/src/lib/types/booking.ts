import { z } from "zod";
import { TimeSlotSchema } from "./base/timeslot";
import { LocationSchema } from "./base/location";
import { BookingStatusSchema } from "./enums";

const BaseBookingSchema = z.object({
    client_id: z.string().uuid(),
    technician_id: z.string().uuid(),
    service_name: z.string(),
    description: z.string(),
    timeslot: TimeSlotSchema,
    location: LocationSchema
})

export const BookingCreateSchema = BaseBookingSchema.extend({})

export const BookingUpdateSchema = z.object({
    status: BookingStatusSchema.optional(),
    description: z.string().optional()
})

export const BookingResponseSchema = BaseBookingSchema.extend({
    id: z.string().uuid(),
    status: BookingStatusSchema,
    created_at: z.string().datetime(),
})

export type BookingCreate = z.infer<typeof BookingCreateSchema>;
export type BookingUpdate = z.infer<typeof BookingUpdateSchema>;
export type BookingResponse = z.infer<typeof BookingResponseSchema>;

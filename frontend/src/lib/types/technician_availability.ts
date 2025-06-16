import { z } from "zod";
import { TimeSlotDaySchema } from "./base/timeslot";

const BaseTechnicianAvailabilitySchema = z.object({
    technician_id: z.string().uuid(),
    timeslot: TimeSlotDaySchema
});

export const TechnicianAvailabilityCreateSchema = BaseTechnicianAvailabilitySchema.extend({});

export const TechnicianAvailabilityUpdateSchema = z.object({
    timeslot: TimeSlotDaySchema.optional(),
    active: z.boolean().optional(),
});

export const TechnicianAvailabilityResponseSchema = BaseTechnicianAvailabilitySchema.extend({
    id: z.string().uuid(),
    active: z.boolean()
});

export type TechnicianAvailabilityCreate = z.infer<typeof TechnicianAvailabilityCreateSchema>;
export type TechnicianAvailabilityUpdate = z.infer<typeof TechnicianAvailabilityUpdateSchema>;
export type TechnicianAvailabilityResponse = z.infer<typeof TechnicianAvailabilityResponseSchema>;

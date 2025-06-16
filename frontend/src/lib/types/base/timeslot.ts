import { z } from "zod";

export const TimeSlotSchema = z.object({
    stot_date: z.string().date(),
    start_time: z.string().time(),
    end_time: z.string().time()
})

export const TimeSlotDaySchema = z.object({
    day: z.number().min(0).max(6),
    start_time: z.string().time(),
    end_time: z.string().time()
})

export type TimeSlot = z.infer<typeof TimeSlotSchema>;
export type TimeSlotDay = z.infer<typeof TimeSlotDaySchema>;

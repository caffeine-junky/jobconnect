import { z } from "zod";

const BaseReviewSchema = z.object({
    booking_id: z.string().uuid(),
    client_id: z.string().uuid(),
    technician_id: z.string().uuid(),
    rating: z.number().min(0).max(5),
    comment: z.string().nullable(),
})

export const ReviewCreateSchema = BaseReviewSchema.extend({})

export const ReviewUpdateSchema = z.object({
    rating: z.number().min(0).max(5).optional(),
    comment: z.string().nullable().optional(),
})

export const ReviewResponseSchema = BaseReviewSchema.extend({
    id: z.string().uuid(),
    client_name: z.string(),
    service_name: z.string(),
    created_at: z.string().datetime(),
})

export type ReviewCreate = z.infer<typeof ReviewCreateSchema>;
export type ReviewUpdate = z.infer<typeof ReviewUpdateSchema>;
export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;

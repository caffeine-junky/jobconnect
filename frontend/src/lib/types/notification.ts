import { z } from "zod";

const BaseNotificationSchema = z.object({
    client_id: z.string().nullable(),
    technician_id: z.string().nullable(),
    title: z.string(),
    message: z.string()
});

export const NotificationCreateSchema = BaseNotificationSchema.extend({});

export const NotificationResponseSchema = BaseNotificationSchema.extend({
    id: z.string().uuid(),
    is_read: z.boolean(),
    created_at: z.string().datetime(),
});

export type NotificationCreate = z.infer<typeof NotificationCreateSchema>;
export type NotificationResponse = z.infer<typeof NotificationResponseSchema>;

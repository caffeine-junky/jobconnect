import { z } from "zod";
import { PaymentStatusSchema } from "./enums";

const BasePaymentSchema = z.object({
    booking_id: z.string().uuid(),
    client_id: z.string().uuid(),
    technician_id: z.string().uuid(),
    amount: z.number().min(0),
});

export const PaymentCreateSchema = BasePaymentSchema.extend({});

export const PaymentUpdateSchema = z.object({
    amount: z.number().min(0).optional(),
    status: PaymentStatusSchema.optional(),
});

export const PaymentResponseSchema = BasePaymentSchema.extend({
    id: z.string().uuid(),
    status: PaymentStatusSchema,
    created_at: z.string().datetime(),
    updated_at: z.string().datetime()
});

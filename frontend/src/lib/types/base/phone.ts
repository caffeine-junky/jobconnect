import { z } from "zod";

export const PhoneSchema = z.string().regex(/^(?:\+27|27|0)[6-8][0-9]{8}$/);
export type Phone = z.infer<typeof PhoneSchema>;

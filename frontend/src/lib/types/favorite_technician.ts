import { z } from "zod";

const BaseFavoriteTechnicianSchema = z.object({
    client_id: z.string().uuid(),
    technician_id: z.string().uuid(),
});

export const FavoriteTechnicianCreateSchema = BaseFavoriteTechnicianSchema.extend({});

export const FavoriteTechnicianResponseSchema = BaseFavoriteTechnicianSchema.extend({});

export type FavoriteTechnicianCreate = z.infer<typeof FavoriteTechnicianCreateSchema>;
export type FavoriteTechnicianResponse = z.infer<typeof FavoriteTechnicianResponseSchema>;

import { z } from "zod";

export const LocationSchema = z.object({
    location_name: z.string(),
    latitude: z.number().lte(90).gte(-90),
    longitude: z.number().lte(180).gte(-180),
})

export type Location = z.infer<typeof LocationSchema>;

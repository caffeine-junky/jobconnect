import { z } from 'zod';

export const TechnicianReportSchema = z.object({
  // Bookings
  active_bookings: z.number().int().nonnegative(),
  total_bookings: z.number().int().nonnegative(),
  rejected_bookings: z.number().int().nonnegative(),
  accepted_bookings: z.number().int().nonnegative(),
  // Payments
  total_payments: z.number().int().nonnegative(),
  total_revenue: z.number().nonnegative(),
  // Distance
  shortest_distance_km: z.number().nonnegative(),
  longest_distance_km: z.number().nonnegative(),
  total_distance_km: z.number().nonnegative(),
  // Reviews
  rating: z.number().min(0).max(5),
  num_reviews: z.number().int().nonnegative(),
  // Repeating clients
  num_repeating_clients: z.number().int().nonnegative(),
  // Services
  num_services_offered: z.number().int().nonnegative(),
  most_booked_service_name: z.string(),
  least_booked_service_name: z.string(),
});

export type TechnicianReport = z.infer<typeof TechnicianReportSchema>;
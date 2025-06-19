from pydantic import BaseModel


class TechnicianReport(BaseModel):
    # Bookings
    active_bookings: int
    total_bookings: int
    rejected_bookings: int
    accepted_bookings: int
    # Payments
    total_payments: int
    total_revenue: float
    # Distance
    shortest_distance_km: float
    longest_distance_km: float
    total_distance_km: float
    # Reviews
    rating: float
    num_reviews: int
    # Repeating clients
    num_repeating_clients: int
    # Services
    num_services_offered: int
    most_booked_service_name: str
    least_booked_service_name: str

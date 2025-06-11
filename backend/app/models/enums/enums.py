from enum import StrEnum


class UserRole(StrEnum):
    """Represents the role of the user"""

    ADMIN = "ADMIN"
    CLIENT = "CLIENT"
    TECHNICIAN = "TECHNICIAN"


class AdminRole(StrEnum):
    """Represents the role of the admin"""

    SUPER_ADMIN = "SUPER_ADMIN"
    SUPPORT_ADMIN = "SUPPORT_ADMIN"
    CONTENT_ADMIN = "CONTENT_ADMIN"


class BookingStatus(StrEnum):
    """Represents the status of a booking"""

    REQUESTED = "REQUESTED"
    ACCEPTED = "ACCEPTED"
    REJECTED = "REJECTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

import type { BookingResponse } from "@/lib/types/booking";
import type { BookingStatus } from "@/lib/types/enums";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
    Clock, 
    MapPin, 
    Calendar, 
    User, 
    Wrench,
    CheckCircle,
    XCircle,
    AlertCircle,
    Clock3,
    PlayCircle,
    ThumbsUp,
    ThumbsDown
} from "lucide-react";

export default function BookingCard({booking}: {booking: BookingResponse}) {
    const getStatusConfig = (status: BookingStatus) => {
        switch (status) {
            case "REQUESTED":
                return {
                    color: "bg-orange-100 text-orange-800 border-orange-200",
                    icon: <Clock3 className="w-4 h-4" />,
                    label: "Requested"
                };
            case "ACCEPTED":
                return {
                    color: "bg-blue-100 text-blue-800 border-blue-200",
                    icon: <ThumbsUp className="w-4 h-4" />,
                    label: "Accepted"
                };
            case "REJECTED":
                return {
                    color: "bg-red-100 text-red-800 border-red-200",
                    icon: <ThumbsDown className="w-4 h-4" />,
                    label: "Rejected"
                };
            case "IN_PROGRESS":
                return {
                    color: "bg-purple-100 text-purple-800 border-purple-200",
                    icon: <PlayCircle className="w-4 h-4" />,
                    label: "In Progress"
                };
            case "CANCELLED":
                return {
                    color: "bg-gray-100 text-gray-800 border-gray-200",
                    icon: <XCircle className="w-4 h-4" />,
                    label: "Cancelled"
                };
            case "COMPLETED":
                return {
                    color: "bg-green-100 text-green-800 border-green-200",
                    icon: <CheckCircle className="w-4 h-4" />,
                    label: "Completed"
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-800 border-gray-200",
                    icon: <AlertCircle className="w-4 h-4" />,
                    label: "Unknown"
                };
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDateTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const statusConfig = getStatusConfig(booking.status);

    return (
        <Card className="w-full hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-blue-600" />
                        {booking.service_name}
                    </CardTitle>
                    <Badge 
                        className={`${statusConfig.color} flex items-center gap-1`}
                        variant="outline"
                    >
                        {statusConfig.icon}
                        {statusConfig.label}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Description */}
                {booking.description && (
                    <div>
                        <p className="text-sm text-muted-foreground">
                            {booking.description}
                        </p>
                    </div>
                )}

                <Separator />

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date and Time */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">Date:</span>
                            <span>{formatDate(booking.timeslot.slot_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">Time:</span>
                            <span>
                                {formatTime(booking.timeslot.start_time)} - {formatTime(booking.timeslot.end_time)}
                            </span>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                            <MapPin className="w-4 h-4 text-gray-600" />
                            <span className="font-medium">Location:</span>
                            <span>{booking.location.location_name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="ml-6">
                                {booking.location.latitude.toFixed(6)}, {booking.location.longitude.toFixed(6)}
                            </span>
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Client and Technician IDs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">Client ID:</span>
                        <span className="text-muted-foreground font-mono text-xs">
                            {booking.client_id.slice(0, 8)}...
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-600" />
                        <span className="font-medium">Technician ID:</span>
                        <span className="text-muted-foreground font-mono text-xs">
                            {booking.technician_id.slice(0, 8)}...
                        </span>
                    </div>
                </div>

                {/* Created At */}
                <div className="pt-2 border-t">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Created: {formatDateTime(booking.created_at)}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
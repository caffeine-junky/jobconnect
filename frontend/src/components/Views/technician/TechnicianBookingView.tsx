import * as bookingService from "@/lib/services/booking";
import * as notificationService from "@/lib/services/notification";
import type { BookingResponse, BookingUpdate } from "@/lib/types/booking";
import type { TechnicianResponse } from "@/lib/types/technician";
import type { BookingStatus } from "@/lib/types/enums";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown, Check, X, Ban } from "lucide-react";

export default function TechnicianBookingView({ technician }: { technician: TechnicianResponse }) {
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updatingBookings, setUpdatingBookings] = useState<Set<string>>(new Set());
    
    // Filter and sort states
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"created_at" | "service_name" | "status" | "date">("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        const fetchBookings = async () => {
            if (!technician) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const bookingData = await bookingService.readallBookings(undefined, technician.id);
                setBookings(bookingData);
            } catch (error) {
                setError("Failed to fetch bookings");
                toast.error(`Failed to fetch booking: ${error}`)
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [technician]);

    // Filter and sort bookings
    useEffect(() => {
        let filtered = [...bookings];

        // Apply status filter
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(booking => booking.status === statusFilter);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (booking.location?.location_name && booking.location.location_name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            let aValue: any;
            let bValue: any;

            switch (sortBy) {
                case "created_at":
                    aValue = new Date(a.created_at);
                    bValue = new Date(b.created_at);
                    break;
                case "service_name":
                    aValue = a.service_name.toLowerCase();
                    bValue = b.service_name.toLowerCase();
                    break;
                case "status":
                    aValue = a.status;
                    bValue = b.status;
                    break;
                case "date":
                    aValue = a.timeslot?.slot_date ? new Date(a.timeslot.slot_date) : new Date(0);
                    bValue = b.timeslot?.slot_date ? new Date(b.timeslot.slot_date) : new Date(0);
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) {
                return sortOrder === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortOrder === "asc" ? 1 : -1;
            }
            return 0;
        });

        setFilteredBookings(filtered);
    }, [bookings, statusFilter, searchTerm, sortBy, sortOrder]);

    const getClientID = (bookingID: string) => {
        const cid = bookings.find(b => b.id == bookingID)?.client_id;
        return !cid ? '' : cid;
    }

    const handleBookingUpdate = async (bookingId: string, update: BookingUpdate) => {
        setUpdatingBookings(prev => new Set(prev).add(bookingId));
        
        try {
            await bookingService.updateBooking(bookingId, update);
            // Update the booking in the local state
            setBookings(prevBookings => 
                prevBookings.map(booking => 
                    booking.id === bookingId 
                        ? { ...booking, ...update }
                        : booking
                )
            );
        } catch (error) {
            toast.error("Failed to update booking: " + error)
            setError("Failed to update booking");
        } finally {
            setUpdatingBookings(prev => {
                const newSet = new Set(prev);
                newSet.delete(bookingId);
                return newSet;
            });
        }
    };

    const handleAcceptBooking = async (bookingId: string) => {
        handleBookingUpdate(bookingId, { status: "ACCEPTED" });
        toast.info("Booking Accepted")
        await notificationService.createNotification({
            client_id: getClientID(bookingId),
            technician_id: null,
            title: "Booking Confirmation",
            message: `${technician?.fullname} has accepted your booking request, please deposit payment.`
        })
    };

    const handleRejectBooking = async (bookingId: string) => {
        handleBookingUpdate(bookingId, { status: "REJECTED" });
        toast.info("Booking rejected")
        await notificationService.createNotification({
            client_id: getClientID(bookingId),
            technician_id: null,
            title: "Booking Rejection",
            message: `${technician?.fullname} has accepted your booking request, please deposit payment.`
        })
    };

    const handleCancelBooking = async (bookingId: string) => {
        handleBookingUpdate(bookingId, { status: "CANCELLED" });
        toast.info("Booking Cancelled")
        await notificationService.createNotification({
            client_id: getClientID(bookingId),
            technician_id: null,
            title: "Booking Cancellation",
            message: `${technician?.fullname} has accepted your booking request, please deposit payment.`
        })
    };

    const getStatusColor = (status: BookingStatus) => {
        switch (status) {
            case "REQUESTED":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "ACCEPTED":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "REJECTED":
                return "bg-red-100 text-red-800 border-red-300";
            case "IN_PROGRESS":
                return "bg-purple-100 text-purple-800 border-purple-300";
            case "CANCELLED":
                return "bg-gray-100 text-gray-800 border-gray-300";
            case "COMPLETED":
                return "bg-green-100 text-green-800 border-green-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCreatedAt = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatTime = (timeString: string) => {
        if (!timeString) return "N/A";
        try {
            const time = new Date(`1970-01-01T${timeString}`);
            return time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return timeString;
        }
    };

    const handleSort = (column: "created_at" | "service_name" | "status" | "date") => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const getSortIcon = (column: "created_at" | "service_name" | "status" | "date") => {
        if (sortBy !== column) {
            return <ArrowUpDown className="h-4 w-4" />;
        }
        return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const getAvailableActions = (booking: BookingResponse) => {
        const isUpdating = updatingBookings.has(booking.id);
        
        switch (booking.status) {
            case "REQUESTED":
                return (
                    <div className="flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAcceptBooking(booking.id)}
                            disabled={isUpdating}
                            className="bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                        >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRejectBooking(booking.id)}
                            disabled={isUpdating}
                            className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                        >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                        </Button>
                    </div>
                );
            case "ACCEPTED":
                return (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCancelBooking(booking.id)}
                        disabled={isUpdating}
                        className="bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
                    >
                        <Ban className="h-4 w-4 mr-1" />
                        Cancel
                    </Button>
                );
            default:
                return <span className="text-sm text-gray-500">No actions available</span>;
        }
    };

    if (!technician) {
        return <div className="p-4 text-center text-gray-500">No technician selected</div>;
    }

    if (loading) {
        return <div className="p-4 text-center">Loading bookings...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    const statusOptions: Array<{ value: BookingStatus | "ALL"; label: string }> = [
        { value: "ALL", label: "All Statuses" },
        { value: "REQUESTED", label: "Requested" },
        { value: "ACCEPTED", label: "Accepted" },
        { value: "REJECTED", label: "Rejected" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "CANCELLED", label: "Cancelled" },
        { value: "COMPLETED", label: "Completed" },
    ];

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <h2 className="text-2xl font-bold">My Bookings</h2>
                <div className="flex-1" />
                <Badge variant="outline" className="text-sm">
                    {filteredBookings.length} of {bookings.length} bookings
                </Badge>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <label className="block text-sm font-medium mb-1">Search</label>
                    <Input
                        placeholder="Search bookings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as BookingStatus | "ALL")}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {statusOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Clear Filters</label>
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            setStatusFilter("ALL");
                            setSearchTerm("");
                            setSortBy("created_at");
                            setSortOrder("desc");
                        }}
                        disabled={statusFilter === "ALL" && !searchTerm && sortBy === "created_at" && sortOrder === "desc"}
                    >
                        Reset
                    </Button>
                </div>
            </div>

            {/* Data Table */}
            <div className="border rounded-lg overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("service_name")}
                                    className="flex items-center gap-1 p-0 h-auto font-medium"
                                >
                                    Service Name
                                    {getSortIcon("service_name")}
                                </Button>
                            </TableHead>
                            <TableHead className="max-w-[200px]">Description</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("status")}
                                    className="flex items-center gap-1 p-0 h-auto font-medium"
                                >
                                    Status
                                    {getSortIcon("status")}
                                </Button>
                            </TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("date")}
                                    className="flex items-center gap-1 p-0 h-auto font-medium"
                                >
                                    Date
                                    {getSortIcon("date")}
                                </Button>
                            </TableHead>
                            <TableHead>Start Time</TableHead>
                            <TableHead>End Time</TableHead>
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("created_at")}
                                    className="flex items-center gap-1 p-0 h-auto font-medium"
                                >
                                    Created At
                                    {getSortIcon("created_at")}
                                </Button>
                            </TableHead>
                            <TableHead className="w-[200px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                                    {bookings.length === 0 ? "No bookings found" : "No bookings match your filters"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredBookings.map((booking) => (
                                <TableRow key={booking.id} className="hover:bg-gray-50">
                                    <TableCell className="font-medium">
                                        {booking.service_name}
                                    </TableCell>
                                    <TableCell className="max-w-[200px]">
                                        <div className="truncate" title={booking.description}>
                                            {booking.description}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(booking.status)}>
                                            {booking.status.replace("_", " ")}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {booking.location?.location_name || "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {booking.timeslot?.slot_date ? formatDate(booking.timeslot.slot_date) : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {booking.timeslot?.start_time ? formatTime(booking.timeslot.start_time) : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {booking.timeslot?.end_time ? formatTime(booking.timeslot.end_time) : "N/A"}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {formatCreatedAt(booking.created_at)}
                                    </TableCell>
                                    <TableCell>
                                        {getAvailableActions(booking)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Table Footer with Summary */}
            {filteredBookings.length > 0 && (
                <div className="text-sm text-gray-600 text-center">
                    Showing {filteredBookings.length} of {bookings.length} bookings
                </div>
            )}
        </div>
    );
}
import * as bookingService from "@/lib/services/booking";
import type { BookingResponse } from "@/lib/types/booking";
import type { ClientResponse } from "@/lib/types/client";
import type { BookingStatus } from "@/lib/types/enums";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function ClientBookingView({ client }: { client?: ClientResponse }) {
    const [bookings, setBookings] = useState<BookingResponse[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<BookingResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Filter and sort states
    const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"created_at" | "service_name" | "status" | "date">("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        const fetchBookings = async () => {
            if (!client) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const bookingData = await bookingService.readallBookings(client.id);
                setBookings(bookingData);
            } catch (error) {
                setError("Failed to fetch bookings");
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [client]);

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
        // Handle different time formats
        try {
            const time = new Date(`1970-01-01T${timeString}`);
            return time.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });
        } catch {
            return timeString; // Return as-is if parsing fails
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

    if (!client) {
        return <div className="p-4 text-center text-gray-500">No client selected</div>;
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
                <h2 className="text-2xl font-bold">Bookings</h2>
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
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
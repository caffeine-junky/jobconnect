import * as paymentService from "@/lib/services/payment";
import type { PaymentResponse } from "@/lib/types/payment";
import type { ClientResponse } from "@/lib/types/client";
import type { PaymentStatus } from "@/lib/types/enums";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export default function ClientPaymentView({ client }: { client?: ClientResponse }) {
    const [payments, setPayments] = useState<PaymentResponse[]>([]);
    const [filteredPayments, setFilteredPayments] = useState<PaymentResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // Filter and sort states
    const [statusFilter, setStatusFilter] = useState<PaymentStatus | "ALL">("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"created_at" | "updated_at" | "amount" | "status">("created_at");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        const fetchPayments = async () => {
            if (!client) return;
            
            setLoading(true);
            setError(null);
            
            try {
                const paymentData = await paymentService.readallPayments(client.id);
                setPayments(paymentData);
            } catch (error) {
                setError("Failed to fetch payments");
                console.error("Error fetching payments:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [client]);

    // Filter and sort payments
    useEffect(() => {
        let filtered = [...payments];

        // Apply status filter
        if (statusFilter !== "ALL") {
            filtered = filtered.filter(payment => payment.status === statusFilter);
        }

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(payment =>
                payment.booking_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                payment.amount.toString().includes(searchTerm.toLowerCase()) ||
                payment.id.toLowerCase().includes(searchTerm.toLowerCase())
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
                case "updated_at":
                    aValue = new Date(a.updated_at);
                    bValue = new Date(b.updated_at);
                    break;
                case "amount":
                    aValue = a.amount;
                    bValue = b.amount;
                    break;
                case "status":
                    aValue = a.status;
                    bValue = b.status;
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

        setFilteredPayments(filtered);
    }, [payments, statusFilter, searchTerm, sortBy, sortOrder]);

    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "EZCROW":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "COMPLETED":
                return "bg-green-100 text-green-800 border-green-300";
            case "RETURNED":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "ZAR", // You can make this configurable based on your needs
        }).format(amount);
    };

    const handleSort = (column: "created_at" | "updated_at" | "amount" | "status") => {
        if (sortBy === column) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(column);
            setSortOrder("asc");
        }
    };

    const getSortIcon = (column: "created_at" | "updated_at" | "amount" | "status") => {
        if (sortBy !== column) {
            return <ArrowUpDown className="h-4 w-4" />;
        }
        return sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const getTotalAmount = () => {
        return filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    };

    if (!client) {
        return <div className="p-4 text-center text-gray-500">No client selected</div>;
    }

    if (loading) {
        return <div className="p-4 text-center">Loading payments...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
    }

    const statusOptions: Array<{ value: PaymentStatus | "ALL"; label: string }> = [
        { value: "ALL", label: "All Statuses" },
        { value: "PENDING", label: "Pending" },
        { value: "EZCROW", label: "Escrow" },
        { value: "COMPLETED", label: "Completed" },
        { value: "RETURNED", label: "Returned" },
    ];

    return (
        <div className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <h2 className="text-2xl font-bold">Payments</h2>
                <div className="flex-1" />
                <div className="flex gap-2">
                    <Badge variant="outline" className="text-sm">
                        {filteredPayments.length} of {payments.length} payments
                    </Badge>
                    <Badge variant="default" className="text-sm">
                        Total: {formatCurrency(getTotalAmount())}
                    </Badge>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                    <label className="block text-sm font-medium mb-1">Search</label>
                    <Input
                        placeholder="Search payments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as PaymentStatus | "ALL")}>
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
                                    onClick={() => handleSort("amount")}
                                    className="flex items-center gap-1 p-0 h-auto font-medium"
                                >
                                    Amount
                                    {getSortIcon("amount")}
                                </Button>
                            </TableHead>
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
                            <TableHead>
                                <Button
                                    variant="ghost"
                                    onClick={() => handleSort("updated_at")}
                                    className="flex items-center gap-1 p-0 h-auto font-medium"
                                >
                                    Updated At
                                    {getSortIcon("updated_at")}
                                </Button>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPayments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    {payments.length === 0 ? "No payments found" : "No payments match your filters"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPayments.map((payment) => (
                                <TableRow key={payment.id} className="hover:bg-gray-50">
                                    <TableCell className="font-semibold">
                                        {formatCurrency(payment.amount)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={getStatusColor(payment.status)}>
                                            {payment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {formatDate(payment.created_at)}
                                    </TableCell>
                                    <TableCell className="text-sm text-gray-600">
                                        {formatDate(payment.updated_at)}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Table Footer with Summary */}
            {filteredPayments.length > 0 && (
                <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Showing {filteredPayments.length} of {payments.length} payments</span>
                    <span className="font-medium">
                        Filtered Total: {formatCurrency(getTotalAmount())}
                    </span>
                </div>
            )}
        </div>
    );
}
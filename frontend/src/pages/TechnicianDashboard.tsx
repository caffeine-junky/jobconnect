import * as authService from "@/lib/services/auth";
import type { AdminResponse } from "@/lib/types/admin";
import { type ClientResponse } from "@/lib/types/client";
import type { UserRole } from "@/lib/types/enums";
import type { TechnicianResponse } from "@/lib/types/technician";
import { useEffect, useState } from "react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
    Activity, 
    CalendarDays, 
    MessageSquare, 
    Calendar, 
    CreditCard, 
    Bell,
    ChevronLeft,
    ChevronRight,
    Wrench
} from "lucide-react";

import Header from "@/components/Views/Header";
import AnalyticsView from "@/components/Views/technician/AnalyticsView";
import TechnicianBookingView from "@/components/Views/technician/TechnicianBookingView";
import PaymentsView from "@/components/Views/technician/PaymentsView";
import NotificationView from "@/components/Views/NotificationView";
import ServicesView from "@/components/Views/technician/ServicesView";

export default function TechnicianDashboard() {
    const [technician, setTechnician] = useState<TechnicianResponse | null>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeSection, setActiveSection] = useState("analytics");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const sidebarItems = [
        {
            id: "analytics",
            label: "Analytics",
            icon: Activity,
        },
        {
            id: "schedule",
            label: "Schedule",
            icon: CalendarDays,
        },
        {
            id: "bookings",
            label: "Bookings",
            icon: Calendar,
        },
        {
            id: "payments",
            label: "Payments",
            icon: CreditCard,
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: Bell,
        },
        {
            id: "services",
            label: "Services",
            icon: Wrench
        }
    ];

    const fetchCurrentUser = async () => {
        try {
            setIsLoading(true);
            const token = authService.getToken();
            if (token === null) {
                setError("not logged in");
                return;
            }
            const user: {
                user: AdminResponse | ClientResponse | TechnicianResponse,
                user_role: UserRole
            } = await authService.get_current_user(token);
            if (user.user_role !== "TECHNICIAN") {
                setError("Only clients are allowed pass this point");
                return;
            }
            setTechnician(user.user as TechnicianResponse);
            setError(null);
        } catch (error) {
            console.error("Error fetching current user:", error);
            setError(error instanceof Error ? error.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const renderContent = () => {
        if (!technician) {
            return (
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <p className="text-gray-600">Welcome to your dashboard!</p>
                </div>
            );
        }
        switch (activeSection) {
            case "analytics":
                return (
                    <AnalyticsView technician={technician} />
                );
            case "schedule":
                return (
                    <>Schedule</>
                );
            case "bookings":
                return (
                    <TechnicianBookingView technician={technician} />
                );
            case "payments":
                return (
                    <PaymentsView technician={technician} />
                );
            case "notifications":
                return (
                    <NotificationView userID={technician.id} userRole="TECHNICIAN" />
                );
            case "services":
                return (
                    <ServicesView technician={technician} />
                );
            case "reviews":
                return (<>Reviews</>);
            default:
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                        <p className="text-gray-600">Welcome to your dashboard!</p>
                    </div>
                );
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center w-screen h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center w-screen h-screen">
                <Alert variant="destructive" className="max-w-md">
                    <AlertTitle>Error logging in</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full">
            {/* Header at the top */}
            <Header fullname={technician?.fullname} />
            
            {/* Main content area below header */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className={`
                    shadow-lg transition-all duration-300 ease-in-out relative
                    ${sidebarOpen ? 'w-64' : 'w-16'}
                `}>
                    {/* Sidebar toggle button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -right-3 top-4 z-10 bg-white shadow-md rounded-full w-6 h-6 p-0 border"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        {sidebarOpen ? (
                            <ChevronLeft className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>

                    <div className="flex flex-col h-full">
                        {/* Sidebar header */}
                        {sidebarOpen && (
                            <div className="p-4 border-b">
                                <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
                                    Dashboard
                                </h2>
                            </div>
                        )}
                        
                        {/* Navigation */}
                        <nav className="flex-1 p-2 space-y-2">
                            {sidebarItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Button
                                        key={item.id}
                                        variant={activeSection === item.id ? "default" : "ghost"}
                                        className={`
                                            w-full gap-3 transition-all duration-200
                                            ${sidebarOpen ? 'justify-start px-3' : 'justify-center px-0'}
                                            
                                        `}
                                        onClick={() => setActiveSection(item.id)}
                                        title={!sidebarOpen ? item.label : ''}
                                    >
                                        <Icon className="h-5 w-5 flex-shrink-0" />
                                        {sidebarOpen && (
                                            <span className="truncate">{item.label}</span>
                                        )}
                                    </Button>
                                );
                            })}
                        </nav>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 overflow-y-auto bg-white">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
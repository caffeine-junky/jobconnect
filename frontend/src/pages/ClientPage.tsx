import * as authService from "@/lib/services/auth";
import type { AdminResponse } from "@/lib/types/admin";
import { type ClientResponse } from "@/lib/types/client";
import type { UserRole } from "@/lib/types/enums";
import type { TechnicianResponse } from "@/lib/types/technician";
import { useEffect, useState } from "react";

import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
    Search, 
    Settings, 
    MessageSquare, 
    Calendar, 
    CreditCard, 
    Bell,
    ChevronLeft,
    ChevronRight,
    Star
} from "lucide-react";

import Header from "@/components/Views/Header";
import FindTechniciansView from "@/components/Views/FindTechniciansView";
import DescribeProblemView from "@/components/Views/ProblemDescriptionView";
import ClientBookingView from "@/components/Views/ClientBookingsView";
import ClientPaymentView from "@/components/Views/PaymentView";
import NotificationView from "@/components/Views/NotificationView";
import FavoriteTechniciansView from "@/components/Views/FavoriteTechnicians";
import { TechnicianProfilePage } from "./TechnicianProfilePage";

export default function ClientDashboard() {
    const [client, setClient] = useState<ClientResponse | null>();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [activeSection, setActiveSection] = useState("find-technicians");
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentTechnician, setCurrentTechnician] = useState<TechnicianResponse | null>(null);

    const setTechnician = (t: TechnicianResponse) => {
        setActiveSection("technician");
        setCurrentTechnician(t)
    }

    const sidebarItems = [
        {
            id: "find-technicians",
            label: "Find Technicians",
            icon: Search,
        },
        {
            id: "find-services",
            label: "Find Services",
            icon: Settings,
        },
        {
            id: "describe-problem",
            label: "Describe Your Problem",
            icon: MessageSquare,
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
            id: "favorite-technicians",
            label: "Favorite Technicians",
            icon: Star
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
            if (user.user_role !== "CLIENT") {
                setError("Only clients are allowed pass this point");
                return;
            }
            setClient(user.user as ClientResponse);
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
        if (!client) {
            return (
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
                    <p className="text-gray-600">Welcome to your dashboard!</p>
                </div>
            );
        }
        switch (activeSection) {
            case "find-technicians":
                return (
                    <FindTechniciansView setTechnician={setTechnician} client={client? client : undefined} />
                );
            case "find-services":
                return (
                    <div className="p-6">
                        <h2 className="text-2xl font-bold mb-4">Find Services</h2>
                        <p className="text-gray-600">Browse available services.</p>
                    </div>
                );
            case "describe-problem":
                return (
                    <DescribeProblemView client={client ? client : undefined} />
                );
            case "bookings":
                return (
                    <ClientBookingView client={client ? client : undefined} />
                );
            case "payments":
                return (
                    <ClientPaymentView client={client ? client : undefined} />
                );
            case "notifications":
                return (
                    <NotificationView userID={client?.id} userRole="CLIENT" />
                );
            case "favorite-technicians":
                return (
                    <FavoriteTechniciansView client={client} />
                );
            case "technician":
                if (!currentTechnician) return (<></>);
                return (
                    <TechnicianProfilePage technician={currentTechnician} client={client} />
                );
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
            <Header fullname={client?.fullname} />
            
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
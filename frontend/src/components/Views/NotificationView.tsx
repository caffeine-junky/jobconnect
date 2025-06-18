import * as notificationService from "@/lib/services/notification";
import type { NotificationResponse } from "@/lib/types/notification";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import type { UserRole } from "@/lib/types/enums";
import { Bell, Check, Clock, Filter, RefreshCw, SortAsc, SortDesc } from "lucide-react";

function NotificationCard({notification, onMarkAsRead}: {
    notification: NotificationResponse, 
    onMarkAsRead: (id: string) => void
}) {
    const [isRead, setIsRead] = useState<boolean>(notification.is_read);
    const [isMarking, setIsMarking] = useState<boolean>(false);
    
    const markAsRead = async () => {
        try {
            setIsMarking(true);
            await notificationService.markAsRead(notification.id);
            setIsRead(true);
            onMarkAsRead(notification.id);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        } finally {
            setIsMarking(false);
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
        
        if (diffInHours < 1) return "Just now";
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInHours < 48) return "Yesterday";
        
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }

    const getNotificationIcon = () => {
        if (isRead) return <Check className="w-4 h-4 text-green-500" />;
        return <Bell className="w-4 h-4 text-blue-500" />;
    }
    
    return (
        <Card className={`
            transition-all duration-300 hover:shadow-md cursor-pointer group
            ${!isRead 
                ? 'border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/50 to-transparent shadow-sm' 
                : 'hover:bg-gray-50/50'
            }
        `}>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
                <div className="flex items-start gap-3 flex-1">
                    <div className="mt-0.5">
                        {getNotificationIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <CardTitle className={`text-base leading-snug ${!isRead ? 'font-semibold' : 'font-medium'}`}>
                            {notification.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                                {formatDate(notification.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
                <Badge 
                    variant={isRead ? "secondary" : "default"}
                    className={`
                        ml-2 shrink-0 transition-colors
                        ${!isRead ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}
                    `}
                >
                    {isRead ? "Read" : "New"}
                </Badge>
            </CardHeader>
            <CardContent className="pt-0">
                <p className={`text-sm leading-relaxed ${!isRead ? 'text-gray-800' : 'text-gray-600'}`}>
                    {notification.message}
                </p>
            </CardContent>
            {!isRead && (
                <CardFooter className="pt-2">
                    <Button 
                        size="sm"
                        onClick={markAsRead}
                        disabled={isMarking}
                        className="group-hover:bg-blue-600 transition-colors"
                    >
                        {isMarking ? (
                            <>
                                <RefreshCw className="w-3 h-3 mr-1.5 animate-spin" />
                                Marking...
                            </>
                        ) : (
                            <>
                                <Check className="w-3 h-3 mr-1.5" />
                                Mark as read
                            </>
                        )}
                    </Button>
                </CardFooter>
            )}
        </Card>
    );
}

type SortOption = "newest" | "oldest";
type FilterOption = "all" | "read" | "unread";

export default function NotificationView({userID, userRole}: {userID: string, userRole: UserRole}) {
    const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [filterBy, setFilterBy] = useState<FilterOption>("all");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            let response: NotificationResponse[] | null = null;
            
            if (userRole === "CLIENT") {
                response = await notificationService.readallNotificationsByClient(userID);
            } else if (userRole === "TECHNICIAN") {
                response = await notificationService.readallNotificationsByTechnician(userID);
            }
            
            if (response !== null) {
                setNotifications(response);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleMarkAsRead = (notificationId: string) => {
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === notificationId 
                    ? { ...notification, is_read: true }
                    : notification
            )
        );
    }

    const sortNotifications = (notifications: NotificationResponse[]) => {
        return [...notifications].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime();
            const dateB = new Date(b.created_at).getTime();
            
            return sortBy === "newest" ? dateB - dateA : dateA - dateB;
        });
    }

    const filterNotifications = (notifications: NotificationResponse[]) => {
        switch (filterBy) {
            case "read":
                return notifications.filter(n => n.is_read);
            case "unread":
                return notifications.filter(n => !n.is_read);
            default:
                return notifications;
        }
    }

    const processedNotifications = sortNotifications(filterNotifications(notifications));
    const unreadCount = notifications.filter(n => !n.is_read).length;

    useEffect(() => {
        fetchNotifications();
    }, [userID, userRole]);

    return (
        <div className="h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
            <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
                {/* Fixed Header */}
                <div className="flex-shrink-0 p-6 pb-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <Bell className="w-8 h-8 text-blue-600" />
                                {unreadCount > 0 && (
                                    <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                    Notifications
                                </h1>
                                <p className="text-gray-500 text-sm mt-1">
                                    Stay updated with your latest activities
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                                <SelectTrigger className="w-[160px] bg-white border-gray-200 focus:border-blue-500">
                                    {sortBy === "newest" ? <SortDesc className="w-4 h-4 mr-2" /> : <SortAsc className="w-4 h-4 mr-2" />}
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="newest">
                                        <div className="flex items-center gap-2">
                                            <SortDesc className="w-4 h-4" />
                                            Newest first
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="oldest">
                                        <div className="flex items-center gap-2">
                                            <SortAsc className="w-4 h-4" />
                                            Oldest first
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                                <SelectTrigger className="w-[160px] bg-white border-gray-200 focus:border-blue-500">
                                    <Filter className="w-4 h-4 mr-2" />
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All notifications</SelectItem>
                                    <SelectItem value="unread">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            Unread only
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="read">
                                        <div className="flex items-center gap-2">
                                            <Check className="w-4 h-4 text-green-500" />
                                            Read only
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Button 
                                onClick={fetchNotifications} 
                                disabled={isLoading}
                                variant="outline"
                                className="bg-white hover:bg-gray-50 border-gray-200"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                {isLoading ? "Refreshing..." : "Refresh"}
                            </Button>
                        </div>
                    </div>

                    {/* Stats Summary */}
                    {notifications.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
                                        <p className="text-sm text-gray-500">Total</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{unreadCount}</p>
                                        <p className="text-sm text-gray-500">Unread</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Check className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{notifications.length - unreadCount}</p>
                                        <p className="text-sm text-gray-500">Read</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Scrollable Notifications Area */}
                <div className="flex-1 overflow-hidden px-6 pt-6">
                    <div className="h-full overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg border border-gray-200">
                                <RefreshCw className="w-8 h-8 text-gray-400 animate-spin mb-4" />
                                <p className="text-gray-500 text-lg">Loading your notifications...</p>
                                <p className="text-gray-400 text-sm">This might take a moment</p>
                            </div>
                        ) : processedNotifications.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full bg-white rounded-lg border border-gray-200">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Bell className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {filterBy === "all" 
                                        ? "No notifications yet" 
                                        : `No ${filterBy} notifications`
                                    }
                                </h3>
                                <p className="text-gray-500 text-center max-w-md">
                                    {filterBy === "all" 
                                        ? "When you receive notifications, they'll appear here. Stay tuned!" 
                                        : `Try adjusting your filter to see ${filterBy === "read" ? "unread" : "read"} notifications.`
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {processedNotifications.map((notification, index) => (
                                    <div 
                                        key={notification.id}
                                        className="animate-in slide-in-from-bottom-4 duration-300"
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <NotificationCard 
                                            notification={notification}
                                            onMarkAsRead={handleMarkAsRead}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
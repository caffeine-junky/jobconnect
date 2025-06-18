import * as notificationService from "@/lib/services/notification";
import type { NotificationResponse } from "@/lib/types/notification";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { useState, useEffect } from "react";
import type { UserRole } from "@/lib/types/enums";

function NotificationCard({notification, onMarkAsRead}: {
    notification: NotificationResponse, 
    onMarkAsRead: (id: string) => void
}) {
    const [isRead, setIsRead] = useState<boolean>(notification.is_read);
    
    const markAsRead = async () => {
        try {
            await notificationService.markAsRead(notification.id);
            setIsRead(true);
            onMarkAsRead(notification.id);
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    return (
        <Card className={`${!isRead ? 'border-blue-200 bg-blue-50' : ''}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg">{notification.title}</CardTitle>
                <div className="flex items-center gap-2">
                    <Badge variant={isRead ? "secondary" : "default"}>
                        {isRead ? "Read" : "Unread"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                        {formatDate(notification.created_at)}
                    </span>
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{notification.message}</p>
            </CardContent>
            <CardFooter>
                <Button 
                    disabled={isRead} 
                    onClick={markAsRead}
                    variant={isRead ? "secondary" : "default"}
                >
                    {isRead ? "Read" : "Mark as read"}
                </Button>
            </CardFooter>
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

    const getUnreadCount = () => {
        return notifications.filter(n => !n.is_read).length;
    }

    useEffect(() => {
        fetchNotifications();
    }, [userID, userRole]);

    return (
        <div className="space-y-6">
            {/* Header with controls */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    {getUnreadCount() > 0 && (
                        <Badge variant="destructive">
                            {getUnreadCount()} unread
                        </Badge>
                    )}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2">
                    <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest first</SelectItem>
                            <SelectItem value="oldest">Oldest first</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Filter by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All notifications</SelectItem>
                            <SelectItem value="unread">Unread only</SelectItem>
                            <SelectItem value="read">Read only</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button onClick={fetchNotifications} disabled={isLoading}>
                        {isLoading ? "Loading..." : "Refresh"}
                    </Button>
                </div>
            </div>

            {/* Notifications list */}
            <div className="space-y-4">
                {isLoading ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">Loading notifications...</p>
                    </div>
                ) : processedNotifications.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground">
                            {filterBy === "all" 
                                ? "No notifications found" 
                                : `No ${filterBy} notifications found`
                            }
                        </p>
                    </div>
                ) : (
                    processedNotifications.map((notification) => (
                        <NotificationCard 
                            key={notification.id} 
                            notification={notification}
                            onMarkAsRead={handleMarkAsRead}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
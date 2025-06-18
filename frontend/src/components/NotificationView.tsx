import * as notificationService from "@/lib/services/notification";
import type { NotificationResponse } from "@/lib/types/notification";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";


function notificationCard({notification}: {notification: NotificationResponse}) {

    const markAsRead = async () {
        await notificationService.readoneNotification
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>{notification.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-muted">{notification.message}</p>
            </CardContent>
            <CardFooter>
                <Button onClick={markAsRead}>Mark as read</Button>
            </CardFooter>
        </Card>
    );
}

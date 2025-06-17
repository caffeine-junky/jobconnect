import * as authService from "@/lib/services/auth";
import type { TechnicianResponse } from "@/lib/types/technician";

// import { useNavigate } from "react-router-dom";

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

import { BadgeCheckIcon, LocationEditIcon, StarIcon } from "lucide-react"


export default function TechnicianCard({ technician }: {technician: TechnicianResponse}) {
    // const navigate = useNavigate();

    const getInitials = () => {
        const all = technician.fullname.split(" ");
        const name = all[0].charAt(0);
        const last = all.pop()?.charAt(0);
        return `${name}${last}`.toUpperCase();
    }

    const renderIcons = () => {
        const numFilled = Math.round(technician.rating);
        const stars = [];
        
    }

    return (
        <Card className="max-w-90 min-h-120 px-4 py-8">
            <CardHeader className="flex flex-col items-center justify-center gap-4">
                <Badge
                    variant="secondary"
                    className="bg-blue-500 text-white dark:bg-blue-600"
                    >
                    <BadgeCheckIcon width={18} />
                    Verified
                </Badge>
                <Avatar className="w-30 h-30">
                    <AvatarImage />
                    <AvatarFallback className="text-2xl font-bold">{getInitials()}</AvatarFallback>
                </Avatar>
                <p className="font-bold">{technician.fullname}</p>
                <span className="flex items-center justify-center gap-2">
                    <LocationEditIcon width={18} className="text-zinc-500" />
                    <p className="font-semibold text-zinc-500" >{technician.location.location_name}</p>
                </span>
            </CardHeader>
        </Card>
    );
}

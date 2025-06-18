"use client"
import type { TechnicianResponse } from "@/lib/types/technician";
// import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BadgeCheckIcon, MapPinIcon, Star } from "lucide-react";

/**
 * Technician response is as follows:
 * TechnicianResponse = {
    fullname: string;
    email: string;
    phone: string;
    id: string;
    location: {
        location_name: string;
        latitude: number;
        longitude: number;
    };
    rating: number;
    services: string[];
    is_available: boolean;
    is_verified: boolean;
    is_active: boolean;
    created_at: string;
}
 */
export default function TechnicianCard({ technician, setCurrentTechnician }: {
    technician: TechnicianResponse,
    setCurrentTechnician?: (technician: TechnicianResponse) => void
}) {
    // const navigate = useNavigate();
    
    const getInitials = () => {
        const all = technician.fullname.split(" ");
        const name = all[0].charAt(0);
        const last = all.pop()?.charAt(0);
        return `${name}${last}`.toUpperCase();
    }
    
    const renderStars = () => {
        const roundedRating = Math.floor(technician.rating);
        const stars = [];
        
        for (let i = 1; i <= 5; i++) {
            if (i <= roundedRating) {
                stars.push(
                    <Star 
                        key={i} 
                        className="w-4 h-4 fill-orange-500 text-orange-500" 
                    />
                );
            } else {
                stars.push(
                    <Star 
                        key={i} 
                        className="w-4 h-4 text-orange-500" 
                    />
                );
            }
        }
        
        return stars;
    }
    
    const renderServices = () => {
        const maxServices = 3;
        const servicesToShow = technician.services.slice(0, maxServices);
        const extraServices = technician.services.length - maxServices;
        return (
            <div className="flex flex-wrap gap-1">
                {servicesToShow.map((service, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                        {service}
                    </Badge>
                ))}
                {extraServices > 0 && (
                    <Badge variant="secondary" className="text-xs">
                        +{extraServices}
                    </Badge>
                )}
            </div>
        );
    }
    
    return (
        <Card className="min-w-80 min-h-110 max-w-86 max-h-110">
            <CardHeader className="pb-4">
                {/* Status badges at top left */}
                <div className="flex gap-2 mb-4">
                    <Badge 
                        variant={technician.is_verified ? "default" : "secondary"}
                        className="flex items-center gap-1"
                    >
                        <BadgeCheckIcon className="w-4 h-4" />
                        {technician.is_verified ? "Verified" : "Unverified"}
                    </Badge>
                    <Badge 
                        variant={technician.is_available ? "default" : "destructive"}
                    >
                        {technician.is_available ? "Available" : "Unavailable"}
                    </Badge>
                </div>
                
                {/* Avatar centered */}
                <div className="flex justify-center mb-4">
                    <Avatar className="w-22 h-22">
                        <AvatarFallback className="text-lg font-bold">
                            {getInitials()}
                        </AvatarFallback>
                    </Avatar>
                </div>
                
                {/* Technician name */}
                <CardTitle className="text-center text-lg font-bold">
                    {technician.fullname}
                </CardTitle>
                
                {/* Location */}
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="font-bold text-sm">
                        {technician.location.location_name}
                    </span>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0">
                {/* Rating with stars */}
                <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="flex gap-1">
                        {renderStars()}
                    </div>
                    <span className="text-sm font-medium">
                        {technician.rating.toFixed(1)}
                    </span>
                </div>
                
                {/* Services */}
                <div className="w-full flex items-center justify-center">
                    <div className="mb-4">
                        {renderServices()}
                    </div>
                </div>
                
                <Separator />
            </CardContent>
            
            <CardFooter className="">
                <Button 
                    className="w-full cursor-pointer" 
                    onClick={setCurrentTechnician ? () => setCurrentTechnician(technician) : undefined}
                >
                    View Profile
                </Button>
            </CardFooter>
        </Card>
    );
}
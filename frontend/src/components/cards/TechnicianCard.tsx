"use client"
import type { TechnicianResponse } from "@/lib/types/technician";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { 
    BadgeCheckIcon, 
    MapPinIcon, 
    Star, 
    Clock,
    Calendar,
    Phone,
    Mail,
    Award,
    Zap,
    Heart,
    Eye,
    ChevronRight,
    Shield,
    Timer
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function TechnicianCard({ 
    technician, 
    setCurrentTechnician,
    showFavoriteButton = false,
    onFavoriteToggle
}: {
    technician: TechnicianResponse,
    setCurrentTechnician?: (technician: TechnicianResponse) => void,
    showFavoriteButton?: boolean,
    onFavoriteToggle?: (technicianId: string) => void
}) {
    const [isHovered, setIsHovered] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    
    const getInitials = () => {
        const words = technician.fullname.trim().split(" ");
        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }
        return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
    }
    
    const renderStars = () => {
        const fullStars = Math.floor(technician.rating);
        const hasHalfStar = technician.rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        return (
            <div className="flex items-center gap-1">
                {/* Full stars */}
                {[...Array(fullStars)].map((_, i) => (
                    <Star key={`full-${i}`} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                {/* Half star */}
                {hasHalfStar && (
                    <div className="relative">
                        <Star className="w-4 h-4 text-gray-300" />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        </div>
                    </div>
                )}
                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
                ))}
            </div>
        );
    }
    
    const renderServices = () => {
        const maxServices = 2;
        const servicesToShow = technician.services.slice(0, maxServices);
        const extraServices = technician.services.length - maxServices;
        
        return (
            <div className="flex flex-wrap gap-1.5">
                {servicesToShow.map((service, index) => (
                    <Badge 
                        key={index} 
                        variant="outline" 
                        className="text-xs px-2 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 text-blue-700 hover:from-blue-100 hover:to-indigo-100 transition-colors"
                    >
                        {service}
                    </Badge>
                ))}
                {extraServices > 0 && (
                    <Badge 
                        variant="secondary" 
                        className="text-xs px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                        +{extraServices} more
                    </Badge>
                )}
            </div>
        );
    }

    const getStatusColor = (isAvailable: boolean) => {
        return isAvailable 
            ? "bg-emerald-100 text-emerald-700 border-emerald-200" 
            : "bg-red-100 text-red-700 border-red-200";
    }

    const getVerificationIcon = () => {
        return technician.is_verified ? (
            <Shield className="w-3 h-3" />
        ) : (
            <Timer className="w-3 h-3" />
        );
    }

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorited(!isFavorited);
        onFavoriteToggle?.(technician.id);
    };

    const handleCardClick = () => {
        setCurrentTechnician?.(technician);
    };
    
    return (
        <Card 
            className={cn(
                "group relative min-w-80 max-w-86 cursor-pointer transition-all duration-300 ease-in-out",
                "hover:shadow-xl hover:-translate-y-2 hover:scale-[1.02]",
                "border-2 hover:border-blue-200",
                isHovered && "shadow-lg"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCardClick}
        >
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 rounded-lg" />
            
            {/* Favorite button */}
            {showFavoriteButton && (
                <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "absolute top-3 right-3 z-10 w-8 h-8 p-0 rounded-full",
                        "transition-all duration-200",
                        isFavorited ? "text-red-500 hover:text-red-600" : "text-gray-400 hover:text-red-500"
                    )}
                    onClick={handleFavoriteClick}
                >
                    <Heart className={cn("w-4 h-4", isFavorited && "fill-current")} />
                </Button>
            )}

            <CardHeader className="pb-3 relative">
                {/* Status badges */}
                <div className="flex gap-2 mb-3">
                    <Badge 
                        variant="outline" 
                        className={cn(
                            "flex items-center gap-1 text-xs px-2 py-1 font-medium",
                            technician.is_verified 
                                ? "bg-blue-100 text-blue-700 border-blue-200" 
                                : "bg-gray-100 text-gray-600 border-gray-200"
                        )}
                    >
                        {getVerificationIcon()}
                        {technician.is_verified ? "Verified Pro" : "Pending"}
                    </Badge>
                    <Badge 
                        variant="outline"
                        className={cn(
                            "flex items-center gap-1 text-xs px-2 py-1 font-medium",
                            getStatusColor(technician.is_available)
                        )}
                    >
                        <Clock className="w-3 h-3" />
                        {technician.is_available ? "Available Now" : "Busy"}
                    </Badge>
                </div>
                
                {/* Avatar with online indicator */}
                <div className="flex justify-center mb-3 relative">
                    <div className="relative">
                        <Avatar className="w-20 h-20 border-4 border-white shadow-md ring-2 ring-blue-100">
                            <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                {getInitials()}
                            </AvatarFallback>
                        </Avatar>
                        {/* Online status indicator */}
                        {technician.is_available && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                                <Zap className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Technician name */}
                <CardTitle className="text-center text-lg font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {technician.fullname}
                </CardTitle>
                
                {/* Location with enhanced styling */}
                <div className="flex items-center justify-center gap-1 text-muted-foreground">
                    <MapPinIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-sm text-gray-600">
                        {technician.location.location_name}
                    </span>
                </div>
            </CardHeader>
            
            <CardContent className="pt-0 pb-4 relative">
                {/* Rating with enhanced design */}
                <div className="flex items-center justify-center gap-2 mb-4 p-2 rounded-lg bg-amber-50 border border-amber-100">
                    {renderStars()}
                    <span className="text-sm font-bold text-amber-700">
                        {technician.rating.toFixed(1)}
                    </span>
                    <Award className="w-4 h-4 text-amber-600" />
                </div>
                
                {/* Services with better spacing */}
                <div className="mb-4">
                    <div className="text-xs font-medium text-gray-500 mb-2 text-center">
                        Specializes in:
                    </div>
                    <div className="flex justify-center">
                        {renderServices()}
                    </div>
                </div>
                
                {/* Quick contact info */}
                <div className="flex justify-center gap-6 text-xs text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        <span>Email</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Book</span>
                    </div>
                </div>
                
                <Separator className="my-3" />
            </CardContent>
            
            <CardFooter className="pt-0 relative">
                <Button 
                    className={cn(
                        "w-full group-hover:bg-blue-600 group-hover:shadow-md transition-all duration-200",
                        "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    )}
                    onClick={handleCardClick}
                >
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Profile
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
            </CardFooter>

            {/* Hover effect overlay */}
            <div 
                className={cn(
                    "absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent rounded-lg pointer-events-none transition-opacity duration-300",
                    isHovered ? "opacity-100" : "opacity-0"
                )}
            />
        </Card>
    );
}
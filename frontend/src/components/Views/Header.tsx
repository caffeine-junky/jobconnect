import * as authService from "@/lib/services/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import {
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

export default function Header({fullname}: {fullname?: string}) {
    const navigate = useNavigate();
    const getInitials = () => {
        if (!fullname) return "G";
        
        const words = fullname.trim().split(/\s+/);
        
        if (words.length === 1) {
            // Single name - take first two characters
            return words[0].substring(0, 2).toUpperCase();
        } else {
            // Multiple names - take first letter of first and last name
            return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
        }
    };

    const handleLogout = () => {
        authService.logout();
        navigate("/")
    };

    return (
        <header className="flex items-center justify-between w-full min-h-[60px] p-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-sky-400 bg-clip-text text-transparent">
                JobConnect
            </h2>
            <div className="flex items-center gap-3">
                <p className="text-lg font-medium text-gray-700">
                    Welcome, {fullname || "Guest"}!
                </p>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost" 
                            className="cursor-pointer rounded-full p-0 w-10 h-10"
                        >
                            <Avatar className="w-10 h-10">
                                <AvatarFallback className="text-sm font-semibold">
                                    {getInitials()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem 
                            onClick={handleLogout}
                            className="cursor-pointer font-semibold text-red-600 focus:text-red-600"
                        >
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
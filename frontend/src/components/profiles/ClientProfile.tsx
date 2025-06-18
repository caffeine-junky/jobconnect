import { useState } from "react";
import * as clientService from "@/lib/services/client";
import type { ClientResponse, ClientUpdate } from "@/lib/types/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function ClientProfile({client}: {client: ClientResponse}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fullname, setFullname] = useState<string>(client.fullname);
    const [email, setEmail] = useState<string>(client.email);
    const [phone, setPhone] = useState<string>(client.phone);
    const [location, setLocation] = useState<{
        location_name: string;
        latitude: number;
        longitude: number;
    }>(client.location);
    const [password, setPassword] = useState<string>("");

    const updateClient = async () => {
        try {
            setIsLoading(true);
            const updateData: ClientUpdate = {
                fullname: fullname,
                email: email,
                phone: phone,
                location: location,
                password: password
            }
            await clientService.updateClient(client.id, updateData);
            toast.success("Updated successfully");
            setPassword(""); // Clear password field after successful update
        } catch (error) {
            toast.warning("Could not update client details: " + error);
        }
        setIsLoading(false);
    }

    const handleLocationNameChange = (value: string) => {
        setLocation(prev => ({
            ...prev,
            location_name: value
        }));
    }

    const handleLatitudeChange = (value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setLocation(prev => ({
                ...prev,
                latitude: numValue
            }));
        }
    }

    const handleLongitudeChange = (value: string) => {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
            setLocation(prev => ({
                ...prev,
                longitude: numValue
            }));
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Client Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col gap-2">
                {/* Personal Information */}
                <div className="space-y-4 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                    
                    <div className="space-y-2">
                        <Label htmlFor="fullname">Full Name</Label>
                        <Input
                            id="fullname"
                            type="text"
                            value={fullname}
                            onChange={(e) => setFullname(e.target.value)}
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="space-y-2 flex flex-col gap-4">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                        />
                    </div>
                </div>

                <Separator />

                {/* Location Information */}
                <div className="space-y-4 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Location Information</h3>
                    
                    <div className="space-y-2">
                        <Label htmlFor="location-name">Location Name</Label>
                        <Input
                            id="location-name"
                            type="text"
                            value={location.location_name}
                            onChange={(e) => handleLocationNameChange(e.target.value)}
                            placeholder="Enter location name"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input
                                id="latitude"
                                type="number"
                                step="any"
                                value={location.latitude}
                                onChange={(e) => handleLatitudeChange(e.target.value)}
                                placeholder="Enter latitude"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input
                                id="longitude"
                                type="number"
                                step="any"
                                value={location.longitude}
                                onChange={(e) => handleLongitudeChange(e.target.value)}
                                placeholder="Enter longitude"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                {/* Security */}
                <div className="space-y-4 flex flex-col gap-4">
                    <h3 className="text-lg font-semibold">Security</h3>
                    
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password (optional)</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password to change"
                        />
                        <p className="text-sm text-muted-foreground">
                            Leave empty if you don't want to change your password
                        </p>
                    </div>
                </div>
            </CardContent>

            <CardFooter>
                <Button 
                    onClick={updateClient} 
                    disabled={isLoading}
                    className="w-full"
                >
                    {isLoading ? "Updating..." : "Update Profile"}
                </Button>
            </CardFooter>
        </Card>
    );
}
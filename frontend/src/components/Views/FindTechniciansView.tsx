import { useState, useEffect } from "react";
import * as searchService from "@/lib/services/search";
import type { ClientResponse } from "@/lib/types/client";
import type { TechnicianResponse } from "@/lib/types/technician";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Loader2, MapPin, Filter, Search } from "lucide-react";

import TechnicianCard from "@/components/cards/TechnicianCard";

type SortOption = "rating" | "distance" | "name" | "availability";
type FilterState = {
    availableOnly: boolean;
    verifiedOnly: boolean;
    minRating: number;
    services: string[];
    searchQuery: string;
};

export default function FindTechniciansView({client}: {client?: ClientResponse}) {
    const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);
    const [filteredTechnicians, setFilteredTechnicians] = useState<TechnicianResponse[]>([]);
    const [radiusKM, setRadiusKM] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>("rating");
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [availableServices, setAvailableServices] = useState<string[]>([]);
    
    const [filters, setFilters] = useState<FilterState>({
        availableOnly: false,
        verifiedOnly: false,
        minRating: 0,
        services: [],
        searchQuery: ""
    });

    const fetchTechnicians = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            if (!client) {
                setError("Client information is required to search for technicians");
                return;
            }
            
            const technicianData = await searchService.searchNearbyTechnicians(
                client.id,
                radiusKM
            );
            
            setTechnicians(technicianData);
            
            // Extract unique services for filter options
            const services = new Set<string>();
            technicianData.forEach(tech => {
                tech.services.forEach(service => services.add(service));
            });
            setAvailableServices(Array.from(services));
            
        } catch (error) {
            console.error("Error fetching technicians:", error);
            setError(error instanceof Error ? error.message : "Failed to fetch technicians");
        } finally {
            setIsLoading(false);
        }
    };

    // Filter and sort technicians
    useEffect(() => {
        let filtered = [...technicians];

        // Apply filters
        if (filters.availableOnly) {
            filtered = filtered.filter(tech => tech.is_available);
        }

        if (filters.verifiedOnly) {
            filtered = filtered.filter(tech => tech.is_verified);
        }

        if (filters.minRating > 0) {
            filtered = filtered.filter(tech => tech.rating >= filters.minRating);
        }

        if (filters.services.length > 0) {
            filtered = filtered.filter(tech => 
                filters.services.some(service => tech.services.includes(service))
            );
        }

        if (filters.searchQuery.trim()) {
            const query = filters.searchQuery.toLowerCase();
            filtered = filtered.filter(tech => 
                tech.fullname.toLowerCase().includes(query) ||
                tech.location.location_name.toLowerCase().includes(query) ||
                tech.services.some(service => service.toLowerCase().includes(query))
            );
        }

        // Apply sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "rating":
                    return b.rating - a.rating;
                case "name":
                    return a.fullname.localeCompare(b.fullname);
                case "availability":
                    if (a.is_available && !b.is_available) return -1;
                    if (!a.is_available && b.is_available) return 1;
                    return 0;
                case "distance":
                    // For now, sort by location name. You could implement actual distance calculation
                    return a.location.location_name.localeCompare(b.location.location_name);
                default:
                    return 0;
            }
        });

        setFilteredTechnicians(filtered);
    }, [technicians, filters, sortBy]);

    useEffect(() => {
        fetchTechnicians();
    }, [client, radiusKM]);

    const handleServiceToggle = (service: string) => {
        setFilters(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const clearFilters = () => {
        setFilters({
            availableOnly: false,
            verifiedOnly: false,
            minRating: 0,
            services: [],
            searchQuery: ""
        });
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Find Technicians</h2>
                <p className="text-gray-600">Search for qualified technicians in your area.</p>
            </div>

            {/* Search and Controls */}
            <div className="mb-6 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                        placeholder="Search by name, location, or service..."
                        value={filters.searchQuery}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                        className="pl-10"
                    />
                </div>

                {/* Radius and Controls */}
                <div className="flex flex-wrap gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <Label htmlFor="radius">Radius (km):</Label>
                        <Input
                            id="radius"
                            type="number"
                            value={radiusKM}
                            onChange={(e) => setRadiusKM(Number(e.target.value))}
                            className="w-20"
                            min="1"
                            max="50"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Label htmlFor="sort">Sort by:</Label>
                        <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                            <SelectTrigger className="w-40">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="rating">Rating</SelectItem>
                                <SelectItem value="distance">Distance</SelectItem>
                                <SelectItem value="name">Name</SelectItem>
                                <SelectItem value="availability">Availability</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        {(filters.availableOnly || filters.verifiedOnly || filters.minRating > 0 || filters.services.length > 0) && (
                            <Badge variant="secondary" className="ml-1">
                                {[filters.availableOnly, filters.verifiedOnly, filters.minRating > 0, filters.services.length > 0].filter(Boolean).length}
                            </Badge>
                        )}
                    </Button>
                </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mb-6 p-4 border rounded-lg bg-gray-50 space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Filters</h3>
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            Clear All
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Availability Filters */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Availability</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="available"
                                    checked={filters.availableOnly}
                                    onCheckedChange={(checked) => 
                                        setFilters(prev => ({ ...prev, availableOnly: !!checked }))
                                    }
                                />
                                <Label htmlFor="available" className="text-sm">Available now</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="verified"
                                    checked={filters.verifiedOnly}
                                    onCheckedChange={(checked) => 
                                        setFilters(prev => ({ ...prev, verifiedOnly: !!checked }))
                                    }
                                />
                                <Label htmlFor="verified" className="text-sm">Verified only</Label>
                            </div>
                        </div>

                        {/* Rating Filter */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">Minimum Rating: {filters.minRating}</Label>
                            <Slider
                                value={[filters.minRating]}
                                onValueChange={(value) => 
                                    setFilters(prev => ({ ...prev, minRating: value[0] }))
                                }
                                max={5}
                                min={0}
                                step={0.5}
                                className="w-full"
                            />
                        </div>

                        {/* Services Filter */}
                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-sm font-medium">Services</Label>
                            <div className="flex flex-wrap gap-2">
                                {availableServices.map(service => (
                                    <Badge
                                        key={service}
                                        variant={filters.services.includes(service) ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => handleServiceToggle(service)}
                                    >
                                        {service}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Results */}
            {error && (
                <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isLoading && (
                <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Searching for technicians...</span>
                </div>
            )}

            {!isLoading && !error && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Found {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''} 
                            within {radiusKM}km
                        </p>
                    </div>

                    {filteredTechnicians.length === 0 ? (
                        <div className="text-center py-12">
                            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600">No technicians found matching your criteria.</p>
                            <Button variant="outline" className="mt-2" onClick={clearFilters}>
                                Clear Filters
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTechnicians.map(technician => (
                                <TechnicianCard 
                                    key={technician.id} 
                                    technician={technician}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
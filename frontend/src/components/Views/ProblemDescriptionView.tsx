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
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, MapPin, Filter, Search, MessageSquare, FileText } from "lucide-react";

import TechnicianCard from "@/components/cards/TechnicianCard";

type SortOption = "rating" | "distance" | "name" | "availability";
type FilterState = {
    availableOnly: boolean;
    verifiedOnly: boolean;
    minRating: number;
    services: string[];
    searchQuery: string;
};

export default function DescribeProblemView({client}: {client?: ClientResponse}) {
    const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);
    const [filteredTechnicians, setFilteredTechnicians] = useState<TechnicianResponse[]>([]);
    const [radiusKM, setRadiusKM] = useState<number>(10);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<SortOption>("rating");
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [availableServices, setAvailableServices] = useState<string[]>([]);
    const [problemDescription, setProblemDescription] = useState<string>("");
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [hasSearched, setHasSearched] = useState<boolean>(false);
    
    const [filters, setFilters] = useState<FilterState>({
        availableOnly: false,
        verifiedOnly: false,
        minRating: 0,
        services: [],
        searchQuery: ""
    });

    const searchTechniciansByProblem = async (description: string) => {
        try {
            setIsLoading(true);
            setError(null);
            
            if (!client) {
                setError("Client information is required to search for technicians");
                return;
            }

            if (!description.trim()) {
                setError("Please provide a problem description");
                return;
            }
            
            const technicianData = await searchService.searchTechniciansByDescription(
                client.id,
                radiusKM,
                description.trim()
            );
            
            setTechnicians(technicianData);
            setHasSearched(true);
            
            // Extract unique services for filter options
            const services = new Set<string>();
            technicianData.forEach(tech => {
                tech.services.forEach(service => services.add(service));
            });
            setAvailableServices(Array.from(services));
            
        } catch (error) {
            console.error("Error searching technicians by problem:", error);
            setError(error instanceof Error ? error.message : "Failed to find technicians for your problem");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDescribeSubmit = () => {
        if (problemDescription.trim()) {
            searchTechniciansByProblem(problemDescription);
            setDialogOpen(false);
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
                    return a.location.location_name.localeCompare(b.location.location_name);
                default:
                    return 0;
            }
        });

        setFilteredTechnicians(filtered);
    }, [technicians, filters, sortBy]);

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

    const resetSearch = () => {
        setTechnicians([]);
        setFilteredTechnicians([]);
        setProblemDescription("");
        setHasSearched(false);
        setError(null);
        clearFilters();
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Describe Your Problem</h2>
                <p className="text-gray-600">Tell us about your issue and we'll find the right technicians to help you.</p>
            </div>

            {/* Describe Problem Section */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="flex items-center gap-2" size="lg">
                                <MessageSquare className="h-5 w-5" />
                                Describe Your Problem
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Describe Your Problem</DialogTitle>
                                <DialogDescription>
                                    Please provide a detailed description of the issue you're facing. 
                                    This will help us find the most suitable technicians for your needs.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="problem-description">Problem Description</Label>
                                    <Textarea
                                        id="problem-description"
                                        placeholder="e.g., My laptop won't turn on, the screen is black and there are no lights or sounds when I press the power button. It was working fine yesterday..."
                                        value={problemDescription}
                                        onChange={(e) => setProblemDescription(e.target.value)}
                                        rows={6}
                                        className="mt-2"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Be as specific as possible - include symptoms, when it started, and what you've already tried.
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label htmlFor="radius-dialog">Search Radius (km):</Label>
                                    <Input
                                        id="radius-dialog"
                                        type="number"
                                        value={radiusKM}
                                        onChange={(e) => setRadiusKM(Number(e.target.value))}
                                        className="w-20"
                                        min="1"
                                        max="50"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button 
                                    onClick={handleDescribeSubmit}
                                    disabled={!problemDescription.trim()}
                                >
                                    Find Technicians
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {problemDescription && (
                        <div className="flex-1 min-w-0">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start gap-2">
                                    <FileText className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="min-w-0">
                                        <h4 className="font-medium text-blue-900 mb-1">Your Problem:</h4>
                                        <p className="text-sm text-blue-800 break-words">{problemDescription}</p>
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            onClick={resetSearch}
                                            className="mt-2 text-blue-600 hover:text-blue-800"
                                        >
                                            Change Description
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Search and Controls - Only show after search */}
            {hasSearched && (
                <div className="mb-6 space-y-4">
                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Further filter by name, location, or service..."
                            value={filters.searchQuery}
                            onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
                            className="pl-10"
                        />
                    </div>

                    {/* Sort and Filter Controls */}
                    <div className="flex flex-wrap gap-4 items-center">
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
            )}

            {/* Filters Panel */}
            {hasSearched && showFilters && (
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
                    <span className="ml-2">Finding technicians for your problem...</span>
                </div>
            )}

            {!isLoading && !error && hasSearched && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Found {filteredTechnicians.length} technician{filteredTechnicians.length !== 1 ? 's' : ''} 
                            who can help with your problem
                        </p>
                    </div>

                    {filteredTechnicians.length === 0 ? (
                        <div className="text-center py-12">
                            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-600 mb-2">No technicians found for your specific problem.</p>
                            <p className="text-sm text-gray-500 mb-4">Try describing your problem differently or expanding your search radius.</p>
                            <div className="flex gap-2 justify-center">
                                <Button variant="outline" onClick={() => setDialogOpen(true)}>
                                    Modify Description
                                </Button>
                                <Button variant="outline" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </div>
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

            {/* Initial State - No search performed */}
            {!hasSearched && !isLoading && (
                <div className="text-center py-12">
                    <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to find help?</h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        Click the "Describe Your Problem" button above to tell us what you need help with, 
                        and we'll find the perfect technicians for your specific issue.
                    </p>
                </div>
            )}
        </div>
    );
}
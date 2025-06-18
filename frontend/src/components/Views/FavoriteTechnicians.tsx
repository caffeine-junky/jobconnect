import * as clientService from "@/lib/services/client";
import type { TechnicianResponse } from "@/lib/types/technician";
import TechnicianCard from "../cards/TechnicianCard";
import type { ClientResponse } from "@/lib/types/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

// Lucide icons
import { 
    Search, 
    Filter, 
    SortAsc, 
    SortDesc, 
    Star, 
    MapPin, 
    User, 
    Heart,
    X,
    CheckCircle,
    Clock
} from "lucide-react";

type SortOption = 'name-asc' | 'name-desc' | 'rating-asc' | 'rating-desc' | 'location-asc' | 'location-desc';
type FilterOption = 'all' | 'available' | 'verified' | 'unavailable';

export default function FavoriteTechniciansView({client, setTechnician}: {client: ClientResponse, setTechnician: (t: TechnicianResponse) => void}) {
    const [technicians, setTechnicians] = useState<TechnicianResponse[]>([]);
    const [filteredTechnicians, setFilteredTechnicians] = useState<TechnicianResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Filter and sort states
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState<SortOption>('name-asc');
    const [filterBy, setFilterBy] = useState<FilterOption>('all');
    const [serviceFilter, setServiceFilter] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    // Get all unique services from technicians
    const allServices = Array.from(
        new Set(technicians.flatMap(tech => tech.services))
    ).sort();

    useEffect(() => {
        const fetchTechnicians = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const technicianData = await clientService.readallFavoriteTechnicians(client.id);
                setTechnicians(technicianData);
            } catch (error) {
                console.error('Failed to fetch favorite technicians:', error);
                setError('Failed to load favorite technicians. Please try again.');
                toast.error('Failed to load favorite technicians');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTechnicians();
    }, [client.id]);

    // Apply filters and sorting
    useEffect(() => {
        let filtered = [...technicians];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(tech =>
                tech.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tech.location.location_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tech.services.some(service => 
                    service.toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        // Status filter
        if (filterBy !== 'all') {
            filtered = filtered.filter(tech => {
                switch (filterBy) {
                    case 'available':
                        return tech.is_available;
                    case 'unavailable':
                        return !tech.is_available;
                    case 'verified':
                        return tech.is_verified;
                    default:
                        return true;
                }
            });
        }

        // Service filter
        if (serviceFilter !== 'all') {
            filtered = filtered.filter(tech =>
                tech.services.includes(serviceFilter)
            );
        }

        // Sorting
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'name-asc':
                    return a.fullname.localeCompare(b.fullname);
                case 'name-desc':
                    return b.fullname.localeCompare(a.fullname);
                case 'rating-asc':
                    return a.rating - b.rating;
                case 'rating-desc':
                    return b.rating - a.rating;
                case 'location-asc':
                    return a.location.location_name.localeCompare(b.location.location_name);
                case 'location-desc':
                    return b.location.location_name.localeCompare(a.location.location_name);
                default:
                    return 0;
            }
        });

        setFilteredTechnicians(filtered);
    }, [technicians, searchQuery, sortBy, filterBy, serviceFilter]);

    const clearFilters = () => {
        setSearchQuery('');
        setSortBy('name-asc');
        setFilterBy('all');
        setServiceFilter('all');
    };

    const renderFilterSection = () => (
        <Card className="mb-6">
            <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters & Search
                    </CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        {showFilters ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
                    </Button>
                </div>
            </CardHeader>
            
            {showFilters && (
                <CardContent className="space-y-4">
                    {/* Search */}
                    <div className="space-y-2">
                        <Label htmlFor="search">Search</Label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="search"
                                placeholder="Search by name, location, or service..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Sort */}
                        <div className="space-y-2">
                            <Label>Sort By</Label>
                            <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="name-asc">
                                        <div className="flex items-center gap-2">
                                            <SortAsc className="w-4 h-4" />
                                            Name A-Z
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="name-desc">
                                        <div className="flex items-center gap-2">
                                            <SortDesc className="w-4 h-4" />
                                            Name Z-A
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="rating-desc">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4" />
                                            Highest Rating
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="rating-asc">
                                        <div className="flex items-center gap-2">
                                            <Star className="w-4 h-4" />
                                            Lowest Rating
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="location-asc">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Location A-Z
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="location-desc">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            Location Z-A
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Status Filter */}
                        <div className="space-y-2">
                            <Label>Status</Label>
                            <Select value={filterBy} onValueChange={(value: FilterOption) => setFilterBy(value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="available">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-green-600" />
                                            Available
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="unavailable">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-red-600" />
                                            Unavailable
                                        </div>
                                    </SelectItem>
                                    <SelectItem value="verified">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-4 h-4 text-blue-600" />
                                            Verified
                                        </div>
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Service Filter */}
                        <div className="space-y-2">
                            <Label>Service</Label>
                            <Select value={serviceFilter} onValueChange={setServiceFilter}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Services</SelectItem>
                                    {allServices.map((service) => (
                                        <SelectItem key={service} value={service}>
                                            {service}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Clear Filters */}
                    <div className="flex justify-end">
                        <Button variant="outline" onClick={clearFilters} size="sm">
                            <X className="w-4 h-4 mr-2" />
                            Clear Filters
                        </Button>
                    </div>

                    {/* Active Filters Display */}
                    {(searchQuery || filterBy !== 'all' || serviceFilter !== 'all' || sortBy !== 'name-asc') && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t">
                            <span className="text-sm text-gray-600">Active filters:</span>
                            {searchQuery && (
                                <Badge variant="secondary">
                                    Search: {searchQuery}
                                </Badge>
                            )}
                            {filterBy !== 'all' && (
                                <Badge variant="secondary">
                                    Status: {filterBy}
                                </Badge>
                            )}
                            {serviceFilter !== 'all' && (
                                <Badge variant="secondary">
                                    Service: {serviceFilter}
                                </Badge>
                            )}
                            {sortBy !== 'name-asc' && (
                                <Badge variant="secondary">
                                    Sort: {sortBy.replace('-', ' ')}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );

    const renderLoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
                <Card key={index}>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-4 w-full" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    const renderEmptyState = () => (
        <Card className="text-center py-12">
            <CardContent>
                <Heart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Favorite Technicians</h3>
                <p className="text-gray-600 mb-4">
                    You haven't added any technicians to your favorites yet.
                </p>
                <p className="text-sm text-gray-500">
                    Browse technicians and add them to favorites to see them here.
                </p>
            </CardContent>
        </Card>
    );

    const renderNoResults = () => (
        <Card className="text-center py-12">
            <CardContent>
                <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                <p className="text-gray-600 mb-4">
                    No technicians match your current search and filter criteria.
                </p>
                <Button variant="outline" onClick={clearFilters}>
                    <X className="w-4 h-4 mr-2" />
                    Clear Filters
                </Button>
            </CardContent>
        </Card>
    );

    const renderErrorState = () => (
        <Card className="text-center py-12">
            <CardContent>
                <div className="text-red-500 mb-4">
                    <X className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Favorites</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </CardContent>
        </Card>
    );

    return (
        <div className="container mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Favorite Technicians
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isLoading ? 'Loading...' : `${filteredTechnicians.length} of ${technicians.length} technicians`}
                    </p>
                </div>
            </div>

            {/* Filters */}
            {!isLoading && !error && technicians.length > 0 && renderFilterSection()}

            {/* Content */}
            {isLoading && renderLoadingSkeleton()}
            
            {error && renderErrorState()}
            
            {!isLoading && !error && technicians.length === 0 && renderEmptyState()}
            
            {!isLoading && !error && technicians.length > 0 && filteredTechnicians.length === 0 && renderNoResults()}
            
            {!isLoading && !error && filteredTechnicians.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTechnicians.map((technician) => (
                        <TechnicianCard 
                            key={technician.id} 
                            technician={technician}
                            setCurrentTechnician={setTechnician}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
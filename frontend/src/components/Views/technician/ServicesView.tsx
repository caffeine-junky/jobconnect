import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import * as serviceService from "@/lib/services/service";
import * as technicianServiceService from "@/lib/services/technician_service";
import type { ServiceResponse } from "@/lib/types/service";
import type { TechnicianResponse } from "@/lib/types/technician";
import type { TechnicianServiceResponse } from "@/lib/types/technician_service";

import { 
    CircleX, 
    Plus, 
    Search, 
    Wrench, 
    Calendar,
    CheckCircle,
    AlertCircle,
    Loader2
} from "lucide-react";

import { useState, useEffect } from "react"

interface ServicesViewProps {
    technician: TechnicianResponse
}

interface ServiceChipProps {
    technicianService: TechnicianServiceResponse;
    service: ServiceResponse;
    onRemove: (id: string) => void;
    isRemoving: boolean;
}

function ServiceChip({ technicianService, service, onRemove, isRemoving }: ServiceChipProps) {
    console.table(technicianService)
    return (
        <Card className="relative group hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                            {service.name}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {service.description}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-green-600">
                                <span className="font-medium">
                                    R{technicianService.price.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-blue-600">
                                <Calendar className="w-4 h-4" />
                                <span>{technicianService.experience_years} yrs exp</span>
                            </div>
                        </div>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => onRemove(technicianService.id)}
                        disabled={isRemoving}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                        {isRemoving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <CircleX className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

interface AddServiceModalProps {
    service: ServiceResponse;
    onAdd: (serviceId: string, price: number, experienceYears: number) => void;
    isAdding: boolean;
}

function AddServiceCard({ service, onAdd, isAdding }: AddServiceModalProps) {
    const [price, setPrice] = useState<string>('');
    const [experienceYears, setExperienceYears] = useState<string>('');
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(price);
        const expNum = parseInt(experienceYears);
        
        if (priceNum <= 0) {
            toast.warning("Price must be greater than 0");
            return;
        }
        
        if (expNum < 0) {
            toast.warning("Your experience cannot be lower than zero");
            return;
        }

        onAdd(service.id, priceNum, expNum);
        setPrice('');
        setExperienceYears('');
        setShowForm(false);
    };

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                            {service.name}
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {service.description}
                        </p>
                    </div>
                    {!showForm && (
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowForm(true)}
                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                    )}
                </div>

                {showForm && (
                    <form onSubmit={handleSubmit} className="space-y-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <Label htmlFor={`price- R{service.id}`} className="text-xs text-gray-600">
                                    Price ( R)
                                </Label>
                                <Input
                                    id={`price- R{service.id}`}
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                    className="h-8"
                                />
                            </div>
                            <div>
                                <Label htmlFor={`exp- R{service.id}`} className="text-xs text-gray-600">
                                    Experience (yrs)
                                </Label>
                                <Input
                                    id={`exp- R{service.id}`}
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={experienceYears}
                                    onChange={(e) => setExperienceYears(e.target.value)}
                                    required
                                    className="h-8"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                type="submit" 
                                size="sm" 
                                disabled={isAdding}
                                className="flex-1"
                            >
                                {isAdding ? (
                                    <>
                                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                        Adding...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Add Service
                                    </>
                                )}
                            </Button>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                    setShowForm(false);
                                    setPrice('');
                                    setExperienceYears('');
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

export default function ServicesView({ technician }: ServicesViewProps) {
    const [allServices, setAllServices] = useState<ServiceResponse[]>([]);
    const [technicianServices, setTechnicianServices] = useState<TechnicianServiceResponse[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
    const [addingIds, setAddingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [servicesData, technicianServicesData] = await Promise.all([
                    serviceService.readallServices(),
                    technicianServiceService.readallTechnicianServices(technician.id)
                ]);
                setAllServices(servicesData);
                setTechnicianServices(technicianServicesData);
            } catch (error) {
                toast.error("Failed to load services");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [technician.id]);

    const handleRemoveService = async (technicianServiceId: string) => {
        setRemovingIds(prev => new Set(prev).add(technicianServiceId));
        try {
            await technicianServiceService.deleteTechnicianService(technicianServiceId);
            setTechnicianServices(prev => 
                prev.filter(ts => ts.id !== technicianServiceId)
            );
            toast.success("Service removed");
        } catch (error) {
            toast.warning("Failed to remove service");
        } finally {
            setRemovingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(technicianServiceId);
                return newSet;
            });
        }
    };

    const handleAddService = async (serviceId: string, price: number, experienceYears: number) => {
        setAddingIds(prev => new Set(prev).add(serviceId));
        try {
            const newTechnicianService = await technicianServiceService.createTechnicianService({
                service_id: serviceId,
                technician_id: technician.id,
                price,
                experience_years: experienceYears
            });
            
            // Add the new technician service to the list
            setTechnicianServices(prev => [...prev, newTechnicianService]);
            
            toast.success("Service added successfully")
        } catch (error) {
            toast.error("Failed to add service")
        } finally {
            setAddingIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(serviceId);
                return newSet;
            });
        }
    };

    // Helper function to get service details by ID
    const getServiceById = (serviceId: string): ServiceResponse | undefined => {
        return allServices.find(service => service.id === serviceId);
    };

    // Filter technician services based on search term
    const filteredTechnicianServices = technicianServices.filter(ts => {
        const service = getServiceById(ts.service_id);
        return service && service.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Get available services (not already added by technician)
    const technicianServiceIds = new Set(technicianServices.map(ts => ts.service_id));
    const availableServices = allServices.filter(service => 
        !technicianServiceIds.has(service.id) &&
        service.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full p-8 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Manage Services</h2>
                <p className="text-gray-600 mb-6">
                    Add or remove services you offer to clients
                </p>
                
                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* My Services */}
            <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Wrench className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">My Services</h3>
                        <p className="text-gray-600 text-sm">
                            Services you currently offer ({technicianServices.length})
                        </p>
                    </div>
                </div>

                {filteredTechnicianServices.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchTerm ? 'No matching services found' : 'No services added yet'}
                            </h4>
                            <p className="text-gray-600 mb-4">
                                {searchTerm 
                                    ? 'Try adjusting your search terms'
                                    : 'Start by adding services from the available options below'
                                }
                            </p>
                            {searchTerm && (
                                <Button 
                                    variant="outline" 
                                    onClick={() => setSearchTerm('')}
                                >
                                    Clear Search
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTechnicianServices.map((technicianService) => {
                            const service = getServiceById(technicianService.service_id);
                            if (!service) return null; // Skip if service not found
                            
                            return (
                                <ServiceChip
                                    key={technicianService.id}
                                    technicianService={technicianService}
                                    service={service}
                                    onRemove={handleRemoveService}
                                    isRemoving={removingIds.has(technicianService.id)}
                                />
                            );
                        })}
                    </div>
                )}
            </div>

            <Separator className="my-8" />

            {/* Available Services */}
            <div>
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Plus className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Available Services</h3>
                        <p className="text-gray-600 text-sm">
                            Add new services to expand your offerings ({availableServices.length} available)
                        </p>
                    </div>
                </div>

                {availableServices.length === 0 ? (
                    <Card>
                        <CardContent className="p-8 text-center">
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                {searchTerm ? 'No matching services found' : 'All services added!'}
                            </h4>
                            <p className="text-gray-600">
                                {searchTerm 
                                    ? 'Try different search terms or clear the search'
                                    : 'You have already added all available services'
                                }
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {availableServices.map((service) => (
                            <AddServiceCard
                                key={service.id}
                                service={service}
                                onAdd={handleAddService}
                                isAdding={addingIds.has(service.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}